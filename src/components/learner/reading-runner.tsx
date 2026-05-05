"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Volume2, Loader2, Heart, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ReadingParagraph {
  /** Chinese text */
  cn: string;
  /** Translation in user's locale (typically Thai) */
  tr?: string;
  /** Pinyin gloss for one-tap audio (optional) */
  pinyin?: string;
}

export interface ReadingExercise {
  id: string;
  type: string;
  prompt: { question?: string; questionText?: string };
  options: Array<{ value: string; label: string }>;
  answer: { value: unknown };
  maxScore: number;
}

interface Props {
  courseCode: string;
  lessonCode: string;
  title: string;
  titleTr?: string;
  paragraphs: ReadingParagraph[];
  exercises: ReadingExercise[];
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
  dailyMissionsCompleted?: boolean;
}

const MAX_HEARTS = 5;

function newSessionKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

export function ReadingRunner({
  courseCode,
  lessonCode,
  title,
  titleTr,
  paragraphs,
  exercises,
}: Props) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "th";

  const sessionKey = useRef(newSessionKey());
  const startRef = useRef(Date.now());
  const completedRef = useRef(false);
  const allCorrectRef = useRef(true);

  // phase: read → quiz → done
  const [phase, setPhase] = useState<"read" | "quiz" | "done">("read");
  const [paraIdx, setParaIdx] = useState(0);
  const [showTr, setShowTr] = useState(true);

  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SessionResult | null>(null);

  // ─── Empty state — paragraphs not yet populated ────────────────────────────
  if (paragraphs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-2 py-12 text-center">
        <div className="text-6xl">📝</div>
        <h2 className="text-lg font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          เนื้อหากำลังจะมาเร็วๆ นี้
        </h2>
        <p className="max-w-sm text-sm" style={{ color: "var(--aiai-gray-500)" }}>
          {title || "บทเรียนนี้"} ยังไม่ได้นำเข้าเนื้อหา
        </p>
        <p className="max-w-sm text-xs" style={{ color: "var(--aiai-gray-400)" }}>
          ผู้สอนสามารถเพิ่มเนื้อหาผ่านสคริปต์ <code>populate-reading.ts</code> ได้
        </p>
      </div>
    );
  }

  // ─── Phase 1: Reading ───────────────────────────────────────────────────────
  if (phase === "read") {
    const para = paragraphs[paraIdx];
    if (!para) return null;
    const isLast = paraIdx === paragraphs.length - 1;
    return (
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--aiai-green-700)" }}>
          <BookOpen className="size-3.5" />
          <span className="font-semibold uppercase tracking-widest">短文 · READING</span>
        </div>

        <header className="text-center">
          <h2 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
            {title}
          </h2>
          {titleTr && (
            <p className="mt-0.5 text-xs" style={{ color: "var(--aiai-gray-500)" }}>
              {titleTr}
            </p>
          )}
        </header>

        {/* Paragraph progress dots */}
        <div className="flex justify-center gap-1.5">
          {paragraphs.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === paraIdx ? 24 : 6,
                background:
                  i <= paraIdx ? "var(--aiai-green-400)" : "var(--aiai-gray-200)",
              }}
            />
          ))}
        </div>

        {/* Paragraph card */}
        <AnimatePresence mode="wait">
          <motion.article
            key={paraIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-2xl border-2 bg-white p-5 shadow-sm"
            style={{ borderColor: "var(--aiai-green-100)" }}
          >
            {/* Audio play */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-mono" style={{ color: "var(--aiai-gray-400)" }}>
                {paraIdx + 1} / {paragraphs.length}
              </span>
              <button
                type="button"
                onClick={() => speak(para.cn)}
                className="flex size-10 items-center justify-center rounded-full shadow-sm transition-transform active:scale-95"
                style={{ background: "var(--aiai-green-400)", color: "#fff" }}
                aria-label="play paragraph"
              >
                <Volume2 className="size-5" />
              </button>
            </div>

            <p
              className="leading-loose"
              style={{ color: "var(--aiai-gray-800)", fontSize: 18 }}
            >
              {para.cn}
            </p>

            {showTr && para.tr && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl border-l-4 px-3 py-2 text-sm leading-relaxed"
                style={{
                  borderColor: "var(--aiai-green-300)",
                  background: "var(--aiai-green-50)",
                  color: "var(--aiai-gray-700)",
                }}
              >
                {para.tr}
              </motion.p>
            )}
          </motion.article>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowTr((v) => !v)}
            className="text-xs underline"
            style={{ color: "var(--aiai-green-700)" }}
          >
            {showTr ? "ซ่อนคำแปล / 隱藏翻譯" : "แสดงคำแปล / 顯示翻譯"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            disabled={paraIdx === 0}
            onClick={() => setParaIdx((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft className="size-4" /> ก่อนหน้า
          </Button>
          {isLast ? (
            <Button
              style={{ background: "var(--aiai-green-400)" }}
              onClick={() => {
                if (exercises.length === 0) {
                  void completeSession(0, true);
                } else {
                  setPhase("quiz");
                  startRef.current = Date.now();
                }
              }}
            >
              {exercises.length === 0 ? "เสร็จสิ้น" : "เริ่มทำแบบฝึกหัด"} →
            </Button>
          ) : (
            <Button
              style={{ background: "var(--aiai-green-400)" }}
              onClick={() => setParaIdx((i) => i + 1)}
            >
              ถัดไป <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── Phase 2: Quiz ──────────────────────────────────────────────────────────
  const current = exercises[qIdx];

  function pickAnswer(value: string) {
    if (picked !== null || submitting || !current) return;
    setPicked(value);
    const correct = value === current.answer.value;
    const ts = Math.max(0, Math.round((Date.now() - startRef.current) / 1000));
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setScore((s) => s + current.maxScore);
    } else {
      allCorrectRef.current = false;
      setHearts((h) => Math.max(0, h - 1));
    }

    void fetch("/api/learn/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: current.id,
        exerciseType: current.type,
        sessionKey: sessionKey.current,
        questionData: current.prompt,
        userAnswer: { value },
        isCorrect: correct,
        score: correct ? current.maxScore : 0,
        timeSpentSec: ts,
        windowBlurCount: 0,
      }),
    }).catch(() => {});

    const delay = correct ? 700 : 1300;
    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      const newHearts = correct ? hearts : Math.max(0, hearts - 1);
      const nextIdx = qIdx + 1;
      if (!correct && newHearts === 0) {
        void completeSession(score + (correct ? current.maxScore : 0), correct);
      } else if (nextIdx >= exercises.length) {
        void completeSession(score + (correct ? current.maxScore : 0), correct);
      } else {
        setQIdx(nextIdx);
      }
    }, delay);
  }

  async function completeSession(finalScore: number, lastWasCorrect: boolean) {
    if (completedRef.current) return;
    completedRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/learn/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey: sessionKey.current,
          totalScore: finalScore,
          totalXp: finalScore,
          allCorrect: allCorrectRef.current && lastWasCorrect,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as SessionResult;
        setResult(data);
      }
      setPhase("done");
    } catch {
      toast.error("ส่งคะแนนไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "done" && result) {
    const passed = hearts > 0 && score > 0;
    return (
      <div className="flex flex-col items-center gap-5 px-2 py-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-7xl">
          {passed ? "🎉" : "💪"}
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
            {passed ? "เก่งมาก!" : "ลองใหม่นะ"}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--aiai-gray-500)" }}>
            {Math.floor(score / 10)} / {exercises.length} ข้อถูก · +{result.awardedXp} XP
          </p>
        </div>
        {result.dailyMissionsCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="rounded-2xl border-2 px-4 py-2 text-sm font-bold"
            style={{ borderColor: "#fbbf24", color: "#92400e", background: "#fef3c7" }}
          >
            🌟 ภารกิจวันนี้ครบแล้ว! +25 XP
          </motion.div>
        )}
        <Button
          className="w-full py-5"
          style={{ background: "var(--aiai-green-400)" }}
          onClick={() => router.push(`/${locale}/learn/${courseCode}`)}
        >
          กลับไปหน้าคอร์ส
        </Button>
      </div>
    );
  }

  if (!current) return null;
  const progress = Math.round((qIdx / exercises.length) * 100);

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              className="size-5"
              style={{
                color: i < hearts ? "#ef4444" : "var(--aiai-gray-200)",
                fill: i < hearts ? "#ef4444" : "var(--aiai-gray-200)",
              }}
            />
          ))}
        </div>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--aiai-green-400)" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums" style={{ color: "var(--aiai-gray-500)" }}>
          {qIdx + 1}/{exercises.length}
        </span>
      </div>

      <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--aiai-green-600)" }}>
        คำถามจากบทอ่าน · COMPREHENSION
      </p>

      <p className="rounded-xl px-4 py-3 text-center text-base font-medium" style={{ background: "var(--aiai-green-50)", color: "var(--aiai-gray-800)" }}>
        {current.prompt.question ?? current.prompt.questionText ?? "?"}
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {current.options.map((opt) => {
          const isPicked = picked === opt.value;
          const isCorrect = opt.value === current.answer.value;
          const showResult = picked !== null;
          let borderColor = "var(--aiai-gray-200)";
          let bg = "#FFFFFF";
          let textColor = "var(--aiai-gray-800)";
          if (showResult) {
            if (isCorrect) { borderColor = "#22c55e"; bg = "#f0fdf4"; textColor = "#15803d"; }
            else if (isPicked) { borderColor = "#ef4444"; bg = "#fef2f2"; textColor = "#b91c1c"; }
          }
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => pickAnswer(opt.value)}
              disabled={picked !== null}
              className={cn(
                "min-h-[3.5rem] rounded-2xl border-2 px-4 py-3 text-left text-base font-medium transition-all active:scale-[0.99]",
                showResult && !isCorrect && !isPicked && "opacity-50",
              )}
              style={{ borderColor, background: bg, color: textColor }}
            >
              {showResult && isCorrect && <Check className="mb-0.5 mr-1 inline size-4" />}
              {showResult && isPicked && !isCorrect && <X className="mb-0.5 mr-1 inline size-4" />}
              {opt.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4"
            style={{
              background: feedback === "correct" ? "#dcfce7" : "#fee2e2",
              borderTop: `3px solid ${feedback === "correct" ? "#22c55e" : "#ef4444"}`,
            }}
          >
            <div className="mx-auto flex max-w-lg items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: feedback === "correct" ? "#22c55e" : "#ef4444", color: "#fff" }}
              >
                {feedback === "correct" ? <Check className="size-5" /> : <X className="size-5" />}
              </div>
              <p className="font-bold" style={{ color: feedback === "correct" ? "#15803d" : "#b91c1c" }}>
                {feedback === "correct" ? "ถูกต้อง! 🎉" : "ผิด ลองใหม่นะ"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {submitting && (
        <div className="flex justify-center" style={{ color: "var(--aiai-gray-400)" }}>
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
