import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 給 OpenClaw Heartbeat 與 Docker healthcheck 用
export async function GET() {
  const startedAt = Date.now();
  let dbOk = false;
  let dbLatencyMs: number | null = null;

  try {
    const t0 = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - t0;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    {
      status: dbOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeMs: Math.round(process.uptime() * 1000),
      checks: {
        db: { ok: dbOk, latencyMs: dbLatencyMs },
      },
      tookMs: Date.now() - startedAt,
    },
    { status: dbOk ? 200 : 503 },
  );
}
