import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MYWORK_SECTIONS, pickLabel } from "@/lib/mywork-categories";

export default async function MyWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  // Single grouped count query for every category we display.
  const allCodes = MYWORK_SECTIONS.flatMap((s) => s.categories.map((c) => c.code));
  const counts = await db.vocabulary.groupBy({
    by: ["category"],
    where: { category: { in: allCodes } },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((r) => [r.category, r._count._all]));

  return (
    <div className="space-y-4 px-4 pb-4">
      <header>
        <h1 className="text-2xl font-bold">{tNav("mywork")}</h1>
        <p className="text-xs" style={{ color: "var(--aiai-gray-500)" }}>
          {locale === "zh-TW"
            ? "工作場域必備詞彙 · 分類整理"
            : locale === "th"
              ? "คำศัพท์ที่จำเป็นในที่ทำงาน · จัดหมวดหมู่ไว้"
              : locale === "vi"
                ? "Từ vựng thiết yếu cho công việc, sắp xếp theo chủ đề"
                : locale === "id"
                  ? "Kosakata penting untuk tempat kerja, dikelompokkan per kategori"
                  : "Workplace-essential vocabulary, organized by category"}
        </p>
      </header>

      {MYWORK_SECTIONS.map((section) => {
        const sectionTotal = section.categories.reduce(
          (sum, c) => sum + (countMap.get(c.code) ?? 0),
          0,
        );
        return (
          <section key={section.code} className="space-y-2">
            <div
              className="flex items-baseline gap-2 px-1"
              style={{ color: "var(--aiai-gray-700)" }}
            >
              <span className="text-xl">{section.emoji}</span>
              <h2 className="text-base font-bold">
                {pickLabel(section.labels, locale)}
              </h2>
              <span
                className="text-[11px]"
                style={{ color: "var(--aiai-gray-400)" }}
              >
                {section.hanziTitle} · {sectionTotal}
              </span>
            </div>

            <ul className="grid grid-cols-1 gap-1.5">
              {section.categories.map((cat) => {
                const n = countMap.get(cat.code) ?? 0;
                return (
                  <li key={cat.code}>
                    <Link
                      href={`/${locale}/mywork/${cat.code}`}
                      className="block transition-all active:scale-[0.99] hover:shadow-md"
                    >
                      <article
                        className="flex items-center gap-3 rounded-2xl border-2 bg-white p-3 shadow-sm"
                        style={{ borderColor: "var(--aiai-green-100)" }}
                      >
                        <div
                          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--aiai-green-100) 0%, var(--aiai-green-50) 100%)",
                          }}
                        >
                          {cat.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className="truncate text-sm font-semibold"
                            style={{ color: "var(--aiai-gray-800)" }}
                          >
                            {pickLabel(cat.labels, locale)}
                          </h3>
                          <p
                            className="truncate text-[11px]"
                            style={{ color: "var(--aiai-gray-400)" }}
                          >
                            {cat.hanziTitle} · {n} {locale === "th" ? "คำ" : locale === "vi" ? "từ" : locale === "id" ? "kata" : locale === "zh-TW" ? "個" : "words"}
                          </p>
                        </div>
                        <ChevronRight
                          className="size-5 shrink-0"
                          style={{ color: "var(--aiai-green-500)" }}
                        />
                      </article>
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
