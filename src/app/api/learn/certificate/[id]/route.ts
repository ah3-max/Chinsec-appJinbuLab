import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LEVEL_ORDER } from "@/lib/level";

export const runtime = "nodejs";

const LEVEL_LABEL_KEY = (level: string) => level;

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cert = await db.certificate.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      level: true,
      courseCode: true,
      fullNameSnapshot: true,
      scoreSnapshot: true,
      maxScoreSnapshot: true,
      issuedAt: true,
    },
  });
  if (!cert) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Allow the certificate's owner OR an admin to read it.
  const isOwner = cert.userId === session.user.id;
  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: cert.id,
    fullName: cert.fullNameSnapshot,
    levelLabel: LEVEL_LABEL_KEY(cert.level),
    courseCode: cert.courseCode,
    scoreSnapshot: cert.scoreSnapshot,
    maxScoreSnapshot: cert.maxScoreSnapshot,
    issuedAt: cert.issuedAt.toISOString(),
  });
}

void LEVEL_ORDER; // silence unused-import in case of future use
