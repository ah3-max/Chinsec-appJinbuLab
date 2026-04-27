import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");

  return (
    <div className="space-y-4 px-4">
      <h1 className="text-2xl font-bold">{tNav("practice")}</h1>

      <Link href={`/${locale}/practice/zhuyin`} className="block">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500 text-2xl font-bold text-white">
                ㄅ
              </div>
              <div>
                <CardTitle className="text-base">注音聽音選字</CardTitle>
                <CardDescription>ZHUYIN_TAP 題型 · 37 注音</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Card className="opacity-60">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          其他題型陸續上線中…
        </CardContent>
      </Card>
    </div>
  );
}
