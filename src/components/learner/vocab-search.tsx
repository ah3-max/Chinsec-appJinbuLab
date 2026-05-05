"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

export interface SearchableVocab {
  hanzi: string;
  pinyin: string;
  translation: string;
  category: string;
  level: string;
}

const LEVEL_LABEL: Record<string, string> = {
  ZHUYIN: "ZH",
  A1_BEGINNER: "A1",
  A2_BASIC: "A2",
  B1_INTERMEDIATE: "B1",
  B2_UPPER_INTER: "B2",
  C1_ADVANCED: "C1",
  C2_PROFICIENT: "C2",
};

export function VocabSearch({
  locale,
  vocabulary,
}: {
  locale: string;
  vocabulary: SearchableVocab[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return vocabulary
      .filter((v) => {
        return (
          v.hanzi.includes(q) ||
          v.pinyin.toLowerCase().includes(q) ||
          v.translation.toLowerCase().includes(q)
        );
      })
      .slice(0, 30);
  }, [query, vocabulary]);

  return (
    <div className="space-y-2">
      <div
        className="relative rounded-2xl border-2 bg-white shadow-sm"
        style={{ borderColor: query ? "var(--aiai-green-400)" : "var(--aiai-gray-200)" }}
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          style={{ color: "var(--aiai-gray-400)" }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหา 漢字 / pinyin / ความหมาย"
          className="w-full bg-transparent px-9 py-2.5 text-sm outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="clear"
          >
            <X className="size-4" style={{ color: "var(--aiai-gray-400)" }} />
          </button>
        )}
      </div>

      {query && (
        <div
          className="rounded-2xl border bg-white p-2"
          style={{ borderColor: "var(--aiai-green-100)" }}
        >
          {results.length === 0 ? (
            <p
              className="py-3 text-center text-xs"
              style={{ color: "var(--aiai-gray-400)" }}
            >
              ไม่พบคำที่ค้นหา
            </p>
          ) : (
            <>
              <p
                className="px-1 pb-1 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--aiai-green-700)" }}
              >
                พบ {results.length} คำ
              </p>
              <ul className="grid grid-cols-1 gap-1">
                {results.map((v) => (
                  <li key={v.hanzi}>
                    <Link
                      href={`/${locale}/words/${encodeURIComponent(v.hanzi)}`}
                      className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/vocab-image/${encodeURIComponent(v.hanzi)}`}
                        alt=""
                        loading="lazy"
                        className="size-10 shrink-0 rounded-lg object-cover"
                        style={{ background: "var(--aiai-green-50)" }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <p
                            className="truncate text-base font-bold"
                            style={{ color: "var(--aiai-gray-800)" }}
                          >
                            {v.hanzi}
                          </p>
                          <p
                            className="text-[10px] italic"
                            style={{ color: "var(--aiai-green-600)" }}
                          >
                            {v.pinyin}
                          </p>
                        </div>
                        <p
                          className="truncate text-[11px]"
                          style={{ color: "var(--aiai-gray-500)" }}
                        >
                          {v.translation}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-widest"
                        style={{
                          background: "var(--aiai-green-100)",
                          color: "var(--aiai-green-700)",
                        }}
                      >
                        {LEVEL_LABEL[v.level] ?? v.level}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
