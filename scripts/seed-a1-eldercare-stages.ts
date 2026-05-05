/**
 * Seed A1 stages 8-12, eldercare-specific daily tasks.
 *
 *   L1-S08 餵食 (Feeding)
 *   L1-S09 餵藥 (Medicine)
 *   L1-S10 翻身換尿布 (Turning & diaper changing)
 *   L1-S11 量測 (Measurements)
 *   L1-S12 上廁所·洗澡 (Toilet & bathing)
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

const FEEDING: VocabSeed[] = [
  { hanzi: "吃",   zhuyin: "ㄔ",        pinyin: "Chī",     translations: { en: "to eat",      th: "กิน" },          partOfSpeech: "v.", imagePromptHint: "clay character eating with chopsticks happy" },
  { hanzi: "喝",   zhuyin: "ㄏㄜ",      pinyin: "Hē",      translations: { en: "to drink",    th: "ดื่ม" },         partOfSpeech: "v.", imagePromptHint: "clay character drinking from cup" },
  { hanzi: "慢慢", zhuyin: "ㄇㄢˋ ㄇㄢˋ", pinyin: "Mànman",  translations: { en: "slowly",     th: "ช้าๆ" },         partOfSpeech: "adv.", imagePromptHint: "clay turtle moving slowly with snail" },
  { hanzi: "小心", zhuyin: "ㄒㄧㄠˇ ㄒㄧㄣ", pinyin: "Xiǎoxīn", translations: { en: "careful",   th: "ระวัง" },        partOfSpeech: "adj.", imagePromptHint: "clay yellow caution warning sign exclamation" },
  { hanzi: "燙",   zhuyin: "ㄊㄤˋ",      pinyin: "Tàng",    translations: { en: "hot (touch)", th: "ร้อน (ลวก)" },   partOfSpeech: "adj.", imagePromptHint: "clay steaming hot bowl with red heat warning" },
  { hanzi: "軟",   zhuyin: "ㄖㄨㄢˇ",   pinyin: "Ruǎn",    translations: { en: "soft",        th: "นุ่ม" },          partOfSpeech: "adj.", imagePromptHint: "clay soft squishy pillow plush" },
  { hanzi: "餵",   zhuyin: "ㄨㄟˋ",      pinyin: "Wèi",     translations: { en: "to feed",     th: "ป้อนอาหาร" },   partOfSpeech: "v.", imagePromptHint: "clay caregiver feeding elderly person with spoon" },
  { hanzi: "飽",   zhuyin: "ㄅㄠˇ",      pinyin: "Bǎo",     translations: { en: "full (after eating)", th: "อิ่ม" }, partOfSpeech: "adj.", imagePromptHint: "clay character with full happy round belly satisfied" },
];

const MEDICINE: VocabSeed[] = [
  { hanzi: "藥",   zhuyin: "ㄧㄠˋ",      pinyin: "Yào",      translations: { en: "medicine",         th: "ยา" },          partOfSpeech: "n.", imagePromptHint: "clay colorful pills medicine bottle" },
  { hanzi: "顆",   zhuyin: "ㄎㄜ",      pinyin: "Kē",       translations: { en: "(measure for pills)", th: "เม็ด (ลักษณนาม)" }, partOfSpeech: "mw.", imagePromptHint: "clay single round pill capsule" },
  { hanzi: "吃藥", zhuyin: "ㄔ ㄧㄠˋ",  pinyin: "Chī yào",  translations: { en: "take medicine",   th: "กินยา" },        partOfSpeech: "v.", imagePromptHint: "clay character taking pill with water" },
  { hanzi: "飯後", zhuyin: "ㄈㄢˋ ㄏㄡˋ", pinyin: "Fàn hòu", translations: { en: "after meal",      th: "หลังอาหาร" },   partOfSpeech: "n.", imagePromptHint: "clay empty bowl with arrow pointing to next clock time" },
  { hanzi: "飯前", zhuyin: "ㄈㄢˋ ㄑㄧㄢˊ", pinyin: "Fàn qián", translations: { en: "before meal",  th: "ก่อนอาหาร" },   partOfSpeech: "n.", imagePromptHint: "clay clock pointing to time before bowl of food" },
  { hanzi: "吞",   zhuyin: "ㄊㄨㄣ",     pinyin: "Tūn",      translations: { en: "to swallow",      th: "กลืน" },         partOfSpeech: "v.", imagePromptHint: "clay character swallowing pill throat motion" },
  { hanzi: "喝水", zhuyin: "ㄏㄜ ㄕㄨㄟˇ", pinyin: "Hē shuǐ", translations: { en: "to drink water", th: "ดื่มน้ำ" },     partOfSpeech: "v.", imagePromptHint: "clay character drinking glass of water happy" },
  { hanzi: "一天", zhuyin: "ㄧ ㄊㄧㄢ",  pinyin: "Yī tiān",  translations: { en: "one day",         th: "หนึ่งวัน" },     partOfSpeech: "n.", imagePromptHint: "clay sun across sky one day cycle" },
];

const TURN_DIAPER: VocabSeed[] = [
  { hanzi: "翻身",   zhuyin: "ㄈㄢ ㄕㄣ",  pinyin: "Fānshēn",   translations: { en: "to turn over",        th: "พลิกตัว" },        partOfSpeech: "v.", imagePromptHint: "clay caregiver helping elderly turn over in bed" },
  { hanzi: "尿布",   zhuyin: "ㄋㄧㄠˋ ㄅㄨˋ", pinyin: "Niàobù", translations: { en: "diaper",              th: "ผ้าอ้อม" },       partOfSpeech: "n.", imagePromptHint: "clay folded diaper white absorbent" },
  { hanzi: "換",     zhuyin: "ㄏㄨㄢˋ",     pinyin: "Huàn",     translations: { en: "to change / swap",   th: "เปลี่ยน" },        partOfSpeech: "v.", imagePromptHint: "clay two arrows swapping items exchange" },
  { hanzi: "擦",     zhuyin: "ㄘㄚ",       pinyin: "Cā",       translations: { en: "to wipe",            th: "เช็ด" },          partOfSpeech: "v.", imagePromptHint: "clay hand with cloth wiping cleaning" },
  { hanzi: "床",     zhuyin: "ㄔㄨㄤˊ",   pinyin: "Chuáng",   translations: { en: "bed",                th: "เตียง" },         partOfSpeech: "n.", imagePromptHint: "clay hospital bed with white pillow blanket" },
  { hanzi: "起來",   zhuyin: "ㄑㄧˇ ㄌㄞˊ", pinyin: "Qǐlái",   translations: { en: "get up",             th: "ลุกขึ้น" },        partOfSpeech: "v.", imagePromptHint: "clay character standing up from bed morning" },
  { hanzi: "躺",     zhuyin: "ㄊㄤˇ",      pinyin: "Tǎng",     translations: { en: "to lie down",        th: "นอนราบ" },         partOfSpeech: "v.", imagePromptHint: "clay character lying flat on bed resting" },
  { hanzi: "坐",     zhuyin: "ㄗㄨㄛˋ",   pinyin: "Zuò",      translations: { en: "to sit",             th: "นั่ง" },           partOfSpeech: "v.", imagePromptHint: "clay character sitting on chair upright" },
];

const MEASUREMENTS: VocabSeed[] = [
  { hanzi: "量",     zhuyin: "ㄌㄧㄤˊ",     pinyin: "Liáng",    translations: { en: "to measure",         th: "วัด" },           partOfSpeech: "v.", imagePromptHint: "clay measuring tape ruler tool" },
  { hanzi: "血壓",   zhuyin: "ㄒㄧㄝˇ ㄧㄚ", pinyin: "Xiěyā",   translations: { en: "blood pressure",     th: "ความดันเลือด" }, partOfSpeech: "n.", imagePromptHint: "clay blood pressure cuff arm monitor digital" },
  { hanzi: "體溫",   zhuyin: "ㄊㄧˇ ㄨㄣ",  pinyin: "Tǐwēn",    translations: { en: "body temperature",  th: "อุณหภูมิร่างกาย" }, partOfSpeech: "n.", imagePromptHint: "clay thermometer reading temperature mercury" },
  { hanzi: "體重",   zhuyin: "ㄊㄧˇ ㄓㄨㄥˋ", pinyin: "Tǐzhòng", translations: { en: "body weight",       th: "น้ำหนักตัว" },    partOfSpeech: "n.", imagePromptHint: "clay bathroom scale digital weighing" },
  { hanzi: "高",     zhuyin: "ㄍㄠ",       pinyin: "Gāo",      translations: { en: "high / tall",        th: "สูง" },           partOfSpeech: "adj.", imagePromptHint: "clay arrow pointing up tall bar chart high" },
  { hanzi: "低",     zhuyin: "ㄉㄧ",       pinyin: "Dī",       translations: { en: "low",                th: "ต่ำ" },          partOfSpeech: "adj.", imagePromptHint: "clay arrow pointing down short bar chart low" },
  { hanzi: "正常",   zhuyin: "ㄓㄥˋ ㄔㄤˊ", pinyin: "Zhèngcháng", translations: { en: "normal",          th: "ปกติ" },         partOfSpeech: "adj.", imagePromptHint: "clay green check mark OK normal status" },
  { hanzi: "紀錄",   zhuyin: "ㄐㄧˋ ㄌㄨˋ", pinyin: "Jìlù",    translations: { en: "to record / log",   th: "บันทึก" },         partOfSpeech: "v./n.", imagePromptHint: "clay clipboard with checklist pen writing" },
];

const TOILET_BATH: VocabSeed[] = [
  { hanzi: "上廁所", zhuyin: "ㄕㄤˋ ㄘㄜˋ ㄙㄨㄛˇ", pinyin: "Shàng cèsuǒ", translations: { en: "to use toilet", th: "เข้าห้องน้ำ" }, partOfSpeech: "v.", imagePromptHint: "clay person walking to toilet bathroom door" },
  { hanzi: "洗澡",   zhuyin: "ㄒㄧˇ ㄗㄠˇ",   pinyin: "Xǐzǎo",     translations: { en: "to bathe / shower", th: "อาบน้ำ" },     partOfSpeech: "v.", imagePromptHint: "clay person showering bath water" },
  { hanzi: "廁所",   zhuyin: "ㄘㄜˋ ㄙㄨㄛˇ", pinyin: "Cèsuǒ",     translations: { en: "toilet / restroom", th: "ห้องน้ำ" },    partOfSpeech: "n.", imagePromptHint: "clay toilet bowl bathroom fixture" },
  { hanzi: "洗",     zhuyin: "ㄒㄧˇ",       pinyin: "Xǐ",        translations: { en: "to wash",           th: "ล้าง" },        partOfSpeech: "v.", imagePromptHint: "clay hands washing under running water" },
  { hanzi: "毛巾",   zhuyin: "ㄇㄠˊ ㄐㄧㄣ", pinyin: "Máojīn",    translations: { en: "towel",             th: "ผ้าเช็ดตัว" },  partOfSpeech: "n.", imagePromptHint: "clay folded fluffy towel soft" },
  { hanzi: "肥皂",   zhuyin: "ㄈㄟˊ ㄗㄠˋ",  pinyin: "Féizào",    translations: { en: "soap",              th: "สบู่" },        partOfSpeech: "n.", imagePromptHint: "clay soap bar with bubbles foam" },
  { hanzi: "乾",     zhuyin: "ㄍㄢ",       pinyin: "Gān",       translations: { en: "dry",               th: "แห้ง" },        partOfSpeech: "adj.", imagePromptHint: "clay sun and dry desert ground cracked" },
  { hanzi: "濕",     zhuyin: "ㄕ",         pinyin: "Shī",       translations: { en: "wet",               th: "เปียก" },       partOfSpeech: "adj.", imagePromptHint: "clay water droplets splash wet surface" },
];

const STAGES: StageSeed[] = [
  { code: "L1-S08", title: "餵食",       titleEn: "Feeding",            titleTh: "การป้อนอาหาร",       description: "ดูแลการกินของผู้สูงอายุ",       orderIndex: 7,  category: "a1-feeding",   vocab: FEEDING },
  { code: "L1-S09", title: "餵藥",       titleEn: "Medicine",           titleTh: "การให้ยา",            description: "ให้ยาปลอดภัย ถูกเวลา",          orderIndex: 8,  category: "a1-medicine",  vocab: MEDICINE },
  { code: "L1-S10", title: "翻身換尿布", titleEn: "Turn & Change Diaper", titleTh: "พลิกตัวและเปลี่ยนผ้าอ้อม", description: "ดูแลผู้ป่วยติดเตียง",         orderIndex: 9,  category: "a1-care",      vocab: TURN_DIAPER },
  { code: "L1-S11", title: "量測",       titleEn: "Measurements",       titleTh: "การวัดสัญญาณชีพ",      description: "วัดความดัน อุณหภูมิ น้ำหนัก",   orderIndex: 10, category: "a1-measure",   vocab: MEASUREMENTS },
  { code: "L1-S12", title: "上廁所·洗澡", titleEn: "Toilet & Bathing",   titleTh: "ห้องน้ำและการอาบน้ำ",   description: "ช่วยทำกิจวัตรประจำวัน",        orderIndex: 11, category: "a1-toilet",    vocab: TOILET_BATH },
];

async function upsertVocabulary(stage: StageSeed) {
  for (const v of stage.vocab) {
    await db.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      create: {
        hanzi: v.hanzi,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: { ...v.translations, en: v.imagePromptHint },
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
          translations: v.translations,
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
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

async function buildExercises(lessonId: string, vocab: VocabSeed[]) {
  await db.exercise.deleteMany({ where: { lessonId } });
  const targets = vocab.slice(0, Math.min(6, vocab.length));
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

async function main() {
  const course = await db.course.findUnique({ where: { code: "A1" } });
  if (!course) {
    console.error("❌ A1 course not found");
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
