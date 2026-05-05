import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, Shuffle } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RandomQuiz, type QuizQuestion } from "@/components/learner/random-quiz";

const QUIZ_SIZE = 10;

export default async function RandomQuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  // Pull all candidate exercises across published lessons. Postgres `random()`
  // ordering is fine at this size — the active pool is in the low hundreds.
  const allExercises = await db.exercise.findMany({
    where: {
      isActive: true,
      type: { in: ["VOCAB_MCQ", "LISTEN_FILL"] },
      lesson: { isPublished: true },
    },
    select: {
      id: true,
      type: true,
      prompt: true,
      options: true,
      answer: true,
      maxScore: true,
    },
  });

  // Shuffle and slice
  const shuffled = [...allExercises];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = tmp;
  }
  const picked = shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length));

  const questions: QuizQuestion[] = picked
    .filter((e): e is NonNullable<typeof e> => !!e)
    .map((e) => ({
      id: e.id,
      type: e.type,
      prompt: (e.prompt as Prisma.JsonValue as QuizQuestion["prompt"]) ?? {},
      options: (e.options as Prisma.JsonValue as QuizQuestion["options"]) ?? [],
      answer: (e.answer as Prisma.JsonValue as QuizQuestion["answer"]) ?? { value: null },
      maxScore: e.maxScore,
    }));

  return (
    <div className="space-y-3 px-4 pb-4">
      <Link
        href={`/${locale}/practice`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        返回
      </Link>

      <header className="space-y-0.5">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--aiai-green-600)" }}
        >
          <Shuffle className="mr-1 inline size-3" />
          隨機練習 · RANDOM QUIZ
        </p>
        <h1 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          {questions.length} 題隨機題目
        </h1>
        <p className="text-xs" style={{ color: "var(--aiai-gray-400)" }}>
          จากทุกคอร์ส · มี 3 หัวใจ · ตอบถูกได้ XP
        </p>
      </header>

      {questions.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed p-6 text-center text-sm"
          style={{ color: "var(--aiai-gray-400)" }}
        >
          ยังไม่มีคำถามให้สุ่ม กรุณาเรียนบทเรียนก่อน
        </div>
      ) : (
        <RandomQuiz questions={questions} />
      )}
    </div>
  );
}
