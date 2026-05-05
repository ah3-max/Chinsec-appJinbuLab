/**
 * Seed: 第一週 · 長照基礎週考  (WEEKLY-W01-ELDERCARE)
 *
 * Comprehensive 30-min exam covering:
 *   - 5 Listening MCQ (audio via browser TTS)
 *   - 5 Reading MCQ
 *   - 3 Handwriting (write target character)
 *
 * Each question's `prompt` JSON includes a `section` key so the UI groups them.
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Level, ExamType, ExerciseType } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface Q {
  section: "listening" | "reading" | "writing";
  type: ExerciseType;
  prompt: Record<string, unknown>;
  options?: Array<{ value: string; label: string }>;
  answer: { value: string };
  score: number;
}

// ─── Listening (5 × audio + MCQ) ──────────────────────────────────────────────
// `prompt.audioText` is what the browser TTS speaks.
// `prompt.question` is shown after the user has heard the audio.
const listening: Q[] = [
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "阿公,我幫你量血壓。", question: "ครูช่วยวัดอะไรให้คุณตา?" },
    options: [
      { value: "A", label: "血壓 (ความดันเลือด)" },
      { value: "B", label: "體溫 (อุณหภูมิ)" },
      { value: "C", label: "體重 (น้ำหนัก)" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "阿嬤,該吃藥了。", question: "ตอนนี้ถึงเวลาทำอะไร?" },
    options: [
      { value: "A", label: "吃飯 (กินข้าว)" },
      { value: "B", label: "吃藥 (กินยา)" },
      { value: "C", label: "睡覺 (นอน)" },
    ],
    answer: { value: "B" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "請問你叫什麼名字?", question: "คำถามนี้ถามอะไร?" },
    options: [
      { value: "A", label: "ชื่อ (name)" },
      { value: "B", label: "อายุ (age)" },
      { value: "C", label: "อาชีพ (job)" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "我來扶你起床。", question: "พยาบาลช่วยอะไร?" },
    options: [
      { value: "A", label: "ลุกจากเตียง (getting up)" },
      { value: "B", label: "อาบน้ำ (bathing)" },
      { value: "C", label: "กินข้าว (eating)" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "現在幾點?", question: "คำถามนี้ถามอะไร?" },
    options: [
      { value: "A", label: "เวลา (time)" },
      { value: "B", label: "วันที่ (date)" },
      { value: "C", label: "อากาศ (weather)" },
    ],
    answer: { value: "A" },
  },
];

// ─── Reading (5 × passage / MCQ) ──────────────────────────────────────────────
const reading: Q[] = [
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "王阿公早上六點起床,先喝一杯水,然後去散步。",
      question: "王阿公早上第一件事是?",
    },
    options: [
      { value: "A", label: "起床" },
      { value: "B", label: "散步" },
      { value: "C", label: "喝水" },
    ],
    answer: { value: "A" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "李阿嬤每天下午三點要吃藥。",
      question: "李阿嬤幾點吃藥?",
    },
    options: [
      { value: "A", label: "早上六點" },
      { value: "B", label: "下午三點" },
      { value: "C", label: "晚上九點" },
    ],
    answer: { value: "B" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "照服員每天要幫住民量血壓和體溫。",
      question: "照服員每天測量什麼?",
    },
    options: [
      { value: "A", label: "血壓和體重" },
      { value: "B", label: "體溫和心跳" },
      { value: "C", label: "血壓和體溫" },
    ],
    answer: { value: "C" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "張阿公說:「我的腳很痛,不能走路。」",
      question: "張阿公的什麼地方痛?",
    },
    options: [
      { value: "A", label: "頭" },
      { value: "B", label: "腳" },
      { value: "C", label: "手" },
    ],
    answer: { value: "B" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "阿嬤喜歡吃稀飯,因為比較好咬。",
      question: "阿嬤為什麼吃稀飯?",
    },
    options: [
      { value: "A", label: "便宜" },
      { value: "B", label: "好咬" },
      { value: "C", label: "好喝" },
    ],
    answer: { value: "B" },
  },
];

// ─── Handwriting (3 × write the character) ────────────────────────────────────
const writing: Q[] = [
  {
    section: "writing", type: "VOCAB_MCQ", score: 10,
    prompt: { targetCharacter: "你", instruction: "เขียนตัวอักษรนี้" },
    answer: { value: "你" },
  },
  {
    section: "writing", type: "VOCAB_MCQ", score: 10,
    prompt: { targetCharacter: "好", instruction: "เขียนตัวอักษรนี้" },
    answer: { value: "好" },
  },
  {
    section: "writing", type: "VOCAB_MCQ", score: 10,
    prompt: { targetCharacter: "藥", instruction: "เขียนตัวอักษรนี้ (ยา)" },
    answer: { value: "藥" },
  },
];

const ALL_QUESTIONS: Q[] = [...listening, ...reading, ...writing];
const TOTAL_SCORE = ALL_QUESTIONS.reduce((s, q) => s + q.score, 0); // 124

async function main() {
  const code = "WEEKLY-W01-ELDERCARE";
  const exam = await db.mockExam.upsert({
    where: { code },
    create: {
      code,
      title: "第一週 · 長照基礎週考",
      titleI18n: {
        en: "Week 1 · Long-Term Care Basics",
        th: "สัปดาห์ที่ 1 · พื้นฐานการดูแลผู้สูงอายุ",
      },
      description:
        "聽力 5 題 · 閱讀 5 題 · 手寫 3 題 · 共 30 分鐘\n" +
        "หูฟัง 5 ข้อ · อ่าน 5 ข้อ · เขียน 3 ข้อ · 30 นาที",
      level: Level.A1_BEGINNER,
      type: ExamType.COMPREHENSIVE,
      totalQuestions: ALL_QUESTIONS.length,
      durationMin: 30,
      passingScore: Math.round(TOTAL_SCORE * 0.6),
      maxScore: TOTAL_SCORE,
      issueCertificate: false,
      isActive: true,
      isPublished: true,
    },
    update: {
      title: "第一週 · 長照基礎週考",
      totalQuestions: ALL_QUESTIONS.length,
      maxScore: TOTAL_SCORE,
      passingScore: Math.round(TOTAL_SCORE * 0.6),
      isPublished: true,
      isActive: true,
    },
  });

  // Wipe and re-seed questions for idempotency
  await db.examQuestion.deleteMany({ where: { examId: exam.id } });

  for (let i = 0; i < ALL_QUESTIONS.length; i++) {
    const q = ALL_QUESTIONS[i];
    await db.examQuestion.create({
      data: {
        examId: exam.id,
        type: q.type,
        prompt: { ...q.prompt, section: q.section },
        options: q.options ?? [],
        answer: q.answer,
        score: q.score,
        orderIndex: i,
      },
    });
  }

  console.log(`✅ ${code}`);
  console.log(`   Title: ${exam.title}`);
  console.log(`   Questions: ${ALL_QUESTIONS.length} (${listening.length} listening + ${reading.length} reading + ${writing.length} writing)`);
  console.log(`   Max score: ${TOTAL_SCORE}, Passing: ${exam.passingScore}`);
  console.log(`   Duration: ${exam.durationMin} min`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
