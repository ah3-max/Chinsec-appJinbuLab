"use client";

import { useTranslations } from "next-intl";
import { Award, Calendar } from "lucide-react";

export function CertificateCard({
  fullName,
  levelLabel,
  scoreSnapshot,
  maxScoreSnapshot,
  issuedAt,
}: {
  fullName: string;
  levelLabel: string;
  scoreSnapshot: number;
  maxScoreSnapshot: number;
  issuedAt: Date;
}) {
  const t = useTranslations("learn.certificate");
  const pct = Math.round((scoreSnapshot / Math.max(1, maxScoreSnapshot)) * 100);
  const date = issuedAt.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border-4 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 shadow-xl sm:p-8">
      {/* corner decorations */}
      <div className="absolute right-3 top-3 text-amber-200">
        <Award className="size-12" strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-3 left-3 text-amber-200">
        <Award className="size-8" strokeWidth={1.5} />
      </div>

      <div className="relative space-y-4 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-700">
          {t("subtitle")}
        </p>
        <h2 className="text-2xl font-bold text-amber-900 sm:text-3xl">
          {t("title")}
        </h2>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{t("recipient")}</p>
          <p className="text-2xl font-semibold tracking-wide">{fullName}</p>
        </div>

        <p className="text-sm text-foreground">
          {t("body", { level: levelLabel })}
        </p>

        <div className="my-3 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

        <div className="flex items-center justify-around gap-3 pt-1 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t("score")}</p>
            <p className="font-mono text-base font-semibold">
              {scoreSnapshot}/{maxScoreSnapshot}
              <span className="ml-1 text-xs text-muted-foreground">
                ({pct}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("date")}</p>
            <p className="flex items-center gap-1 text-xs">
              <Calendar className="size-3" />
              {date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
