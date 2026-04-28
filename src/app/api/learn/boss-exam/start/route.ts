import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const schema = z.object({
  courseCode: z.string().min(1).max(64),
});

const SAMPLE_SIZE = 50;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { courseCode } = parsed.data;

  // Course must be published, user's currentLevel must match the course level.
  const course = await db.course.findUnique({
    where: { code: courseCode },
    select: { id: true, level: true, isPublished: true },
  });
  if (!course || !course.isPublished) {
    return NextResponse.json({ error: "course not found" }, { status: 404 });
  }

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { currentLevel: true, fullName: true },
  });
  if (!me) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  if (me.currentLevel !== course.level) {
    return NextResponse.json(
      { error: "level mismatch", expected: course.level, actual: me.currentLevel },
      { status: 403 },
    );
  }

  // Resolve the matching MockExam (e.g. ZHUYIN-BOSS).
  const examCode = `${courseCode}-BOSS`;
  const exam = await db.mockExam.findUnique({
    where: { code: examCode },
    select: { id: true, totalQuestions: true, durationMin: true, passingScore: true, maxScore: true },
  });
  if (!exam) {
    return NextResponse.json({ error: "boss exam not configured" }, { status: 404 });
  }

  // Sample N exercises across this course's published lessons.
  const pool = await db.exercise.findMany({
    where: {
      isActive: true,
      lesson: {
        isPublished: true,
        stage: { course: { code: courseCode } },
      },
    },
    select: {
      id: true,
      type: true,
      prompt: true,
      options: true,
      answer: true,
      audioUrl: true,
      maxScore: true,
      difficulty: true,
    },
  });
  if (pool.length < Math.min(10, exam.totalQuestions)) {
    return NextResponse.json(
      { error: "not enough exercises in pool", pool: pool.length },
      { status: 500 },
    );
  }

  const sampled = sampleN(pool, Math.min(exam.totalQuestions, pool.length));

  const startedAt = new Date();
  const attempt = await db.examAttempt.create({
    data: {
      userId: session.user.id,
      examId: exam.id,
      startedAt,
      totalScore: 0,
      passed: false,
      answers: {},
      questionSnapshot: sampled.map((q, idx) => ({
        exerciseId: q.id,
        orderIndex: idx,
      })),
    },
    select: { id: true },
  });

  await audit({
    userId: session.user.id,
    action: "BOSS_EXAM_START",
    resource: "examAttempt",
    resourceId: attempt.id,
    after: { courseCode, examCode, sampleSize: sampled.length },
    ipAddress: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  // Strip the `answer` field from the questions sent to the client to prevent
  // the user from inspecting devtools to cheat.
  const questionsForClient = sampled.map((q, idx) => ({
    orderIndex: idx,
    exerciseId: q.id,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    audioUrl: q.audioUrl,
    difficulty: q.difficulty,
  }));

  return NextResponse.json({
    examAttemptId: attempt.id,
    durationMin: exam.durationMin,
    passingScore: exam.passingScore,
    maxScore: Math.min(exam.totalQuestions, pool.length),
    totalQuestions: questionsForClient.length,
    questions: questionsForClient,
  });
}

function sampleN<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a.slice(0, n);
}

void SAMPLE_SIZE;
