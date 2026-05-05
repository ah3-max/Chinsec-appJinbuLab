import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { findCategoryByCode, pickLabel } from "@/lib/mywork-categories";

export default async function MyWorkCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoryCode: string }>;
}) {
  const { locale, categoryCode } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const found = findCategoryByCode(categoryCode);
  if (!found) notFound();
  const { section, category } = found;

  const vocab = await db.vocabulary.findMany({
    where: { category: categoryCode },
    select: { hanzi: true, pinyin: true, partOfSpeech: true, translations: true },
    orderBy: { hanzi: "asc" },
  });

  const pickReal = (t: Record<string, string> | null, k: string) =>
    t && !k.startsWith("_") ? t[k] : undefined;
  const pickLocale = (t: Record<string, string> | null) =>
    pickReal(t, locale) ?? pickReal(t, "en") ?? pickReal(t, "th") ?? "";

  return (
    <div className="space-y-3 px-4 pb-4">
      <Link
        href={`/${locale}/mywork`}
        className="inline-flex items-center gap-1 text-sm transition-colors"
        style={{ color: "var(--aiai-gray-500)" }}
      >
        <ChevronLeft className="size-4" />
        {pickLabel(section.labels, locale)}
      </Link>

      <header
        className="overflow-hidden rounded-2xl px-5 py-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, var(--aiai-green-100) 0%, var(--aiai-green-50) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm"
            style={{ background: "#fff" }}
          >
            {category.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-lg font-bold"
              style={{ color: "var(--aiai-gray-800)" }}
            >
              {pickLabel(category.labels, locale)}
            </h1>
            <p
              className="truncate text-xs"
              style={{ color: "var(--aiai-gray-500)" }}
            >
              {category.hanziTitle} · {vocab.length} {locale === "th" ? "คำ" : locale === "vi" ? "từ" : locale === "id" ? "kata" : locale === "zh-TW" ? "個詞" : "words"}
            </p>
          </div>
        </div>
      </header>

      {vocab.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed py-8 text-center text-sm"
          style={{ borderColor: "var(--aiai-gray-200)", color: "var(--aiai-gray-400)" }}
        >
          {locale === "th" ? "ยังไม่มีคำในหมวดนี้" : "No vocabulary in this category yet"}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2">
          {vocab.map((v) => {
            const tr = v.translations as Record<string, string> | null;
            const display = pickLocale(tr);
            return (
              <li key={v.hanzi}>
                <Link
                  href={`/${locale}/words/${encodeURIComponent(v.hanzi)}`}
                  className="block transition-all active:scale-[0.99] hover:shadow-md"
                >
                  <article
                    className="flex items-center gap-3 rounded-2xl border-2 bg-white p-3 shadow-sm"
                    style={{ borderColor: "var(--aiai-green-100)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-lg font-bold"
                          style={{ color: "var(--aiai-gray-800)" }}
                        >
                          {v.hanzi}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--aiai-green-600)" }}
                        >
                          {v.pinyin}
                        </span>
                        {v.partOfSpeech && (
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--aiai-gray-400)" }}
                          >
                            {v.partOfSpeech}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "var(--aiai-gray-500)" }}
                      >
                        {display}
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
