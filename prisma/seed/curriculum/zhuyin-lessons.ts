// Zhuyin lessons Z1-L01 .. Z8-L05 (~29 lessons total).
//
// Each Z-stage breaks down into 3–5 lessons following the pattern:
//   L01 認識符號 (ZHUYIN_INTRO)
//   L02 辨音練習 (ZHUYIN_PRACTICE)
//   L03 拼讀練習 (ZHUYIN_PRACTICE)
//   L04 對比練習 (ZHUYIN_PRACTICE) — only on stages with contrast pairs
//
// Content is held as JSON on Lesson.content with shape:
//   {
//     intro: zh-TW description (50–200 chars),
//     introI18n: { th, vi, id, en },     // first-pass translations,
//     covers: ["ㄚ", ...],                // Bopomofo symbols this lesson teaches
//     examples: [{ hanzi, zhuyin, pinyin, gloss }, ...],
//     tips: [zh-TW strings],             // pronunciation tips
//   }

import type { PrismaClient, LessonType as LessonTypeT } from "@prisma/client";
import { LessonType } from "@prisma/client";

interface LessonDef {
  stageCode: string;
  code: string;
  title: string;
  titleI18n: Record<string, string>;
  type: LessonTypeT;
  estimatedMinutes: number;
  content: {
    intro: string;
    introI18n: Record<string, string>;
    covers: string[];
    examples: Array<{ hanzi: string; zhuyin: string; pinyin: string; gloss?: string }>;
    tips?: string[];
  };
}

// Convenience: a tiny set of glosses so examples carry meaning.
function ex(
  hanzi: string,
  zhuyin: string,
  pinyin: string,
  gloss?: string,
) {
  return { hanzi, zhuyin, pinyin, gloss };
}

const LESSONS: LessonDef[] = [
  // ═════════════════════════════════════════════════════════════
  // Z1 韻母基礎 ㄚㄛㄜㄝ — 3 lessons
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z1",
    code: "Z1-L01",
    title: "認識四個基礎韻母 ㄚㄛㄜㄝ",
    titleI18n: {
      th: "รู้จัก 4 สระพื้นฐาน ㄚㄛㄜㄝ",
      vi: "Làm quen 4 nguyên âm cơ bản ㄚㄛㄜㄝ",
      id: "Mengenal 4 vokal dasar ㄚㄛㄜㄝ",
      en: "Meet the 4 basic finals",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 15,
    content: {
      intro:
        "這四個是中文最常見的單韻母。差別在嘴巴張開的程度與舌頭位置:ㄚ 嘴巴最大、ㄛ 圓唇後退、ㄜ 嘴半開不圓、ㄝ 舌頭抵下牙嘴橫開。",
      introI18n: {
        th: "4 สระเดี่ยวที่พบบ่อยในจีน ต่างกันที่การเปิดปากและตำแหน่งลิ้น",
        vi: "4 nguyên âm đơn phổ biến trong tiếng Trung, khác biệt ở độ mở miệng và vị trí lưỡi",
        id: "4 vokal tunggal yang paling umum dalam Mandarin — beda di bukaan mulut dan posisi lidah",
        en: "Four common single finals; they differ by mouth opening and tongue position",
      },
      covers: ["ㄚ", "ㄛ", "ㄜ", "ㄝ"],
      examples: [
        ex("阿", "ㄚ", "ā", "interjection"),
        ex("我", "ㄨㄛˇ", "wǒ", "I/me"),
        ex("餓", "ㄜˋ", "è", "hungry"),
        ex("謝", "ㄒㄧㄝˋ", "xiè", "thank"),
      ],
      tips: ["ㄚ 像看醫生說 ah 那樣張大嘴", "ㄛ 嘴唇變圓像吹蠟燭"],
    },
  },
  {
    stageCode: "Z1",
    code: "Z1-L02",
    title: "辨音練習:四韻母聽寫",
    titleI18n: {
      th: "ฝึกแยกเสียง 4 สระพื้นฐาน",
      vi: "Luyện nghe phân biệt 4 nguyên âm",
      id: "Latihan membedakan 4 vokal",
      en: "Listen-and-pick the four finals",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 20,
    content: {
      intro: "聽到聲音後選對符號。建議閉眼專心聽兩遍,再決定。",
      introI18n: {
        th: "ฟังเสียงแล้วเลือกสัญลักษณ์ที่ถูกต้อง — ฟัง 2 รอบก่อนตัดสินใจ",
        vi: "Nghe và chọn ký hiệu đúng — nghe 2 lần trước khi chọn",
        id: "Dengarkan dan pilih simbol yang benar — dengar 2 kali dulu",
        en: "Listen and pick the right symbol — replay before answering",
      },
      covers: ["ㄚ", "ㄛ", "ㄜ", "ㄝ"],
      examples: [],
    },
  },
  {
    stageCode: "Z1",
    code: "Z1-L03",
    title: "拼讀:加聲調的四韻母",
    titleI18n: {
      th: "ออกเสียงพร้อมวรรณยุกต์",
      vi: "Đọc với thanh điệu",
      id: "Membaca dengan nada",
      en: "Read with tone marks",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 25,
    content: {
      intro:
        "把 ㄚㄛㄜㄝ 各自配上一二三四聲念出來。重點不是準確,而是聽得出差異。",
      introI18n: {
        th: "อ่านสระทั้ง 4 พร้อมวรรณยุกต์ 1234 — ไม่ต้องเป๊ะ ฟังออกความต่างก็พอ",
        vi: "Đọc 4 nguyên âm với 4 thanh — không cần chuẩn xác, miễn nghe ra khác biệt",
        id: "Baca 4 vokal dengan 4 nada — tidak perlu sempurna, asal terdengar bedanya",
        en: "Pronounce each final with each tone — accuracy second to hearing the difference",
      },
      covers: ["ㄚ", "ㄛ", "ㄜ", "ㄝ"],
      examples: [
        ex("媽", "ㄇㄚ", "mā", "mother"),
        ex("麻", "ㄇㄚˊ", "má", "hemp"),
        ex("馬", "ㄇㄚˇ", "mǎ", "horse"),
        ex("罵", "ㄇㄚˋ", "mà", "scold"),
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z2 介符 ㄧㄨㄩ + 複韻母 ㄞㄟㄠㄡ — 4 lessons
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z2",
    code: "Z2-L01",
    title: "介符 ㄧㄨㄩ",
    titleI18n: {
      th: "เสียงกลาง ㄧㄨㄩ",
      vi: "Âm đệm ㄧㄨㄩ",
      id: "Medial ㄧㄨㄩ",
      en: "Medials ㄧㄨㄩ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 20,
    content: {
      intro:
        "介符是夾在聲符與韻符中間的滑音。ㄧ 像英文 ee、ㄨ 像 oo、ㄩ 是把 ㄧ 的舌位配上 ㄨ 的圓唇,華語特色音。",
      introI18n: {
        th: "เสียงกลาง 3 ตัว: ㄧ คล้าย ee, ㄨ คล้าย oo, ㄩ เป็นเอกลักษณ์ของจีน",
        vi: "3 âm đệm: ㄧ giống ee, ㄨ giống oo, ㄩ đặc trưng tiếng Trung",
        id: "3 medial: ㄧ seperti ee, ㄨ seperti oo, ㄩ khas Mandarin",
        en: "Three medials: ㄧ like ee, ㄨ like oo, ㄩ unique to Chinese",
      },
      covers: ["ㄧ", "ㄨ", "ㄩ"],
      examples: [
        ex("一", "ㄧ", "yī", "one"),
        ex("五", "ㄨˇ", "wǔ", "five"),
        ex("魚", "ㄩˊ", "yú", "fish"),
      ],
      tips: ["ㄩ 嘴型像吹口哨,但舌頭和 ㄧ 同位置"],
    },
  },
  {
    stageCode: "Z2",
    code: "Z2-L02",
    title: "複韻母 ㄞㄟㄠㄡ",
    titleI18n: {
      th: "สระประสม ㄞㄟㄠㄡ",
      vi: "Nguyên âm đôi ㄞㄟㄠㄡ",
      id: "Diftong ㄞㄟㄠㄡ",
      en: "Diphthong finals ㄞㄟㄠㄡ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 20,
    content: {
      intro:
        "兩個母音連在一起念。ㄞ=a→i (愛), ㄟ=e→i (誰), ㄠ=a→u (好), ㄡ=o→u (夠)。重音在前,後音輕滑過。",
      introI18n: {
        th: "เสียงสระ 2 ตัวต่อกัน เน้นตัวแรก ตัวหลังกล่าวเร็ว",
        vi: "Hai nguyên âm nối liền, nhấn vào phần đầu",
        id: "Dua vokal disambung, tekanan di yang pertama",
        en: "Two vowels glide together; stress on the first",
      },
      covers: ["ㄞ", "ㄟ", "ㄠ", "ㄡ"],
      examples: [
        ex("愛", "ㄞˋ", "ài", "love"),
        ex("誰", "ㄕㄟˊ", "shéi", "who"),
        ex("好", "ㄏㄠˇ", "hǎo", "good"),
        ex("夠", "ㄍㄡˋ", "gòu", "enough"),
      ],
    },
  },
  {
    stageCode: "Z2",
    code: "Z2-L03",
    title: "辨音:介符與複韻母聽寫",
    titleI18n: {
      th: "ฝึกแยกเสียงกลางและสระประสม",
      vi: "Luyện phân biệt âm đệm và đôi",
      id: "Bedakan medial dan diftong",
      en: "Distinguish medials vs diphthongs",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 25,
    content: {
      intro: "ㄟ 跟 ㄞ 容易混。練到能 8/10 對為止。",
      introI18n: {
        th: "ㄟ กับ ㄞ มักสับสน ฝึกจนตอบถูก 8/10",
        vi: "ㄟ và ㄞ dễ nhầm — luyện đến khi đúng 8/10",
        id: "ㄟ dan ㄞ sering tertukar — latih hingga benar 8/10",
        en: "ㄟ and ㄞ are easy to mix up — drill until 8/10",
      },
      covers: ["ㄧ", "ㄨ", "ㄩ", "ㄞ", "ㄟ", "ㄠ", "ㄡ"],
      examples: [],
    },
  },
  {
    stageCode: "Z2",
    code: "Z2-L04",
    title: "拼讀:介符 + 韻符組合",
    titleI18n: {
      th: "อ่านเสียงกลาง + สระร่วมกัน",
      vi: "Đọc kết hợp âm đệm + nguyên âm",
      id: "Baca kombinasi medial + vokal",
      en: "Read medial + final combos",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 25,
    content: {
      intro: "ㄧㄚ → 呀, ㄧㄠ → 要, ㄨㄛ → 我, ㄩㄝ → 月。試試看連著念。",
      introI18n: {
        th: "ลองออกเสียงต่อกัน เช่น ㄧㄚ→呀, ㄨㄛ→我, ㄩㄝ→月",
        vi: "Thử đọc liền: ㄧㄚ→呀, ㄨㄛ→我, ㄩㄝ→月",
        id: "Coba sambung: ㄧㄚ→呀, ㄨㄛ→我, ㄩㄝ→月",
        en: "Try blending: ㄧㄚ→呀, ㄨㄛ→我, ㄩㄝ→月",
      },
      covers: ["ㄧ", "ㄨ", "ㄩ", "ㄚ", "ㄛ", "ㄝ"],
      examples: [
        ex("呀", "ㄧㄚ", "ya"),
        ex("要", "ㄧㄠˋ", "yào", "want"),
        ex("我", "ㄨㄛˇ", "wǒ", "I"),
        ex("月", "ㄩㄝˋ", "yuè", "moon"),
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z3 聲隨韻母 + 捲舌韻 ㄢㄣㄤㄥㄦ — 3 lessons
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z3",
    code: "Z3-L01",
    title: "前鼻音 ㄢㄣ",
    titleI18n: {
      th: "เสียงนาสิกหน้า ㄢㄣ",
      vi: "Âm mũi trước ㄢㄣ",
      id: "Nasal depan ㄢㄣ",
      en: "Front nasals ㄢㄣ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 20,
    content: {
      intro:
        "舌頭抵上門牙後方收尾。ㄢ 是 a+n,ㄣ 是 e+n。看 (ㄎㄢˋ) 和 很 (ㄏㄣˇ) 是常用例字。",
      introI18n: {
        th: "ลิ้นแตะหลังฟันบนปิดเสียง — ㄢ=a+n, ㄣ=e+n",
        vi: "Lưỡi chạm sau răng cửa — ㄢ=a+n, ㄣ=e+n",
        id: "Lidah sentuh belakang gigi atas — ㄢ=a+n, ㄣ=e+n",
        en: "Tongue tip touches behind upper teeth — ㄢ=a+n, ㄣ=e+n",
      },
      covers: ["ㄢ", "ㄣ"],
      examples: [
        ex("看", "ㄎㄢˋ", "kàn", "see"),
        ex("很", "ㄏㄣˇ", "hěn", "very"),
      ],
    },
  },
  {
    stageCode: "Z3",
    code: "Z3-L02",
    title: "後鼻音 ㄤㄥ",
    titleI18n: {
      th: "เสียงนาสิกหลัง ㄤㄥ",
      vi: "Âm mũi sau ㄤㄥ",
      id: "Nasal belakang ㄤㄥ",
      en: "Back nasals ㄤㄥ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro:
        "舌頭後縮,鼻腔共鳴更明顯。ㄤ 是 a+ng,ㄥ 是 e+ng。前後鼻音對比是東南亞學員最常出錯的點。",
      introI18n: {
        th: "ลิ้นถอย เสียงก้องในจมูก — แยก ㄢ/ㄤ และ ㄣ/ㄥ ให้ได้",
        vi: "Lưỡi lui sau, vang ở mũi — phân biệt ㄢ/ㄤ và ㄣ/ㄥ",
        id: "Lidah mundur, beresonansi di hidung — bedakan ㄢ/ㄤ dan ㄣ/ㄥ",
        en: "Tongue retracts, nasal resonance — practice ㄢ/ㄤ vs ㄣ/ㄥ contrast",
      },
      covers: ["ㄤ", "ㄥ"],
      examples: [
        ex("幫", "ㄅㄤ", "bāng", "help"),
        ex("等", "ㄉㄥˇ", "děng", "wait"),
      ],
      tips: ["唸 ng 時感覺整個聲音從鼻子出來"],
    },
  },
  {
    stageCode: "Z3",
    code: "Z3-L03",
    title: "捲舌韻 ㄦ + 前後鼻音對比",
    titleI18n: {
      th: "ㄦ ม้วนลิ้น + แยกเสียงนาสิกหน้า/หลัง",
      vi: "ㄦ cuộn lưỡi + phân biệt âm mũi trước/sau",
      id: "ㄦ retroflex + nasal depan vs belakang",
      en: "Retroflex ㄦ + front-vs-back nasal drill",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 30,
    content: {
      intro:
        "ㄦ 舌尖向上輕捲,類似英文 er。本課做大量對比練習,目標 8/10 正確。",
      introI18n: {
        th: "ㄦ ม้วนปลายลิ้นเล็กน้อย คล้าย er — และฝึกแยกเสียงนาสิก",
        vi: "ㄦ cuộn nhẹ đầu lưỡi, giống er — luyện phân biệt nasal",
        id: "ㄦ lengkungkan ujung lidah, seperti er — latih beda nasal",
        en: "ㄦ lightly curl tongue tip — drill all nasal contrasts",
      },
      covers: ["ㄦ", "ㄢ", "ㄣ", "ㄤ", "ㄥ"],
      examples: [
        ex("二", "ㄦˋ", "èr", "two"),
        ex("耳", "ㄦˇ", "ěr", "ear"),
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z4 聲符基礎 ㄅㄆㄇㄈㄉㄊㄋㄌ — 4 lessons (incl. contrast)
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z4",
    code: "Z4-L01",
    title: "雙唇音 ㄅㄆㄇ + 唇齒音 ㄈ",
    titleI18n: {
      th: "พยัญชนะริมฝีปาก ㄅㄆㄇㄈ",
      vi: "Phụ âm môi ㄅㄆㄇㄈ",
      id: "Konsonan bibir ㄅㄆㄇㄈ",
      en: "Labial initials ㄅㄆㄇㄈ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro:
        "ㄅㄆ 都是雙唇塞音,差在送氣 — ㄅ 不送、ㄆ 送 (像 papa 跟 baba 的 p)。ㄇ 鼻音、ㄈ 唇齒。",
      introI18n: {
        th: "ㄅ/ㄆ ต่างที่ลมหายใจ ㄇ ลงจมูก ㄈ ใช้ฟันบน + ปากล่าง",
        vi: "ㄅ/ㄆ khác ở luồng khí — ㄇ qua mũi, ㄈ răng-môi",
        id: "ㄅ/ㄆ beda di hembusan — ㄇ ke hidung, ㄈ gigi atas + bibir bawah",
        en: "ㄅ/ㄆ aspiration contrast; ㄇ nasal; ㄈ labiodental",
      },
      covers: ["ㄅ", "ㄆ", "ㄇ", "ㄈ"],
      examples: [
        ex("爸", "ㄅㄚˋ", "bà", "dad"),
        ex("怕", "ㄆㄚˋ", "pà", "afraid"),
        ex("媽", "ㄇㄚ", "mā", "mom"),
        ex("發", "ㄈㄚ", "fā", "send"),
      ],
      tips: ["送氣音前面放紙會被吹動;不送氣不會"],
    },
  },
  {
    stageCode: "Z4",
    code: "Z4-L02",
    title: "舌尖音 ㄉㄊㄋㄌ",
    titleI18n: {
      th: "พยัญชนะปลายลิ้น ㄉㄊㄋㄌ",
      vi: "Phụ âm đầu lưỡi ㄉㄊㄋㄌ",
      id: "Konsonan ujung lidah ㄉㄊㄋㄌ",
      en: "Alveolar initials ㄉㄊㄋㄌ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro: "舌尖抵上齒齦。ㄉ 不送氣、ㄊ 送氣、ㄋ 鼻音、ㄌ 邊音。",
      introI18n: {
        th: "ปลายลิ้นแตะเหงือก — ㄉ/ㄊ แยกที่ลม ㄋ ลงจมูก ㄌ เลื่อนข้าง",
        vi: "Đầu lưỡi chạm lợi — ㄉ/ㄊ khác hơi, ㄋ qua mũi, ㄌ bên",
        id: "Ujung lidah ke gusi — ㄉ/ㄊ beda hembusan, ㄋ nasal, ㄌ lateral",
        en: "Tongue tip on alveolar ridge — ㄉ/ㄊ aspiration, ㄋ nasal, ㄌ lateral",
      },
      covers: ["ㄉ", "ㄊ", "ㄋ", "ㄌ"],
      examples: [
        ex("大", "ㄉㄚˋ", "dà", "big"),
        ex("他", "ㄊㄚ", "tā", "he"),
        ex("拿", "ㄋㄚˊ", "ná", "take"),
        ex("來", "ㄌㄞˊ", "lái", "come"),
      ],
    },
  },
  {
    stageCode: "Z4",
    code: "Z4-L03",
    title: "辨音:8 個聲符聽寫",
    titleI18n: {
      th: "ฝึกแยกเสียงพยัญชนะ 8 ตัว",
      vi: "Luyện phân biệt 8 phụ âm",
      id: "Bedakan 8 konsonan",
      en: "Pick the right initial (8 options)",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 25,
    content: {
      intro: "從 ㄅㄆㄇㄈㄉㄊㄋㄌ 中選對。",
      introI18n: {
        th: "ฟังแล้วเลือกจาก ㄅㄆㄇㄈㄉㄊㄋㄌ",
        vi: "Nghe và chọn từ ㄅㄆㄇㄈㄉㄊㄋㄌ",
        id: "Dengarkan dan pilih dari ㄅㄆㄇㄈㄉㄊㄋㄌ",
        en: "Listen and pick from the 8 initials",
      },
      covers: ["ㄅ", "ㄆ", "ㄇ", "ㄈ", "ㄉ", "ㄊ", "ㄋ", "ㄌ"],
      examples: [],
    },
  },
  {
    stageCode: "Z4",
    code: "Z4-L04",
    title: "對比練習:送氣 vs 不送氣",
    titleI18n: {
      th: "ฝึกแยก ลม vs ไม่ลม",
      vi: "Luyện phân biệt bật hơi / không bật hơi",
      id: "Latihan aspirasi vs tidak",
      en: "Aspirated vs unaspirated drill",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 25,
    content: {
      intro: "ㄅ vs ㄆ、ㄉ vs ㄊ — 連續對比聽 30 組。",
      introI18n: {
        th: "ㄅ/ㄆ และ ㄉ/ㄊ — ฟัง 30 คู่ตัดสินใจเร็ว",
        vi: "ㄅ/ㄆ và ㄉ/ㄊ — nghe 30 cặp, quyết định nhanh",
        id: "ㄅ/ㄆ dan ㄉ/ㄊ — dengar 30 pasang, putuskan cepat",
        en: "30 minimal pairs back-to-back, decide fast",
      },
      covers: ["ㄅ", "ㄆ", "ㄉ", "ㄊ"],
      examples: [
        ex("爸", "ㄅㄚˋ", "bà"),
        ex("怕", "ㄆㄚˋ", "pà"),
        ex("大", "ㄉㄚˋ", "dà"),
        ex("他", "ㄊㄚ", "tā"),
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z5 聲符進階 ㄍㄎㄏㄐㄑㄒ — 3 lessons
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z5",
    code: "Z5-L01",
    title: "舌根音 ㄍㄎㄏ",
    titleI18n: {
      th: "พยัญชนะโคนลิ้น ㄍㄎㄏ",
      vi: "Phụ âm gốc lưỡi ㄍㄎㄏ",
      id: "Konsonan pangkal lidah ㄍㄎㄏ",
      en: "Velar initials ㄍㄎㄏ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro:
        "舌根抬向軟顎。ㄍ 不送氣、ㄎ 送氣、ㄏ 摩擦音(像吐氣的哈)。",
      introI18n: {
        th: "โคนลิ้นยกขึ้นไปเพดานอ่อน — ㄍ/ㄎ ลม, ㄏ เสียดแทรก",
        vi: "Gốc lưỡi nâng lên vòm mềm — ㄍ/ㄎ hơi, ㄏ ma sát",
        id: "Pangkal lidah naik ke langit lunak — ㄍ/ㄎ aspirasi, ㄏ frikatif",
        en: "Tongue back rises to soft palate — ㄍ/ㄎ stop, ㄏ fricative",
      },
      covers: ["ㄍ", "ㄎ", "ㄏ"],
      examples: [
        ex("哥", "ㄍㄜ", "gē", "older brother"),
        ex("看", "ㄎㄢˋ", "kàn", "see"),
        ex("好", "ㄏㄠˇ", "hǎo", "good"),
      ],
    },
  },
  {
    stageCode: "Z5",
    code: "Z5-L02",
    title: "舌面音 ㄐㄑㄒ",
    titleI18n: {
      th: "พยัญชนะกลางลิ้น ㄐㄑㄒ",
      vi: "Phụ âm mặt lưỡi ㄐㄑㄒ",
      id: "Konsonan tengah lidah ㄐㄑㄒ",
      en: "Palatal initials ㄐㄑㄒ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro:
        "舌面抵硬顎前。ㄐㄑㄒ 後面只能接 ㄧ 或 ㄩ。家(ㄐㄧㄚ)、去(ㄑㄩˋ)、謝(ㄒㄧㄝˋ)。",
      introI18n: {
        th: "กลางลิ้นแตะเพดานแข็ง ㄐㄑㄒ ตามด้วย ㄧ หรือ ㄩ เท่านั้น",
        vi: "Mặt lưỡi chạm vòm cứng, ㄐㄑㄒ chỉ kết hợp với ㄧ hoặc ㄩ",
        id: "Tengah lidah ke langit keras, ㄐㄑㄒ hanya bertemu ㄧ atau ㄩ",
        en: "Tongue blade to hard palate; ㄐㄑㄒ only combine with ㄧ or ㄩ",
      },
      covers: ["ㄐ", "ㄑ", "ㄒ"],
      examples: [
        ex("家", "ㄐㄧㄚ", "jiā", "home"),
        ex("去", "ㄑㄩˋ", "qù", "go"),
        ex("謝", "ㄒㄧㄝˋ", "xiè", "thank"),
      ],
    },
  },
  {
    stageCode: "Z5",
    code: "Z5-L03",
    title: "三拼結合練習",
    titleI18n: {
      th: "ประสมเสียง 3 ส่วน",
      vi: "Ghép 3 phần (phụ âm + đệm + vần)",
      id: "Gabungan 3 bagian",
      en: "Initial + medial + final blending",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 30,
    content: {
      intro: "聲符 + 介符 + 韻符 連著快速念出來。如 ㄐㄧㄚ → 家。",
      introI18n: {
        th: "พยัญชนะ + เสียงกลาง + สระ ออกเสียงต่อเนื่อง",
        vi: "Phụ âm + đệm + vần — đọc liền mạch",
        id: "Konsonan + medial + vokal — ucapkan menyatu",
        en: "Initial + medial + final, all one breath",
      },
      covers: ["ㄐ", "ㄑ", "ㄒ", "ㄍ", "ㄎ", "ㄏ"],
      examples: [
        ex("家", "ㄐㄧㄚ", "jiā"),
        ex("去", "ㄑㄩˋ", "qù"),
        ex("好", "ㄏㄠˇ", "hǎo"),
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z6 聲符高階 ㄓㄔㄕㄖㄗㄘㄙ — 5 lessons (the hardest)
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z6",
    code: "Z6-L01",
    title: "翹舌音 ㄓㄔㄕㄖ",
    titleI18n: {
      th: "พยัญชนะม้วนลิ้น ㄓㄔㄕㄖ",
      vi: "Phụ âm cuộn lưỡi ㄓㄔㄕㄖ",
      id: "Konsonan retroflex ㄓㄔㄕㄖ",
      en: "Retroflex initials ㄓㄔㄕㄖ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 30,
    content: {
      intro:
        "舌尖抵上顎前(不要碰齒齦),感覺像含話梅。ㄓㄔ 對應 ㄗㄘ,ㄕㄖ 對應 ㄙ。",
      introI18n: {
        th: "ม้วนปลายลิ้นไปด้านหน้าเพดาน — เป็นจุดยากสุด",
        vi: "Cuộn đầu lưỡi lên trước vòm — phần khó nhất",
        id: "Lengkungkan ujung lidah — bagian tersulit",
        en: "Curl tongue tip to front of palate — the hardest contrast",
      },
      covers: ["ㄓ", "ㄔ", "ㄕ", "ㄖ"],
      examples: [
        ex("知", "ㄓ", "zhī", "know"),
        ex("吃", "ㄔ", "chī", "eat"),
        ex("是", "ㄕˋ", "shì", "be"),
        ex("人", "ㄖㄣˊ", "rén", "person"),
      ],
      tips: ["剛開始可以誇張捲舌,熟悉後自然放鬆"],
    },
  },
  {
    stageCode: "Z6",
    code: "Z6-L02",
    title: "平舌音 ㄗㄘㄙ",
    titleI18n: {
      th: "พยัญชนะลิ้นแบน ㄗㄘㄙ",
      vi: "Phụ âm lưỡi phẳng ㄗㄘㄙ",
      id: "Konsonan lidah datar ㄗㄘㄙ",
      en: "Alveolar sibilants ㄗㄘㄙ",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro: "舌尖往前抵下齒,完全不捲。ㄗ 像 z、ㄘ 像 ts、ㄙ 像 s。",
      introI18n: {
        th: "ปลายลิ้นไปฟันล่าง ไม่ม้วน — ㄗ=z, ㄘ=ts, ㄙ=s",
        vi: "Đầu lưỡi đẩy sát răng dưới, không cuộn",
        id: "Ujung lidah ke gigi bawah, tidak melengkung",
        en: "Tongue tip down to lower teeth — flat, not curled",
      },
      covers: ["ㄗ", "ㄘ", "ㄙ"],
      examples: [
        ex("字", "ㄗˋ", "zì", "character"),
        ex("次", "ㄘˋ", "cì", "time"),
        ex("三", "ㄙㄢ", "sān", "three"),
      ],
    },
  },
  {
    stageCode: "Z6",
    code: "Z6-L03",
    title: "對比:翹舌 vs 平舌",
    titleI18n: {
      th: "เปรียบเทียบ ม้วน vs ไม่ม้วน",
      vi: "So sánh cuộn lưỡi vs phẳng lưỡi",
      id: "Bandingkan retroflex vs alveolar",
      en: "Retroflex vs alveolar contrast",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 35,
    content: {
      intro:
        "ㄓ vs ㄗ、ㄔ vs ㄘ、ㄕ vs ㄙ — 三組是台灣中文最重要的對比。本課練 40 組。",
      introI18n: {
        th: "ㄓ/ㄗ, ㄔ/ㄘ, ㄕ/ㄙ — สามคู่สำคัญที่สุดในจีนไต้หวัน ฝึก 40 คู่",
        vi: "ㄓ/ㄗ, ㄔ/ㄘ, ㄕ/ㄙ — ba cặp quan trọng nhất; luyện 40 cặp",
        id: "ㄓ/ㄗ, ㄔ/ㄘ, ㄕ/ㄙ — tiga pasangan paling penting; 40 pasang",
        en: "The three core contrasts; 40 minimal pairs",
      },
      covers: ["ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ"],
      examples: [
        ex("知", "ㄓ", "zhī"),
        ex("字", "ㄗˋ", "zì"),
        ex("吃", "ㄔ", "chī"),
        ex("次", "ㄘˋ", "cì"),
      ],
    },
  },
  {
    stageCode: "Z6",
    code: "Z6-L04",
    title: "ㄖ 的特殊唸法",
    titleI18n: {
      th: "การออกเสียง ㄖ พิเศษ",
      vi: "Cách phát âm đặc biệt của ㄖ",
      id: "Pengucapan khusus ㄖ",
      en: "The special ㄖ sound",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 20,
    content: {
      intro:
        "ㄖ 是濁音、捲舌摩擦,像英文 r 但更重。例:人(ㄖㄣˊ)、肉(ㄖㄡˋ)、熱(ㄖㄜˋ)。",
      introI18n: {
        th: "ㄖ เป็นเสียงม้วนลิ้นกึ่งเสียดแทรก คล้าย r แต่หนักกว่า",
        vi: "ㄖ là âm xát hữu thanh cuộn lưỡi, nặng hơn r tiếng Anh",
        id: "ㄖ adalah retroflex frikatif bersuara, lebih kuat dari r Inggris",
        en: "ㄖ is a voiced retroflex fricative — heavier than English r",
      },
      covers: ["ㄖ"],
      examples: [
        ex("人", "ㄖㄣˊ", "rén", "person"),
        ex("肉", "ㄖㄡˋ", "ròu", "meat"),
        ex("熱", "ㄖㄜˋ", "rè", "hot"),
      ],
    },
  },
  {
    stageCode: "Z6",
    code: "Z6-L05",
    title: "綜合聽寫:7 個高階聲符",
    titleI18n: {
      th: "ฝึกฟังพยัญชนะระดับสูงทั้ง 7",
      vi: "Nghe chọn 7 phụ âm cao cấp",
      id: "Latihan dengar 7 konsonan tingkat tinggi",
      en: "Pick from all 7 advanced initials",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 30,
    content: {
      intro: "ㄓㄔㄕㄖㄗㄘㄙ 隨機出題,目標 8/10 正確才算過。",
      introI18n: {
        th: "สุ่มจาก ㄓㄔㄕㄖㄗㄘㄙ — เกณฑ์ผ่าน 8/10",
        vi: "Ngẫu nhiên từ ㄓㄔㄕㄖㄗㄘㄙ — đạt 8/10",
        id: "Acak dari ㄓㄔㄕㄖㄗㄘㄙ — lulus 8/10",
        en: "Random from all 7 — pass at 8/10",
      },
      covers: ["ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ"],
      examples: [],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z7 聲調系統 — 3 lessons
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z7",
    code: "Z7-L01",
    title: "四聲調入門",
    titleI18n: {
      th: "วรรณยุกต์ 4 เสียง",
      vi: "4 thanh điệu cơ bản",
      id: "4 nada dasar",
      en: "The four tones",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro:
        "媽 ㄇㄚ (一聲,平)、麻 ㄇㄚˊ (二聲,升)、馬 ㄇㄚˇ (三聲,降升)、罵 ㄇㄚˋ (四聲,降)。同樣 ma 唸不同調是不同字。",
      introI18n: {
        th: "媽/麻/馬/罵 = ma เดียวกันแต่วรรณยุกต์ต่างก็เป็นคนละคำ",
        vi: "媽/麻/馬/罵 cùng ma nhưng khác thanh là khác từ",
        id: "媽/麻/馬/罵 — ma sama tapi nada beda artinya beda",
        en: "Same ma, four tones = four different words",
      },
      covers: [],
      examples: [
        ex("媽", "ㄇㄚ", "mā", "mom"),
        ex("麻", "ㄇㄚˊ", "má", "hemp"),
        ex("馬", "ㄇㄚˇ", "mǎ", "horse"),
        ex("罵", "ㄇㄚˋ", "mà", "scold"),
      ],
      tips: ["三聲一定要先降再升,不能只降"],
    },
  },
  {
    stageCode: "Z7",
    code: "Z7-L02",
    title: "輕聲與兒化",
    titleI18n: {
      th: "เสียงเบาและ ㄦ ผสม",
      vi: "Thanh nhẹ và biến âm ㄦ",
      id: "Nada ringan dan retroflex",
      en: "Neutral tone and -er ending",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 20,
    content: {
      intro:
        "輕聲(˙)很短不重音,常出現在語尾如 嗎(ㄇㄚ˙)。台灣較少兒化,但要聽得懂北京口音。",
      introI18n: {
        th: "เสียงเบาสั้น ไม่เน้น เช่น 嗎 (˙) — ไต้หวันน้อยใช้ ㄦ",
        vi: "Thanh nhẹ ngắn, không nhấn, như 嗎",
        id: "Nada ringan singkat, tidak ditekan, seperti 嗎",
        en: "Neutral tone is short and unstressed, like 嗎",
      },
      covers: [],
      examples: [
        ex("嗎", "ㄇㄚ˙", "ma", "question particle"),
        ex("的", "ㄉㄜ˙", "de", "possessive"),
      ],
    },
  },
  {
    stageCode: "Z7",
    code: "Z7-L03",
    title: "聲調聽寫綜合",
    titleI18n: {
      th: "ฝึกฟังวรรณยุกต์",
      vi: "Luyện nghe thanh điệu",
      id: "Latihan dengar nada",
      en: "Tone-listening drill",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 30,
    content: {
      intro: "聽到 ma_X.mp3 後選對聲調。從一二三四聲 + 輕聲共 5 選 1。",
      introI18n: {
        th: "ฟัง ma แล้วเลือกวรรณยุกต์ที่ถูกจาก 5 ตัวเลือก",
        vi: "Nghe ma và chọn đúng thanh trong 5 lựa chọn",
        id: "Dengar ma lalu pilih nada yang benar dari 5",
        en: "Hear ma and pick the right tone from 5",
      },
      covers: [],
      examples: [],
    },
  },

  // ═════════════════════════════════════════════════════════════
  // Z8 結合韻 — 4 lessons
  // ═════════════════════════════════════════════════════════════
  {
    stageCode: "Z8",
    code: "Z8-L01",
    title: "ㄧ 系列結合韻",
    titleI18n: {
      th: "เสียงประสมกลุ่ม ㄧ",
      vi: "Vần ghép họ ㄧ",
      id: "Final gabungan seri ㄧ",
      en: "ㄧ-series compound finals",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 30,
    content: {
      intro:
        "ㄧㄚ (壓), ㄧㄝ (謝), ㄧㄠ (要), ㄧㄡ (有), ㄧㄢ (年), ㄧㄣ (因), ㄧㄤ (羊), ㄧㄥ (英)。 8 個常用結合韻。",
      introI18n: {
        th: "8 เสียงประสมขึ้นต้นด้วย ㄧ",
        vi: "8 vần ghép bắt đầu bằng ㄧ",
        id: "8 final gabungan diawali ㄧ",
        en: "8 compounds starting with ㄧ",
      },
      covers: ["ㄧ"],
      examples: [
        ex("謝", "ㄒㄧㄝˋ", "xiè"),
        ex("要", "ㄧㄠˋ", "yào"),
        ex("年", "ㄋㄧㄢˊ", "nián"),
        ex("英", "ㄧㄥ", "yīng"),
      ],
    },
  },
  {
    stageCode: "Z8",
    code: "Z8-L02",
    title: "ㄨ 系列結合韻",
    titleI18n: {
      th: "เสียงประสมกลุ่ม ㄨ",
      vi: "Vần ghép họ ㄨ",
      id: "Final gabungan seri ㄨ",
      en: "ㄨ-series compound finals",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro: "ㄨㄚ (蛙), ㄨㄛ (我), ㄨㄞ (歪), ㄨㄟ (位), ㄨㄢ (晚), ㄨㄣ (溫), ㄨㄤ (王), ㄨㄥ (翁)。",
      introI18n: {
        th: "8 เสียงประสมขึ้นต้นด้วย ㄨ",
        vi: "8 vần ghép bắt đầu bằng ㄨ",
        id: "8 final gabungan diawali ㄨ",
        en: "8 compounds starting with ㄨ",
      },
      covers: ["ㄨ"],
      examples: [
        ex("我", "ㄨㄛˇ", "wǒ"),
        ex("位", "ㄨㄟˋ", "wèi"),
        ex("晚", "ㄨㄢˇ", "wǎn"),
        ex("王", "ㄨㄤˊ", "wáng"),
      ],
    },
  },
  {
    stageCode: "Z8",
    code: "Z8-L03",
    title: "ㄩ 系列結合韻",
    titleI18n: {
      th: "เสียงประสมกลุ่ม ㄩ",
      vi: "Vần ghép họ ㄩ",
      id: "Final gabungan seri ㄩ",
      en: "ㄩ-series compound finals",
    },
    type: LessonType.ZHUYIN_INTRO,
    estimatedMinutes: 25,
    content: {
      intro: "ㄩㄝ (月), ㄩㄢ (圓), ㄩㄣ (雲), ㄩㄥ (用)。 4 個。",
      introI18n: {
        th: "4 เสียงประสมขึ้นต้นด้วย ㄩ",
        vi: "4 vần ghép bắt đầu bằng ㄩ",
        id: "4 final gabungan diawali ㄩ",
        en: "4 compounds starting with ㄩ",
      },
      covers: ["ㄩ"],
      examples: [
        ex("月", "ㄩㄝˋ", "yuè"),
        ex("圓", "ㄩㄢˊ", "yuán"),
        ex("用", "ㄩㄥˋ", "yòng"),
      ],
    },
  },
  {
    stageCode: "Z8",
    code: "Z8-L04",
    title: "完整音節綜合練習",
    titleI18n: {
      th: "ฝึกพยางค์เต็มทั้งหมด",
      vi: "Luyện toàn âm tiết",
      id: "Latihan suku kata lengkap",
      en: "Full-syllable comprehensive drill",
    },
    type: LessonType.ZHUYIN_PRACTICE,
    estimatedMinutes: 40,
    content: {
      intro:
        "聲符 + 介符 + 韻符 + 聲調 — 一次來。從詞頻表選最常用的 30 字。",
      introI18n: {
        th: "พยัญชนะ + เสียงกลาง + สระ + วรรณยุกต์ ครบ — 30 คำพบบ่อย",
        vi: "Phụ âm + đệm + vần + thanh — 30 từ thông dụng nhất",
        id: "Konsonan + medial + final + nada — 30 kata paling umum",
        en: "Initial + medial + final + tone — top-30 frequent words",
      },
      covers: [],
      examples: [
        ex("你", "ㄋㄧˇ", "nǐ", "you"),
        ex("好", "ㄏㄠˇ", "hǎo", "good"),
        ex("謝謝", "ㄒㄧㄝˋ ㄒㄧㄝ˙", "xièxie", "thanks"),
      ],
    },
  },
];

export async function seedZhuyinLessons(prisma: PrismaClient): Promise<number> {
  // Resolve stage IDs once.
  const course = await prisma.course.findUnique({
    where: { code: "ZHUYIN" },
    select: { id: true },
  });
  if (!course) throw new Error("ZHUYIN course not found — run seedZhuyinStages first");

  const stages = await prisma.stage.findMany({
    where: { courseId: course.id },
    select: { id: true, code: true },
  });
  const stageByCode = new Map(stages.map((s) => [s.code, s.id]));

  let count = 0;
  // Group by stage so per-stage orderIndex is monotonic.
  const byStage = new Map<string, LessonDef[]>();
  for (const l of LESSONS) {
    if (!byStage.has(l.stageCode)) byStage.set(l.stageCode, []);
    byStage.get(l.stageCode)!.push(l);
  }

  for (const [stageCode, lessons] of byStage) {
    const stageId = stageByCode.get(stageCode);
    if (!stageId) {
      console.warn(`  ! stage ${stageCode} not found, skipping`);
      continue;
    }
    let order = 0;
    for (const l of lessons) {
      await prisma.lesson.upsert({
        where: { stageId_code: { stageId, code: l.code } },
        update: {
          title: l.title,
          titleI18n: l.titleI18n,
          type: l.type,
          estimatedMinutes: l.estimatedMinutes,
          content: l.content as never,
          orderIndex: order,
          isPublished: true,
        },
        create: {
          stageId,
          code: l.code,
          title: l.title,
          titleI18n: l.titleI18n,
          type: l.type,
          estimatedMinutes: l.estimatedMinutes,
          content: l.content as never,
          orderIndex: order,
          isPublished: true,
        },
      });
      order++;
      count++;
    }
  }

  return count;
}
