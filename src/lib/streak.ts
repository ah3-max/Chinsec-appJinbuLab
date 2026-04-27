// Streak math kept here so the rule lives in one place.
//
// Definition (intentionally simple):
//   - "today" and "yesterday" are computed in the server's local timezone.
//   - If lastStreakDate is null → first study session, streak = 1.
//   - If lastStreakDate is today → no change.
//   - If lastStreakDate is yesterday → streak + 1.
//   - Otherwise (gap > 1 day) → reset to 1.
//
// Returning the new value plus a `lastStreakDate: Date` to write back.

export interface StreakResult {
  newStreak: number;
  newLastStreakDate: Date;
  changed: boolean;
}

export function computeNewStreak(
  current: number,
  lastStreakDate: Date | null,
  now: Date = new Date(),
): StreakResult {
  const today = startOfDay(now);
  if (!lastStreakDate) {
    return { newStreak: 1, newLastStreakDate: today, changed: true };
  }
  const last = startOfDay(lastStreakDate);
  const diffDays = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) {
    return { newStreak: current, newLastStreakDate: last, changed: false };
  }
  if (diffDays === 1) {
    return { newStreak: current + 1, newLastStreakDate: today, changed: true };
  }
  return { newStreak: 1, newLastStreakDate: today, changed: true };
}

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}
