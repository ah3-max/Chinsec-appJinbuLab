"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import {
  INITIALS,
  MEDIALS,
  FINALS,
  TONES,
  type ZhuyinSymbol,
} from "@/lib/zhuyin/data";
import { cn } from "@/lib/utils";

type Props = {
  /** 點下注音時觸發（傳回符號）；不傳則使用內建播音 placeholder */
  onTap?: (symbol: ZhuyinSymbol) => void;
  /** 高亮某個注音（題目模式用） */
  highlight?: string | null;
  /** 顯示底下的範例字 */
  showExamples?: boolean;
  /** 顯示聲調列 */
  showTones?: boolean;
};

export function ZhuyinKeyboard({
  onTap,
  highlight,
  showExamples = false,
  showTones = true,
}: Props) {
  const [tapped, setTapped] = useState<string | null>(null);

  function handleTap(s: ZhuyinSymbol) {
    setTapped(s.symbol);
    setTimeout(() => setTapped(null), 240);
    onTap?.(s);
  }

  return (
    <div className="space-y-3">
      <Section title="聲母" symbols={INITIALS} onTap={handleTap} highlight={highlight} tapped={tapped} showExamples={showExamples} />
      <Section title="介母" symbols={MEDIALS} onTap={handleTap} highlight={highlight} tapped={tapped} showExamples={showExamples} />
      <Section title="韻母" symbols={FINALS} onTap={handleTap} highlight={highlight} tapped={tapped} showExamples={showExamples} />

      {showTones && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-medium text-muted-foreground">聲調</h3>
          <div className="grid grid-cols-5 gap-2">
            {TONES.map((t) => (
              <div
                key={t.number}
                className="rounded-md border bg-card px-2 py-3 text-center"
              >
                <div className="text-xl font-semibold">
                  {t.mark === " ̄" ? "ˉ" : t.mark}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {t.number === 5 ? "輕" : t.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  symbols,
  onTap,
  highlight,
  tapped,
  showExamples,
}: {
  title: string;
  symbols: ZhuyinSymbol[];
  onTap: (s: ZhuyinSymbol) => void;
  highlight: string | null | undefined;
  tapped: string | null;
  showExamples: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {symbols.map((s) => {
          const isHighlighted = highlight === s.symbol;
          const isTapped = tapped === s.symbol;
          return (
            <button
              key={s.symbol}
              type="button"
              onClick={() => onTap(s)}
              className={cn(
                "group flex aspect-square flex-col items-center justify-center rounded-md border bg-card text-2xl font-bold shadow-sm transition-all",
                "active:scale-95 hover:shadow-md",
                isHighlighted && "ring-2 ring-primary ring-offset-1",
                isTapped && "scale-95 bg-primary text-primary-foreground",
              )}
              aria-label={`${s.symbol} (${s.pinyin})`}
            >
              <span>{s.symbol}</span>
              {showExamples && s.example && (
                <span className="mt-0.5 text-[9px] font-normal text-muted-foreground group-active:text-primary-foreground/70">
                  {s.example.hanzi}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 單獨可重用的播音按鈕 */
export function PlayAudioButton({
  text,
  className,
  onPlay,
}: {
  text: string;
  className?: string;
  onPlay?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`播放 ${text}`}
      onClick={onPlay}
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow active:scale-95",
        className,
      )}
    >
      <Volume2 className="size-6" />
    </button>
  );
}
