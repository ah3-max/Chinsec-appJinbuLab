import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ExerciseType } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { detectSuspiciousAttempt } from "@/lib/anti-cheat";
import { clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const schema = z.object({
  exerciseId: z.string().optional(),
  exerciseType: z.nativeEnum(ExerciseType),
  sessionKey: z.string().min(1).max(64),
  questionData: z.unknown(),
  userAnswer: z.unknown(),
  isCorrect: z.boolean(),
  score: z.number().int().min(0).max(1000),
  timeSpentSec: z.number().int().min(0).max(60 * 30),
  hintUsed: z.boolean().optional(),
  windowBlurCount: z.number().int().min(0).max(1000).optional(),
  pasteDetected: z.boolean().optional(),
  device: z.string().max(32).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const verdict = detectSuspiciousAttempt({
    timeSpentSec: data.timeSpentSec,
    windowBlurCount: data.windowBlurCount,
    pasteDetected: data.pasteDetected,
  });

  const attempt = await db.userAttempt.create({
    data: {
      userId: session.user.id,
      exerciseId: data.exerciseId,
      exerciseType: data.exerciseType,
      sessionKey: data.sessionKey,
      exerciseSnapshot:
        data.questionData === undefined
          ? undefined
          : (data.questionData as never),
      userAnswer: data.userAnswer as never,
      isCorrect: data.isCorrect,
      score: data.score,
      timeSpentSec: data.timeSpentSec,
      hintUsed: data.hintUsed ?? false,
      windowBlurCount: data.windowBlurCount ?? 0,
      pasteDetected: data.pasteDetected ?? false,
      suspicious: verdict.isSuspicious,
      suspiciousReasons: verdict.reasons,
      device: data.device,
      ipAddress: clientIp(req),
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({
    ok: true,
    attemptId: attempt.id,
    suspicious: verdict.isSuspicious,
    reasons: verdict.reasons,
  });
}
