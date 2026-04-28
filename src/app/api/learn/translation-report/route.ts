import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({
  contentType: z.enum(["vocabulary", "sentence", "ui_text", "dialogue"]),
  contentId: z.string().min(1).max(64),
  language: z.string().min(2).max(8),
  originalText: z.string().min(1).max(1000),
  suggestedText: z.string().max(2000).optional(),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // We attribute the report to the *target* user, not the impersonating admin.
  // This way feedback rolls up to the actual learner whose viewpoint flagged it.
  const userId = session.user.id;

  const created = await db.translationReport.create({
    data: {
      userId,
      contentType: parsed.data.contentType,
      contentId: parsed.data.contentId,
      language: parsed.data.language,
      originalText: parsed.data.originalText,
      suggestedText: parsed.data.suggestedText,
      comment: parsed.data.comment,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
