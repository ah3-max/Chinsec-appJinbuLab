/**
 * scripts/sync-mtc-references.ts
 *
 * Push the metadata-only MTC registry (`src/content/mtc-references.json`)
 * into Vocabulary.mtcReference for matching hanzi.
 *
 * Why metadata-only: 《當代中文課程》(MTC) is copyrighted; we never embed
 * book content/audio/sentences. We only record "this hanzi first appears in
 * B1-L02" so the UI can display alignment hints to MTC students.
 *
 * Run:
 *   npx tsx scripts/sync-mtc-references.ts            # dry-run by default
 *   npx tsx scripts/sync-mtc-references.ts --apply    # actually write to DB
 */

import { PrismaClient } from "@prisma/client";
import registry from "../src/content/mtc-references.json";

const APPLY = process.argv.includes("--apply");

interface MtcEntry {
  book: string;
  lesson: string;
  firstSeenIn?: string;
}

interface Registry {
  references: Record<string, MtcEntry>;
}

const TYPED = registry as unknown as Registry;

async function main() {
  const prisma = new PrismaClient();

  const hanziList = Object.keys(TYPED.references);
  console.log(`📖 Registry has ${hanziList.length} hanzi → MTC entries`);

  const existing = await prisma.vocabulary.findMany({
    where: { hanzi: { in: hanziList } },
    select: { id: true, hanzi: true, mtcReference: true },
  });

  console.log(`📚 ${existing.length} matching vocab in DB`);

  let toUpdate = 0;
  let alreadyAligned = 0;
  let toCreate = hanziList.length - existing.length;
  const updates: Array<{ id: string; hanzi: string; from: unknown; to: MtcEntry }> = [];

  for (const v of existing) {
    const want = TYPED.references[v.hanzi]!;
    const wantPayload = { book: want.book, lesson: want.lesson };
    const cur = (v.mtcReference as { book?: string; lesson?: string } | null) ?? null;
    if (cur && cur.book === want.book && cur.lesson === want.lesson) {
      alreadyAligned++;
      continue;
    }
    updates.push({ id: v.id, hanzi: v.hanzi, from: cur, to: wantPayload });
    toUpdate++;
  }

  console.log(
    `✓ already aligned: ${alreadyAligned}\n  to update: ${toUpdate}\n  registry hanzi missing from DB: ${toCreate}`,
  );

  if (updates.length) {
    console.log("\nFirst 10 updates:");
    for (const u of updates.slice(0, 10)) {
      console.log(`  ${u.hanzi}: ${JSON.stringify(u.from)} → ${JSON.stringify(u.to)}`);
    }
  }

  if (!APPLY) {
    console.log("\n(dry run — pass --apply to write changes)");
    await prisma.$disconnect();
    return;
  }

  let applied = 0;
  for (const u of updates) {
    await prisma.vocabulary.update({
      where: { id: u.id },
      data: { mtcReference: u.to },
    });
    applied++;
  }
  console.log(`\n✅ applied ${applied} updates`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
