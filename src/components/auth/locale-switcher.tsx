"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LOCALES = [
  { code: "zh-TW", flag: "🇹🇼", short: "中" },
  { code: "th", flag: "🇹🇭", short: "ไทย" },
  { code: "vi", flag: "🇻🇳", short: "Tiếng Việt" },
  { code: "id", flag: "🇮🇩", short: "Bahasa" },
] as const;

export function LocaleSwitcher({ current }: { current: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchTo(locale: string) {
    if (locale === current) return;
    // Replace the leading /<locale>/ in the path; pathname always begins with
    // /<locale> after next-intl middleware.
    const next = pathname.replace(/^\/[^/]+/, `/${locale}`);
    const qs = searchParams.toString();
    router.push(qs ? `${next}?${qs}` : next);
    router.refresh();
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs"
      style={{ color: "var(--aiai-green-600)" }}
    >
      {LOCALES.map((l, i) => {
        const active = l.code === current;
        return (
          <span key={l.code} className="inline-flex items-center">
            {i > 0 && (
              <span
                aria-hidden
                className="mx-1.5"
                style={{ color: "var(--aiai-gray-400)" }}
              >
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => switchTo(l.code)}
              aria-current={active ? "page" : undefined}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors"
              style={{
                color: active ? "var(--aiai-green-800)" : "var(--aiai-green-600)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <span aria-hidden>{l.flag}</span>
              <span>{l.short}</span>
            </button>
          </span>
        );
      })}
    </div>
  );
}
