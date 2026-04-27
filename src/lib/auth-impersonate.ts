import { SignJWT, jwtVerify } from "jose";
import { redis } from "./redis";
import { db } from "./db";

const TTL_SEC = 5 * 60;
const REDIS_USED_KEY = (jti: string) => `impersonate:used:${jti}`;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export interface ImpersonatePayload {
  adminId: string;
  targetUserId: string;
  jti: string;
}

export async function generateImpersonateToken(
  adminId: string,
  targetUserId: string,
): Promise<string> {
  const jti = crypto.randomUUID();
  return new SignJWT({
    adminId,
    targetUserId,
    type: "impersonate",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${TTL_SEC}s`)
    .sign(secret());
}

export async function verifyImpersonateToken(
  token: string,
): Promise<ImpersonatePayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.type !== "impersonate") return null;
    const adminId = payload.adminId;
    const targetUserId = payload.targetUserId;
    const jti = payload.jti;
    if (
      typeof adminId !== "string" ||
      typeof targetUserId !== "string" ||
      typeof jti !== "string"
    ) {
      return null;
    }

    // Defense in depth: confirm the admin still has impersonate-capable role.
    const admin = await db.user.findUnique({
      where: { id: adminId },
      select: { role: true, status: true },
    });
    if (!admin || admin.status !== "ACTIVE") return null;
    if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") return null;

    return { adminId, targetUserId, jti };
  } catch {
    return null;
  }
}

export async function isTokenUsed(jti: string): Promise<boolean> {
  return (await redis.exists(REDIS_USED_KEY(jti))) === 1;
}

export async function markTokenUsed(jti: string): Promise<void> {
  // Keep the marker around slightly past the JWT exp so a replay can't hit a
  // stale slot.
  await redis.set(REDIS_USED_KEY(jti), "1", "EX", TTL_SEC + 60);
}

export const IMPERSONATION_SESSION_MAX_AGE = 60 * 60; // 1 hour
