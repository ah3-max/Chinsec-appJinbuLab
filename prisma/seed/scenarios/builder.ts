// Generic scenario seeder. Path B's L1-S01 / L1-S02 / L1-S03 all hand the
// same ScenarioDef shape to seedScenario(prisma, def). Idempotent — re-runs
// upsert by code, refresh translations, and rebuild scenarioVocabularies +
// exercises (delete-then-create) so content changes always land cleanly.

import type { Prisma, PrismaClient } from "@prisma/client";
import type { ScenarioDef } from "../../../src/content/scenarios/_types";

// Placeholder text we drop into vi/id translations until 歐寶 finishes the
// pilot and we run scripts/generate-translations.ts.
const VI_PENDING = "[VI-AUTO-PENDING]";
const ID_PENDING = "[ID-AUTO-PENDING]";

function hydrateVocabTranslations(
  t: ScenarioDef["vocabularies"][number]["translations"],
): Prisma.InputJsonValue {
  return {
    th: t.th,
    vi: t.vi ?? VI_PENDING,
    id: t.id ?? ID_PENDING,
    en: t.en ?? null,
  };
}

function audioUrlFor(hanzi: string, slow = false): string {
  const slowParam = slow ? "?slow=1" : "";
  return `/api/audio/vocab/${encodeURIComponent(hanzi)}${slowParam}`;
}

export async function seedScenario(
  prisma: PrismaClient,
  def: ScenarioDef,
): Promise<{ scenarioId: string; vocabCount: number; exerciseCount: number }> {
  // 1. Vocabulary upserts (global by hanzi).
  const vocabIdByHanzi = new Map<string, string>();
  for (const v of def.vocabularies) {
    const upserted = await prisma.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      update: {
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: hydrateVocabTranslations(v.translations),
        category: v.category,
        tags: v.tags ?? [],
        difficulty: v.difficulty ?? 1,
        level: def.level,
        tocflBand: def.level === "A1_BEGINNER" ? "A1" : undefined,
        audioUrl: audioUrlFor(v.hanzi, false),
        audioSlowUrl: audioUrlFor(v.hanzi, true),
      },
      create: {
        hanzi: v.hanzi,
        hanziSimplified: v.hanziSimplified,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: hydrateVocabTranslations(v.translations),
        category: v.category,
        tags: v.tags ?? [],
        difficulty: v.difficulty ?? 1,
        level: def.level,
        tocflBand: def.level === "A1_BEGINNER" ? "A1" : undefined,
        audioUrl: audioUrlFor(v.hanzi, false),
        audioSlowUrl: audioUrlFor(v.hanzi, true),
      },
      select: { id: true },
    });
    vocabIdByHanzi.set(v.hanzi, upserted.id);
  }

  // 2. Resolve prerequisite scenario id if any.
  let prerequisiteScenarioId: string | undefined;
  if (def.prerequisiteCode) {
    const prereq = await prisma.scenario.findUnique({
      where: { code: def.prerequisiteCode },
      select: { id: true },
    });
    prerequisiteScenarioId = prereq?.id;
  }

  // 3. Scenario upsert.
  const dialogueWithAudio = def.dialogue.map((line, idx) => ({
    ...line,
    orderIndex: idx,
    audioUrl: `/api/audio/dialogue/${def.code}/${idx}`,
  }));

  const scenario = await prisma.scenario.upsert({
    where: { code: def.code },
    update: {
      level: def.level,
      orderIndex: def.orderIndex,
      title: def.title,
      titleI18n: def.titleI18n as Prisma.InputJsonValue,
      hookContent: (def.hookContent ?? null) as Prisma.InputJsonValue,
      dialogue: dialogueWithAudio as unknown as Prisma.InputJsonValue,
      estimatedMinutes: def.estimatedMinutes ?? 25,
      isPublished: true,
      prerequisiteScenarioId: prerequisiteScenarioId ?? null,
    },
    create: {
      code: def.code,
      level: def.level,
      orderIndex: def.orderIndex,
      title: def.title,
      titleI18n: def.titleI18n as Prisma.InputJsonValue,
      hookContent: (def.hookContent ?? null) as Prisma.InputJsonValue,
      dialogue: dialogueWithAudio as unknown as Prisma.InputJsonValue,
      estimatedMinutes: def.estimatedMinutes ?? 25,
      isPublished: true,
      prerequisiteScenarioId,
    },
    select: { id: true },
  });

  // 4. Rebuild ScenarioVocab links.
  await prisma.scenarioVocab.deleteMany({
    where: { scenarioId: scenario.id },
  });
  for (let i = 0; i < def.vocabularies.length; i++) {
    const v = def.vocabularies[i]!;
    const vocabId = vocabIdByHanzi.get(v.hanzi);
    if (!vocabId) continue;
    await prisma.scenarioVocab.create({
      data: {
        scenarioId: scenario.id,
        vocabularyId: vocabId,
        isCore: v.isCore ?? true,
        orderIndex: i,
      },
    });
  }

  // 5. Rebuild Exercises (clear UserAttempts first to satisfy FK).
  const oldExs = await prisma.exercise.findMany({
    where: { scenarioId: scenario.id },
    select: { id: true },
  });
  if (oldExs.length > 0) {
    await prisma.userAttempt.deleteMany({
      where: { exerciseId: { in: oldExs.map((e) => e.id) } },
    });
    await prisma.exercise.deleteMany({
      where: { scenarioId: scenario.id },
    });
  }

  for (let i = 0; i < def.exercises.length; i++) {
    const ex = def.exercises[i]!;
    await prisma.exercise.create({
      data: {
        scenarioId: scenario.id,
        type: ex.type,
        difficulty: ex.difficulty ?? 1,
        prompt: ex.prompt as Prisma.InputJsonValue,
        options: (ex.options ?? []) as Prisma.InputJsonValue,
        answer: ex.answer as Prisma.InputJsonValue,
        hintI18n: ex.hintI18n as Prisma.InputJsonValue,
        explanationI18n: ex.explanationI18n as Prisma.InputJsonValue,
        audioUrl: ex.audioUrl ?? null,
        skillsTrained: ex.skillsTrained ?? [],
        maxScore: 10,
        passingScore: 6,
        orderIndex: i,
        isActive: true,
      },
    });
  }

  return {
    scenarioId: scenario.id,
    vocabCount: def.vocabularies.length,
    exerciseCount: def.exercises.length,
  };
}
