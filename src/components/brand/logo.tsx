// 愛愛院 中文學習 — brand logo.
//
// 白底 + 主綠 (--aiai-green-400 #639922) 邊框 + 「學」字。靈感來自愛愛院的
// 百年茄苳樹、簡潔書法,設計上刻意維持單色與大字符以利在 32px 也清晰。

import * as React from "react";

interface LogoProps {
  size?: 32 | 48 | 64 | 80 | 96 | 128;
  showText?: boolean;
  variant?: "default" | "monochrome" | "inverted";
}

export function Logo({
  size = 64,
  showText = false,
  variant = "default",
}: LogoProps) {
  const borderWidth = size <= 32 ? 2 : size <= 64 ? 2.5 : 3;
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.56);

  const colors = {
    default: { bg: "#FFFFFF", border: "#639922", text: "#639922" },
    monochrome: { bg: "#FFFFFF", border: "#2C2C2A", text: "#2C2C2A" },
    inverted: { bg: "#639922", border: "#639922", text: "#FFFFFF" },
  }[variant];

  const square = (
    <span
      role="img"
      aria-label="JinBuLap logo"
      style={{
        width: size,
        height: size,
        background: colors.bg,
        border: `${borderWidth}px solid ${colors.border}`,
        borderRadius: radius,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.text,
        fontSize,
        fontWeight: 500,
        lineHeight: 1,
        fontFamily:
          'system-ui, -apple-system, "PingFang TC", "Noto Sans TC", sans-serif',
        userSelect: "none",
      }}
    >
      學
    </span>
  );

  if (!showText) return square;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      {square}
      <span style={{ display: "inline-flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: Math.round(size * 0.32),
            fontWeight: 500,
            lineHeight: 1.1,
            color: "var(--aiai-gray-800)",
            letterSpacing: "0.02em",
          }}
        >
          JinBuLap
        </span>
        <span
          style={{
            fontSize: Math.round(size * 0.18),
            color: "var(--aiai-green-600)",
            marginTop: 2,
            lineHeight: 1.3,
            letterSpacing: "0.04em",
          }}
        >
          JinBuLap · Mandarin Learning
        </span>
      </span>
    </span>
  );
}
