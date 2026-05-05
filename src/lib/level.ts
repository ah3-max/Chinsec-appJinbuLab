import { Level, UserRole } from "@prisma/client";

// Roles that bypass all level/Boss gating (testing + admin oversight).
const BYPASS_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.FACILITY_MGR,
  UserRole.TEACHER,
  UserRole.HR,
];

export function isLevelBypassRole(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return BYPASS_ROLES.includes(role);
}

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

export function canAccess(
  userLevel: Level,
  courseLevel: Level,
  role?: UserRole | null,
): boolean {
  if (isLevelBypassRole(role)) return true;
  return rankOf(userLevel) >= rankOf(courseLevel);
}

export function canPreview(
  userLevel: Level,
  courseLevel: Level,
  role?: UserRole | null,
): boolean {
  if (isLevelBypassRole(role)) return false;
  return rankOf(courseLevel) === rankOf(userLevel) + 1;
}

export function isLocked(
  userLevel: Level,
  courseLevel: Level,
  role?: UserRole | null,
): boolean {
  if (isLevelBypassRole(role)) return false;
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
  role?: UserRole | null,
): CourseAccessState {
  if (isLevelBypassRole(role)) return isCompleted ? "completed" : "open";
  if (isCompleted) return "completed";
  if (canAccess(userLevel, courseLevel)) return "open";
  if (canPreview(userLevel, courseLevel)) return "preview";
  return "locked";
}
