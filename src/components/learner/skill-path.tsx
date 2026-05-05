"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, BookOpen, Star, Crown, ShieldAlert } from "lucide-react";

export interface PathLesson {
  id: string;
  code: string;
  title: string;
  type: string;            // VOCAB | EXERCISE | BOSS
  estimatedMinutes: number;
  xpReward: number;
  status: "completed" | "available" | "locked";
}

export interface PathStage {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  lessons: PathLesson[];
}

interface Props {
  courseCode: string;
  locale: string;
  stages: PathStage[];
}

// Horizontal positions on the winding path (% of container width).
// Pattern: center → left → center → right → center → left …
const POSITIONS = [50, 22, 50, 78, 50, 22, 50, 78];

function nodePosition(index: number): number {
  return POSITIONS[index % POSITIONS.length] ?? 50;
}

function NodeIcon({ lesson }: { lesson: PathLesson }) {
  if (lesson.status === "locked") return <Lock className="size-7" />;
  if (lesson.status === "completed") return <Crown className="size-7" />;
  if (lesson.type === "BOSS") return <ShieldAlert className="size-7" />;
  if (lesson.type === "VOCAB") return <BookOpen className="size-7" />;
  return <Star className="size-7" />;
}

function nodeColors(lesson: PathLesson): {
  bg: string;
  fg: string;
  ring: string;
  shadow: string;
} {
  if (lesson.status === "locked") {
    return {
      bg: "var(--aiai-gray-200)",
      fg: "var(--aiai-gray-400)",
      ring: "var(--aiai-gray-100)",
      shadow: "transparent",
    };
  }
  if (lesson.status === "completed") {
    return { bg: "#fbbf24", fg: "#fff", ring: "#fde68a", shadow: "#fbbf2455" };
  }
  if (lesson.type === "BOSS") {
    return { bg: "#fb923c", fg: "#fff", ring: "#fed7aa", shadow: "#fb923c55" };
  }
  // available
  return {
    bg: "var(--aiai-green-400)",
    fg: "#fff",
    ring: "var(--aiai-green-100)",
    shadow: "rgba(74, 222, 128, 0.4)",
  };
}

export function SkillPath({ courseCode, locale, stages }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {stages.map((stage, sIdx) => (
        <section key={stage.id} className="space-y-3">
          {/* Stage banner */}
          <div
            className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border-2 px-4 py-3"
            style={{
              borderColor: "var(--aiai-green-200)",
              background: "linear-gradient(90deg, var(--aiai-green-50) 0%, #fff 100%)",
            }}
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm"
              style={{ background: "var(--aiai-green-400)", color: "#fff" }}
            >
              {sIdx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="font-mono text-[10px] font-bold tracking-widest"
                style={{ color: "var(--aiai-green-600)" }}
              >
                {stage.code}
              </p>
              <h3 className="truncate text-sm font-bold" style={{ color: "var(--aiai-gray-800)" }}>
                {stage.title}
              </h3>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: "var(--aiai-green-100)", color: "var(--aiai-green-700)" }}
            >
              {stage.lessons.filter((l) => l.status === "completed").length}/{stage.lessons.length}
            </span>
          </div>

          {/* Winding path of lesson nodes */}
          {stage.lessons.length === 0 ? (
            <p className="text-center text-xs" style={{ color: "var(--aiai-gray-400)" }}>
              ยังไม่มีบทเรียน
            </p>
          ) : (
            <div className="relative mx-auto max-w-md">
              {stage.lessons.map((lesson, lIdx) => {
                const left = nodePosition(lIdx);
                const colors = nodeColors(lesson);
                const Wrapper: React.ElementType =
                  lesson.status === "locked" ? "div" : Link;
                const wrapperProps =
                  lesson.status === "locked"
                    ? {}
                    : ({ href: `/${locale}/learn/${courseCode}/lesson/${lesson.code}` } as { href: string });

                return (
                  <div
                    key={lesson.id}
                    className="relative"
                    style={{ marginTop: lIdx === 0 ? 0 : 32 }}
                  >
                    {/* Connector dashed line to previous node */}
                    {lIdx > 0 && (
                      <svg
                        viewBox="0 0 100 32"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute -top-8 left-0 h-8 w-full"
                      >
                        <path
                          d={`M ${nodePosition(lIdx - 1)} 0 Q 50 16 ${left} 32`}
                          stroke="var(--aiai-gray-200)"
                          strokeWidth="0.6"
                          strokeDasharray="2 2"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    )}

                    {/* Node */}
                    <div
                      className="relative"
                      style={{ marginLeft: `calc(${left}% - 36px)` }}
                    >
                      <Wrapper {...wrapperProps} className="block">
                        <motion.div
                          whileHover={lesson.status !== "locked" ? { scale: 1.05, y: -2 } : undefined}
                          whileTap={lesson.status !== "locked" ? { scale: 0.95 } : undefined}
                          className="flex size-[72px] cursor-pointer items-center justify-center rounded-full border-4"
                          style={{
                            background: colors.bg,
                            color: colors.fg,
                            borderColor: colors.ring,
                            boxShadow: `0 8px 20px ${colors.shadow}`,
                          }}
                          animate={
                            lesson.status === "available" && lesson.type !== "BOSS"
                              ? { y: [0, -3, 0] }
                              : undefined
                          }
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <NodeIcon lesson={lesson} />
                        </motion.div>
                      </Wrapper>

                      {/* Lesson title pill */}
                      <div
                        className="absolute left-1/2 top-[78px] -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium shadow-sm"
                        style={{
                          background: "#fff",
                          color:
                            lesson.status === "locked"
                              ? "var(--aiai-gray-400)"
                              : "var(--aiai-gray-800)",
                          border: "1px solid var(--aiai-gray-200)",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {lesson.title}
                      </div>
                    </div>

                    {/* Reserve space for the title pill below the node */}
                    <div style={{ height: 32 }} />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
