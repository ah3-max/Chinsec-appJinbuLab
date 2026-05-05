/**
 * Seed: 第二週 · 日常照護週考  (WEEKLY-W02-DAILYCARE)
 *
 * 13 questions covering: 餵食 / 餵藥 / 換尿布 / 翻身 / 量血壓
 *   - 5 Listening MCQ (browser TTS)
 *   - 5 Reading MCQ
 *   - 3 Handwriting (write target characters)
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

const listening: Q[] = [
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "阿嬤,慢慢吃,小心燙。", question: "ผู้ดูแลเตือนอะไร?" },
    options: [
      { value: "A", label: "อาหารร้อน ระวังลวก" },
      { value: "B", label: "อาหารเย็น" },
      { value: "C", label: "อาหารหวาน" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "我幫你換尿布,翻一下身好嗎?", question: "ผู้ดูแลกำลังจะทำอะไร?" },
    options: [
      { value: "A", label: "เปลี่ยนผ้าอ้อม" },
      { value: "B", label: "อาบน้ำ" },
      { value: "C", label: "วัดความดัน" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "阿公,該吃早餐了。", question: "ตอนนี้ถึงเวลาอะไร?" },
    options: [
      { value: "A", label: "อาหารเช้า" },
      { value: "B", label: "อาหารกลางวัน" },
      { value: "C", label: "อาหารเย็น" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "我來量你的血壓。", question: "ผู้ดูแลจะวัดอะไร?" },
    options: [
      { value: "A", label: "ความดันเลือด" },
      { value: "B", label: "อุณหภูมิ" },
      { value: "C", label: "น้ำหนัก" },
    ],
    answer: { value: "A" },
  },
  {
    section: "listening", type: "VOCAB_MCQ", score: 10,
    prompt: { audioText: "請吞下這顆藥,然後喝水。", question: "ขั้นตอนคืออะไร?" },
    options: [
      { value: "A", label: "กลืนยา แล้วดื่มน้ำ" },
      { value: "B", label: "ดื่มน้ำ แล้วกินอาหาร" },
      { value: "C", label: "นอน แล้วกินยา" },
    ],
    answer: { value: "A" },
  },
];

const reading: Q[] = [
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "王阿嬤每天三餐後都要吃藥。早餐後吃一顆,中午吃兩顆,晚上吃一顆。",
      question: "王阿嬤一天吃幾顆藥?",
    },
    options: [
      { value: "A", label: "三顆" },
      { value: "B", label: "四顆" },
      { value: "C", label: "五顆" },
    ],
    answer: { value: "B" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "李阿公的血壓比較高,所以餐點要少鹽,並且每天要量血壓兩次。",
      question: "李阿公每天量幾次血壓?",
    },
    options: [
      { value: "A", label: "一次" },
      { value: "B", label: "兩次" },
      { value: "C", label: "三次" },
    ],
    answer: { value: "B" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "張阿嬤行動不便,需要每兩小時翻一次身,避免褥瘡。",
      question: "張阿嬤需要做什麼?",
    },
    options: [
      { value: "A", label: "พลิกตัวทุก 2 ชั่วโมง" },
      { value: "B", label: "เดินทุก 2 ชั่วโมง" },
      { value: "C", label: "กินยาทุก 2 ชั่วโมง" },
    ],
    answer: { value: "A" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "陳阿公需要軟食,因為他的牙齒不好。每餐都要切碎或煮爛。",
      question: "陳阿公為什麼需要軟食?",
    },
    options: [
      { value: "A", label: "ฟันไม่ดี" },
      { value: "B", label: "ตาไม่ดี" },
      { value: "C", label: "หูไม่ดี" },
    ],
    answer: { value: "A" },
  },
  {
    section: "reading", type: "VOCAB_MCQ", score: 8,
    prompt: {
      passage: "黃阿嬤需要協助上廁所,因為她膝蓋無力。請小心扶她。",
      question: "黃阿嬤為什麼需要幫助?",
    },
    options: [
      { value: "A", label: "หัวไม่ดี" },
      { value: "B", label: "เข่าไม่มีแรง" },
      { value: "C", label: "มือไม่ดี" },
    ],
    answer: { value: "B" },
  },
];

const writing: Q[] = [
  {
    section: "writing", type: "VOCAB_MCQ", score: 10,
    prompt: { targetCharacter: "藥", instruction: "เขียนตัวอักษร 'ยา'" },
    answer: { value: "藥" },
  },
  {
    section: "writing", type: "VOCAB_MCQ", score: 10,
    prompt: { targetCharacter: "飯", instruction: "เขียนตัวอักษร 'ข้าว'" },
    answer: { value: "飯" },
  },
  {
    section: "writing", type: "VOCAB_MCQ", score: 10,
    prompt: { targetCharacter: "水", instruction: "เขียนตัวอักษร 'น้ำ'" },
    answer: { value: "水" },
  },
];

const ALL = [...listening, ...reading, ...writing];
const TOTAL = ALL.reduce((s, q) => s + q.score, 0);

async function main() {
  const code = "WEEKLY-W02-DAILYCARE";
  const exam = await db.mockExam.upsert({
    where: { code },
    create: {
      code,
      title: "第二週 · 日常照護週考",
      titleI18n: {
        en: "Week 2 · Daily Care Basics",
        th: "สัปดาห์ที่ 2 · การดูแลผู้สูงอายุประจำวัน",
      },
      description: "餵食 · 餵藥 · 換尿布 · 翻身 · 量血壓\nหูฟัง 5 / อ่าน 5 / เขียน 3 · 30 นาที",
      level: Level.A1_BEGINNER,
      type: ExamType.COMPREHENSIVE,
      totalQuestions: ALL.length,
      durationMin: 30,
      passingScore: Math.round(TOTAL * 0.6),
      maxScore: TOTAL,
      issueCertificate: false,
      isActive: true,
      isPublished: true,
    },
    update: {
      title: "第二週 · 日常照護週考",
      totalQuestions: ALL.length,
      maxScore: TOTAL,
      passingScore: Math.round(TOTAL * 0.6),
      isActive: true,
      isPublished: true,
    },
  });

  await db.examQuestion.deleteMany({ where: { examId: exam.id } });
  for (let i = 0; i < ALL.length; i++) {
    const q = ALL[i];
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
  console.log(`✅ ${code} — ${ALL.length} q, max ${TOTAL}, pass ${exam.passingScore}`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
