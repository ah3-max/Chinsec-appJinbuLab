import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateImpersonateToken } from "@/lib/auth-impersonate";
import { audit } from "@/lib/audit";
import { clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const schema = z.object({ targetUserId: z.string().min(1).max(64) });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // Block nested impersonation.
  if (session.user._impersonatedBy) {
    return NextResponse.json(
      { error: "already impersonating" },
      { status: 400 },
    );
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { targetUserId } = parsed.data;

  if (targetUserId === session.user.id) {
    return NextResponse.json(
      { error: "cannot impersonate self" },
      { status: 400 },
    );
  }

  const target = await db.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      role: true,
      status: true,
      fullName: true,
      username: true,
    },
  });
  if (!target || target.status !== "ACTIVE") {
    return NextResponse.json({ error: "target not found" }, { status: 404 });
  }
  if (target.role === "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "cannot impersonate super admin" },
      { status: 403 },
    );
  }

  const token = await generateImpersonateToken(session.user.id, targetUserId);

  await audit({
    userId: session.user.id,
    action: "IMPERSONATE_START",
    resource: "user",
    resourceId: targetUserId,
    after: {
      adminId: session.user.id,
      targetUserId,
      targetUsername: target.username,
    },
    ipAddress: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({
    magicUrl: `/api/admin/impersonate/consume?token=${encodeURIComponent(token)}`,
  });
}
