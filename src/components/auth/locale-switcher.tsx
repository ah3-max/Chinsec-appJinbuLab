"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LOCALES = [
  { code: "en",    flag: "🇬🇧", short: "EN",       full: "English" },
  { code: "th",    flag: "🇹🇭", short: "ไทย",      full: "ภาษาไทย" },
  { code: "vi",    flag: "🇻🇳", short: "VI",       full: "Tiếng Việt" },
  { code: "id",    flag: "🇮🇩", short: "ID",       full: "Bahasa Indonesia" },
  { code: "zh-TW", flag: "🇹🇼", short: "中文",     full: "繁體中文" },
] as const;

export type LocaleVariant = "compact" | "prominent";

export function LocaleSwitcher({
  current,
  variant = "compact",
}: {
  current: string;
  variant?: LocaleVariant;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchTo(locale: string) {
    if (locale === current) return;
    // Replace the leading /<locale>/ in the path. Preserve the query string so
    // auto-login params (?username=&password=&auto=1&callbackUrl=…) survive
    // a language change on the login screen.
    const nextPath = pathname.replace(/^\/[^/]+/, `/${locale}`);
    const qs = searchParams?.toString();
    router.push(qs ? `${nextPath}?${qs}` : nextPath);
    router.refresh();
  }

  if (variant === "prominent") {
    return (
      <div
        className="grid w-full gap-2"
        style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
      >
        {LOCALES.map((l) => {
          const active = l.code === current;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => switchTo(l.code)}
              aria-current={active ? "page" : undefined}
              aria-label={l.full}
              title={l.full}
              className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 py-2 transition-all active:scale-[0.96]"
              style={{
                borderColor: active ? "var(--aiai-green-400)" : "var(--aiai-gray-200)",
                background: active ? "var(--aiai-green-50)" : "#fff",
                boxShadow: active ? "0 0 0 3px rgba(99, 153, 34, 0.12)" : "none",
              }}
            >
              <span className="text-xl leading-none" aria-hidden>
                {l.flag}
              </span>
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: active ? "var(--aiai-green-800)" : "var(--aiai-gray-500)" }}
              >
                {l.short}
              </span>
            </button>
          );
        })}
      </div>
    );
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
