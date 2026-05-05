/**
 * Seed A2 starter content — 3 stages of more advanced eldercare communication.
 *
 *   L2-S01 詢問身體狀況   Asking about condition  (10 words)
 *   L2-S02 簡單醫療術語   Basic medical terms     (10 words)
 *   L2-S03 家屬溝通       Family communication    (10 words)
 *
 * Creates the A2 course if missing.
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

const ASKING_CONDITION: VocabSeed[] = [
  { hanzi: "舒服",     zhuyin: "ㄕㄨ ˙ㄈㄨ",   pinyin: "Shūfu",        translations: { en: "comfortable / well",   th: "สบาย" },          partOfSpeech: "adj.", imagePromptHint: "clay person relaxing on cozy chair smiling content" },
  { hanzi: "不舒服",   zhuyin: "ㄅㄨˋ ㄕㄨ ˙ㄈㄨ", pinyin: "Bù shūfu", translations: { en: "uncomfortable / unwell", th: "ไม่สบาย" },     partOfSpeech: "adj.", imagePromptHint: "clay person feeling sick uncomfortable holding stomach" },
  { hanzi: "痛",       zhuyin: "ㄊㄨㄥˋ",      pinyin: "Tòng",         translations: { en: "pain / hurt",         th: "เจ็บ / ปวด" },    partOfSpeech: "v./adj.", imagePromptHint: "clay person grimacing in pain holding sore spot" },
  { hanzi: "頭痛",     zhuyin: "ㄊㄡˊ ㄊㄨㄥˋ", pinyin: "Tóutòng",      translations: { en: "headache",            th: "ปวดหัว" },        partOfSpeech: "n.", imagePromptHint: "clay person with hands on head headache lightning bolts" },
  { hanzi: "肚子痛",   zhuyin: "ㄉㄨˋ ˙ㄗ ㄊㄨㄥˋ", pinyin: "Dùzi tòng", translations: { en: "stomachache",        th: "ปวดท้อง" },       partOfSpeech: "n.", imagePromptHint: "clay person clutching belly stomach pain" },
  { hanzi: "感冒",     zhuyin: "ㄍㄢˇ ㄇㄠˋ",   pinyin: "Gǎnmào",       translations: { en: "common cold",         th: "เป็นหวัด" },      partOfSpeech: "n.", imagePromptHint: "clay person with red nose tissue sneezing cold" },
  { hanzi: "發燒",     zhuyin: "ㄈㄚ ㄕㄠ",     pinyin: "Fāshāo",       translations: { en: "fever",               th: "เป็นไข้" },        partOfSpeech: "v.", imagePromptHint: "clay thermometer red mercury fever face high temperature" },
  { hanzi: "咳嗽",     zhuyin: "ㄎㄜˊ ˙ㄙㄡ",   pinyin: "Késou",        translations: { en: "to cough",            th: "ไอ" },            partOfSpeech: "v.", imagePromptHint: "clay person coughing covering mouth" },
  { hanzi: "累",       zhuyin: "ㄌㄟˋ",        pinyin: "Lèi",          translations: { en: "tired",               th: "เหนื่อย" },        partOfSpeech: "adj.", imagePromptHint: "clay tired exhausted person sweating drooping" },
  { hanzi: "睡不著",   zhuyin: "ㄕㄨㄟˋ ㄅㄨˋ ㄓㄠˊ", pinyin: "Shuì bù zháo", translations: { en: "can't sleep",   th: "นอนไม่หลับ" },    partOfSpeech: "v.", imagePromptHint: "clay person in bed staring at ceiling unable to sleep" },
];

const MEDICAL_TERMS: VocabSeed[] = [
  { hanzi: "醫生",     zhuyin: "ㄧ ㄕㄥ",      pinyin: "Yīshēng",      translations: { en: "doctor",               th: "หมอ" },          partOfSpeech: "n.", imagePromptHint: "clay friendly doctor in white coat with stethoscope" },
  { hanzi: "護士",     zhuyin: "ㄏㄨˋ ㄕˋ",    pinyin: "Hùshì",        translations: { en: "nurse",                th: "พยาบาล" },       partOfSpeech: "n.", imagePromptHint: "clay nurse in scrubs cap caring smile" },
  { hanzi: "醫院",     zhuyin: "ㄧ ㄩㄢˋ",     pinyin: "Yīyuàn",       translations: { en: "hospital",             th: "โรงพยาบาล" },    partOfSpeech: "n.", imagePromptHint: "clay hospital building with red cross sign" },
  { hanzi: "診所",     zhuyin: "ㄓㄣˇ ㄙㄨㄛˇ", pinyin: "Zhěnsuǒ",      translations: { en: "clinic",               th: "คลินิก" },        partOfSpeech: "n.", imagePromptHint: "clay small clinic building entrance medical sign" },
  { hanzi: "病人",     zhuyin: "ㄅㄧㄥˋ ㄖㄣˊ", pinyin: "Bìngrén",      translations: { en: "patient",              th: "ผู้ป่วย" },       partOfSpeech: "n.", imagePromptHint: "clay patient lying on hospital bed with IV" },
  { hanzi: "看病",     zhuyin: "ㄎㄢˋ ㄅㄧㄥˋ", pinyin: "Kànbìng",      translations: { en: "see a doctor",         th: "ไปหาหมอ" },      partOfSpeech: "v.", imagePromptHint: "clay doctor examining patient with stethoscope checkup" },
  { hanzi: "打針",     zhuyin: "ㄉㄚˇ ㄓㄣ",   pinyin: "Dǎzhēn",       translations: { en: "get injection / shot", th: "ฉีดยา" },        partOfSpeech: "v.", imagePromptHint: "clay syringe injection needle medical shot" },
  { hanzi: "輪椅",     zhuyin: "ㄌㄨㄣˊ ㄧˇ",   pinyin: "Lúnyǐ",        translations: { en: "wheelchair",           th: "รถเข็น" },        partOfSpeech: "n.", imagePromptHint: "clay wheelchair medical equipment chair with wheels" },
  { hanzi: "拐杖",     zhuyin: "ㄍㄨㄞˇ ㄓㄤˋ", pinyin: "Guǎizhàng",    translations: { en: "cane / walking stick", th: "ไม้เท้า" },      partOfSpeech: "n.", imagePromptHint: "clay walking cane wooden stick with handle" },
  { hanzi: "急救",     zhuyin: "ㄐㄧˊ ㄐㄧㄡˋ", pinyin: "Jíjiù",        translations: { en: "first aid / emergency", th: "ปฐมพยาบาล" },   partOfSpeech: "v./n.", imagePromptHint: "clay first aid kit red cross box medical emergency" },
];

const FAMILY_COMM: VocabSeed[] = [
  { hanzi: "家屬",     zhuyin: "ㄐㄧㄚ ㄕㄨˇ",  pinyin: "Jiāshǔ",       translations: { en: "family member",        th: "ญาติ" },          partOfSpeech: "n.", imagePromptHint: "clay family group standing together hugging" },
  { hanzi: "電話",     zhuyin: "ㄉㄧㄢˋ ㄏㄨㄚˋ", pinyin: "Diànhuà",     translations: { en: "telephone",            th: "โทรศัพท์" },     partOfSpeech: "n.", imagePromptHint: "clay vintage rotary telephone red receiver" },
  { hanzi: "打電話",   zhuyin: "ㄉㄚˇ ㄉㄧㄢˋ ㄏㄨㄚˋ", pinyin: "Dǎ diànhuà", translations: { en: "make a phone call", th: "โทรศัพท์ (กริยา)" }, partOfSpeech: "v.", imagePromptHint: "clay person speaking on phone receiver to ear" },
  { hanzi: "請坐",     zhuyin: "ㄑㄧㄥˇ ㄗㄨㄛˋ", pinyin: "Qǐng zuò",   translations: { en: "please sit",           th: "เชิญนั่ง" },      partOfSpeech: "phr.", imagePromptHint: "clay person gesturing welcome to chair please sit" },
  { hanzi: "請等一下", zhuyin: "ㄑㄧㄥˇ ㄉㄥˇ ㄧ ㄒㄧㄚˋ", pinyin: "Qǐng děng yīxià", translations: { en: "please wait a moment", th: "กรุณารอสักครู่" }, partOfSpeech: "phr.", imagePromptHint: "clay hand raised stop please wait gesture" },
  { hanzi: "可以",     zhuyin: "ㄎㄜˇ ㄧˇ",    pinyin: "Kěyǐ",         translations: { en: "can / may",            th: "ได้ / ทำได้" },   partOfSpeech: "v.", imagePromptHint: "clay green checkmark thumbs up approval OK" },
  { hanzi: "不可以",   zhuyin: "ㄅㄨˋ ㄎㄜˇ ㄧˇ", pinyin: "Bù kěyǐ",   translations: { en: "cannot / not allowed", th: "ไม่ได้" },        partOfSpeech: "phr.", imagePromptHint: "clay red X mark thumbs down not allowed prohibited sign" },
  { hanzi: "好嗎",     zhuyin: "ㄏㄠˇ ˙ㄇㄚ",   pinyin: "Hǎo ma",       translations: { en: "is that OK?",          th: "ได้ไหม?" },       partOfSpeech: "phr.", imagePromptHint: "clay person with question mark friendly asking" },
  { hanzi: "謝謝關心", zhuyin: "ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄍㄨㄢ ㄒㄧㄣ", pinyin: "Xièxie guānxīn", translations: { en: "thanks for caring", th: "ขอบคุณที่ห่วงใย" }, partOfSpeech: "phr.", imagePromptHint: "clay character with grateful heart hands clasped thank you" },
  { hanzi: "別擔心",   zhuyin: "ㄅㄧㄝˊ ㄉㄢ ㄒㄧㄣ", pinyin: "Bié dānxīn", translations: { en: "don't worry",      th: "ไม่ต้องกังวล" },  partOfSpeech: "phr.", imagePromptHint: "clay calming hands reassuring smile peaceful gesture" },
];

const STAGES: StageSeed[] = [
  { code: "L2-S01", title: "詢問身體狀況",   titleEn: "Asking About Condition",  titleTh: "ถามอาการ",            description: "ถามเรื่องสุขภาพผู้สูงอายุ", orderIndex: 0, category: "a2-condition", vocab: ASKING_CONDITION },
  { code: "L2-S02", title: "簡單醫療術語",   titleEn: "Basic Medical Terms",     titleTh: "คำศัพท์การแพทย์เบื้องต้น", description: "ศัพท์โรงพยาบาลและบุคลากรการแพทย์", orderIndex: 1, category: "a2-medical",   vocab: MEDICAL_TERMS },
  { code: "L2-S03", title: "家屬溝通",       titleEn: "Family Communication",    titleTh: "การสื่อสารกับญาติ",     description: "พูดคุยกับครอบครัวผู้พักอาศัย", orderIndex: 2, category: "a2-family",   vocab: FAMILY_COMM },
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
        level: Level.A2_BASIC,
        tocflBand: "A2",
        frequency: 1,
        difficulty: 2,
        category: stage.category,
        tags: ["a2", "elder-care"],
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
      difficulty: 2,
      orderIndex: 0,
      estimatedMinutes: Math.max(5, Math.ceil(stage.vocab.length * 1.5)),
      xpReward: stage.vocab.length * 4,
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
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return out;
}

async function buildExercises(lessonId: string, vocab: VocabSeed[]) {
  await db.exercise.deleteMany({ where: { lessonId } });
  const targets = vocab.slice(0, Math.min(6, vocab.length));
  const labels = ["A", "B", "C"];

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]!;
    const correct = target.translations.th;
    const distractors = pickN(
      vocab.filter((v) => v.hanzi !== target.hanzi).map((v) => v.translations.th),
      2,
    );
    if (distractors.length < 2) continue;

    const opts = [correct, ...distractors];
    for (let j = opts.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      const tmp = opts[j]!;
      opts[j] = opts[k]!;
      opts[k] = tmp;
    }
    const correctIdx = opts.indexOf(correct);

    await db.exercise.create({
      data: {
        lessonId,
        type: "VOCAB_MCQ",
        prompt: { hanzi: target.hanzi, pinyin: target.pinyin },
        options: opts.map((label, idx) => ({ value: labels[idx], label })),
        answer: { value: labels[correctIdx] },
        maxScore: 12,
        orderIndex: i,
        isActive: true,
      },
    });
  }
}

async function main() {
  // Ensure A2 course exists
  const course = await db.course.upsert({
    where: { code: "A2" },
    create: {
      code: "A2",
      title: "A2 基礎 · 進階照護中文",
      titleI18n: {
        en: "A2 Basic · Advanced Eldercare Chinese",
        th: "A2 พื้นฐาน · จีนดูแลผู้สูงอายุระดับกลาง",
      },
      description: "更多情境關卡 · 醫療術語與家屬溝通",
      level: Level.A2_BASIC,
      category: "GENERAL",
      estimatedHours: 40,
      vocabularyCount: 600,
      tocflTarget: "TOCFL 2",
      orderIndex: 2,
      isPublished: true,
    },
    update: {
      title: "A2 基礎 · 進階照護中文",
      titleI18n: {
        en: "A2 Basic · Advanced Eldercare Chinese",
        th: "A2 พื้นฐาน · จีนดูแลผู้สูงอายุระดับกลาง",
      },
      isPublished: true,
    },
  });

  console.log(`📚 A2 course: ${course.id}\n`);

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
