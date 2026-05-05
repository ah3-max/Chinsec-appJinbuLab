import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, Trophy } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  evaluateAll,
  CATEGORY_META,
  type AchievementCategory,
  type ResolvedAchievement,
} from "@/lib/achievements";

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);
  const userId = session.user.id;

  const [
    me,
    totalAttempts,
    correctAttempts,
    completedExerciseGroups,
    sessionGroups,
    weeklyExamsPassed,
    earliestRow,
    latestRow,
    distinctDays,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        totalXp: true,
        weeklyXp: true,
        streakDays: true,
        totalStudyMin: true,
        currentLevel: true,
      },
    }),
    db.userAttempt.count({ where: { userId } }),
    db.userAttempt.count({ where: { userId, isCorrect: true } }),
    db.userAttempt.findMany({
      where: { userId, isCorrect: true },
      select: { exercise: { select: { lessonId: true } } },
      distinct: ["exerciseId"],
    }),
    db.userAttempt.findMany({
      where: { userId, sessionKey: { not: null } },
      select: { sessionKey: true },
      distinct: ["sessionKey"],
    }),
    db.examAttempt.count({
      where: { userId, passed: true, exam: { code: { startsWith: "WEEKLY-" } } },
    }),
    db.userAttempt.findFirst({
      where: { userId },
      orderBy: { attemptedAt: "asc" },
      select: { attemptedAt: true },
    }),
    db.userAttempt.findFirst({
      where: { userId },
      orderBy: { attemptedAt: "desc" },
      select: { attemptedAt: true },
    }),
    db.userAttempt.findMany({
      where: { userId },
      select: { attemptedAt: true },
      orderBy: { attemptedAt: "asc" },
    }),
  ]);

  if (!me) redirect(`/${locale}/login`);

  // Compute earliest / latest study hour and unique days
  const allTimes = distinctDays.map((d) => d.attemptedAt);
  let earliestStudyHour: number | null = null;
  let latestStudyHour: number | null = null;
  for (const t of allTimes) {
    const h = new Date(t).getHours();
    if (earliestStudyHour === null || h < earliestStudyHour) earliestStudyHour = h;
    if (latestStudyHour === null || h > latestStudyHour) latestStudyHour = h;
  }
  void earliestRow; void latestRow;

  const dayKeys = new Set(
    allTimes.map((t) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  const completedLessons = new Set(
    completedExerciseGroups.map((g) => g.exercise?.lessonId).filter(Boolean) as string[],
  ).size;

  const resolved = evaluateAll({
    totalXp: me.totalXp,
    weeklyXp: me.weeklyXp,
    streakDays: me.streakDays,
    totalStudyMin: me.totalStudyMin,
    currentLevel: me.currentLevel,
    completedLessons,
    totalAttempts,
    correctAttempts,
    totalSessions: sessionGroups.length,
    weeklyExamsPassed,
    earliestStudyHour,
    latestStudyHour,
    uniqueStudyDays: dayKeys.size,
  });

  const earned = resolved.filter((a) => a.earned);
  const grouped = resolved.reduce<Record<AchievementCategory, ResolvedAchievement[]>>(
    (acc, a) => {
      (acc[a.category] ??= []).push(a);
      return acc;
    },
    {} as Record<AchievementCategory, ResolvedAchievement[]>,
  );

  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/profile`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        กลับ
      </Link>

      {/* Hero */}
      <header
        className="relative overflow-hidden rounded-2xl px-5 py-5 text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)",
        }}
      >
        <div className="relative flex items-center gap-3">
          <Trophy className="size-9" />
          <div>
            <h1 className="text-xl font-bold">成就 · Achievements</h1>
            <p className="text-xs opacity-90 tabular-nums">
              {earned.length} / {resolved.length} ปลดล็อค ({Math.round((earned.length / resolved.length) * 100)}%)
            </p>
          </div>
        </div>
        {/* Overall progress bar */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${(earned.length / resolved.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Categories */}
      {(Object.keys(CATEGORY_META) as AchievementCategory[]).map((cat) => {
        const items = grouped[cat] ?? [];
        if (items.length === 0) return null;
        const meta = CATEGORY_META[cat];
        const earnedCount = items.filter((a) => a.earned).length;
        return (
          <section key={cat} className="space-y-2">
            <header
              className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{ background: meta.color + "18" }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: meta.color }}
              >
                {meta.labelTh} · {meta.labelZh}
              </h2>
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums"
                style={{ background: meta.color, color: "#fff" }}
              >
                {earnedCount}/{items.length}
              </span>
            </header>
            <ul className="grid grid-cols-2 gap-2">
              {items.map((a) => (
                <li
                  key={a.code}
                  className="rounded-2xl border-2 p-3"
                  style={{
                    borderColor: a.earned ? meta.color : "var(--aiai-gray-200)",
                    background: a.earned
                      ? `linear-gradient(135deg, ${meta.color}15 0%, #fff 100%)`
                      : "#fafafa",
                    opacity: a.earned ? 1 : 0.7,
                  }}
                >
                  <div
                    className="text-3xl"
                    style={{ filter: a.earned ? "none" : "grayscale(100%)" }}
                  >
                    {a.emoji}
                  </div>
                  <p
                    className="mt-1 truncate text-xs font-bold"
                    style={{ color: a.earned ? meta.color : "var(--aiai-gray-700)" }}
                  >
                    {a.titleTh}
                  </p>
                  <p
                    className="truncate text-[10px]"
                    style={{ color: "var(--aiai-gray-500)" }}
                  >
                    {a.descTh}
                  </p>
                  {/* Progress mini-bar */}
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${a.pct}%`,
                        background: a.earned ? meta.color : "var(--aiai-gray-400)",
                      }}
                    />
                  </div>
                  <p
                    className="mt-0.5 text-right font-mono text-[9px] tabular-nums"
                    style={{ color: "var(--aiai-gray-500)" }}
                  >
                    {a.progress}/{a.target}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
