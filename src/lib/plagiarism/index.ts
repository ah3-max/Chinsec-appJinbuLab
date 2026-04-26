/**
 * 防抄襲檢測系統 (4 層防護)
 *
 * Layer 1: 內容指紋 (SimHash) - 快速比對
 * Layer 2: 餘弦相似度 - 向量比對
 * Layer 3: AI 語義分析 - 換句話說檢測
 * Layer 4: 行為分析 - 答題行為異常
 */

import crypto from "crypto";

/**
 * 計算 SimHash 指紋
 * 用於快速比對文字相似度
 */
export function computeSimHash(text: string): string {
  // 簡化版 SimHash (實際生產環境用 simhash-js 套件)
  const tokens = tokenize(text);
  const hashBits = new Array(64).fill(0);

  for (const token of tokens) {
    const hash = crypto
      .createHash("md5")
      .update(token)
      .digest("hex")
      .slice(0, 16);
    const num = BigInt(`0x${hash}`);
    for (let i = 0; i < 64; i++) {
      const bit = (num >> BigInt(i)) & BigInt(1);
      hashBits[i] += bit ? 1 : -1;
    }
  }

  let result = "";
  for (let i = 0; i < 64; i++) {
    result += hashBits[i] > 0 ? "1" : "0";
  }
  return BigInt(`0b${result}`).toString(16).padStart(16, "0");
}

/**
 * 計算兩個 SimHash 的漢明距離
 * 距離越小表示越相似
 */
export function hammingDistance(hash1: string, hash2: string): number {
  const a = BigInt(`0x${hash1}`);
  const b = BigInt(`0x${hash2}`);
  let xor = a ^ b;
  let distance = 0;
  while (xor > 0n) {
    distance += Number(xor & 1n);
    xor >>= 1n;
  }
  return distance;
}

/**
 * 將漢明距離轉成相似度 (0-1)
 */
export function hammingToSimilarity(distance: number): number {
  return 1 - distance / 64;
}

/**
 * 中文分詞 (簡化版，實際用 jieba-js)
 */
function tokenize(text: string): string[] {
  // 移除標點符號與空白
  const cleaned = text.replace(/[\s\p{P}]/gu, "");

  // 簡單以 2-gram 切詞
  const tokens: string[] = [];
  for (let i = 0; i < cleaned.length - 1; i++) {
    tokens.push(cleaned.slice(i, i + 2));
  }
  // 加入單字
  for (const c of cleaned) {
    tokens.push(c);
  }
  return tokens;
}

/**
 * 計算餘弦相似度 (基於詞袋)
 */
export function cosineSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  const freq1 = countFreq(tokens1);
  const freq2 = countFreq(tokens2);

  const allTokens = new Set([...freq1.keys(), ...freq2.keys()]);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (const token of allTokens) {
    const f1 = freq1.get(token) ?? 0;
    const f2 = freq2.get(token) ?? 0;
    dotProduct += f1 * f2;
    mag1 += f1 * f1;
    mag2 += f2 * f2;
  }

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function countFreq(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tokens) {
    map.set(t, (map.get(t) ?? 0) + 1);
  }
  return map;
}

/**
 * 行為分析評分 (可疑度)
 *
 * 訊號:
 * - 作答時間異常短 (<5 秒)
 * - 大量貼上動作
 * - 視窗失焦次數多
 * - 一字不差完美答對 (對於初學者很可疑)
 */
export interface BehaviorSignals {
  totalTimeSec: number;
  expectedMinTimeSec: number;
  pasteCount: number;
  windowBlurCount: number;
  contentLength: number;
  isPerfectAnswer: boolean;
  userLevel: string;
}

export interface SuspicionResult {
  score: number;        // 0-1
  reasons: string[];
  isHighRisk: boolean;
}

export function calculateSuspicionScore(
  signals: BehaviorSignals
): SuspicionResult {
  const reasons: string[] = [];
  let score = 0;

  // 時間異常
  if (signals.totalTimeSec < signals.expectedMinTimeSec * 0.3) {
    score += 0.3;
    reasons.push("作答時間過短");
  }

  // 貼上行為
  if (signals.pasteCount > 0) {
    score += Math.min(0.3, signals.pasteCount * 0.1);
    reasons.push(`偵測到 ${signals.pasteCount} 次貼上動作`);
  }

  // 視窗失焦
  if (signals.windowBlurCount > 5) {
    score += Math.min(0.2, signals.windowBlurCount * 0.02);
    reasons.push(`頻繁切換視窗 (${signals.windowBlurCount} 次)`);
  }

  // 完美答對對初學者可疑
  if (
    signals.isPerfectAnswer &&
    (signals.userLevel === "ZHUYIN" || signals.userLevel === "A1_BEGINNER") &&
    signals.contentLength > 50
  ) {
    score += 0.2;
    reasons.push("初學者完美答出長篇內容");
  }

  return {
    score: Math.min(1, score),
    reasons,
    isHighRisk: score >= 0.6,
  };
}

/**
 * 整合判定
 */
export interface PlagiarismVerdict {
  isLikelyPlagiarism: boolean;
  confidence: number;
  layers: {
    simhash?: number;
    cosine?: number;
    aiSemantic?: number;
    behavior?: number;
  };
  recommendation: "ACCEPT" | "REVIEW" | "FLAG" | "REJECT";
}
