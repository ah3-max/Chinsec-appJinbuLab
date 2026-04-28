"use client";

import { useTranslations } from "next-intl";
import { Volume2 } from "lucide-react";
import {
  TranslationReportButton,
  type TranslationTarget,
} from "./translation-report-button";

export interface SentenceCardProps {
  sentenceId: string;
  hanzi: string;
  pinyin: string;
  thaiTranslation: string;
  audioUrl?: string;
  highlightWords?: string[];
  speaker?: string;
  uiLanguage?: string;
  variant?: "plain" | "speaker-left" | "speaker-right";
}

export function SentenceCard({
  sentenceId,
  hanzi,
  pinyin,
  thaiTranslation,
  audioUrl,
  highlightWords,
  speaker,
  uiLanguage = "th",
  variant = "plain",
}: SentenceCardProps) {
  const t = useTranslations("sentenceCard");

  const target: TranslationTarget = {
    contentType: "sentence",
    contentId: sentenceId,
    language: uiLanguage,
    originalText: thaiTranslation,
  };

  const playAudio = () => {
    if (!audioUrl) return;
    new Audio(audioUrl).play().catch(() => {});
  };

  // highlight any matched substring
  const renderHanzi = () => {
    if (!highlightWords || highlightWords.length === 0) return hanzi;
    let out: Array<{ text: string; isHi: boolean }> = [{ text: hanzi, isHi: false }];
    for (const w of highlightWords) {
      const next: typeof out = [];
      for (const seg of out) {
        if (seg.isHi) {
          next.push(seg);
          continue;
        }
        const parts = seg.text.split(w);
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) next.push({ text: parts[i]!, isHi: false });
          if (i < parts.length - 1) next.push({ text: w, isHi: true });
        }
      }
      out = next;
    }
    return out.map((seg, i) =>
      seg.isHi ? (
        <span
          key={i}
          className="rounded px-0.5"
          style={{
            background: "var(--aiai-orange-50)",
            color: "var(--aiai-orange-800)",
          }}
        >
          {seg.text}
        </span>
      ) : (
        <span key={i}>{seg.text}</span>
      ),
    );
  };

  const align =
    variant === "speaker-right"
      ? "items-end text-right"
      : variant === "speaker-left"
        ? "items-start text-left"
        : "items-stretch text-left";

  return (
    <div
      className={`flex flex-col ${align} rounded-xl border bg-card px-4 py-3 shadow-sm`}
    >
      {speaker && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {speaker}
        </p>
      )}
      <div className="flex items-start gap-2">
        <p className="flex-1 text-[18px] font-semibold leading-relaxed sm:text-[20px]">
          {renderHanzi()}
        </p>
        {audioUrl && (
          <button
            type="button"
            onClick={playAudio}
            className="shrink-0 rounded-full p-1.5 transition-colors hover:opacity-80"
            style={{
              color: "var(--aiai-green-600)",
              background: "var(--aiai-green-50)",
            }}
            aria-label={t("playAudio")}
          >
            <Volume2 className="size-4" />
          </button>
        )}
      </div>
      <p className="mt-0.5 text-[14px] italic text-muted-foreground">{pinyin}</p>
      <TranslationReportButton target={target} className="block">
        <p className="mt-1 text-[16px] leading-relaxed">{thaiTranslation}</p>
      </TranslationReportButton>
    </div>
  );
}
