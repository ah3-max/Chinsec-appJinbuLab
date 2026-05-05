import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess, isLevelBypassRole } from "@/lib/level";
import {
  LessonRunner,
  type LessonExercise,
  type VocabItem,
} from "@/components/learner/lesson-runner";
import {
  ReadingRunner,
  type ReadingParagraph,
  type ReadingExercise,
} from "@/components/learner/reading-runner";
import financeExamples from "@/content/aay-finance-examples.json";

interface VocabListContent {
  type: "vocabulary-list";
  heading?: string;
  items?: Array<{
    hanzi: string;
    pinyin?: string;
    translations?: Record<string, string>;
    note?: string;
    /** Single embedded example (legacy / grammar lessons) */
    example?: {
      sentence?: string;
      sentencePinyin?: string;
      sentenceTh?: string;
    };
    /** Multi-example array (preferred for richer cards) */
    examples?: Array<{
      sentence: string;
      pinyin?: string;
      /** Legacy: single-language Thai translation, kept as fallback. */
      translation?: string;
      /** Multi-language map; resolved per-locale before reaching the runner. */
      translations?: Record<string, string>;
    }>;
    /** Memory hint to help recall */
    mnemonic?: string;
    /** Usage caveat ("Don't say X", "More formal than Y") */
    usageNote?: string;
  }>;
}

interface ReadingPassageContent {
  type: "reading-passage";
  title?: string;
  titleTr?: string;
  paragraphs?: Array<{
    cn: string;
    tr?: string;
    pinyin?: string;
  }>;
}

interface GenericContent {
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
    select: { currentLevel: true, uiLanguage: true },
  });
  if (!me) redirect(`/${locale}/login`);
  if (!canAccess(me.currentLevel, course.level, session.user.role)) {
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
      xpReward: true,
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

  // Sequential unlock: block direct URL access to a lesson whose previous
  // siblings haven't been completed. Admin/teacher roles bypass for QA;
  // testlearner_* accounts also bypass so QA can hit any lesson directly.
  const sequentialBypass =
    isLevelBypassRole(session.user.role) ||
    session.user.username?.startsWith("testlearner_") === true;
  if (!sequentialBypass) {
    const orderedLessons = await db.lesson.findMany({
      where: { stage: { courseId: course.id }, isPublished: true },
      orderBy: [{ stage: { orderIndex: "asc" } }, { orderIndex: "asc" }],
      select: { id: true, code: true },
    });
    const targetIdx = orderedLessons.findIndex((l) => l.code === lessonCode);
    if (targetIdx > 0) {
      const prevIds = orderedLessons.slice(0, targetIdx).map((l) => l.id);
      const prevDone = await db.userAttempt.findMany({
        where: {
          userId: session.user.id,
          isCorrect: true,
          exercise: { lessonId: { in: prevIds } },
        },
        select: { exercise: { select: { lessonId: true } } },
        distinct: ["exerciseId"],
      });
      const completedSet = new Set(
        prevDone.map((g) => g.exercise?.lessonId).filter(Boolean) as string[],
      );
      const unmet = prevIds.filter((id) => !completedSet.has(id));
      if (unmet.length > 0) {
        redirect(`/${locale}/learn/${course.code}?error=locked-prereq`);
      }
    }
  }

  const localized = (lesson.titleI18n as Record<string, string> | null)?.[locale];

  // Extract vocab intro items for VOCAB-type lessons
  const rawContent = lesson.content as
    | VocabListContent
    | GenericContent
    | ReadingPassageContent
    | null;
  let vocabItems: VocabItem[] = [];
  let introText = "";
  let readingContent: ReadingPassageContent | null = null;

  if (rawContent && "type" in rawContent && rawContent.type === "reading-passage") {
    readingContent = rawContent as ReadingPassageContent;
  } else if (rawContent && "type" in rawContent && rawContent.type === "vocabulary-list") {
    const vocabContent = rawContent as VocabListContent;
    // Pick translation in order: locale → th → en → zh-TW
    const pickTrans = (t: Record<string, string> | undefined) =>
      t?.[locale] ?? t?.["th"] ?? t?.["en"] ?? t?.["zh-TW"] ?? "";

    const baseItems = (vocabContent.items ?? []).map((item) => ({
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      translation: pickTrans(item.translations),
      audioUrl: `/api/audio/vocab/${encodeURIComponent(item.hanzi)}`,
    }));

    // Check DB only for a manually-curated imageUrl override
    const hanziList = baseItems.map((v) => v.hanzi);
    const vocabRecords = hanziList.length > 0
      ? await db.vocabulary.findMany({
          where: { hanzi: { in: hanziList } },
          select: { hanzi: true, imageUrl: true },
        })
      : [];
    const vocabMap = new Map(vocabRecords.map((v) => [v.hanzi, v]));

    const examples = financeExamples as Record<
      string,
      { sentence: string; sentencePinyin: string; sentenceTh: string }
    >;

    vocabItems = baseItems.map((item) => {
      const record = vocabMap.get(item.hanzi);
      const imageUrl =
        record?.imageUrl ??
        `/api/vocab-image/${encodeURIComponent(item.hanzi)}`;
      const sourceItem = (vocabContent.items ?? []).find((i) => i.hanzi === item.hanzi);
      const embedded = sourceItem?.example;
      const ex = embedded ?? examples[item.hanzi];
      // Resolve example translation for the request locale: prefer the
      // multi-language `translations` map, fall back to the legacy single
      // `translation` (Thai) field, then English.
      const pickExTrans = (t: Record<string, string> | undefined, fallback?: string) =>
        t?.[locale] ?? t?.["th"] ?? t?.["en"] ?? fallback ?? "";
      // Multi-example array preferred; otherwise build from single example/JSON
      const examplesList =
        sourceItem?.examples && sourceItem.examples.length > 0
          ? sourceItem.examples.map((e) => ({
              sentence: e.sentence,
              pinyin: e.pinyin,
              translation: pickExTrans(e.translations, e.translation),
            }))
          : ex?.sentence
            ? [{ sentence: ex.sentence, pinyin: ex.sentencePinyin, translation: ex.sentenceTh }]
            : undefined;
      return {
        ...item,
        imageUrl,
        // Single-example fields kept for backward compatibility with old UI paths
        exampleSentence: ex?.sentence,
        examplePinyin: ex?.sentencePinyin,
        exampleTranslation: ex?.sentenceTh,
        examples: examplesList,
        mnemonic: sourceItem?.mnemonic,
        usageNote: sourceItem?.usageNote,
      };
    });
  } else {
    const generic = rawContent as GenericContent | null;
    introText = generic?.introI18n?.[locale] ?? generic?.intro ?? "";
  }

  const exercises: LessonExercise[] = lesson.exercises.map((e) => ({
    id: e.id,
    type: e.type as LessonExercise["type"],
    prompt: (e.prompt as Prisma.JsonValue as LessonExercise["prompt"]) ?? {},
    options: (e.options as Prisma.JsonValue as LessonExercise["options"]) ?? [],
    answer: (e.answer as Prisma.JsonValue as LessonExercise["answer"]) ?? { value: null },
    audioUrl: e.audioUrl ?? undefined,
    maxScore: e.maxScore,
  }));

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <Link
        href={`/${locale}/learn/${course.code}`}
        className="inline-flex items-center gap-1 text-sm transition-colors"
        style={{ color: "var(--aiai-gray-500)" }}
      >
        <ChevronLeft className="size-4" />
        {course.title}
      </Link>

      <header className="space-y-0.5">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--aiai-green-600)" }}
        >
          {lesson.stage.code} · {lesson.stage.title}
        </p>
        <h1 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          {localized ?? lesson.title}
        </h1>
        <p className="text-xs" style={{ color: "var(--aiai-gray-400)" }}>
          {t("estimatedMinutes", { minutes: lesson.estimatedMinutes })} · +{lesson.xpReward} XP
        </p>
      </header>

      {introText && (
        <div
          className="rounded-xl border p-3 text-sm leading-relaxed"
          style={{
            borderColor: "var(--aiai-green-100)",
            background: "var(--aiai-green-50)",
            color: "var(--aiai-gray-700)",
          }}
        >
          {introText}
        </div>
      )}

      {readingContent ? (
        <ReadingRunner
          courseCode={course.code}
          lessonCode={lesson.code}
          title={readingContent.title ?? lesson.title}
          titleTr={readingContent.titleTr}
          paragraphs={(readingContent.paragraphs ?? []) as ReadingParagraph[]}
          exercises={exercises.map((e) => ({
            id: e.id,
            type: e.type,
            prompt: e.prompt as ReadingExercise["prompt"],
            options: (e.options as ReadingExercise["options"]) ?? [],
            answer: e.answer as ReadingExercise["answer"],
            maxScore: e.maxScore,
          }))}
        />
      ) : (
        <LessonRunner
          courseCode={course.code}
          lessonCode={lesson.code}
          exercises={exercises}
          totalCount={exercises.length}
          vocabItems={vocabItems.length > 0 ? vocabItems : undefined}
        />
      )}
    </div>
  );
}
