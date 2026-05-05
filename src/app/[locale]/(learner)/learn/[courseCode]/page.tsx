import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft, ShieldAlert, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess, isLevelBypassRole } from "@/lib/level";
import { SkillPath, type PathStage } from "@/components/learner/skill-path";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; courseCode: string }>;
}) {
  const { locale, courseCode } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const tLevels = await getTranslations("levels");

  const course = await db.course.findUnique({
    where: { code: courseCode },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      level: true,
      vocabularyCount: true,
      estimatedHours: true,
      stages: {
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              code: true,
              title: true,
              type: true,
              estimatedMinutes: true,
              xpReward: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { currentLevel: true },
  });
  if (!me) redirect(`/${locale}/login`);

  if (!canAccess(me.currentLevel, course.level, session.user.role)) {
    redirect(`/${locale}/learn?error=locked`);
  }

  // Show Boss link to admins (testing) and to learners at the exact level.
  const showBoss =
    isLevelBypassRole(session.user.role) || me.currentLevel === course.level;
  const tBoss = await getTranslations("learn.boss");

  // Build set of completed lesson IDs based on UserAttempt history.
  // A lesson counts as completed if the user has any successful attempt
  // (score > 0) on any of its exercises.
  const allLessonIds = course.stages.flatMap((s) => s.lessons.map((l) => l.id));
  const completedExerciseGroups = await db.userAttempt.findMany({
    where: {
      userId: session.user.id,
      isCorrect: true,
      exercise: { lessonId: { in: allLessonIds } },
    },
    select: { exercise: { select: { lessonId: true } } },
    distinct: ["exerciseId"],
  });
  const completedLessonIds = new Set(
    completedExerciseGroups.map((g) => g.exercise?.lessonId).filter(Boolean) as string[],
  );

  // Sequential unlock: a lesson is "available" only when every previous lesson
  // (across stages, in order) has been completed. Admins/level-bypass roles
  // see everything unlocked so they can spot-check any lesson.
  const adminBypass =
    isLevelBypassRole(session.user.role) ||
    session.user.username?.startsWith("testlearner_") === true;
  const flatLessonIds = course.stages.flatMap((s) => s.lessons.map((l) => l.id));
  const lessonStatus = new Map<string, "completed" | "available" | "locked">();
  let allPrevDone = true;
  for (const id of flatLessonIds) {
    if (completedLessonIds.has(id)) {
      lessonStatus.set(id, "completed");
    } else if (adminBypass || allPrevDone) {
      lessonStatus.set(id, "available");
      allPrevDone = false; // first not-completed lesson is the only one unlocked
    } else {
      lessonStatus.set(id, "locked");
    }
  }

  const pathStages: PathStage[] = course.stages.map((stage) => ({
    id: stage.id,
    code: stage.code,
    title: stage.title,
    description: stage.description,
    lessons: stage.lessons.map((l) => ({
      id: l.id,
      code: l.code,
      title: l.title,
      type: l.type,
      estimatedMinutes: l.estimatedMinutes,
      xpReward: l.xpReward,
      status: lessonStatus.get(l.id) ?? "locked",
    })),
  }));

  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/learn`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        返回課程列表
      </Link>

      {/* Course header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl text-lg font-semibold"
            style={{
              background: "var(--aiai-green-400)",
              color: "#FFFFFF",
            }}
          >
            {course.code[0]}
          </div>
          <div className="min-w-0">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--aiai-gray-800)" }}
            >
              {course.title}
            </h1>
            <p
              className="mt-0.5 text-[11px]"
              style={{ color: "var(--aiai-gray-400)" }}
            >
              {tLevels(course.level)} · {course.vocabularyCount} 字
              {course.estimatedHours ? ` · ${course.estimatedHours}h` : ""}
            </p>
          </div>
        </div>
        {course.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--aiai-gray-600)" }}
          >
            {course.description}
          </p>
        )}
      </header>

      {/* Boss CTA — orange tone marks this as a special reward path */}
      {showBoss && (
        <Link
          href={`/${locale}/learn/boss/${course.code}`}
          className="block transition-all active:scale-[0.99]"
        >
          <article
            className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
            style={{ borderColor: "var(--aiai-orange-200)" }}
          >
            <div
              className="flex items-center gap-3 p-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--aiai-orange-50) 0%, #FFFFFF 100%)",
              }}
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{ background: "var(--aiai-orange-400)", color: "#FFFFFF" }}
              >
                <ShieldAlert className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[11px] font-semibold uppercase"
                  style={{ color: "var(--aiai-orange-600)", letterSpacing: "0.08em" }}
                >
                  BOSS
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--aiai-gray-800)" }}
                >
                  {tBoss("title")}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--aiai-gray-600)" }}
                >
                  {tBoss("ctaSubtitle")}
                </p>
              </div>
              <ChevronRight
                className="size-5 shrink-0"
                style={{ color: "var(--aiai-orange-600)" }}
              />
            </div>
          </article>
        </Link>
      )}

      {/* Skill Path (Duolingo-style) */}
      {course.stages.length === 0 ? (
        <div
          className="rounded-xl border bg-white py-8 text-center text-sm"
          style={{
            borderColor: "var(--aiai-gray-200)",
            borderStyle: "dashed",
            color: "var(--aiai-gray-400)",
          }}
        >
          本課程尚無單元,敬請期待。
        </div>
      ) : course.code === "MY-SCHOOL" ? (
        // Chapter-card layout for MY-SCHOOL: click a chapter to see its 5 lessons
        <ul className="space-y-2">
          {pathStages.map((stage, idx) => {
            const completed = stage.lessons.filter((l) => l.status === "completed").length;
            const total = stage.lessons.length;
            const allDone = total > 0 && completed === total;
            const empty = total === 0;
            return (
              <li key={stage.id}>
                <Link
                  href={`/${locale}/learn/${course.code}/chapter/${stage.code}`}
                  className={empty ? "block opacity-60 cursor-not-allowed pointer-events-none" : "block transition-all active:scale-[0.99] hover:shadow-md"}
                >
                  <article
                    className="flex items-center gap-3 rounded-2xl border-2 p-3 shadow-sm"
                    style={{
                      borderColor: allDone ? "#22c55e" : "var(--aiai-green-100)",
                      background: allDone
                        ? "linear-gradient(135deg, #f0fdf4 0%, #fff 100%)"
                        : "linear-gradient(135deg, #ecfdf5 0%, #fff 100%)",
                    }}
                  >
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold shadow-sm"
                      style={{
                        background: allDone ? "#22c55e" : "var(--aiai-green-400)",
                        color: "#fff",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--aiai-green-600)" }}
                      >
                        {stage.code} · 第{idx + 1}課 Chapter
                      </p>
                      <h3 className="truncate text-sm font-semibold" style={{ color: "var(--aiai-gray-800)" }}>
                        {stage.title}
                      </h3>
                      {stage.description && (
                        <p className="truncate text-[11px]" style={{ color: "var(--aiai-gray-400)" }}>
                          {stage.description}
                        </p>
                      )}
                      {!empty && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(completed / Math.max(1, total)) * 100}%`,
                                background: allDone ? "#22c55e" : "var(--aiai-green-400)",
                              }}
                            />
                          </div>
                          <span
                            className="font-mono text-[10px] tabular-nums"
                            style={{ color: allDone ? "#15803d" : "var(--aiai-gray-500)" }}
                          >
                            {completed}/{total}
                          </span>
                        </div>
                      )}
                      {empty && (
                        <p className="mt-1 text-[10px]" style={{ color: "var(--aiai-gray-400)" }}>
                          📝 即將推出 / Coming soon
                        </p>
                      )}
                    </div>
                    <ChevronRight className="size-5 shrink-0" style={{ color: "var(--aiai-green-600)" }} />
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <SkillPath
          courseCode={course.code}
          locale={locale}
          stages={pathStages}
        />
      )}
    </div>
  );
}
