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
  await getTranslations("auth.login");

  return (
    <main
      className="flex min-h-svh w-full items-stretch justify-center"
      style={{ background: "var(--aiai-bg-page)" }}
    >
      <div className="flex w-full max-w-[380px] flex-col items-center px-6 pb-8 pt-[20%] sm:pt-24">
        {/* Logo + brand wordmark */}
        <Logo size={80} />
        <h1
          className="mt-4 text-center"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--aiai-gray-800)",
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          愛愛院 中文學習
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--aiai-green-600)",
            margin: "4px 0 0",
            letterSpacing: "0.04em",
          }}
        >
          Aiai Care · Mandarin Learning
        </p>

        {/* Form */}
        <div className="mt-9 w-full">
          <Suspense fallback={<div className="h-48" />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Locale switcher */}
        <div className="mt-6">
          <LocaleSwitcher current={locale} />
        </div>
      </div>
    </main>
  );
}
