import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronLeft, KeyRound, Globe, User, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/auth/locale-switcher";
import { LogoutButton } from "@/components/auth/logout-button";
import { ChangePasswordForm } from "@/components/learner/change-password-form";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      fullName: true,
      username: true,
      email: true,
      role: true,
      nationality: true,
      uiLanguage: true,
      passwordChangedAt: true,
    },
  });
  if (!me) redirect(`/${locale}/login`);

  const tNav = await getTranslations("nav");
  void tNav;

  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/profile`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        กลับ
      </Link>

      <header className="space-y-0.5">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--aiai-green-600)" }}
        >
          ⚙️ ตั้งค่า · SETTINGS
        </p>
        <h1 className="text-xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
          การตั้งค่าบัญชี
        </h1>
      </header>

      {/* Account info — read-only for now */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" /> ข้อมูลบัญชี
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="ชื่อ" value={me.fullName} />
          <Row label="Username" value={`@${me.username}`} />
          {me.email && <Row label="Email" value={me.email} />}
          <Row label="สัญชาติ" value={me.nationality} />
          <Row label="บทบาท" value={me.role} />
        </CardContent>
      </Card>

      {/* UI language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="size-4" /> ภาษาของแอป · UI Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocaleSwitcher current={locale} />
          <p className="mt-2 text-[11px]" style={{ color: "var(--aiai-gray-400)" }}>
            ปุ่มและข้อความในแอปจะเปลี่ยนภาษาทันที
          </p>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="size-4" /> เปลี่ยนรหัสผ่าน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
          {me.passwordChangedAt && (
            <p className="mt-2 text-[11px]" style={{ color: "var(--aiai-gray-400)" }}>
              เปลี่ยนล่าสุด:{" "}
              {new Date(me.passwordChangedAt).toLocaleDateString(
                locale === "th" ? "th-TH" : "zh-TW",
                { year: "numeric", month: "short", day: "numeric" },
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LogOut className="size-4" /> ออกจากระบบ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-1.5 last:border-0" style={{ borderColor: "var(--aiai-gray-100)" }}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
