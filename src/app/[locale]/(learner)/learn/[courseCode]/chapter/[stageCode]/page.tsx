import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, ChevronRight, Lock, Check, BookOpen, MessageCircle, FileText, GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess, isLevelBypassRole } from "@/lib/level";

const LESSON_ICONS: Record<string, { icon: typeof BookOpen; tint: string; label: string }> = {
  DIALOG:  { icon: MessageCircle, tint: "#8b5cf6", label: "對話 Dialog" },
  VOCAB:   { icon: BookOpen,      tint: "#22c55e", label: "詞彙 Vocab" },
  READING: { icon: FileText,      tint: "#3b82f6", label: "短文 Reading" },
  GRAMMAR: { icon: GraduationCap, tint: "#fb923c", label: "文法 Grammar" },
};

function lessonTypeFromCode(code: string): keyof typeof LESSON_ICONS {
  if (code.includes("DIALOG")) return "DIALOG";
  if (code.includes("READING")) return "READING";
  if (code.includes("GRAMMAR")) return "GRAMMAR";
  return "VOCAB";
}

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; courseCode: string; stageCode: string }>;
}) {
  const { locale, courseCode, stageCode } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const course = await db.course.findUnique({
    where: { code: courseCode },
    select: { id: true, code: true, title: true, level: true },
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

  const stage = await db.stage.findFirst({
    where: { courseId: course.id, code: stageCode },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true, code: true, title: true, titleI18n: true, type: true,
          description: true, estimatedMinutes: true, xpReward: true,
        },
      },
    },
  });
  if (!stage) notFound();

  // Sequential unlock — first uncompleted lesson is "available", rest locked.
  // Test learners (testlearner_*) bypass to allow free navigation while QA-ing content.
  const adminBypass =
    isLevelBypassRole(session.user.role) ||
    session.user.username?.startsWith("testlearner_") === true;
  const lessonIds = stage.lessons.map((l) => l.id);
  const completedExerciseGroups = lessonIds.length > 0
    ? await db.userAttempt.findMany({
        where: { userId: session.user.id, isCorrect: true, exercise: { lessonId: { in: lessonIds } } },
        select: { exercise: { select: { lessonId: true } } },
        distinct: ["exerciseId"],
      })
    : [];
  const completedLessons = new Set(
    completedExerciseGroups.map((g) => g.exercise?.lessonId).filter(Boolean) as string[],
  );

  const stageTitleI18n = stage.titleI18n as Record<string, string> | null;
  const stageLocalized = stageTitleI18n?.[locale] ?? stage.title;

  let allPrevDone = true;
  const lessonStatus = new Map<string, "completed" | "available" | "locked">();
  for (const l of stage.lessons) {
    if (completedLessons.has(l.id)) {
      lessonStatus.set(l.id, "completed");
    } else if (adminBypass || allPrevDone) {
      lessonStatus.set(l.id, "available");
      allPrevDone = false;
    } else {
      lessonStatus.set(l.id, "locked");
    }
  }

  const completedCount = stage.lessons.filter((l) => lessonStatus.get(l.id) === "completed").length;

  return (
    <div className="space-y-3 px-4 pb-4">
      <Link
        href={`/${locale}/learn/${course.code}`}
        className="inline-flex items-center gap-1 text-sm transition-colors"
        style={{ color: "var(--aiai-gray-500)" }}
      >
        <ChevronLeft className="size-4" />
        {course.title}
      </Link>

      <header
        className="overflow-hidden rounded-2xl px-5 py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, var(--aiai-green-400) 0%, var(--aiai-green-600) 100%)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest opacity-90">
          {stage.code} · 第{stage.orderIndex + 1}課 Chapter
        </p>
        <h1 className="text-xl font-bold">{stageLocalized}</h1>
        {stage.description && (
          <p className="mt-0.5 text-xs opacity-90">{stage.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${(completedCount / Math.max(1, stage.lessons.length)) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums">
            {completedCount}/{stage.lessons.length}
          </span>
        </div>
      </header>

      {stage.lessons.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed py-8 text-center text-sm"
          style={{ borderColor: "var(--aiai-gray-200)", color: "var(--aiai-gray-400)" }}
        >
          本章節尚無內容
        </div>
      ) : (
        <ol className="space-y-2">
          {stage.lessons.map((lesson, i) => {
            const status = lessonStatus.get(lesson.id) ?? "locked";
            const meta = LESSON_ICONS[lessonTypeFromCode(lesson.code)]!;
            const Icon = meta.icon;
            const titleI18n = lesson.titleI18n as Record<string, string> | null;
            const localizedTitle = titleI18n?.[locale] ?? lesson.title;

            const Wrapper: React.ElementType = status === "locked" ? "div" : Link;
            const wrapperProps: { href?: string } = status === "locked"
              ? {}
              : { href: `/${locale}/learn/${course.code}/lesson/${lesson.code}` };

            return (
              <li key={lesson.id}>
                <Wrapper
                  {...wrapperProps}
                  className={
                    status === "locked"
                      ? "block opacity-50 cursor-not-allowed"
                      : "block transition-all active:scale-[0.99] hover:shadow-md"
                  }
                >
                  <article
                    className="flex items-center gap-3 rounded-2xl border-2 bg-white p-3 shadow-sm"
                    style={{
                      borderColor:
                        status === "completed" ? "#22c55e"
                        : status === "available" ? meta.tint
                        : "var(--aiai-gray-200)",
                    }}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="flex size-12 items-center justify-center rounded-xl shadow-sm"
                        style={{
                          background: status === "locked" ? "var(--aiai-gray-200)" : meta.tint,
                          color: status === "locked" ? "var(--aiai-gray-500)" : "#fff",
                        }}
                      >
                        {status === "locked" ? (
                          <Lock className="size-5" />
                        ) : (
                          <Icon className="size-5" />
                        )}
                      </div>
                      {status === "completed" && (
                        <span
                          aria-label="completed"
                          className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white shadow-sm"
                          style={{ background: "#22c55e", color: "#fff" }}
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: meta.tint }}
                      >
                        {i + 1}. {meta.label}
                      </p>
                      <h3
                        className="truncate text-sm font-semibold"
                        style={{ color: status === "locked" ? "var(--aiai-gray-500)" : "var(--aiai-gray-800)" }}
                      >
                        {localizedTitle}
                      </h3>
                      {lesson.description && (
                        <p className="truncate text-[11px]" style={{ color: "var(--aiai-gray-400)" }}>
                          {lesson.description}
                        </p>
                      )}
                      <p className="text-[10px]" style={{ color: "var(--aiai-gray-400)" }}>
                        {lesson.estimatedMinutes} 分鐘 · +{lesson.xpReward} XP
                      </p>
                    </div>
                    <ChevronRight
                      className="size-5 shrink-0"
                      style={{ color: status === "locked" ? "var(--aiai-gray-300)" : meta.tint }}
                    />
                  </article>
                </Wrapper>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
