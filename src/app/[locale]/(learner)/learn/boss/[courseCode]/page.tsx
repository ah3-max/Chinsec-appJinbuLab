import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BossExamRunner } from "@/components/learner/boss-exam-runner";

export default async function BossExamPage({
  params,
}: {
  params: Promise<{ locale: string; courseCode: string }>;
}) {
  const { locale, courseCode } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  await getTranslations("learn.boss"); // ensure namespace exists at build

  const course = await db.course.findUnique({
    where: { code: courseCode },
    select: { id: true, code: true, title: true, level: true, isPublished: true },
  });
  if (!course || !course.isPublished) notFound();

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true, currentLevel: true },
  });
  if (!me) redirect(`/${locale}/login`);

  if (me.currentLevel !== course.level) {
    redirect(`/${locale}/learn?error=locked`);
  }

  return (
    <div className="space-y-4 px-4">
      <Link
        href={`/${locale}/learn/${course.code}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        返回課程
      </Link>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-amber-600">
          {course.code} BOSS
        </p>
        <h1 className="text-xl font-bold">{course.title}</h1>
      </header>

      <BossExamRunner
        courseCode={course.code}
        initialFullName={me.fullName}
      />
    </div>
  );
}
