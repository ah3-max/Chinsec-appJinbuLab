import { NextResponse, type NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  IMPERSONATION_SESSION_MAX_AGE,
  isTokenUsed,
  markTokenUsed,
  verifyImpersonateToken,
} from "@/lib/auth-impersonate";
import { authCookieName, authCookieOptions } from "@/lib/cookie-name";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return errorRedirect(req, "unauthorized");
  }
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    return errorRedirect(req, "forbidden");
  }
  if (session.user._impersonatedBy) {
    return errorRedirect(req, "already impersonating");
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token) return errorRedirect(req, "missing token");

  const payload = await verifyImpersonateToken(token);
  if (!payload) return errorRedirect(req, "invalid or expired token");

  // Token must have been minted for the currently signed-in admin.
  if (payload.adminId !== session.user.id) {
    return errorRedirect(req, "token mismatch");
  }

  // One-shot via Redis. Mark first, then proceed — this closes a tiny race
  // window where two concurrent consume calls might both pass the check.
  if (await isTokenUsed(payload.jti)) {
    return errorRedirect(req, "token already used");
  }
  await markTokenUsed(payload.jti);

  const target = await db.user.findUnique({
    where: { id: payload.targetUserId },
    select: {
      id: true,
      username: true,
      role: true,
      uiLanguage: true,
      status: true,
    },
  });
  if (
    !target ||
    target.status !== "ACTIVE" ||
    target.role === "SUPER_ADMIN"
  ) {
    return errorRedirect(req, "target invalid");
  }

  const cookieName = authCookieName();
  const newSession = await encode({
    token: {
      id: target.id,
      username: target.username,
      role: target.role,
      uiLanguage: target.uiLanguage,
      _impersonatedBy: payload.adminId,
    },
    secret: process.env.AUTH_SECRET!,
    salt: cookieName,
    maxAge: IMPERSONATION_SESSION_MAX_AGE,
  });

  const redirectUrl = new URL(`/${target.uiLanguage}/learn`, req.url);
  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set(
    cookieName,
    newSession,
    authCookieOptions(IMPERSONATION_SESSION_MAX_AGE),
  );
  return res;
}

function errorRedirect(req: NextRequest, reason: string) {
  const url = new URL("/login", req.url);
  url.searchParams.set("impersonate_error", reason);
  return NextResponse.redirect(url);
}
