import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // === 愛愛院 中文學習 — 品牌色票 ===
        // 主綠系(百年茄苳樹意象)+ 暖橙(獎勵)+ 中性灰
        aiai: {
          green: {
            50: "#EAF3DE", // 嫩芽 / 主背景
            100: "#C0DD97", // 淺綠 / hover
            200: "#97C459", // 花園綠 / 進度條
            400: "#639922", // 主綠 / CTA / logo 邊框
            600: "#3B6D11", // 深綠 / 標題 / icon
            800: "#173404", // 深綠文字
          },
          orange: {
            50: "#FAEEDA",
            200: "#FAC775",
            400: "#EF9F27",
            600: "#BA7517", // 連勝燒火 / 獎勵
            800: "#633806",
          },
          gray: {
            50: "#F1EFE8",
            200: "#D3D1C7",
            400: "#888780",
            600: "#5F5E5A",
            800: "#2C2C2A",
          },
        },
        // === ChineseLearn 自訂色彩 (學習進度) ===
        learning: {
          new: "#3B82F6",        // 全新項目 - 藍
          progress: "#F59E0B",   // 學習中 - 琥珀
          mastered: "#10B981",   // 已掌握 - 綠
          leech: "#EF4444",      // 經常忘 - 紅
        },
        level: {
          zhuyin: "#A78BFA",     // 注音 - 紫
          a1: "#60A5FA",         // A1 - 淺藍
          a2: "#34D399",         // A2 - 綠
          b1: "#FBBF24",         // B1 - 黃
          b2: "#FB923C",         // B2 - 橘
          c1: "#F87171",         // C1 - 紅
          c2: "#A855F7",         // C2 - 紫
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-tc)", "system-ui", "sans-serif"],
        zhuyin: ["var(--font-bopomofo)", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        "celebrate": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-in": "bounce-in 0.5s ease-out",
        "shake": "shake 0.4s ease-in-out",
        "celebrate": "celebrate 0.6s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
