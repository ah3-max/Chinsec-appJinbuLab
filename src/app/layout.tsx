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
  title: "JinBuLap",
  description: "JinBuLap · Mandarin Learning",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#639922",
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
