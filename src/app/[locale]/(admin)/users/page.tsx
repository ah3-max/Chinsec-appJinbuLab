import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.users");

  const users = await db.user.findMany({
    where: { role: "LEARNER", deletedAt: null },
    select: {
      id: true,
      username: true,
      fullName: true,
      nationality: true,
      currentLevel: true,
      status: true,
      lastActiveAt: true,
      uiLanguage: true,
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("subtitle", { count: users.length })}
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
