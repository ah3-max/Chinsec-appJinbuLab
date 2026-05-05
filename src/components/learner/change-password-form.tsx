"use client";

import { useState } from "react";
import { Loader2, Lock, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Live password-strength checks
  const checks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    digit: /[0-9]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirm,
  };
  const allOk = Object.values(checks).every(Boolean);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allOk || !currentPassword) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.error === "currentInvalid" ? "รหัสผ่านปัจจุบันไม่ถูกต้อง" :
          data?.error === "sameAsCurrent" ? "รหัสผ่านใหม่ต้องไม่เหมือนเดิม" :
          data?.error === "weak" ? "รหัสผ่านยังไม่ตรงตามเงื่อนไข" :
          "เปลี่ยนรหัสผ่านไม่สำเร็จ";
        toast.error(msg);
        return;
      }
      toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
      setDone(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setTimeout(() => setDone(false), 3000);
    } catch {
      toast.error("เครือข่ายมีปัญหา");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Current password */}
      <div>
        <label className="mb-1 block text-xs font-medium" style={{ color: "var(--aiai-gray-600)" }}>
          รหัสผ่านปัจจุบัน
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--aiai-gray-400)" }} />
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full rounded-xl border-2 px-9 py-2.5 text-sm outline-none transition-colors focus:border-green-400"
            style={{ borderColor: "var(--aiai-gray-200)" }}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--aiai-gray-400)" }}
          >
            {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="mb-1 block text-xs font-medium" style={{ color: "var(--aiai-gray-600)" }}>
          รหัสผ่านใหม่
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--aiai-gray-400)" }} />
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="w-full rounded-xl border-2 px-9 py-2.5 text-sm outline-none transition-colors focus:border-green-400"
            style={{ borderColor: "var(--aiai-gray-200)" }}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--aiai-gray-400)" }}
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Confirm */}
      <div>
        <label className="mb-1 block text-xs font-medium" style={{ color: "var(--aiai-gray-600)" }}>
          ยืนยันรหัสผ่านใหม่
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--aiai-gray-400)" }} />
          <input
            type={showNew ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            className="w-full rounded-xl border-2 px-9 py-2.5 text-sm outline-none transition-colors focus:border-green-400"
            style={{ borderColor: "var(--aiai-gray-200)" }}
          />
        </div>
      </div>

      {/* Strength checklist */}
      <ul className="grid grid-cols-2 gap-1 rounded-xl p-2 text-[11px]" style={{ background: "var(--aiai-gray-100)" }}>
        <CheckRow ok={checks.length} label="อย่างน้อย 8 ตัว" />
        <CheckRow ok={checks.upper} label="A-Z อย่างน้อย 1 ตัว" />
        <CheckRow ok={checks.lower} label="a-z อย่างน้อย 1 ตัว" />
        <CheckRow ok={checks.digit} label="ตัวเลข 0-9 อย่างน้อย 1 ตัว" />
        <CheckRow ok={checks.match} label="รหัสผ่าน 2 ช่องตรงกัน" />
      </ul>

      <Button
        type="submit"
        disabled={!allOk || !currentPassword || submitting}
        className="w-full py-5 text-sm font-semibold"
        style={{ background: done ? "#22c55e" : "var(--aiai-green-400)" }}
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : done ? <Check className="size-4" /> : null}
        {done ? "เปลี่ยนแล้ว!" : "บันทึกรหัสผ่านใหม่"}
      </Button>
    </form>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-1" style={{ color: ok ? "#15803d" : "var(--aiai-gray-500)" }}>
      <Check className="size-3" style={{ opacity: ok ? 1 : 0.3 }} />
      <span>{label}</span>
    </li>
  );
}
