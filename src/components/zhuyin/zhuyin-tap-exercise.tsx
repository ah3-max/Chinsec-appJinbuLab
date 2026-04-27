"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Volume2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ALL_ZHUYIN,
  type ZhuyinSymbol,
} from "@/lib/zhuyin/data";

const QUESTION_COUNT = 10;
const CHOICE_COUNT = 4;

type Question = {
  target: ZhuyinSymbol;
  choices: ZhuyinSymbol[];
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

export function ZhuyinTapExercise() {
  const [questions, setQuestions] = useState<Question[]>(() => buildSession());
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const current = questions[index];
  const progress = useMemo(
    () => Math.round((index / QUESTION_COUNT) * 100),
    [index],
  );

  // 自動播音（題目切換時）：呼叫 Web Speech API（瀏覽器內建）
  useEffect(() => {
    if (current) speak(current.target);
  }, [current]);

  if (!current) return null;

  const finished = hearts <= 0 || index >= QUESTION_COUNT;

  function pick(choice: ZhuyinSymbol) {
    if (picked !== null) return;
    setPicked(choice.symbol);
    const correct = choice.symbol === current!.target.symbol;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 10);
    else setHearts((h) => h - 1);

    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      setIndex((i) => i + 1);
    }, 900);
  }

  function reset() {
    setQuestions(buildSession());
    setIndex(0);
    setHearts(5);
    setScore(0);
    setPicked(null);
    setFeedback(null);
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
          <Button onClick={reset} className="w-full" size="lg">
            <RotateCcw className="size-4" />
            重新挑戰
          </Button>
        </CardContent>
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

// 使用瀏覽器內建 Web Speech API 暫代 TTS（後續換 Edge-TTS）
function speak(s: ZhuyinSymbol) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // 唸範例字會比注音本身清楚
  const text = s.example?.hanzi ?? s.pinyin;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
