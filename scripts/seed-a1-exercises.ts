/**
 * Seed practice exercises (LISTEN_FILL + VOCAB_MCQ) for the A1 vocab lessons,
 * so users actually get a quiz after the vocab card intro.
 *
 * Adds exercises to:
 *   L1-S01-VOCAB (招呼用語)
 *   L1-S02-VOCAB (自我介紹)
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, ExerciseType } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface ExerciseSeed {
  type: ExerciseType;
  prompt: Record<string, unknown>;
  options: Array<{ value: string; label: string }>;
  answer: { value: string };
  maxScore?: number;
}

// ─── L1-S01 Greetings exercises ──────────────────────────────────────────────
const GREETINGS_EXERCISES: ExerciseSeed[] = [
  // VOCAB_MCQ — see hanzi, pick Thai meaning
  {
    type: "VOCAB_MCQ",
    prompt: { hanzi: "你好", pinyin: "Nǐ hǎo" },
    options: [
      { value: "A", label: "สวัสดี" },
      { value: "B", label: "ลาก่อน" },
      { value: "C", label: "ขอบคุณ" },
    ],
    answer: { value: "A" },
  },
  {
    type: "VOCAB_MCQ",
    prompt: { hanzi: "謝謝", pinyin: "Xièxie" },
    options: [
      { value: "A", label: "ขอโทษ" },
      { value: "B", label: "ขอบคุณ" },
      { value: "C", label: "ลาก่อน" },
    ],
    answer: { value: "B" },
  },
  {
    type: "VOCAB_MCQ",
    prompt: { hanzi: "再見", pinyin: "Zàijiàn" },
    options: [
      { value: "A", label: "สวัสดีตอนเช้า" },
      { value: "B", label: "ราตรีสวัสดิ์" },
      { value: "C", label: "ลาก่อน" },
    ],
    answer: { value: "C" },
  },
  // LISTEN_FILL — listen to sentence, fill missing word
  {
    type: "LISTEN_FILL",
    prompt: {
      audioText: "早安,阿公!",
      sentenceWithBlank: "___ ,阿公!",
      questionText: "เลือกคำที่หายไป",
    },
    options: [
      { value: "A", label: "早安" },
      { value: "B", label: "晚安" },
      { value: "C", label: "再見" },
    ],
    answer: { value: "A" },
  },
  {
    type: "LISTEN_FILL",
    prompt: {
      audioText: "謝謝你!",
      sentenceWithBlank: "___ 你!",
      questionText: "เลือกคำที่หายไป",
    },
    options: [
      { value: "A", label: "對不起" },
      { value: "B", label: "謝謝" },
      { value: "C", label: "你好" },
    ],
    answer: { value: "B" },
  },
];

// ─── L1-S02 Self-Introduction exercises ──────────────────────────────────────
const SELFINTRO_EXERCISES: ExerciseSeed[] = [
  {
    type: "VOCAB_MCQ",
    prompt: { hanzi: "我", pinyin: "Wǒ" },
    options: [
      { value: "A", label: "ฉัน" },
      { value: "B", label: "คุณ" },
      { value: "C", label: "เขา" },
    ],
    answer: { value: "A" },
  },
  {
    type: "VOCAB_MCQ",
    prompt: { hanzi: "名字", pinyin: "Míngzi" },
    options: [
      { value: "A", label: "อายุ" },
      { value: "B", label: "ชื่อ" },
      { value: "C", label: "บ้าน" },
    ],
    answer: { value: "B" },
  },
  {
    type: "VOCAB_MCQ",
    prompt: { hanzi: "泰國", pinyin: "Tàiguó" },
    options: [
      { value: "A", label: "ประเทศไทย" },
      { value: "B", label: "ประเทศจีน" },
      { value: "C", label: "ประเทศเวียดนาม" },
    ],
    answer: { value: "A" },
  },
  {
    type: "LISTEN_FILL",
    prompt: {
      audioText: "我叫小明。",
      sentenceWithBlank: "我 ___ 小明。",
      questionText: "เลือกคำที่หายไป",
    },
    options: [
      { value: "A", label: "是" },
      { value: "B", label: "叫" },
      { value: "C", label: "在" },
    ],
    answer: { value: "B" },
  },
  {
    type: "LISTEN_FILL",
    prompt: {
      audioText: "我是泰國人。",
      sentenceWithBlank: "我是 ___ 人。",
      questionText: "เลือกประเทศที่ได้ยิน",
    },
    options: [
      { value: "A", label: "泰國" },
      { value: "B", label: "越南" },
      { value: "C", label: "印尼" },
    ],
    answer: { value: "A" },
  },
];

async function seedForLesson(lessonCode: string, exercises: ExerciseSeed[]) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, title: true },
  });
  if (!lesson) {
    console.error(`  ❌ lesson ${lessonCode} not found`);
    return;
  }

  // Wipe existing exercises for idempotency
  await db.exercise.deleteMany({ where: { lessonId: lesson.id } });

  for (let i = 0; i < exercises.length; i++) {
    const e = exercises[i];
    await db.exercise.create({
      data: {
        lessonId: lesson.id,
        type: e.type,
        prompt: e.prompt as object,
        options: e.options as object,
        answer: e.answer as object,
        maxScore: e.maxScore ?? 10,
        orderIndex: i,
        isActive: true,
      },
    });
  }
  console.log(`  ✅ ${lessonCode} (${lesson.title}) — ${exercises.length} exercises`);
}

async function main() {
  console.log("=== Seeding A1 lesson exercises ===");
  await seedForLesson("L1-S01-VOCAB", GREETINGS_EXERCISES);
  await seedForLesson("L1-S02-VOCAB", SELFINTRO_EXERCISES);
  console.log("\n🎉 Done!");
  console.log("   Try at: /th/learn/A1/lesson/L1-S01-VOCAB");
  console.log("   Then:   /th/learn/A1/lesson/L1-S02-VOCAB");
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
