"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 由 build-time 環境變數決定是否顯示一鍵管理員登入按鈕
// docker/docker-compose.app.yml 已設 NEXT_PUBLIC_ENABLE_QUICK_LOGIN=true
const QUICK_LOGIN_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_QUICK_LOGIN === "true";

const schema = z.object({
  username: z.string().min(1, "username required").max(64),
  password: z.string().min(1, "password required").max(128),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string }>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  async function doSignIn(username: string, password: string) {
    const callbackUrl =
      searchParams.get("callbackUrl") || `/${params.locale}/learn`;
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(t("errorInvalid"));
      return false;
    }

    router.push(callbackUrl);
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
      <div className="space-y-2">
        <Label htmlFor="username">{t("username")}</Label>
        <Input
          id="username"
          autoComplete="username"
          autoFocus
          placeholder={t("usernamePlaceholder")}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? t("submitting") : t("submit")}
      </Button>

      {QUICK_LOGIN_ENABLED && (
        <>
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                本機開發
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            size="lg"
            disabled={submitting}
            onClick={quickAdminLogin}
          >
            <Zap className="size-4" />
            超級管理員一鍵登入
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            shunyuan / ChangeMe@2026 — 此按鈕僅在開發環境顯示
          </p>
        </>
      )}
    </form>
  );
}
