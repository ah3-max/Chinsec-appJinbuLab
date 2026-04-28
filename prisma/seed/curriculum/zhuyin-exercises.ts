// Zhuyin exercises seeder.
//
// Generates ~150 exercises across 3 types so the Z9 Boss exam (Task 5) has
// a real pool to draw from:
//   ZHUYIN_RECOGNITION  — listen to audio, pick the bopomofo symbol
//   VOCAB_MCQ           — see a bopomofo symbol, pick its example hanzi
//   TONE_DISCRIMINATION — listen to ma_N.mp3, pick the tone (1–5)
//
// The generator walks lessons in stage/lesson order. To avoid asking
// learners about symbols they haven't seen yet, distractors for a lesson
// are chosen from `allSymbolsSeen` — i.e. symbols introduced by this lesson
// or any earlier one.

import type { PrismaClient, Prisma } from "@prisma/client";
import { ExerciseType, LessonType } from "@prisma/client";
import { ALL_ZHUYIN, type ZhuyinSymbol } from "../../../src/lib/zhuyin/data";

const SYMBOL_INDEX: Map<string, ZhuyinSymbol> = new Map(
  ALL_ZHUYIN.map((z) => [z.symbol, z]),
);

interface LessonRow {
  id: string;
  code: string;
  type: LessonType;
  content: Prisma.JsonValue;
  stageCode: string;
  stageOrder: number;
}

interface StoredContent {
  intro?: string;
  introI18n?: Record<string, string>;
  covers?: string[];
  examples?: Array<{ hanzi: string; zhuyin?: string; pinyin?: string; gloss?: string }>;
  tips?: string[];
}

function pickN<T>(pool: T[], n: number, exclude?: T[]): T[] {
  const set = new Set(exclude ?? []);
  const candidates = pool.filter((p) => !set.has(p));
  // Shuffle (Fisher–Yates light) — seed-time randomness is fine, doesn't
  // need to be cryptographic.
  const a = [...candidates];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a.slice(0, n);
}

function buildRecognition(
  target: string,
  pool: string[],
  difficulty: number,
): {
  type: ExerciseType;
  prompt: Prisma.InputJsonValue;
  options: Prisma.InputJsonValue;
  answer: Prisma.InputJsonValue;
  difficulty: number;
  audioUrl: string;
  skillsTrained: string[];
} | null {
  const distractors = pickN(pool, 3, [target]);
  if (distractors.length < 3) return null;
  const options = [target, ...distractors];
  // Light shuffle so target isn't always first.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j]!, options[i]!];
  }
  const audioUrl = `/api/audio/zhuyin/${encodeURIComponent(target)}`;
  return {
    type: ExerciseType.ZHUYIN_RECOGNITION,
    prompt: { audioUrl, target },
    options: options.map((s) => ({ value: s })),
    answer: { value: target },
    difficulty,
    audioUrl,
    skillsTrained: ["listening", "zhuyin"],
  };
}

function buildVocabMcq(
  symbol: string,
  exampleHanzi: string,
  hanziPool: string[],
  difficulty: number,
): {
  type: ExerciseType;
  prompt: Prisma.InputJsonValue;
  options: Prisma.InputJsonValue;
  answer: Prisma.InputJsonValue;
  difficulty: number;
  skillsTrained: string[];
} | null {
  const distractors = pickN(hanziPool, 3, [exampleHanzi]);
  if (distractors.length < 3) return null;
  const options = [exampleHanzi, ...distractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j]!, options[i]!];
  }
  return {
    type: ExerciseType.VOCAB_MCQ,
    prompt: { symbol },
    options: options.map((h) => ({ value: h })),
    answer: { value: exampleHanzi },
    difficulty,
    skillsTrained: ["reading", "zhuyin"],
  };
}

function buildToneDiscrim(tone: number, difficulty: number) {
  const audioUrl = `/api/audio/zhuyin/ma_${tone}?cat=tones`;
  return {
    type: ExerciseType.TONE_DISCRIMINATION,
    prompt: { audioUrl, syllable: "ma" },
    options: [
      { value: 1, label: "ˉ" },
      { value: 2, label: "ˊ" },
      { value: 3, label: "ˇ" },
      { value: 4, label: "ˋ" },
      { value: 5, label: "˙" },
    ],
    answer: { value: tone },
    difficulty,
    audioUrl,
    skillsTrained: ["listening", "tone"],
  };
}

export async function seedZhuyinExercises(
  prisma: PrismaClient,
): Promise<{ total: number; byType: Record<string, number> }> {
  const course = await prisma.course.findUnique({
    where: { code: "ZHUYIN" },
    select: { id: true },
  });
  if (!course) throw new Error("ZHUYIN course not found");

  const stages = await prisma.stage.findMany({
    where: { courseId: course.id },
    orderBy: { orderIndex: "asc" },
    select: {
      id: true,
      code: true,
      orderIndex: true,
      lessons: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          code: true,
          type: true,
          content: true,
        },
      },
    },
  });

  const lessons: LessonRow[] = stages.flatMap((s) =>
    s.lessons.map((l) => ({
      id: l.id,
      code: l.code,
      type: l.type,
      content: l.content,
      stageCode: s.code,
      stageOrder: s.orderIndex,
    })),
  );

  // Walk lessons in order so distractors only use already-seen symbols.
  const seenSymbols = new Set<string>();
  const seenExampleHanzi = new Set<string>();
  const byType: Record<string, number> = {
    ZHUYIN_RECOGNITION: 0,
    VOCAB_MCQ: 0,
    TONE_DISCRIMINATION: 0,
  };
  let total = 0;

  // Replace existing exercises for these lessons so re-runs are deterministic
  // (pure additive upsert is hard to dedupe without a stable surrogate key).
  await prisma.userAttempt.deleteMany({
    where: {
      exerciseId: { in: lessons.map((l) => l.id) },
    },
  });
  await prisma.exercise.deleteMany({
    where: { lessonId: { in: lessons.map((l) => l.id) } },
  });

  for (const lesson of lessons) {
    const content = (lesson.content as StoredContent | null) ?? {};
    const covers = (content.covers ?? []).filter((s) =>
      SYMBOL_INDEX.has(s),
    );

    // Add this lesson's symbols + example hanzi to the seen pools.
    for (const c of covers) seenSymbols.add(c);
    for (const ex of content.examples ?? []) {
      if (ex.hanzi) seenExampleHanzi.add(ex.hanzi);
    }

    const distractorPool = [...seenSymbols];
    const hanziPool = [...seenExampleHanzi];
    const difficulty = clamp(lesson.stageOrder + 1, 1, 5);

    const buildList: Array<ReturnType<typeof buildRecognition> & { orderIndex?: number }> =
      [];

    if (lesson.stageCode === "Z7") {
      // Tone discrimination — 6 questions covering all 5 tones (one repeats).
      const seq = [1, 2, 3, 4, 5, Math.floor(Math.random() * 5) + 1];
      for (const t of seq) {
        const e = buildToneDiscrim(t, difficulty);
        buildList.push(e);
      }
    } else {
      // Recognition: 1-2 per covered symbol.
      const recogPerSymbol = lesson.type === LessonType.ZHUYIN_PRACTICE ? 2 : 1;
      for (const sym of covers) {
        for (let i = 0; i < recogPerSymbol; i++) {
          const e = buildRecognition(sym, distractorPool, difficulty);
          if (e) buildList.push(e);
        }
      }
      // VOCAB_MCQ: 1 per example with hanzi (intro lessons mostly).
      const mcqExamples = (content.examples ?? []).filter(
        (e) => e.hanzi && e.zhuyin,
      );
      for (const ex of mcqExamples) {
        const sourceSym =
          ex.zhuyin?.split("").find((c) => SYMBOL_INDEX.has(c)) ?? covers[0];
        if (!sourceSym) continue;
        const mcq = buildVocabMcq(sourceSym, ex.hanzi, hanziPool, difficulty);
        if (mcq) buildList.push(mcq);
      }
    }

    let order = 0;
    for (const built of buildList) {
      if (!built) continue;
      await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          type: built.type,
          difficulty: built.difficulty,
          prompt: built.prompt,
          options: built.options,
          answer: built.answer,
          audioUrl: ("audioUrl" in built ? built.audioUrl : undefined) ?? null,
          maxScore: 10,
          passingScore: 6,
          skillsTrained: built.skillsTrained,
          orderIndex: order,
          isActive: true,
        },
      });
      order++;
      total++;
      byType[built.type] = (byType[built.type] ?? 0) + 1;
    }
  }

  return { total, byType };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
