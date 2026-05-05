/**
 * Seed 5 more A1 stages, each with vocab + auto-built MCQ exercises.
 *
 *   L1-S03  數字       Numbers 1–10        (10 words)
 *   L1-S04  時間       Time of day          ( 8 words)
 *   L1-S05  身體部位    Body parts           (10 words)
 *   L1-S06  家人       Family members       ( 8 words)
 *   L1-S07  食物       Common food          (10 words)
 *
 * Re-runnable: upserts vocab + stage + lesson, wipes & re-creates exercises.
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
  partOfSpeech: string;
  /** Description fed to DALL-E so generated clay illustration matches meaning */
  imagePromptHint: string;
}

interface StageSeed {
  code: string;
  title: string;
  titleEn: string;
  titleTh: string;
  description: string;
  orderIndex: number;
  category: string;
  vocab: VocabSeed[];
}

// ─── L1-S03: Numbers ────────────────────────────────────────────────────────
const NUMBERS: VocabSeed[] = [
  { hanzi: "一", zhuyin: "ㄧ",   pinyin: "Yī",  translations: { en: "one",   th: "หนึ่ง" }, partOfSpeech: "num.", imagePromptHint: "single clay number 1 with one finger raised" },
  { hanzi: "二", zhuyin: "ㄦˋ",  pinyin: "Èr",  translations: { en: "two",   th: "สอง" },   partOfSpeech: "num.", imagePromptHint: "clay number 2 with two fingers raised" },
  { hanzi: "三", zhuyin: "ㄙㄢ", pinyin: "Sān", translations: { en: "three", th: "สาม" },   partOfSpeech: "num.", imagePromptHint: "clay number 3 with three fingers raised" },
  { hanzi: "四", zhuyin: "ㄙˋ",  pinyin: "Sì",  translations: { en: "four",  th: "สี่" },   partOfSpeech: "num.", imagePromptHint: "clay number 4 with four fingers raised" },
  { hanzi: "五", zhuyin: "ㄨˇ",  pinyin: "Wǔ",  translations: { en: "five",  th: "ห้า" },   partOfSpeech: "num.", imagePromptHint: "clay number 5 with open hand five fingers" },
  { hanzi: "六", zhuyin: "ㄌㄧㄡˋ", pinyin: "Liù", translations: { en: "six",   th: "หก" },    partOfSpeech: "num.", imagePromptHint: "clay number 6 with six dots dice" },
  { hanzi: "七", zhuyin: "ㄑㄧ", pinyin: "Qī",  translations: { en: "seven", th: "เจ็ด" },  partOfSpeech: "num.", imagePromptHint: "clay number 7 with seven small balls" },
  { hanzi: "八", zhuyin: "ㄅㄚ", pinyin: "Bā",  translations: { en: "eight", th: "แปด" },   partOfSpeech: "num.", imagePromptHint: "clay number 8 with figure-eight shape" },
  { hanzi: "九", zhuyin: "ㄐㄧㄡˇ", pinyin: "Jiǔ", translations: { en: "nine",  th: "เก้า" },  partOfSpeech: "num.", imagePromptHint: "clay number 9 with nine balls grouped" },
  { hanzi: "十", zhuyin: "ㄕˊ",  pinyin: "Shí", translations: { en: "ten",   th: "สิบ" },   partOfSpeech: "num.", imagePromptHint: "clay number 10 with ten fingers two hands" },
];

// ─── L1-S04: Time of day ─────────────────────────────────────────────────────
const TIME_WORDS: VocabSeed[] = [
  { hanzi: "今天", zhuyin: "ㄐㄧㄣ ㄊㄧㄢ", pinyin: "Jīntiān",  translations: { en: "today",     th: "วันนี้" },     partOfSpeech: "n.", imagePromptHint: "calendar showing today date highlighted clay" },
  { hanzi: "明天", zhuyin: "ㄇㄧㄥˊ ㄊㄧㄢ", pinyin: "Míngtiān", translations: { en: "tomorrow",  th: "พรุ่งนี้" },    partOfSpeech: "n.", imagePromptHint: "calendar with arrow pointing to next day clay" },
  { hanzi: "昨天", zhuyin: "ㄗㄨㄛˊ ㄊㄧㄢ", pinyin: "Zuótiān",  translations: { en: "yesterday", th: "เมื่อวาน" },   partOfSpeech: "n.", imagePromptHint: "calendar with arrow pointing to previous day clay" },
  { hanzi: "早上", zhuyin: "ㄗㄠˇ ㄕㄤˋ",   pinyin: "Zǎoshàng", translations: { en: "morning",   th: "ตอนเช้า" },    partOfSpeech: "n.", imagePromptHint: "sunrise sun above horizon clay morning scene" },
  { hanzi: "中午", zhuyin: "ㄓㄨㄥ ㄨˇ",   pinyin: "Zhōngwǔ",  translations: { en: "noon",      th: "ตอนเที่ยง" },  partOfSpeech: "n.", imagePromptHint: "sun directly overhead clay noon scene" },
  { hanzi: "下午", zhuyin: "ㄒㄧㄚˋ ㄨˇ",   pinyin: "Xiàwǔ",    translations: { en: "afternoon", th: "ตอนบ่าย" },    partOfSpeech: "n.", imagePromptHint: "sun lower in sky clay afternoon scene" },
  { hanzi: "晚上", zhuyin: "ㄨㄢˇ ㄕㄤˋ",   pinyin: "Wǎnshàng", translations: { en: "evening",   th: "ตอนเย็น" },    partOfSpeech: "n.", imagePromptHint: "moon and stars in dark sky clay evening" },
  { hanzi: "現在", zhuyin: "ㄒㄧㄢˋ ㄗㄞˋ", pinyin: "Xiànzài",  translations: { en: "now",       th: "ตอนนี้" },     partOfSpeech: "n.", imagePromptHint: "clock showing current time with arrow pointing now clay" },
];

// ─── L1-S05: Body parts ──────────────────────────────────────────────────────
const BODY_PARTS: VocabSeed[] = [
  { hanzi: "頭",   zhuyin: "ㄊㄡˊ",      pinyin: "Tóu",     translations: { en: "head",    th: "หัว" },     partOfSpeech: "n.", imagePromptHint: "clay friendly cartoon human head" },
  { hanzi: "眼睛", zhuyin: "ㄧㄢˇ ㄐㄧㄥ", pinyin: "Yǎnjīng", translations: { en: "eyes",    th: "ตา" },      partOfSpeech: "n.", imagePromptHint: "clay pair of cartoon eyes with eyelashes" },
  { hanzi: "嘴",   zhuyin: "ㄗㄨㄟˇ",    pinyin: "Zuǐ",     translations: { en: "mouth",   th: "ปาก" },     partOfSpeech: "n.", imagePromptHint: "clay smiling mouth with lips" },
  { hanzi: "耳朵", zhuyin: "ㄦˇ ˙ㄉㄨㄛ", pinyin: "Ěrduo",   translations: { en: "ears",    th: "หู" },      partOfSpeech: "n.", imagePromptHint: "clay pair of cartoon ears" },
  { hanzi: "手",   zhuyin: "ㄕㄡˇ",      pinyin: "Shǒu",    translations: { en: "hand",    th: "มือ" },     partOfSpeech: "n.", imagePromptHint: "clay friendly cartoon human hand waving" },
  { hanzi: "腳",   zhuyin: "ㄐㄧㄠˇ",     pinyin: "Jiǎo",    translations: { en: "foot",    th: "เท้า" },    partOfSpeech: "n.", imagePromptHint: "clay cartoon human foot" },
  { hanzi: "心臟", zhuyin: "ㄒㄧㄣ ㄗㄤˋ", pinyin: "Xīnzàng", translations: { en: "heart",   th: "หัวใจ" },   partOfSpeech: "n.", imagePromptHint: "clay anatomical heart organ red friendly" },
  { hanzi: "肚子", zhuyin: "ㄉㄨˋ ˙ㄗ",  pinyin: "Dùzi",    translations: { en: "belly",   th: "ท้อง" },    partOfSpeech: "n.", imagePromptHint: "clay cute round belly cartoon" },
  { hanzi: "背",   zhuyin: "ㄅㄟˋ",      pinyin: "Bèi",     translations: { en: "back",    th: "หลัง" },    partOfSpeech: "n.", imagePromptHint: "clay cartoon person back rear view" },
  { hanzi: "牙齒", zhuyin: "ㄧㄚˊ ㄔˇ",   pinyin: "Yáchǐ",   translations: { en: "teeth",   th: "ฟัน" },     partOfSpeech: "n.", imagePromptHint: "clay sparkling white teeth row" },
];

// ─── L1-S06: Family members ──────────────────────────────────────────────────
const FAMILY: VocabSeed[] = [
  { hanzi: "爸爸", zhuyin: "˙ㄅㄚ ˙ㄅㄚ", pinyin: "Bàba",  translations: { en: "father",            th: "พ่อ" },      partOfSpeech: "n.", imagePromptHint: "clay smiling father man character" },
  { hanzi: "媽媽", zhuyin: "˙ㄇㄚ ˙ㄇㄚ", pinyin: "Māma",  translations: { en: "mother",            th: "แม่" },      partOfSpeech: "n.", imagePromptHint: "clay smiling mother woman character" },
  { hanzi: "兒子", zhuyin: "ㄦˊ ˙ㄗ",    pinyin: "Érzi",  translations: { en: "son",               th: "ลูกชาย" },   partOfSpeech: "n.", imagePromptHint: "clay young boy child happy" },
  { hanzi: "女兒", zhuyin: "ㄋㄩˇ ㄦˊ",   pinyin: "Nǚʼér", translations: { en: "daughter",          th: "ลูกสาว" },   partOfSpeech: "n.", imagePromptHint: "clay young girl child happy" },
  { hanzi: "阿公", zhuyin: "ㄚ ㄍㄨㄥ",    pinyin: "Āgōng", translations: { en: "grandfather",       th: "ปู่ / ตา" },   partOfSpeech: "n.", imagePromptHint: "clay smiling old grandfather with white hair friendly" },
  { hanzi: "阿嬤", zhuyin: "ㄚ ˙ㄇㄚ",    pinyin: "Āmā",   translations: { en: "grandmother",       th: "ย่า / ยาย" }, partOfSpeech: "n.", imagePromptHint: "clay smiling old grandmother with white hair friendly" },
  { hanzi: "哥哥", zhuyin: "˙ㄍㄜ ˙ㄍㄜ", pinyin: "Gēge",  translations: { en: "older brother",     th: "พี่ชาย" },    partOfSpeech: "n.", imagePromptHint: "clay teenage boy older brother character" },
  { hanzi: "姊姊", zhuyin: "˙ㄐㄧㄝ ˙ㄐㄧㄝ", pinyin: "Jiějie", translations: { en: "older sister",  th: "พี่สาว" },    partOfSpeech: "n.", imagePromptHint: "clay teenage girl older sister character" },
];

// ─── L1-S07: Common food ─────────────────────────────────────────────────────
const FOOD: VocabSeed[] = [
  { hanzi: "飯",   zhuyin: "ㄈㄢˋ",       pinyin: "Fàn",    translations: { en: "rice / meal", th: "ข้าว" },         partOfSpeech: "n.", imagePromptHint: "clay bowl of white rice steaming hot" },
  { hanzi: "水",   zhuyin: "ㄕㄨㄟˇ",     pinyin: "Shuǐ",   translations: { en: "water",       th: "น้ำ" },          partOfSpeech: "n.", imagePromptHint: "clay clear glass of water with droplet" },
  { hanzi: "茶",   zhuyin: "ㄔㄚˊ",       pinyin: "Chá",    translations: { en: "tea",         th: "ชา" },           partOfSpeech: "n.", imagePromptHint: "clay teacup with hot tea steam" },
  { hanzi: "湯",   zhuyin: "ㄊㄤ",        pinyin: "Tāng",   translations: { en: "soup",        th: "ซุป" },          partOfSpeech: "n.", imagePromptHint: "clay bowl of hot soup with spoon" },
  { hanzi: "麵",   zhuyin: "ㄇㄧㄢˋ",     pinyin: "Miàn",   translations: { en: "noodles",     th: "เส้น / บะหมี่" }, partOfSpeech: "n.", imagePromptHint: "clay bowl of noodles with chopsticks" },
  { hanzi: "肉",   zhuyin: "ㄖㄡˋ",       pinyin: "Ròu",    translations: { en: "meat",        th: "เนื้อ" },         partOfSpeech: "n.", imagePromptHint: "clay grilled cut of meat on plate" },
  { hanzi: "菜",   zhuyin: "ㄘㄞˋ",       pinyin: "Cài",    translations: { en: "vegetable",   th: "ผัก" },          partOfSpeech: "n.", imagePromptHint: "clay green leafy vegetables on plate" },
  { hanzi: "水果", zhuyin: "ㄕㄨㄟˇ ㄍㄨㄛˇ", pinyin: "Shuǐguǒ", translations: { en: "fruit",        th: "ผลไม้" },        partOfSpeech: "n.", imagePromptHint: "clay assortment of colorful fruits apple banana" },
  { hanzi: "蛋",   zhuyin: "ㄉㄢˋ",       pinyin: "Dàn",    translations: { en: "egg",         th: "ไข่" },          partOfSpeech: "n.", imagePromptHint: "clay white egg with cracked shell" },
  { hanzi: "牛奶", zhuyin: "ㄋㄧㄡˊ ㄋㄞˇ", pinyin: "Niúnǎi", translations: { en: "milk",        th: "นม" },           partOfSpeech: "n.", imagePromptHint: "clay glass of cold white milk" },
];

const STAGES: StageSeed[] = [
  { code: "L1-S03", title: "數字 1–10",  titleEn: "Numbers 1–10",   titleTh: "ตัวเลข 1–10",        description: "นับเลขที่ใช้ทุกวัน",         orderIndex: 2, category: "a1-numbers",  vocab: NUMBERS },
  { code: "L1-S04", title: "時間",       titleEn: "Time of Day",    titleTh: "เวลาในแต่ละวัน",       description: "ช่วงเวลาในแต่ละวัน",       orderIndex: 3, category: "a1-time",     vocab: TIME_WORDS },
  { code: "L1-S05", title: "身體部位",    titleEn: "Body Parts",     titleTh: "ส่วนของร่างกาย",        description: "พูดเรื่องสุขภาพกับผู้สูงอายุ", orderIndex: 4, category: "a1-body",     vocab: BODY_PARTS },
  { code: "L1-S06", title: "家人",       titleEn: "Family Members", titleTh: "สมาชิกในครอบครัว",     description: "เรียกขานคนในครอบครัว",  orderIndex: 5, category: "a1-family",   vocab: FAMILY },
  { code: "L1-S07", title: "食物",       titleEn: "Common Food",    titleTh: "อาหารทั่วไป",          description: "อาหารและเครื่องดื่มประจำวัน", orderIndex: 6, category: "a1-food",     vocab: FOOD },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertVocabulary(stage: StageSeed) {
  for (const v of stage.vocab) {
    await db.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      create: {
        hanzi: v.hanzi,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: { ...v.translations, en: v.imagePromptHint }, // EN field used as DALL-E prompt subject
        level: Level.A1_BEGINNER,
        tocflBand: "A1",
        frequency: 1,
        difficulty: 1,
        category: stage.category,
        tags: ["a1", "elder-care"],
        isEldercareVocab: true,
      },
      update: {
        translations: { ...v.translations, en: v.imagePromptHint },
        category: stage.category,
        partOfSpeech: v.partOfSpeech,
      },
    });
  }
}

async function upsertStageWithLesson(courseId: string, stage: StageSeed) {
  const stageRow = await db.stage.upsert({
    where: { courseId_code: { courseId, code: stage.code } },
    create: {
      courseId,
      code: stage.code,
      title: stage.title,
      titleI18n: { en: stage.titleEn, th: stage.titleTh },
      description: stage.description,
      orderIndex: stage.orderIndex,
    },
    update: {
      title: stage.title,
      titleI18n: { en: stage.titleEn, th: stage.titleTh },
      description: stage.description,
      orderIndex: stage.orderIndex,
    },
  });

  const lessonCode = `${stage.code}-VOCAB`;
  const lesson = await db.lesson.upsert({
    where: { stageId_code: { stageId: stageRow.id, code: lessonCode } },
    create: {
      stageId: stageRow.id,
      code: lessonCode,
      title: stage.title,
      titleI18n: { en: stage.titleEn, th: stage.titleTh },
      description: `${stage.vocab.length} 個必修詞彙`,
      type: "VOCAB",
      difficulty: 1,
      orderIndex: 0,
      estimatedMinutes: Math.max(5, Math.ceil(stage.vocab.length * 1.5)),
      xpReward: stage.vocab.length * 3,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: stage.title,
        items: stage.vocab.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations, // user-facing translations (no DALL-E hint)
        })),
      },
    },
    update: {
      title: stage.title,
      titleI18n: { en: stage.titleEn, th: stage.titleTh },
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: stage.title,
        items: stage.vocab.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
        })),
      },
    },
  });

  return { stageRow, lesson };
}

function pickN<T>(arr: T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

async function buildExercises(lessonId: string, vocab: VocabSeed[]) {
  await db.exercise.deleteMany({ where: { lessonId } });

  const targets = vocab.slice(0, Math.min(6, vocab.length)); // cap 6 per lesson
  const labels = ["A", "B", "C"];

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const correct = target.translations.th;
    const distractors = pickN(
      vocab.filter((v) => v.hanzi !== target.hanzi).map((v) => v.translations.th),
      2,
    );
    if (distractors.length < 2) continue;

    const opts = [correct, ...distractors];
    for (let j = opts.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [opts[j], opts[k]] = [opts[k], opts[j]];
    }
    const correctIdx = opts.indexOf(correct);

    await db.exercise.create({
      data: {
        lessonId,
        type: "VOCAB_MCQ",
        prompt: { hanzi: target.hanzi, pinyin: target.pinyin },
        options: opts.map((label, idx) => ({ value: labels[idx], label })),
        answer: { value: labels[correctIdx] },
        maxScore: 10,
        orderIndex: i,
        isActive: true,
      },
    });
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const course = await db.course.findUnique({ where: { code: "A1" } });
  if (!course) {
    console.error("❌ A1 course not found — run seed-a1-scenarios.ts first");
    process.exit(1);
  }
  console.log(`📚 A1 course: ${course.id}\n`);

  for (const stage of STAGES) {
    await upsertVocabulary(stage);
    const { lesson } = await upsertStageWithLesson(course.id, stage);
    await buildExercises(lesson.id, stage.vocab);
    console.log(`  ✅ ${stage.code} ${stage.title} — ${stage.vocab.length} words + 6 exercises`);
  }

  const totalNew = STAGES.reduce((s, st) => s + st.vocab.length, 0);
  console.log(`\n🎉 Added ${STAGES.length} stages, ${totalNew} new words, ${STAGES.length * 6} exercises`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
