import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const lessons = await db.lesson.findMany({
    where: { stage: { course: { code: "AAY-FINANCE" } } },
    select: { code: true, content: true },
  });

  const hanziSet = new Set<string>();
  for (const l of lessons) {
    const c = l.content as { items?: Array<{ hanzi: string }> } | null;
    if (c?.items) c.items.forEach((item) => hanziSet.add(item.hanzi));
  }

  const vocab = await db.vocabulary.findMany({
    where: { category: { startsWith: "f" } },
    select: { hanzi: true, translations: true, category: true },
    orderBy: { category: "asc" },
  });

  console.log(`=== Lesson content vocab: ${hanziSet.size} unique words ===`);
  console.log([...hanziSet].join(", "));
  console.log(`\n=== DB vocab with f-category: ${vocab.length} words ===`);
  for (const v of vocab) {
    const t = v.translations as Record<string, string> | null;
    console.log(`  ${v.hanzi} [${v.category}] en="${t?.en ?? "MISSING"}"`);
  }
  await db.$disconnect();
}

main().catch(console.error);
