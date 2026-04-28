"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogIn, Loader2, Search } from "lucide-react";

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#FFFFFF",
  border: "0.5px solid var(--aiai-gray-200)",
  borderRadius: 10,
  padding: "10px 12px 10px 36px",
  fontSize: 14,
  minHeight: 40,
  color: "var(--aiai-gray-800)",
  outline: "none",
  transition: "border-color 120ms ease, box-shadow 120ms ease",
};

export function UsersTable({ users }: { users: UserRow[] }) {
  const t = useTranslations("admin.users");
  const tLevels = useTranslations("levels");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2"
          style={{ color: "var(--aiai-green-600)" }}
        />
        <input
          type="search"
          inputMode="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            ...inputStyle,
            borderColor: searchFocused
              ? "var(--aiai-green-400)"
              : "var(--aiai-gray-200)",
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(99, 153, 34, 0.12)"
              : "none",
          }}
        />
      </div>

      {/* Mobile: card list */}
      <ul className="space-y-2 md:hidden">
        {filtered.length === 0 ? (
          <li
            className="rounded-xl border bg-white p-8 text-center text-sm"
            style={{
              borderColor: "var(--aiai-gray-200)",
              borderStyle: "dashed",
              color: "var(--aiai-gray-400)",
            }}
          >
            {t("empty")}
          </li>
        ) : (
          filtered.map((u) => {
            const inactive = u.status !== "ACTIVE";
            return (
              <li
                key={u.id}
                className="rounded-xl border bg-white p-3 shadow-sm"
                style={{ borderColor: "var(--aiai-green-100)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {NATIONALITY_FLAG[u.nationality] ?? "🌐"}
                      </span>
                      <h3
                        className="truncate text-sm font-semibold"
                        style={{ color: "var(--aiai-gray-800)" }}
                      >
                        {u.fullName}
                      </h3>
                    </div>
                    <p
                      className="mt-0.5 truncate font-mono text-xs"
                      style={{ color: "var(--aiai-gray-400)" }}
                    >
                      @{u.username}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span
                        className="rounded px-1.5 py-0.5"
                        style={{
                          background: "var(--aiai-green-50)",
                          color: "var(--aiai-green-600)",
                        }}
                      >
                        {tLevels(u.currentLevel)}
                      </span>
                      <span
                        className="rounded px-1.5 py-0.5"
                        style={{
                          background: inactive
                            ? "var(--aiai-gray-50)"
                            : "var(--aiai-green-200)",
                          color: inactive
                            ? "var(--aiai-gray-400)"
                            : "var(--aiai-green-800)",
                        }}
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                </div>
                <ImpersonateButton
                  onClick={() => impersonate(u.id)}
                  disabled={loadingId === u.id || inactive}
                  loading={loadingId === u.id}
                  fullWidth
                  label={t("impersonate")}
                />
              </li>
            );
          })
        )}
      </ul>

      {/* Tablet+: table */}
      <div
        className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block"
        style={{ borderColor: "var(--aiai-green-100)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "var(--aiai-green-50)" }}>
              <tr>
                <Th>{t("username")}</Th>
                <Th>{t("fullName")}</Th>
                <Th>{t("nationality")}</Th>
                <Th>{t("level")}</Th>
                <Th>{t("status")}</Th>
                <Th align="right">{t("actions")}</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-12 text-center"
                    style={{ color: "var(--aiai-gray-400)" }}
                  >
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const inactive = u.status !== "ACTIVE";
                  return (
                    <tr
                      key={u.id}
                      className="border-t transition-colors"
                      style={{ borderColor: "var(--aiai-gray-200)" }}
                    >
                      <td
                        className="px-3 py-2 font-mono text-xs"
                        style={{ color: "var(--aiai-gray-800)" }}
                      >
                        {u.username}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{ color: "var(--aiai-gray-800)" }}
                      >
                        {u.fullName}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{ color: "var(--aiai-gray-600)" }}
                      >
                        {NATIONALITY_FLAG[u.nationality] ?? "🌐"} {u.nationality}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{ color: "var(--aiai-gray-600)" }}
                      >
                        {tLevels(u.currentLevel)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="rounded px-1.5 py-0.5 text-xs"
                          style={{
                            background: inactive
                              ? "var(--aiai-gray-50)"
                              : "var(--aiai-green-200)",
                            color: inactive
                              ? "var(--aiai-gray-400)"
                              : "var(--aiai-green-800)",
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <ImpersonateButton
                          onClick={() => impersonate(u.id)}
                          disabled={loadingId === u.id || inactive}
                          loading={loadingId === u.id}
                          label={t("impersonate")}
                        />
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

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={`px-3 py-2 text-[11px] font-semibold uppercase ${
        align === "right" ? "text-right" : "text-left"
      }`}
      style={{
        color: "var(--aiai-green-800)",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </th>
  );
}

function ImpersonateButton({
  onClick,
  disabled,
  loading,
  label,
  fullWidth,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        fullWidth
          ? "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50"
          : "inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
      }
      style={{
        borderColor: "var(--aiai-green-200)",
        background: disabled ? "#FFFFFF" : "var(--aiai-green-50)",
        color: disabled ? "var(--aiai-gray-400)" : "var(--aiai-green-800)",
        minHeight: fullWidth ? 40 : undefined,
      }}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogIn className="size-3.5" />
      )}
      {label}
    </button>
  );
}
