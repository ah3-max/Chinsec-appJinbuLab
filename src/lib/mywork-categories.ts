/**
 * Static metadata for /mywork sections.
 * Counts come from DB at request time; this file just declares grouping,
 * display labels per locale, and the emoji shorthand.
 */

export interface CategoryDef {
  /** matches vocabularies.category column */
  code: string;
  emoji: string;
  /** the Chinese title shown alongside the localized label */
  hanziTitle: string;
  labels: { en: string; th: string; vi: string; id: string; "zh-TW": string };
}

export interface SectionDef {
  code: string;
  emoji: string;
  hanziTitle: string;
  labels: { en: string; th: string; vi: string; id: string; "zh-TW": string };
  categories: CategoryDef[];
}

export const MYWORK_SECTIONS: SectionDef[] = [
  {
    code: "job",
    emoji: "💼",
    hanziTitle: "職別 / 工作場域",
    labels: {
      en: "Job & Workplace",
      th: "ตำแหน่งงาน / สถานที่ทำงาน",
      vi: "Công việc & nơi làm việc",
      id: "Pekerjaan & Tempat Kerja",
      "zh-TW": "職別與工作場域",
    },
    categories: [
      {
        code: "hr-position",
        emoji: "👔",
        hanziTitle: "職別 / 職稱",
        labels: {
          en: "Positions / Job Titles",
          th: "ตำแหน่ง",
          vi: "Chức vụ",
          id: "Posisi / Jabatan",
          "zh-TW": "職別 / 職稱",
        },
      },
      {
        code: "hr-employment-type",
        emoji: "📋",
        hanziTitle: "任別",
        labels: {
          en: "Employment Type",
          th: "ประเภทการจ้าง",
          vi: "Loại hình lao động",
          id: "Jenis Pekerjaan",
          "zh-TW": "任別",
        },
      },
      {
        code: "hr-gender",
        emoji: "🚻",
        hanziTitle: "性別",
        labels: { en: "Gender", th: "เพศ", vi: "Giới tính", id: "Jenis Kelamin", "zh-TW": "性別" },
      },
      {
        code: "hr-education",
        emoji: "🎓",
        hanziTitle: "學歷",
        labels: {
          en: "Education Level",
          th: "ระดับการศึกษา",
          vi: "Trình độ học vấn",
          id: "Tingkat Pendidikan",
          "zh-TW": "學歷",
        },
      },
    ],
  },
  {
    code: "finance",
    emoji: "📊",
    hanziTitle: "財務報表詞彙",
    labels: {
      en: "Financial Statements",
      th: "ศัพท์งบการเงิน",
      vi: "Thuật ngữ Báo cáo tài chính",
      id: "Istilah Laporan Keuangan",
      "zh-TW": "財務報表詞彙",
    },
    categories: [
      {
        code: "finance-institution",
        emoji: "🏢",
        hanziTitle: "機構與單位",
        labels: {
          en: "Institutions & Units",
          th: "สถาบันและหน่วยงาน",
          vi: "Cơ quan và đơn vị",
          id: "Institusi & Unit",
          "zh-TW": "機構與單位",
        },
      },
      {
        code: "finance-report-type",
        emoji: "📊",
        hanziTitle: "報表類型",
        labels: {
          en: "Report Types",
          th: "ประเภทรายงาน",
          vi: "Loại báo cáo",
          id: "Jenis Laporan",
          "zh-TW": "報表類型",
        },
      },
      {
        code: "finance-period-header",
        emoji: "📅",
        hanziTitle: "期別與表頭",
        labels: {
          en: "Periods & Headers",
          th: "งวดและหัวตาราง",
          vi: "Kỳ và tiêu đề bảng",
          id: "Periode & Header",
          "zh-TW": "期別與表頭",
        },
      },
      {
        code: "finance-income",
        emoji: "💰",
        hanziTitle: "收入科目",
        labels: {
          en: "Income Items",
          th: "หมวดรายรับ",
          vi: "Khoản mục thu nhập",
          id: "Pos Pendapatan",
          "zh-TW": "收入科目",
        },
      },
      {
        code: "finance-expense-personnel",
        emoji: "💸",
        hanziTitle: "支出 - 人事費",
        labels: {
          en: "Expenses · Personnel",
          th: "รายจ่าย · บุคลากร",
          vi: "Chi phí · Nhân sự",
          id: "Pengeluaran · Personel",
          "zh-TW": "支出 · 人事費",
        },
      },
      {
        code: "finance-expense-office",
        emoji: "🏥",
        hanziTitle: "支出 - 事務 / 維護費",
        labels: {
          en: "Expenses · Office & Maintenance",
          th: "รายจ่าย · สำนักงาน/บำรุงรักษา",
          vi: "Chi phí · Văn phòng & bảo trì",
          id: "Pengeluaran · Kantor & Pemeliharaan",
          "zh-TW": "支出 · 事務/維護",
        },
      },
      {
        code: "finance-expense-insurance",
        emoji: "🛡️",
        hanziTitle: "支出 - 保險與其他",
        labels: {
          en: "Expenses · Insurance & Other",
          th: "รายจ่าย · ประกันและอื่นๆ",
          vi: "Chi phí · Bảo hiểm & khác",
          id: "Pengeluaran · Asuransi & Lainnya",
          "zh-TW": "支出 · 保險其他",
        },
      },
      {
        code: "finance-expense-operations",
        emoji: "🍱",
        hanziTitle: "支出 - 業務 / 材料費",
        labels: {
          en: "Expenses · Operations & Materials",
          th: "รายจ่าย · ดำเนินงาน/วัสดุ",
          vi: "Chi phí · Vận hành & vật liệu",
          id: "Pengeluaran · Operasional & Material",
          "zh-TW": "支出 · 業務材料",
        },
      },
      {
        code: "finance-admin-allocation",
        emoji: "📋",
        hanziTitle: "行政與分攤",
        labels: {
          en: "Administration & Allocation",
          th: "ค่าธุรการและการปันส่วน",
          vi: "Hành chính & Phân bổ",
          id: "Administrasi & Alokasi",
          "zh-TW": "行政與分攤",
        },
      },
      {
        code: "finance-profitloss",
        emoji: "📈",
        hanziTitle: "損益指標",
        labels: {
          en: "Profit & Loss Indicators",
          th: "ตัวชี้วัดกำไรขาดทุน",
          vi: "Chỉ số lãi lỗ",
          id: "Indikator Laba/Rugi",
          "zh-TW": "損益指標",
        },
      },
      {
        code: "finance-depreciation",
        emoji: "🏠",
        hanziTitle: "折舊資料表欄位",
        labels: {
          en: "Depreciation Sheet Fields",
          th: "คอลัมน์ตารางค่าเสื่อม",
          vi: "Các cột bảng khấu hao",
          id: "Kolom Tabel Penyusutan",
          "zh-TW": "折舊資料表欄位",
        },
      },
      {
        code: "finance-measure",
        emoji: "🔢",
        hanziTitle: "量詞與時間",
        labels: {
          en: "Measure Words & Time",
          th: "ลักษณนามและเวลา",
          vi: "Lượng từ và thời gian",
          id: "Kata Bantu & Waktu",
          "zh-TW": "量詞與時間",
        },
      },
      {
        code: "finance-equipment",
        emoji: "🛏️",
        hanziTitle: "設備資產名稱",
        labels: {
          en: "Equipment & Asset Names",
          th: "ชื่อทรัพย์สินและอุปกรณ์",
          vi: "Tên thiết bị & tài sản",
          id: "Nama Peralatan & Aset",
          "zh-TW": "設備資產名稱",
        },
      },
      {
        code: "finance-misc",
        emoji: "📝",
        hanziTitle: "補助 / 業務常用詞",
        labels: {
          en: "Subsidies & Business Common Terms",
          th: "ศัพท์ที่พบในหมายเหตุ",
          vi: "Trợ cấp & thuật ngữ thường dùng",
          id: "Subsidi & Istilah Umum",
          "zh-TW": "補助 · 常用詞",
        },
      },
    ],
  },
];

export type SupportedLocale = "en" | "th" | "vi" | "id" | "zh-TW";

export function pickLabel(
  labels: Record<string, string>,
  locale: string,
): string {
  const supported: SupportedLocale[] = ["en", "th", "vi", "id", "zh-TW"];
  const lc = (supported as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : "en";
  return labels[lc] ?? labels.en ?? Object.values(labels)[0] ?? "";
}

export function findCategoryByCode(code: string): { section: SectionDef; category: CategoryDef } | null {
  for (const s of MYWORK_SECTIONS) {
    const c = s.categories.find((x) => x.code === code);
    if (c) return { section: s, category: c };
  }
  return null;
}
