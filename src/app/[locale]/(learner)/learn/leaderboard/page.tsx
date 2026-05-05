import { redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, Trophy } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const myId = session.user.id;
  const myUser = await db.user.findUnique({
    where: { id: myId },
    select: { facilityId: true },
  });

  // Scope: same facility if available, otherwise global
  const facilityFilter = myUser?.facilityId
    ? { facilityId: myUser.facilityId }
    : {};

  const top = await db.user.findMany({
    where: {
      role: "LEARNER",
      ...facilityFilter,
    },
    orderBy: [{ weeklyXp: "desc" }, { totalXp: "desc" }],
    take: 20,
    select: {
      id: true,
      fullName: true,
      username: true,
      weeklyXp: true,
      totalXp: true,
      streakDays: true,
      currentLevel: true,
      nationality: true,
    },
  });

  const myRankIdx = top.findIndex((u) => u.id === myId);
  const myEntry =
    myRankIdx === -1
      ? await db.user.findUnique({
          where: { id: myId },
          select: {
            id: true,
            fullName: true,
            username: true,
            weeklyXp: true,
            totalXp: true,
            streakDays: true,
            currentLevel: true,
            nationality: true,
          },
        })
      : null;

  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/learn`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        กลับ
      </Link>

      {/* Hero header */}
      <header
        className="relative overflow-hidden rounded-2xl px-5 py-5 text-white shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)",
        }}
      >
        <div className="relative flex items-center gap-3">
          <Trophy className="size-9" />
          <div>
            <h1 className="text-xl font-bold">排行榜 · Leaderboard</h1>
            <p className="text-xs opacity-90">
              週 XP 排名 · {myUser?.facilityId ? "機構內" : "全部"}
            </p>
          </div>
        </div>
      </header>

      <ul className="space-y-2">
        {top.map((u, i) => (
          <Row key={u.id} user={u} rank={i + 1} isMe={u.id === myId} />
        ))}
        {myEntry && (
          <>
            <li className="text-center text-xs text-muted-foreground py-1">
              · · ·
            </li>
            <Row user={myEntry} rank={null} isMe />
          </>
        )}
        {top.length === 0 && (
          <li className="text-center text-xs text-muted-foreground py-6">
            還沒有人上榜,先去學習吧!
          </li>
        )}
      </ul>
    </div>
  );
}

function Row({
  user,
  rank,
  isMe,
}: {
  user: {
    id: string;
    fullName: string;
    username: string;
    weeklyXp: number;
    totalXp: number;
    streakDays: number;
    nationality: string;
  };
  rank: number | null;
  isMe: boolean;
}) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return (
    <li
      className="flex items-center gap-3 rounded-2xl border-2 p-3"
      style={{
        borderColor: isMe ? "var(--aiai-green-400)" : "var(--aiai-gray-200)",
        background: isMe
          ? "linear-gradient(90deg, var(--aiai-green-50) 0%, #fff 100%)"
          : "#fff",
      }}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{
          background:
            rank === 1 ? "#fbbf24"
            : rank === 2 ? "#cbd5e1"
            : rank === 3 ? "#fb923c"
            : "var(--aiai-gray-100)",
          color: rank && rank <= 3 ? "#fff" : "var(--aiai-gray-700)",
        }}
      >
        {medal ?? (rank ? rank : "—")}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold" style={{ color: "var(--aiai-gray-800)" }}>
          {user.fullName} {isMe && <span className="text-xs text-muted-foreground">(คุณ)</span>}
        </p>
        <p className="text-[10px] text-muted-foreground">
          @{user.username} · {user.nationality} · 🔥 {user.streakDays}
        </p>
      </div>
      <div className="text-right">
        <p className="text-base font-bold tabular-nums" style={{ color: "var(--aiai-green-700)" }}>
          {user.weeklyXp}
        </p>
        <p className="text-[10px] text-muted-foreground">週 XP</p>
      </div>
    </li>
  );
}
