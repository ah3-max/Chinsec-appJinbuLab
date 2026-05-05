import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/auth/login-form";
import { LocaleSwitcher } from "@/components/auth/locale-switcher";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <main
      className="flex min-h-svh w-full items-stretch justify-center"
      style={{ background: "var(--aiai-bg-page)" }}
    >
      <div className="flex w-full max-w-[380px] flex-col items-center px-6 pb-8 pt-[12%] sm:pt-16">
        {/* Logo + brand wordmark */}
        <Logo size={64} />
        <h1
          className="mt-3 text-center"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--aiai-gray-800)",
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          JinBuLap
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--aiai-green-600)",
            margin: "4px 0 0",
            letterSpacing: "0.04em",
          }}
        >
          JinBuLap · Mandarin Learning
        </p>

        {/* Prominent language selector — top of screen */}
        <div className="mt-6 w-full">
          <p
            className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--aiai-green-600)" }}
          >
            {t("language")}
          </p>
          <Suspense fallback={<div className="h-14" />}>
            <LocaleSwitcher current={locale} variant="prominent" />
          </Suspense>
        </div>

        {/* Form */}
        <div className="mt-6 w-full">
          <Suspense fallback={<div className="h-48" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
