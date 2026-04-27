import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ZhuyinTapExercise } from "@/components/zhuyin/zhuyin-tap-exercise";

export default async function ZhuyinTapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/practice`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回
        </Link>
        <h1 className="text-base font-semibold">注音聽音選字</h1>
        <div className="w-12" />
      </div>

      <ZhuyinTapExercise />
    </div>
  );
}
