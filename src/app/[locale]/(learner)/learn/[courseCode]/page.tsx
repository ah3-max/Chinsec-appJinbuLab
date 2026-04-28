import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft, ShieldAlert, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/level";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; courseCode: string }>;
}) {
  const { locale, courseCode } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const tLevels = await getTranslations("levels");

  const course = await db.course.findUnique({
    where: { code: courseCode },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      level: true,
      vocabularyCount: true,
      estimatedHours: true,
      stages: {
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              code: true,
              title: true,
              type: true,
              estimatedMinutes: true,
              xpReward: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { currentLevel: true },
  });
  if (!me) redirect(`/${locale}/login`);

  if (!canAccess(me.currentLevel, course.level)) {
    redirect(`/${locale}/learn?error=locked`);
  }

  // Show Boss link only for the course at the user's exact current level
  // (i.e. they're ready to graduate this level).
  const showBoss = me.currentLevel === course.level;
  const tBoss = await getTranslations("learn.boss");

  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/learn`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        返回課程列表
      </Link>

      {/* Course header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl text-lg font-semibold"
            style={{
              background: "var(--aiai-green-400)",
              color: "#FFFFFF",
            }}
          >
            {course.code[0]}
          </div>
          <div className="min-w-0">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--aiai-gray-800)" }}
            >
              {course.title}
            </h1>
            <p
              className="mt-0.5 text-[11px]"
              style={{ color: "var(--aiai-gray-400)" }}
            >
              {tLevels(course.level)} · {course.vocabularyCount} 字
              {course.estimatedHours ? ` · ${course.estimatedHours}h` : ""}
            </p>
          </div>
        </div>
        {course.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--aiai-gray-600)" }}
          >
            {course.description}
          </p>
        )}
      </header>

      {/* Boss CTA — orange tone marks this as a special reward path */}
      {showBoss && (
        <Link
          href={`/${locale}/learn/boss/${course.code}`}
          className="block transition-all active:scale-[0.99]"
        >
          <article
            className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
            style={{ borderColor: "var(--aiai-orange-200)" }}
          >
            <div
              className="flex items-center gap-3 p-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--aiai-orange-50) 0%, #FFFFFF 100%)",
              }}
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{ background: "var(--aiai-orange-400)", color: "#FFFFFF" }}
              >
                <ShieldAlert className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[11px] font-semibold uppercase"
                  style={{ color: "var(--aiai-orange-600)", letterSpacing: "0.08em" }}
                >
                  BOSS
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--aiai-gray-800)" }}
                >
                  {tBoss("title")}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--aiai-gray-600)" }}
                >
                  {tBoss("ctaSubtitle")}
                </p>
              </div>
              <ChevronRight
                className="size-5 shrink-0"
                style={{ color: "var(--aiai-orange-600)" }}
              />
            </div>
          </article>
        </Link>
      )}

      {/* Stages */}
      <section className="space-y-2">
        {course.stages.length === 0 ? (
          <div
            className="rounded-xl border bg-white py-8 text-center text-sm"
            style={{
              borderColor: "var(--aiai-gray-200)",
              borderStyle: "dashed",
              color: "var(--aiai-gray-400)",
            }}
          >
            本課程尚無單元,敬請期待。
          </div>
        ) : (
          course.stages.map((stage) => (
            <article
              key={stage.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
              style={{ borderColor: "var(--aiai-green-100)" }}
            >
              <header
                className="border-b px-4 py-3"
                style={{ borderColor: "var(--aiai-green-100)" }}
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "var(--aiai-green-800)" }}
                >
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: "var(--aiai-green-600)" }}
                  >
                    {stage.code}
                  </span>
                  <span className="ml-2">{stage.title}</span>
                </h2>
                {stage.description && (
                  <p
                    className="mt-0.5 text-[11px]"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    {stage.description}
                  </p>
                )}
              </header>
              <div className="text-sm">
                {stage.lessons.length === 0 ? (
                  <p
                    className="px-4 py-3"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    尚無課時
                  </p>
                ) : (
                  <ul className="divide-y" style={{ borderColor: "var(--aiai-gray-200)" }}>
                    {stage.lessons.map((l) => (
                      <li key={l.id}>
                        <Link
                          href={`/${locale}/learn/${course.code}/lesson/${l.code}`}
                          className="flex items-center justify-between gap-2 px-4 py-2.5 transition-colors hover:bg-aiai-green-50"
                          style={{ color: "var(--aiai-gray-800)" }}
                        >
                          <span className="min-w-0">
                            <span
                              className="font-mono text-[10px]"
                              style={{ color: "var(--aiai-green-600)" }}
                            >
                              {l.code}
                            </span>
                            <span className="ml-2">{l.title}</span>
                          </span>
                          <span
                            className="flex shrink-0 items-center gap-1 text-[11px]"
                            style={{ color: "var(--aiai-gray-400)" }}
                          >
                            {l.estimatedMinutes}min · +{l.xpReward}XP
                            <ChevronRight className="size-3" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
