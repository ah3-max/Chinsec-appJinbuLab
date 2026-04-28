"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { ChevronLeft, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export function AdminHeader({
  fullName,
  isSuperAdmin,
}: {
  fullName: string;
  isSuperAdmin: boolean;
}) {
  const t = useTranslations("admin.dashboard");
  const pathname = usePathname();
  const { locale } = useParams<{ locale: string }>();

  const adminHome = `/${locale}/admin`;
  const isOnDashboard = pathname === adminHome;

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        borderColor: "var(--aiai-green-100)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {!isOnDashboard && (
            <Link
              href={adminHome}
              className="flex items-center rounded-md p-1.5 text-sm transition-colors hover:bg-muted"
              style={{ color: "var(--aiai-gray-600)" }}
              aria-label={t("backToDashboard")}
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}
          <Logo size={32} />
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold leading-tight"
              style={{ color: "var(--aiai-gray-800)" }}
            >
              {fullName}
            </p>
            <p
              className="text-[10px] uppercase leading-tight"
              style={{
                color: isSuperAdmin
                  ? "var(--aiai-orange-600)"
                  : "var(--aiai-green-600)",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              {isSuperAdmin ? t("badgeSuperAdmin") : t("badgeAdmin")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
          style={{ color: "var(--aiai-gray-600)" }}
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </div>
    </header>
  );
}
