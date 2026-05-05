/**
 * Daily missions — Duolingo-style 3-task daily goal system.
 *
 * Three rotating templates. Get-or-create per user per day, idempotent.
 * Progress lives on `DailyMission.missions` JSON; we bump fields and
 * mark the row complete (+bonusXp) once all 3 hit target.
 */
import { db } from "@/lib/db";

export type MissionType =
  | "earn_xp"          // earn N XP today
  | "complete_lessons" // finish N lessons today
  | "vocab_cards";     // review N vocabulary cards today

export interface Mission {
  type: MissionType;
  target: number;
  current: number;
  completed: boolean;
  emoji: string;
  /** Bilingual label so the UI can render without an extra dictionary lookup. */
  labelTh: string;
  labelZh: string;
}

const MISSION_TEMPLATES: Record<MissionType, Omit<Mission, "current" | "completed">> = {
  earn_xp: {
    type: "earn_xp",
    target: 50,
    emoji: "⚡",
    labelTh: "ทำ 50 XP วันนี้",
    labelZh: "今天獲得 50 XP",
  },
  complete_lessons: {
    type: "complete_lessons",
    target: 2,
    emoji: "📚",
    labelTh: "เรียนจบ 2 บทเรียน",
    labelZh: "完成 2 個課程",
  },
  vocab_cards: {
    type: "vocab_cards",
    target: 15,
    emoji: "🃏",
    labelTh: "ทบทวนคำศัพท์ 15 คำ",
    labelZh: "複習 15 個詞彙",
  },
};

const BONUS_XP_ALL_COMPLETE = 25;

function todayDateOnly(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildFreshMissions(): Mission[] {
  // For now we always issue all three templates. Later we can rotate.
  return Object.values(MISSION_TEMPLATES).map((tpl) => ({
    ...tpl,
    current: 0,
    completed: false,
  }));
}

/** Fetch today's mission row, creating it if missing. */
export async function getOrCreateTodayMissions(userId: string) {
  const date = todayDateOnly();
  const existing = await db.dailyMission.findUnique({
    where: { userId_date: { userId, date } },
  });
  if (existing) return existing;

  return db.dailyMission.create({
    data: {
      userId,
      date,
      missions: buildFreshMissions() as object,
      allCompleted: false,
      bonusXp: 0,
    },
  });
}

interface BumpInput {
  earn_xp?: number;
  complete_lessons?: number;
  vocab_cards?: number;
}

/**
 * Atomically increment one or more mission counters for the user's today row.
 * Awards bonus XP when crossing all-complete threshold (only the first time).
 *
 * @returns updated mission state + whether `allCompleted` flipped this call
 */
export async function bumpMissionProgress(userId: string, delta: BumpInput) {
  const date = todayDateOnly();
  await getOrCreateTodayMissions(userId);

  // We need to read-modify-write the JSON in a transaction to avoid races
  // when multiple actions fire simultaneously (e.g. session-complete +
  // weekly-exam submit). DailyMission has @@unique([userId, date]).
  return db.$transaction(async (tx) => {
    const row = await tx.dailyMission.findUnique({
      where: { userId_date: { userId, date } },
    });
    if (!row) throw new Error("DailyMission row missing after create");

    const missions = (row.missions as unknown as Mission[]).map((m) => {
      const inc = delta[m.type] ?? 0;
      if (!inc) return m;
      const next = Math.min(m.target, m.current + inc);
      return { ...m, current: next, completed: next >= m.target };
    });

    const wasComplete = row.allCompleted;
    const nowComplete = missions.every((m) => m.completed);
    const flipped = !wasComplete && nowComplete;

    const updated = await tx.dailyMission.update({
      where: { id: row.id },
      data: {
        missions: missions as object,
        allCompleted: nowComplete,
        bonusXp: flipped ? BONUS_XP_ALL_COMPLETE : row.bonusXp,
      },
    });

    if (flipped) {
      await tx.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: BONUS_XP_ALL_COMPLETE },
          weeklyXp: { increment: BONUS_XP_ALL_COMPLETE },
        },
      });
    }

    return { row: updated, missions, flipped };
  });
}

export const DAILY_MISSION_BONUS_XP = BONUS_XP_ALL_COMPLETE;
