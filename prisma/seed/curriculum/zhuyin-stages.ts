// Zhuyin course stages Z1–Z9 — idempotent upsert by (courseId, code).
//
// Plan reference: .claude-context/03_curriculum.md "Level 0 注音預備班".
// We expand the 4 placeholder stages already in the main seed into the full
// 9-stage curriculum:
//   Z1 韻母基礎 (ㄚㄛㄜㄝ)
//   Z2 介符 + 複韻母 (ㄧㄨㄩ + ㄞㄟㄠㄡ)
//   Z3 聲隨韻母 + 捲舌韻 (ㄢㄣㄤㄥㄦ)
//   Z4 聲符基礎 (ㄅㄆㄇㄈㄉㄊㄋㄌ)
//   Z5 聲符進階 (ㄍㄎㄏㄐㄑㄒ)
//   Z6 聲符高階 (ㄓㄔㄕㄖㄗㄘㄙ) — 翹舌 vs 平舌,難點
//   Z7 聲調系統 (一二三四聲 + 輕聲)
//   Z8 結合韻完整應用 (22 個結合韻)
//   Z9 Boss 通關考試

import type { PrismaClient } from "@prisma/client";

interface StageDef {
  code: string;
  title: string;
  titleI18n: Record<string, string>;
  description: string;
  estimatedMin: number;
  hasBossLevel: boolean;
}

const STAGES: StageDef[] = [
  {
    code: "Z1",
    title: "韻母基礎 ㄚㄛㄜㄝ",
    titleI18n: {
      th: "สระพื้นฐาน ㄚㄛㄜㄝ",
      vi: "Nguyên âm cơ bản ㄚㄛㄜㄝ",
      id: "Vokal Dasar ㄚㄛㄜㄝ",
      en: "Basic finals ㄚㄛㄜㄝ",
    },
    description: "認識 4 個基礎韻母,口腔開合對比",
    estimatedMin: 60,
    hasBossLevel: false,
  },
  {
    code: "Z2",
    title: "介符與複韻母 ㄧㄨㄩ + ㄞㄟㄠㄡ",
    titleI18n: {
      th: "เสียงกลางและสระประสม ㄧㄨㄩ + ㄞㄟㄠㄡ",
      vi: "Âm đệm và nguyên âm đôi ㄧㄨㄩ + ㄞㄟㄠㄡ",
      id: "Medial dan Diftong ㄧㄨㄩ + ㄞㄟㄠㄡ",
      en: "Medials & diphthongs",
    },
    description: "3 個介符 + 4 個複韻母,辨音與聽寫",
    estimatedMin: 90,
    hasBossLevel: false,
  },
  {
    code: "Z3",
    title: "聲隨韻母 + 捲舌韻 ㄢㄣㄤㄥㄦ",
    titleI18n: {
      th: "สระตามด้วยเสียงนาสิก + ㄦ ม้วนลิ้น",
      vi: "Vần kèm âm mũi + âm cuộn lưỡi",
      id: "Final dengan nasal + ㄦ retroflex",
      en: "Nasal-coda finals + retroflex ㄦ",
    },
    description: "前/後鼻音對比,捲舌音收尾",
    estimatedMin: 90,
    hasBossLevel: false,
  },
  {
    code: "Z4",
    title: "聲符基礎 ㄅㄆㄇㄈㄉㄊㄋㄌ",
    titleI18n: {
      th: "พยัญชนะพื้นฐาน ㄅㄆㄇㄈㄉㄊㄋㄌ",
      vi: "Phụ âm cơ bản ㄅㄆㄇㄈㄉㄊㄋㄌ",
      id: "Konsonan Dasar ㄅㄆㄇㄈㄉㄊㄋㄌ",
      en: "Basic initials",
    },
    description: "送氣 / 不送氣對比,雙唇與舌尖音",
    estimatedMin: 120,
    hasBossLevel: false,
  },
  {
    code: "Z5",
    title: "聲符進階 ㄍㄎㄏㄐㄑㄒ",
    titleI18n: {
      th: "พยัญชนะระดับกลาง ㄍㄎㄏㄐㄑㄒ",
      vi: "Phụ âm trung cấp ㄍㄎㄏㄐㄑㄒ",
      id: "Konsonan Lanjut ㄍㄎㄏㄐㄑㄒ",
      en: "Velar & palatal initials",
    },
    description: "舌根音 + 舌面音,三拼結合練習",
    estimatedMin: 120,
    hasBossLevel: false,
  },
  {
    code: "Z6",
    title: "聲符高階 ㄓㄔㄕㄖㄗㄘㄙ",
    titleI18n: {
      th: "พยัญชนะระดับสูง ㄓㄔㄕㄖㄗㄘㄙ — แยกเสียงม้วนลิ้น/ไม่ม้วน",
      vi: "Phụ âm cao cấp — phân biệt cuộn / phẳng lưỡi",
      id: "Konsonan Tingkat Tinggi — retroflex vs alveolar",
      en: "Retroflex vs alveolar initials",
    },
    description: "全注音最難點:翹舌音(ㄓㄔㄕㄖ) vs 平舌音(ㄗㄘㄙ)",
    estimatedMin: 180,
    hasBossLevel: false,
  },
  {
    code: "Z7",
    title: "聲調系統 一二三四聲 + 輕聲",
    titleI18n: {
      th: "ระบบเสียงวรรณยุกต์ 1234 + เสียงเบา",
      vi: "Hệ thống thanh điệu 1234 + thanh nhẹ",
      id: "Sistem Nada 1234 + nada ringan",
      en: "Tone system + neutral tone",
    },
    description: "媽 麻 馬 罵 嗎 — 五聲對比,實際句中的聲調",
    estimatedMin: 120,
    hasBossLevel: false,
  },
  {
    code: "Z8",
    title: "結合韻完整應用",
    titleI18n: {
      th: "การประสมเสียงครบถ้วน 22 ชุด",
      vi: "Vần ghép đầy đủ 22 tổ hợp",
      id: "Final Gabungan Lengkap 22 kombinasi",
      en: "Compound finals (all 22)",
    },
    description: "完整音節拼讀:聲符 + 介符 + 韻符 + 聲調",
    estimatedMin: 180,
    hasBossLevel: false,
  },
  {
    code: "Z9",
    title: "Boss 通關 — 注音綜合測驗",
    titleI18n: {
      th: "บอสด่านสุดท้าย — ทดสอบจู้อินรวม",
      vi: "Vượt ải — bài thi tổng hợp Bopomofo",
      id: "Bos Akhir — ujian Zhuyin komprehensif",
      en: "Boss exam — comprehensive Zhuyin test",
    },
    description: "50 題綜合測驗(30 聽 + 20 寫),通過 80% 升級到 A1",
    estimatedMin: 60,
    hasBossLevel: true,
  },
];

export async function seedZhuyinStages(
  prisma: PrismaClient,
  courseId: string,
): Promise<number> {
  let i = 0;
  for (const s of STAGES) {
    await prisma.stage.upsert({
      where: { courseId_code: { courseId, code: s.code } },
      update: {
        title: s.title,
        titleI18n: s.titleI18n,
        description: s.description,
        orderIndex: i,
        hasBossLevel: s.hasBossLevel,
      },
      create: {
        courseId,
        code: s.code,
        title: s.title,
        titleI18n: s.titleI18n,
        description: s.description,
        orderIndex: i,
        hasBossLevel: s.hasBossLevel,
      },
    });
    i++;
  }
  return STAGES.length;
}
