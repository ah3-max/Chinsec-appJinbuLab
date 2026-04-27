import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomeworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");

  const session = await auth();
  const submissions = session?.user?.id
    ? await db.submission.findMany({
        where: { userId: session.user.id, submittedAt: { not: null } },
        orderBy: { submittedAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          submittedAt: true,
          aiScore: true,
          teacherScore: true,
          homework: { select: { title: true, dueDate: true } },
        },
      })
    : [];

  return (
    <div className="space-y-4 px-4">
      <h1 className="text-2xl font-bold">{tNav("homework")}</h1>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            目前沒有作業
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.homework.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.submittedAt?.toLocaleString(locale) ?? "—"}
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                    {s.status}
                  </span>
                </div>
                {(s.teacherScore ?? s.aiScore) !== null && (
                  <div className="mt-2 text-sm">
                    分數：{s.teacherScore ?? s.aiScore}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
