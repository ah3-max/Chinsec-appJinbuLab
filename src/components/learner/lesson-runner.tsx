"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Volume2,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LevelUpModal } from "./level-up-modal";

export interface LessonExercise {
  id: string;
  type: "ZHUYIN_RECOGNITION" | "VOCAB_MCQ" | "TONE_DISCRIMINATION";
  prompt: {
    audioUrl?: string;
    target?: string;
    symbol?: string;
    syllable?: string;
  };
  options: Array<{ value: string | number; label?: string }>;
  answer: { value: unknown };
  audioUrl?: string | null;
  maxScore: number;
}

interface SessionResult {
  ok: true;
  awardedXp: number;
  newTotalXp: number;
  newStreak: number;
  leveledUp?: boolean;
  newLevel?: string;
  suspicious?: boolean;
  skipped?: string;
}

function newSessionKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function LessonRunner({
  courseCode,
  lessonCode,
  exercises,
  totalCount,
}: {
  courseCode: string;
  lessonCode: string;
  exercises: LessonExercise[];
  totalCount: number;
}) {
  const t = useTranslations("learn.lesson");
  const tLevels = useTranslations("levels");
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  const [sessionKey, setSessionKey] = useState(() => newSessionKey());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const startRef = useRef<number>(Date.now());
  const blurCount = useRef(0);
  const allCorrectRef = useRef(true);
  const completedRef = useRef(false);

  const current = exercises[idx];

  useEffect(() => {
    startRef.current = Date.now();
    if (current?.prompt.audioUrl ?? current?.audioUrl) {
      // Auto-play when question changes.
      const url = current?.prompt.audioUrl ?? current?.audioUrl ?? undefined;
      if (url) playAudio(url);
    }
  }, [current]);

  useEffect(() => {
    const onBlur = () => (blurCount.current += 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const progress = useMemo(
    () => Math.round((idx / Math.max(1, totalCount)) * 100),
    [idx, totalCount],
  );

  function playAudio(url: string) {
    new Audio(url).play().catch(() => {});
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6 text-center text-sm text-muted-foreground">
          {t("noExercises")}
        </CardContent>
      </Card>
    );
  }

  // Done state
  if (result) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6 text-center">
          <div className="text-6xl">🎉</div>
          <h2 className="text-xl font-bold">{t("complete")}</h2>
          <div className="text-sm text-muted-foreground">
            {t("scoreLabel")} {score} / {totalCount * (current?.maxScore ?? 10)}
          </div>

          {result.skipped === "impersonation" ? (
            <p className="text-sm text-muted-foreground">
              {t("impersonationSkipped")}
            </p>
          ) : result.suspicious ? (
            <p className="text-sm" style={{ color: "var(--aiai-orange-600)" }}>
              {t("suspicious")}
            </p>
          ) : (
            <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-base font-semibold">
                +{result.awardedXp} XP
              </p>
              <p className="text-muted-foreground">
                {t("streak", { days: result.newStreak })}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => router.push(`/${params.locale}/learn/${courseCode}`)}
            >
              {t("backToCourse")}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={resetLesson}
            >
              <RotateCcw className="size-4" />
              {t("retry")}
            </Button>
          </div>
        </CardContent>

        {showLevelUp && result.newLevel && (
          <LevelUpModal
            newLevelLabel={tLevels(result.newLevel as never)}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </Card>
    );
  }

  if (!current) return null;

  const audio = current.prompt.audioUrl ?? current.audioUrl ?? undefined;

  function pickAnswer(value: string | number) {
    if (picked !== null || submitting) return;
    setPicked(value);

    const correct = value === current!.answer.value;
    const timeSpentSec = Math.max(
      0,
      Math.round((Date.now() - startRef.current) / 1000),
    );
    setFeedback(correct ? "correct" : "wrong");
    const awardedScore = correct ? current!.maxScore : 0;
    if (correct) {
      setScore((s) => s + awardedScore);
    } else {
      allCorrectRef.current = false;
    }

    // Fire-and-forget per-attempt POST.
    void fetch("/api/learn/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: current!.id,
        exerciseType: current!.type,
        sessionKey,
        questionData: current!.prompt,
        userAnswer: { value },
        isCorrect: correct,
        score: awardedScore,
        timeSpentSec,
        windowBlurCount: blurCount.current,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      const nextIdx = idx + 1;
      if (nextIdx >= exercises.length) {
        completeSession(score + awardedScore, correct);
      } else {
        setIdx(nextIdx);
      }
    }, 700);
  }

  async function completeSession(
    finalScore: number,
    lastWasCorrect: boolean,
  ) {
    if (completedRef.current) return;
    completedRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/learn/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey,
          totalScore: finalScore,
          totalXp: finalScore, // 1 score point = 1 XP for now
          allCorrect: allCorrectRef.current && lastWasCorrect,
        }),
      });
      if (!res.ok) {
        toast.error(t("completeFailed"));
        return;
      }
      const data = (await res.json()) as SessionResult;
      setResult(data);
      if (data.leveledUp) setShowLevelUp(true);
    } catch {
      toast.error(t("completeFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetLesson() {
    setSessionKey(newSessionKey());
    setIdx(0);
    setPicked(null);
    setFeedback(null);
    setScore(0);
    setResult(null);
    setShowLevelUp(false);
    startRef.current = Date.now();
    blurCount.current = 0;
    allCorrectRef.current = true;
    completedRef.current = false;
  }

  return (
    <div className="space-y-4">
      {/* Header progress */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-mono">{lessonCode}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full transition-all"
            style={{ width: `${progress}%`, background: "var(--aiai-green-400)" }}
          />
        </div>
        <span className="tabular-nums">
          {idx + 1} / {exercises.length}
        </span>
      </div>

      {/* Question card */}
      <Card>
        <CardContent className="space-y-5 p-6 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {current.type === "ZHUYIN_RECOGNITION"
              ? t("typeRecognition")
              : current.type === "VOCAB_MCQ"
                ? t("typeVocab")
                : t("typeTone")}
          </p>

          {audio && (
            <button
              type="button"
              onClick={() => playAudio(audio)}
              className="mx-auto flex size-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
              style={{
                background: "var(--aiai-green-400)",
                color: "#FFFFFF",
              }}
              aria-label={t("playAudio")}
            >
              <Volume2 className="size-8" />
            </button>
          )}

          {current.prompt.symbol && (
            <div className="text-7xl font-bold">{current.prompt.symbol}</div>
          )}

          {audio && (
            <p className="text-xs text-muted-foreground">{t("tapReplay")}</p>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <div
        className={cn(
          "grid gap-3",
          current.options.length > 4 ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {current.options.map((opt) => {
          const isPicked = picked === opt.value;
          const isCorrect = opt.value === current.answer.value;
          const showResult = picked !== null;
          const label = opt.label ?? String(opt.value);
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => pickAnswer(opt.value)}
              disabled={picked !== null || submitting}
              className={cn(
                "flex min-h-[3rem] items-center justify-center rounded-xl border-2 bg-card px-4 py-3 text-2xl font-bold shadow-sm transition-all active:scale-95",
                !showResult && "hover:border-primary",
                showResult && isCorrect && "border-green-500 bg-green-50 text-green-700",
                showResult &&
                  isPicked &&
                  !isCorrect &&
                  "border-red-500 bg-red-50 text-red-700",
                showResult && !isCorrect && !isPicked && "opacity-60",
                current.options.length > 4 && "text-base",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className={cn(
                "rounded-full p-8 shadow-xl",
                feedback === "correct" ? "bg-green-500" : "bg-red-500",
              )}
            >
              {feedback === "correct" ? (
                <Check className="size-20 text-white" />
              ) : (
                <X className="size-20 text-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {submitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {t("submitting")}
        </div>
      )}
    </div>
  );
}
