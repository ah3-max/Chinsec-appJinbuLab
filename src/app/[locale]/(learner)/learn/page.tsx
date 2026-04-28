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
} from "lucide-react";
import { Level } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Logo } from "@/components/brand/logo";
import { classifyCourse, previousLevel, canAccess } from "@/lib/level";
import { LearnLockedToast } from "@/components/learner/learn-locked-toast";

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
        },
      })
    : null;

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
    },
  });

  const userLevel: Level = me?.currentLevel ?? Level.ZHUYIN;
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
    return classifyCourse(userLevel, courseLevel, completed);
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
              {me ? `${t("welcome")}, ${me.fullName}` : t("welcome")}
            </p>
            <p
              className="text-[11px] uppercase tracking-wide opacity-80"
              style={{ letterSpacing: "0.06em" }}
            >
              愛愛院 中文學習
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

      {/* Scenarios — primary path for Path B learners (歐寶) */}
      {scenarios.length > 0 && (
        <section className="space-y-2">
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--aiai-green-800)" }}
          >
            {tLearn("scenariosHeading")}
          </h2>
          <ScenarioList
            scenarios={scenarios}
            userLevel={userLevel}
            locale={locale}
            tLearn={tLearn}
            tLevels={tLevels}
          />
        </section>
      )}

      {/* Courses */}
      <section className="space-y-2">
        <h2
          className="text-base font-semibold"
          style={{ color: "var(--aiai-green-800)" }}
        >
          {t("myCourses")}
        </h2>
        <div className="space-y-2">
          {courses.map((c) => {
            const state = classify(c.level);
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
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--aiai-gray-800)" }}
                      >
                        {c.title}
                      </p>
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
                </article>
              </Wrapper>
            );
          })}
        </div>
      </section>
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
  locale,
  tLearn,
  tLevels,
}: {
  scenarios: ScenarioRow[];
  userLevel: Level;
  locale: string;
  tLearn: (key: string, vars?: Record<string, string | number>) => string;
  tLevels: (key: string) => string;
}) {
  return (
    <div className="space-y-2">
      {scenarios.map((s) => {
        const accessible = canAccess(userLevel, s.level);
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
