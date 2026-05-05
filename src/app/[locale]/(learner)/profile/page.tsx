import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Trophy, Headphones, BookOpen, PenTool, Flame, Sparkles, Calendar } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { LocaleSwitcher } from "@/components/auth/locale-switcher";
import { StreakCalendar, type DayActivity } from "@/components/learner/streak-calendar";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const userId = session.user.id;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const calendarStart = new Date();
  calendarStart.setDate(calendarStart.getDate() - 89);
  calendarStart.setHours(0, 0, 0, 0);

  const [
    me,
    totalAttempts,
    correctAttempts,
    weeklyAttempts,
    completedLessonGroups,
    weeklyExamAttempts,
    recentSessions,
    calendarAttempts,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        username: true,
        email: true,
        role: true,
        nationality: true,
        currentLevel: true,
        totalXp: true,
        weeklyXp: true,
        streakDays: true,
        totalStudyMin: true,
        facility: { select: { name: true, shortName: true } },
      },
    }),
    db.userAttempt.count({ where: { userId } }),
    db.userAttempt.count({ where: { userId, isCorrect: true } }),
    db.userAttempt.count({
      where: { userId, attemptedAt: { gte: weekStart } },
    }),
    // Distinct lessonId for which we have at least one correct attempt
    db.userAttempt.findMany({
      where: { userId, isCorrect: true },
      distinct: ["exerciseId"],
      select: { exercise: { select: { lessonId: true } } },
    }),
    db.examAttempt.findMany({
      where: { userId, exam: { code: { startsWith: "WEEKLY-" } } },
      orderBy: { startedAt: "desc" },
      take: 5,
      select: {
        id: true,
        totalScore: true,
        passed: true,
        startedAt: true,
        listeningScore: true,
        readingScore: true,
        writingScore: true,
        exam: { select: { code: true, title: true, maxScore: true } },
      },
    }),
    db.userAttempt.groupBy({
      by: ["sessionKey"],
      where: { userId, sessionKey: { not: null } },
      _max: { attemptedAt: true },
      _sum: { score: true },
      _count: { _all: true },
      orderBy: { _max: { attemptedAt: "desc" } },
      take: 5,
    }),
    // 90-day calendar — raw rows, group in JS by local-tz date
    db.userAttempt.findMany({
      where: { userId, attemptedAt: { gte: calendarStart } },
      select: { attemptedAt: true, score: true },
    }),
  ]);

  // Group calendar attempts into per-day buckets keyed by YYYY-MM-DD (server local tz)
  const dayBuckets = new Map<string, { xp: number; attempts: number }>();
  for (const a of calendarAttempts) {
    const d = new Date(a.attemptedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const cur = dayBuckets.get(key) ?? { xp: 0, attempts: 0 };
    cur.xp += a.score;
    cur.attempts += 1;
    dayBuckets.set(key, cur);
  }
  const dayActivity: DayActivity[] = Array.from(dayBuckets.entries()).map(([date, v]) => ({
    date,
    xp: v.xp,
    attempts: v.attempts,
  }));
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const tNav = await getTranslations("nav");
  const tLevels = await getTranslations("levels");

  if (!me) redirect(`/${locale}/login`);

  const accuracy =
    totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

  const completedLessons = new Set(
    completedLessonGroups.map((g) => g.exercise?.lessonId).filter(Boolean) as string[],
  ).size;

  return (
    <div className="space-y-4 px-4 pb-4">
      <h1 className="text-2xl font-bold">{tNav("profile")}</h1>

      {/* 基本資料 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {me.fullName?.[0] ?? "?"}
            </div>
            <div>
              <CardTitle className="text-lg">{me.fullName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                @{me.username} ・ {me.role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {me.email && <Row label="Email" value={me.email} />}
          <Row label="國籍" value={me.nationality} />
          {me.facility && <Row label="所屬機構" value={me.facility.name} />}
          <Row label="目前等級" value={tLevels(me.currentLevel)} />
        </CardContent>
      </Card>

      {/* 學習統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4" /> 學習統計
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <BigStat icon="⚡" label="總 XP" value={me.totalXp} />
            <BigStat icon="🔥" label="連續天" value={me.streakDays} />
            <BigStat icon="⏱" label="學習分鐘" value={me.totalStudyMin} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <BigStat icon="📈" label="本週 XP" value={me.weeklyXp} />
            <BigStat icon="✅" label="完成課程" value={completedLessons} />
            <BigStat icon="🎯" label="正確率" value={`${accuracy}%`} />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            最近 7 天答題 {weeklyAttempts} 次 · 累計 {totalAttempts} 次
          </p>
        </CardContent>
      </Card>

      {/* 90-day study heatmap */}
      <StreakCalendar activity={dayActivity} todayKey={todayKey} />

      {/* 每週考試紀錄 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="size-4" style={{ color: "#fb923c" }} /> 每週考試紀錄
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyExamAttempts.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-3">
              ยังไม่ได้สอบ — กดที่การ์ด 🏆 ด้านบนเพื่อเริ่ม
            </p>
          ) : (
            <ul className="space-y-2">
              {weeklyExamAttempts.map((a) => {
                const titleI18n = (a.exam as unknown as { titleI18n?: Record<string, string> }).titleI18n;
                const title = titleI18n?.[locale] ?? a.exam.title;
                const date = new Date(a.startedAt);
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl border p-3"
                    style={{
                      borderColor: a.passed ? "#86efac" : "#fed7aa",
                      background: a.passed ? "#f0fdf4" : "#fff7ed",
                    }}
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg"
                      style={{ background: "#fff", border: "1.5px solid", borderColor: a.passed ? "#22c55e" : "#fb923c" }}
                    >
                      {a.passed ? "✅" : "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold">{title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {date.toLocaleDateString()} · {a.totalScore}/{a.exam.maxScore}
                      </p>
                      <div className="mt-1 flex gap-1">
                        {a.listeningScore !== null && (
                          <SectionPill icon={<Headphones className="size-2.5" />} value={a.listeningScore} color="#3b82f6" />
                        )}
                        {a.readingScore !== null && (
                          <SectionPill icon={<BookOpen className="size-2.5" />} value={a.readingScore} color="#8b5cf6" />
                        )}
                        {a.writingScore !== null && (
                          <SectionPill icon={<PenTool className="size-2.5" />} value={a.writingScore} color="#ef4444" />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 最近活動 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="size-4" /> 最近活動
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-3">
              ยังไม่มีกิจกรรม
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recentSessions.map((s) => {
                const date = s._max.attemptedAt;
                return (
                  <li
                    key={s.sessionKey}
                    className="flex items-center justify-between rounded-lg p-2"
                    style={{ background: "var(--aiai-gray-100)" }}
                  >
                    <div className="text-xs">
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {s.sessionKey?.slice(0, 8)}…
                      </p>
                      <p>
                        {s._count._all} 題 · {s._sum.score ?? 0} 分
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {date ? new Date(date).toLocaleString() : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Language switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🌏 ภาษา / Language</CardTitle>
        </CardHeader>
        <CardContent>
          <LocaleSwitcher current={locale} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Link
          href={`/${locale}/profile/achievements`}
          className="rounded-full px-3 py-1.5 text-xs font-medium underline"
          style={{ color: "#fb923c" }}
        >
          🏆 成就
        </Link>
        <Link
          href={`/${locale}/learn/leaderboard`}
          className="rounded-full px-3 py-1.5 text-xs font-medium underline"
          style={{ color: "var(--aiai-green-700)" }}
        >
          🏅 排行榜
        </Link>
        <Link
          href={`/${locale}/settings`}
          className="rounded-full px-3 py-1.5 text-xs font-medium underline"
          style={{ color: "var(--aiai-green-700)" }}
        >
          ⚙️ ตั้งค่า
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="rounded-xl border-2 p-2.5"
      style={{
        borderColor: "var(--aiai-green-100)",
        background: "linear-gradient(135deg, #f0fdf4 0%, #fff 100%)",
      }}
    >
      <div className="text-base">{icon}</div>
      <div className="text-base font-bold tabular-nums" style={{ color: "var(--aiai-green-800)" }}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionPill({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-bold tabular-nums"
      style={{ background: color + "18", color }}
    >
      {icon}
      {value}
    </span>
  );
}
