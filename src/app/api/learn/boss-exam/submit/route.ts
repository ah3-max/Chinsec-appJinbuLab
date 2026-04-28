import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Level, type Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { nextLevel } from "@/lib/level";
import { clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const schema = z.object({
  examAttemptId: z.string().min(1),
  answers: z.array(
    z.object({
      exerciseId: z.string(),
      userAnswer: z.unknown(),
    }),
  ),
  windowBlurCount: z.number().int().min(0).max(1000).optional(),
});

interface QuestionSnap {
  exerciseId: string;
  orderIndex: number;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Block while impersonating to keep the learner's stats clean.
  if (session.user._impersonatedBy) {
    return NextResponse.json(
      { ok: true, skipped: "impersonation", passed: false },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { examAttemptId, answers, windowBlurCount } = parsed.data;

  const attempt = await db.examAttempt.findUnique({
    where: { id: examAttemptId },
    select: {
      id: true,
      userId: true,
      startedAt: true,
      finishedAt: true,
      questionSnapshot: true,
      exam: {
        select: {
          id: true,
          code: true,
          level: true,
          passingScore: true,
          maxScore: true,
          totalQuestions: true,
          issueCertificate: true,
        },
      },
    },
  });
  if (!attempt) {
    return NextResponse.json({ error: "attempt not found" }, { status: 404 });
  }
  if (attempt.userId !== session.user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (attempt.finishedAt) {
    return NextResponse.json(
      { error: "attempt already submitted" },
      { status: 400 },
    );
  }

  const snap = (attempt.questionSnapshot as unknown as QuestionSnap[]) ?? [];
  if (snap.length === 0) {
    return NextResponse.json({ error: "no questions in snapshot" }, { status: 500 });
  }

  // Hydrate the canonical answers from DB (don't trust client).
  const exercises = await db.exercise.findMany({
    where: { id: { in: snap.map((s) => s.exerciseId) } },
    select: { id: true, answer: true, type: true },
  });
  const exById = new Map(exercises.map((e) => [e.id, e]));
  const submitted = new Map(answers.map((a) => [a.exerciseId, a.userAnswer]));

  let correct = 0;
  const breakdown: Array<{ exerciseId: string; isCorrect: boolean }> = [];
  for (const s of snap) {
    const ex = exById.get(s.exerciseId);
    if (!ex) {
      breakdown.push({ exerciseId: s.exerciseId, isCorrect: false });
      continue;
    }
    const expected = (ex.answer as { value?: unknown } | null)?.value;
    const got = (submitted.get(s.exerciseId) as { value?: unknown } | undefined)?.value;
    const ok = expected !== undefined && expected === got;
    if (ok) correct++;
    breakdown.push({ exerciseId: s.exerciseId, isCorrect: ok });
  }

  const total = snap.length;
  const passed = correct >= attempt.exam.passingScore;
  const finishedAt = new Date();
  const durationSec = Math.max(
    0,
    Math.floor(
      (finishedAt.getTime() - attempt.startedAt.getTime()) / 1000,
    ),
  );

  // Promote currentLevel + issue certificate inside one transaction.
  let issuedCertificateId: string | null = null;
  let promotedTo: Level | null = null;

  await db.$transaction(async (tx) => {
    await tx.examAttempt.update({
      where: { id: attempt.id },
      data: {
        totalScore: correct,
        passed,
        finishedAt,
        durationSec,
        windowBlurCount: windowBlurCount ?? 0,
        answers: answers as unknown as Prisma.InputJsonValue,
      },
    });

    if (passed) {
      const me = await tx.user.findUnique({
        where: { id: attempt.userId },
        select: { fullName: true, currentLevel: true },
      });
      if (me) {
        const next = nextLevel(me.currentLevel);
        if (next && me.currentLevel === attempt.exam.level) {
          await tx.user.update({
            where: { id: attempt.userId },
            data: { currentLevel: next },
          });
          promotedTo = next;
        }

        if (attempt.exam.issueCertificate) {
          const cert = await tx.certificate.upsert({
            where: {
              userId_level: {
                userId: attempt.userId,
                level: attempt.exam.level,
              },
            },
            update: {
              examAttemptId: attempt.id,
              scoreSnapshot: correct,
              maxScoreSnapshot: total,
              fullNameSnapshot: me.fullName,
            },
            create: {
              userId: attempt.userId,
              level: attempt.exam.level,
              courseCode: attempt.exam.code.replace(/-BOSS$/, ""),
              examAttemptId: attempt.id,
              scoreSnapshot: correct,
              maxScoreSnapshot: total,
              fullNameSnapshot: me.fullName,
            },
            select: { id: true },
          });
          issuedCertificateId = cert.id;
        }
      }
    }
  });

  await audit({
    userId: attempt.userId,
    action: passed ? "BOSS_EXAM_PASS" : "BOSS_EXAM_FAIL",
    resource: "examAttempt",
    resourceId: attempt.id,
    after: {
      examCode: attempt.exam.code,
      score: correct,
      total,
      passed,
      promotedTo,
      certificateId: issuedCertificateId,
    },
    ipAddress: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({
    ok: true,
    passed,
    score: correct,
    total,
    durationSec,
    promotedTo,
    certificateId: issuedCertificateId,
    breakdown,
  });
}
