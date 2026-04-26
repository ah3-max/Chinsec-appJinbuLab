import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.login");
  const tApp = await getTranslations("app");

  return (
    <main className="flex min-h-svh items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / 標語 */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
            ㄅ
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tApp("name")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tApp("tagline")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("title")}</CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
