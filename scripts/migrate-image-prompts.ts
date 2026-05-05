/**
 * One-time migration to fix the dual-purpose `translations.en` field.
 *
 * Problem: original seed scripts overwrote `translations.en` with the DALL-E
 * image prompt (e.g. "clay caregiver helping elderly turn over in bed"). The
 * real English meaning ("to turn over") still lives in the source files at
 * src/content/scenarios/*.ts but was lost from the DB.
 *
 * Fix:
 *   1. Read every scenario source file and rebuild a hanzi → real-English map.
 *   2. For every Vocabulary row, move the existing `translations.en` (which is
 *      almost always an image prompt) to `translations._imagePromptHint`.
 *   3. Restore `translations.en` from the source map. If the hanzi isn't in
 *      any source file, leave en empty so callers fall back to th.
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

interface ScenarioVocabSeed {
  hanzi: string;
  translations?: { en?: string; th?: string; vi?: string; id?: string };
}
interface ScenarioDef {
  vocabularies?: ScenarioVocabSeed[];
}

async function loadAllScenarioVocab(): Promise<Map<string, { en?: string; th?: string; vi?: string; id?: string }>> {
  const dir = path.resolve(process.cwd(), "src/content/scenarios");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.startsWith("_"));
  const map = new Map<string, { en?: string; th?: string; vi?: string; id?: string }>();
  for (const f of files) {
    const mod = await import(path.join(dir, f));
    for (const exportName of Object.keys(mod)) {
      const def = mod[exportName] as ScenarioDef | undefined;
      if (!def?.vocabularies) continue;
      for (const v of def.vocabularies) {
        if (v.hanzi && v.translations) {
          // last write wins — a hanzi appearing in two scenarios uses the latter
          map.set(v.hanzi, v.translations);
        }
      }
    }
  }
  return map;
}

async function main() {
  console.log("📚 Loading real translations from source files…");
  const sourceMap = await loadAllScenarioVocab();
  console.log(`  ✅ Indexed ${sourceMap.size} unique hanzi from source\n`);

  const all = await db.vocabulary.findMany({ select: { hanzi: true, translations: true } });
  console.log(`📊 Inspecting ${all.length} vocabularies…\n`);

  let migratedHint = 0; // moved en → _imagePromptHint
  let restoredEn = 0;   // wrote real English from source
  let skipped = 0;      // already migrated or no clean-up needed
  let noSource = 0;     // polluted but no source mapping found

  for (const row of all) {
    const tr = (row.translations as Record<string, string> | null) ?? {};
    const en = tr.en;
    const isImagePrompt = typeof en === "string" && /^clay\s/i.test(en);
    const next: Record<string, string> = { ...tr };

    let changed = false;

    if (isImagePrompt && !next._imagePromptHint) {
      next._imagePromptHint = en;
      delete next.en;
      migratedHint++;
      changed = true;
    }

    const realFromSource = sourceMap.get(row.hanzi);
    if (realFromSource) {
      // Restore en/vi/id/th from source if they're missing or were polluted
      if (!next.en && realFromSource.en) {
        next.en = realFromSource.en;
        restoredEn++;
        changed = true;
      }
      if (!next.vi && realFromSource.vi) { next.vi = realFromSource.vi; changed = true; }
      if (!next.id && realFromSource.id) { next.id = realFromSource.id; changed = true; }
      if (!next.th && realFromSource.th) { next.th = realFromSource.th; changed = true; }
    } else if (isImagePrompt) {
      noSource++;
    }

    if (!changed) {
      skipped++;
      continue;
    }

    await db.vocabulary.update({
      where: { hanzi: row.hanzi },
      data: { translations: next },
    });
  }

  console.log(`  ✅ Moved ${migratedHint} image prompts → _imagePromptHint`);
  console.log(`  ✅ Restored real English on ${restoredEn} entries from scenario source`);
  console.log(`  ⚠️  ${noSource} polluted entries had no source mapping (en cleared, falls back to th)`);
  console.log(`  ⏭️  ${skipped} entries unchanged\n`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
