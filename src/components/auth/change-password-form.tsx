"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Password rule: ≥ 8 chars, with at least one upper, lower and digit.
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

export function ChangePasswordForm({
  forced,
  locale,
}: {
  forced: boolean;
  locale: string;
}) {
  const t = useTranslations("auth.changePassword");
  const [submitting, setSubmitting] = useState(false);

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
      // 等下一輪 navigation 拿到新 cookie，hard reload 最簡單
      window.location.assign(forced ? `/${locale}/learn` : `/${locale}/profile`);
    } catch {
      toast.error(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          autoFocus
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        <p className="text-xs text-muted-foreground">{t("rule")}</p>
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message === "sameAsCurrent"
              ? t("errorSameAsCurrent")
              : t("errorWeak")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{t("errorMismatch")}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
