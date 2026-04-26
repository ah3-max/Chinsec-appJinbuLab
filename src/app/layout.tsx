import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

// Noto Sans TC：繁體中文主字型
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChineseLearn",
  description: "愛愛院員工繁體中文學習平台",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3B82F6",
};

// Root layout 不指定 lang（由 [locale] layout 動態決定）
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={notoSansTC.variable} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
