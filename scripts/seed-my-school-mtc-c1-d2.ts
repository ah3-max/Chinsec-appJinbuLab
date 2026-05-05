/**
 * Seed My School Chapter 1 — Dialog 2 (21 entries) from user's textbook PDF.
 *
 * Updates the existing MS-C1-D2-VOCAB placeholder lesson with full content
 * and publishes it so users can take the lesson.
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
  partOfSpeech: string;
  translations: { en: string; th: string };
  imagePromptHint: string;
}

// ─── Dialog 2 — 21 entries (verbatim from user PDF) ──────────────────────────
const DIALOG_2: VocabSeed[] = [
  // — Vocabulary (19) —
  { hanzi: "獨生女", zhuyin: "ㄉㄨˊ ㄕㄥ ㄋㄩˇ",     pinyin: "dúshēngnǚ",   partOfSpeech: "N",       translations: { en: "only daughter (no siblings)",          th: "ลูกสาวคนเดียว (บุตรสาวคนเดียว)" }, imagePromptHint: "clay scene of one daughter standing between proud parents, no siblings, family of three, single child" },
  { hanzi: "私立",   zhuyin: "ㄙ ㄌㄧˋ",            pinyin: "sīlì",        partOfSpeech: "Vs-attr", translations: { en: "private (school, etc.)",               th: "เอกชน, ส่วนตัว" },               imagePromptHint: "clay elegant private school building with ornate gates marble columns prestigious academy" },
  { hanzi: "理想",   zhuyin: "ㄌㄧˇ ㄒㄧㄤˇ",       pinyin: "lǐxiǎng",     partOfSpeech: "Vs",      translations: { en: "ideal, perfect",                       th: "อุดมคติ, เหมาะ, ในอุดมคติ" },     imagePromptHint: "clay person dreaming with sparkly cloud thought bubble showing perfect goal vision" },
  { hanzi: "合",     zhuyin: "ㄏㄜˊ",               pinyin: "hé",          partOfSpeech: "Vst",     translations: { en: "to fit, suit, match",                  th: "เข้ากัน, ตรงกัน, สอดคล้อง" },     imagePromptHint: "clay two puzzle pieces of matching colors snapping together perfectly fit" },
  { hanzi: "痛苦",   zhuyin: "ㄊㄨㄥˋ ㄎㄨˇ",       pinyin: "tòngkǔ",      partOfSpeech: "Vs",      translations: { en: "painful, suffering",                   th: "เจ็บปวด, ทุกข์ทรมาน" },           imagePromptHint: "clay person grimacing with tears emotional pain hands on face suffering anguish" },
  { hanzi: "科系",   zhuyin: "ㄎㄜ ㄒㄧˋ",           pinyin: "kēxì",        partOfSpeech: "N",       translations: { en: "academic department, major",           th: "ภาควิชา, คณะ (มหาวิทยาลัย)" },     imagePromptHint: "clay university campus with multiple department buildings labeled different majors signs" },
  { hanzi: "放棄",   zhuyin: "ㄈㄤˋ ㄑㄧˋ",         pinyin: "fàngqì",      partOfSpeech: "V",       translations: { en: "to give up, abandon",                  th: "ยอมแพ้, ละทิ้ง, สละ" },           imagePromptHint: "clay person dropping a heavy bag and walking away with head down giving up baton on ground" },
  { hanzi: "不管",   zhuyin: "ㄅㄨˋ ㄍㄨㄢˇ",       pinyin: "bùguǎn",      partOfSpeech: "Conj",    translations: { en: "regardless of, no matter",             th: "ไม่ว่า..., ไม่คำนึงถึง" },         imagePromptHint: "clay person with palms up dismissive expression doesn't matter whatever shrug regardless" },
  { hanzi: "反對",   zhuyin: "ㄈㄢˇ ㄉㄨㄟˋ",       pinyin: "fǎnduì",      partOfSpeech: "Vst",     translations: { en: "to oppose, object to",                 th: "คัดค้าน, ต่อต้าน" },              imagePromptHint: "clay person with crossed arms holding stop sign opposing protest disapproval" },
  { hanzi: "個性",   zhuyin: "ㄍㄜˋ ㄒㄧㄥˋ",        pinyin: "gèxìng",      partOfSpeech: "N",       translations: { en: "personality, character",               th: "บุคลิกภาพ, อุปนิสัย" },           imagePromptHint: "clay multiple diverse character figures with unique colors and expressions different personalities" },
  { hanzi: "活潑",   zhuyin: "ㄏㄨㄛˊ ㄆㄛ",        pinyin: "huópō",       partOfSpeech: "Vs",      translations: { en: "lively, vivacious",                    th: "ร่าเริง, มีชีวิตชีวา" },           imagePromptHint: "clay energetic young person jumping with arms up sparkles around cheerful lively bouncy" },
  { hanzi: "外語",   zhuyin: "ㄨㄞˋ ㄩˇ",            pinyin: "wàiyǔ",       partOfSpeech: "N",       translations: { en: "foreign language",                     th: "ภาษาต่างประเทศ" },                imagePromptHint: "clay open book with different language scripts and flags speech bubbles multilingual" },
  { hanzi: "擔心",   zhuyin: "ㄉㄢ ㄒㄧㄣ",          pinyin: "dānxīn",      partOfSpeech: "Vst",     translations: { en: "to worry, be concerned",               th: "เป็นห่วง, กังวล" },               imagePromptHint: "clay person biting nails worried thought bubble cloud forehead wrinkles anxious thinking" },
  { hanzi: "填",     zhuyin: "ㄊㄧㄢˊ",             pinyin: "tián",        partOfSpeech: "V",       translations: { en: "to fill in (a form)",                  th: "กรอก (แบบฟอร์ม)" },               imagePromptHint: "clay hand holding pen filling in checkboxes and lines on a form paper application" },
  { hanzi: "表",     zhuyin: "ㄅㄧㄠˇ",             pinyin: "biǎo",        partOfSpeech: "N",       translations: { en: "form, chart, table",                   th: "แบบฟอร์ม" },                       imagePromptHint: "clay official paper form with empty checkboxes blank lines fields ready to be filled" },
  { hanzi: "辦",     zhuyin: "ㄅㄢˋ",               pinyin: "bàn",         partOfSpeech: "V",       translations: { en: "to handle, take care of",              th: "จัดการ, ดำเนินการ" },             imagePromptHint: "clay official clerk stamping documents at office counter processing paperwork efficient" },
  { hanzi: "手續",   zhuyin: "ㄕㄡˇ ㄒㄩˋ",         pinyin: "shǒuxù",      partOfSpeech: "N",       translations: { en: "procedure, formalities",               th: "ขั้นตอน, กระบวนการ" },             imagePromptHint: "clay flowchart sequence with numbered boxes connected by arrows step-by-step procedure" },
  { hanzi: "申請",   zhuyin: "ㄕㄣ ㄑㄧㄥˇ",        pinyin: "shēnqǐng",    partOfSpeech: "V",       translations: { en: "to apply for",                         th: "สมัคร, ยื่นคำขอ" },               imagePromptHint: "clay person sliding application papers across counter to clerk submitting application form" },
  { hanzi: "成績單", zhuyin: "ㄔㄥˊ ㄐㄧ ㄉㄢ",     pinyin: "chéngjī dān", partOfSpeech: "N",       translations: { en: "transcript, grade report",             th: "ใบแสดงผลการเรียน, ทรานสคริปต์" },  imagePromptHint: "clay official transcript document with letter grades A B in columns school report card seal" },

  // — Phrases (2) —
  { hanzi: "考上",   zhuyin: "ㄎㄠˇ ㄕㄤˋ",         pinyin: "kǎoshàng",    partOfSpeech: "Phrase",  translations: { en: "to get into (a school) by exam",       th: "สอบติด (เข้าสถาบัน)" },           imagePromptHint: "clay celebrating student holding admission acceptance letter envelope with confetti success" },
  { hanzi: "推薦信", zhuyin: "ㄊㄨㄟ ㄐㄧㄢˋ ㄒㄧㄣˋ", pinyin: "tuījiàn xìn", partOfSpeech: "Phrase",  translations: { en: "letter of recommendation",             th: "จดหมายแนะนำ (Letter of Recommendation)" }, imagePromptHint: "clay formal envelope with official letter inside red wax seal signature recommendation document" },
];

if (DIALOG_2.length !== 21) {
  throw new Error(`Expected 21 entries, got ${DIALOG_2.length}`);
}

async function upsertVocabulary(vocab: VocabSeed[], category: string) {
  for (const v of vocab) {
    await db.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      create: {
        hanzi: v.hanzi,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        translations: { ...v.translations, en: v.imagePromptHint },
        level: Level.B1_INTERMEDIATE,
        tocflBand: "B1",
        frequency: 3,
        difficulty: 3,
        category,
        tags: ["b1", "school", "mtc-textbook", "ms-c1-d2"],
        isEldercareVocab: false,
      },
      update: {
        translations: { ...v.translations, en: v.imagePromptHint },
        category,
        partOfSpeech: v.partOfSpeech,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        level: Level.B1_INTERMEDIATE,
      },
    });
  }
}

function pickN<T>(arr: T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return out;
}

async function buildVocabExercises(lessonId: string, vocab: VocabSeed[]) {
  await db.exercise.deleteMany({ where: { lessonId } });

  const step = Math.max(1, Math.floor(vocab.length / 7));
  const targets: VocabSeed[] = [];
  for (let i = 0; i < vocab.length && targets.length < 7; i += step) {
    targets.push(vocab[i]!);
  }

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
  console.log("=== Seeding MS-C1 Dialog 2 ===\n");

  // Find the existing stage
  const stage = await db.stage.findFirst({
    where: { course: { code: "MY-SCHOOL" }, code: "MS-C1" },
    select: { id: true },
  });
  if (!stage) {
    console.error("❌ MS-C1 stage not found — run seed-my-school-mtc-c1.ts first");
    process.exit(1);
  }

  await upsertVocabulary(DIALOG_2, "ms-c1-d2");
  console.log(`  ✅ Upserted ${DIALOG_2.length} Dialog 2 vocabulary records\n`);

  const lesson = await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: "MS-C1-D2-VOCAB" } },
    create: {
      stageId: stage.id,
      code: "MS-C1-D2-VOCAB",
      title: "對話二 · 詞彙 (21)",
      titleI18n: { en: "Dialog 2 · Vocabulary (21)", th: "บทสนทนา 2 · คำศัพท์ (21)" },
      description: `${DIALOG_2.length} 個必修詞彙 (含 19 個詞彙 + 2 個短語)`,
      type: "VOCAB",
      difficulty: 3,
      orderIndex: 1,
      estimatedMinutes: 15,
      xpReward: DIALOG_2.length * 4,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: "對話二 — 開學了 (續)",
        items: DIALOG_2.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
          note: v.partOfSpeech,
        })),
      },
    },
    update: {
      title: "對話二 · 詞彙 (21)",
      titleI18n: { en: "Dialog 2 · Vocabulary (21)", th: "บทสนทนา 2 · คำศัพท์ (21)" },
      description: `${DIALOG_2.length} 個必修詞彙 (含 19 個詞彙 + 2 個短語)`,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: "對話二 — 開學了 (續)",
        items: DIALOG_2.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
          note: v.partOfSpeech,
        })),
      },
    },
  });
  await buildVocabExercises(lesson.id, DIALOG_2);
  console.log(`  ✅ MS-C1-D2-VOCAB: ${DIALOG_2.length} cards + 7 MCQ exercises (now published)`);

  // Update vocab count on the course
  const totalVocab = await db.vocabulary.count({
    where: { tags: { has: "mtc-textbook" } },
  });
  await db.course.update({
    where: { code: "MY-SCHOOL" },
    data: { vocabularyCount: totalVocab },
  });
  console.log(`\n📊 MY-SCHOOL total textbook vocab: ${totalVocab}`);
  console.log(`🎉 Chapter 1 complete: D1 (35) + D2 (21) = 56 entries`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
