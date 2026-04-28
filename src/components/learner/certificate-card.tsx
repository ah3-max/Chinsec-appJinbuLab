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
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-2xl p-6 shadow-xl sm:p-8"
      style={{
        border: "4px solid var(--aiai-orange-200)",
        background:
          "linear-gradient(135deg, var(--aiai-orange-50) 0%, #FFFFFF 50%, var(--aiai-orange-50) 100%)",
      }}
    >
      {/* corner decorations */}
      <div
        className="absolute right-3 top-3"
        style={{ color: "var(--aiai-orange-200)" }}
      >
        <Award className="size-12" strokeWidth={1.5} />
      </div>
      <div
        className="absolute bottom-3 left-3"
        style={{ color: "var(--aiai-orange-200)" }}
      >
        <Award className="size-8" strokeWidth={1.5} />
      </div>

      <div className="relative space-y-4 text-center">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--aiai-orange-600)", letterSpacing: "0.18em" }}
        >
          {t("subtitle")}
        </p>
        <h2
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--aiai-orange-800)" }}
        >
          {t("title")}
        </h2>

        <div
          className="my-4 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--aiai-orange-200), transparent)",
          }}
        />

        <div className="space-y-1">
          <p
            className="text-xs"
            style={{ color: "var(--aiai-gray-400)" }}
          >
            {t("recipient")}
          </p>
          <p
            className="text-2xl font-semibold tracking-wide"
            style={{ color: "var(--aiai-gray-800)" }}
          >
            {fullName}
          </p>
        </div>

        <p
          className="text-sm"
          style={{ color: "var(--aiai-gray-800)" }}
        >
          {t("body", { level: levelLabel })}
        </p>

        <div
          className="my-3 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--aiai-orange-200), transparent)",
          }}
        />

        <div className="flex items-center justify-around gap-3 pt-1 text-sm">
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--aiai-gray-400)" }}
            >
              {t("score")}
            </p>
            <p
              className="font-mono text-base font-semibold"
              style={{ color: "var(--aiai-gray-800)" }}
            >
              {scoreSnapshot}/{maxScoreSnapshot}
              <span
                className="ml-1 text-xs"
                style={{ color: "var(--aiai-gray-400)" }}
              >
                ({pct}%)
              </span>
            </p>
          </div>
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--aiai-gray-400)" }}
            >
              {t("date")}
            </p>
            <p
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--aiai-gray-600)" }}
            >
              <Calendar className="size-3" />
              {date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
