/**
 * scripts/test-zhuyin-flow.ts
 *
 * Programmatic walkthrough of the Zhuyin learning flow for testlearner_th:
 *
 *   1. Reset testlearner_th to a clean ZHUYIN state (no certificate, no
 *      prior exam attempts, no bumped level).
 *   2. Verify: course/stages/lessons/exercises seed integrity.
 *   3. Simulate Boss exam:
 *        a) sample 50 exercises like the API does
 *        b) build a perfect-score answer set straight from DB
 *        c) call the same scoring logic the submit endpoint uses
 *        d) write Certificate + bump currentLevel
 *   4. Read it all back and assert:
 *        currentLevel == A1_BEGINNER
 *        1 Certificate row
 *        Audit trail lines up
 *
 * Run:  npx tsx scripts/test-zhuyin-flow.ts
 */

import { PrismaClient, Level, type Prisma } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

interface QuestionSnap {
  exerciseId: string;
  orderIndex: number;
}

function fail(msg: string): never {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function pass(msg: string) {
  console.log(`✓ ${msg}`);
}

async function main() {
  console.log("🧪 Zhuyin walkthrough — testlearner_th\n");

  // ── 1. Reset state ────────────────────────────────────────────────
  const learner = await prisma.user.findUnique({
    where: { username: "testlearner_th" },
    select: { id: true, fullName: true, currentLevel: true },
  });
  if (!learner) fail("testlearner_th not found — run npm run db:seed first");

  await prisma.certificate.deleteMany({ where: { userId: learner.id } });
  await prisma.examAttempt.deleteMany({ where: { userId: learner.id } });
  await prisma.userAttempt.deleteMany({ where: { userId: learner.id } });
  await prisma.user.update({
    where: { id: learner.id },
    data: { currentLevel: Level.ZHUYIN, totalXp: 0, streakDays: 0, lastStreakDate: null },
  });
  pass("Reset learner to clean ZHUYIN state");

  // ── 2. Seed integrity ─────────────────────────────────────────────
  const course = await prisma.course.findUnique({
    where: { code: "ZHUYIN" },
    select: {
      id: true,
      level: true,
      stages: {
        select: { id: true, code: true, lessons: { select: { id: true } } },
      },
    },
  });
  if (!course) fail("ZHUYIN course missing");
  if (course.stages.length !== 9)
    fail(`expected 9 stages, got ${course.stages.length}`);
  pass(`9 stages found: ${course.stages.map((s) => s.code).join(", ")}`);

  const totalLessons = course.stages.reduce(
    (s, st) => s + st.lessons.length,
    0,
  );
  if (totalLessons < 24)
    fail(`expected ≥24 lessons, got ${totalLessons}`);
  pass(`${totalLessons} lessons across stages`);

  const exercisesByType = await prisma.exercise.groupBy({
    by: ["type"],
    where: {
      lesson: { stage: { courseId: course.id }, isPublished: true },
      isActive: true,
    },
    _count: true,
  });
  const totalExercises = exercisesByType.reduce(
    (s, r) => s + r._count,
    0,
  );
  if (totalExercises < 100)
    fail(`expected ≥100 exercises, got ${totalExercises}`);
  pass(
    `${totalExercises} exercises (${exercisesByType
      .map((r) => `${r.type}=${r._count}`)
      .join(", ")})`,
  );

  // ── 3. Boss exam ──────────────────────────────────────────────────
  const exam = await prisma.mockExam.findUnique({
    where: { code: "ZHUYIN-BOSS" },
    select: {
      id: true,
      level: true,
      passingScore: true,
      maxScore: true,
      totalQuestions: true,
      issueCertificate: true,
    },
  });
  if (!exam) fail("ZHUYIN-BOSS exam missing");
  pass(
    `Exam config: ${exam.totalQuestions} q, pass at ${exam.passingScore}, certs ${exam.issueCertificate}`,
  );

  // Sample 50 like the start endpoint
  const pool = await prisma.exercise.findMany({
    where: {
      isActive: true,
      lesson: { isPublished: true, stage: { courseId: course.id } },
    },
    select: { id: true, answer: true },
  });
  const sampled = sampleN(pool, Math.min(exam.totalQuestions, pool.length));
  pass(`Sampled ${sampled.length} questions for the attempt`);

  const startedAt = new Date();
  const attempt = await prisma.examAttempt.create({
    data: {
      userId: learner.id,
      examId: exam.id,
      startedAt,
      totalScore: 0,
      passed: false,
      answers: {},
      questionSnapshot: sampled.map((q, i) => ({
        exerciseId: q.id,
        orderIndex: i,
      })),
    },
    select: { id: true, questionSnapshot: true },
  });

  // Build perfect answers from DB truth
  const perfectAnswers = sampled.map((s) => ({
    exerciseId: s.id,
    userAnswer: { value: (s.answer as { value?: unknown } | null)?.value },
  }));

  // Run scoring logic (same as submit endpoint)
  const snap = (attempt.questionSnapshot as unknown as QuestionSnap[]) ?? [];
  const exById = new Map(sampled.map((e) => [e.id, e]));
  const submitted = new Map(perfectAnswers.map((a) => [a.exerciseId, a.userAnswer]));
  let correct = 0;
  for (const s of snap) {
    const ex = exById.get(s.exerciseId);
    if (!ex) continue;
    const expected = (ex.answer as { value?: unknown } | null)?.value;
    const got = (submitted.get(s.exerciseId) as { value?: unknown } | undefined)?.value;
    if (expected !== undefined && expected === got) correct++;
  }
  const passed = correct >= exam.passingScore;
  const finishedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.examAttempt.update({
      where: { id: attempt.id },
      data: {
        totalScore: correct,
        passed,
        finishedAt,
        durationSec: 5,
        answers: perfectAnswers as unknown as Prisma.InputJsonValue,
      },
    });
    if (passed) {
      const next = nextLevel(exam.level);
      if (next) {
        await tx.user.update({
          where: { id: learner.id },
          data: { currentLevel: next },
        });
      }
      await tx.certificate.upsert({
        where: { userId_level: { userId: learner.id, level: exam.level } },
        update: {
          examAttemptId: attempt.id,
          scoreSnapshot: correct,
          maxScoreSnapshot: snap.length,
        },
        create: {
          userId: learner.id,
          level: exam.level,
          courseCode: "ZHUYIN",
          examAttemptId: attempt.id,
          fullNameSnapshot: learner.fullName,
          scoreSnapshot: correct,
          maxScoreSnapshot: snap.length,
        },
      });
    }
  });

  pass(`Scored ${correct}/${snap.length} — ${passed ? "PASS" : "FAIL"}`);
  if (!passed) fail("perfect-answer attempt did not pass — scoring is broken");

  // ── 4. Read-back assertions ───────────────────────────────────────
  const after = await prisma.user.findUnique({
    where: { id: learner.id },
    select: {
      currentLevel: true,
      certificates: {
        select: {
          level: true,
          scoreSnapshot: true,
          maxScoreSnapshot: true,
          fullNameSnapshot: true,
        },
      },
    },
  });
  if (!after) fail("learner disappeared??");
  if (after.currentLevel !== Level.A1_BEGINNER)
    fail(`expected currentLevel A1_BEGINNER, got ${after.currentLevel}`);
  pass("currentLevel promoted to A1_BEGINNER");

  if (after.certificates.length !== 1)
    fail(`expected 1 certificate, got ${after.certificates.length}`);
  pass(
    `Certificate issued: ${after.certificates[0]!.fullNameSnapshot} ${after.certificates[0]!.scoreSnapshot}/${after.certificates[0]!.maxScoreSnapshot}`,
  );

  console.log("\n🎉 All assertions passed.");
}

function sampleN<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a.slice(0, n);
}

function nextLevel(l: Level): Level | null {
  const order = [
    Level.ZHUYIN,
    Level.A1_BEGINNER,
    Level.A2_BASIC,
    Level.B1_INTERMEDIATE,
    Level.B2_UPPER_INTER,
    Level.C1_ADVANCED,
    Level.C2_PROFICIENT,
  ];
  const idx = order.indexOf(l);
  return idx >= 0 && idx + 1 < order.length ? order[idx + 1]! : null;
}

main()
  .catch((e) => {
    console.error("❌", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
