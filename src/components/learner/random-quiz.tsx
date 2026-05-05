"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Volume2, Loader2, Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuizQuestion {
  id: string;
  type: string;
  prompt: {
    audioText?: string;
    sentenceWithBlank?: string;
    questionText?: string;
    hanzi?: string;
    pinyin?: string;
    target?: string;
    symbol?: string;
  };
  options: Array<{ value: string | number; label?: string }>;
  answer: { value: unknown };
  maxScore: number;
}

const MAX_HEARTS = 3;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

function newSessionKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function RandomQuiz({ questions }: { questions: QuizQuestion[] }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "th";

  const sessionKey = useRef(newSessionKey());
  const startRef = useRef(Date.now());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalXp, setFinalXp] = useState(0);

  const current = questions[idx];

  // Auto-play TTS for listen-fill on entering
  useEffect(() => {
    startRef.current = Date.now();
    if (current?.type === "LISTEN_FILL" && current.prompt.audioText) {
      const t = setTimeout(() => speak(current.prompt.audioText!), 400);
      return () => clearTimeout(t);
    }
  }, [current]);

  function pickAnswer(value: string | number) {
    if (picked !== null || done || !current) return;
    const q = current;
    setPicked(value);
    const correct = value === q.answer.value;
    const ts = Math.max(0, Math.round((Date.now() - startRef.current) / 1000));
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setScore((s) => s + q.maxScore);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }

    void fetch("/api/learn/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: q.id,
        exerciseType: q.type,
        sessionKey: sessionKey.current,
        questionData: q.prompt,
        userAnswer: { value },
        isCorrect: correct,
        score: correct ? q.maxScore : 0,
        timeSpentSec: ts,
        windowBlurCount: 0,
      }),
    }).catch(() => {});

    const delay = correct ? 700 : 1200;
    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      const newHearts = correct ? hearts : Math.max(0, hearts - 1);
      const nextIdx = idx + 1;
      if (!correct && newHearts === 0) {
        finalize(score + (correct ? q.maxScore : 0));
      } else if (nextIdx >= questions.length) {
        finalize(score + (correct ? q.maxScore : 0));
      } else {
        setIdx(nextIdx);
      }
    }, delay);
  }

  async function finalize(finalScore: number) {
    if (done) return;
    setDone(true);
    setSubmitting(true);
    try {
      const res = await fetch("/api/learn/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey: sessionKey.current,
          totalScore: finalScore,
          totalXp: finalScore,
          allCorrect: false, // random quiz never auto-promotes a level
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinalXp(data.awardedXp ?? finalScore);
      } else {
        setFinalXp(finalScore);
      }
    } catch {
      setFinalXp(finalScore);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    sessionKey.current = newSessionKey();
    setIdx(0);
    setPicked(null);
    setFeedback(null);
    setScore(0);
    setHearts(MAX_HEARTS);
    setDone(false);
    setFinalXp(0);
    startRef.current = Date.now();
  }

  // ─── Done screen ───────────────────────────────────────────────────────────
  if (done) {
    const passed = score > 0 && hearts > 0;
    return (
      <div className="flex flex-col items-center gap-5 px-2 py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="text-7xl"
        >
          {passed ? "🎉" : "💪"}
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
            {passed ? "เก่งมาก! / 太棒了!" : "ลองใหม่นะ / 再試一次"}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--aiai-gray-500)" }}>
            {Math.floor(score / 10)} / {questions.length} ข้อถูก · +{finalXp} XP
          </p>
        </div>
        {submitting && (
          <p className="text-xs" style={{ color: "var(--aiai-gray-400)" }}>
            กำลังบันทึก...
          </p>
        )}
        <div className="flex w-full flex-col gap-2">
          <Button
            className="w-full py-5"
            style={{ background: "var(--aiai-green-400)" }}
            onClick={reset}
          >
            <RotateCcw className="size-4" /> เล่นอีกครั้ง / 再玩一次
          </Button>
          <Button
            variant="outline"
            className="w-full py-5"
            onClick={() => router.push(`/${locale}/practice`)}
          >
            กลับ / 返回
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const progress = Math.round((idx / questions.length) * 100);
  const symbol =
    current.prompt.symbol ?? current.prompt.hanzi ?? current.prompt.target;

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Hearts + progress */}
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
          {idx + 1}/{questions.length}
        </span>
      </div>

      {/* LISTEN_FILL */}
      {current.type === "LISTEN_FILL" && current.prompt.audioText ? (
        <>
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--aiai-green-600)" }}
          >
            ฟังประโยคแล้วเติมคำที่หายไป
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => speak(current.prompt.audioText!)}
              className="flex size-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
              style={{ background: "var(--aiai-green-400)", color: "#fff" }}
              aria-label="play"
            >
              <Volume2 className="size-9" />
            </button>
          </div>
          {current.prompt.sentenceWithBlank && (
            <p
              className="text-center font-bold"
              style={{ color: "var(--aiai-gray-800)", fontSize: 28 }}
            >
              {current.prompt.sentenceWithBlank}
            </p>
          )}
        </>
      ) : (
        <>
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--aiai-green-600)" }}
          >
            เลือกคำแปลที่ถูกต้อง
          </p>
          {symbol && (
            <div className="text-center text-6xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
              {symbol}
            </div>
          )}
          {current.prompt.pinyin && (
            <p className="text-center text-lg" style={{ color: "var(--aiai-green-600)" }}>
              {current.prompt.pinyin}
            </p>
          )}
        </>
      )}

      {/* Options */}
      <div
        className={cn(
          "grid gap-3 mt-2",
          current.options.length <= 2 ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {current.options.map((opt) => {
          const isPicked = picked === opt.value;
          const isCorrect = opt.value === current.answer.value;
          const showResult = picked !== null;
          const label = opt.label ?? String(opt.value);
          let borderColor = "var(--aiai-gray-200)";
          let bg = "#FFFFFF";
          let textColor = "var(--aiai-gray-800)";
          if (showResult) {
            if (isCorrect) { borderColor = "#22c55e"; bg = "#f0fdf4"; textColor = "#15803d"; }
            else if (isPicked) { borderColor = "#ef4444"; bg = "#fef2f2"; textColor = "#b91c1c"; }
          }
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => pickAnswer(opt.value)}
              disabled={picked !== null}
              className={cn(
                "min-h-[3.5rem] rounded-2xl border-2 px-4 py-3 text-center text-base font-semibold shadow-sm transition-all active:scale-95",
                showResult && !isCorrect && !isPicked && "opacity-50",
              )}
              style={{ borderColor, background: bg, color: textColor }}
            >
              {showResult && isCorrect && <Check className="mb-0.5 mr-1 inline size-4" />}
              {showResult && isPicked && !isCorrect && <X className="mb-0.5 mr-1 inline size-4" />}
              {label}
            </button>
          );
        })}
      </div>

      {/* Bottom feedback */}
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
                style={{
                  background: feedback === "correct" ? "#22c55e" : "#ef4444",
                  color: "#fff",
                }}
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
