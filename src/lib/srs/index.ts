/**
 * SRS - Spaced Repetition System
 * 間隔重複學習算法 (基於 Anki SM-2)
 *
 * 用途: 詞彙、語法、句子的長期記憶優化
 *
 * 演算法核心:
 * - 每次答題給品質評分 (0-5)
 * - 根據品質調整 EaseFactor 與 IntervalDays
 * - 答對 → 拉長間隔
 * - 答錯 → 重置為短間隔
 */

export type SrsQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0: 完全忘記
// 1: 錯誤但有印象
// 2: 錯誤但勉強答對
// 3: 答對但很困難
// 4: 答對，稍有遲疑
// 5: 完美答對

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface SrsResult extends SrsState {
  nextReviewAt: Date;
}

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * 計算下次複習時間 (SM-2 演算法)
 */
export function calculateNextReview(
  state: SrsState,
  quality: SrsQuality,
  reviewedAt: Date = new Date()
): SrsResult {
  let { easeFactor, intervalDays, repetitions } = state;

  // 答錯 (quality < 3): 重置
  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    // 答對: 計算新間隔
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  }

  // 更新 EaseFactor
  easeFactor =
    easeFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE_FACTOR) easeFactor = MIN_EASE_FACTOR;

  // 計算下次複習日期
  const nextReviewAt = new Date(reviewedAt);
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    easeFactor: Number(easeFactor.toFixed(2)),
    intervalDays,
    repetitions,
    nextReviewAt,
  };
}

/**
 * 初始化新項目的 SRS 狀態
 */
export function createInitialSrsState(): SrsState {
  return {
    easeFactor: DEFAULT_EASE_FACTOR,
    intervalDays: 1,
    repetitions: 0,
  };
}

/**
 * 將練習題的答對/答錯轉成 SRS 品質分數
 *
 * @param isCorrect 是否答對
 * @param timeSpentSec 作答秒數
 * @param hintUsed 是否用提示
 * @param attemptCount 第幾次嘗試
 */
export function attemptToQuality(
  isCorrect: boolean,
  timeSpentSec: number,
  hintUsed: boolean,
  attemptCount: number
): SrsQuality {
  if (!isCorrect) {
    if (attemptCount > 2) return 0;        // 多次答錯
    if (attemptCount === 2) return 1;      // 錯一次後答對
    return 2;                              // 第一次就錯但接近
  }

  // 答對的情況下評估品質
  let quality: SrsQuality = 5;

  if (hintUsed) quality = (quality - 1) as SrsQuality;
  if (attemptCount > 1) quality = (quality - 1) as SrsQuality;
  if (timeSpentSec > 30) quality = (quality - 1) as SrsQuality;

  if (quality < 3) quality = 3;            // 答對至少給 3 分
  return quality;
}

/**
 * 取得今日待複習項目數量分類
 */
export interface ReviewQueue {
  newItems: number;       // 全新項目
  learning: number;       // 學習中
  due: number;            // 到期複習
  overdue: number;        // 逾期
}

/**
 * 推薦每日學習量
 */
export function recommendDailyTarget(
  userLevel: string,
  dailyMinutes: number
): {
  newVocab: number;
  reviewVocab: number;
  newGrammar: number;
} {
  // 簡單計算: 每分鐘平均能複習 3-5 個詞
  const itemsPerMin = 4;
  const total = dailyMinutes * itemsPerMin;
  const reviewRatio = 0.7;
  const newRatio = 0.3;

  return {
    newVocab: Math.floor(total * newRatio * 0.7),
    reviewVocab: Math.floor(total * reviewRatio),
    newGrammar: Math.max(1, Math.floor(total * newRatio * 0.3 / 5)),
  };
}
