"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { ChevronLeft, ShieldCheck, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {!isOnDashboard && (
            <Link
              href={adminHome}
              className="flex items-center gap-1 rounded-md p-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={t("backToDashboard")}
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}
          <ShieldCheck
            className={
              isSuperAdmin
                ? "size-5 shrink-0 text-amber-500"
                : "size-5 shrink-0 text-blue-500"
            }
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">
              {fullName}
            </p>
            <p className="text-[10px] uppercase leading-tight tracking-wide text-muted-foreground">
              {isSuperAdmin ? t("badgeSuperAdmin") : t("badgeAdmin")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </div>
    </header>
  );
}
