import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { detectSuspiciousSession } from "@/lib/anti-cheat";
import { computeNewStreak } from "@/lib/streak";

export const runtime = "nodejs";

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
      },
    });
    if (!me) throw new Error("user not found");

    const streak = computeNewStreak(me.streakDays, me.lastStreakDate);

    const updated = await tx.user.update({
      where: { id: session.user.id },
      data: {
        totalXp: { increment: awardedXp },
        weeklyXp: { increment: awardedXp },
        streakDays: streak.newStreak,
        lastStreakDate: streak.newLastStreakDate,
        totalStudyMin: { increment: studyMinutesDelta },
        lastActiveAt: new Date(),
      },
      select: { totalXp: true, streakDays: true },
    });

    return updated;
  });

  return NextResponse.json({
    ok: true,
    newTotalXp: result.totalXp,
    newStreak: result.streakDays,
    leveledUp: false, // populated by Task 4
    awardedXp,
    suspicious: verdict.isSuspicious,
    reasons: verdict.reasons,
  });
}
