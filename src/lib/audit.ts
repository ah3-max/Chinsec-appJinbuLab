import { db } from "./db";
import type { Prisma } from "@prisma/client";

export interface AuditEntry {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        before: entry.before,
        after: entry.after,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (err) {
    // Audit failure must never break the user-visible flow.
    console.error("[audit] failed to write audit log", err);
  }
}
