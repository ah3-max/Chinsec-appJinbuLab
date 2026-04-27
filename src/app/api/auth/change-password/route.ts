import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { encode } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authCookieName, authCookieOptions, clientIp } from "@/lib/cookie-name";

export const runtime = "nodejs";

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Block password changes while impersonating — that would let an admin alter
  // a learner's credentials behind their back.
  if (session.user._impersonatedBy) {
    return NextResponse.json(
      { error: "forbidden during impersonation" },
      { status: 403 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "weak" }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      role: true,
      uiLanguage: true,
      passwordHash: true,
      status: true,
    },
  });
  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "currentInvalid" }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: "sameAsCurrent" }, { status: 400 });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  await audit({
    userId: user.id,
    action: "PASSWORD_CHANGED",
    resource: "user",
    resourceId: user.id,
    ipAddress: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  // Refresh JWT so middleware no longer redirects to /change-password.
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
