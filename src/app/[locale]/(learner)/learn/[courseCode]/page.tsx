import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft, ShieldAlert, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccess } from "@/lib/level";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      themeColor: true,
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
    <div className="space-y-4 px-4">
      <Link
        href={`/${locale}/learn`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        返回課程列表
      </Link>

      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{ backgroundColor: course.themeColor ?? "#3B82F6" }}
          >
            {course.code[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-xs text-muted-foreground">
              {tLevels(course.level)} ・ {course.vocabularyCount} 字
              {course.estimatedHours ? ` ・ ${course.estimatedHours}h` : ""}
            </p>
          </div>
        </div>
        {course.description && (
          <p className="text-sm text-muted-foreground">{course.description}</p>
        )}
      </header>

      {showBoss && (
        <Link
          href={`/${locale}/learn/boss/${course.code}`}
          className="block"
        >
          <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 transition-all active:scale-[0.99] hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                <ShieldAlert className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  BOSS
                </p>
                <p className="text-sm font-semibold">{tBoss("title")}</p>
                <p className="text-xs text-muted-foreground">
                  {tBoss("ctaSubtitle")}
                </p>
              </div>
              <ChevronRight className="size-5 text-amber-700" />
            </CardContent>
          </Card>
        </Link>
      )}

      <section className="space-y-3">
        {course.stages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              本課程尚無單元，敬請期待。
            </CardContent>
          </Card>
        ) : (
          course.stages.map((stage) => (
            <Card key={stage.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {stage.code} ・ {stage.title}
                </CardTitle>
                {stage.description && (
                  <p className="text-xs text-muted-foreground">
                    {stage.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="text-sm">
                {stage.lessons.length === 0 ? (
                  <p className="text-muted-foreground">尚無課時</p>
                ) : (
                  <ul className="divide-y">
                    {stage.lessons.map((l) => (
                      <li
                        key={l.id}
                        className="flex items-center justify-between py-2"
                      >
                        <span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {l.code}
                          </span>
                          <span className="ml-2">{l.title}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {l.estimatedMinutes}min ・ +{l.xpReward}XP
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
