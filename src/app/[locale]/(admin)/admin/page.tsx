import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Users,
  ScrollText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  // (admin)/layout already gates non-admins, but keep a defensive check.
  const adminUserId = session!.user.id;

  const t = await getTranslations("admin.dashboard");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [me, learnerCount, activeLearnerCount, recentAttempts, recentAudits] =
    await Promise.all([
      db.user.findUnique({
        where: { id: adminUserId },
        select: { fullName: true, username: true, role: true },
      }),
      db.user.count({ where: { role: "LEARNER", deletedAt: null } }),
      db.user.count({
        where: {
          role: "LEARNER",
          deletedAt: null,
          lastActiveAt: { gte: sevenDaysAgo },
        },
      }),
      db.userAttempt.count({ where: { attemptedAt: { gte: sevenDaysAgo } } }),
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          action: true,
          resource: true,
          resourceId: true,
          createdAt: true,
          userId: true,
        },
      }),
    ]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 text-white shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium opacity-90">
              <ShieldCheck className="size-3.5" />
              {me?.role === "SUPER_ADMIN"
                ? t("badgeSuperAdmin")
                : t("badgeAdmin")}
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold">
              {t("welcome", { name: me?.fullName ?? "?" })}
            </h1>
            <p className="mt-1 text-sm opacity-90">{t("subtitle")}</p>
          </div>
          <Sparkles className="size-7 shrink-0 opacity-80" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        <StatCard label={t("statTotalLearners")} value={learnerCount} />
        <StatCard
          label={t("statActiveWeekly")}
          value={activeLearnerCount}
          accent
        />
        <StatCard label={t("statAttemptsWeekly")} value={recentAttempts} />
      </section>

      {/* Navigation cards */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">{t("manage")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <NavCard
            href={`/${locale}/users`}
            title={t("navUsers")}
            description={t("navUsersDesc")}
            Icon={Users}
            color="bg-blue-100 text-blue-600"
          />
          <NavCard
            href={`/${locale}/admin/audits`}
            title={t("navAudits")}
            description={t("navAuditsDesc")}
            Icon={ScrollText}
            color="bg-emerald-100 text-emerald-600"
            disabled
            disabledLabel={t("comingSoon")}
          />
        </div>
      </section>

      {/* Recent audits */}
      {recentAudits.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">{t("recentActivity")}</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y text-sm">
                {recentAudits.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-medium uppercase text-foreground">
                        {a.action}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.resource}
                        {a.resourceId ? ` · ${a.resourceId.slice(0, 8)}` : ""}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {formatRelative(a.createdAt)}
                    </time>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center sm:p-4"
          : "rounded-xl border bg-card p-3 text-center sm:p-4"
      }
    >
      <div
        className={
          accent
            ? "text-2xl font-bold text-emerald-700 sm:text-3xl"
            : "text-2xl font-bold sm:text-3xl"
        }
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
        {label}
      </div>
    </div>
  );
}

function NavCard({
  href,
  title,
  description,
  Icon,
  color,
  disabled,
  disabledLabel,
}: {
  href: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const inner = (
    <Card
      className={
        disabled
          ? "border-dashed opacity-60"
          : "transition-all active:scale-[0.99] hover:shadow-md"
      }
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            {disabled ? (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {disabledLabel}
              </span>
            ) : (
              <ArrowRight className="size-4 text-muted-foreground" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
  if (disabled) return <div>{inner}</div>;
  return <Link href={href}>{inner}</Link>;
}

function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.round(hr / 24);
  return `${day}d`;
}
