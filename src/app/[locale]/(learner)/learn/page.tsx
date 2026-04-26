import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const t = await getTranslations("home");
  const tLevels = await getTranslations("levels");

  // 撈使用者進度（若已登入）
  const me = session?.user?.id
    ? await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          fullName: true,
          currentLevel: true,
          totalXp: true,
          streakDays: true,
        },
      })
    : null;

  // 撈已開的課程作為闖關地圖入口
  const courses = await db.course.findMany({
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      level: true,
      themeColor: true,
      vocabularyCount: true,
      estimatedHours: true,
    },
  });

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {me ? `Hi, ${me.fullName}` : t("welcome")}
        </p>
        <h1 className="text-2xl font-bold">{t("subtitle")}</h1>
      </header>

      {/* 學習狀態 */}
      {me && (
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="XP" value={me.totalXp.toString()} />
          <StatBox
            label={t("streak", { days: me.streakDays })}
            value={`${me.streakDays}🔥`}
          />
          <StatBox label="Level" value={tLevels(me.currentLevel)} />
        </div>
      )}

      {/* 課程入口（闖關地圖 placeholder） */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t("myCourses")}</h2>
        <div className="space-y-3">
          {courses.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                    style={{ backgroundColor: c.themeColor ?? "#3B82F6" }}
                  >
                    {c.code[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {tLevels(c.level)} ・ {c.vocabularyCount} 字
                      {c.estimatedHours ? ` ・ ${c.estimatedHours}h` : ""}
                    </p>
                  </div>
                </div>
              </CardHeader>
              {c.description && (
                <CardContent className="text-sm text-muted-foreground">
                  {c.description}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center shadow-sm">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
