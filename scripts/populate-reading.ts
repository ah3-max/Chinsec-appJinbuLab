/**
 * Populate a reading-passage lesson's paragraphs from a local JSON file.
 *
 * Keep your textbook reading content in a file outside git (e.g.
 * ~/Downloads/ms-c1-reading.json), then run:
 *
 *   npx tsx scripts/populate-reading.ts \
 *     --lesson MS-C1-READING \
 *     --file ~/Downloads/ms-c1-reading.json
 *
 * The JSON file should look like:
 *   {
 *     "title": "...",
 *     "titleTr": "...",
 *     "paragraphs": [
 *       { "cn": "<chinese paragraph 1>", "tr": "<thai paragraph 1>" },
 *       { "cn": "<chinese paragraph 2>", "tr": "<thai paragraph 2>" }
 *     ]
 *   }
 */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { PrismaClient } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface Paragraph {
  cn: string;
  tr?: string;
  pinyin?: string;
}

interface ReadingFile {
  title?: string;
  titleTr?: string;
  paragraphs: Paragraph[];
}

function expandHome(p: string): string {
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg) continue;
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = "true";
      }
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const lessonCode = args.lesson;
  const filePath = args.file;

  if (!lessonCode || !filePath) {
    console.error("Usage: npx tsx scripts/populate-reading.ts --lesson <CODE> --file <path-to-json>");
    process.exit(1);
  }

  const resolved = path.resolve(expandHome(filePath));
  if (!fs.existsSync(resolved)) {
    console.error(`❌ File not found: ${resolved}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(resolved, "utf-8")) as ReadingFile;
  if (!Array.isArray(data.paragraphs) || data.paragraphs.length === 0) {
    console.error("❌ JSON file must have a non-empty 'paragraphs' array of {cn, tr}");
    process.exit(1);
  }

  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) {
    console.error(`❌ Lesson ${lessonCode} not found`);
    process.exit(1);
  }

  const existing = (lesson.content as { type?: string; title?: string; titleTr?: string }) ?? {};
  const newContent = {
    type: "reading-passage" as const,
    title: data.title ?? existing.title ?? "",
    titleTr: data.titleTr ?? existing.titleTr ?? "",
    paragraphs: data.paragraphs.map((p) => ({
      cn: p.cn,
      tr: p.tr,
      ...(p.pinyin ? { pinyin: p.pinyin } : {}),
    })),
  };

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: newContent as object },
  });

  console.log(`✅ ${lessonCode}: populated ${data.paragraphs.length} paragraphs from ${path.basename(resolved)}`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
