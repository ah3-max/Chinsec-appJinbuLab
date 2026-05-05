import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, Star } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const LEVEL_LABEL: Record<string, string> = {
  ZHUYIN: "ZH",
  A1_BEGINNER: "A1",
  A2_BASIC: "A2",
  B1_INTERMEDIATE: "B1",
  B2_UPPER_INTER: "B2",
};

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const bookmarks = await db.vocabBookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { hanzi: true, createdAt: true, note: true },
  });

  // Pull vocabulary metadata for all bookmarked hanzi in one query
  const vocabRecords = bookmarks.length
    ? await db.vocabulary.findMany({
        where: { hanzi: { in: bookmarks.map((b) => b.hanzi) } },
        select: { hanzi: true, pinyin: true, translations: true, level: true, partOfSpeech: true },
      })
    : [];
  const vocabMap = new Map(vocabRecords.map((v) => [v.hanzi, v]));

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

      <header
        className="overflow-hidden rounded-2xl px-5 py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)" }}
      >
        <div className="flex items-center gap-3">
          <Star className="size-7" style={{ fill: "#fff" }} />
          <div>
            <h1 className="text-xl font-bold">⭐ คำที่บันทึก · BOOKMARKS</h1>
            <p className="text-xs opacity-90">
              {bookmarks.length} 個收藏 · กดดาวจากหน้าคำเพื่อเพิ่ม
            </p>
          </div>
        </div>
      </header>

      {bookmarks.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed py-12 text-center"
          style={{ borderColor: "var(--aiai-gray-200)" }}
        >
          <div className="text-4xl">⭐</div>
          <p className="text-sm" style={{ color: "var(--aiai-gray-500)" }}>
            ยังไม่มีคำที่บันทึก
          </p>
          <p className="max-w-sm text-xs" style={{ color: "var(--aiai-gray-400)" }}>
            เปิดหน้า《詞彙庫 / Vocabulary Library》หรือหน้ารายละเอียดคำใดๆ แล้วกดปุ่ม ⭐ เพื่อบันทึกคำที่อยากทบทวน
          </p>
          <Link
            href={`/${locale}/practice/vocabulary`}
            className="mt-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "#d97706" }}
          >
            เปิดคลังคำศัพท์ →
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {bookmarks.map((b) => {
            const v = vocabMap.get(b.hanzi);
            const tr = v?.translations as Record<string, string> | null;
            const pickReal = (k: string) => (tr && !k.startsWith("_") ? tr[k] : undefined);
            const trans = pickReal(locale) ?? pickReal("en") ?? pickReal("th") ?? "";
            return (
              <li key={b.hanzi}>
                <Link
                  href={`/${locale}/words/${encodeURIComponent(b.hanzi)}`}
                  className="block rounded-xl border bg-white p-3 transition-all hover:shadow-md active:scale-[0.99]"
                  style={{ borderColor: "#fde68a" }}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/vocab-image/${encodeURIComponent(b.hanzi)}`}
                      alt=""
                      loading="lazy"
                      className="size-14 shrink-0 rounded-lg object-cover"
                      style={{ background: "var(--aiai-green-50)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="truncate text-lg font-bold" style={{ color: "var(--aiai-gray-800)" }}>
                          {b.hanzi}
                        </p>
                        {v?.level && (
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-widest"
                            style={{ background: "#fde68a", color: "#92400e" }}
                          >
                            {LEVEL_LABEL[v.level] ?? v.level}
                          </span>
                        )}
                      </div>
                      {v?.pinyin && (
                        <p className="truncate text-[11px] italic" style={{ color: "var(--aiai-green-600)" }}>
                          {v.pinyin}
                        </p>
                      )}
                      <p className="truncate text-xs" style={{ color: "var(--aiai-gray-500)" }}>
                        {trans}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--aiai-gray-400)" }}>
                        ⭐ {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
