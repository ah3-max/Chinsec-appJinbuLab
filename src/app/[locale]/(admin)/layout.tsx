import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // Admins shouldn't reach the admin console while impersonating someone —
  // they should `Stop` first. Bounce them to the learner area where the banner
  // gives them the stop button.
  if (session.user._impersonatedBy) {
    redirect(`/${locale}/learn`);
  }

  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    redirect(`/${locale}/learn`);
  }

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true },
  });

  return (
    <div className="min-h-svh bg-muted/30">
      <ImpersonationBanner />
      <AdminHeader
        fullName={me?.fullName ?? session.user.username}
        isSuperAdmin={session.user.role === "SUPER_ADMIN"}
      />
      <main className="mx-auto max-w-5xl space-y-6 p-3 sm:p-6">
        {children}
      </main>
    </div>
  );
}
