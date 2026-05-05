"use client";

import { useState, useMemo } from "react";
import { Flame } from "lucide-react";

export interface DayActivity {
  /** YYYY-MM-DD in local time */
  date: string;
  /** Sum of scores earned that day (proxy for activity intensity) */
  xp: number;
  /** Number of attempts that day */
  attempts: number;
}

interface Props {
  /** All days the user has activity, last 90 days range */
  activity: DayActivity[];
  /** Today as YYYY-MM-DD in user's local time, computed server-side */
  todayKey: string;
}

const DAYS_TO_SHOW = 90;

/** Heatmap colour at a given XP intensity bucket */
function colorForXp(xp: number): string {
  if (xp === 0) return "var(--aiai-gray-200)";
  if (xp < 20) return "#bbf7d0";   // light green
  if (xp < 50) return "#86efac";
  if (xp < 100) return "#4ade80";
  if (xp < 200) return "#22c55e";
  return "#15803d";                 // deep green
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function StreakCalendar({ activity, todayKey }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const lookup = useMemo(
    () => new Map(activity.map((a) => [a.date, a])),
    [activity],
  );

  // Build last 90 days, oldest → newest
  const today = new Date(todayKey);
  const days: { date: string; activity?: DayActivity }[] = [];
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    days.push({ date: key, activity: lookup.get(key) });
  }

  // Layout: 13 columns × 7 rows (Sun-Sat). Pad start so first column starts at the right weekday
  const firstWeekday = new Date(days[0]!.date).getDay(); // 0 = Sun
  const padded = [...Array(firstWeekday).fill(null), ...days];

  // Stats
  const totalXp = activity.reduce((s, a) => s + a.xp, 0);
  const activeDays = activity.filter((a) => a.attempts > 0).length;
  const todayActivity = lookup.get(todayKey);

  // Hovered tooltip
  const hoverData = hovered ? lookup.get(hovered) : null;
  const hoverDate = hovered
    ? new Date(hovered).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        weekday: "short",
      })
    : null;

  return (
    <div
      className="rounded-2xl border-2 bg-white p-3 shadow-sm"
      style={{ borderColor: "var(--aiai-green-100)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--aiai-green-700)" }}
        >
          🔥 90 วันที่ผ่านมา · STUDY HEATMAP
        </h3>
        <div className="text-right">
          <p
            className="text-[11px] tabular-nums"
            style={{ color: "var(--aiai-gray-500)" }}
          >
            {activeDays} วัน · {totalXp} XP
          </p>
        </div>
      </div>

      {/* Hover tooltip */}
      <div
        className="mb-1 h-4 text-center text-[11px] tabular-nums transition-opacity"
        style={{
          color: "var(--aiai-gray-600)",
          opacity: hovered ? 1 : 0,
        }}
      >
        {hovered && (
          <>
            {hoverDate}
            {hoverData
              ? ` · ${hoverData.xp} XP · ${hoverData.attempts} ข้อ`
              : " · ไม่ได้เรียน"}
          </>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div
          className="grid auto-cols-[12px] grid-flow-col gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, 12px)" }}
          onMouseLeave={() => setHovered(null)}
        >
          {padded.map((cell, i) => {
            if (!cell) {
              return <div key={`pad-${i}`} className="size-3 opacity-0" />;
            }
            const xp = cell.activity?.xp ?? 0;
            const isToday = cell.date === todayKey;
            return (
              <div
                key={cell.date}
                onMouseEnter={() => setHovered(cell.date)}
                onTouchStart={() => setHovered(cell.date)}
                className="size-3 rounded-[3px] transition-transform hover:scale-150"
                style={{
                  background: colorForXp(xp),
                  outline: isToday ? "1.5px solid var(--aiai-green-700)" : "none",
                  outlineOffset: 1,
                }}
                aria-label={`${cell.date} - ${xp} XP`}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        className="mt-2 flex items-center justify-end gap-1 text-[10px]"
        style={{ color: "var(--aiai-gray-500)" }}
      >
        <span>น้อย</span>
        {[0, 20, 50, 100, 200].map((bucket) => (
          <span
            key={bucket}
            className="size-2.5 rounded-[2px]"
            style={{ background: colorForXp(bucket) }}
          />
        ))}
        <span>มาก</span>
      </div>

      {/* Today snippet */}
      {todayActivity && (
        <div
          className="mt-2 flex items-center gap-2 rounded-lg p-2 text-xs"
          style={{ background: "var(--aiai-green-50)" }}
        >
          <Flame className="size-4" style={{ color: "#fb923c" }} />
          <span style={{ color: "var(--aiai-green-800)" }}>
            วันนี้คุณเรียนแล้ว <b>{todayActivity.xp} XP</b> · {todayActivity.attempts} ข้อ — ยอดเยี่ยม!
          </span>
        </div>
      )}
    </div>
  );
}
