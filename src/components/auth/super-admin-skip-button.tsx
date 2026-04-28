"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SuperAdminSkipButton({ locale }: { locale: string }) {
  const [submitting, setSubmitting] = useState(false);

  async function skip() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/skip-password-change", {
        method: "POST",
      });
      if (!res.ok) {
        toast.error("無法跳過,請稍後再試");
        setSubmitting(false);
        return;
      }
      // Hard reload so middleware reads the new cookie + bypasses redirect.
      window.location.assign(`/${locale}/admin`);
    } catch {
      toast.error("無法跳過,請稍後再試");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 w-full">
      <div className="mb-2 flex items-center gap-2">
        <span
          style={{
            flex: 1,
            height: 1,
            background: "var(--aiai-gray-200)",
          }}
        />
        <span
          className="text-[11px]"
          style={{ color: "var(--aiai-gray-400)" }}
        >
          超級管理員
        </span>
        <span
          style={{
            flex: 1,
            height: 1,
            background: "var(--aiai-gray-200)",
          }}
        />
      </div>
      <button
        type="button"
        onClick={skip}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          minHeight: 44,
          borderColor: "var(--aiai-orange-200)",
          background: "var(--aiai-orange-50)",
          color: "var(--aiai-orange-800)",
        }}
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ShieldCheck
            className="size-4"
            style={{ color: "var(--aiai-orange-600)" }}
          />
        )}
        跳過(超管不強制改密)
      </button>
      <p
        className="mt-1 text-center"
        style={{ fontSize: 10, color: "var(--aiai-gray-400)" }}
      >
        僅 SUPER_ADMIN 可見 · 直接進管理員首頁
      </p>
    </div>
  );
}
