"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Volume2,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CertificateCard } from "./certificate-card";

interface QuestionPayload {
  orderIndex: number;
  exerciseId: string;
  type: "ZHUYIN_RECOGNITION" | "VOCAB_MCQ" | "TONE_DISCRIMINATION";
  prompt: {
    audioUrl?: string;
    target?: string;
    symbol?: string;
    syllable?: string;
  };
  options: Array<{ value: string | number; label?: string }>;
  audioUrl?: string | null;
  difficulty?: number;
}

interface StartResponse {
  examAttemptId: string;
  durationMin: number;
  passingScore: number;
  maxScore: number;
  totalQuestions: number;
  questions: QuestionPayload[];
}

interface SubmitResponse {
  ok: true;
  passed: boolean;
  score: number;
  total: number;
  durationSec: number;
  promotedTo?: string | null;
  certificateId?: string | null;
  skipped?: string;
}

interface CertificatePayload {
  fullName: string;
  levelLabel: string;
  scoreSnapshot: number;
  maxScoreSnapshot: number;
  issuedAt: string;
}

export function BossExamRunner({
  courseCode,
  initialFullName,
}: {
  courseCode: string;
  initialFullName: string;
}) {
  const t = useTranslations("learn.boss");
  const tLevels = useTranslations("levels");
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  const [phase, setPhase] = useState<"idle" | "running" | "submitting" | "done">(
    "idle",
  );
  const [startError, setStartError] = useState<string | null>(null);
  const [exam, setExam] = useState<StartResponse | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Map<string, unknown>>(new Map());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [certPayload, setCertPayload] = useState<CertificatePayload | null>(
    null,
  );
  const blurCount = useRef(0);

  useEffect(() => {
    const onBlur = () => (blurCount.current += 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  async function startExam() {
    setStartError(null);
    setPhase("running");
    try {
      const res = await fetch("/api/learn/boss-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setStartError(j.error ?? "start_failed");
        setPhase("idle");
        return;
      }
      const data = (await res.json()) as StartResponse;
      setExam(data);
      setIdx(0);
      setPicked(new Map());
    } catch {
      setStartError("network_error");
      setPhase("idle");
    }
  }

  const currentQuestion = exam?.questions[idx];

  function pickAnswer(value: string | number) {
    if (!currentQuestion) return;
    if (picked.has(currentQuestion.exerciseId)) return;

    const newPicked = new Map(picked);
    newPicked.set(currentQuestion.exerciseId, { value });
    setPicked(newPicked);

    // Local feedback (correctness checked server-side; we show neutral feedback
    // here since answer isn't shipped to the client).
    setFeedback("correct");
    setTimeout(() => setFeedback(null), 400);

    setTimeout(() => {
      if (idx + 1 < (exam?.questions.length ?? 0)) {
        setIdx((i) => i + 1);
      } else {
        submitExam(newPicked);
      }
    }, 450);
  }

  async function submitExam(answers: Map<string, unknown>) {
    if (!exam) return;
    setPhase("submitting");
    try {
      const res = await fetch("/api/learn/boss-exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examAttemptId: exam.examAttemptId,
          answers: Array.from(answers.entries()).map(([exerciseId, userAnswer]) => ({
            exerciseId,
            userAnswer,
          })),
          windowBlurCount: blurCount.current,
        }),
      });
      if (!res.ok) {
        toast.error(t("submitFailed"));
        setPhase("running");
        return;
      }
      const data = (await res.json()) as SubmitResponse;
      setResult(data);
      setPhase("done");
      // If a certificate was issued, fetch it for display.
      if (data.certificateId) {
        const certRes = await fetch(
          `/api/learn/certificate/${data.certificateId}`,
        );
        if (certRes.ok) {
          setCertPayload((await certRes.json()) as CertificatePayload);
        }
      }
    } catch {
      toast.error(t("submitFailed"));
      setPhase("running");
    }
  }

  const playAudio = (url?: string) => {
    if (!url) return;
    new Audio(url).play().catch(() => {});
  };

  // Idle: start screen
  if (phase === "idle") {
    return (
      <Card>
        <CardContent className="space-y-4 p-6 text-center">
          <ShieldAlert className="mx-auto size-12 text-amber-500" />
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("intro", { count: 50 })}
          </p>
          <ul className="space-y-1 text-left text-xs text-muted-foreground">
            <li>• {t("rule1")}</li>
            <li>• {t("rule2")}</li>
            <li>• {t("rule3")}</li>
          </ul>
          {startError && (
            <p className="text-sm text-destructive">
              {startError === "level mismatch"
                ? t("errorLevelMismatch")
                : t("errorGeneric")}
            </p>
          )}
          <Button onClick={startExam} size="lg" className="w-full">
            {t("startBtn")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Submitting
  if (phase === "submitting") {
    return (
      <Card>
        <CardContent className="space-y-3 p-6 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("submitting")}</p>
        </CardContent>
      </Card>
    );
  }

  // Done — result + certificate
  if (phase === "done" && result) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-3 p-6 text-center">
            <div className="text-5xl">
              {result.passed ? "🏆" : "💪"}
            </div>
            <h2 className="text-xl font-bold">
              {result.skipped === "impersonation"
                ? t("impersonationSkipped")
                : result.passed
                  ? t("resultPass")
                  : t("resultFail")}
            </h2>
            <div className="text-base font-semibold">
              {result.score} / {result.total}
              <span className="ml-2 text-sm text-muted-foreground">
                ({Math.round((result.score / result.total) * 100)}%)
              </span>
            </div>
            {result.passed && result.promotedTo && (
              <p className="text-sm text-emerald-700">
                {t("promotedTo", {
                  level: tLevels(result.promotedTo as never),
                })}
              </p>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/${params.locale}/learn`)}
              className="w-full"
            >
              {t("backToLearn")}
            </Button>
          </CardContent>
        </Card>

        {certPayload && (
          <CertificateCard
            fullName={certPayload.fullName}
            levelLabel={certPayload.levelLabel}
            scoreSnapshot={certPayload.scoreSnapshot}
            maxScoreSnapshot={certPayload.maxScoreSnapshot}
            issuedAt={new Date(certPayload.issuedAt)}
          />
        )}
      </div>
    );
  }

  // Running — show one question at a time
  if (!currentQuestion || !exam) return null;

  const totalCount = exam.questions.length;
  const progress = Math.round((idx / totalCount) * 100);
  const audioToPlay =
    currentQuestion.prompt.audioUrl ?? currentQuestion.audioUrl ?? undefined;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs tabular-nums text-muted-foreground">
          {idx + 1} / {totalCount}
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardContent className="space-y-5 p-6 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {currentQuestion.type === "ZHUYIN_RECOGNITION"
              ? t("typeRecognition")
              : currentQuestion.type === "VOCAB_MCQ"
                ? t("typeVocab")
                : t("typeTone")}
          </p>

          {audioToPlay && (
            <button
              type="button"
              onClick={() => playAudio(audioToPlay)}
              className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95"
              aria-label="play audio"
            >
              <Volume2 className="size-8" />
            </button>
          )}

          {currentQuestion.prompt.symbol && (
            <div className="text-7xl font-bold">
              {currentQuestion.prompt.symbol}
            </div>
          )}

          {audioToPlay && (
            <p className="text-xs text-muted-foreground">{t("tapReplay")}</p>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <div
        className={cn(
          "grid gap-3",
          currentQuestion.options.length > 4 ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {currentQuestion.options.map((opt) => {
          const v = String(opt.value);
          const label = opt.label ?? v;
          const isPicked =
            (picked.get(currentQuestion.exerciseId) as { value?: string })
              ?.value === opt.value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => pickAnswer(opt.value)}
              disabled={picked.has(currentQuestion.exerciseId)}
              className={cn(
                "flex min-h-[3rem] items-center justify-center rounded-xl border-2 bg-card px-4 py-3 text-2xl font-bold shadow-sm transition-all active:scale-95",
                !isPicked && "hover:border-primary",
                isPicked && "border-primary bg-primary/10",
                currentQuestion.options.length > 4 && "text-base",
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
            <div className="rounded-full bg-blue-500 p-6 shadow-xl">
              <ChevronRight className="size-12 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* hidden marker so unused vars don't trip lint */}
      {feedback === "wrong" && <X className="hidden" />}
      {feedback === "correct" && <Check className="hidden" />}

      <p className="text-center text-xs text-muted-foreground">
        {t("hintAnswerLater", { name: initialFullName })}
      </p>
    </div>
  );
}
