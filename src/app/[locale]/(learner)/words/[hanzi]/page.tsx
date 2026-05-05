import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ChevronLeft, Volume2, BookOpen, Library } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookmarkStar } from "@/components/learner/bookmark-star";

interface Example {
  sentence: string;
  pinyin?: string;
  translation?: string;
}

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ locale: string; hanzi: string }>;
}) {
  const { locale, hanzi: rawHanzi } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const hanzi = decodeURIComponent(rawHanzi);

  // Check if this user has bookmarked this word
  const existingBookmark = await db.vocabBookmark.findUnique({
    where: { userId_hanzi: { userId: session.user.id, hanzi } },
    select: { id: true },
  });
  const isBookmarked = !!existingBookmark;

  const vocab = await db.vocabulary.findUnique({
    where: { hanzi },
    select: {
      hanzi: true,
      zhuyin: true,
      pinyin: true,
      partOfSpeech: true,
      translations: true,
      level: true,
      tocflBand: true,
      category: true,
      tags: true,
      imageUrl: true,
    },
  });
  if (!vocab) notFound();

  const translations = vocab.translations as Record<string, string> | null;
  const localeOrder: string[] = [locale, "th", "en", "zh-TW", "vi", "id"];
  const seen = new Set<string>();
  const orderedTrans: Array<{ lang: string; text: string }> = [];
  for (const lang of localeOrder) {
    if (seen.has(lang)) continue;
    seen.add(lang);
    if (translations?.[lang]) {
      orderedTrans.push({ lang, text: translations[lang]! });
    }
  }
  // Add any other languages not in our preferred order. Skip internal keys
  // (those starting with "_") — `_imagePromptHint` is the DALL-E prompt and
  // never a user-facing translation.
  if (translations) {
    for (const lang of Object.keys(translations)) {
      if (lang.startsWith("_")) continue;
      if (!seen.has(lang)) {
        orderedTrans.push({ lang, text: translations[lang]! });
        seen.add(lang);
      }
    }
  }
  // After the migration, `en` holds real English meaning. Show all real
  // translations; surface the image prompt separately (debug/info).
  const displayTrans = orderedTrans;
  const promptText = translations?._imagePromptHint;

  // Find lessons that use this word + collect their embedded examples
  type LessonRow = {
    id: string;
    code: string;
    title: string;
    content: unknown;
    stage: {
      code: string;
      title: string;
      course: { code: string; title: string };
    };
  };
  let lessons: LessonRow[] = [];
  try {
    lessons = (await db.lesson.findMany({
      where: {
        isPublished: true,
        content: { path: ["items"], array_contains: [{ hanzi }] },
      },
      select: {
        id: true,
        code: true,
        title: true,
        content: true,
        stage: {
          select: {
            code: true,
            title: true,
            course: { select: { code: true, title: true } },
          },
        },
      },
    })) as LessonRow[];
  } catch {
    lessons = [];
  }

  // Pull examples from any matching lesson item
  const allExamples: Example[] = [];
  let mnemonic: string | undefined;
  let usageNote: string | undefined;
  for (const lesson of lessons) {
    const content = lesson.content as {
      items?: Array<{
        hanzi: string;
        example?: { sentence?: string; sentencePinyin?: string; sentenceTh?: string };
        examples?: Example[];
        mnemonic?: string;
        usageNote?: string;
      }>;
    } | null;
    const item = content?.items?.find((i) => i.hanzi === hanzi);
    if (!item) continue;
    if (item.examples && item.examples.length > 0) {
      allExamples.push(...item.examples);
    } else if (item.example?.sentence) {
      allExamples.push({
        sentence: item.example.sentence,
        pinyin: item.example.sentencePinyin,
        translation: item.example.sentenceTh,
      });
    }
    if (item.mnemonic && !mnemonic) mnemonic = item.mnemonic;
    if (item.usageNote && !usageNote) usageNote = item.usageNote;
  }

  // Dedupe examples by sentence
  const uniqueExamples = Array.from(
    new Map(allExamples.map((e) => [e.sentence, e])).values(),
  );

  // User's own attempt history on exercises featuring this word
  const attempts = await db.userAttempt.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { exerciseSnapshot: { path: ["hanzi"], equals: hanzi } },
        { exercise: { prompt: { path: ["hanzi"], equals: hanzi } } },
      ],
    },
    select: {
      isCorrect: true,
      score: true,
      attemptedAt: true,
    },
    orderBy: { attemptedAt: "desc" },
    take: 20,
  }).catch(() => [] as Array<{ isCorrect: boolean; score: number; attemptedAt: Date }>);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : null;

  const imageUrl = vocab.imageUrl ?? `/api/vocab-image/${encodeURIComponent(hanzi)}`;

  return (
    <div className="space-y-4 px-4 pb-4">
      <Link
        href={`/${locale}/practice/vocabulary`}
        className="inline-flex items-center text-sm transition-colors"
        style={{ color: "var(--aiai-gray-600)" }}
      >
        <ChevronLeft className="size-4" />
        詞彙庫
      </Link>

      {/* Hero card */}
      <article
        className="relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm"
        style={{ borderColor: "var(--aiai-green-100)" }}
      >
        {/* Bookmark star — top-right overlay */}
        <div className="absolute right-3 top-3 z-10">
          <BookmarkStar hanzi={vocab.hanzi} initialBookmarked={isBookmarked} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="h-48 w-full object-cover"
          style={{ background: "var(--aiai-green-50)" }}
        />
        <div className="space-y-2 px-5 py-4 text-center">
          {vocab.zhuyin && (
            <p className="text-sm tracking-wider" style={{ color: "var(--aiai-gray-500)" }}>
              {vocab.zhuyin}
            </p>
          )}
          <h1 className="text-6xl font-bold" style={{ color: "var(--aiai-gray-800)" }}>
            {vocab.hanzi}
          </h1>
          <p className="text-base italic" style={{ color: "var(--aiai-green-600)" }}>
            {vocab.pinyin}
          </p>
          {vocab.partOfSpeech && (
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest"
              style={{ background: "var(--aiai-green-100)", color: "var(--aiai-green-700)" }}
            >
              {vocab.partOfSpeech}
            </span>
          )}
        </div>
      </article>

      {/* Translations */}
      {displayTrans.length > 0 && (
        <Card title="翻譯 / Translations" icon="🌏">
          <ul className="space-y-1.5">
            {displayTrans.map((t) => (
              <li
                key={t.lang}
                className="flex items-baseline gap-2 rounded-lg px-2 py-1"
                style={{ background: "var(--aiai-gray-100)" }}
              >
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                  style={{ background: "var(--aiai-green-400)", color: "#fff" }}
                >
                  {t.lang}
                </span>
                <span className="text-sm" style={{ color: "var(--aiai-gray-800)" }}>
                  {t.text}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Memory hint */}
      {mnemonic && (
        <div
          className="rounded-2xl border-2 p-3 text-sm"
          style={{
            borderColor: "#fbbf24",
            background: "linear-gradient(90deg, #fef3c7 0%, #fffbeb 100%)",
            color: "#78350f",
          }}
        >
          <span className="mr-1 font-bold">💡 จำง่ายๆ:</span>
          {mnemonic}
        </div>
      )}

      {/* Usage note */}
      {usageNote && (
        <div
          className="rounded-2xl border-2 p-3 text-sm"
          style={{
            borderColor: "#60a5fa",
            background: "#eff6ff",
            color: "#1e3a8a",
          }}
        >
          <span className="mr-1 font-bold">ℹ️</span>
          {usageNote}
        </div>
      )}

      {/* Examples */}
      {uniqueExamples.length > 0 && (
        <Card title={`例句 / Examples (${uniqueExamples.length})`} icon="📝">
          <ul className="space-y-2">
            {uniqueExamples.map((ex, i) => (
              <li
                key={i}
                className="rounded-xl border px-3 py-2"
                style={{ borderColor: "var(--aiai-green-100)", background: "#fafafa" }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: "var(--aiai-green-400)", color: "#fff" }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--aiai-gray-800)" }}>
                      {ex.sentence}
                    </p>
                    {ex.pinyin && (
                      <p className="mt-0.5 text-xs italic" style={{ color: "var(--aiai-green-600)" }}>
                        {ex.pinyin}
                      </p>
                    )}
                    {ex.translation && (
                      <p className="mt-0.5 text-xs" style={{ color: "var(--aiai-gray-500)" }}>
                        {ex.translation}
                      </p>
                    )}
                  </div>
                  <Volume2
                    className="mt-1 size-4 shrink-0"
                    style={{ color: "var(--aiai-green-500)" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Found in lessons */}
      {lessons.length > 0 && (
        <Card title={`出現在 / Found in (${lessons.length})`} icon="📚">
          <ul className="space-y-1.5">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/${locale}/learn/${l.stage.course.code}/lesson/${l.code}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors"
                  style={{ background: "var(--aiai-gray-100)" }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--aiai-gray-800)" }}>
                      {l.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--aiai-gray-500)" }}>
                      {l.stage.course.title} · {l.stage.code}
                    </p>
                  </div>
                  <ChevronLeft className="size-4 rotate-180" style={{ color: "var(--aiai-gray-400)" }} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Your stats */}
      {accuracy !== null && (
        <Card title="คุณกับคำนี้ / Your stats" icon="📊">
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="ครั้งที่ลอง" value={totalAttempts} />
            <Stat label="ตอบถูก" value={correctAttempts} color="#15803d" />
            <Stat label="ความแม่น" value={`${accuracy}%`} color={accuracy >= 80 ? "#15803d" : accuracy >= 50 ? "#fb923c" : "#b91c1c"} />
          </div>
        </Card>
      )}

      {/* Metadata footer */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[11px]" style={{ color: "var(--aiai-gray-400)" }}>
        <Library className="size-3" />
        Level {vocab.level}
        {vocab.tocflBand && <> · TOCFL {vocab.tocflBand}</>}
        {vocab.category && <> · {vocab.category}</>}
      </div>

      {promptText && (
        <p className="text-center text-[10px] italic" style={{ color: "var(--aiai-gray-300)" }}>
          🎨 Image prompt: "{promptText}"
        </p>
      )}
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border bg-white p-3 shadow-sm"
      style={{ borderColor: "var(--aiai-gray-200)" }}
    >
      <h2
        className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--aiai-green-700)" }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div
      className="rounded-xl border-2 p-2"
      style={{
        borderColor: "var(--aiai-green-100)",
        background: "linear-gradient(135deg, #f0fdf4 0%, #fff 100%)",
      }}
    >
      <p className="text-base font-bold tabular-nums" style={{ color: color ?? "var(--aiai-green-800)" }}>
        {value}
      </p>
      <p className="text-[10px]" style={{ color: "var(--aiai-gray-500)" }}>
        {label}
      </p>
    </div>
  );
}
