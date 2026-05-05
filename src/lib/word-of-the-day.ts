/**
 * Pick a deterministic "word of the day" per user.
 * Same word for the whole day; rotates daily.
 */
import { db } from "@/lib/db";
import type { DailyWord } from "@/components/learner/word-of-the-day";
import type { Level } from "@prisma/client";

// Levels accessible at-or-below a given user level
const LEVEL_ORDER: Level[] = [
  "ZHUYIN",
  "A1_BEGINNER",
  "A2_BASIC",
  "B1_INTERMEDIATE",
  "B2_UPPER_INTER",
  "C1_ADVANCED",
  "C2_PROFICIENT",
];

function levelsUpTo(level: Level): Level[] {
  const idx = LEVEL_ORDER.indexOf(level);
  if (idx < 0) return [level];
  // Include the user's level + one above (preview) so the daily word can teach
  return LEVEL_ORDER.slice(0, idx + 2);
}

/** Cheap deterministic hash → integer */
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export async function pickDailyWord(
  userId: string,
  userLevel: Level,
  locale: string,
): Promise<DailyWord | null> {
  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seed = hash(`${userId}|${dayKey}`);

  // Build candidate pool: vocab at user's level or one above, with a real meaning
  const pool = await db.vocabulary.findMany({
    where: { level: { in: levelsUpTo(userLevel) } },
    select: {
      hanzi: true,
      pinyin: true,
      zhuyin: true,
      partOfSpeech: true,
      translations: true,
      level: true,
      imageUrl: true,
    },
  });
  if (pool.length === 0) return null;

  const idx = seed % pool.length;
  const v = pool[idx]!;
  const trans = v.translations as Record<string, string> | null;
  const translation = trans?.th ?? trans?.[locale] ?? trans?.en ?? "";

  // Look up an example sentence from any lesson that contains this word
  // (uses our existing embedded-example schema in lesson content JSON)
  const lesson = await db.lesson.findFirst({
    where: {
      isPublished: true,
      content: { path: ["items"], array_contains: [{ hanzi: v.hanzi }] },
    },
    select: { content: true },
  }).catch(() => null);

  let exampleSentence: string | undefined;
  let exampleTranslation: string | undefined;
  let mnemonic: string | undefined;
  if (lesson) {
    const items = (lesson.content as { items?: Array<{
      hanzi: string;
      example?: { sentence?: string; sentenceTh?: string };
      examples?: Array<{ sentence: string; translation?: string }>;
      mnemonic?: string;
    }> })?.items;
    const item = items?.find((i) => i.hanzi === v.hanzi);
    if (item) {
      if (item.examples && item.examples.length > 0) {
        exampleSentence = item.examples[0]!.sentence;
        exampleTranslation = item.examples[0]!.translation;
      } else if (item.example?.sentence) {
        exampleSentence = item.example.sentence;
        exampleTranslation = item.example.sentenceTh;
      }
      mnemonic = item.mnemonic;
    }
  }

  return {
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    zhuyin: v.zhuyin,
    partOfSpeech: v.partOfSpeech ?? undefined,
    translation,
    level: v.level,
    imageUrl: v.imageUrl ?? `/api/vocab-image/${encodeURIComponent(v.hanzi)}`,
    exampleSentence,
    exampleTranslation,
    mnemonic,
  };
}
