/**
 * Achievement definitions — computed on-the-fly from existing data.
 * No schema changes required; each achievement has an `evaluate` function
 * that takes already-loaded user stats and returns { earned, progress, target }.
 */
import type { Level } from "@prisma/client";

export interface AchievementInput {
  totalXp: number;
  weeklyXp: number;
  streakDays: number;
  totalStudyMin: number;
  currentLevel: Level;
  /** distinct lessons the user has at least one correct attempt on */
  completedLessons: number;
  /** total UserAttempt records */
  totalAttempts: number;
  /** correct UserAttempt records */
  correctAttempts: number;
  /** distinct sessionKeys the user has finished */
  totalSessions: number;
  /** number of weekly exams passed */
  weeklyExamsPassed: number;
  /** earliest study hour 0-23 */
  earliestStudyHour: number | null;
  /** latest study hour 0-23 */
  latestStudyHour: number | null;
  /** distinct days the user has studied */
  uniqueStudyDays: number;
}

export type AchievementCategory =
  | "starter"
  | "streak"
  | "xp"
  | "knowledge"
  | "exam"
  | "habit";

export interface Achievement {
  code: string;
  emoji: string;
  titleZh: string;
  titleTh: string;
  descTh: string;
  category: AchievementCategory;
  evaluate: (input: AchievementInput) => { progress: number; target: number };
}

const A = (
  code: string,
  emoji: string,
  titleZh: string,
  titleTh: string,
  descTh: string,
  category: AchievementCategory,
  evaluate: Achievement["evaluate"],
): Achievement => ({ code, emoji, titleZh, titleTh, descTh, category, evaluate });

// ─── Achievement catalog ─────────────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  // Starter
  A("first-step", "👣", "第一步", "ก้าวแรก", "ทำบทเรียนแรกให้สำเร็จ", "starter",
    (i) => ({ progress: Math.min(1, i.completedLessons), target: 1 })),
  A("first-session", "🚀", "啟程", "เริ่มต้น", "เซสชันการเรียนครั้งแรก", "starter",
    (i) => ({ progress: Math.min(1, i.totalSessions), target: 1 })),
  A("first-correct", "✅", "首答", "คำตอบแรก", "ตอบคำถามถูก 1 ครั้ง", "starter",
    (i) => ({ progress: Math.min(1, i.correctAttempts), target: 1 })),

  // Streak
  A("streak-3", "🔥", "3 天連續", "ต่อเนื่อง 3 วัน", "เรียน 3 วันติดต่อกัน", "streak",
    (i) => ({ progress: Math.min(3, i.streakDays), target: 3 })),
  A("streak-7", "🔥🔥", "週戰士", "นักรบรายสัปดาห์", "เรียน 7 วันติดต่อกัน", "streak",
    (i) => ({ progress: Math.min(7, i.streakDays), target: 7 })),
  A("streak-30", "🌟", "月霸主", "จ้าวรายเดือน", "เรียน 30 วันติดต่อกัน", "streak",
    (i) => ({ progress: Math.min(30, i.streakDays), target: 30 })),
  A("streak-100", "💎", "百日不懈", "100 วันไม่ขาด", "เรียน 100 วันติดต่อกัน", "streak",
    (i) => ({ progress: Math.min(100, i.streakDays), target: 100 })),

  // XP
  A("xp-100", "⚡", "百分之力", "100 XP", "ทำได้ 100 XP", "xp",
    (i) => ({ progress: Math.min(100, i.totalXp), target: 100 })),
  A("xp-500", "⚡⚡", "五百之路", "500 XP", "ทำได้ 500 XP", "xp",
    (i) => ({ progress: Math.min(500, i.totalXp), target: 500 })),
  A("xp-1000", "⚡✨", "千分達人", "1000 XP", "ทำได้ 1,000 XP", "xp",
    (i) => ({ progress: Math.min(1000, i.totalXp), target: 1000 })),
  A("xp-5000", "🌠", "五千巨星", "5,000 XP", "ทำได้ 5,000 XP", "xp",
    (i) => ({ progress: Math.min(5000, i.totalXp), target: 5000 })),

  // Knowledge / vocab
  A("attempts-50", "📝", "50 答練", "50 คำตอบ", "ตอบคำถามรวม 50 ครั้ง", "knowledge",
    (i) => ({ progress: Math.min(50, i.totalAttempts), target: 50 })),
  A("attempts-200", "📚", "200 答練", "200 คำตอบ", "ตอบคำถามรวม 200 ครั้ง", "knowledge",
    (i) => ({ progress: Math.min(200, i.totalAttempts), target: 200 })),
  A("attempts-500", "🎓", "500 答練", "500 คำตอบ", "ตอบคำถามรวม 500 ครั้ง", "knowledge",
    (i) => ({ progress: Math.min(500, i.totalAttempts), target: 500 })),
  A("lessons-10", "📖", "十課完成", "เรียนจบ 10 บท", "ผ่าน 10 บทเรียน", "knowledge",
    (i) => ({ progress: Math.min(10, i.completedLessons), target: 10 })),
  A("lessons-25", "📕", "廿五課", "เรียนจบ 25 บท", "ผ่าน 25 บทเรียน", "knowledge",
    (i) => ({ progress: Math.min(25, i.completedLessons), target: 25 })),

  // Exam
  A("weekly-1", "🏆", "週考首勝", "ผ่านสอบสัปดาห์", "ผ่านสอบรายสัปดาห์ 1 ครั้ง", "exam",
    (i) => ({ progress: Math.min(1, i.weeklyExamsPassed), target: 1 })),
  A("weekly-3", "🏆🏆", "三週連勝", "ผ่าน 3 สัปดาห์", "ผ่านสอบรายสัปดาห์ 3 ครั้ง", "exam",
    (i) => ({ progress: Math.min(3, i.weeklyExamsPassed), target: 3 })),

  // Habit
  A("early-bird", "🌅", "早起鳥", "นกขยัน", "เรียนก่อน 8 โมงเช้า", "habit",
    (i) => ({
      progress: i.earliestStudyHour !== null && i.earliestStudyHour < 8 ? 1 : 0,
      target: 1,
    })),
  A("night-owl", "🌙", "夜貓子", "นักนอนดึก", "เรียนหลัง 22:00", "habit",
    (i) => ({
      progress: i.latestStudyHour !== null && i.latestStudyHour >= 22 ? 1 : 0,
      target: 1,
    })),
  A("study-30min", "⏰", "用功 30 分", "ขยัน 30 นาที", "เรียนรวม 30 นาที", "habit",
    (i) => ({ progress: Math.min(30, i.totalStudyMin), target: 30 })),
  A("study-180min", "⏳", "用功 3 小時", "ขยัน 3 ชั่วโมง", "เรียนรวม 3 ชั่วโมง", "habit",
    (i) => ({ progress: Math.min(180, i.totalStudyMin), target: 180 })),
  A("days-10", "📅", "學習 10 天", "เรียน 10 วัน", "เรียนรวม 10 วันแยกกัน", "habit",
    (i) => ({ progress: Math.min(10, i.uniqueStudyDays), target: 10 })),
];

export interface ResolvedAchievement extends Achievement {
  progress: number;
  target: number;
  earned: boolean;
  pct: number;
}

export function evaluateAll(input: AchievementInput): ResolvedAchievement[] {
  return ACHIEVEMENTS.map((a) => {
    const { progress, target } = a.evaluate(input);
    const pct = Math.min(100, Math.round((progress / Math.max(1, target)) * 100));
    return { ...a, progress, target, earned: progress >= target, pct };
  });
}

export const CATEGORY_META: Record<AchievementCategory, { labelZh: string; labelTh: string; color: string }> = {
  starter:   { labelZh: "起步",     labelTh: "เริ่มต้น",     color: "#22c55e" },
  streak:    { labelZh: "連續打卡",  labelTh: "ต่อเนื่อง",     color: "#fb923c" },
  xp:        { labelZh: "經驗值",    labelTh: "XP",           color: "#8b5cf6" },
  knowledge: { labelZh: "知識量",    labelTh: "ความรู้",      color: "#3b82f6" },
  exam:      { labelZh: "考試",      labelTh: "สอบ",          color: "#fbbf24" },
  habit:     { labelZh: "習慣",      labelTh: "นิสัย",        color: "#ec4899" },
};
