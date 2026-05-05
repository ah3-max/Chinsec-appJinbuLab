import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeeklyExamRunner, type WeeklyExam } from "@/components/learner/weekly-exam-runner";

export default async function WeeklyExamPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const exam = await db.mockExam.findUnique({
    where: { code },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });
  if (!exam || !exam.isPublished) notFound();

  const titleI18n = exam.titleI18n as Record<string, string> | null;
  const localizedTitle = titleI18n?.[locale] ?? exam.title;

  const examData: WeeklyExam = {
    id: exam.id,
    code: exam.code,
    title: localizedTitle,
    durationMin: exam.durationMin,
    passingScore: exam.passingScore,
    maxScore: exam.maxScore,
    questions: exam.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt as WeeklyExam["questions"][number]["prompt"],
      options: (q.options as { value: string; label: string }[]) ?? [],
      score: q.score,
    })),
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <Link
        href={`/${locale}/learn`}
        className="inline-flex items-center gap-1 text-sm transition-colors"
        style={{ color: "var(--aiai-gray-500)" }}
      >
        <ChevronLeft className="size-4" />
        กลับ
      </Link>

      <header className="space-y-0.5">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--aiai-green-600)" }}
        >
          每週考試 · WEEKLY EXAM
        </p>
        <h1 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          {localizedTitle}
        </h1>
        <p className="text-xs" style={{ color: "var(--aiai-gray-400)" }}>
          {exam.totalQuestions} 題 · {exam.durationMin} 分鐘 · 通過: {exam.passingScore}/{exam.maxScore}
        </p>
      </header>

      <WeeklyExamRunner exam={examData} />
    </div>
  );
}
