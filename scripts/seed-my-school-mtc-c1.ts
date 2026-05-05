/**
 * Seed My School Chapter 1 — Dialog 1 (35 entries) from user's textbook PDF.
 *
 * - Wipes the old A1 placeholder MY-SCHOOL chapters (MS-C1/C2/C3)
 * - Re-creates MY-SCHOOL course at B1 level (matches the textbook vocabulary)
 * - Stage MS-C1 "第一課 開學了" with two lessons:
 *     MS-C1-D1-VOCAB (35 entries: 3 names + 29 vocab + 3 phrases)
 *     MS-C1-D2-VOCAB (21 entries — placeholder, awaiting user PDF for Dialog 2)
 *
 * Each vocabulary entry carries:
 *   - Exact zhuyin + pinyin + part-of-speech from textbook
 *   - User's Thai translation verbatim
 *   - English image-prompt hint (used by /api/vocab-image to render
 *     a clay illustration that matches the meaning, not the literal characters)
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
  partOfSpeech: string;            // textbook label: Vp / N / Vs / Vs-attr / Adv / V-sep / V / Vp-sep / Vst
  translations: { en: string; th: string };
  /** Detailed visual hint for DALL-E so the clay image matches the meaning */
  imagePromptHint: string;
}

// ─── Dialog 1 — 35 entries (verbatim from user PDF) ──────────────────────────
const DIALOG_1: VocabSeed[] = [
  // — People in the Dialogue (3) —
  { hanzi: "安德思",   zhuyin: "ㄢ ㄉㄜˊ ㄙ",         pinyin: "Āndésī",       partOfSpeech: "Name", translations: { en: "(name) man from Honduras",  th: "ชายจากฮอนดูรัส" },         imagePromptHint: "clay portrait of friendly young Latin American man wearing casual student clothes, with small Honduras flag in background, Pixar style" },
  { hanzi: "羅珊蒂",   zhuyin: "ㄌㄨㄛˊ ㄕㄢ ㄉㄧˋ",  pinyin: "Luó Shāndì",   partOfSpeech: "Name", translations: { en: "(name) woman from Indonesia", th: "หญิงจากอินโดนีเซีย" },     imagePromptHint: "clay portrait of friendly young Southeast Asian woman with hijab smiling, with small Indonesian red-and-white flag, Pixar style" },
  { hanzi: "何雅婷",   zhuyin: "ㄏㄜˊ ㄧㄚˇ ㄊㄧㄥˊ", pinyin: "Hé Yǎtíng",    partOfSpeech: "Name", translations: { en: "(name) woman from Taiwan",   th: "หญิงจากไต้หวัน" },         imagePromptHint: "clay portrait of friendly young East Asian Taiwanese woman with long black hair smiling, with small Taiwan flag, Pixar style" },

  // — Vocabulary (29) —
  { hanzi: "開學",     zhuyin: "ㄎㄞ ㄒㄩㄝˊ",          pinyin: "kāixué",       partOfSpeech: "Vp",      translations: { en: "school starts, semester begins",       th: "เปิดเทอม" },               imagePromptHint: "clay scene of students happily entering school on first day with backpacks, school bell ringing" },
  { hanzi: "班",       zhuyin: "ㄅㄢ",                  pinyin: "bān",          partOfSpeech: "N",       translations: { en: "class, group of students",             th: "ชั้นเรียน (กลุ่มนักเรียน)" }, imagePromptHint: "clay group of diverse students sitting together in rows of desks classroom group" },
  { hanzi: "新生",     zhuyin: "ㄒㄧㄣ ㄕㄥ",            pinyin: "xīnshēng",     partOfSpeech: "N",       translations: { en: "new student, freshman",                th: "นักศึกษาใหม่" },          imagePromptHint: "clay student with name tag freshman badge nervous excited holding orientation packet" },
  { hanzi: "嚴",       zhuyin: "ㄧㄢˊ",                pinyin: "yán",          partOfSpeech: "Vs",      translations: { en: "strict",                               th: "เข้มงวด, เคร่งครัด" },     imagePromptHint: "clay strict teacher with stern expression pointing finger arms crossed serious" },
  { hanzi: "口試",     zhuyin: "ㄎㄡˇ ㄕˋ",             pinyin: "kǒushì",       partOfSpeech: "N",       translations: { en: "oral exam",                            th: "สอบปากเปล่า" },           imagePromptHint: "clay student speaking nervously to examiner across table oral exam interview microphone" },
  { hanzi: "筆試",     zhuyin: "ㄅㄧˇ ㄕˋ",             pinyin: "bǐshì",        partOfSpeech: "N",       translations: { en: "written exam",                         th: "สอบข้อเขียน" },          imagePromptHint: "clay student writing on multiple choice test paper at desk pencil bubbling answers" },
  { hanzi: "以外",     zhuyin: "ㄧˇ ㄨㄞˋ",            pinyin: "yǐwài",        partOfSpeech: "N",       translations: { en: "besides, except for",                  th: "นอกจาก, ยกเว้น" },        imagePromptHint: "clay venn diagram circle with one item highlighted outside the rest excluded set" },
  { hanzi: "口頭",     zhuyin: "ㄎㄡˇ ㄊㄡˊ",          pinyin: "kǒutóu",       partOfSpeech: "Vs-attr", translations: { en: "oral, verbal",                         th: "ด้วยวาจา, ทางวาจา" },      imagePromptHint: "clay person with large speech bubble emanating from mouth verbal communication emphasis" },
  { hanzi: "報告",     zhuyin: "ㄅㄠˋ ㄍㄠˋ",          pinyin: "bàogào",       partOfSpeech: "N",       translations: { en: "report, presentation",                 th: "รายงาน" },                imagePromptHint: "clay student presenting at podium with chart pointer giving classroom report presentation" },
  { hanzi: "壓力",     zhuyin: "ㄧㄚ ㄌㄧˋ",            pinyin: "yālì",         partOfSpeech: "N",       translations: { en: "pressure, stress",                     th: "ความกดดัน, ความเครียด" }, imagePromptHint: "clay student crushed under heavy weight on shoulders books piled stressed sweating" },
  { hanzi: "說明",     zhuyin: "ㄕㄨㄛ ㄇㄧㄥˊ",        pinyin: "shuōmíng",     partOfSpeech: "N",       translations: { en: "explanation, instructions",            th: "คำอธิบาย, คู่มือ" },       imagePromptHint: "clay teacher pointing at whiteboard with clear arrows and steps explaining diagram" },
  { hanzi: "清楚",     zhuyin: "ㄑㄧㄥ ㄔㄨˇ",          pinyin: "qīngchǔ",      partOfSpeech: "Vs",      translations: { en: "clear, understandable",                th: "ชัดเจน" },                imagePromptHint: "clay magnifying glass over crisp text with light beams sparkling crystal clear vision" },
  { hanzi: "位子",     zhuyin: "ㄨㄟˋ ˙ㄗ",            pinyin: "wèizi",        partOfSpeech: "N",       translations: { en: "seat, place",                          th: "ที่นั่ง, ที่ว่าง" },        imagePromptHint: "clay empty wooden chair at desk with reserved sign waiting available seat classroom" },
  { hanzi: "旁聽",     zhuyin: "ㄆㄤˊ ㄊㄧㄥ",          pinyin: "pángtīng",     partOfSpeech: "V",       translations: { en: "audit a class (no credit)",            th: "ลงเรียนแบบ audit (ไม่รับหน่วยกิต)" }, imagePromptHint: "clay observer student sitting quietly at back of classroom listening only no notebook auditing" },
  { hanzi: "分",       zhuyin: "ㄈㄣ",                  pinyin: "fēn",          partOfSpeech: "N",       translations: { en: "score, point",                         th: "คะแนน" },                 imagePromptHint: "clay scoreboard with bright glowing number 100 grade A perfect score" },
  { hanzi: "羨慕",     zhuyin: "ㄒㄧㄢˋ ㄇㄨˋ",         pinyin: "xiànmù",       partOfSpeech: "Vst",     translations: { en: "to envy, admire",                      th: "อิจฉา, ชื่นชม" },         imagePromptHint: "clay person looking at another with sparkly hearts and stars in eyes admiring envious expression" },
  { hanzi: "休學",     zhuyin: "ㄒㄧㄡ ㄒㄩㄝˊ",        pinyin: "xiūxué",       partOfSpeech: "Vp-sep",  translations: { en: "take a leave of absence from school",  th: "พักการเรียน" },           imagePromptHint: "clay student waving goodbye to school building with suitcase taking a break leave of absence" },
  { hanzi: "用功",     zhuyin: "ㄩㄥˋ ㄍㄨㄥ",          pinyin: "yònggōng",     partOfSpeech: "Vs",      translations: { en: "diligent, hardworking",                th: "ขยัน, ตั้งใจเรียน" },       imagePromptHint: "clay student studying intensely at desk with stack of books late at night focused determined" },
  { hanzi: "行",       zhuyin: "ㄒㄧㄥˊ",              pinyin: "xíng",         partOfSpeech: "Vs",      translations: { en: "OK, will do, fine",                    th: "ได้, ใช้ได้" },           imagePromptHint: "clay green checkmark thumbs up OK approval gesture saying yes" },
  { hanzi: "轉",       zhuyin: "ㄓㄨㄢˇ",              pinyin: "zhuǎn",        partOfSpeech: "V",       translations: { en: "to switch, transfer (major/department)", th: "ย้ายสาขา / โอนย้าย" },   imagePromptHint: "clay rotating circular arrows showing change of direction transfer between two department signs" },
  { hanzi: "原來",     zhuyin: "ㄩㄢˊ ㄌㄞˊ",          pinyin: "yuánlái",      partOfSpeech: "Adv",     translations: { en: "originally; (it turns out…)",          th: "แต่เดิม, ปรากฏว่า" },     imagePromptHint: "clay light bulb above head bright ah-ha moment realization sudden understanding" },
  { hanzi: "會計",     zhuyin: "ㄎㄨㄞˋ ㄐㄧˋ",         pinyin: "kuàijì",       partOfSpeech: "N",       translations: { en: "accounting, accountant",               th: "การบัญชี, นักบัญชี" },     imagePromptHint: "clay accountant at desk with calculator big ledger book columns of numbers green visor" },
  { hanzi: "熱門",     zhuyin: "ㄖㄜˋ ㄇㄣˊ",          pinyin: "rèmén",        partOfSpeech: "Vs",      translations: { en: "popular, trending, in demand",         th: "ฮิต, เป็นที่นิยม" },        imagePromptHint: "clay trending product with flames around it crowd reaching for it hot popular item" },
  { hanzi: "熬夜",     zhuyin: "ㄠˊ ㄧㄝˋ",            pinyin: "áoyè",         partOfSpeech: "V-sep",   translations: { en: "stay up late, pull an all-nighter",    th: "อดนอน, เฝ้าถึงดึก" },     imagePromptHint: "clay student with dark circles under eyes coffee cup yawning bookstack late night moon outside window" },
  { hanzi: "當",       zhuyin: "ㄉㄤˋ",                pinyin: "dàng",         partOfSpeech: "V",       translations: { en: "to fail (a course)",                   th: "สอบตก" },                 imagePromptHint: "clay test paper with big red F failing grade circled disappointing report card" },
  { hanzi: "恐怕",     zhuyin: "ㄎㄨㄥˇ ㄆㄚˋ",         pinyin: "kǒngpà",       partOfSpeech: "Adv",     translations: { en: "I'm afraid (that)…, probably",         th: "กลัวว่า, น่าจะ" },         imagePromptHint: "clay person looking worried biting nails wringing hands anxious about something" },
  { hanzi: "口才",     zhuyin: "ㄎㄡˇ ㄘㄞˊ",          pinyin: "kǒucái",       partOfSpeech: "N",       translations: { en: "eloquence, way with words",            th: "ทักษะการพูด, ปฏิภาณ" },   imagePromptHint: "clay confident speaker on stage with microphone audience captivated golden mouth eloquent" },
  { hanzi: "事",       zhuyin: "ㄕˋ",                  pinyin: "shì",          partOfSpeech: "N",       translations: { en: "matter, affair, thing",                th: "เรื่อง, เหตุการณ์" },      imagePromptHint: "clay calendar with various events marked sticky notes appointments scheduled tasks list" },
  { hanzi: "遲到",     zhuyin: "ㄔˊ ㄉㄠˋ",            pinyin: "chídào",       partOfSpeech: "Vp",      translations: { en: "to be late",                           th: "มาสาย" },                 imagePromptHint: "clay student running with backpack bouncing watch ticking late arriving rushing into classroom" },

  // — Phrases (3) —
  { hanzi: "差一點",   zhuyin: "ㄔㄚˋ ㄧˋ ㄉㄧㄢˇ",     pinyin: "chà yì diǎn",   partOfSpeech: "Phrase",  translations: { en: "almost, nearly",                      th: "เกือบ, แทบจะ" },          imagePromptHint: "clay person reaching out fingers nearly grasping object close call almost-there gesture" },
  { hanzi: "這樣下去", zhuyin: "ㄓㄜˋ ㄧㄤˋ ㄒㄧㄚˋ ㄑㄩˋ", pinyin: "zhèyàng xiàqù", partOfSpeech: "Phrase", translations: { en: "if this continues, at this rate",     th: "ถ้ายังเป็นแบบนี้ต่อไป" }, imagePromptHint: "clay arrow trending downward continuing on a slippery slope warning if this continues" },
  { hanzi: "沒辦法",   zhuyin: "ㄇㄟˊ ㄅㄢˋ ㄈㄚˇ",     pinyin: "méi bànfǎ",     partOfSpeech: "Phrase",  translations: { en: "no way, can't be helped",             th: "ไม่มีทาง, ทำอะไรไม่ได้" }, imagePromptHint: "clay person with palms up empty hands shrugging shoulders helpless resigned no choice" },
];

// Sanity check
if (DIALOG_1.length !== 35) {
  throw new Error(`Expected 35 entries, got ${DIALOG_1.length}`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertVocabulary(vocab: VocabSeed[], category: string) {
  for (const v of vocab) {
    await db.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      create: {
        hanzi: v.hanzi,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        // EN field carries the visual prompt, used by /api/vocab-image
        translations: { ...v.translations, en: v.imagePromptHint },
        level: Level.B1_INTERMEDIATE,
        tocflBand: "B1",
        frequency: 3,
        difficulty: 3,
        category,
        tags: ["b1", "school", "mtc-textbook", "ms-c1-d1"],
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

  // Take 8 evenly-spread targets so the practice covers the whole list, not just the first 8
  const step = Math.max(1, Math.floor(vocab.length / 8));
  const targets: VocabSeed[] = [];
  for (let i = 0; i < vocab.length && targets.length < 8; i += step) {
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

async function wipeOldStages(courseId: string) {
  const oldStages = await db.stage.findMany({
    where: { courseId, code: { in: ["MS-C1", "MS-C2", "MS-C3"] } },
    select: { id: true, code: true, lessons: { select: { id: true, code: true } } },
  });
  for (const stage of oldStages) {
    for (const lesson of stage.lessons) {
      await db.exercise.deleteMany({ where: { lessonId: lesson.id } });
    }
    await db.lesson.deleteMany({ where: { stageId: stage.id } });
    await db.stage.delete({ where: { id: stage.id } });
    console.log(`  🧹 wiped old ${stage.code} (${stage.lessons.length} lessons)`);
  }
}

async function main() {
  console.log("=== Updating MY-SCHOOL course (MTC textbook alignment) ===\n");

  const course = await db.course.upsert({
    where: { code: "MY-SCHOOL" },
    create: {
      code: "MY-SCHOOL",
      title: "我的學校",
      titleI18n: { en: "My School (MTC Textbook)", th: "โรงเรียนของฉัน (ตามตำรา MTC)" },
      description: "對應教材《當代中文課程》風格 · 詞彙 + 對話 · 校園情境",
      level: Level.B1_INTERMEDIATE,
      category: "GENERAL",
      estimatedHours: 30,
      vocabularyCount: 56,
      tocflTarget: "TOCFL 3",
      themeColor: "#3b82f6",
      orderIndex: 3,
      isPublished: true,
    },
    update: {
      title: "我的學校",
      titleI18n: { en: "My School (MTC Textbook)", th: "โรงเรียนของฉัน (ตามตำรา MTC)" },
      level: Level.B1_INTERMEDIATE,
      tocflTarget: "TOCFL 3",
      isPublished: true,
    },
  });
  console.log(`📚 Course: ${course.code} (B1 level)\n`);

  // Wipe placeholder stages we built earlier
  await wipeOldStages(course.id);
  console.log();

  // Insert vocabulary records (so /api/vocab-image works for clay illustrations)
  await upsertVocabulary(DIALOG_1, "ms-c1-d1");
  console.log(`  ✅ Upserted ${DIALOG_1.length} Dialog 1 vocabulary records\n`);

  // Stage MS-C1
  const stage = await db.stage.upsert({
    where: { courseId_code: { courseId: course.id, code: "MS-C1" } },
    create: {
      courseId: course.id,
      code: "MS-C1",
      title: "第一課 開學了",
      titleI18n: { en: "Lesson 1 — School Has Started", th: "บทที่ 1 — เปิดเทอมแล้ว" },
      description: "對話一 (Dialog 1) + 對話二 (Dialog 2)",
      orderIndex: 0,
    },
    update: {
      title: "第一課 開學了",
      titleI18n: { en: "Lesson 1 — School Has Started", th: "บทที่ 1 — เปิดเทอมแล้ว" },
      description: "對話一 (Dialog 1) + 對話二 (Dialog 2)",
      orderIndex: 0,
    },
  });

  // Lesson D1 — 35 entries
  const d1 = await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: "MS-C1-D1-VOCAB" } },
    create: {
      stageId: stage.id,
      code: "MS-C1-D1-VOCAB",
      title: "對話一 · 詞彙 (35)",
      titleI18n: { en: "Dialog 1 · Vocabulary (35)", th: "บทสนทนา 1 · คำศัพท์ (35)" },
      description: `${DIALOG_1.length} 個必修詞彙 (含 3 個人名 + 29 個詞彙 + 3 個短語)`,
      type: "VOCAB",
      difficulty: 3,
      orderIndex: 0,
      estimatedMinutes: 25,
      xpReward: DIALOG_1.length * 4,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: "對話一 — 開學了",
        items: DIALOG_1.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
          note: v.partOfSpeech,
        })),
      },
    },
    update: {
      title: "對話一 · 詞彙 (35)",
      titleI18n: { en: "Dialog 1 · Vocabulary (35)", th: "บทสนทนา 1 · คำศัพท์ (35)" },
      description: `${DIALOG_1.length} 個必修詞彙 (含 3 個人名 + 29 個詞彙 + 3 個短語)`,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: "對話一 — 開學了",
        items: DIALOG_1.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
          note: v.partOfSpeech,
        })),
      },
    },
  });
  await buildVocabExercises(d1.id, DIALOG_1);
  console.log(`  ✅ MS-C1-D1-VOCAB: ${DIALOG_1.length} cards + 8 MCQ exercises`);

  // Lesson D2 — placeholder (waiting for user PDF)
  await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: "MS-C1-D2-VOCAB" } },
    create: {
      stageId: stage.id,
      code: "MS-C1-D2-VOCAB",
      title: "對話二 · 詞彙 (21) — 待補充",
      titleI18n: { en: "Dialog 2 · Vocabulary (21) — pending", th: "บทสนทนา 2 · คำศัพท์ (21) — รอเพิ่ม" },
      description: "เนื้อหารอผู้ใช้ส่งไฟล์ PDF Dialog 2 มาเพิ่ม",
      type: "VOCAB",
      difficulty: 3,
      orderIndex: 1,
      estimatedMinutes: 15,
      xpReward: 21 * 4,
      // Hidden until D2 PDF is supplied
      isPublished: false,
      content: { type: "vocabulary-list", heading: "對話二 — 待補充", items: [] },
    },
    update: {
      title: "對話二 · 詞彙 (21) — 待補充",
      titleI18n: { en: "Dialog 2 · Vocabulary (21) — pending", th: "บทสนทนา 2 · คำศัพท์ (21) — รอเพิ่ม" },
      isPublished: false,
    },
  });
  console.log(`  📝 MS-C1-D2-VOCAB: placeholder created (unpublished, waiting for Dialog 2 PDF)`);

  console.log(`\n🎉 Chapter 1 ready — try at /th/learn/MY-SCHOOL/lesson/MS-C1-D1-VOCAB`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
