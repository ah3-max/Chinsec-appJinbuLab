import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone", // Docker 部署用
  reactStrictMode: true,

  experimental: {
    // 預留 - 之後若要 server actions 大檔上傳調整
  },

  images: {
    remotePatterns: [
      // MinIO 內網
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "http", hostname: "minio", port: "9000" },
      // 未來生產
      { protocol: "https", hostname: "**" },
    ],
  },

  // PWA / 手機優化
  poweredByHeader: false,

  // 多語系由 next-intl 處理
  // i18n 不在這裡設，用 middleware
};

export default withNextIntl(nextConfig);
