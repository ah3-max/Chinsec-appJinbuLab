/**
 * Seed Chapter 1 Grammar lesson — 6 patterns from the user's textbook PDF.
 *
 *   I    …的話       if, supposing
 *   II   不到         less than
 *   III  差一點(就)…  almost (but didn't)
 *   IV   恐怕…        I'm afraid (unfavorable)
 *   V    好不容易     finally managed to
 *   VI   說…就…       just like that / instantly
 *
 * Each pattern is shown as a flashcard with one example sentence, then
 * users hit 6 LISTEN_FILL exercises (one per pattern) for practice.
 *
 * Function descriptions are paraphrased in our own words.
 * Example sentences use the user-uploaded PDF content (their own teaching material).
 * Practice exercises are originally written here, testing each pattern.
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface GrammarItem {
  hanzi: string;            // pattern (e.g. "…的話")
  pinyin: string;
  translations: { en: string; th: string };
  example: {
    sentence: string;
    sentencePinyin: string;
    sentenceTh: string;
  };
  /** Optional brief usage note shown in the example block */
  note?: string;
}

interface GrammarExercise {
  audioText: string;        // full sentence spoken via TTS
  sentenceWithBlank: string;
  correct: string;
  distractors: [string, string];
  questionTh: string;
}

const GRAMMAR_PATTERNS: GrammarItem[] = [
  {
    hanzi: "…的話",
    pinyin: "…de huà",
    translations: {
      en: "if, supposing (placed at end of conditional clause)",
      th: "ถ้า / สมมติว่า (วางท้ายประโยคเงื่อนไข)",
    },
    example: {
      sentence: "你想轉系的話，最好先跟父母討論。",
      sentencePinyin: "Nǐ xiǎng zhuǎn xì de huà, zuìhǎo xiān gēn fùmǔ tǎolùn.",
      sentenceTh: "ถ้าอยากย้ายสาขา ควรคุยกับพ่อแม่ก่อนจะดีกว่า",
    },
    note: "Combine with 如果/要是 for more formal style.",
  },
  {
    hanzi: "不到",
    pinyin: "bú dào",
    translations: {
      en: "less than… (followed by a number/quantity)",
      th: "ไม่ถึง... (ตามด้วยจำนวน)",
    },
    example: {
      sentence: "這支手機不到五千塊，真便宜。",
      sentencePinyin: "Zhè zhī shǒujī bú dào wǔ qiān kuài, zhēn piányí.",
      sentenceTh: "มือถือเครื่องนี้ไม่ถึงห้าพันบาท ถูกมากเลย",
    },
  },
  {
    hanzi: "差一點(就)…",
    pinyin: "chà yì diǎn (jiù) …",
    translations: {
      en: "almost… (but did not happen)",
      th: "เกือบจะ... (แต่ไม่ได้เกิดขึ้น)",
    },
    example: {
      sentence: "昨天的演講真沒意思，我差一點睡著了。",
      sentencePinyin: "Zuótiān de yǎnjiǎng zhēn méi yìsi, wǒ chà yì diǎn shuìzháo le.",
      sentenceTh: "การบรรยายเมื่อวานน่าเบื่อมาก ฉันเกือบหลับเลย",
    },
    note: "就 is optional. Don't confuse with 差不多 (about, close to).",
  },
  {
    hanzi: "恐怕…",
    pinyin: "kǒngpà …",
    translations: {
      en: "I'm afraid that… (likely outcome, usually unfavorable)",
      th: "เกรงว่า, น่าจะ... (มักเป็นสถานการณ์ที่ไม่ดี)",
    },
    example: {
      sentence: "壓力太大，恐怕會影響身體健康。",
      sentencePinyin: "Yālì tài dà, kǒngpà huì yǐngxiǎng shēntǐ jiànkāng.",
      sentenceTh: "ความเครียดมากเกินไป กลัวว่าจะกระทบต่อสุขภาพ",
    },
    note: "More negative tone than 大概 / 可能.",
  },
  {
    hanzi: "好不容易",
    pinyin: "hǎo bù róngyì",
    translations: {
      en: "finally managed to… (hard-won, after great difficulty)",
      th: "ในที่สุดก็สำเร็จ / ลำบากมากกว่าจะ... (ผลที่ได้มาด้วยความยากลำบาก)",
    },
    example: {
      sentence: "下了兩星期的雨，今天好不容易才停。",
      sentencePinyin: "Xià le liǎng xīngqí de yǔ, jīntiān hǎo bù róngyì cái tíng.",
      sentenceTh: "ฝนตกมาสองอาทิตย์ วันนี้ในที่สุดก็หยุดตกซะที",
    },
  },
  {
    hanzi: "說…就…",
    pinyin: "shuō … jiù …",
    translations: {
      en: "just like that / and before you know it (sudden, unexpected action)",
      th: "พูดจะ... ก็... (เกิดขึ้นทันทีโดยไม่บอกล่วงหน้า)",
    },
    example: {
      sentence: "台北的天氣真奇怪，說下雨就下雨。",
      sentencePinyin: "Táiběi de tiānqì zhēn qíguài, shuō xià yǔ jiù xià yǔ.",
      sentenceTh: "อากาศในไทเปแปลกจริงๆ พูดจะฝนตกก็ตกเลย",
    },
    note: "Same verb fills both blanks (e.g. 說走就走).",
  },
];

// ─── Practice exercises (originally written, one per pattern) ────────────────
const GRAMMAR_EXERCISES: GrammarExercise[] = [
  {
    audioText: "明天下雨的話，我們就不出門。",
    sentenceWithBlank: "明天下雨 ___ ，我們就不出門。",
    correct: "的話",
    distractors: ["雖然", "因為"],
    questionTh: "เลือกคำที่หายไป (รูปแบบเงื่อนไข)",
  },
  {
    audioText: "他來台灣不到一年。",
    sentenceWithBlank: "他來台灣 ___ 一年。",
    correct: "不到",
    distractors: ["差不多", "大約"],
    questionTh: "เลือกคำที่หายไป (น้อยกว่า)",
  },
  {
    audioText: "我差一點忘了她的生日。",
    sentenceWithBlank: "我 ___ 忘了她的生日。",
    correct: "差一點",
    distractors: ["差不多", "已經"],
    questionTh: "เลือกคำที่หายไป (เกือบจะ...)",
  },
  {
    audioText: "他沒準備好，恐怕得熬夜。",
    sentenceWithBlank: "他沒準備好， ___ 得熬夜。",
    correct: "恐怕",
    distractors: ["大概", "也許"],
    questionTh: "เลือกคำที่หายไป (เกรงว่า)",
  },
  {
    audioText: "他好不容易才考上理想的大學。",
    sentenceWithBlank: "他 ___ 才考上理想的大學。",
    correct: "好不容易",
    distractors: ["馬上", "突然"],
    questionTh: "เลือกคำที่หายไป (ในที่สุดก็)",
  },
  {
    audioText: "他說走就走，沒跟我們說一聲。",
    sentenceWithBlank: "他 ___ 走 ___ 走，沒跟我們說一聲。",
    correct: "說/就",
    distractors: ["不/也", "又/還"],
    questionTh: "เลือกคำที่หายไป (ทันทีโดยไม่บอกล่วงหน้า)",
  },
];

async function main() {
  console.log("=== Seeding MS-C1 Grammar lesson ===\n");

  const stage = await db.stage.findFirst({
    where: { course: { code: "MY-SCHOOL" }, code: "MS-C1" },
    select: { id: true },
  });
  if (!stage) {
    console.error("❌ MS-C1 stage not found — run seed-my-school-mtc-c1.ts first");
    process.exit(1);
  }

  const lessonCode = "MS-C1-GRAMMAR";
  const lesson = await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: lessonCode } },
    create: {
      stageId: stage.id,
      code: lessonCode,
      title: "語法 · 6 個句型",
      titleI18n: { en: "Grammar · 6 Patterns", th: "ไวยากรณ์ · 6 รูปแบบ" },
      description: `${GRAMMAR_PATTERNS.length} 個必修語法 + ${GRAMMAR_EXERCISES.length} 道聽寫填空練習`,
      type: "VOCAB",       // reuse vocabulary-list rendering with embedded examples
      difficulty: 3,
      orderIndex: 3,
      estimatedMinutes: 18,
      xpReward: GRAMMAR_PATTERNS.length * 8,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: "第一課 · 語法",
        items: GRAMMAR_PATTERNS.map((g) => ({
          hanzi: g.hanzi,
          pinyin: g.pinyin,
          translations: g.translations,
          note: g.note,
          example: g.example,
        })),
      },
    },
    update: {
      title: "語法 · 6 個句型",
      titleI18n: { en: "Grammar · 6 Patterns", th: "ไวยากรณ์ · 6 รูปแบบ" },
      description: `${GRAMMAR_PATTERNS.length} 個必修語法 + ${GRAMMAR_EXERCISES.length} 道聽寫填空練習`,
      isPublished: true,
      content: {
        type: "vocabulary-list",
        heading: "第一課 · 語法",
        items: GRAMMAR_PATTERNS.map((g) => ({
          hanzi: g.hanzi,
          pinyin: g.pinyin,
          translations: g.translations,
          note: g.note,
          example: g.example,
        })),
      },
    },
  });

  // Wipe and rebuild exercises
  await db.exercise.deleteMany({ where: { lessonId: lesson.id } });
  const labels = ["A", "B", "C"];
  for (let i = 0; i < GRAMMAR_EXERCISES.length; i++) {
    const e = GRAMMAR_EXERCISES[i]!;
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
        lessonId: lesson.id,
        type: "LISTEN_FILL",
        prompt: {
          audioText: e.audioText,
          sentenceWithBlank: e.sentenceWithBlank,
          questionText: e.questionTh,
        },
        options: opts.map((label, idx) => ({ value: labels[idx], label })),
        answer: { value: labels[correctIdx] },
        maxScore: 14,
        orderIndex: i,
        isActive: true,
      },
    });
  }

  console.log(`✅ ${lessonCode}: ${GRAMMAR_PATTERNS.length} patterns + ${GRAMMAR_EXERCISES.length} listen-fill exercises`);
  console.log("   Patterns: …的話 / 不到 / 差一點 / 恐怕 / 好不容易 / 說…就…\n");
  console.log(`🎉 Try at /th/learn/MY-SCHOOL/lesson/${lessonCode}`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
