import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Headphones, BookOpen, PenTool, Trophy, Shuffle, Library, RefreshCcw, Star } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  // Pull a few stats so the practice page feels alive
  const [vocabCount, exerciseCount, weeklyExamCount, bookmarkCount] = await Promise.all([
    db.vocabulary.count({ where: { isEldercareVocab: true } }),
    db.exercise.count({ where: { isActive: true } }),
    db.mockExam.count({
      where: { code: { startsWith: "WEEKLY-" }, isPublished: true },
    }),
    db.vocabBookmark.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="space-y-3 px-4 pb-4">
      <h1 className="text-2xl font-bold">{tNav("practice")}</h1>
      <p className="text-xs text-muted-foreground">
        {vocabCount} 個詞彙 · {exerciseCount} 道練習題 · {weeklyExamCount} 場週考
      </p>

      <Link href={`/${locale}/practice/zhuyin`} className="block">
        <Card className="transition-all hover:shadow-md active:scale-[0.99]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500 text-2xl font-bold text-white shadow-sm">
                ㄅ
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">注音聽音選字</CardTitle>
                <CardDescription>ZHUYIN · 37 注音 · 隨機混合</CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={`/${locale}/learn`} className="block">
        <Card
          className="transition-all hover:shadow-md active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fff 100%)", borderColor: "#fb923c" }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl text-2xl shadow-sm"
                style={{ background: "#fb923c", color: "#fff" }}
              >
                <Trophy className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">每週考試</CardTitle>
                <CardDescription>聽力 · 閱讀 · 手寫測驗 · {weeklyExamCount} 場</CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={`/${locale}/learn/leaderboard`} className="block">
        <Card className="transition-all hover:shadow-md active:scale-[0.99]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-400 text-white shadow-sm">
                <Trophy className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">🏅 排行榜</CardTitle>
                <CardDescription>本週 XP 排名</CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={`/${locale}/practice/vocabulary`} className="block">
        <Card
          className="transition-all hover:shadow-md active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #fff 100%)",
            borderColor: "#93c5fd",
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "#3b82f6" }}
              >
                <Library className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">詞彙庫</CardTitle>
                <CardDescription>{vocabCount} 個詞彙 · 圖片 · 拼音 · 翻譯</CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={`/${locale}/practice/bookmarks`} className="block">
        <Card
          className="transition-all hover:shadow-md active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #fffbeb 0%, #fff 100%)",
            borderColor: "#fbbf24",
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "#d97706" }}
              >
                <Star className="size-5" style={{ fill: "#fff" }} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">⭐ คำที่บันทึก / Bookmarks</CardTitle>
                <CardDescription>
                  {bookmarkCount === 0 ? "ยังไม่มีคำที่บันทึก" : `${bookmarkCount} 個收藏的詞彙`}
                </CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={`/${locale}/practice/review`} className="block">
        <Card
          className="transition-all hover:shadow-md active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #fff 100%)",
            borderColor: "#fb923c",
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "#fb923c" }}
              >
                <RefreshCcw className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">ทบทวนคำที่เคยผิด</CardTitle>
                <CardDescription>SRS · 10 ข้อจากคำที่ตอบผิดล่าสุด</CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href={`/${locale}/practice/random`} className="block">
        <Card
          className="transition-all hover:shadow-md active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #fff 100%)",
            borderColor: "var(--aiai-green-200)",
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "var(--aiai-green-500, #22c55e)" }}
              >
                <Shuffle className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">隨機練習</CardTitle>
                <CardDescription>10 道隨機題目 · 跨課程混合</CardDescription>
              </div>
              <span className="text-xl">→</span>
            </div>
          </CardHeader>
        </Card>
      </Link>

      {/* Coming soon */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <ComingSoon icon={<Headphones className="size-4" />} label="聽寫練習" />
        <ComingSoon icon={<PenTool className="size-4" />} label="手寫練習" />
      </div>
    </div>
  );
}

function ComingSoon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="rounded-xl border-2 border-dashed p-3 text-center opacity-60"
      style={{ borderColor: "var(--aiai-gray-200)" }}
    >
      <div className="flex justify-center" style={{ color: "var(--aiai-gray-500)" }}>
        {icon}
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
      <p className="text-[9px] text-muted-foreground">即將推出</p>
    </div>
  );
}
