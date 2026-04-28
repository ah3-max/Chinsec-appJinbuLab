import { NextResponse, type NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authCookieName, authCookieOptions, clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

// SUPER_ADMIN one-click escape from the forced password-change flow. Lets
// 順元 sail past 「請更改您的初始密碼」 without having to actually rotate
// the seeded ChangeMe@2026 — useful in dev and for the project owner who
// doesn't want the friction. Refused for any non-SUPER_ADMIN role.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (session.user._impersonatedBy) {
    return NextResponse.json(
      { error: "forbidden during impersonation" },
      { status: 403 },
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      role: true,
      uiLanguage: true,
      status: true,
    },
  });
  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await db.user.update({
    where: { id: user.id },
    data: { mustChangePassword: false },
  });

  await audit({
    userId: user.id,
    action: "PASSWORD_CHANGE_SKIPPED_SUPERADMIN",
    resource: "user",
    resourceId: user.id,
    ipAddress: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  // Re-encode JWT so middleware stops redirecting to /change-password.
  const cookieName = authCookieName();
  const newToken = await encode({
    token: {
      id: user.id,
      username: user.username,
      role: user.role,
      uiLanguage: user.uiLanguage,
      mustChangePassword: false,
    },
    secret: process.env.AUTH_SECRET!,
    salt: cookieName,
    maxAge: SESSION_MAX_AGE,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, newToken, authCookieOptions(SESSION_MAX_AGE));
  return res;
}
