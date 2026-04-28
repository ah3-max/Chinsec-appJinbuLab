/**
 * scripts/generate-logo-assets.ts
 *
 * Renders the brand 「學」 logo as PNGs at the sizes PWA / favicons need.
 * Pure-SVG → sharp pipeline so we don't need a headless browser.
 *
 * 執行: npx tsx scripts/generate-logo-assets.ts
 *
 * Output: public/icons/icon-{32,64,128,192,512}.png
 *         public/icons/icon-512-maskable.png  (with 12% safe-zone padding)
 */

import { mkdir, writeFile } from "fs/promises";
import * as path from "path";
import sharp from "sharp";

const SIZES = [32, 64, 128, 192, 512] as const;
const OUT_DIR = path.resolve(process.cwd(), "public/icons");

const GREEN = "#639922";
const WHITE = "#FFFFFF";
const SAFE_BG = "#EAF3DE"; // maskable backdrop = aiai-green-50

function logoSvg(size: number): string {
  // Match the React Logo's geometry: border 22% radius, stroke ~3% of size,
  // 「學」 text centred at 56% font-size.
  const stroke = size <= 32 ? 2 : size <= 64 ? 2.5 : Math.round(size * 0.022);
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.56);
  // Stroke is centred, so inset the rect by half the stroke for a clean edge.
  const inset = stroke / 2;
  const innerSize = size - stroke;
  // dy for visual centring of the CJK glyph (matches dominant-baseline:central).
  const ty = Math.round(size * 0.5 + fontSize * 0.34);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${inset}" y="${inset}" width="${innerSize}" height="${innerSize}" rx="${radius}" ry="${radius}"
        fill="${WHITE}" stroke="${GREEN}" stroke-width="${stroke}"/>
  <text x="${size / 2}" y="${ty}" text-anchor="middle"
        font-family="PingFang TC, Noto Sans TC, system-ui, sans-serif"
        font-size="${fontSize}" font-weight="500" fill="${GREEN}">學</text>
</svg>`;
}

function maskableSvg(size: number): string {
  // Maskable icons need a 10–12% safe zone — render a smaller logo on a green-50
  // backdrop so Android's mask doesn't clip the 「學」.
  const inner = Math.round(size * 0.7);
  const offset = Math.round((size - inner) / 2);
  const stroke = Math.round(inner * 0.022);
  const radius = Math.round(inner * 0.22);
  const fontSize = Math.round(inner * 0.56);
  const ty = offset + Math.round(inner * 0.5 + fontSize * 0.34);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" fill="${SAFE_BG}"/>
  <rect x="${offset + stroke / 2}" y="${offset + stroke / 2}" width="${inner - stroke}" height="${inner - stroke}"
        rx="${radius}" ry="${radius}" fill="${WHITE}" stroke="${GREEN}" stroke-width="${stroke}"/>
  <text x="${size / 2}" y="${ty}" text-anchor="middle"
        font-family="PingFang TC, Noto Sans TC, system-ui, sans-serif"
        font-size="${fontSize}" font-weight="500" fill="${GREEN}">學</text>
</svg>`;
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function renderSvgToPng(svg: string, outPath: string, size: number) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
}

async function main() {
  console.log("🎨 Generating logo assets…");
  await ensureDir(OUT_DIR);

  for (const size of SIZES) {
    const svg = logoSvg(size);
    const out = path.join(OUT_DIR, `icon-${size}.png`);
    await renderSvgToPng(svg, out, size);
    // Also persist the SVG source for the largest size so it's editable later.
    if (size === 512) {
      await writeFile(path.join(OUT_DIR, "icon.svg"), svg, "utf-8");
    }
    console.log(`  ✓ ${path.basename(out)}`);
  }

  // Maskable variant for Android adaptive icons.
  const maskOut = path.join(OUT_DIR, "icon-512-maskable.png");
  await renderSvgToPng(maskableSvg(512), maskOut, 512);
  console.log(`  ✓ ${path.basename(maskOut)}`);

  // favicon.ico fallback — sharp can write ICO via raw passthrough; easiest is
  // to keep icon-32.png and let the link tag use it.
  console.log("✅ done.");
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
