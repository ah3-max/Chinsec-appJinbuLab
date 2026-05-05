// Category → curated Unsplash photo mapping for AAY-FINANCE vocab
// Photo IDs are stable Unsplash CDN links — no API key required.

const CATEGORY_PHOTOS: Record<string, { id: string; alt: string }> = {
  "f01-org": {
    id: "1486325212027-8081e485255e",
    alt: "institution building",
  },
  "f02-report": {
    id: "1554224155-6726b3ff858f",
    alt: "financial report documents",
  },
  "f03-period": {
    id: "1611974789855-9c2a0a7236a3",
    alt: "calendar fiscal period",
  },
  "f04-income": {
    id: "1579621970563-ebec7560ff3e",
    alt: "income money finance",
  },
  "f05-personnel": {
    id: "1521737604082-ab33185eff00",
    alt: "HR staff personnel",
  },
  "f06-operating": {
    id: "1507003211169-0a1dd7228f2d",
    alt: "operating expenses warehouse",
  },
  "f07-insurance": {
    id: "1450101499163-c8848c66ca85",
    alt: "insurance protection",
  },
  "f08-material": {
    id: "1416879595882-3373a0480b5b",
    alt: "materials supplies",
  },
  "f09-admin": {
    id: "1497366216548-37526070297a",
    alt: "office administration",
  },
  "f10-profit": {
    id: "1460925895917-afdab827c52f",
    alt: "profit surplus growth",
  },
  "f11-deprec": {
    id: "1486312338219-ce68d2c6f44d",
    alt: "equipment fixed assets depreciation",
  },
  "f12-measure": {
    id: "1554224154-e4be2a27cbf5",
    alt: "counting numbers units",
  },
  "f13-asset": {
    id: "1568667256549-094345857ece",
    alt: "asset property",
  },
  "f14-glossary": {
    id: "1434030216411-0b5f4b6e0b79",
    alt: "glossary vocabulary reference",
  },
};

// Zhuyin / general Chinese learning categories
const LEVEL_PHOTOS: Record<string, { id: string; alt: string }> = {
  zhuyin: { id: "1456513080510-7bf3a84b82f8", alt: "learning study" },
  default: { id: "1434030216411-0b5f4b6e0b79", alt: "learning" },
};

export function getVocabImageUrl(
  category?: string | null,
  width = 400,
  height = 220,
): string {
  const found = category
    ? CATEGORY_PHOTOS[category] ?? LEVEL_PHOTOS[category]
    : null;
  const photo = found ?? LEVEL_PHOTOS.default!;
  return `https://images.unsplash.com/photo-${photo.id}?w=${width}&h=${height}&fit=crop&crop=center&q=75`;
}

export function getVocabImageAlt(category?: string | null): string {
  const found = category
    ? CATEGORY_PHOTOS[category] ?? LEVEL_PHOTOS[category]
    : null;
  return found?.alt ?? "vocabulary illustration";
}
