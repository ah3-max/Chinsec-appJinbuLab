// Anti-cheat heuristics for self-paced practice attempts and sessions.
//
// Per-attempt: cheap signals available the moment a single answer arrives.
// Per-session: aggregate signals after a whole session finished.
//
// All checks are intentionally conservative — false positives just demote XP
// to 0, the attempts are still recorded so a human can review.

export interface AttemptCheckInput {
  timeSpentSec: number;
  windowBlurCount?: number;
  pasteDetected?: boolean;
}

export interface SessionAttemptSnapshot {
  timeSpentSec: number;
  isCorrect: boolean;
  userAnswer: unknown;
  pasteDetected?: boolean;
}

export interface CheatVerdict {
  isSuspicious: boolean;
  reasons: string[];
}

export function detectSuspiciousAttempt(a: AttemptCheckInput): CheatVerdict {
  const reasons: string[] = [];
  if (a.timeSpentSec < 1) reasons.push("too_fast");
  if (a.pasteDetected) reasons.push("paste_detected");
  if ((a.windowBlurCount ?? 0) > 5) reasons.push("excess_window_blur");
  return { isSuspicious: reasons.length > 0, reasons };
}

export function detectSuspiciousSession(
  attempts: SessionAttemptSnapshot[],
): CheatVerdict {
  const reasons: string[] = [];
  if (attempts.length === 0) return { isSuspicious: false, reasons };

  // All same answer + all correct = 100% with 1 answer key (very unlikely
  // by chance for ≥4 unique-target questions).
  if (attempts.length >= 4) {
    const ref = JSON.stringify(attempts[0]!.userAnswer);
    const allSame = attempts.every(
      (a) => JSON.stringify(a.userAnswer) === ref,
    );
    const allCorrect = attempts.every((a) => a.isCorrect);
    if (allSame && allCorrect) reasons.push("all_same_correct");
  }

  // Average response < 1s suggests scripted answers.
  const total = attempts.reduce((s, a) => s + a.timeSpentSec, 0);
  const avg = total / attempts.length;
  if (avg < 1) reasons.push("too_fast_avg");

  const pasteCount = attempts.filter((a) => a.pasteDetected).length;
  if (pasteCount > 5) reasons.push("excess_paste");

  return { isSuspicious: reasons.length > 0, reasons };
}
