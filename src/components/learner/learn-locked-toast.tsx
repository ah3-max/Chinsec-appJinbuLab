"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function LearnLockedToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("learn");

  useEffect(() => {
    const err = params.get("error");
    if (err === "locked") {
      toast.error(t("courseLocked"));
      // Strip the param from the URL so a refresh doesn't re-fire the toast.
      const next = new URLSearchParams(params.toString());
      next.delete("error");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
  }, [params, pathname, router, t]);

  return null;
}
