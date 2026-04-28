import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Lock, ArrowRight, Check, Sparkles, MapPin, Clock } from "lucide-react";
import { Level } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { classifyCourse, previousLevel, canAccess } from "@/lib/level";
import { LearnLockedToast } from "@/components/learner/learn-locked-toast";

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

  // 養老院情境關卡 — 顯示目前等級的所有 scenarios.
  const userLvl = me?.currentLevel ?? Level.ZHUYIN;
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

  const userLevel: Level = me?.currentLevel ?? Level.ZHUYIN;

  // "Completed" heuristic: course is below user's current level → has been
  // passed. Replace with real lesson-progress tracking once that exists.
  function classify(courseLevel: Level) {
    const userIdx = LEVEL_RANK[userLevel];
    const courseIdx = LEVEL_RANK[courseLevel];
    const completed = courseIdx < userIdx;
    return classifyCourse(userLevel, courseLevel, completed);
  }

  return (
    <div className="space-y-6 px-4">
      <LearnLockedToast />
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {me ? `Hi, ${me.fullName}` : t("welcome")}
        </p>
        <h1 className="text-2xl font-bold">{t("subtitle")}</h1>
      </header>

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

      {scenarios.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{tLearn("scenariosHeading")}</h2>
          <ScenarioList
            scenarios={scenarios}
            userLevel={userLvl}
            locale={locale}
            tLearn={tLearn}
            tLevels={tLevels}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t("myCourses")}</h2>
        <div className="space-y-3">
          {courses.map((c) => {
            const state = classify(c.level);
            const locked = state === "locked";
            const preview = state === "preview";
            const completed = state === "completed";
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
                    ? "block opacity-70"
                    : "block transition-transform active:scale-[0.99]"
                }
              >
                <Card
                  className={
                    locked
                      ? "border-dashed bg-muted/40"
                      : preview
                        ? "border-dashed"
                        : completed
                          ? "border-emerald-200"
                          : ""
                  }
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                        style={{ backgroundColor: c.themeColor ?? "#3B82F6" }}
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
                      <div className="flex-1">
                        <CardTitle className="text-base">{c.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {tLevels(c.level)} ・ {c.vocabularyCount} 字
                          {c.estimatedHours
                            ? ` ・ ${c.estimatedHours}h`
                            : ""}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {state === "open" && (
                          <span className="inline-flex items-center gap-0.5 text-primary">
                            {tLearn("startOrContinue")}
                            <ArrowRight className="size-3.5" />
                          </span>
                        )}
                        {state === "completed" && (
                          <span className="text-emerald-600">
                            {tLearn("review")}
                          </span>
                        )}
                        {state === "preview" && (
                          <span className="text-amber-600">
                            {tLearn("comingSoon")}
                          </span>
                        )}
                        {state === "locked" && prevName && (
                          <span>
                            {tLearn("finishPrevToUnlock", {
                              prev: tLevels(prevName),
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {c.description && (
                    <CardContent className="text-sm text-muted-foreground">
                      {c.description}
                    </CardContent>
                  )}
                </Card>
              </Wrapper>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const LEVEL_RANK: Record<Level, number> = {
  ZHUYIN: 0,
  A1_BEGINNER: 1,
  A2_BASIC: 2,
  B1_INTERMEDIATE: 3,
  B2_UPPER_INTER: 4,
  C1_ADVANCED: 5,
  C2_PROFICIENT: 6,
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center shadow-sm">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
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
            <Card
              className={
                accessible
                  ? "border-emerald-200 hover:shadow-md"
                  : "border-dashed bg-muted/30"
              }
            >
              <CardContent className="flex items-center gap-3 p-3">
                <div
                  className={
                    accessible
                      ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                      : "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                  }
                >
                  {accessible ? (
                    <MapPin className="size-4" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span className="font-mono text-xs text-muted-foreground">
                      {s.code}
                    </span>
                    <span>{localizedTitle}</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="size-3" />
                      {s.estimatedMinutes}min
                    </span>
                    <span>{tLevels(s.level)}</span>
                    {mtcLabel && (
                      <span className="rounded bg-muted px-1 py-0.5">
                        {tLearn("scenarioMtcLabel", { books: mtcLabel })}
                      </span>
                    )}
                  </p>
                </div>
                {accessible ? (
                  <ArrowRight className="size-4 text-muted-foreground" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    {tLearn("scenarioLocked")}
                  </span>
                )}
              </CardContent>
            </Card>
          </Wrapper>
        );
      })}
    </div>
  );
}
