/**
 * Pass 2: backfill vocabulary.translations from existing lesson content.
 *
 * After scripts/migrate-image-prompts.ts ran, 336 polluted entries still have
 * no en (the source-file map didn't cover them). Many of those hanzi appear in
 * MTC lesson content where translations are correct. This pass walks every
 * lesson with `type: "vocabulary-list"` and uses items[].translations as the
 * source of truth for vocabularies.translations.
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

async function main() {
  console.log("📚 Reading vocabulary translations from lesson content…");
  const lessons = await db.lesson.findMany({
    where: { isPublished: true },
    select: { code: true, content: true },
  });

  const map = new Map<string, Record<string, string>>();
  for (const l of lessons) {
    const c = l.content as { type?: string; items?: Array<{ hanzi?: string; translations?: Record<string, string> }> } | null;
    if (c?.type !== "vocabulary-list" || !c.items) continue;
    for (const item of c.items) {
      if (item.hanzi && item.translations) {
        map.set(item.hanzi, item.translations);
      }
    }
  }
  console.log(`  ✅ Indexed ${map.size} hanzi from lessons\n`);

  const all = await db.vocabulary.findMany({ select: { hanzi: true, translations: true } });

  let restored = 0;
  let unchanged = 0;
  for (const row of all) {
    const lessonTr = map.get(row.hanzi);
    if (!lessonTr) continue;
    const tr = (row.translations as Record<string, string> | null) ?? {};
    const next: Record<string, string> = { ...tr };
    let changed = false;
    for (const k of ["en", "th", "vi", "id"]) {
      if (!next[k] && lessonTr[k]) {
        next[k] = lessonTr[k]!;
        changed = true;
      }
    }
    if (changed) {
      await db.vocabulary.update({ where: { hanzi: row.hanzi }, data: { translations: next } });
      restored++;
    } else {
      unchanged++;
    }
  }

  console.log(`  ✅ Backfilled ${restored} vocabularies from lesson content`);
  console.log(`  ⏭️  ${unchanged} already complete or no overlap\n`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
