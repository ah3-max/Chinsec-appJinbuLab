"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ImpersonationBannerClient({
  adminLabel,
  targetLabel,
}: {
  adminLabel: string;
  targetLabel: string;
}) {
  const t = useTranslations("impersonation");
  const params = useParams<{ locale: string }>();
  const [loading, setLoading] = useState(false);

  async function stop() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/impersonate/stop", {
        method: "POST",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j?.error ?? t("stopFailed"));
        setLoading(false);
        return;
      }
      const { redirectTo } = (await res.json()) as { redirectTo?: string };
      window.location.assign(redirectTo ?? `/${params.locale}/users`);
    } catch {
      toast.error(t("stopFailed"));
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-0 z-50 border-b border-amber-600 bg-amber-500 text-amber-50 shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2 text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="truncate">
            {t("banner", { admin: adminLabel, target: targetLabel })}
          </span>
        </div>
        <button
          type="button"
          onClick={stop}
          disabled={loading}
          className="flex shrink-0 items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-xs font-medium hover:bg-white/30 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <LogOut className="size-3.5" />
          )}
          {t("stop")}
        </button>
      </div>
    </div>
  );
}
