/**
 * Generate practice exercises for every AAY-FINANCE vocabulary lesson.
 *
 * For each lesson, builds:
 *   - VOCAB_MCQ for every vocab item (cap 6/lesson) — distractors drawn from
 *     the same lesson's other words to keep them relevant
 *   - LISTEN_FILL for any vocab item that has an entry in
 *     src/content/aay-finance-examples.json
 *
 * Idempotent — wipes & re-seeds each lesson's exercises.
 *
 * Run:  npx tsx scripts/seed-finance-exercises.ts
 *       npx tsx scripts/seed-finance-exercises.ts --lesson F01-ORG-VOCAB
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

const EXAMPLES_FILE = path.resolve(
  process.cwd(),
  "src/content/aay-finance-examples.json",
);
const EXAMPLES = (fs.existsSync(EXAMPLES_FILE)
  ? JSON.parse(fs.readFileSync(EXAMPLES_FILE, "utf-8"))
  : {}) as Record<
  string,
  { sentence: string; sentencePinyin: string; sentenceTh: string }
>;

const VOCAB_MCQ_PER_LESSON = 6; // cap so lessons aren't endless
const MAX_LISTEN_FILL_PER_LESSON = 3;

interface VocabItem {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  note?: string;
}

interface ExerciseSeed {
  type: ExerciseType;
  prompt: Record<string, unknown>;
  options: Array<{ value: string; label: string }>;
  answer: { value: string };
  maxScore: number;
}

function pickThaiTranslation(item: VocabItem): string | null {
  const t = item.translations;
  if (!t) return null;
  return t.th ?? t.en ?? null;
}

function pickN<T>(arr: T[], n: number, exclude: T[] = []): T[] {
  const pool = arr.filter((x) => !exclude.includes(x));
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

/** Build a VOCAB_MCQ — show hanzi, ask user to pick the Thai translation. */
function makeVocabMcq(target: VocabItem, allItems: VocabItem[]): ExerciseSeed | null {
  const correct = pickThaiTranslation(target);
  if (!correct) return null;

  const distractorPool = allItems
    .filter((i) => i.hanzi !== target.hanzi)
    .map((i) => pickThaiTranslation(i))
    .filter((t): t is string => !!t && t !== correct);

  // Need at least 2 distinct distractors to make a 3-option MCQ
  const uniqueDistractors = Array.from(new Set(distractorPool));
  if (uniqueDistractors.length < 2) return null;

  const distractors = pickN(uniqueDistractors, 2);
  const opts = [correct, ...distractors];
  // Shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const correctIdx = opts.indexOf(correct);
  const labels = ["A", "B", "C"];

  return {
    type: "VOCAB_MCQ",
    prompt: { hanzi: target.hanzi, pinyin: target.pinyin },
    options: opts.map((label, i) => ({ value: labels[i], label })),
    answer: { value: labels[correctIdx] },
    maxScore: 10,
  };
}

/** Build a LISTEN_FILL using the JSON example sentence. */
function makeListenFill(target: VocabItem, allItems: VocabItem[]): ExerciseSeed | null {
  const example = EXAMPLES[target.hanzi];
  if (!example) return null;

  // Build sentence with the target hanzi replaced by ___ (use first occurrence only)
  const blanked = example.sentence.replace(target.hanzi, "___");
  if (blanked === example.sentence) return null; // target not in sentence — skip

  // Distractors = other hanzi from the same lesson
  const distractorPool = allItems
    .filter((i) => i.hanzi !== target.hanzi)
    .map((i) => i.hanzi);
  if (distractorPool.length < 2) return null;
  const distractors = pickN(distractorPool, 2);

  const opts = [target.hanzi, ...distractors];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const correctIdx = opts.indexOf(target.hanzi);
  const labels = ["A", "B", "C"];

  return {
    type: "LISTEN_FILL",
    prompt: {
      audioText: example.sentence,
      sentenceWithBlank: blanked,
      questionText: "เลือกคำที่หายไป",
    },
    options: opts.map((label, i) => ({ value: labels[i], label })),
    answer: { value: labels[correctIdx] },
    maxScore: 12,
  };
}

async function seedLesson(lessonCode: string) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, title: true, content: true },
  });
  if (!lesson) {
    console.log(`  ⏭  ${lessonCode}: not found, skipping`);
    return { exerciseCount: 0 };
  }

  const content = lesson.content as { type?: string; items?: VocabItem[] } | null;
  if (!content || content.type !== "vocabulary-list" || !content.items?.length) {
    console.log(`  ⏭  ${lessonCode}: no vocabulary-list content, skipping`);
    return { exerciseCount: 0 };
  }

  const items = content.items;
  const exercises: ExerciseSeed[] = [];

  // Cap MCQs
  const mcqTargets = items.slice(0, VOCAB_MCQ_PER_LESSON);
  for (const t of mcqTargets) {
    const ex = makeVocabMcq(t, items);
    if (ex) exercises.push(ex);
  }

  // Add LISTEN_FILL for items that have example sentences (capped)
  const fillCandidates = items.filter((i) => EXAMPLES[i.hanzi]).slice(0, MAX_LISTEN_FILL_PER_LESSON);
  for (const t of fillCandidates) {
    const ex = makeListenFill(t, items);
    if (ex) exercises.push(ex);
  }

  if (exercises.length === 0) {
    console.log(`  ⏭  ${lessonCode}: no exercises buildable`);
    return { exerciseCount: 0 };
  }

  // Idempotent: wipe + re-seed
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
        maxScore: e.maxScore,
        orderIndex: i,
        isActive: true,
      },
    });
  }

  const fillCount = exercises.filter((e) => e.type === "LISTEN_FILL").length;
  const mcqCount = exercises.length - fillCount;
  console.log(
    `  ✅ ${lessonCode} (${lesson.title}) — ${exercises.length} exercises (${mcqCount} MCQ, ${fillCount} listen-fill)`,
  );
  return { exerciseCount: exercises.length };
}

async function main() {
  const args = process.argv.slice(2);
  const lessonArg = args.find((a) => a.startsWith("--lesson="))?.split("=")[1]
    ?? (args.includes("--lesson") ? args[args.indexOf("--lesson") + 1] : undefined);

  console.log(`📖 Examples available for ${Object.keys(EXAMPLES).length} hanzi\n`);

  let lessonCodes: string[];
  if (lessonArg) {
    lessonCodes = [lessonArg];
  } else {
    const lessons = await db.lesson.findMany({
      where: {
        stage: { course: { code: "AAY-FINANCE" } },
        type: "VOCAB",
      },
      orderBy: [{ stage: { orderIndex: "asc" } }, { orderIndex: "asc" }],
      select: { code: true },
    });
    lessonCodes = lessons.map((l) => l.code);
  }

  console.log(`=== Seeding exercises for ${lessonCodes.length} lessons ===`);
  let totalExercises = 0;
  for (const code of lessonCodes) {
    const r = await seedLesson(code);
    totalExercises += r.exerciseCount;
  }
  console.log(`\n🎉 Done — ${totalExercises} exercises seeded across ${lessonCodes.length} lessons`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
