import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Lock,
  ArrowRight,
  Check,
  Sparkles,
  MapPin,
  Clock,
  Flame,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { Level, type UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Logo } from "@/components/brand/logo";
import { classifyCourse, previousLevel, canAccess } from "@/lib/level";
import { getOrCreateTodayMissions } from "@/lib/daily-missions";
import { pickDailyWord } from "@/lib/word-of-the-day";
import { LearnLockedToast } from "@/components/learner/learn-locked-toast";
import { WordOfTheDay } from "@/components/learner/word-of-the-day";

const LEVEL_RANK: Record<Level, number> = {
  ZHUYIN: 0,
  A1_BEGINNER: 1,
  A2_BASIC: 2,
  B1_INTERMEDIATE: 3,
  B2_UPPER_INTER: 4,
  C1_ADVANCED: 5,
  C2_PROFICIENT: 6,
};

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
  const tLearn = await getTranslations("learn");

  const me = session?.user?.id
    ? await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          fullName: true,
          currentLevel: true,
          totalXp: true,
          streakDays: true,
          lastStreakDate: true,
        },
      })
    : null;

  // Streak risk: user has an active streak but didn't study yet today
  const startOfToday = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();
  const streakAtRisk =
    !!me &&
    me.streakDays > 0 &&
    me.lastStreakDate !== null &&
    me.lastStreakDate.getTime() < startOfToday.getTime();

  const courses = await db.course.findMany({
    where: { isPublished: true },
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
      stages: {
        select: { lessons: { where: { isPublished: true }, select: { id: true } } },
      },
    },
  });

  // Count completed lessons per course (lesson = "completed" if user has any
  // correct attempt on its exercises). One query, then bucket locally.
  const courseLessonMap = new Map<string, string[]>();
  for (const c of courses) {
    courseLessonMap.set(c.id, c.stages.flatMap((s) => s.lessons.map((l) => l.id)));
  }
  const allLessonIds = Array.from(courseLessonMap.values()).flat();
  const courseProgress = new Map<string, { completed: number; total: number }>();
  for (const c of courses) {
    courseProgress.set(c.id, {
      completed: 0,
      total: courseLessonMap.get(c.id)?.length ?? 0,
    });
  }
  if (session?.user?.id && allLessonIds.length > 0) {
    const completedLessons = await db.userAttempt.findMany({
      where: {
        userId: session.user.id,
        isCorrect: true,
        exercise: { lessonId: { in: allLessonIds } },
      },
      select: { exercise: { select: { lessonId: true } } },
      distinct: ["exerciseId"],
    });
    const completedSet = new Set(
      completedLessons.map((g) => g.exercise?.lessonId).filter(Boolean) as string[],
    );
    for (const c of courses) {
      const ids = courseLessonMap.get(c.id) ?? [];
      const completed = ids.filter((id) => completedSet.has(id)).length;
      courseProgress.set(c.id, { completed, total: ids.length });
    }
  }

  const userLevel: Level = me?.currentLevel ?? Level.ZHUYIN;
  const userRole: UserRole | undefined = session?.user?.role;
  const scenarios = await db.scenario.findMany({
    where: { isPublished: true },
    orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
    select: {
      id: true,
      code: true,
      title: true,
      titleI18n: true,
      level: true,
      orderIndex: true,
      estimatedMinutes: true,
      mtcAlignment: true,
    },
  });

  function classify(courseLevel: Level) {
    const userIdx = LEVEL_RANK[userLevel];
    const courseIdx = LEVEL_RANK[courseLevel];
    const completed = courseIdx < userIdx;
    return classifyCourse(userLevel, courseLevel, completed, userRole);
  }

  return (
    <div className="space-y-5 px-4 pb-4">
      <LearnLockedToast />

      {/* Brand-tinted hero header */}
      <header
        className="relative overflow-hidden rounded-2xl px-5 py-5 text-white shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, var(--aiai-green-400) 0%, var(--aiai-green-600) 100%)",
        }}
      >
        <div
          className="absolute -right-6 -top-6 size-32 rounded-full opacity-20"
          style={{ background: "var(--aiai-green-100)" }}
          aria-hidden
        />
        <div className="relative flex items-center gap-3">
          <Logo size={48} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium opacity-90">
              {greetingByHour()}{me ? `, ${me.fullName}` : ""}
            </p>
            <p
              className="text-[11px] uppercase tracking-wide opacity-80"
              style={{ letterSpacing: "0.06em" }}
            >
              JinBuLap · {new Date().toLocaleDateString(locale === "th" ? "th-TH" : "zh-TW", { month: "short", day: "numeric", weekday: "short" })}
            </p>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      {me && (
        <div className="grid grid-cols-3 gap-2">
          <StatBox
            icon={<BookOpen className="size-3.5" />}
            label="XP"
            value={me.totalXp.toString()}
            tone="green"
          />
          <StatBox
            icon={<Flame className="size-3.5" />}
            label={t("streak", { days: me.streakDays })}
            value={`${me.streakDays}`}
            tone="orange"
          />
          <StatBox
            icon={<Sparkles className="size-3.5" />}
            label="Level"
            value={tLevels(me.currentLevel)}
            tone="green"
          />
        </div>
      )}

      {/* Streak-at-risk warning */}
      {streakAtRisk && (
        <div
          className="flex items-center gap-3 rounded-2xl border-2 px-3 py-2 text-sm"
          style={{
            borderColor: "#fb923c",
            background: "linear-gradient(90deg, #fff7ed 0%, #fffbeb 100%)",
          }}
        >
          <span className="text-2xl">🔥</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold" style={{ color: "#c2410c" }}>
              อย่าเสียสตรีค {me?.streakDays} วัน!
            </p>
            <p className="text-xs" style={{ color: "#9a3412" }}>
              เรียนสักนิดเพื่อรักษาตัวเลข 🔥
            </p>
          </div>
        </div>
      )}

      {/* Word of the day */}
      {session?.user?.id && (
        <WordOfDayWrapper userId={session.user.id} userLevel={userLevel} locale={locale} />
      )}

      {/* Daily missions */}
      {session?.user?.id && <DailyMissionsCard userId={session.user.id} />}

      {/* Weekly Exam */}
      {session?.user?.id && (
        <WeeklyExamCard locale={locale} userId={session.user.id} />
      )}

      {/* My Course — My Work + My School + AAY-FINANCE (愛愛院財務報表). */}
      <section className="space-y-2">
        <h2
          className="text-base font-semibold"
          style={{ color: "var(--aiai-green-800)" }}
        >
          {t("myCourses")}
        </h2>
        <div className="space-y-2">
          {/* My Work — synthetic card, links to /mywork */}
          <Link
            href={`/${locale}/mywork`}
            className="block transition-transform active:scale-[0.99]"
          >
            <article
              className="rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              style={{ borderColor: "var(--aiai-green-100)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "var(--aiai-green-100)",
                    color: "var(--aiai-green-800)",
                  }}
                >
                  <Briefcase className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: "var(--aiai-gray-800)" }}
                  >
                    {locale === "zh-TW"
                      ? "工作詞彙 · MyWork"
                      : locale === "th"
                        ? "งานของฉัน · MyWork"
                        : locale === "vi"
                          ? "Công việc · MyWork"
                          : locale === "id"
                            ? "Pekerjaan · MyWork"
                            : "MyWork"}
                  </p>
                  <p
                    className="mt-0.5 text-[11px]"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    {locale === "zh-TW"
                      ? "職別 · 財務報表 · 設備資產"
                      : locale === "th"
                        ? "ตำแหน่งงาน · งบการเงิน · ทรัพย์สิน"
                        : locale === "vi"
                          ? "Chức vụ · Báo cáo tài chính · Tài sản"
                          : locale === "id"
                            ? "Jabatan · Laporan keuangan · Aset"
                            : "Job titles · Financials · Assets"}
                  </p>
                </div>
                <ArrowRight
                  className="size-4 shrink-0"
                  style={{ color: "var(--aiai-green-600)" }}
                />
              </div>
            </article>
          </Link>
          {/* My School (MY-SCHOOL) + 愛愛院財務報表 (AAY-FINANCE) */}
          <CourseList
            courses={courses.filter(
              (c) => c.code === "MY-SCHOOL" || c.code === "AAY-FINANCE",
            )}
            courseProgress={courseProgress}
            classify={classify}
            locale={locale}
            tLearn={tLearn}
            tLevels={tLevels}
          />
        </div>
      </section>

      {/* Eldercare scenario stages — scenarios + level-courses (注音, A1-C2) */}
      {(scenarios.length > 0 ||
        courses.some(
          (c) => c.code !== "MY-SCHOOL" && c.code !== "AAY-FINANCE",
        )) && (
        <section className="space-y-2">
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--aiai-green-800)" }}
          >
            {tLearn("scenariosHeading")}
          </h2>
          {scenarios.length > 0 && (
            <ScenarioList
              scenarios={scenarios}
              userLevel={userLevel}
              userRole={userRole}
              locale={locale}
              tLearn={tLearn}
              tLevels={tLevels}
            />
          )}
          {/* Level-progression courses (注音 / A1-C2). AAY-FINANCE moved to
              "My course" section above. */}
          {courses.filter(
            (c) => c.code !== "MY-SCHOOL" && c.code !== "AAY-FINANCE",
          ).length > 0 && (
            <CourseList
              courses={courses.filter(
                (c) => c.code !== "MY-SCHOOL" && c.code !== "AAY-FINANCE",
              )}
              courseProgress={courseProgress}
              classify={classify}
              locale={locale}
              tLearn={tLearn}
              tLevels={tLevels}
            />
          )}
        </section>
      )}

    </div>
  );
}

// ─── Reusable course-card list (used twice: My Course + Scenario stages) ───
interface CourseRow {
  id: string;
  code: string;
  title: string;
  description: string | null;
  level: Level;
  themeColor?: string | null;
  vocabularyCount: number;
  estimatedHours: number | null;
}

function CourseList({
  courses,
  courseProgress,
  classify,
  locale,
  tLearn,
  tLevels,
}: {
  courses: CourseRow[];
  courseProgress: Map<string, { completed: number; total: number }>;
  classify: (level: Level) => "open" | "preview" | "locked" | "completed";
  locale: string;
  tLearn: (key: string, vars?: Record<string, string | number>) => string;
  tLevels: (key: string) => string;
}) {
  return (
    <div className="space-y-2">
      {courses.map((c) => {
        const isRequired = c.code === "AAY-FINANCE";
        const state = isRequired ? "open" : classify(c.level);
        const locked = state === "locked";
        const preview = state === "preview";
        const completed = state === "completed";
        const open = state === "open";
        const prevName = previousLevel(c.level);
        const courseHref = `/${locale}/learn/${c.code}`;

        const Wrapper: React.ElementType = locked || preview ? "div" : Link;
        const wrapperProps =
          locked || preview ? {} : ({ href: courseHref } as { href: string });

        return (
          <Wrapper
            key={c.id}
            {...wrapperProps}
            className={
              locked || preview
                ? "block opacity-65"
                : "block transition-transform active:scale-[0.99]"
            }
          >
            <article
              className="rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              style={{
                borderColor: completed
                  ? "var(--aiai-green-200)"
                  : open
                    ? "var(--aiai-green-100)"
                    : "var(--aiai-gray-200)",
                borderStyle: locked || preview ? "dashed" : "solid",
                background: completed ? "var(--aiai-green-50)" : "#FFFFFF",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-base font-semibold"
                  style={{
                    background: completed
                      ? "var(--aiai-green-400)"
                      : open
                        ? "var(--aiai-green-100)"
                        : "var(--aiai-gray-200)",
                    color: completed
                      ? "#FFFFFF"
                      : open
                        ? "var(--aiai-green-800)"
                        : "var(--aiai-gray-600)",
                  }}
                >
                  {locked ? (
                    <Lock className="size-5" />
                  ) : completed ? (
                    <Check className="size-5" />
                  ) : preview ? (
                    <Sparkles className="size-5" />
                  ) : (
                    c.code[0]
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: "var(--aiai-gray-800)" }}
                    >
                      {c.title}
                    </p>
                    {c.code === "AAY-FINANCE" && (
                      <span
                        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold leading-none"
                        style={{
                          background: "var(--aiai-orange-600)",
                          color: "#FFFFFF",
                        }}
                      >
                        必修
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-0.5 text-[11px]"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    {tLevels(c.level)} · {c.vocabularyCount} 字
                    {c.estimatedHours ? ` · ${c.estimatedHours}h` : ""}
                  </p>
                </div>
                <div className="text-[11px]">
                  {state === "open" && (
                    <span
                      className="inline-flex items-center gap-0.5 font-medium"
                      style={{ color: "var(--aiai-green-600)" }}
                    >
                      {tLearn("startOrContinue")}
                      <ArrowRight className="size-3.5" />
                    </span>
                  )}
                  {state === "completed" && (
                    <span style={{ color: "var(--aiai-green-600)" }}>
                      {tLearn("review")}
                    </span>
                  )}
                  {state === "preview" && (
                    <span style={{ color: "var(--aiai-orange-600)" }}>
                      {tLearn("comingSoon")}
                    </span>
                  )}
                  {state === "locked" && prevName && (
                    <span style={{ color: "var(--aiai-gray-400)" }}>
                      {tLearn("finishPrevToUnlock", {
                        prev: tLevels(prevName),
                      })}
                    </span>
                  )}
                </div>
              </div>
              {c.description && (
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{ color: "var(--aiai-gray-600)" }}
                >
                  {c.description}
                </p>
              )}
              {/* Per-course progress bar */}
              {(() => {
                const prog = courseProgress.get(c.id) ?? { completed: 0, total: 0 };
                if (prog.total === 0 || locked || preview) return null;
                const pct = Math.round((prog.completed / prog.total) * 100);
                const isFull = prog.completed === prog.total;
                return (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: isFull ? "#22c55e" : "var(--aiai-green-400)",
                        }}
                      />
                    </div>
                    <span
                      className="shrink-0 font-mono text-[10px] tabular-nums"
                      style={{
                        color: isFull ? "#15803d" : "var(--aiai-gray-500)",
                      }}
                    >
                      {prog.completed}/{prog.total}
                    </span>
                  </div>
                );
              })()}
            </article>
          </Wrapper>
        );
      })}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "orange";
}) {
  const accent =
    tone === "green" ? "var(--aiai-green-600)" : "var(--aiai-orange-600)";
  return (
    <div
      className="rounded-xl border bg-white p-3 text-center shadow-sm"
      style={{ borderColor: "var(--aiai-green-100)" }}
    >
      <div
        className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase"
        style={{ color: accent, letterSpacing: "0.06em" }}
      >
        {icon}
        {label}
      </div>
      <div
        className="mt-0.5 text-lg font-bold tabular-nums"
        style={{ color: "var(--aiai-gray-800)" }}
      >
        {value}
      </div>
    </div>
  );
}

interface ScenarioRow {
  id: string;
  code: string;
  title: string;
  titleI18n: unknown;
  level: Level;
  orderIndex: number;
  estimatedMinutes: number;
  mtcAlignment: unknown;
}

function ScenarioList({
  scenarios,
  userLevel,
  userRole,
  locale,
  tLearn,
  tLevels,
}: {
  scenarios: ScenarioRow[];
  userLevel: Level;
  userRole?: UserRole;
  locale: string;
  tLearn: (key: string, vars?: Record<string, string | number>) => string;
  tLevels: (key: string) => string;
}) {
  return (
    <div className="space-y-2">
      {scenarios.map((s) => {
        const accessible = canAccess(userLevel, s.level, userRole);
        const titleI18n = s.titleI18n as Record<string, string> | null;
        const localizedTitle = titleI18n?.[locale] ?? s.title;
        const mtc = s.mtcAlignment as { books?: string[] } | null;
        const mtcLabel = mtc?.books?.length ? mtc.books.join(" / ") : null;

        const Wrapper: React.ElementType = accessible ? Link : "div";
        const wrapperProps = accessible
          ? ({ href: `/${locale}/learn/scenario/${s.code}` } as { href: string })
          : {};

        return (
          <Wrapper
            key={s.id}
            {...wrapperProps}
            className={
              accessible
                ? "block transition-all active:scale-[0.99]"
                : "block opacity-60"
            }
          >
            <article
              className="rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              style={{
                borderColor: accessible
                  ? "var(--aiai-green-100)"
                  : "var(--aiai-gray-200)",
                borderStyle: accessible ? "solid" : "dashed",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: accessible
                      ? "var(--aiai-green-400)"
                      : "var(--aiai-gray-200)",
                    color: accessible ? "#FFFFFF" : "var(--aiai-gray-600)",
                  }}
                >
                  {accessible ? (
                    <MapPin className="size-4" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="flex flex-wrap items-center gap-2 text-sm font-semibold"
                    style={{ color: "var(--aiai-gray-800)" }}
                  >
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: "var(--aiai-green-600)" }}
                    >
                      {s.code}
                    </span>
                    <span>{localizedTitle}</span>
                  </p>
                  <p
                    className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="size-3" />
                      {s.estimatedMinutes}min
                    </span>
                    <span>{tLevels(s.level)}</span>
                    {mtcLabel && (
                      <span
                        className="rounded px-1 py-0.5"
                        style={{
                          background: "var(--aiai-green-50)",
                          color: "var(--aiai-green-600)",
                        }}
                      >
                        {tLearn("scenarioMtcLabel", { books: mtcLabel })}
                      </span>
                    )}
                  </p>
                </div>
                {accessible ? (
                  <ArrowRight
                    className="size-4 shrink-0"
                    style={{ color: "var(--aiai-green-600)" }}
                  />
                ) : (
                  <span
                    className="text-[10px] shrink-0"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    {tLearn("scenarioLocked")}
                  </span>
                )}
              </div>
            </article>
          </Wrapper>
        );
      })}
    </div>
  );
}

// Time-aware greeting in Thai (primary audience) — 早安/午安/晚安 fallback in Chinese
function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 5) return "ราตรีสวัสดิ์ 🌙";
  if (h < 12) return "อรุณสวัสดิ์ ☀️ / 早安";
  if (h < 17) return "สวัสดีตอนบ่าย 🌤 / 午安";
  if (h < 20) return "สวัสดีตอนเย็น 🌅 / 傍晚好";
  return "สวัสดีตอนค่ำ 🌃 / 晚安";
}

// ─── Word-of-the-day wrapper (server-fetches the daily pick) ───────────────
async function WordOfDayWrapper({
  userId,
  userLevel,
  locale,
}: {
  userId: string;
  userLevel: Level;
  locale: string;
}) {
  const word = await pickDailyWord(userId, userLevel, locale);
  if (!word) return null;
  return <WordOfTheDay word={word} locale={locale} />;
}

// ─── Daily Missions Card ────────────────────────────────────────────────────
async function DailyMissionsCard({ userId }: { userId: string }) {
  const row = await getOrCreateTodayMissions(userId);
  const missions = row.missions as unknown as Array<{
    type: string;
    target: number;
    current: number;
    completed: boolean;
    emoji: string;
    labelTh: string;
    labelZh: string;
  }>;
  const completed = missions.filter((m) => m.completed).length;

  return (
    <section
      className="rounded-2xl border-2 p-4"
      style={{
        borderColor: "var(--aiai-green-200)",
        background: "linear-gradient(135deg, #ecfdf5 0%, #fff 100%)",
      }}
    >
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--aiai-green-700)" }}
          >
            🎯 ภารกิจวันนี้ · DAILY MISSIONS
          </p>
          <p className="text-xs" style={{ color: "var(--aiai-gray-500)" }}>
            {row.allCompleted
              ? `🎉 ครบหมดแล้ว! +${row.bonusXp} XP`
              : `เสร็จ ${completed}/${missions.length} · โบนัส +25 XP`}
          </p>
        </div>
      </header>
      <ul className="space-y-2">
        {missions.map((m) => {
          const pct = Math.min(100, (m.current / m.target) * 100);
          return (
            <li
              key={m.type}
              className="flex items-center gap-3 rounded-xl p-2"
              style={{
                background: m.completed ? "#dcfce7" : "#fff",
                opacity: m.completed ? 0.85 : 1,
              }}
            >
              <span className="text-xl">{m.emoji}</span>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs font-semibold"
                  style={{
                    color: m.completed ? "#15803d" : "var(--aiai-gray-700)",
                    textDecoration: m.completed ? "line-through" : "none",
                  }}
                >
                  {m.labelTh}
                </p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: m.completed ? "#22c55e" : "var(--aiai-green-400)",
                    }}
                  />
                </div>
              </div>
              <span
                className="shrink-0 font-mono text-[11px] tabular-nums"
                style={{ color: m.completed ? "#15803d" : "var(--aiai-gray-500)" }}
              >
                {m.current}/{m.target}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Weekly Exam Card ───────────────────────────────────────────────────────
async function WeeklyExamCard({
  locale,
  userId,
}: {
  locale: string;
  userId: string;
}) {
  // Find the earliest weekly exam the user hasn't passed yet. If they've
  // passed everything, surface the most recent one as a re-take suggestion.
  const exams = await db.mockExam.findMany({
    where: { code: { startsWith: "WEEKLY-" }, isPublished: true, isActive: true },
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      title: true,
      titleI18n: true,
      durationMin: true,
      totalQuestions: true,
      maxScore: true,
    },
  });
  if (exams.length === 0) return null;

  const passed = await db.examAttempt.findMany({
    where: { userId, examId: { in: exams.map((e) => e.id) }, passed: true },
    select: { examId: true },
    distinct: ["examId"],
  });
  const passedSet = new Set(passed.map((p) => p.examId));

  const next = exams.find((e) => !passedSet.has(e.id)) ?? exams[exams.length - 1];
  const allPassed = passedSet.size === exams.length;
  const exam = next!;
  const titleI18n = exam.titleI18n as Record<string, string> | null;
  const localized = titleI18n?.[locale] ?? exam.title;

  return (
    <Link
      href={`/${locale}/learn/weekly-exam/${exam.code}`}
      className="block rounded-2xl border-2 p-4 transition-all hover:scale-[1.01]"
      style={{
        borderColor: "#fb923c",
        background: "linear-gradient(135deg, #fff7ed 0%, #ffe4cc 100%)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm"
          style={{ background: "#fff", border: "1.5px solid #fb923c" }}
        >
          {allPassed ? "🌟" : "🏆"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c2410c" }}>
            {allPassed ? `所有週考已通過 (${passedSet.size}/${exams.length})` : `每週考試 (${passedSet.size}/${exams.length})`}
          </p>
          <h3 className="mt-0.5 truncate text-base font-bold" style={{ color: "#7c2d12" }}>
            {localized}
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: "#9a3412" }}>
            {exam.totalQuestions} 題 · {exam.durationMin} 分鐘 · {exam.maxScore} 分
          </p>
        </div>
        <span className="text-2xl" style={{ color: "#fb923c" }}>→</span>
      </div>
    </Link>
  );
}
