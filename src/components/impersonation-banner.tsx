import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ImpersonationBannerClient } from "./impersonation-banner-client";

export async function ImpersonationBanner() {
  const session = await auth();
  if (!session?.user?._impersonatedBy) return null;

  const [admin, target] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user._impersonatedBy },
      select: { fullName: true, username: true },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { fullName: true, username: true },
    }),
  ]);

  return (
    <ImpersonationBannerClient
      adminLabel={admin?.fullName ?? admin?.username ?? "?"}
      targetLabel={target?.fullName ?? target?.username ?? session.user.username}
    />
  );
}
