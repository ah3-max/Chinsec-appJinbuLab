import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Users, ScrollText, ShieldCheck, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Logo } from "@/components/brand/logo";

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
    <div className="space-y-5">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-2xl px-5 py-6 text-white shadow-sm sm:px-7 sm:py-7"
        style={{
          background:
            "linear-gradient(135deg, var(--aiai-green-400) 0%, var(--aiai-green-600) 100%)",
        }}
      >
        <div
          className="absolute -right-10 -top-10 size-44 rounded-full opacity-20"
          style={{ background: "var(--aiai-green-100)" }}
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="flex items-center gap-1.5 text-[11px] font-medium uppercase opacity-90"
              style={{ letterSpacing: "0.06em" }}
            >
              <ShieldCheck className="size-3.5" />
              {me?.role === "SUPER_ADMIN"
                ? t("badgeSuperAdmin")
                : t("badgeAdmin")}
            </p>
            <h1 className="mt-1.5 truncate text-2xl font-bold">
              {t("welcome", { name: me?.fullName ?? "?" })}
            </h1>
            <p className="mt-1 text-sm opacity-90">{t("subtitle")}</p>
          </div>
          <div className="hidden sm:block">
            <Logo size={48} variant="inverted" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard label={t("statTotalLearners")} value={learnerCount} />
        <StatCard
          label={t("statActiveWeekly")}
          value={activeLearnerCount}
          accent
        />
        <StatCard label={t("statAttemptsWeekly")} value={recentAttempts} />
      </section>

      {/* Navigation cards */}
      <section className="space-y-2">
        <h2
          className="text-base font-semibold"
          style={{ color: "var(--aiai-green-800)" }}
        >
          {t("manage")}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          <NavCard
            href={`/${locale}/users`}
            title={t("navUsers")}
            description={t("navUsersDesc")}
            Icon={Users}
            tone="green"
          />
          <NavCard
            href={`/${locale}/admin/audits`}
            title={t("navAudits")}
            description={t("navAuditsDesc")}
            Icon={ScrollText}
            tone="orange"
            disabled
            disabledLabel={t("comingSoon")}
          />
        </div>
      </section>

      {/* Recent audits */}
      {recentAudits.length > 0 && (
        <section className="space-y-2">
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--aiai-green-800)" }}
          >
            {t("recentActivity")}
          </h2>
          <div
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
            style={{ borderColor: "var(--aiai-green-100)" }}
          >
            <ul className="divide-y" style={{ borderColor: "var(--aiai-gray-200)" }}>
              {recentAudits.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p
                      className="font-mono text-[11px] font-semibold uppercase tracking-wide"
                      style={{
                        color: "var(--aiai-green-600)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {a.action}
                    </p>
                    <p
                      className="truncate text-xs"
                      style={{ color: "var(--aiai-gray-400)" }}
                    >
                      {a.resource}
                      {a.resourceId ? ` · ${a.resourceId.slice(0, 8)}` : ""}
                    </p>
                  </div>
                  <time
                    className="shrink-0 text-xs"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    {formatRelative(a.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
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
      className="rounded-xl border bg-white p-3 text-center shadow-sm sm:p-4"
      style={{
        borderColor: accent ? "var(--aiai-green-200)" : "var(--aiai-green-100)",
        background: accent ? "var(--aiai-green-50)" : "#FFFFFF",
      }}
    >
      <div
        className="text-2xl font-bold tabular-nums sm:text-3xl"
        style={{
          color: accent ? "var(--aiai-green-800)" : "var(--aiai-gray-800)",
        }}
      >
        {value}
      </div>
      <div
        className="mt-0.5 text-[11px] sm:text-xs"
        style={{ color: "var(--aiai-gray-600)" }}
      >
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
  tone,
  disabled,
  disabledLabel,
}: {
  href: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "green" | "orange";
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const accent =
    tone === "green" ? "var(--aiai-green-600)" : "var(--aiai-orange-600)";
  const tint =
    tone === "green" ? "var(--aiai-green-50)" : "var(--aiai-orange-50)";

  const inner = (
    <article
      className="rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
      style={{
        borderColor: disabled
          ? "var(--aiai-gray-200)"
          : "var(--aiai-green-100)",
        borderStyle: disabled ? "dashed" : "solid",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: tint, color: accent }}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--aiai-gray-800)" }}
            >
              {title}
            </h3>
            {disabled ? (
              <span
                className="rounded px-1.5 py-0.5 text-[10px]"
                style={{
                  background: "var(--aiai-gray-50)",
                  color: "var(--aiai-gray-400)",
                }}
              >
                {disabledLabel}
              </span>
            ) : (
              <ArrowRight className="size-4" style={{ color: accent }} />
            )}
          </div>
          <p
            className="mt-1 text-xs leading-relaxed"
            style={{ color: "var(--aiai-gray-600)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </article>
  );
  if (disabled) return <div>{inner}</div>;
  return (
    <Link href={href} className="block transition-transform active:scale-[0.99]">
      {inner}
    </Link>
  );
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
