"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const t = useTranslations("nav");
  const [pending, startTransition] = useTransition();
  const params = useParams<{ locale: string }>();

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: `/${params.locale}/login` });
        })
      }
    >
      <LogOut className="size-4" />
      {t("logout")}
    </Button>
  );
}
