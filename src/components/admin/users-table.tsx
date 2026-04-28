"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogIn, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const NATIONALITY_FLAG: Record<string, string> = {
  TW: "🇹🇼",
  TH: "🇹🇭",
  VN: "🇻🇳",
  ID: "🇮🇩",
  PH: "🇵🇭",
  MY: "🇲🇾",
  KH: "🇰🇭",
  MM: "🇲🇲",
  OTHER: "🌐",
};

export function UsersTable({ users }: { users: UserRow[] }) {
  const t = useTranslations("admin.users");
  const tLevels = useTranslations("levels");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        u.nationality.toLowerCase().includes(q),
    );
  }, [users, query]);

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
      window.location.assign(magicUrl);
    } catch {
      toast.error(t("impersonateFailed"));
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          inputMode="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Mobile: card list */}
      <ul className="space-y-2 md:hidden">
        {filtered.length === 0 ? (
          <li className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            {t("empty")}
          </li>
        ) : (
          filtered.map((u) => {
            const inactive = u.status !== "ACTIVE";
            return (
              <li
                key={u.id}
                className="rounded-xl border bg-card p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {NATIONALITY_FLAG[u.nationality] ?? "🌐"}
                      </span>
                      <h3 className="truncate text-sm font-semibold">
                        {u.fullName}
                      </h3>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                      @{u.username}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                        {tLevels(u.currentLevel)}
                      </span>
                      <span
                        className={
                          inactive
                            ? "rounded bg-muted px-1.5 py-0.5 text-muted-foreground"
                            : "rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700"
                        }
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
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
              </li>
            );
          })
        )}
      </ul>

      {/* Tablet+: table */}
      <div className="hidden overflow-hidden rounded-lg border bg-card shadow-sm md:block">
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-12 text-center text-muted-foreground"
                  >
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const inactive = u.status !== "ACTIVE";
                  return (
                    <tr key={u.id} className="border-t hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono text-xs">
                        {u.username}
                      </td>
                      <td className="px-3 py-2">{u.fullName}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {NATIONALITY_FLAG[u.nationality] ?? "🌐"} {u.nationality}
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
    </div>
  );
}
