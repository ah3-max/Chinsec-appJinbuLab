import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/level";
import {
  ScenarioRunner,
  type ScenarioPayload,
  type ScenarioVocabPayload,
  type ScenarioDialogueLine,
  type ScenarioExercisePayload,
} from "@/components/learn/scenario-runner";

interface DialogueLineRow {
  speaker: string;
  speakerLabel?: { "zh-TW"?: string; th?: string; vi?: string; id?: string };
  hanzi: string;
  pinyin: string;
  translationI18n: Record<string, string>;
  audioUrl: string;
  orderIndex: number;
}

interface MtcAlignmentRow {
  books?: string[];
  topics?: string[];
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const t = await getTranslations("learn.scenario");

  const scenario = await db.scenario.findUnique({
    where: { code },
    include: {
      vocabularies: {
        orderBy: { orderIndex: "asc" },
        include: {
          vocabulary: {
            select: {
              id: true,
              hanzi: true,
              zhuyin: true,
              pinyin: true,
              translations: true,
              audioUrl: true,
              audioSlowUrl: true,
              isEldercareVocab: true,
              mtcReference: true,
            },
          },
        },
      },
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
          explanationI18n: true,
        },
      },
    },
  });
  if (!scenario || !scenario.isPublished) notFound();

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { currentLevel: true, uiLanguage: true },
  });
  if (!me) redirect(`/${locale}/login`);

  if (!canAccess(me.currentLevel, scenario.level, session.user.role)) {
    redirect(`/${locale}/learn?error=locked`);
  }

  const titleI18n = scenario.titleI18n as Record<string, string>;
  const localizedTitle = titleI18n[locale] ?? scenario.title;

  const hookContent = scenario.hookContent as
    | { storyTextI18n?: Record<string, string> }
    | null;
  const hookStory =
    hookContent?.storyTextI18n?.[locale] ??
    hookContent?.storyTextI18n?.["zh-TW"] ??
    "";

  const mtc = scenario.mtcAlignment as MtcAlignmentRow | null;
  const mtcAlignmentLabel = mtc?.books?.length
    ? t("mtcAlignmentLabel", { books: mtc.books.join(" / ") })
    : undefined;

  const vocabularies: ScenarioVocabPayload[] = scenario.vocabularies.map((sv) => {
    const v = sv.vocabulary;
    const tr = v.translations as Record<string, string> | null;
    // Strip out the internal _imagePromptHint and any other underscore keys —
    // they're never user-facing translations even when locale lookups run.
    const isReal = (k: string) => !k.startsWith("_");
    const pickReal = (k: string) => (tr && isReal(k) ? tr[k] : undefined);
    // Locale fallback chain: requested locale → English → Thai → Chinese.
    // English now holds the real meaning (image prompts moved to _imagePromptHint).
    const localized =
      pickReal(locale) ?? pickReal("en") ?? pickReal("th") ?? v.hanzi;
    return {
      id: v.id,
      hanzi: v.hanzi,
      zhuyin: v.zhuyin,
      pinyin: v.pinyin,
      thaiMeaning: localized,
      englishMeaning: pickReal("en"),
      audioUrl: v.audioUrl ?? undefined,
      audioSlowUrl: v.audioSlowUrl ?? undefined,
      isEldercareVocab: v.isEldercareVocab,
      mtcReference: (v.mtcReference as { book: string; lesson: string } | null) ?? undefined,
    };
  });

  const dialogueRows = (scenario.dialogue as unknown as DialogueLineRow[]) ?? [];
  const dialogue: ScenarioDialogueLine[] = dialogueRows.map((d) => ({
    speaker: d.speaker,
    speakerLabel: d.speakerLabel,
    hanzi: d.hanzi,
    pinyin: d.pinyin,
    translationI18n: d.translationI18n,
    audioUrl: d.audioUrl,
    orderIndex: d.orderIndex,
  }));

  const exercises: ScenarioExercisePayload[] = scenario.exercises.map((e) => ({
    id: e.id,
    type: e.type,
    prompt: e.prompt as Record<string, unknown>,
    options: (e.options as Array<{ value: string | number }>) ?? [],
    answer: (e.answer as { value: unknown }) ?? { value: null },
    audioUrl: e.audioUrl ?? undefined,
    maxScore: e.maxScore,
    explanationI18n: (e.explanationI18n as Record<string, string>) ?? undefined,
  }));

  const payload: ScenarioPayload = {
    code: scenario.code,
    title: localizedTitle,
    level: scenario.level,
    hookStory,
    estimatedMinutes: scenario.estimatedMinutes,
    mtcAlignmentLabel,
    vocabularies,
    dialogue,
    exercises,
  };

  return (
    <div className="space-y-4 px-4">
      <Link
        href={`/${locale}/learn`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        {t("backToLearn")}
      </Link>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {scenario.code}
        </p>
        <h1 className="text-xl font-bold">{localizedTitle}</h1>
      </header>

      <ScenarioRunner scenario={payload} uiLanguage={me.uiLanguage} />
    </div>
  );
}
