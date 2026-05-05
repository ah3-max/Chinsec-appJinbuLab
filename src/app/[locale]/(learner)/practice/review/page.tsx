import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, RefreshCcw } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RandomQuiz, type QuizQuestion } from "@/components/learner/random-quiz";

const DECK_SIZE = 10;
const LOOKBACK_DAYS = 30;

interface PromptShape {
  hanzi?: string;
  pinyin?: string;
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const since = new Date();
  since.setDate(since.getDate() - LOOKBACK_DAYS);

  // Pull the user's recent wrong attempts; group by exercise so we don't
  // double-show the same question. Sort by most recently missed first.
  const wrongAttempts = await db.userAttempt.findMany({
    where: {
      userId: session.user.id,
      isCorrect: false,
      attemptedAt: { gte: since },
      exerciseId: { not: null },
    },
    distinct: ["exerciseId"],
    orderBy: { attemptedAt: "desc" },
    select: { exerciseId: true, attemptedAt: true },
    take: 50,
  });

  const exerciseIds = wrongAttempts
    .map((a) => a.exerciseId)
    .filter((id): id is string => !!id);

  if (exerciseIds.length === 0) {
    return <EmptyDeck locale={locale} />;
  }

  // Fetch the actual exercises (only VOCAB_MCQ + LISTEN_FILL are easy to render here)
  const exercises = await db.exercise.findMany({
    where: {
      id: { in: exerciseIds },
      isActive: true,
      type: { in: ["VOCAB_MCQ", "LISTEN_FILL"] },
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

  // Preserve the recent-miss ordering, then take top N
  const order = new Map(exerciseIds.map((id, i) => [id, i]));
  const sorted = exercises
    .slice()
    .sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999))
    .slice(0, DECK_SIZE);

  if (sorted.length === 0) {
    return <EmptyDeck locale={locale} />;
  }

  const questions: QuizQuestion[] = sorted.map((e) => ({
    id: e.id,
    type: e.type,
    prompt: e.prompt as QuizQuestion["prompt"],
    options: (e.options as QuizQuestion["options"]) ?? [],
    answer: e.answer as QuizQuestion["answer"],
    maxScore: e.maxScore,
  }));

  // Surface preview of which words are in the deck
  const previewHanzi = sorted
    .map((e) => (e.prompt as PromptShape)?.hanzi)
    .filter((h): h is string => !!h)
    .slice(0, 8);

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
          style={{ color: "#fb923c" }}
        >
          <RefreshCcw className="mr-1 inline size-3" />
          ทบทวนคำที่เคยผิด · SRS REVIEW
        </p>
        <h1 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          {questions.length} คำที่ต้องทบทวน
        </h1>
        <p className="text-xs" style={{ color: "var(--aiai-gray-400)" }}>
          ดึงจากคำที่เคยตอบผิดใน {LOOKBACK_DAYS} วันที่ผ่านมา
        </p>
        {previewHanzi.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {previewHanzi.map((h) => (
              <span
                key={h}
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  background: "#fff7ed",
                  color: "#c2410c",
                  border: "1px solid #fed7aa",
                }}
              >
                {h}
              </span>
            ))}
          </div>
        )}
      </header>

      <RandomQuiz questions={questions} />
    </div>
  );
}

function EmptyDeck({ locale }: { locale: string }) {
  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/practice`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        返回
      </Link>
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="text-6xl">🌟</div>
        <h2 className="text-lg font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          ยังไม่มีคำที่ต้องทบทวน
        </h2>
        <p className="max-w-sm text-sm" style={{ color: "var(--aiai-gray-500)" }}>
          คุณยังไม่เคยตอบผิดใน {LOOKBACK_DAYS} วันที่ผ่านมา หรือยังไม่ได้เริ่มเรียน — ทำแบบฝึกหัดก่อนแล้วค่อยกลับมาทบทวนนะ
        </p>
        <Link
          href={`/${locale}/practice/random`}
          className="mt-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
          style={{ background: "var(--aiai-green-400)" }}
        >
          ทำแบบสุ่ม 10 ข้อ →
        </Link>
      </div>
    </div>
  );
}
