import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Level, type Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { detectSuspiciousSession } from "@/lib/anti-cheat";
import { computeNewStreak } from "@/lib/streak";
import { nextLevel } from "@/lib/level";

export const runtime = "nodejs";

const PROMOTION_PASS_SCORE = 80;

// Has the user passed every published exercise of every published lesson of
// every published course at this level? If so, they're ready to promote.
async function hasMasteredLevel(
  tx: Prisma.TransactionClient,
  userId: string,
  level: Level,
): Promise<boolean> {
  const courses = await tx.course.findMany({
    where: { level, isPublished: true },
    select: {
      id: true,
      stages: {
        select: {
          lessons: {
            where: { isPublished: true },
            select: {
              exercises: {
                where: { isActive: true },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  // No content at this level → nothing to verify, so don't auto-promote.
  if (courses.length === 0) return false;

  const exerciseIds = courses.flatMap((c) =>
    c.stages.flatMap((s) => s.lessons.flatMap((l) => l.exercises.map((e) => e.id))),
  );
  if (exerciseIds.length === 0) return false;

  // Find all exercises this user passed at the threshold.
  const passed = await tx.userAttempt.findMany({
    where: {
      userId,
      exerciseId: { in: exerciseIds },
      score: { gte: PROMOTION_PASS_SCORE },
    },
    distinct: ["exerciseId"],
    select: { exerciseId: true },
  });

  return passed.length === exerciseIds.length;
}

const schema = z.object({
  sessionKey: z.string().min(1).max(64),
  totalScore: z.number().int().min(0).max(100000),
  totalXp: z.number().int().min(0).max(100000),
  allCorrect: z.boolean(),
});

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
  const { sessionKey, totalXp } = parsed.data;

  // Pull the attempts for this session to run aggregate anti-cheat checks.
  const attempts = await db.userAttempt.findMany({
    where: { userId: session.user.id, sessionKey },
    select: {
      timeSpentSec: true,
      isCorrect: true,
      userAnswer: true,
      pasteDetected: true,
    },
    orderBy: { attemptedAt: "asc" },
  });

  const verdict = detectSuspiciousSession(attempts);
  // Suspicious sessions still count as "attempted" but earn 0 XP.
  const awardedXp = verdict.isSuspicious ? 0 : totalXp;
  const totalSec = attempts.reduce((s, a) => s + a.timeSpentSec, 0);
  const studyMinutesDelta = Math.floor(totalSec / 60);

  // Don't taint admin/learner stats while an admin is impersonating.
  if (session.user._impersonatedBy) {
    return NextResponse.json({
      ok: true,
      skipped: "impersonation",
      newTotalXp: 0,
      newStreak: 0,
      leveledUp: false,
      suspicious: verdict.isSuspicious,
      reasons: verdict.reasons,
    });
  }

  const result = await db.$transaction(async (tx) => {
    const me = await tx.user.findUnique({
      where: { id: session.user.id },
      select: {
        totalXp: true,
        weeklyXp: true,
        streakDays: true,
        lastStreakDate: true,
        totalStudyMin: true,
        currentLevel: true,
      },
    });
    if (!me) throw new Error("user not found");

    const streak = computeNewStreak(me.streakDays, me.lastStreakDate);

    // Promotion: check every published exercise at the user's current level
    // for a passing attempt. Skip when the session was flagged so cheaters
    // can't fast-track into the next level.
    let leveledUp = false;
    let promotedTo: Level | null = null;
    if (!verdict.isSuspicious) {
      const next = nextLevel(me.currentLevel);
      if (next && (await hasMasteredLevel(tx, session.user.id, me.currentLevel))) {
        leveledUp = true;
        promotedTo = next;
      }
    }

    const updated = await tx.user.update({
      where: { id: session.user.id },
      data: {
        totalXp: { increment: awardedXp },
        weeklyXp: { increment: awardedXp },
        streakDays: streak.newStreak,
        lastStreakDate: streak.newLastStreakDate,
        totalStudyMin: { increment: studyMinutesDelta },
        lastActiveAt: new Date(),
        ...(promotedTo ? { currentLevel: promotedTo } : {}),
      },
      select: { totalXp: true, streakDays: true, currentLevel: true },
    });

    return { ...updated, leveledUp, promotedTo };
  });

  return NextResponse.json({
    ok: true,
    newTotalXp: result.totalXp,
    newStreak: result.streakDays,
    leveledUp: result.leveledUp,
    newLevel: result.currentLevel,
    awardedXp,
    suspicious: verdict.isSuspicious,
    reasons: verdict.reasons,
  });
}
