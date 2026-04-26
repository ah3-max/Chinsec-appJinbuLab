"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Dumbbell, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex h-16 max-w-md items-stretch">
        {items.map(({ key, href, Icon }) => {
          const fullHref = `/${params.locale}/${href}`;
          const active =
            pathname === fullHref || pathname.startsWith(fullHref + "/");
          return (
            <li key={key} className="flex-1">
              <Link
                href={fullHref}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
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
