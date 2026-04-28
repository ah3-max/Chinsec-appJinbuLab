"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  const t = useTranslations("nav");
  const [pending, startTransition] = useTransition();
  const params = useParams<{ locale: string }>();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: `/${params.locale}/login` });
        })
      }
      className="flex w-full items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
      style={{
        borderColor: "var(--aiai-green-100)",
        color: "var(--aiai-gray-600)",
        minHeight: 48,
      }}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      {t("logout")}
    </button>
  );
}
