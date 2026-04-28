import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/level";
import {
  LessonRunner,
  type LessonExercise,
} from "@/components/learner/lesson-runner";

interface LessonContent {
  intro?: string;
  introI18n?: Record<string, string>;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; courseCode: string; lessonCode: string }>;
}) {
  const { locale, courseCode, lessonCode } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const t = await getTranslations("learn.lesson");

  const course = await db.course.findUnique({
    where: { code: courseCode },
    select: { id: true, code: true, level: true, isPublished: true, title: true },
  });
  if (!course || !course.isPublished) notFound();

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { currentLevel: true },
  });
  if (!me) redirect(`/${locale}/login`);
  if (!canAccess(me.currentLevel, course.level)) {
    redirect(`/${locale}/learn?error=locked`);
  }

  const lesson = await db.lesson.findFirst({
    where: {
      code: lessonCode,
      isPublished: true,
      stage: { courseId: course.id },
    },
    select: {
      id: true,
      code: true,
      title: true,
      titleI18n: true,
      content: true,
      type: true,
      estimatedMinutes: true,
      stage: { select: { code: true, title: true } },
      exercises: {
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          type: true,
          prompt: true,
          options: true,
          answer: true,
          audioUrl: true,
          maxScore: true,
        },
      },
    },
  });
  if (!lesson) notFound();

  const localized = (lesson.titleI18n as Record<string, string> | null)?.[
    locale
  ];
  const introContent = lesson.content as LessonContent | null;
  const introText =
    introContent?.introI18n?.[locale] ?? introContent?.intro ?? "";

  // Cast Prisma Json to the runtime types LessonRunner expects.
  const exercises: LessonExercise[] = lesson.exercises.map((e) => ({
    id: e.id,
    type: e.type as LessonExercise["type"],
    prompt: (e.prompt as Prisma.JsonValue as LessonExercise["prompt"]) ?? {},
    options:
      (e.options as Prisma.JsonValue as LessonExercise["options"]) ?? [],
    answer: (e.answer as Prisma.JsonValue as LessonExercise["answer"]) ?? {
      value: null,
    },
    audioUrl: e.audioUrl ?? undefined,
    maxScore: e.maxScore,
  }));

  return (
    <div className="space-y-4 px-4">
      <Link
        href={`/${locale}/learn/${course.code}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        {course.title}
      </Link>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {lesson.stage.code} · {lesson.stage.title}
        </p>
        <h1 className="text-xl font-bold">{localized ?? lesson.title}</h1>
        <p className="text-xs text-muted-foreground">
          {t("estimatedMinutes", { minutes: lesson.estimatedMinutes })}
        </p>
      </header>

      {introText && (
        <div className="rounded-lg border bg-card p-3 text-sm leading-relaxed text-muted-foreground">
          {introText}
        </div>
      )}

      <LessonRunner
        courseCode={course.code}
        lessonCode={lesson.code}
        exercises={exercises}
        totalCount={exercises.length}
      />
    </div>
  );
}
