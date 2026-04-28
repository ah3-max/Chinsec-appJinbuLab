"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  BookOpen,
  MessageCircle,
  Pencil,
  Mic,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VocabularyCard } from "./vocabulary-card";
import { SentenceCard } from "./sentence-card";
import { LevelUpModal } from "@/components/learner/level-up-modal";

export interface ScenarioVocabPayload {
  id: string;
  hanzi: string;
  zhuyin: string;
  pinyin: string;
  thaiMeaning: string;
  englishMeaning?: string;
  audioUrl?: string;
  audioSlowUrl?: string;
  isEldercareVocab?: boolean;
  mtcReference?: { book: string; lesson: string };
}

export interface ScenarioDialogueLine {
  speaker: string;
  speakerLabel?: { "zh-TW"?: string; th?: string; vi?: string; id?: string };
  hanzi: string;
  pinyin: string;
  translationI18n: { th?: string; vi?: string; id?: string; en?: string };
  audioUrl: string;
  orderIndex: number;
}

export interface ScenarioExercisePayload {
  id: string;
  type:
    | "VOCAB_MCQ"
    | "VOCAB_LISTEN_CHOOSE"
    | "VOCAB_MCQ_REVERSE"
    | "GRAMMAR_FILL"
    | "GRAMMAR_ARRANGE"
    | "LISTEN_DIALOGUE_MCQ"
    | "SPEAK_REPEAT"
    | "WRITE_HANZI"
    | string;
  prompt: Record<string, unknown>;
  options: Array<{ value: string | number }>;
  answer: { value: unknown };
  audioUrl?: string;
  maxScore: number;
  explanationI18n?: Record<string, string>;
}

export interface ScenarioPayload {
  code: string;
  title: string;
  level: string;
  hookHtml?: string;
  hookStory: string;
  estimatedMinutes: number;
  mtcAlignmentLabel?: string;
  vocabularies: ScenarioVocabPayload[];
  dialogue: ScenarioDialogueLine[];
  exercises: ScenarioExercisePayload[];
}

type Stage = "hook" | "vocab" | "dialogue" | "practice";

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

export function ScenarioRunner({
  scenario,
  uiLanguage,
}: {
  scenario: ScenarioPayload;
  uiLanguage: string;
}) {
  const t = useTranslations("learn.scenario");
  const tLevels = useTranslations("levels");
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  const [stage, setStage] = useState<Stage>("hook");
  const [completed, setCompleted] = useState<Set<Stage>>(new Set());

  function markDone(s: Stage) {
    setCompleted((prev) => new Set(prev).add(s));
  }

  const stages: Array<{ id: Stage; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
    { id: "hook", label: t("stageHook"), Icon: Sparkles },
    { id: "vocab", label: t("stageVocab"), Icon: BookOpen },
    { id: "dialogue", label: t("stageDialogue"), Icon: MessageCircle },
    { id: "practice", label: t("stagePractice"), Icon: Pencil },
  ];

  return (
    <div className="space-y-4">
      {/* Stage tabs */}
      <div className="flex gap-1.5 overflow-x-auto rounded-lg bg-muted/40 p-1">
        {stages.map((s) => {
          const isActive = stage === s.id;
          const isDone = completed.has(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStage(s.id)}
              className={cn(
                "flex flex-1 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-muted-foreground hover:bg-muted",
              )}
            >
              <s.Icon className="size-3.5" />
              <span className="truncate">{s.label}</span>
              {isDone && <Check className="size-3" />}
            </button>
          );
        })}
      </div>

      {/* Stage content */}
      {stage === "hook" && (
        <HookStage
          scenario={scenario}
          onContinue={() => {
            markDone("hook");
            setStage("vocab");
          }}
        />
      )}
      {stage === "vocab" && (
        <VocabStage
          scenario={scenario}
          uiLanguage={uiLanguage}
          onContinue={() => {
            markDone("vocab");
            setStage("dialogue");
          }}
        />
      )}
      {stage === "dialogue" && (
        <DialogueStage
          scenario={scenario}
          uiLanguage={uiLanguage}
          onContinue={() => {
            markDone("dialogue");
            setStage("practice");
          }}
        />
      )}
      {stage === "practice" && (
        <PracticeStage
          scenario={scenario}
          tLevels={tLevels}
          onComplete={() => markDone("practice")}
          onBackToLearn={() => router.push(`/${params.locale}/learn`)}
        />
      )}
    </div>
  );
}

// ── Hook stage ────────────────────────────────────────────────────────────────
function HookStage({
  scenario,
  onContinue,
}: {
  scenario: ScenarioPayload;
  onContinue: () => void;
}) {
  const t = useTranslations("learn.scenario");
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4 text-sm leading-relaxed">
          <p className="font-medium text-foreground">{scenario.hookStory}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("estMin", { minutes: scenario.estimatedMinutes })}</span>
          {scenario.mtcAlignmentLabel && (
            <span className="rounded bg-muted px-1.5 py-0.5">
              {scenario.mtcAlignmentLabel}
            </span>
          )}
        </div>
        <Button onClick={onContinue} size="lg" className="w-full">
          {t("startVocab")}
          <ChevronRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Vocab stage (swipeable cards) ─────────────────────────────────────────────
function VocabStage({
  scenario,
  uiLanguage,
  onContinue,
}: {
  scenario: ScenarioPayload;
  uiLanguage: string;
  onContinue: () => void;
}) {
  const t = useTranslations("learn.scenario");
  const [idx, setIdx] = useState(0);
  const total = scenario.vocabularies.length;

  if (total === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          {t("noVocab")}
        </CardContent>
      </Card>
    );
  }

  const v = scenario.vocabularies[idx]!;
  const isLast = idx === total - 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>
        <span className="tabular-nums">{idx + 1} / {total}</span>
      </div>

      <VocabularyCard
        vocabularyId={v.id}
        hanzi={v.hanzi}
        zhuyin={v.zhuyin}
        pinyin={v.pinyin}
        thaiMeaning={v.thaiMeaning}
        englishMeaning={v.englishMeaning}
        audioUrl={v.audioUrl}
        audioSlowUrl={v.audioSlowUrl}
        size="large"
        uiLanguage={uiLanguage}
      />

      {(v.isEldercareVocab || v.mtcReference) && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
          {v.mtcReference && (
            <span className="rounded bg-muted px-1.5 py-0.5">
              {t("mtcLabel", {
                book: v.mtcReference.book,
                lesson: v.mtcReference.lesson,
              })}
            </span>
          )}
          {v.isEldercareVocab && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">
              {t("eldercareLabel")}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="size-4" />
          {t("prev")}
        </Button>
        {!isLast ? (
          <Button className="flex-1" onClick={() => setIdx((i) => i + 1)}>
            {t("next")}
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button className="flex-1" onClick={onContinue}>
            {t("startDialogue")}
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Dialogue stage ────────────────────────────────────────────────────────────
function DialogueStage({
  scenario,
  uiLanguage,
  onContinue,
}: {
  scenario: ScenarioPayload;
  uiLanguage: string;
  onContinue: () => void;
}) {
  const t = useTranslations("learn.scenario");
  const playAll = useRef(false);

  if (scenario.dialogue.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          {t("noDialogue")}
        </CardContent>
      </Card>
    );
  }

  async function playSequentially() {
    if (playAll.current) return;
    playAll.current = true;
    for (const line of scenario.dialogue) {
      try {
        await playLine(line.audioUrl);
      } catch {
        /* ignore */
      }
    }
    playAll.current = false;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{t("dialogueIntro")}</p>
        <button
          type="button"
          onClick={playSequentially}
          className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs hover:bg-muted"
        >
          <Volume2 className="size-3" />
          {t("playAll")}
        </button>
      </div>

      <div className="space-y-2">
        {scenario.dialogue.map((line) => {
          const isLearner = line.speaker === "learner";
          const speakerLabel =
            line.speakerLabel?.[uiLanguage as "th" | "vi" | "id" | "zh-TW"] ??
            line.speakerLabel?.["zh-TW"] ??
            line.speaker;
          return (
            <SentenceCard
              key={`${line.orderIndex}`}
              sentenceId={`${scenario.code}:${line.orderIndex}`}
              hanzi={line.hanzi}
              pinyin={line.pinyin}
              thaiTranslation={
                line.translationI18n.th ??
                line.translationI18n.en ??
                line.hanzi
              }
              audioUrl={line.audioUrl}
              speaker={speakerLabel}
              uiLanguage={uiLanguage}
              variant={isLearner ? "speaker-right" : "speaker-left"}
            />
          );
        })}
      </div>

      <Button onClick={onContinue} size="lg" className="w-full">
        {t("startPractice")}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function playLine(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.addEventListener("ended", () => resolve());
    audio.addEventListener("error", () => reject());
    audio.play().catch((err) => reject(err));
  });
}

// ── Practice stage ────────────────────────────────────────────────────────────
function PracticeStage({
  scenario,
  tLevels,
  onComplete,
  onBackToLearn,
}: {
  scenario: ScenarioPayload;
  tLevels: ReturnType<typeof useTranslations>;
  onComplete: () => void;
  onBackToLearn: () => void;
}) {
  const t = useTranslations("learn.scenario");

  const exercises = scenario.exercises.filter(
    (e) => !(e.prompt as { notSupported?: boolean }).notSupported,
  );
  const skippedCount = scenario.exercises.length - exercises.length;

  const [sessionKey, setSessionKey] = useState(() => newSessionKey());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<unknown | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [arrangeOrder, setArrangeOrder] = useState<Array<string | number>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const startRef = useRef<number>(Date.now());
  const blurCount = useRef(0);
  const allCorrectRef = useRef(true);
  const completedRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
    setPicked(null);
    setArrangeOrder([]);
  }, [idx]);

  useEffect(() => {
    const onBlur = () => (blurCount.current += 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          {t("noPractice")}
        </CardContent>
      </Card>
    );
  }

  if (result) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6 text-center">
          <div className="text-5xl">🎉</div>
          <h2 className="text-lg font-bold">{t("complete")}</h2>
          <div className="text-sm text-muted-foreground">
            {t("scoreLabel")} {score} / {exercises.length * 10}
          </div>
          {result.skipped === "impersonation" ? (
            <p className="text-sm text-muted-foreground">
              {t("impersonationSkipped")}
            </p>
          ) : result.suspicious ? (
            <p className="text-sm text-amber-700">{t("suspicious")}</p>
          ) : (
            <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-base font-semibold">+{result.awardedXp} XP</p>
              <p className="text-muted-foreground">
                {t("streak", { days: result.newStreak })}
              </p>
            </div>
          )}
          {skippedCount > 0 && (
            <p className="text-[11px] text-muted-foreground">
              {t("notSupportedHint", { count: skippedCount })}
            </p>
          )}
          <Button className="w-full" onClick={onBackToLearn}>
            {t("backToLearn")}
          </Button>
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

  const ex = exercises[idx]!;
  const total = exercises.length;

  function pickAndSubmit(value: unknown) {
    if (picked !== null || submitting) return;
    setPicked(value);
    const correct = isCorrectAnswer(value, ex.answer.value);
    const timeSpentSec = Math.max(
      0,
      Math.round((Date.now() - startRef.current) / 1000),
    );
    setFeedback(correct ? "correct" : "wrong");
    const award = correct ? ex.maxScore : 0;
    if (correct) setScore((s) => s + award);
    else allCorrectRef.current = false;

    void fetch("/api/learn/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: ex.id,
        exerciseType: ex.type,
        sessionKey,
        questionData: ex.prompt,
        userAnswer: { value },
        isCorrect: correct,
        score: award,
        timeSpentSec,
        windowBlurCount: blurCount.current,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      setArrangeOrder([]);
      const nextIdx = idx + 1;
      if (nextIdx >= total) {
        finishSession(score + award);
      } else {
        setIdx(nextIdx);
      }
    }, 700);
  }

  async function finishSession(finalScore: number) {
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
          totalXp: finalScore,
          allCorrect: allCorrectRef.current,
        }),
      });
      if (!res.ok) {
        toast.error(t("completeFailed"));
        return;
      }
      const data = (await res.json()) as SessionResult;
      setResult(data);
      onComplete();
      if (data.leveledUp) setShowLevelUp(true);
    } catch {
      toast.error(t("completeFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>
        <span className="tabular-nums">{idx + 1} / {total}</span>
      </div>

      <ExerciseQuestionCard
        exercise={ex}
        picked={picked}
        arrangeOrder={arrangeOrder}
        onPick={pickAndSubmit}
        onArrangeChange={setArrangeOrder}
      />

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
                "rounded-full p-7 shadow-xl",
                feedback === "correct" ? "bg-green-500" : "bg-red-500",
              )}
            >
              {feedback === "correct" ? (
                <Check className="size-16 text-white" />
              ) : (
                <X className="size-16 text-white" />
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

// Compares values (deep for arrays, strict for primitives).
function isCorrectAnswer(picked: unknown, answer: unknown): boolean {
  if (Array.isArray(answer) && Array.isArray(picked)) {
    if (picked.length !== answer.length) return false;
    return picked.every((p, i) => p === (answer as unknown[])[i]);
  }
  return picked === answer;
}

// ── Per-exercise rendering ────────────────────────────────────────────────────
function ExerciseQuestionCard({
  exercise,
  picked,
  arrangeOrder,
  onPick,
  onArrangeChange,
}: {
  exercise: ScenarioExercisePayload;
  picked: unknown | null;
  arrangeOrder: Array<string | number>;
  onPick: (v: unknown) => void;
  onArrangeChange: (order: Array<string | number>) => void;
}) {
  const t = useTranslations("learn.scenario");
  const audio = (exercise.prompt as { audioUrl?: string }).audioUrl ?? exercise.audioUrl;

  function playAudio() {
    if (!audio) return;
    new Audio(audio).play().catch(() => {});
  }

  const typeLabel = (() => {
    switch (exercise.type) {
      case "VOCAB_MCQ":
        return t("typeVocabMcq");
      case "VOCAB_LISTEN_CHOOSE":
        return t("typeVocabListenChoose");
      case "VOCAB_MCQ_REVERSE":
        return t("typeVocabReverse");
      case "GRAMMAR_FILL":
        return t("typeGrammarFill");
      case "GRAMMAR_ARRANGE":
        return t("typeGrammarArrange");
      case "LISTEN_DIALOGUE_MCQ":
        return t("typeListenDialogue");
      default:
        return exercise.type;
    }
  })();

  const promptHanzi = (exercise.prompt as { symbol?: string; hanzi?: string }).symbol ??
    (exercise.prompt as { hanzi?: string }).hanzi;
  const promptThai = (exercise.prompt as { thai?: string }).thai;
  const sentenceParts = (exercise.prompt as { sentenceParts?: string[] }).sentenceParts;
  const sentencePinyin = (exercise.prompt as { sentencePinyin?: string }).sentencePinyin;
  const promptTranslation = (exercise.prompt as { translationI18n?: { th?: string } }).translationI18n?.th;
  const dialogueQuestion = (exercise.prompt as { questionI18n?: { th?: string } }).questionI18n?.th;
  const arrangeWords = (exercise.prompt as { words?: string[] }).words;
  const arrangeTarget = (exercise.prompt as { targetTranslationI18n?: { th?: string } })
    .targetTranslationI18n?.th;

  if (exercise.type === "GRAMMAR_ARRANGE" && arrangeWords) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {typeLabel}
          </p>
          {arrangeTarget && (
            <p className="text-center text-sm text-muted-foreground">
              {arrangeTarget}
            </p>
          )}
          <div className="min-h-[3rem] rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-3 text-center text-lg font-semibold">
            {arrangeOrder.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {t("arrangeEmpty")}
              </span>
            ) : (
              arrangeOrder.join(" ")
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {arrangeWords.map((w, i) => {
              const used = arrangeOrder.includes(w as string);
              return (
                <button
                  key={`${w}-${i}`}
                  type="button"
                  disabled={used || picked !== null}
                  onClick={() => onArrangeChange([...arrangeOrder, w as string])}
                  className={cn(
                    "rounded-lg border-2 bg-card px-3 py-2 text-base font-semibold shadow-sm transition-all",
                    used && "opacity-30",
                    !used && picked === null && "hover:border-primary",
                  )}
                >
                  {w}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={arrangeOrder.length === 0 || picked !== null}
              onClick={() => onArrangeChange([])}
            >
              {t("arrangeReset")}
            </Button>
            <Button
              className="flex-1"
              disabled={arrangeOrder.length !== arrangeWords.length || picked !== null}
              onClick={() => onPick(arrangeOrder)}
            >
              {t("arrangeSubmit")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-5 text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {typeLabel}
        </p>

        {audio && (
          <button
            type="button"
            onClick={playAudio}
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95"
            aria-label={t("playAudio")}
          >
            <Volume2 className="size-7" />
          </button>
        )}

        {sentenceParts && (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">
              {sentenceParts.map((p, i) => (
                <span
                  key={i}
                  className={p === "___" ? "rounded bg-amber-100 px-2 text-amber-700" : ""}
                >
                  {p}
                </span>
              ))}
            </p>
            {sentencePinyin && (
              <p className="text-sm italic text-muted-foreground">
                {sentencePinyin}
              </p>
            )}
            {promptTranslation && (
              <p className="text-sm text-muted-foreground">{promptTranslation}</p>
            )}
          </div>
        )}

        {!sentenceParts && promptHanzi && (
          <div className="text-6xl font-bold">{promptHanzi}</div>
        )}

        {!sentenceParts && promptThai && (
          <div className="text-2xl font-semibold">{promptThai}</div>
        )}

        {dialogueQuestion && (
          <p className="text-sm text-muted-foreground">{dialogueQuestion}</p>
        )}
      </CardContent>

      <CardContent className="border-t p-5">
        <div
          className={cn(
            "grid gap-2",
            exercise.options.length > 4 ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {exercise.options.map((opt) => {
            const isPicked = picked === opt.value;
            const isCorrect = opt.value === exercise.answer.value;
            const showResult = picked !== null;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onPick(opt.value)}
                disabled={picked !== null}
                className={cn(
                  "rounded-xl border-2 bg-card px-3 py-3 text-base font-semibold shadow-sm transition-all active:scale-95",
                  !showResult && "hover:border-primary",
                  showResult && isCorrect && "border-green-500 bg-green-50 text-green-700",
                  showResult && isPicked && !isCorrect && "border-red-500 bg-red-50 text-red-700",
                  showResult && !isCorrect && !isPicked && "opacity-60",
                )}
              >
                {String(opt.value)}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// silence linter for unused icon imports
void Mic;
