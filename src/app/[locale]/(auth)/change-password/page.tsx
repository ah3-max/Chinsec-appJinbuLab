import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/brand/logo";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("auth.changePassword");
  const forced = !!session.user.mustChangePassword;

  return (
    <main
      className="flex min-h-svh w-full items-stretch justify-center"
      style={{ background: "var(--aiai-bg-page)" }}
    >
      <div className="flex w-full max-w-[380px] flex-col items-center px-6 pb-8 pt-[12%] sm:pt-16">
        <Logo size={64} />
        <h1
          className="mt-3 text-center"
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--aiai-gray-800)",
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          {forced ? t("titleForced") : t("title")}
        </h1>

        {forced && (
          <div
            className="mt-4 flex w-full items-start gap-2 rounded-xl px-3 py-2.5"
            style={{
              background: "var(--aiai-green-50)",
              border: "1px solid var(--aiai-green-200)",
            }}
          >
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0"
              style={{ color: "var(--aiai-green-600)" }}
            />
            <p
              style={{
                fontSize: 12,
                color: "var(--aiai-green-800)",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {t("subtitleForced")}
            </p>
          </div>
        )}

        {!forced && (
          <p
            className="mt-2 text-center"
            style={{
              fontSize: 12,
              color: "var(--aiai-gray-600)",
              lineHeight: 1.5,
              margin: "8px 0 0",
            }}
          >
            {t("subtitle")}
          </p>
        )}

        <div className="mt-6 w-full">
          <ChangePasswordForm forced={forced} locale={locale} />
        </div>
      </div>
    </main>
  );
}
