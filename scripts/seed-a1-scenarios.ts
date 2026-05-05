/**
 * Seed A1 starter content: 2 stages × 1 vocabulary lesson each.
 *  Stage 1 (L1-S01) — 招呼 Greetings (8 words)
 *  Stage 2 (L1-S02) — 自我介紹 Self-Introduction (10 words)
 *
 * Each word also gets a Vocabulary table record with English translation,
 * so the on-demand DALL-E image generator can produce a relevant clay illustration.
 *
 * Run: npx tsx scripts/seed-a1-scenarios.ts
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Level } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface VocabSeed {
  hanzi: string;
  zhuyin: string;
  pinyin: string;
  translations: { en: string; th: string };
  partOfSpeech?: string;
  imagePromptHint: string; // Used as English meaning for DALL-E if better than translations.en
  category: string;
  note?: string;
}

// ─── Stage 1: Greetings ──────────────────────────────────────────────────────
const GREETINGS: VocabSeed[] = [
  {
    hanzi: "你好", zhuyin: "ㄋㄧˇ ㄏㄠˇ", pinyin: "Nǐ hǎo",
    translations: { en: "hello", th: "สวัสดี" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "two people clay characters waving hello smiling friendly",
  },
  {
    hanzi: "早安", zhuyin: "ㄗㄠˇ ㄢ", pinyin: "Zǎo ān",
    translations: { en: "good morning", th: "สวัสดีตอนเช้า" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "sunrise morning sun cheerful clay scene",
  },
  {
    hanzi: "午安", zhuyin: "ㄨˇ ㄢ", pinyin: "Wǔ ān",
    translations: { en: "good afternoon", th: "สวัสดีตอนบ่าย" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "midday sun overhead afternoon clay illustration",
  },
  {
    hanzi: "晚安", zhuyin: "ㄨㄢˇ ㄢ", pinyin: "Wǎn ān",
    translations: { en: "good night", th: "ราตรีสวัสดิ์" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "moon stars sleeping sweet dreams clay night",
  },
  {
    hanzi: "再見", zhuyin: "ㄗㄞˋ ㄐㄧㄢˋ", pinyin: "Zàijiàn",
    translations: { en: "goodbye", th: "ลาก่อน" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "waving goodbye farewell hand clay character",
  },
  {
    hanzi: "謝謝", zhuyin: "ㄒㄧㄝˋ˙ㄒㄧㄝ", pinyin: "Xièxie",
    translations: { en: "thank you", th: "ขอบคุณ" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "gratitude bowing thank you grateful clay character with heart",
  },
  {
    hanzi: "對不起", zhuyin: "ㄉㄨㄟˋ ㄅㄨ˙ㄑㄧˇ", pinyin: "Duìbuqǐ",
    translations: { en: "sorry", th: "ขอโทษ" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "apologetic sad clay character with sorry expression",
  },
  {
    hanzi: "不客氣", zhuyin: "ㄅㄨˊ ㄎㄜˋ ㄑㄧˋ", pinyin: "Bú kèqì",
    translations: { en: "you are welcome", th: "ไม่เป็นไร / ยินดี" },
    partOfSpeech: "phr.", category: "a1-greetings",
    imagePromptHint: "smiling friendly clay character open palm welcoming gesture",
  },
];

// ─── Stage 2: Self-Introduction ───────────────────────────────────────────────
const SELF_INTRO: VocabSeed[] = [
  {
    hanzi: "我", zhuyin: "ㄨㄛˇ", pinyin: "Wǒ",
    translations: { en: "I, me", th: "ฉัน" },
    partOfSpeech: "pron.", category: "a1-selfintro",
    imagePromptHint: "clay character pointing to self with thumb on chest",
  },
  {
    hanzi: "你", zhuyin: "ㄋㄧˇ", pinyin: "Nǐ",
    translations: { en: "you", th: "คุณ / เธอ" },
    partOfSpeech: "pron.", category: "a1-selfintro",
    imagePromptHint: "clay character pointing finger forward at viewer",
  },
  {
    hanzi: "他", zhuyin: "ㄊㄚ", pinyin: "Tā",
    translations: { en: "he, him", th: "เขา (ชาย)" },
    partOfSpeech: "pron.", category: "a1-selfintro",
    imagePromptHint: "clay male character with male symbol pointing at him",
  },
  {
    hanzi: "她", zhuyin: "ㄊㄚ", pinyin: "Tā",
    translations: { en: "she, her", th: "เขา (หญิง)" },
    partOfSpeech: "pron.", category: "a1-selfintro",
    imagePromptHint: "clay female character with female symbol pointing at her",
  },
  {
    hanzi: "名字", zhuyin: "ㄇㄧㄥˊ ˙ㄗ", pinyin: "Míngzi",
    translations: { en: "name", th: "ชื่อ" },
    partOfSpeech: "n.", category: "a1-selfintro",
    imagePromptHint: "name tag badge with text label clay illustration",
  },
  {
    hanzi: "叫", zhuyin: "ㄐㄧㄠˋ", pinyin: "Jiào",
    translations: { en: "to be called, named", th: "ชื่อ (เรียกว่า)" },
    partOfSpeech: "v.", category: "a1-selfintro",
    imagePromptHint: "speech bubble introducing name clay character speaking",
  },
  {
    hanzi: "中文", zhuyin: "ㄓㄨㄥ ㄨㄣˊ", pinyin: "Zhōngwén",
    translations: { en: "Chinese language", th: "ภาษาจีน" },
    partOfSpeech: "n.", category: "a1-selfintro",
    imagePromptHint: "Chinese character book language learning clay textbook",
  },
  {
    hanzi: "泰國", zhuyin: "ㄊㄞˋ ㄍㄨㄛˊ", pinyin: "Tàiguó",
    translations: { en: "Thailand", th: "ประเทศไทย" },
    partOfSpeech: "n.", category: "a1-selfintro",
    imagePromptHint: "Thailand temple wat tropical scene clay landmark",
  },
  {
    hanzi: "越南", zhuyin: "ㄩㄝˋ ㄋㄢˊ", pinyin: "Yuènán",
    translations: { en: "Vietnam", th: "ประเทศเวียดนาม" },
    partOfSpeech: "n.", category: "a1-selfintro",
    imagePromptHint: "Vietnam conical hat rice paddy clay landmark scene",
  },
  {
    hanzi: "台灣", zhuyin: "ㄊㄞˊ ㄨㄢ", pinyin: "Táiwān",
    translations: { en: "Taiwan", th: "ประเทศไต้หวัน" },
    partOfSpeech: "n.", category: "a1-selfintro",
    imagePromptHint: "Taiwan island Taipei 101 tower clay landmark",
  },
];

async function seedVocabulary(seeds: VocabSeed[]) {
  for (const s of seeds) {
    await db.vocabulary.upsert({
      where: { hanzi: s.hanzi },
      create: {
        hanzi: s.hanzi,
        zhuyin: s.zhuyin,
        pinyin: s.pinyin,
        partOfSpeech: s.partOfSpeech ?? null,
        translations: s.translations,
        level: Level.A1_BEGINNER,
        tocflBand: "A1",
        frequency: 1,
        difficulty: 1,
        category: s.category,
        tags: ["a1", "elder-care"],
        isEldercareVocab: true,
        audioUrl: null,
      },
      update: {
        translations: s.translations,
        category: s.category,
        partOfSpeech: s.partOfSpeech ?? null,
      },
    });
  }
}

async function seedStage(opts: {
  courseId: string;
  code: string;
  title: string;
  titleEn: string;
  titleTh: string;
  description: string;
  orderIndex: number;
  seeds: VocabSeed[];
}) {
  const stage = await db.stage.upsert({
    where: { courseId_code: { courseId: opts.courseId, code: opts.code } },
    create: {
      courseId: opts.courseId,
      code: opts.code,
      title: opts.title,
      titleI18n: { en: opts.titleEn, th: opts.titleTh },
      description: opts.description,
      orderIndex: opts.orderIndex,
    },
    update: {
      title: opts.title,
      titleI18n: { en: opts.titleEn, th: opts.titleTh },
      description: opts.description,
      orderIndex: opts.orderIndex,
    },
  });

  const lessonCode = `${opts.code}-VOCAB`;
  await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: lessonCode } },
    create: {
      stageId: stage.id,
      code: lessonCode,
      title: opts.title,
      titleI18n: { en: opts.titleEn, th: opts.titleTh },
      description: `${opts.seeds.length} 個必修詞彙`,
      type: "VOCAB",
      difficulty: 1,
      orderIndex: 0,
      estimatedMinutes: Math.max(5, Math.ceil(opts.seeds.length * 1.5)),
      xpReward: opts.seeds.length * 3,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: opts.title,
        items: opts.seeds.map((s) => ({
          hanzi: s.hanzi,
          pinyin: s.pinyin,
          translations: s.translations,
          note: s.note,
        })),
      },
    },
    update: {
      title: opts.title,
      titleI18n: { en: opts.titleEn, th: opts.titleTh },
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: opts.title,
        items: opts.seeds.map((s) => ({
          hanzi: s.hanzi,
          pinyin: s.pinyin,
          translations: s.translations,
          note: s.note,
        })),
      },
    },
  });

  console.log(`  ✅ ${opts.code} — ${opts.title} (${opts.seeds.length} words)`);
}

async function main() {
  // Ensure A1 course exists
  const course = await db.course.upsert({
    where: { code: "A1" },
    create: {
      code: "A1",
      title: "A1 入門 · 從零開始說中文",
      titleI18n: { en: "A1 Beginner · Speak Chinese from Zero", th: "A1 เริ่มต้น · พูดจีนจากศูนย์" },
      description: "12 個情境關卡，從打招呼到認識阿公阿嬤",
      level: Level.A1_BEGINNER,
      category: "GENERAL",
      estimatedHours: 30,
      vocabularyCount: 300,
      tocflTarget: "TOCFL 1",
      orderIndex: 1,
      isPublished: true,
    },
    update: {
      title: "A1 入門 · 從零開始說中文",
      titleI18n: { en: "A1 Beginner · Speak Chinese from Zero", th: "A1 เริ่มต้น · พูดจีนจากศูนย์" },
      isPublished: true,
    },
  });

  console.log(`📚 Course: ${course.code} (${course.id})\n`);

  // Step 1: vocabulary records (so DALL-E lookups work)
  console.log("=== Seeding vocabulary records ===");
  await seedVocabulary([...GREETINGS, ...SELF_INTRO]);
  console.log(`  ✅ Upserted ${GREETINGS.length + SELF_INTRO.length} vocabulary records\n`);

  // Step 2: stages + lessons
  console.log("=== Seeding stages & lessons ===");
  await seedStage({
    courseId: course.id,
    code: "L1-S01",
    title: "招呼用語",
    titleEn: "Greetings",
    titleTh: "คำทักทาย",
    description: "พื้นฐานการทักทายในที่ทำงาน",
    orderIndex: 0,
    seeds: GREETINGS,
  });
  await seedStage({
    courseId: course.id,
    code: "L1-S02",
    title: "自我介紹",
    titleEn: "Self-Introduction",
    titleTh: "แนะนำตัว",
    description: "บอกชื่อและประเทศของคุณ",
    orderIndex: 1,
    seeds: SELF_INTRO,
  });

  // Patch the imagePromptHint into translations.en so DALL-E gets a richer prompt
  // (The imagePromptHint is more visual than the bare translation)
  console.log("\n=== Enriching DALL-E prompts with image hints ===");
  for (const s of [...GREETINGS, ...SELF_INTRO]) {
    const v = await db.vocabulary.findUnique({ where: { hanzi: s.hanzi } });
    const existing = (v?.translations as Record<string, string> | null) ?? {};
    await db.vocabulary.update({
      where: { hanzi: s.hanzi },
      data: { translations: { ...existing, en: s.imagePromptHint } },
    });
  }
  console.log(`  ✅ Updated ${GREETINGS.length + SELF_INTRO.length} prompts`);

  console.log("\n🎉 A1 starter content seeded successfully!");
  console.log(`   Course URL: /th/learn/A1`);
  console.log(`   Stage 1 lesson: /th/learn/A1/lesson/L1-S01-VOCAB`);
  console.log(`   Stage 2 lesson: /th/learn/A1/lesson/L1-S02-VOCAB`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
