import Link from "next/link";
import { Volume2, Sparkles } from "lucide-react";

export interface DailyWord {
  hanzi: string;
  pinyin: string;
  zhuyin?: string;
  translation: string;
  partOfSpeech?: string;
  level: string;
  imageUrl: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  mnemonic?: string;
}

const LEVEL_LABEL: Record<string, string> = {
  ZHUYIN: "ZH",
  A1_BEGINNER: "A1",
  A2_BASIC: "A2",
  B1_INTERMEDIATE: "B1",
  B2_UPPER_INTER: "B2",
};

export function WordOfTheDay({ word, locale }: { word: DailyWord; locale: string }) {
  return (
    <Link
      href={`/${locale}/words/${encodeURIComponent(word.hanzi)}`}
      className="block transition-all active:scale-[0.99]"
    >
      <article
        className="overflow-hidden rounded-2xl border-2 shadow-sm"
        style={{
          borderColor: "#a78bfa",
          background: "linear-gradient(135deg, #f5f3ff 0%, #fff 100%)",
        }}
      >
        <header
          className="flex items-center gap-2 px-4 py-2 text-white"
          style={{ background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)" }}
        >
          <Sparkles className="size-4" />
          <span className="text-xs font-bold uppercase tracking-widest">
            คำศัพท์ประจำวัน · WORD OF THE DAY
          </span>
        </header>

        <div className="flex gap-3 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={word.imageUrl}
            alt=""
            loading="lazy"
            className="size-24 shrink-0 rounded-xl object-cover"
            style={{ background: "var(--aiai-green-50)" }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <h3
                className="text-3xl font-bold"
                style={{ color: "var(--aiai-gray-800)" }}
              >
                {word.hanzi}
              </h3>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-widest"
                style={{ background: "#ddd6fe", color: "#6b21a8" }}
              >
                {LEVEL_LABEL[word.level] ?? word.level}
              </span>
            </div>
            <p
              className="text-xs italic"
              style={{ color: "var(--aiai-green-600)" }}
            >
              {word.pinyin}
              {word.partOfSpeech ? ` · ${word.partOfSpeech}` : ""}
            </p>
            <p
              className="mt-1 truncate text-sm"
              style={{ color: "var(--aiai-gray-700)" }}
            >
              {word.translation}
            </p>
            {word.exampleSentence && (
              <div
                className="mt-1.5 rounded-lg px-2 py-1"
                style={{ background: "rgba(139, 92, 246, 0.08)" }}
              >
                <p
                  className="truncate text-[11px] font-medium"
                  style={{ color: "var(--aiai-gray-700)" }}
                >
                  📝 {word.exampleSentence}
                </p>
                {word.exampleTranslation && (
                  <p
                    className="truncate text-[10px]"
                    style={{ color: "var(--aiai-gray-500)" }}
                  >
                    {word.exampleTranslation}
                  </p>
                )}
              </div>
            )}
            {word.mnemonic && !word.exampleSentence && (
              <p
                className="mt-1.5 truncate text-[11px]"
                style={{ color: "#6b21a8" }}
              >
                💡 {word.mnemonic}
              </p>
            )}
          </div>
          <Volume2 className="size-4 shrink-0" style={{ color: "#a78bfa" }} />
        </div>
      </article>
    </Link>
  );
}
