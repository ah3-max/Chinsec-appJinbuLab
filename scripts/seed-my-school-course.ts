/**
 * Seed: 我的學校 / My School course (A1 level, MTC-aligned).
 *
 * 3 chapters × {vocab lesson + grammar lesson + practice exercises}:
 *   Chapter 1 校園 / At School (places)         — 10 vocab + 3 grammar patterns
 *   Chapter 2 學校的人 / People at School (roles) — 8 vocab + 3 grammar patterns
 *   Chapter 3 上課時間 / Class Time             — 10 vocab + 3 grammar patterns
 *
 * Grammar lessons are stored as `vocabulary-list` content with each "item"
 * being a grammar pattern (hanzi = pattern, example = example sentence).
 * The lesson runner already handles example sentences inside vocab cards.
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Level, ExerciseType } from "@prisma/client";

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
  /** Detailed visual hint for DALL-E to generate matching clay illustration */
  imagePromptHint: string;
}

interface GrammarItem {
  hanzi: string;        // e.g. "S + 在 + Place"
  pinyin: string;
  translations: { en: string; th: string };
  example: {
    sentence: string;
    sentencePinyin: string;
    sentenceTh: string;
  };
}

interface ChapterSeed {
  code: string;
  title: string;
  titleEn: string;
  titleTh: string;
  description: string;
  orderIndex: number;
  vocabCategory: string;
  vocab: VocabSeed[];
  grammar: GrammarItem[];
  /** Comprehension questions for the grammar lesson */
  grammarExercises: Array<{
    sentenceWithBlank: string;
    audioText: string;
    correct: string;
    distractors: [string, string];
    questionTh: string;
  }>;
}

// ─── Chapter 1: 校園 (Places at School) ──────────────────────────────────────
const CHAPTER_1: ChapterSeed = {
  code: "MS-C1",
  title: "校園 — 學校的地方",
  titleEn: "At School — Places",
  titleTh: "ในโรงเรียน — สถานที่",
  description: "เรียนชื่อสถานที่ในโรงเรียน",
  orderIndex: 0,
  vocabCategory: "ms-c1-places",
  vocab: [
    { hanzi: "學校", zhuyin: "ㄒㄩㄝˊ ㄒㄧㄠˋ", pinyin: "Xuéxiào", translations: { en: "school",      th: "โรงเรียน" },     partOfSpeech: "n.", imagePromptHint: "clay school building with red roof and flag, friendly cartoon style" },
    { hanzi: "教室", zhuyin: "ㄐㄧㄠˋ ㄕˋ",   pinyin: "Jiàoshì",  translations: { en: "classroom",   th: "ห้องเรียน" },     partOfSpeech: "n.", imagePromptHint: "clay classroom with blackboard chalk desk chairs cute" },
    { hanzi: "圖書館", zhuyin: "ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ", pinyin: "Túshūguǎn", translations: { en: "library",  th: "ห้องสมุด" }, partOfSpeech: "n.", imagePromptHint: "clay library building with shelves of colorful books" },
    { hanzi: "操場", zhuyin: "ㄘㄠ ㄔㄤˇ",    pinyin: "Cāochǎng", translations: { en: "playground / field", th: "สนาม" },   partOfSpeech: "n.", imagePromptHint: "clay sports field running track green grass with goal" },
    { hanzi: "餐廳", zhuyin: "ㄘㄢ ㄊㄧㄥ",   pinyin: "Cāntīng",  translations: { en: "cafeteria",   th: "โรงอาหาร" },     partOfSpeech: "n.", imagePromptHint: "clay cafeteria dining hall with food trays tables friendly" },
    { hanzi: "廁所", zhuyin: "ㄘㄜˋ ㄙㄨㄛˇ", pinyin: "Cèsuǒ",    translations: { en: "restroom",    th: "ห้องน้ำ" },        partOfSpeech: "n.", imagePromptHint: "clay restroom bathroom door with male female sign cute" },
    { hanzi: "辦公室", zhuyin: "ㄅㄢˋ ㄍㄨㄥ ㄕˋ", pinyin: "Bàngōngshì", translations: { en: "office", th: "ห้องทำงาน" },  partOfSpeech: "n.", imagePromptHint: "clay office room with desk computer paper teacher's office" },
    { hanzi: "宿舍", zhuyin: "ㄙㄨˋ ㄕㄜˋ",   pinyin: "Sùshè",    translations: { en: "dormitory",   th: "หอพัก" },         partOfSpeech: "n.", imagePromptHint: "clay dormitory building rooms with bunk beds school dorm" },
    { hanzi: "大門", zhuyin: "ㄉㄚˋ ㄇㄣˊ",   pinyin: "Dàmén",    translations: { en: "main gate",   th: "ประตูใหญ่" },     partOfSpeech: "n.", imagePromptHint: "clay big school gate entrance with sign welcoming" },
    { hanzi: "黑板", zhuyin: "ㄏㄟ ㄅㄢˇ",    pinyin: "Hēibǎn",   translations: { en: "blackboard",  th: "กระดานดำ" },      partOfSpeech: "n.", imagePromptHint: "clay green blackboard with chalk writing classroom board" },
  ],
  grammar: [
    {
      hanzi: "在 + 地方",
      pinyin: "zài + place",
      translations: { en: "be at a place", th: "อยู่ที่ (สถานที่)" },
      example: { sentence: "我在教室。", sentencePinyin: "Wǒ zài jiàoshì.", sentenceTh: "ฉันอยู่ในห้องเรียน" },
    },
    {
      hanzi: "去 + 地方",
      pinyin: "qù + place",
      translations: { en: "go to a place", th: "ไป (สถานที่)" },
      example: { sentence: "我去圖書館。", sentencePinyin: "Wǒ qù túshūguǎn.", sentenceTh: "ฉันไปห้องสมุด" },
    },
    {
      hanzi: "從 + 地方 + 來",
      pinyin: "cóng + place + lái",
      translations: { en: "come from a place", th: "มาจาก (สถานที่)" },
      example: { sentence: "我從學校來。", sentencePinyin: "Wǒ cóng xuéxiào lái.", sentenceTh: "ฉันมาจากโรงเรียน" },
    },
  ],
  grammarExercises: [
    { audioText: "我在教室。",         sentenceWithBlank: "我 ___ 教室。", correct: "在",   distractors: ["去", "從"], questionTh: "เลือกคำที่หายไป" },
    { audioText: "我去圖書館。",       sentenceWithBlank: "我 ___ 圖書館。", correct: "去",   distractors: ["在", "從"], questionTh: "เลือกคำที่หายไป" },
    { audioText: "他從學校來。",       sentenceWithBlank: "他 ___ 學校來。", correct: "從",   distractors: ["去", "在"], questionTh: "เลือกคำที่หายไป" },
  ],
};

// ─── Chapter 2: 學校的人 (People at School) ─────────────────────────────────
const CHAPTER_2: ChapterSeed = {
  code: "MS-C2",
  title: "學校的人 — 同學與老師",
  titleEn: "People at School — Classmates & Teachers",
  titleTh: "คนในโรงเรียน — เพื่อนและครู",
  description: "เรียนคำเรียกคนในโรงเรียน",
  orderIndex: 1,
  vocabCategory: "ms-c2-people",
  vocab: [
    { hanzi: "老師",   zhuyin: "ㄌㄠˇ ㄕ",      pinyin: "Lǎoshī",   translations: { en: "teacher",        th: "คุณครู" },     partOfSpeech: "n.", imagePromptHint: "clay friendly teacher with glasses holding book in front of blackboard" },
    { hanzi: "學生",   zhuyin: "ㄒㄩㄝˊ ㄕㄥ",   pinyin: "Xuéshēng", translations: { en: "student",        th: "นักเรียน" },   partOfSpeech: "n.", imagePromptHint: "clay student wearing uniform with backpack smiling" },
    { hanzi: "同學",   zhuyin: "ㄊㄨㄥˊ ㄒㄩㄝˊ", pinyin: "Tóngxué",  translations: { en: "classmate",      th: "เพื่อนร่วมชั้น" }, partOfSpeech: "n.", imagePromptHint: "clay two students friends sitting together at desk classmates" },
    { hanzi: "校長",   zhuyin: "ㄒㄧㄠˋ ㄓㄤˇ",  pinyin: "Xiàozhǎng", translations: { en: "principal",     th: "อาจารย์ใหญ่" },  partOfSpeech: "n.", imagePromptHint: "clay distinguished principal with formal suit and tie holding diploma" },
    { hanzi: "室友",   zhuyin: "ㄕˋ ㄧㄡˇ",     pinyin: "Shìyǒu",   translations: { en: "roommate",       th: "รูมเมท" },     partOfSpeech: "n.", imagePromptHint: "clay two students sharing dorm room with bunk beds roommates" },
    { hanzi: "朋友",   zhuyin: "ㄆㄥˊ ㄧㄡˇ",   pinyin: "Péngyǒu",  translations: { en: "friend",         th: "เพื่อน" },     partOfSpeech: "n.", imagePromptHint: "clay two friends laughing arms around each other happy" },
    { hanzi: "班長",   zhuyin: "ㄅㄢ ㄓㄤˇ",    pinyin: "Bānzhǎng", translations: { en: "class leader",   th: "หัวหน้าชั้น" },  partOfSpeech: "n.", imagePromptHint: "clay student class leader with armband and clipboard responsible" },
    { hanzi: "外國人", zhuyin: "ㄨㄞˋ ㄍㄨㄛˊ ㄖㄣˊ", pinyin: "Wàiguórén", translations: { en: "foreigner", th: "ชาวต่างชาติ" }, partOfSpeech: "n.", imagePromptHint: "clay foreign student tourist with backpack passport friendly" },
  ],
  grammar: [
    {
      hanzi: "S + 是 + N",
      pinyin: "S + shì + N",
      translations: { en: "S is N", th: "S เป็น N" },
      example: { sentence: "他是老師。", sentencePinyin: "Tā shì lǎoshī.", sentenceTh: "เขาเป็นคุณครู" },
    },
    {
      hanzi: "誰 + V?",
      pinyin: "shéi + V",
      translations: { en: "Who does V?", th: "ใคร V" },
      example: { sentence: "誰是校長?", sentencePinyin: "Shéi shì xiàozhǎng?", sentenceTh: "ใครคืออาจารย์ใหญ่?" },
    },
    {
      hanzi: "N1 的 N2",
      pinyin: "N1 de N2",
      translations: { en: "N1's N2 (possession)", th: "N2 ของ N1" },
      example: { sentence: "我的同學。", sentencePinyin: "Wǒ de tóngxué.", sentenceTh: "เพื่อนร่วมชั้นของฉัน" },
    },
  ],
  grammarExercises: [
    { audioText: "他是老師。",          sentenceWithBlank: "他 ___ 老師。",     correct: "是",   distractors: ["在", "去"], questionTh: "เลือกคำที่หายไป" },
    { audioText: "誰是校長?",            sentenceWithBlank: "___ 是校長?",      correct: "誰",   distractors: ["他", "我"], questionTh: "เลือกคำที่หายไป" },
    { audioText: "我的同學是學生。",      sentenceWithBlank: "我 ___ 同學是學生。", correct: "的", distractors: ["是", "在"], questionTh: "เลือกคำที่หายไป" },
  ],
};

// ─── Chapter 3: 上課時間 (Class Time) ────────────────────────────────────────
const CHAPTER_3: ChapterSeed = {
  code: "MS-C3",
  title: "上課時間 — 課堂活動",
  titleEn: "Class Time — Classroom Activities",
  titleTh: "เวลาเรียน — กิจกรรมในห้องเรียน",
  description: "เรียนคำเกี่ยวกับการเรียนการสอน",
  orderIndex: 2,
  vocabCategory: "ms-c3-class",
  vocab: [
    { hanzi: "上課",   zhuyin: "ㄕㄤˋ ㄎㄜˋ",   pinyin: "Shàngkè",    translations: { en: "have class / class begins",  th: "เข้าเรียน" },        partOfSpeech: "v.", imagePromptHint: "clay students in classroom listening to teacher class in session" },
    { hanzi: "下課",   zhuyin: "ㄒㄧㄚˋ ㄎㄜˋ",  pinyin: "Xiàkè",      translations: { en: "class ends",                 th: "เลิกเรียน" },         partOfSpeech: "v.", imagePromptHint: "clay students leaving classroom door bell ringing dismissal" },
    { hanzi: "上學",   zhuyin: "ㄕㄤˋ ㄒㄩㄝˊ",  pinyin: "Shàngxué",   translations: { en: "go to school",               th: "ไปโรงเรียน" },        partOfSpeech: "v.", imagePromptHint: "clay student walking to school with backpack morning" },
    { hanzi: "放學",   zhuyin: "ㄈㄤˋ ㄒㄩㄝˊ",  pinyin: "Fàngxué",    translations: { en: "school dismissed",           th: "เลิกเรียนกลับบ้าน" }, partOfSpeech: "v.", imagePromptHint: "clay students leaving school happy backpack afternoon dismissal" },
    { hanzi: "考試",   zhuyin: "ㄎㄠˇ ㄕˋ",     pinyin: "Kǎoshì",     translations: { en: "exam / test",                th: "สอบ" },               partOfSpeech: "n./v.", imagePromptHint: "clay test paper with questions pencil exam students taking" },
    { hanzi: "功課",   zhuyin: "ㄍㄨㄥ ㄎㄜˋ",   pinyin: "Gōngkè",     translations: { en: "homework",                   th: "การบ้าน" },           partOfSpeech: "n.", imagePromptHint: "clay homework notebook with pencil school assignments stacked" },
    { hanzi: "作業",   zhuyin: "ㄗㄨㄛˋ ㄧㄝˋ",  pinyin: "Zuòyè",      translations: { en: "assignment",                 th: "แบบฝึกหัด" },         partOfSpeech: "n.", imagePromptHint: "clay workbook with completed exercises checkmark assignments" },
    { hanzi: "課本",   zhuyin: "ㄎㄜˋ ㄅㄣˇ",   pinyin: "Kèběn",      translations: { en: "textbook",                   th: "หนังสือเรียน" },       partOfSpeech: "n.", imagePromptHint: "clay open textbook with Chinese characters on pages bookmark" },
    { hanzi: "字典",   zhuyin: "ㄗˋ ㄉㄧㄢˇ",   pinyin: "Zìdiǎn",     translations: { en: "dictionary",                 th: "พจนานุกรม" },         partOfSpeech: "n.", imagePromptHint: "clay thick dictionary book open with words A-Z reference" },
    { hanzi: "鉛筆",   zhuyin: "ㄑㄧㄢ ㄅㄧˇ",   pinyin: "Qiānbǐ",     translations: { en: "pencil",                     th: "ดินสอ" },             partOfSpeech: "n.", imagePromptHint: "clay yellow wooden pencil sharpened with eraser tip" },
  ],
  grammar: [
    {
      hanzi: "在 + V (進行式)",
      pinyin: "zài + V (in-progress)",
      translations: { en: "be V-ing", th: "กำลัง V อยู่" },
      example: { sentence: "我在上課。", sentencePinyin: "Wǒ zài shàngkè.", sentenceTh: "ฉันกำลังเข้าเรียน" },
    },
    {
      hanzi: "要 + V",
      pinyin: "yào + V",
      translations: { en: "want / will V", th: "จะ / ต้องการ V" },
      example: { sentence: "我要考試。", sentencePinyin: "Wǒ yào kǎoshì.", sentenceTh: "ฉันจะสอบ" },
    },
    {
      hanzi: "已經 + V + 了",
      pinyin: "yǐjīng + V + le",
      translations: { en: "have already V-ed", th: "...แล้ว" },
      example: { sentence: "已經下課了。", sentencePinyin: "Yǐjīng xiàkè le.", sentenceTh: "เลิกเรียนแล้ว" },
    },
  ],
  grammarExercises: [
    { audioText: "我在上課。",         sentenceWithBlank: "我 ___ 上課。",     correct: "在",     distractors: ["要", "從"], questionTh: "เลือกคำที่หายไป (กำลังกระทำ)" },
    { audioText: "我要考試。",         sentenceWithBlank: "我 ___ 考試。",     correct: "要",     distractors: ["在", "了"], questionTh: "เลือกคำที่หายไป (จะ/ต้องการ)" },
    { audioText: "已經下課了。",       sentenceWithBlank: "___ 下課了。",     correct: "已經",   distractors: ["不要", "在"], questionTh: "เลือกคำที่หายไป (...แล้ว)" },
  ],
};

const CHAPTERS = [CHAPTER_1, CHAPTER_2, CHAPTER_3];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertVocabulary(c: ChapterSeed) {
  for (const v of c.vocab) {
    await db.vocabulary.upsert({
      where: { hanzi: v.hanzi },
      create: {
        hanzi: v.hanzi,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        partOfSpeech: v.partOfSpeech,
        // EN field carries the visual prompt — used by /api/vocab-image to generate clay images
        translations: { ...v.translations, en: v.imagePromptHint },
        level: Level.A1_BEGINNER,
        tocflBand: "A1",
        frequency: 2,
        difficulty: 1,
        category: c.vocabCategory,
        tags: ["a1", "school", "mtc-aligned"],
        isEldercareVocab: false,
      },
      update: {
        translations: { ...v.translations, en: v.imagePromptHint },
        category: c.vocabCategory,
        partOfSpeech: v.partOfSpeech,
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
        maxScore: 10,
        orderIndex: i,
        isActive: true,
      },
    });
  }
}

async function buildGrammarExercises(
  lessonId: string,
  exs: ChapterSeed["grammarExercises"],
) {
  await db.exercise.deleteMany({ where: { lessonId } });
  const labels = ["A", "B", "C"];
  for (let i = 0; i < exs.length; i++) {
    const e = exs[i]!;
    const opts = [e.correct, ...e.distractors];
    for (let j = opts.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      const tmp = opts[j]!;
      opts[j] = opts[k]!;
      opts[k] = tmp;
    }
    const correctIdx = opts.indexOf(e.correct);
    await db.exercise.create({
      data: {
        lessonId,
        type: ExerciseType.LISTEN_FILL,
        prompt: {
          audioText: e.audioText,
          sentenceWithBlank: e.sentenceWithBlank,
          questionText: e.questionTh,
        },
        options: opts.map((label, idx) => ({ value: labels[idx], label })),
        answer: { value: labels[correctIdx] },
        maxScore: 12,
        orderIndex: i,
        isActive: true,
      },
    });
  }
}

async function seedChapter(courseId: string, c: ChapterSeed) {
  // Stage
  const stage = await db.stage.upsert({
    where: { courseId_code: { courseId, code: c.code } },
    create: {
      courseId,
      code: c.code,
      title: c.title,
      titleI18n: { en: c.titleEn, th: c.titleTh },
      description: c.description,
      orderIndex: c.orderIndex,
    },
    update: {
      title: c.title,
      titleI18n: { en: c.titleEn, th: c.titleTh },
      description: c.description,
      orderIndex: c.orderIndex,
    },
  });

  // Vocab lesson
  const vocabLessonCode = `${c.code}-VOCAB`;
  const vocabLesson = await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: vocabLessonCode } },
    create: {
      stageId: stage.id,
      code: vocabLessonCode,
      title: `${c.title} · 詞彙`,
      titleI18n: { en: `${c.titleEn} · Vocabulary`, th: `${c.titleTh} · คำศัพท์` },
      description: `${c.vocab.length} 個必修詞彙`,
      type: "VOCAB",
      difficulty: 1,
      orderIndex: 0,
      estimatedMinutes: Math.max(5, Math.ceil(c.vocab.length * 1.5)),
      xpReward: c.vocab.length * 3,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: c.title,
        items: c.vocab.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
        })),
      },
    },
    update: {
      title: `${c.title} · 詞彙`,
      titleI18n: { en: `${c.titleEn} · Vocabulary`, th: `${c.titleTh} · คำศัพท์` },
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: c.title,
        items: c.vocab.map((v) => ({
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          translations: v.translations,
        })),
      },
    },
  });
  await buildVocabExercises(vocabLesson.id, c.vocab);

  // Grammar lesson — uses vocabulary-list content where each "item" is a grammar pattern
  const grammarLessonCode = `${c.code}-GRAMMAR`;
  const grammarLesson = await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: grammarLessonCode } },
    create: {
      stageId: stage.id,
      code: grammarLessonCode,
      title: `${c.title} · 語法`,
      titleI18n: { en: `${c.titleEn} · Grammar`, th: `${c.titleTh} · ไวยากรณ์` },
      description: `${c.grammar.length} 個語法句型`,
      type: "VOCAB", // reuse: same flashcard UI handles patterns
      difficulty: 2,
      orderIndex: 1,
      estimatedMinutes: Math.max(5, c.grammar.length * 2),
      xpReward: c.grammar.length * 5,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: `${c.title} · 語法`,
        items: c.grammar.map((g) => ({
          hanzi: g.hanzi,
          pinyin: g.pinyin,
          translations: g.translations,
          example: g.example,
        })),
      },
    },
    update: {
      title: `${c.title} · 語法`,
      titleI18n: { en: `${c.titleEn} · Grammar`, th: `${c.titleTh} · ไวยากรณ์` },
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: `${c.title} · 語法`,
        items: c.grammar.map((g) => ({
          hanzi: g.hanzi,
          pinyin: g.pinyin,
          translations: g.translations,
          example: g.example,
        })),
      },
    },
  });
  await buildGrammarExercises(grammarLesson.id, c.grammarExercises);

  console.log(`  ✅ ${c.code} ${c.title}`);
  console.log(`     ↳ ${vocabLessonCode}: ${c.vocab.length} vocab + 6 MCQ exercises`);
  console.log(`     ↳ ${grammarLessonCode}: ${c.grammar.length} grammar + ${c.grammarExercises.length} listen-fill exercises`);
}

async function main() {
  const course = await db.course.upsert({
    where: { code: "MY-SCHOOL" },
    create: {
      code: "MY-SCHOOL",
      title: "我的學校",
      titleI18n: {
        en: "My School",
        th: "โรงเรียนของฉัน",
      },
      description: "MTC《當代中文課程》風格 · 詞彙 + 語法 · 校園情境",
      level: Level.A1_BEGINNER,
      category: "GENERAL",
      estimatedHours: 15,
      vocabularyCount: 28,
      tocflTarget: "TOCFL 1",
      themeColor: "#3b82f6",
      orderIndex: 3,
      isPublished: true,
    },
    update: {
      title: "我的學校",
      titleI18n: { en: "My School", th: "โรงเรียนของฉัน" },
      isPublished: true,
    },
  });
  console.log(`📚 Course: ${course.code} (${course.id})\n`);

  for (const c of CHAPTERS) {
    await upsertVocabulary(c);
    await seedChapter(course.id, c);
  }

  const totalVocab = CHAPTERS.reduce((s, c) => s + c.vocab.length, 0);
  const totalGrammar = CHAPTERS.reduce((s, c) => s + c.grammar.length, 0);
  const totalExercises =
    CHAPTERS.length * 6 +
    CHAPTERS.reduce((s, c) => s + c.grammarExercises.length, 0);
  console.log(
    `\n🎉 My School seeded: ${CHAPTERS.length} chapters, ${totalVocab} vocab + ${totalGrammar} grammar patterns, ${totalExercises} exercises total`,
  );
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
