"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TranslationReportButton,
  type TranslationTarget,
} from "./translation-report-button";

export interface VocabularyCardProps {
  vocabularyId: string;
  hanzi: string;
  zhuyin: string;
  pinyin: string;
  thaiMeaning: string;
  englishMeaning?: string;
  audioUrl?: string;
  audioSlowUrl?: string;
  size?: "small" | "medium" | "large";
  showZhuyin?: boolean;
  showPinyin?: boolean;
  showEnglish?: boolean;
  uiLanguage?: string;
}

const HANZI_SIZE: Record<NonNullable<VocabularyCardProps["size"]>, string> = {
  small: "text-3xl",
  medium: "text-4xl sm:text-5xl",
  large: "text-5xl sm:text-6xl",
};

export function VocabularyCard({
  vocabularyId,
  hanzi,
  zhuyin,
  pinyin,
  thaiMeaning,
  englishMeaning,
  audioUrl,
  audioSlowUrl,
  size = "medium",
  showZhuyin = true,
  showPinyin = true,
  showEnglish = false,
  uiLanguage = "th",
}: VocabularyCardProps) {
  const t = useTranslations("vocabCard");
  const [hoverEnglish, setHoverEnglish] = useState(false);

  const playAudio = (url?: string) => {
    if (!url) return;
    new Audio(url).play().catch(() => {});
  };

  const target: TranslationTarget = {
    contentType: "vocabulary",
    contentId: vocabularyId,
    language: uiLanguage,
    originalText: thaiMeaning,
  };

  return (
    <div className="relative rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      {/* zhuyin (top) */}
      {showZhuyin && (
        <p className="mb-1 text-center text-[13px] tracking-wider text-muted-foreground sm:text-sm">
          {zhuyin}
        </p>
      )}

      {/* hanzi */}
      <div className="flex items-center justify-center gap-3">
        <h3
          className={cn(
            "text-center font-bold leading-tight tracking-wide",
            HANZI_SIZE[size],
          )}
        >
          {hanzi}
        </h3>
        {audioUrl && (
          <button
            type="button"
            onClick={() => playAudio(audioUrl)}
            className="rounded-full p-2 transition-colors hover:opacity-80"
            style={{
              color: "var(--aiai-green-600)",
              background: "var(--aiai-green-50)",
            }}
            aria-label={t("playAudio")}
          >
            <Volume2 className="size-5" />
          </button>
        )}
      </div>

      {/* pinyin */}
      {showPinyin && (
        <p className="mt-1 text-center text-[15px] italic text-muted-foreground sm:text-base">
          {pinyin}
        </p>
      )}

      {/* divider */}
      <div className="my-3 h-px bg-border" />

      {/* thai meaning */}
      <TranslationReportButton target={target} className="block">
        <p className="text-center text-[17px] font-medium leading-snug sm:text-lg">
          {thaiMeaning}
        </p>
      </TranslationReportButton>

      {/* english (hover or click for mobile) */}
      {englishMeaning && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-1 text-[12px] text-muted-foreground/80 hover:text-foreground"
            onMouseEnter={() => setHoverEnglish(true)}
            onMouseLeave={() => setHoverEnglish(false)}
            onClick={() => setHoverEnglish((p) => !p)}
            aria-label={t("toggleEnglish")}
          >
            <Info className="size-3" />
            {hoverEnglish || showEnglish ? englishMeaning : t("englishHover")}
          </button>
        </div>
      )}

      {/* slow audio */}
      {audioSlowUrl && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => playAudio(audioSlowUrl)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t("slowAudio")}
          </button>
        </div>
      )}
    </div>
  );
}
