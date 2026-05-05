import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { VocabSearch, type SearchableVocab } from "@/components/learner/vocab-search";

const CATEGORY_LABELS: Record<string, string> = {
  // A1
  "a1-greetings": "招呼用語",
  "a1-selfintro": "自我介紹",
  "a1-numbers": "數字",
  "a1-time": "時間",
  "a1-body": "身體部位",
  "a1-family": "家人",
  "a1-food": "食物",
  "a1-feeding": "餵食",
  "a1-medicine": "餵藥",
  "a1-care": "翻身換尿布",
  "a1-measure": "量測",
  "a1-toilet": "上廁所·洗澡",
  // A2
  "a2-condition": "詢問身體狀況",
  "a2-medical": "醫療術語",
  "a2-family": "家屬溝通",
  // AAY-FINANCE
  "f01-org": "機構與單位",
  "f02-report": "報表類型",
  "f03-period": "期別與表頭",
  "f04-income": "收入科目",
  "f05-personnel": "人事費",
  "f06-operating": "事務維護費",
  "f07-insurance": "保險與其他",
  "f08-material": "業務材料費",
  "f09-admin": "行政與分攤",
  "f10-profit": "損益指標",
  "f11-deprec": "折舊資料表",
  "f12-measure": "量詞與時間",
  "f13-asset": "設備資產名稱",
  "f14-glossary": "補助與業務常用詞",
};

export default async function VocabularyLibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  // Pull every elder-care vocab record
  const allVocab = await db.vocabulary.findMany({
    where: { isEldercareVocab: true },
    select: {
      hanzi: true,
      pinyin: true,
      translations: true,
      category: true,
      level: true,
      partOfSpeech: true,
    },
    orderBy: [{ level: "asc" }, { category: "asc" }],
  });

  // Group by category, in original order
  const grouped: Record<string, typeof allVocab> = {};
  const orderedCategories: string[] = [];
  for (const v of allVocab) {
    if (!grouped[v.category]) {
      grouped[v.category] = [];
      orderedCategories.push(v.category);
    }
    grouped[v.category]!.push(v);
  }

  return (
    <div className="space-y-3 px-4 pb-4">
      <Link
        href={`/${locale}/practice`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        返回
      </Link>

      <header className="space-y-0.5">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--aiai-green-600)" }}
        >
          <BookOpen className="mr-1 inline size-3" />
          詞彙庫 · VOCABULARY
        </p>
        <h1 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          {allVocab.length} 個詞彙 · {orderedCategories.length} 個分類
        </h1>
        <p className="text-xs" style={{ color: "var(--aiai-gray-400)" }}>
          คลิกที่คำเพื่อดูรูปและการใช้งาน
        </p>
      </header>

      {/* Live search bar */}
      <VocabSearch
        locale={locale}
        vocabulary={allVocab.map((v): SearchableVocab => {
          const tr = v.translations as Record<string, string> | null;
          const pickReal = (k: string) => (tr && !k.startsWith("_") ? tr[k] : undefined);
          return {
            hanzi: v.hanzi,
            pinyin: v.pinyin,
            translation: pickReal(locale) ?? pickReal("en") ?? pickReal("th") ?? "",
            category: v.category,
            level: v.level,
          };
        })}
      />

      {orderedCategories.map((cat) => {
        const items = grouped[cat]!;
        const label = CATEGORY_LABELS[cat] ?? cat;
        const level = items[0]!.level;
        return (
          <section key={cat} className="space-y-1.5">
            <header
              className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{ background: "var(--aiai-green-50)" }}
            >
              <span
                className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest"
                style={{ background: "var(--aiai-green-400)", color: "#fff" }}
              >
                {level === "A1_BEGINNER" ? "A1" : level === "A2_BASIC" ? "A2" : level === "ZHUYIN" ? "ZH" : level}
              </span>
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--aiai-green-800)" }}
              >
                {label}
              </h2>
              <span
                className="ml-auto text-[10px] tabular-nums"
                style={{ color: "var(--aiai-green-700)" }}
              >
                {items.length} 字
              </span>
            </header>
            <ul className="grid grid-cols-2 gap-1.5">
              {items.map((v) => {
                const tr = v.translations as Record<string, string> | null;
                const pickReal = (k: string) => (tr && !k.startsWith("_") ? tr[k] : undefined);
                const trans = pickReal(locale) ?? pickReal("en") ?? pickReal("th") ?? "";
                return (
                  <li key={v.hanzi}>
                    <Link
                      href={`/${locale}/words/${encodeURIComponent(v.hanzi)}`}
                      className="block rounded-xl border bg-white p-2 transition-all hover:shadow-md active:scale-[0.99]"
                      style={{ borderColor: "var(--aiai-gray-200)" }}
                    >
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/vocab-image/${encodeURIComponent(v.hanzi)}`}
                          alt=""
                          loading="lazy"
                          className="size-12 shrink-0 rounded-lg object-cover"
                          style={{ background: "var(--aiai-green-50)" }}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-base font-bold"
                            style={{ color: "var(--aiai-gray-800)" }}
                          >
                            {v.hanzi}
                          </p>
                          <p
                            className="truncate text-[10px]"
                            style={{ color: "var(--aiai-green-600)" }}
                          >
                            {v.pinyin}
                          </p>
                          <p
                            className="truncate text-[10px]"
                            style={{ color: "var(--aiai-gray-500)" }}
                          >
                            {trans}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
