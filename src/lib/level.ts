import { Level } from "@prisma/client";

// Linear ordering of CEFR-style course levels for the platform.
// canAccess: user can fully enter a course at or below their current level.
// canPreview: user can peek at the *next* level above their own (one step).
// isLocked: above the next level → fully locked.
export const LEVEL_ORDER: Level[] = [
  Level.ZHUYIN,
  Level.A1_BEGINNER,
  Level.A2_BASIC,
  Level.B1_INTERMEDIATE,
  Level.B2_UPPER_INTER,
  Level.C1_ADVANCED,
  Level.C2_PROFICIENT,
];

function rankOf(level: Level): number {
  const idx = LEVEL_ORDER.indexOf(level);
  if (idx < 0) throw new Error(`unknown level: ${level}`);
  return idx;
}

export function canAccess(userLevel: Level, courseLevel: Level): boolean {
  return rankOf(userLevel) >= rankOf(courseLevel);
}

export function canPreview(userLevel: Level, courseLevel: Level): boolean {
  return rankOf(courseLevel) === rankOf(userLevel) + 1;
}

export function isLocked(userLevel: Level, courseLevel: Level): boolean {
  return rankOf(courseLevel) > rankOf(userLevel) + 1;
}

export function nextLevel(level: Level): Level | null {
  const idx = rankOf(level);
  return LEVEL_ORDER[idx + 1] ?? null;
}

export function previousLevel(level: Level): Level | null {
  const idx = rankOf(level);
  return idx > 0 ? LEVEL_ORDER[idx - 1] ?? null : null;
}

export type CourseAccessState = "completed" | "open" | "preview" | "locked";

export function classifyCourse(
  userLevel: Level,
  courseLevel: Level,
  isCompleted: boolean,
): CourseAccessState {
  if (isCompleted) return "completed";
  if (canAccess(userLevel, courseLevel)) return "open";
  if (canPreview(userLevel, courseLevel)) return "preview";
  return "locked";
}
