"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const passwordRule = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[0-9]/);

const schema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: passwordRule,
    confirmPassword: z.string().min(1).max(128),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "mismatch",
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ["newPassword"],
    message: "sameAsCurrent",
  });

type FormValues = z.infer<typeof schema>;

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  background: "#FFFFFF",
  border: "0.5px solid var(--aiai-gray-200)",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14,
  minHeight: 44,
  color: "var(--aiai-gray-800)",
  outline: "none",
  transition: "border-color 120ms ease, box-shadow 120ms ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--aiai-green-600)",
  marginBottom: 6,
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--aiai-green-400)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 12,
  padding: "14px 16px",
  fontSize: 15,
  fontWeight: 500,
  minHeight: 48,
  cursor: "pointer",
  transition: "background-color 120ms ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

function focusBorder(focused: boolean): React.CSSProperties {
  return {
    borderColor: focused
      ? "var(--aiai-green-400)"
      : "var(--aiai-gray-200)",
    boxShadow: focused ? "0 0 0 3px rgba(99, 153, 34, 0.12)" : "none",
  };
}

export function ChangePasswordForm({
  forced,
  locale,
}: {
  forced: boolean;
  locale: string;
}) {
  const t = useTranslations("auth.changePassword");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState<
    "currentPassword" | "newPassword" | "confirmPassword" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        if (j?.error === "currentInvalid") {
          setError("currentPassword", { message: t("errorCurrentInvalid") });
        } else if (j?.error === "sameAsCurrent") {
          setError("newPassword", { message: t("errorSameAsCurrent") });
        } else if (j?.error === "weak") {
          setError("newPassword", { message: t("errorWeak") });
        } else {
          toast.error(t("errorGeneric"));
        }
        return;
      }
      toast.success(t("success"));
      // 等下一輪 navigation 拿到新 cookie,hard reload 最簡單
      window.location.assign(forced ? `/${locale}/learn` : `/${locale}/profile`);
    } catch {
      toast.error(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" style={labelStyle}>
          {t("currentPassword")}
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          autoFocus
          style={{ ...inputBaseStyle, ...focusBorder(focused === "currentPassword") }}
          {...register("currentPassword", {
            onBlur: () => setFocused(null),
          })}
          onFocus={() => setFocused("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" style={labelStyle}>
          {t("newPassword")}
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          style={{ ...inputBaseStyle, ...focusBorder(focused === "newPassword") }}
          {...register("newPassword", {
            onBlur: () => setFocused(null),
          })}
          onFocus={() => setFocused("newPassword")}
        />
        <p
          className="mt-1.5"
          style={{ fontSize: 11, color: "var(--aiai-gray-400)" }}
        >
          {t("rule")}
        </p>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.newPassword.message === "sameAsCurrent"
              ? t("errorSameAsCurrent")
              : t("errorWeak")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" style={labelStyle}>
          {t("confirmPassword")}
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          style={{
            ...inputBaseStyle,
            ...focusBorder(focused === "confirmPassword"),
          }}
          {...register("confirmPassword", {
            onBlur: () => setFocused(null),
          })}
          onFocus={() => setFocused("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{t("errorMismatch")}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          ...primaryButtonStyle,
          opacity: submitting ? 0.7 : 1,
          background: submitting
            ? "var(--aiai-green-600)"
            : "var(--aiai-green-400)",
        }}
        onMouseEnter={(e) => {
          if (!submitting)
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--aiai-green-600)";
        }}
        onMouseLeave={(e) => {
          if (!submitting)
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--aiai-green-400)";
        }}
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
