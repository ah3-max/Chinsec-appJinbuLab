import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { minio } from "@/lib/minio";
import { bumpMissionProgress } from "@/lib/daily-missions";

export const runtime = "nodejs";
export const maxDuration = 30;

type Section = "listening" | "reading" | "writing";

interface SubmitBody {
  answers: Record<string, { value?: string; imageDataUrl?: string }>;
  durationSec?: number;
}

const HANDWRITING_BUCKET =
  process.env.MINIO_BUCKET_HANDWRITING ?? "chinese-learn-handwriting";

async function ensureBucket() {
  const client = minio();
  try {
    const exists = await client.bucketExists(HANDWRITING_BUCKET);
    if (!exists) await client.makeBucket(HANDWRITING_BUCKET);
  } catch {
    /* ignore */
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  const { code } = await ctx.params;
  const body = (await req.json()) as SubmitBody;

  const exam = await db.mockExam.findUnique({
    where: { code },
    include: {
      questions: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!exam) {
    return NextResponse.json({ error: "exam not found" }, { status: 404 });
  }

  // ─── Score ────────────────────────────────────────────────────────────────
  let totalScore = 0;
  const breakdown: Record<Section, { correct: number; total: number; score: number }> = {
    listening: { correct: 0, total: 0, score: 0 },
    reading:   { correct: 0, total: 0, score: 0 },
    writing:   { correct: 0, total: 0, score: 0 },
  };

  await ensureBucket();
  const minioClient = minio();
  const handwritingUploads: Array<{ qId: string; objectKey: string }> = [];

  for (const q of exam.questions) {
    const prompt = q.prompt as { section: Section; targetCharacter?: string };
    const section = prompt.section;
    const userAnswer = body.answers[q.id];
    breakdown[section].total += 1;

    if (section === "writing") {
      // Persist handwriting image (best-effort, don't fail the submission on errors)
      if (userAnswer?.imageDataUrl?.startsWith("data:image/")) {
        try {
          const base64 = userAnswer.imageDataUrl.split(",")[1] ?? "";
          const buf = Buffer.from(base64, "base64");
          const objectKey = `weekly-exam/${userId}/${exam.code}/${q.id}.png`;
          await minioClient.putObject(
            HANDWRITING_BUCKET,
            objectKey,
            buf,
            buf.length,
            { "Content-Type": "image/png" },
          );
          handwritingUploads.push({ qId: q.id, objectKey });

          // Auto-grade: any non-empty submission counts as half-credit for now;
          // a future reviewer/teacher can mark the rest. This rewards effort.
          breakdown.writing.correct += 1;
          breakdown.writing.score += Math.round(q.score * 0.5);
          totalScore += Math.round(q.score * 0.5);
        } catch (err) {
          console.error("[weekly-exam] handwriting upload failed:", err);
        }
      }
      continue;
    }

    // Listening / reading: simple string compare against `answer.value`
    const correctValue = (q.answer as { value?: string }).value;
    if (userAnswer?.value && userAnswer.value === correctValue) {
      breakdown[section].correct += 1;
      breakdown[section].score += q.score;
      totalScore += q.score;
    }
  }

  // ─── Persist attempt ──────────────────────────────────────────────────────
  await db.examAttempt.create({
    data: {
      userId,
      examId: exam.id,
      answers: body.answers as object,
      totalScore,
      listeningScore: breakdown.listening.score,
      readingScore:   breakdown.reading.score,
      writingScore:   breakdown.writing.score,
      passed: totalScore >= exam.passingScore,
      startedAt: new Date(Date.now() - (body.durationSec ?? 0) * 1000),
      finishedAt: new Date(),
      durationSec: body.durationSec ?? null,
    },
  });

  // Update daily missions (best-effort)
  try {
    await bumpMissionProgress(userId, {
      earn_xp: totalScore,
      complete_lessons: 1, // Count weekly exam as one "lesson" for mission purposes
    });
  } catch (err) {
    console.error("[weekly-exam] mission bump failed:", err);
  }

  return NextResponse.json({
    totalScore,
    maxScore: exam.maxScore,
    passingScore: exam.passingScore,
    passed: totalScore >= exam.passingScore,
    breakdown,
    handwritingSavedCount: handwritingUploads.length,
  });
}
