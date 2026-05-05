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
  Heart,
  ChevronRight,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LevelUpModal } from "./level-up-modal";
import { Confetti } from "./confetti";

export interface LessonExercise {
  id: string;
  type:
    | "ZHUYIN_RECOGNITION"
    | "VOCAB_MCQ"
    | "VOCAB_LISTEN_CHOOSE"
    | "TONE_DISCRIMINATION"
    | "LISTEN_FILL";
  prompt: {
    audioUrl?: string;
    audioText?: string;       // for LISTEN_FILL — full sentence to speak
    sentenceWithBlank?: string; // for LISTEN_FILL — sentence with ___ in place of target
    target?: string;
    symbol?: string;
    syllable?: string;
    hanzi?: string;
    pinyin?: string;
    questionText?: string;    // optional clarifying question
  };
  options: Array<{ value: string | number; label?: string }>;
  answer: { value: unknown };
  audioUrl?: string | null;
  maxScore: number;
}

export interface VocabItem {
  hanzi: string;
  pinyin?: string;
  translation?: string;
  audioUrl?: string;
  imageUrl?: string;
  /** Single-example fields (kept for backward compat with existing seeds) */
  exampleSentence?: string;
  examplePinyin?: string;
  exampleTranslation?: string;
  /** New multi-example array — preferred for richer cards */
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string }>;
  /** Short memory hint shown after flip — helps users remember the word */
  mnemonic?: string;
  /** Usage note (e.g., "Don't say X", "More formal than Y") */
  usageNote?: string;
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

function newSessionKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function playAudio(url: string) {
  new Audio(url).play().catch(() => {});
}

// Try the recorded audio at `url`; if it 404s or fails to play, fall back to
// browser Web Speech (`speakChinese(text)`). Real recordings sound much better
// than TTS, but most vocab files aren't in MinIO yet — without this fallback
// the speaker button silently does nothing.
async function playAudioOrSpeak(url: string | undefined, text: string) {
  if (url) {
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (head.ok) {
        const audio = new Audio(url);
        try {
          await audio.play();
          return;
        } catch {
          /* fall through to TTS */
        }
      }
    } catch {
      /* fall through to TTS */
    }
  }
  speakChinese(text);
}

function speakChinese(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

// ─── Vocab Intro Phase ────────────────────────────────────────────────────────
type Knowledge = "known" | "unknown";

function VocabIntro({
  items,
  onDone,
}: {
  items: VocabItem[];
  onDone: () => void;
}) {
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [knowledge, setKnowledge] = useState<Record<number, Knowledge>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showSummary, setShowSummary] = useState(false);
  const current = items[cardIdx];

  useEffect(() => {
    setFlipped(false);
    setImgLoaded(false);
    if (current?.hanzi) {
      void playAudioOrSpeak(current.audioUrl, current.hanzi);
    }
  }, [cardIdx, current?.audioUrl, current?.hanzi]);

  // Preload next 2 cards' images so swipes feel instant
  useEffect(() => {
    [1, 2].forEach((offset) => {
      const next = items[cardIdx + offset];
      if (next?.imageUrl) {
        const img = new Image();
        img.src = next.imageUrl;
      }
    });
  }, [cardIdx, items]);

  function recordAndAdvance(status: Knowledge) {
    setKnowledge((k) => ({ ...k, [cardIdx]: status }));
    setDirection(1);
    if (cardIdx === items.length - 1) {
      // Last card — show summary instead of jumping to exercises
      setShowSummary(true);
    } else {
      setCardIdx((i) => i + 1);
    }
  }

  function goPrev() {
    if (cardIdx === 0) return;
    setDirection(-1);
    setCardIdx((i) => i - 1);
  }

  // Summary screen — shown after last card is reviewed
  if (showSummary) {
    const known = Object.values(knowledge).filter((k) => k === "known").length;
    const unknown = Object.values(knowledge).filter((k) => k === "unknown").length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 px-2 py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="text-7xl"
        >
          🎉
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
            เรียนคำศัพท์ครบแล้ว!
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--aiai-gray-500)" }}>
            ดูครบ {items.length} คำ
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <div
            className="rounded-2xl border-2 p-4"
            style={{ borderColor: "#22c55e", background: "#f0fdf4" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#15803d" }}>
              เก่งแล้ว
            </p>
            <p className="mt-1 text-3xl font-bold" style={{ color: "#15803d" }}>
              {known}
            </p>
          </div>
          <div
            className="rounded-2xl border-2 p-4"
            style={{ borderColor: "#fb923c", background: "#fff7ed" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#c2410c" }}>
              ต้องทบทวน
            </p>
            <p className="mt-1 text-3xl font-bold" style={{ color: "#c2410c" }}>
              {unknown}
            </p>
          </div>
        </div>

        <Button
          className="w-full py-6 text-base font-semibold"
          style={{ background: "var(--aiai-green-400)" }}
          onClick={onDone}
        >
          <Sparkles className="size-4" />
          เริ่มทำแบบฝึกหัด →
        </Button>
        <button
          type="button"
          onClick={() => {
            setShowSummary(false);
            setCardIdx(0);
            setKnowledge({});
          }}
          className="text-xs underline"
          style={{ color: "var(--aiai-gray-400)" }}
        >
          ดูคำศัพท์อีกครั้ง / 重新看一次
        </button>
      </motion.div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress dots — color-coded by knowledge */}
      <div className="flex flex-wrap justify-center gap-1">
        {items.map((_, i) => {
          const status = knowledge[i];
          let bg = "var(--aiai-gray-200)";
          if (status === "known") bg = "#22c55e";
          else if (status === "unknown") bg = "#fb923c";
          else if (i === cardIdx) bg = "var(--aiai-green-400)";
          return (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === cardIdx ? 24 : 6, background: bg }}
            />
          );
        })}
      </div>

      {/* Swipeable card — height grows with content; mode="wait" avoids overlap */}
      <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={cardIdx}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -60 : 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              const SWIPE_THRESHOLD = 100;
              if (info.offset.x < -SWIPE_THRESHOLD) recordAndAdvance("known");
              else if (info.offset.x > SWIPE_THRESHOLD && cardIdx > 0) goPrev();
            }}
            className="cursor-pointer select-none rounded-2xl border bg-white shadow-lg overflow-hidden"
            style={{ borderColor: "var(--aiai-green-100)" }}
            onClick={() => setFlipped((f) => !f)}
          >
            {/* Image — responsive height (smaller on mobile so the card fits) */}
            {current.imageUrl && (
              <div
                className="relative h-28 w-full overflow-hidden sm:h-36"
                style={{ background: "var(--aiai-green-50)" }}
              >
                {!imgLoaded && (
                  <div className="absolute inset-0 animate-pulse" style={{ background: "var(--aiai-green-50)" }} />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={current.imageUrl}
                  src={current.imageUrl}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover transition-opacity duration-300"
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                />
              </div>
            )}

            <div className="flex flex-col items-center gap-3 px-4 py-5 sm:px-6 sm:py-6">
              {/* Audio button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void playAudioOrSpeak(current.audioUrl, current.hanzi);
                }}
                className="flex size-11 items-center justify-center rounded-full shadow-md transition-transform active:scale-95 sm:size-12"
                style={{ background: "var(--aiai-green-400)", color: "#fff" }}
              >
                <Volume2 className="size-5" />
              </button>

              {/* Hanzi — clamps from 36px to 60px depending on viewport + word length */}
              <div
                className="text-center font-bold leading-tight"
                style={{
                  color: "var(--aiai-gray-800)",
                  fontSize: "clamp(2.25rem, 8vw + 1rem, 3.75rem)",
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                }}
              >
                {current.hanzi}
              </div>
              {current.pinyin && (
                <div className="text-base sm:text-lg" style={{ color: "var(--aiai-green-600)" }}>
                  {current.pinyin}
                </div>
              )}

              <AnimatePresence>
                {flipped ? (
                  <motion.div
                    key="trans"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-2"
                  >
                    {/* Translation */}
                    <div
                      className="rounded-xl px-4 py-2 text-center text-base font-medium"
                      style={{ background: "var(--aiai-green-50)", color: "var(--aiai-green-800)" }}
                    >
                      {current.translation ?? "—"}
                    </div>

                    {/* Memory hint (mnemonic) — shown prominently if present */}
                    {current.mnemonic && (
                      <div
                        className="rounded-xl border-2 px-3 py-2 text-left text-xs"
                        style={{
                          borderColor: "#fbbf24",
                          background: "linear-gradient(90deg, #fef3c7 0%, #fffbeb 100%)",
                          color: "#78350f",
                        }}
                      >
                        <span className="mr-1 font-bold">💡 จำง่ายๆ:</span>
                        {current.mnemonic}
                      </div>
                    )}

                    {/* Usage note (e.g. "Don't say X" / "More formal than Y") */}
                    {current.usageNote && (
                      <div
                        className="rounded-xl border px-3 py-2 text-left text-[11px]"
                        style={{
                          borderColor: "#60a5fa",
                          background: "#eff6ff",
                          color: "#1e3a8a",
                        }}
                      >
                        <span className="mr-1 font-bold">ℹ️</span>
                        {current.usageNote}
                      </div>
                    )}

                    {/* Examples — multi-example array (preferred) or single fallback */}
                    {(() => {
                      const list =
                        current.examples && current.examples.length > 0
                          ? current.examples
                          : current.exampleSentence
                            ? [
                                {
                                  sentence: current.exampleSentence,
                                  pinyin: current.examplePinyin,
                                  translation: current.exampleTranslation,
                                },
                              ]
                            : [];
                      if (list.length === 0) return null;
                      return (
                        <div className="space-y-1.5">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: "var(--aiai-green-700)" }}
                          >
                            📝 ตัวอย่างประโยค ({list.length})
                          </p>
                          {list.map((ex, i) => (
                            <div
                              key={i}
                              className="rounded-xl border px-3 py-2 text-left text-sm"
                              style={{
                                borderColor: "var(--aiai-green-100)",
                                background: "#fafafa",
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                                  style={{
                                    background: "var(--aiai-green-400)",
                                    color: "#fff",
                                  }}
                                >
                                  {i + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakChinese(ex.sentence);
                                  }}
                                  className="flex-1 text-left"
                                >
                                  <p
                                    className="font-medium"
                                    style={{ color: "var(--aiai-gray-700)" }}
                                  >
                                    {ex.sentence}
                                  </p>
                                  {ex.pinyin && (
                                    <p
                                      className="mt-0.5 text-xs"
                                      style={{ color: "var(--aiai-green-600)" }}
                                    >
                                      {ex.pinyin}
                                    </p>
                                  )}
                                  {ex.translation && (
                                    <p
                                      className="mt-0.5 text-xs"
                                      style={{ color: "var(--aiai-gray-500)" }}
                                    >
                                      {ex.translation}
                                    </p>
                                  )}
                                </button>
                                <Volume2
                                  className="mt-0.5 size-3 shrink-0"
                                  style={{ color: "var(--aiai-green-500)" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    แตะเพื่อดูคำแปล / 點擊看翻譯
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Self-assessment buttons (visible after flip) */}
      <AnimatePresence mode="wait">
        {flipped ? (
          <motion.div
            key="assess"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              className="h-14 text-base font-semibold"
              style={{ borderColor: "#fb923c", color: "#c2410c", background: "#fff7ed" }}
              onClick={() => recordAndAdvance("unknown")}
            >
              <ThumbsDown className="size-4" />
              ยังไม่รู้
            </Button>
            <Button
              className="h-14 text-base font-semibold"
              style={{ background: "#22c55e" }}
              onClick={() => recordAndAdvance("known")}
            >
              <ThumbsUp className="size-4" />
              เก่งแล้ว!
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="nav"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex gap-3"
          >
            {cardIdx > 0 && (
              <Button variant="outline" className="flex-1" onClick={goPrev}>
                ←
              </Button>
            )}
            <Button
              className="flex-1"
              style={{ background: "var(--aiai-green-400)" }}
              onClick={() => setFlipped(true)}
            >
              ดูคำแปล
              <ChevronRight className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs" style={{ color: "var(--aiai-gray-400)" }}>
        {cardIdx + 1} / {items.length} · ปัดซ้ายเพื่อไปต่อ
      </p>
    </div>
  );
}

// ─── Main LessonRunner ────────────────────────────────────────────────────────
export function LessonRunner({
  courseCode,
  lessonCode,
  exercises,
  totalCount,
  vocabItems,
}: {
  courseCode: string;
  lessonCode: string;
  exercises: LessonExercise[];
  totalCount: number;
  vocabItems?: VocabItem[];
}) {
  const t = useTranslations("learn.lesson");
  const tLevels = useTranslations("levels");
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  // phase: "intro" (vocab cards) | "exercise" | "done"
  const [phase, setPhase] = useState<"intro" | "exercise" | "done">(
    vocabItems && vocabItems.length > 0 ? "intro" : "exercise",
  );
  const [sessionKey, setSessionKey] = useState(() => newSessionKey());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
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
    if (phase === "exercise" && current) {
      const url = current.prompt.audioUrl ?? current.audioUrl ?? undefined;
      if (url) playAudio(url);
    }
  }, [current, phase]);

  useEffect(() => {
    const onBlur = () => (blurCount.current += 1);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  const progress = useMemo(
    () => Math.round((idx / Math.max(1, totalCount)) * 100),
    [idx, totalCount],
  );

  // ── Intro phase ──
  if (phase === "intro" && vocabItems && vocabItems.length > 0) {
    return <VocabIntro items={vocabItems} onDone={() => setPhase("exercise")} />;
  }

  if (exercises.length === 0) {
    return (
      <div
        className="rounded-2xl border bg-white p-8 text-center text-sm"
        style={{
          borderColor: "var(--aiai-gray-200)",
          color: "var(--aiai-gray-400)",
        }}
      >
        {t("noExercises")}
      </div>
    );
  }

  // ── Done screen ──
  if (result) {
    const passed = hearts > 0;
    return (
      <div className="flex flex-col items-center gap-6 px-2 py-8 text-center">
        <Confetti trigger={passed} />
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="text-7xl"
        >
          {passed ? "🎉" : "💔"}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--aiai-gray-800)" }}
          >
            {passed ? t("complete") : t("tryAgain")}
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--aiai-gray-500)" }}
          >
            {score} / {totalCount} ข้อถูก
          </p>
        </motion.div>

        {/* Daily missions all-complete celebration */}
        {passed && result.dailyMissionsCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="w-full rounded-2xl border-2 p-3 text-center"
            style={{
              borderColor: "#fbbf24",
              background: "linear-gradient(135deg, #fef3c7 0%, #fff 100%)",
            }}
          >
            <div className="text-3xl">🌟</div>
            <p className="text-sm font-bold" style={{ color: "#92400e" }}>
              ภารกิจวันนี้ครบแล้ว!
            </p>
            <p className="text-xs" style={{ color: "#b45309" }}>
              +25 XP โบนัส
            </p>
          </motion.div>
        )}

        {passed && (
          <>
            {result.skipped === "impersonation" ? (
              <p
                className="text-sm"
                style={{ color: "var(--aiai-gray-500)" }}
              >
                {t("impersonationSkipped")}
              </p>
            ) : result.suspicious ? (
              <p className="text-sm" style={{ color: "var(--aiai-orange-600)" }}>
                {t("suspicious")}
              </p>
            ) : (
              <div
                className="w-full rounded-2xl p-4"
                style={{
                  background: "var(--aiai-green-50)",
                  border: "1.5px solid var(--aiai-green-200)",
                }}
              >
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--aiai-green-600)" }}
                >
                  +{result.awardedXp} XP
                </p>
                <p
                  className="mt-0.5 text-sm"
                  style={{ color: "var(--aiai-green-700)" }}
                >
                  🔥 {result.newStreak} วันติดต่อกัน
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex w-full flex-col gap-2">
          {!passed && (
            <Button
              className="w-full py-6 text-base font-semibold"
              style={{ background: "var(--aiai-green-400)" }}
              onClick={resetLesson}
            >
              <RotateCcw className="size-4" />
              ลองอีกครั้ง
            </Button>
          )}
          <Button
            variant={passed ? "default" : "outline"}
            className="w-full py-6 text-base font-semibold"
            style={passed ? { background: "var(--aiai-green-400)" } : {}}
            onClick={() =>
              router.push(`/${params.locale}/learn/${courseCode}`)
            }
          >
            {passed ? t("backToCourse") : "กลับไปหน้าคอร์ส"}
          </Button>
          {passed && (
            <Button variant="outline" className="w-full" onClick={resetLesson}>
              <RotateCcw className="size-4" />
              {t("retry")}
            </Button>
          )}
        </div>

        {showLevelUp && result.newLevel && (
          <LevelUpModal
            newLevelLabel={tLevels(result.newLevel as never)}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </div>
    );
  }

  if (!current) return null;

  const audio = current.prompt.audioUrl ?? current.audioUrl ?? undefined;
  const symbol =
    current.prompt.symbol ?? current.prompt.hanzi ?? current.prompt.target;

  function getTypeLabel() {
    switch (current?.type) {
      case "ZHUYIN_RECOGNITION":
        return t("typeRecognition");
      case "VOCAB_MCQ":
        return "เลือกคำแปลที่ถูกต้อง";
      case "VOCAB_LISTEN_CHOOSE":
        return "ฟังเสียงแล้วเลือกคำที่ถูกต้อง";
      case "TONE_DISCRIMINATION":
        return t("typeTone");
      case "LISTEN_FILL":
        return "ฟังประโยคแล้วเติมคำที่หายไป";
      default:
        return "";
    }
  }

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
      setHearts((h) => Math.max(0, h - 1));
    }

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

    const delay = correct ? 700 : 1400;
    setTimeout(() => {
      setPicked(null);
      setFeedback(null);

      // Out of hearts → end session
      const newHearts = correct ? hearts : Math.max(0, hearts - 1);
      if (!correct && newHearts === 0) {
        void completeSession(score + awardedScore, false, true);
        return;
      }

      const nextIdx = idx + 1;
      if (nextIdx >= exercises.length) {
        void completeSession(score + awardedScore, correct, false);
      } else {
        setIdx(nextIdx);
      }
    }, delay);
  }

  async function completeSession(
    finalScore: number,
    lastWasCorrect: boolean,
    outOfHearts: boolean,
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
          totalXp: finalScore,
          allCorrect: allCorrectRef.current && lastWasCorrect && !outOfHearts,
        }),
      });
      if (!res.ok) {
        toast.error(t("completeFailed"));
        return;
      }
      const data = (await res.json()) as SessionResult;
      setResult(data);
      if (data.leveledUp) setShowLevelUp(true);
      setPhase("done");
    } catch {
      toast.error(t("completeFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetLesson() {
    setPhase(vocabItems && vocabItems.length > 0 ? "intro" : "exercise");
    setSessionKey(newSessionKey());
    setIdx(0);
    setPicked(null);
    setFeedback(null);
    setScore(0);
    setHearts(MAX_HEARTS);
    setResult(null);
    setShowLevelUp(false);
    startRef.current = Date.now();
    blurCount.current = 0;
    allCorrectRef.current = true;
    completedRef.current = false;
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Top bar: hearts + progress */}
      <div className="flex items-center gap-3">
        {/* Hearts */}
        <div className="flex gap-0.5">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              className="size-5"
              style={{
                color:
                  i < hearts ? "#ef4444" : "var(--aiai-gray-200)",
                fill: i < hearts ? "#ef4444" : "var(--aiai-gray-200)",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--aiai-green-400)" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 60 }}
          />
        </div>

        <span
          className="text-xs tabular-nums font-medium"
          style={{ color: "var(--aiai-gray-500)" }}
        >
          {idx + 1}/{exercises.length}
        </span>
      </div>

      {/* Question label */}
      <p
        className="text-center text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--aiai-green-600)" }}
      >
        {getTypeLabel()}
      </p>

      {/* Symbol / Hanzi (skipped for LISTEN_FILL) */}
      {symbol && current.type !== "LISTEN_FILL" && (
        <div className="text-center text-6xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          {symbol}
        </div>
      )}

      {/* Pinyin (skipped for LISTEN_FILL) */}
      {current.prompt.pinyin && current.type !== "LISTEN_FILL" && (
        <p className="text-center text-lg" style={{ color: "var(--aiai-green-600)" }}>
          {current.prompt.pinyin}
        </p>
      )}

      {/* LISTEN_FILL — speaker button + sentence-with-blank */}
      {current.type === "LISTEN_FILL" && current.prompt.audioText && (
        <>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => speakChinese(current.prompt.audioText!)}
              className="flex size-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
              style={{ background: "var(--aiai-green-400)", color: "#fff" }}
              aria-label="play"
            >
              <Volume2 className="size-9" />
            </button>
          </div>
          {current.prompt.sentenceWithBlank && (
            <p
              className="text-center font-bold leading-relaxed"
              style={{ color: "var(--aiai-gray-800)", fontSize: 28 }}
            >
              {current.prompt.sentenceWithBlank}
            </p>
          )}
          {current.prompt.questionText && (
            <p className="text-center text-sm" style={{ color: "var(--aiai-gray-500)" }}>
              {current.prompt.questionText}
            </p>
          )}
        </>
      )}

      {/* Pre-recorded audio button (other types) */}
      {audio && current.type !== "LISTEN_FILL" && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => playAudio(audio)}
            className="flex size-16 items-center justify-center rounded-full shadow-md transition-transform active:scale-95"
            style={{ background: "var(--aiai-green-400)", color: "#fff" }}
            aria-label={t("playAudio")}
          >
            <Volume2 className="size-7" />
          </button>
        </div>
      )}

      {/* Options grid */}
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
            if (isCorrect) {
              borderColor = "#22c55e";
              bg = "#f0fdf4";
              textColor = "#15803d";
            } else if (isPicked) {
              borderColor = "#ef4444";
              bg = "#fef2f2";
              textColor = "#b91c1c";
            }
          }

          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => pickAnswer(opt.value)}
              disabled={picked !== null || submitting}
              className={cn(
                "min-h-[3.5rem] rounded-2xl border-2 px-4 py-3 text-center text-base font-semibold shadow-sm transition-all active:scale-95",
                showResult && !isCorrect && !isPicked && "opacity-50",
              )}
              style={{
                borderColor,
                background: bg,
                color: textColor,
              }}
            >
              {showResult && isCorrect && (
                <Check className="mb-0.5 mr-1 inline size-4" />
              )}
              {showResult && isPicked && !isCorrect && (
                <X className="mb-0.5 mr-1 inline size-4" />
              )}
              {label}
            </button>
          );
        })}
      </div>

      {submitting && (
        <div
          className="flex items-center justify-center gap-2 text-sm"
          style={{ color: "var(--aiai-gray-400)" }}
        >
          <Loader2 className="size-4 animate-spin" />
          {t("submitting")}
        </div>
      )}

      {/* Bottom feedback banner (Duolingo style) */}
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
                  background:
                    feedback === "correct" ? "#22c55e" : "#ef4444",
                  color: "#fff",
                }}
              >
                {feedback === "correct" ? (
                  <Check className="size-5" />
                ) : (
                  <X className="size-5" />
                )}
              </div>
              <div>
                <p
                  className="font-bold"
                  style={{
                    color: feedback === "correct" ? "#15803d" : "#b91c1c",
                  }}
                >
                  {feedback === "correct" ? "ถูกต้อง! 🎉" : "ผิด ลองใหม่นะ"}
                </p>
                {feedback === "wrong" && picked !== null && (
                  <p
                    className="text-sm"
                    style={{ color: "#b91c1c" }}
                  >
                    คำตอบถูกคือ: {String(current.answer.value)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
