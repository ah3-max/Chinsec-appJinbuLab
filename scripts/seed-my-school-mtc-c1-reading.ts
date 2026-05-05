/**
 * Seed Chapter 1 Reading lesson — structure + 5 comprehension questions.
 *
 * Creates lesson MS-C1-READING under stage MS-C1 with:
 *   - empty paragraphs[] (you paste your textbook reading text via direct DB
 *     or admin UI — keeps copyrighted publisher text out of source code)
 *   - 5 multiple-choice comprehension questions (written here, not from the
 *     textbook — they test understanding of the 何雅婷要轉系 storyline)
 *
 * To populate the reading text after running this script:
 *   docker exec -it chinese-learn-postgres psql -U chinese_learn -d chinese_learn
 *   UPDATE lessons SET content = '{"type":"reading-passage","title":"...","paragraphs":[{"cn":"...","tr":"..."}, ...]}' WHERE code = 'MS-C1-READING';
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

interface QSeed {
  question: string;
  correct: string;
  distractors: [string, string];
}

// ─── Comprehension questions (testing the storyline, originally written) ─────
// These probe understanding of the story-arc the reading covers; the question
// stems and option labels are written here, not lifted from the textbook.
const QUESTIONS: QSeed[] = [
  {
    question: "何雅婷在家裡的身份是什麼? / เหอหยาถิงเป็นอะไรในบ้าน?",
    correct: "獨生女 (ลูกสาวคนเดียว)",
    distractors: ["大姊 (พี่สาวคนโต)", "小妹 (น้องสาวคนเล็ก)"],
  },
  {
    question: "她原本念的是什麼系? / เธอเดิมเรียนคณะอะไร?",
    correct: "會計系 (บัญชี)",
    distractors: ["國際關係系 (ความสัมพันธ์ระหว่างประเทศ)", "外語系 (ภาษาต่างประเทศ)"],
  },
  {
    question: "媽媽聽到她要轉系時的反應? / แม่ตอบสนองอย่างไรเมื่อรู้ว่าจะย้ายสาขา?",
    correct: "反對 (คัดค้าน)",
    distractors: ["同意 (เห็นด้วย)", "高興 (ดีใจ)"],
  },
  {
    question: "何雅婷說自己什麼能力不錯? / เหอหยาถิงบอกว่าเธอเก่งด้านอะไร?",
    correct: "外語能力 (ภาษาต่างประเทศ)",
    distractors: ["數學能力 (คณิตศาสตร์)", "電腦能力 (คอมพิวเตอร์)"],
  },
  {
    question: "她最後請教授幫她寫什麼? / สุดท้ายเธอขอให้อาจารย์เขียนอะไรให้?",
    correct: "推薦信 (จดหมายแนะนำ)",
    distractors: ["成績單 (ใบเกรด)", "申請書 (ใบสมัคร)"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

async function main() {
  console.log("=== Seeding MS-C1 Reading lesson ===\n");

  const stage = await db.stage.findFirst({
    where: { course: { code: "MY-SCHOOL" }, code: "MS-C1" },
    select: { id: true },
  });
  if (!stage) {
    console.error("❌ MS-C1 stage not found — run seed-my-school-mtc-c1.ts first");
    process.exit(1);
  }

  // Empty paragraphs — populate via DB or admin UI with your uploaded PDF text
  const lesson = await db.lesson.upsert({
    where: { stageId_code: { stageId: stage.id, code: "MS-C1-READING" } },
    create: {
      stageId: stage.id,
      code: "MS-C1-READING",
      title: "短文 · 何雅婷要轉系",
      titleI18n: { en: "Reading · He Yating's Major Transfer", th: "บทอ่าน · เหอหยาถิงจะย้ายสาขา" },
      description: "อ่านเรื่องราวของเหอหยาถิง + ตอบคำถาม 5 ข้อ",
      type: "VOCAB",
      difficulty: 3,
      orderIndex: 2,
      estimatedMinutes: 15,
      xpReward: 60,
      isPublished: true,
      content: {
        type: "reading-passage",
        title: "何雅婷要轉系",
        titleTr: "เหอหยาถิงจะย้ายสาขา",
        // Populate with your textbook PDF content via direct DB update —
        // the structure expects: [{ cn: "...", tr: "..." }, ...]
        paragraphs: [],
      },
    },
    update: {
      title: "短文 · 何雅婷要轉系",
      titleI18n: { en: "Reading · He Yating's Major Transfer", th: "บทอ่าน · เหอหยาถิงจะย้ายสาขา" },
      description: "อ่านเรื่องราวของเหอหยาถิง + ตอบคำถาม 5 ข้อ",
      isPublished: true,
      // Don't overwrite paragraphs on update so manual edits via DB persist
    },
  });

  // Wipe old comprehension questions and rebuild
  await db.exercise.deleteMany({ where: { lessonId: lesson.id } });

  const labels = ["A", "B", "C"];
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]!;
    const opts = shuffle([q.correct, ...q.distractors]);
    const correctIdx = opts.indexOf(q.correct);
    await db.exercise.create({
      data: {
        lessonId: lesson.id,
        type: "VOCAB_MCQ",
        prompt: { question: q.question },
        options: opts.map((label, idx) => ({ value: labels[idx], label })),
        answer: { value: labels[correctIdx] },
        maxScore: 12,
        orderIndex: i,
        isActive: true,
      },
    });
  }

  console.log(`✅ MS-C1-READING created with ${QUESTIONS.length} comprehension MCQs`);
  console.log(`📝 Reading paragraphs intentionally left empty.`);
  console.log(`   To add your textbook reading, run:`);
  console.log(`   ─────────────────────────────────────`);
  console.log(`   docker exec -i chinese-learn-postgres psql -U chinese_learn -d chinese_learn <<'SQL'`);
  console.log(`   UPDATE lessons SET content = jsonb_set(`);
  console.log(`     content::jsonb, '{paragraphs}',`);
  console.log(`     '[{"cn":"<paragraph 1 chinese>","tr":"<paragraph 1 thai>"}, ...]'::jsonb)`);
  console.log(`   WHERE code = 'MS-C1-READING';`);
  console.log(`   SQL`);
  console.log(`   ─────────────────────────────────────`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
