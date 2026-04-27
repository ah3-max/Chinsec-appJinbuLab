import { NextResponse, type NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authCookieName, authCookieOptions, clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const ADMIN_SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!session.user._impersonatedBy) {
    return NextResponse.json(
      { error: "not impersonating" },
      { status: 400 },
    );
  }

  const adminId = session.user._impersonatedBy;
  const targetUserId = session.user.id;

  const admin = await db.user.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      username: true,
      role: true,
      uiLanguage: true,
      status: true,
    },
  });
  if (!admin || admin.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "admin not available" },
      { status: 400 },
    );
  }

  const cookieName = authCookieName();
  const newSession = await encode({
    token: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      uiLanguage: admin.uiLanguage,
    },
    secret: process.env.AUTH_SECRET!,
    salt: cookieName,
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  await audit({
    userId: adminId,
    action: "IMPERSONATE_END",
    resource: "user",
    resourceId: targetUserId,
    after: { adminId, targetUserId },
    ipAddress: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  const res = NextResponse.json({
    ok: true,
    redirectTo: `/${admin.uiLanguage}/users`,
  });
  res.cookies.set(
    cookieName,
    newSession,
    authCookieOptions(ADMIN_SESSION_MAX_AGE),
  );
  return res;
}
