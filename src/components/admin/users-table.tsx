"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UserRow {
  id: string;
  username: string;
  fullName: string;
  nationality: string;
  currentLevel: string;
  status: string;
  lastActiveAt: Date | string | null;
  uiLanguage: string;
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const t = useTranslations("admin.users");
  const tLevels = useTranslations("levels");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function impersonate(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/impersonate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j?.error ?? t("impersonateFailed"));
        setLoadingId(null);
        return;
      }
      const { magicUrl } = (await res.json()) as { magicUrl: string };
      // Hard navigation: the consume endpoint sets the session cookie and 302s.
      window.location.assign(magicUrl);
    } catch {
      toast.error(t("impersonateFailed"));
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">{t("username")}</th>
              <th className="px-3 py-2 font-medium">{t("fullName")}</th>
              <th className="px-3 py-2 font-medium">{t("nationality")}</th>
              <th className="px-3 py-2 font-medium">{t("level")}</th>
              <th className="px-3 py-2 font-medium">{t("status")}</th>
              <th className="px-3 py-2 text-right font-medium">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-12 text-center text-muted-foreground"
                >
                  {t("empty")}
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const inactive = u.status !== "ACTIVE";
                return (
                  <tr key={u.id} className="border-t hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono text-xs">
                      {u.username}
                    </td>
                    <td className="px-3 py-2">{u.fullName}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {u.nationality}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {tLevels(u.currentLevel)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          inactive
                            ? "rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                            : "rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700"
                        }
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingId === u.id || inactive}
                        onClick={() => impersonate(u.id)}
                      >
                        {loadingId === u.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <LogIn className="size-4" />
                        )}
                        {t("impersonate")}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
