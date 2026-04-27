import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      username: true,
      email: true,
      role: true,
      nationality: true,
      currentLevel: true,
      totalXp: true,
      streakDays: true,
      totalStudyMin: true,
      facility: { select: { name: true, shortName: true } },
    },
  });

  const tNav = await getTranslations("nav");
  const tLevels = await getTranslations("levels");

  if (!me) redirect(`/${locale}/login`);

  return (
    <div className="space-y-4 px-4">
      <h1 className="text-2xl font-bold">{tNav("profile")}</h1>

      {/* 基本資料 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {me.fullName?.[0] ?? "?"}
            </div>
            <div>
              <CardTitle className="text-lg">{me.fullName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                @{me.username} ・ {me.role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {me.email && (
            <Row label="Email" value={me.email} />
          )}
          <Row label="國籍" value={me.nationality} />
          {me.facility && (
            <Row label="所屬機構" value={me.facility.name} />
          )}
          <Row label="目前等級" value={tLevels(me.currentLevel)} />
        </CardContent>
      </Card>

      {/* 學習統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">學習統計</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="XP" value={me.totalXp} />
            <Stat label="連續天" value={me.streakDays} />
            <Stat
              label="學習分鐘"
              value={me.totalStudyMin}
            />
          </div>
        </CardContent>
      </Card>

      {/* 操作 */}
      <div className="space-y-2">
        <LogoutButton />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
