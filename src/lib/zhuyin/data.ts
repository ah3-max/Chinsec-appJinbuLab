// ============================================
// 注音符號資料：37 注音 + 4 聲調
// ============================================
// 排列順序依據台灣標準注音鍵盤 (大千式)：
//   行 1：聲母 ㄅ ㄆ ㄇ ㄈ ㄉ ㄊ ㄋ ㄌ ㄍ ㄎ ㄏ ㄐ ㄑ ㄒ ㄓ ㄔ ㄕ ㄖ ㄗ ㄘ ㄙ
//   行 2：介母 ㄧ ㄨ ㄩ
//   行 3：韻母 ㄚ ㄛ ㄜ ㄝ ㄞ ㄟ ㄠ ㄡ ㄢ ㄣ ㄤ ㄥ ㄦ
// ============================================

export type ZhuyinCategory = "initial" | "medial" | "final";

export interface ZhuyinSymbol {
  symbol: string; // 注音符號
  pinyin: string; // 對應拼音 (用於對照)
  category: ZhuyinCategory;
  /** 跟讀範例字（單獨注音不發音時提供範例）*/
  example?: { hanzi: string; zhuyin: string; pinyin: string };
}

// 21 個聲母
export const INITIALS: ZhuyinSymbol[] = [
  { symbol: "ㄅ", pinyin: "b", category: "initial", example: { hanzi: "爸", zhuyin: "ㄅㄚˋ", pinyin: "bà" } },
  { symbol: "ㄆ", pinyin: "p", category: "initial", example: { hanzi: "怕", zhuyin: "ㄆㄚˋ", pinyin: "pà" } },
  { symbol: "ㄇ", pinyin: "m", category: "initial", example: { hanzi: "媽", zhuyin: "ㄇㄚ", pinyin: "mā" } },
  { symbol: "ㄈ", pinyin: "f", category: "initial", example: { hanzi: "發", zhuyin: "ㄈㄚ", pinyin: "fā" } },
  { symbol: "ㄉ", pinyin: "d", category: "initial", example: { hanzi: "大", zhuyin: "ㄉㄚˋ", pinyin: "dà" } },
  { symbol: "ㄊ", pinyin: "t", category: "initial", example: { hanzi: "他", zhuyin: "ㄊㄚ", pinyin: "tā" } },
  { symbol: "ㄋ", pinyin: "n", category: "initial", example: { hanzi: "拿", zhuyin: "ㄋㄚˊ", pinyin: "ná" } },
  { symbol: "ㄌ", pinyin: "l", category: "initial", example: { hanzi: "來", zhuyin: "ㄌㄞˊ", pinyin: "lái" } },
  { symbol: "ㄍ", pinyin: "g", category: "initial", example: { hanzi: "哥", zhuyin: "ㄍㄜ", pinyin: "gē" } },
  { symbol: "ㄎ", pinyin: "k", category: "initial", example: { hanzi: "看", zhuyin: "ㄎㄢˋ", pinyin: "kàn" } },
  { symbol: "ㄏ", pinyin: "h", category: "initial", example: { hanzi: "好", zhuyin: "ㄏㄠˇ", pinyin: "hǎo" } },
  { symbol: "ㄐ", pinyin: "j", category: "initial", example: { hanzi: "家", zhuyin: "ㄐㄧㄚ", pinyin: "jiā" } },
  { symbol: "ㄑ", pinyin: "q", category: "initial", example: { hanzi: "去", zhuyin: "ㄑㄩˋ", pinyin: "qù" } },
  { symbol: "ㄒ", pinyin: "x", category: "initial", example: { hanzi: "謝", zhuyin: "ㄒㄧㄝˋ", pinyin: "xiè" } },
  { symbol: "ㄓ", pinyin: "zh", category: "initial", example: { hanzi: "知", zhuyin: "ㄓ", pinyin: "zhī" } },
  { symbol: "ㄔ", pinyin: "ch", category: "initial", example: { hanzi: "吃", zhuyin: "ㄔ", pinyin: "chī" } },
  { symbol: "ㄕ", pinyin: "sh", category: "initial", example: { hanzi: "是", zhuyin: "ㄕˋ", pinyin: "shì" } },
  { symbol: "ㄖ", pinyin: "r", category: "initial", example: { hanzi: "人", zhuyin: "ㄖㄣˊ", pinyin: "rén" } },
  { symbol: "ㄗ", pinyin: "z", category: "initial", example: { hanzi: "字", zhuyin: "ㄗˋ", pinyin: "zì" } },
  { symbol: "ㄘ", pinyin: "c", category: "initial", example: { hanzi: "次", zhuyin: "ㄘˋ", pinyin: "cì" } },
  { symbol: "ㄙ", pinyin: "s", category: "initial", example: { hanzi: "三", zhuyin: "ㄙㄢ", pinyin: "sān" } },
];

// 3 個介母
export const MEDIALS: ZhuyinSymbol[] = [
  { symbol: "ㄧ", pinyin: "i", category: "medial", example: { hanzi: "一", zhuyin: "ㄧ", pinyin: "yī" } },
  { symbol: "ㄨ", pinyin: "u", category: "medial", example: { hanzi: "五", zhuyin: "ㄨˇ", pinyin: "wǔ" } },
  { symbol: "ㄩ", pinyin: "ü", category: "medial", example: { hanzi: "魚", zhuyin: "ㄩˊ", pinyin: "yú" } },
];

// 13 個韻母
export const FINALS: ZhuyinSymbol[] = [
  { symbol: "ㄚ", pinyin: "a", category: "final", example: { hanzi: "啊", zhuyin: "ㄚ", pinyin: "ā" } },
  { symbol: "ㄛ", pinyin: "o", category: "final", example: { hanzi: "我", zhuyin: "ㄨㄛˇ", pinyin: "wǒ" } },
  { symbol: "ㄜ", pinyin: "e", category: "final", example: { hanzi: "餓", zhuyin: "ㄜˋ", pinyin: "è" } },
  { symbol: "ㄝ", pinyin: "ê", category: "final", example: { hanzi: "謝", zhuyin: "ㄒㄧㄝˋ", pinyin: "xiè" } },
  { symbol: "ㄞ", pinyin: "ai", category: "final", example: { hanzi: "愛", zhuyin: "ㄞˋ", pinyin: "ài" } },
  { symbol: "ㄟ", pinyin: "ei", category: "final", example: { hanzi: "誰", zhuyin: "ㄕㄟˊ", pinyin: "shéi" } },
  { symbol: "ㄠ", pinyin: "ao", category: "final", example: { hanzi: "好", zhuyin: "ㄏㄠˇ", pinyin: "hǎo" } },
  { symbol: "ㄡ", pinyin: "ou", category: "final", example: { hanzi: "夠", zhuyin: "ㄍㄡˋ", pinyin: "gòu" } },
  { symbol: "ㄢ", pinyin: "an", category: "final", example: { hanzi: "看", zhuyin: "ㄎㄢˋ", pinyin: "kàn" } },
  { symbol: "ㄣ", pinyin: "en", category: "final", example: { hanzi: "很", zhuyin: "ㄏㄣˇ", pinyin: "hěn" } },
  { symbol: "ㄤ", pinyin: "ang", category: "final", example: { hanzi: "幫", zhuyin: "ㄅㄤ", pinyin: "bāng" } },
  { symbol: "ㄥ", pinyin: "eng", category: "final", example: { hanzi: "等", zhuyin: "ㄉㄥˇ", pinyin: "děng" } },
  { symbol: "ㄦ", pinyin: "er", category: "final", example: { hanzi: "二", zhuyin: "ㄦˋ", pinyin: "èr" } },
];

// 4 個聲調符號（輕聲不顯示，這裡用文字代替）
export interface ZhuyinTone {
  mark: string; // 顯示符號
  pinyinMark: string; // 拼音調號示範
  name: string; // 聲調名稱
  number: 1 | 2 | 3 | 4 | 5; // 5 = 輕聲
}

export const TONES: ZhuyinTone[] = [
  { mark: " ̄", pinyinMark: "ā", name: "一聲（陰平）", number: 1 },
  { mark: "ˊ", pinyinMark: "á", name: "二聲（陽平）", number: 2 },
  { mark: "ˇ", pinyinMark: "ǎ", name: "三聲（上聲）", number: 3 },
  { mark: "ˋ", pinyinMark: "à", name: "四聲（去聲）", number: 4 },
  { mark: "˙", pinyinMark: "a", name: "輕聲", number: 5 },
];

export const ALL_ZHUYIN: ZhuyinSymbol[] = [...INITIALS, ...MEDIALS, ...FINALS];
