import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// POST /api/bookmarks/[hanzi]  → create bookmark (idempotent)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ hanzi: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { hanzi: raw } = await params;
  const hanzi = decodeURIComponent(raw);
  if (!hanzi) return NextResponse.json({ error: "missing hanzi" }, { status: 400 });

  const bookmark = await db.vocabBookmark.upsert({
    where: { userId_hanzi: { userId: session.user.id, hanzi } },
    create: { userId: session.user.id, hanzi },
    update: {},
    select: { id: true, hanzi: true, createdAt: true },
  });
  return NextResponse.json({ ok: true, bookmark });
}

// DELETE /api/bookmarks/[hanzi]  → remove bookmark (idempotent)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ hanzi: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { hanzi: raw } = await params;
  const hanzi = decodeURIComponent(raw);
  await db.vocabBookmark.deleteMany({
    where: { userId: session.user.id, hanzi },
  });
  return NextResponse.json({ ok: true });
}
