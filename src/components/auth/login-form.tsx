"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { toast } from "sonner";
import { Zap, Loader2 } from "lucide-react";

// 由 build-time 環境變數決定是否顯示一鍵管理員登入按鈕
const QUICK_LOGIN_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_QUICK_LOGIN === "true";

const schema = z.object({
  username: z.string().min(1, "username required").max(64),
  password: z.string().min(1, "password required").max(128),
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

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  async function doSignIn(username: string, password: string) {
    const explicitCallback = searchParams.get("callbackUrl");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(t("errorInvalid"));
      return false;
    }

    let target = explicitCallback ?? `/${params.locale}/learn`;
    if (!explicitCallback) {
      try {
        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
        const session = (await sessionRes.json()) as {
          user?: { role?: string; mustChangePassword?: boolean };
        } | null;
        if (session?.user?.mustChangePassword) {
          target = `/${params.locale}/change-password`;
        } else if (
          session?.user?.role === "ADMIN" ||
          session?.user?.role === "SUPER_ADMIN"
        ) {
          target = `/${params.locale}/admin`;
        }
      } catch {
        /* fall back to default learner home */
      }
    }

    router.push(target);
    router.refresh();
    return true;
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await doSignIn(values.username, values.password);
    } finally {
      setSubmitting(false);
    }
  }

  async function quickAdminLogin() {
    setSubmitting(true);
    try {
      await doSignIn("shunyuan", "ChangeMe@2026");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" style={labelStyle}>
          {t("username")}
        </label>
        <input
          id="username"
          autoComplete="username"
          autoFocus
          placeholder={t("usernamePlaceholder")}
          style={{
            ...inputBaseStyle,
            borderColor: usernameFocused
              ? "var(--aiai-green-400)"
              : "var(--aiai-gray-200)",
            boxShadow: usernameFocused
              ? "0 0 0 3px rgba(99, 153, 34, 0.12)"
              : "none",
          }}
          {...register("username", {
            onBlur: () => setUsernameFocused(false),
          })}
          onFocus={() => setUsernameFocused(true)}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" style={labelStyle}>
          {t("password")}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          style={{
            ...inputBaseStyle,
            borderColor: passwordFocused
              ? "var(--aiai-green-400)"
              : "var(--aiai-gray-200)",
            boxShadow: passwordFocused
              ? "0 0 0 3px rgba(99, 153, 34, 0.12)"
              : "none",
          }}
          {...register("password", {
            onBlur: () => setPasswordFocused(false),
          })}
          onFocus={() => setPasswordFocused(true)}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
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

      {QUICK_LOGIN_ENABLED && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <span
              style={{
                flex: 1,
                height: 1,
                background: "var(--aiai-gray-200)",
              }}
            />
            <span className="text-[11px]" style={{ color: "var(--aiai-gray-400)" }}>
              本機開發
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
            onClick={quickAdminLogin}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              minHeight: 44,
              borderColor: "var(--aiai-orange-200)",
              background: "var(--aiai-orange-50)",
              color: "var(--aiai-orange-800)",
            }}
          >
            <Zap className="size-4" style={{ color: "var(--aiai-orange-600)" }} />
            超級管理員一鍵登入
          </button>
          <p
            className="text-center"
            style={{ fontSize: 10, color: "var(--aiai-gray-400)" }}
          >
            shunyuan / ChangeMe@2026 — 僅開發環境顯示
          </p>
        </div>
      )}
    </form>
  );
}
