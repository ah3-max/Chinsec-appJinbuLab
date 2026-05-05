"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Loader2,
  Check,
  X,
  Headphones,
  BookOpen,
  PenTool,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HandwritingCanvas,
  type HandwritingCanvasHandle,
} from "./handwriting-canvas";

export type ExamSection = "listening" | "reading" | "writing";

export interface WeeklyExamQuestion {
  id: string;
  prompt: {
    section: ExamSection;
    audioText?: string;     // for listening
    question?: string;      // shown after audio
    passage?: string;       // for reading
    targetCharacter?: string; // for writing
    instruction?: string;
  };
  options: Array<{ value: string; label: string }>;
  score: number;
}

export interface WeeklyExam {
  id: string;
  code: string;
  title: string;
  durationMin: number;
  passingScore: number;
  maxScore: number;
  questions: WeeklyExamQuestion[];
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

const SECTION_META: Record<
  ExamSection,
  { icon: typeof Headphones; label: string; thaiLabel: string; color: string }
> = {
  listening: { icon: Headphones, label: "聽力", thaiLabel: "หูฟัง", color: "#3b82f6" },
  reading:   { icon: BookOpen,   label: "閱讀", thaiLabel: "อ่าน",  color: "#8b5cf6" },
  writing:   { icon: PenTool,    label: "手寫", thaiLabel: "เขียน",  color: "#ef4444" },
};

export function WeeklyExamRunner({ exam }: { exam: WeeklyExam }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "th";

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value?: string; imageDataUrl?: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    maxScore: number;
    passed: boolean;
    breakdown: Record<ExamSection, { correct: number; total: number; score: number }>;
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMin * 60);

  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  const current = exam.questions[idx];
  const totalQ = exam.questions.length;

  // Group section info
  const sectionStarts = useMemo(() => {
    const starts: Partial<Record<ExamSection, number>> = {};
    exam.questions.forEach((q, i) => {
      if (starts[q.prompt.section] === undefined) starts[q.prompt.section] = i;
    });
    return starts;
  }, [exam.questions]);

  // Timer
  useEffect(() => {
    if (result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          submit(); // auto-submit when time's up
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // Auto-play audio when entering listening question
  useEffect(() => {
    if (current?.prompt.section === "listening" && current.prompt.audioText) {
      const t = setTimeout(() => speak(current.prompt.audioText!), 400);
      return () => clearTimeout(t);
    }
  }, [current]);

  function pickAnswer(value: string) {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: { value } }));
  }

  async function next() {
    if (!current) return;

    // Capture handwriting image before leaving the question
    if (current.prompt.section === "writing") {
      const dataUrl = canvasRef.current?.getDataUrl();
      if (!dataUrl) {
        // Allow advancing even if blank, just record empty
        setAnswers((a) => ({ ...a, [current.id]: { imageDataUrl: "" } }));
      } else {
        setAnswers((a) => ({ ...a, [current.id]: { imageDataUrl: dataUrl } }));
      }
      canvasRef.current?.clear();
    }

    if (idx === totalQ - 1) {
      await submit();
    } else {
      setIdx((i) => i + 1);
    }
  }

  async function submit() {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/weekly-exam/${exam.code}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, durationSec: exam.durationMin * 60 - secondsLeft }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("ส่งข้อสอบไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Result screen ───────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="flex flex-col items-center gap-5 px-2 py-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="text-7xl"
        >
          {result.passed ? "🏆" : "📚"}
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
            {result.passed ? "ผ่าน! / 通過!" : "ยังไม่ผ่าน / 再加油"}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--aiai-gray-500)" }}>
            {result.totalScore} / {result.maxScore} ({Math.round((result.totalScore / result.maxScore) * 100)}%)
          </p>
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          {(Object.keys(SECTION_META) as ExamSection[]).map((sec) => {
            const meta = SECTION_META[sec];
            const stat = result.breakdown[sec];
            if (!stat) return null;
            const Icon = meta.icon;
            return (
              <div
                key={sec}
                className="rounded-xl border-2 p-3"
                style={{ borderColor: meta.color, background: meta.color + "11" }}
              >
                <Icon className="mx-auto size-5" style={{ color: meta.color }} />
                <p className="mt-1 text-xs font-semibold" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="text-lg font-bold" style={{ color: meta.color }}>
                  {stat.correct}/{stat.total}
                </p>
                <p className="text-[10px]" style={{ color: meta.color }}>
                  {stat.score} 分
                </p>
              </div>
            );
          })}
        </div>

        <Button
          className="w-full py-6 text-base font-semibold"
          style={{ background: "var(--aiai-green-400)" }}
          onClick={() => router.push(`/${locale}/learn`)}
        >
          กลับหน้าหลัก
        </Button>
      </div>
    );
  }

  if (!current) return null;

  const sectionMeta = SECTION_META[current.prompt.section];
  const SectionIcon = sectionMeta.icon;
  const picked = answers[current.id]?.value;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Top bar: timer + progress */}
      <div className="flex items-center gap-3">
        <div
          className="rounded-full px-3 py-1 text-xs font-bold tabular-nums"
          style={{
            background: secondsLeft < 60 ? "#fee2e2" : "var(--aiai-gray-100)",
            color: secondsLeft < 60 ? "#b91c1c" : "var(--aiai-gray-600)",
          }}
        >
          ⏱ {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: sectionMeta.color }}
            animate={{ width: `${((idx + 1) / totalQ) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums" style={{ color: "var(--aiai-gray-500)" }}>
          {idx + 1}/{totalQ}
        </span>
      </div>

      {/* Section pill */}
      <div className="flex justify-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: sectionMeta.color + "18", color: sectionMeta.color }}
        >
          <SectionIcon className="size-3.5" />
          {sectionMeta.label} · {sectionMeta.thaiLabel}
        </span>
      </div>

      {/* Question content (per-section) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex flex-col gap-4"
        >
          {/* ─── LISTENING ──────────────────────────────────────────────── */}
          {current.prompt.section === "listening" && (
            <>
              <div
                className="flex flex-col items-center gap-3 rounded-2xl border p-6"
                style={{
                  borderColor: sectionMeta.color + "33",
                  background: sectionMeta.color + "08",
                }}
              >
                <button
                  type="button"
                  onClick={() => current.prompt.audioText && speak(current.prompt.audioText)}
                  className="flex size-16 items-center justify-center rounded-full shadow-md transition-transform active:scale-95"
                  style={{ background: sectionMeta.color, color: "#fff" }}
                  aria-label="play"
                >
                  <Volume2 className="size-7" />
                </button>
                <p className="text-xs" style={{ color: "var(--aiai-gray-500)" }}>
                  กดปุ่มเพื่อฟัง / 點擊播放
                </p>
              </div>
              {current.prompt.question && (
                <p className="text-center text-base font-medium" style={{ color: "var(--aiai-gray-800)" }}>
                  {current.prompt.question}
                </p>
              )}
            </>
          )}

          {/* ─── READING ───────────────────────────────────────────────── */}
          {current.prompt.section === "reading" && (
            <>
              <div
                className="rounded-2xl border-2 p-5 leading-loose"
                style={{
                  borderColor: sectionMeta.color + "33",
                  background: sectionMeta.color + "08",
                  fontSize: 22,
                  color: "var(--aiai-gray-800)",
                }}
              >
                {current.prompt.passage}
              </div>
              {current.prompt.question && (
                <p className="text-center text-base font-medium" style={{ color: "var(--aiai-gray-800)" }}>
                  {current.prompt.question}
                </p>
              )}
            </>
          )}

          {/* ─── WRITING ───────────────────────────────────────────────── */}
          {current.prompt.section === "writing" && (
            <>
              <p className="text-center text-base font-semibold" style={{ color: "var(--aiai-gray-800)" }}>
                {current.prompt.instruction}
              </p>
              <HandwritingCanvas
                ref={canvasRef}
                guide={current.prompt.targetCharacter}
                size={280}
              />
            </>
          )}

          {/* ─── MCQ options (listening + reading) ─────────────────────── */}
          {current.prompt.section !== "writing" && (
            <div className="grid grid-cols-1 gap-2">
              {current.options.map((opt) => {
                const isPicked = picked === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => pickAnswer(opt.value)}
                    className={cn(
                      "min-h-[3.25rem] rounded-2xl border-2 px-4 py-3 text-left text-base font-medium transition-all active:scale-[0.99]",
                      isPicked && "shadow-md",
                    )}
                    style={{
                      borderColor: isPicked ? sectionMeta.color : "var(--aiai-gray-200)",
                      background: isPicked ? sectionMeta.color + "12" : "#fff",
                      color: isPicked ? sectionMeta.color : "var(--aiai-gray-800)",
                    }}
                  >
                    <span
                      className="mr-2 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: isPicked ? sectionMeta.color : "var(--aiai-gray-100)",
                        color: isPicked ? "#fff" : "var(--aiai-gray-600)",
                      }}
                    >
                      {opt.value}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 backdrop-blur p-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Button
            variant="outline"
            onClick={() => idx > 0 && setIdx((i) => i - 1)}
            disabled={idx === 0 || submitting}
            className="flex-1"
          >
            ←
          </Button>
          <Button
            onClick={next}
            disabled={
              submitting ||
              (current.prompt.section !== "writing" && !picked)
            }
            className="flex-[2] py-5 text-base font-semibold"
            style={{ background: sectionMeta.color }}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {idx === totalQ - 1 ? (
              <>
                ส่งคำตอบ
                <Trophy className="size-4" />
              </>
            ) : (
              <>
                ถัดไป
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
