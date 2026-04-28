"use client";

import { useTranslations } from "next-intl";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Dumbbell, ClipboardList, User } from "lucide-react";

const items = [
  { key: "learn", href: "learn", Icon: BookOpen },
  { key: "practice", href: "practice", Icon: Dumbbell },
  { key: "homework", href: "homework", Icon: ClipboardList },
  { key: "profile", href: "profile", Icon: User },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur pb-[env(safe-area-inset-bottom)]"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        borderColor: "var(--aiai-green-100)",
      }}
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch">
        {items.map(({ key, href, Icon }) => {
          const fullHref = `/${params.locale}/${href}`;
          const active =
            pathname === fullHref || pathname.startsWith(fullHref + "/");
          return (
            <li key={key} className="flex-1">
              <Link
                href={fullHref}
                className="flex h-full flex-col items-center justify-center gap-1 text-[11px] transition-colors"
                style={{
                  color: active
                    ? "var(--aiai-green-600)"
                    : "var(--aiai-gray-400)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon className="size-5" />
                <span>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
