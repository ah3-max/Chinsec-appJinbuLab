import { setRequestLocale } from "next-intl/server";
import { BottomNav } from "@/components/learner/bottom-nav";
import { ImpersonationBanner } from "@/components/impersonation-banner";

export default async function LearnerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-svh" style={{ background: "var(--aiai-bg-page)" }}>
      <ImpersonationBanner />
      <main className="mx-auto max-w-md pb-20 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
