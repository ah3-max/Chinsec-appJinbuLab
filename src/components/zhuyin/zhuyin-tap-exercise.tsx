"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X, Volume2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ALL_ZHUYIN,
  type ZhuyinSymbol,
} from "@/lib/zhuyin/data";
import { LevelUpModal } from "@/components/learner/level-up-modal";

const QUESTION_COUNT = 10;
const CHOICE_COUNT = 4;

type Question = {
  target: ZhuyinSymbol;
  choices: ZhuyinSymbol[];
};

type AttemptRecord = {
  symbol: string;
  pickedSymbol: string;
  isCorrect: boolean;
  timeSpentSec: number;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestion(pool: ZhuyinSymbol[]): Question {
  const target = pool[Math.floor(Math.random() * pool.length)]!;
  const distractors = shuffle(
    pool.filter((s) => s.symbol !== target.symbol),
  ).slice(0, CHOICE_COUNT - 1);
  return {
    target,
    choices: shuffle([target, ...distractors]),
  };
}

function buildSession(): Question[] {
  return Array.from({ length: QUESTION_COUNT }, () => buildQuestion(ALL_ZHUYIN));
}

function newSessionKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface SessionFinishResult {
  newTotalXp: number;
  newStreak: number;
  awardedXp: number;
  suspicious: boolean;
  leveledUp?: boolean;
  newLevel?: string;
  skipped?: string;
}

export function ZhuyinTapExercise() {
  const tLevels = useTranslations("levels");
  const [questions, setQuestions] = useState<Question[]>(() => buildSession());
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const [sessionKey, setSessionKey] = useState<string>(() => newSessionKey());
  const [submitting, setSubmitting] = useState(false);
  const [finishResult, setFinishResult] = useState<SessionFinishResult | null>(
    null,
  );
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const startRef = useRef<number>(Date.now());
  const blurCountRef = useRef<number>(0);
  const attemptsRef = useRef<AttemptRecord[]>([]);
  const completedRef = useRef<boolean>(false);

  const current = questions[index];
  const progress = useMemo(
    () => Math.round((index / QUESTION_COUNT) * 100),
    [index],
  );

  // Reset start timer at each new question + auto-play audio.
  useEffect(() => {
    if (current) {
      startRef.current = Date.now();
      speak(current.target);
    }
  }, [current]);

  // Track window blur for anti-cheat — switching apps mid-question is a signal.
  useEffect(() => {
    const onBlur = () => {
      blurCountRef.current += 1;
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  if (!current) return null;

  const finished = hearts <= 0 || index >= QUESTION_COUNT;

  async function postAttempt(
    q: Question,
    choice: ZhuyinSymbol,
    correct: boolean,
    timeSpentSec: number,
  ) {
    try {
      await fetch("/api/learn/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseType: "ZHUYIN_RECOGNITION",
          sessionKey,
          questionData: {
            mode: "tap_listen",
            target: q.target.symbol,
            targetPinyin: q.target.pinyin,
            choices: q.choices.map((c) => c.symbol),
          },
          userAnswer: { picked: choice.symbol },
          isCorrect: correct,
          score: correct ? 10 : 0,
          timeSpentSec,
          windowBlurCount: blurCountRef.current,
        }),
      });
    } catch {
      // Network blip — keep the user playing, the lost attempt is acceptable
      // since the local state still drives UX. The session/complete call will
      // also continue to work because it aggregates from the DB attempts that
      // did land.
    }
  }

  async function completeSession(finalScore: number, allCorrect: boolean) {
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
          totalXp: finalScore, // 1 score = 1 XP for now (10 per correct)
          allCorrect,
        }),
      });
      if (!res.ok) {
        setCompletionError("complete_failed");
        return;
      }
      const json = (await res.json()) as SessionFinishResult;
      setFinishResult(json);
      if (json.leveledUp) setShowLevelUp(true);
    } catch {
      setCompletionError("complete_failed");
    } finally {
      setSubmitting(false);
    }
  }

  function pick(choice: ZhuyinSymbol) {
    if (picked !== null || submitting) return;
    setPicked(choice.symbol);
    const correct = choice.symbol === current!.target.symbol;
    const timeSpentSec = Math.max(
      0,
      Math.round((Date.now() - startRef.current) / 1000),
    );
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 10);
    else setHearts((h) => h - 1);

    attemptsRef.current.push({
      symbol: current!.target.symbol,
      pickedSymbol: choice.symbol,
      isCorrect: correct,
      timeSpentSec,
    });

    // Fire-and-forget per-attempt POST.
    postAttempt(current!, choice, correct, timeSpentSec);

    setTimeout(() => {
      setPicked(null);
      setFeedback(null);

      const nextIdx = index + 1;
      const heartsLeft = correct ? hearts : hearts - 1;
      const willFinish =
        heartsLeft <= 0 || nextIdx >= QUESTION_COUNT;

      setIndex(nextIdx);

      if (willFinish) {
        const finalScore = score + (correct ? 10 : 0);
        const allRight =
          attemptsRef.current.length === QUESTION_COUNT &&
          attemptsRef.current.every((a) => a.isCorrect);
        completeSession(finalScore, allRight);
      }
    }, 900);
  }

  function reset() {
    setQuestions(buildSession());
    setIndex(0);
    setHearts(5);
    setScore(0);
    setPicked(null);
    setFeedback(null);
    setFinishResult(null);
    setCompletionError(null);
    setSessionKey(newSessionKey());
    startRef.current = Date.now();
    blurCountRef.current = 0;
    attemptsRef.current = [];
    completedRef.current = false;
  }

  if (finished) {
    const passed = hearts > 0;
    return (
      <Card>
        <CardContent className="space-y-4 p-6 text-center">
          <div className="text-6xl">{passed ? "🎉" : "💔"}</div>
          <h2 className="text-xl font-bold">
            {passed ? "恭喜過關！" : "再試一次！"}
          </h2>
          <div className="text-sm text-muted-foreground">
            得分 {score} ・ 剩餘血量 {hearts}
          </div>

          {submitting ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              紀錄中…
            </div>
          ) : finishResult ? (
            <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
              {finishResult.skipped === "impersonation" ? (
                <p className="text-muted-foreground">
                  模擬登入中，本次練習不計入學員數據
                </p>
              ) : finishResult.suspicious ? (
                <p className="text-amber-700">
                  本次練習被標記為可疑，XP 暫不計入
                </p>
              ) : (
                <>
                  <p className="text-base font-semibold">
                    +{finishResult.awardedXp} XP
                  </p>
                  <p className="text-muted-foreground">
                    連續 {finishResult.newStreak} 天 🔥
                  </p>
                </>
              )}
            </div>
          ) : completionError ? (
            <p className="text-sm text-destructive">紀錄失敗，請稍後再試</p>
          ) : null}

          <Button onClick={reset} className="w-full" size="lg">
            <RotateCcw className="size-4" />
            重新挑戰
          </Button>
        </CardContent>
        {showLevelUp && finishResult?.newLevel && (
          <LevelUpModal
            newLevelLabel={tLevels(finishResult.newLevel)}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 頂部進度 + 血量 */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-medium tabular-nums">
          {"❤️".repeat(hearts)}
        </div>
      </div>

      {/* 題目卡 */}
      <Card>
        <CardContent className="space-y-6 p-6 text-center">
          <p className="text-sm text-muted-foreground">聽音選注音符號</p>

          <button
            type="button"
            onClick={() => speak(current.target)}
            aria-label="播放注音"
            className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
          >
            <Volume2 className="size-10" />
          </button>

          <p className="text-xs text-muted-foreground">
            點上方圖示再聽一次
          </p>
        </CardContent>
      </Card>

      {/* 選項 */}
      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((c) => {
          const isPicked = picked === c.symbol;
          const isTarget = c.symbol === current.target.symbol;
          const showResult = picked !== null;
          return (
            <button
              key={c.symbol}
              type="button"
              onClick={() => pick(c)}
              disabled={picked !== null}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border-2 bg-card text-5xl font-bold shadow-sm transition-all active:scale-95",
                !showResult && "hover:border-primary hover:shadow-md",
                showResult && isTarget && "border-green-500 bg-green-50 text-green-700",
                showResult && isPicked && !isTarget && "border-red-500 bg-red-50 text-red-700",
                showResult && !isTarget && !isPicked && "opacity-60",
              )}
              aria-label={`${c.symbol} ${c.pinyin}`}
            >
              {c.symbol}
            </button>
          );
        })}
      </div>

      {/* 對錯動畫 */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
            )}
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

      <div className="text-center text-xs text-muted-foreground">
        分數 {score} · 第 {index + 1} / {QUESTION_COUNT} 題
      </div>
    </div>
  );
}

// Edge-TTS pregenerated audio with Web Speech fallback.
// /api/audio/zhuyin/[symbol] now streams the bytes through Next.js (same
// origin), so this works through cloudflared / LAN — no cross-origin redirect
// to localhost:9000. We still fall back to SpeechSynthesis if the file is
// missing, but that path should rarely fire.
let activeAudio: HTMLAudioElement | null = null;
let primedSynth = false;

// iOS Safari requires speechSynthesis to be touched inside a user gesture
// at least once per page before it will speak. We prime it on first call
// (which is itself triggered by a click on the play button).
function primeSpeechSynth() {
  if (primedSynth || typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    const u = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(u);
    primedSynth = true;
  } catch {
    /* ignore */
  }
}

function speak(s: ZhuyinSymbol, opts?: { slow?: boolean }) {
  if (typeof window === "undefined") return;
  primeSpeechSynth();
  const slow = opts?.slow ? "?slow=1" : "";
  const url = `/api/audio/zhuyin/${encodeURIComponent(s.symbol)}${slow}`;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }

  const audio = new Audio(url);
  audio.preload = "auto";
  activeAudio = audio;
  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    speakWebFallback(s);
  };
  audio.addEventListener("error", fallback);
  audio.play().catch((err) => {
    console.warn("[zhuyin audio] play failed, falling back to SpeechSynthesis:", err);
    fallback();
  });
}

function speakWebFallback(s: ZhuyinSymbol) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const text = s.example?.hanzi ?? s.pinyin;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
