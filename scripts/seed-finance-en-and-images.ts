/**
 * 1. Seeds English translations for all 207 AAY-FINANCE vocabulary words.
 * 2. Generates DALL-E 3 clay-style images for all of them and caches in MinIO.
 *
 * Run:  npx tsx scripts/seed-finance-en-and-images.ts
 * Flags: --images-only  (skip DB update, only generate missing images)
 *        --db-only      (only update DB, skip image generation)
 *        --category f13-asset  (only process one category)
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { Client as MinioClient } from "minio";
import OpenAI from "openai";
import sharp from "sharp";
import { buildVocabImagePrompt } from "../src/lib/vocab-image-style";

const TARGET_SIZE = 768;
const WEBP_QUALITY = 85;

// Load .env.local
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

// ─── English meaning map for all 207 AAY-FINANCE vocabulary ──────────────────
// Format: hanzi → English description optimised for DALL-E illustration prompt
const EN: Record<string, string> = {
  // f01-org — Organization units
  "財團法人":     "non-profit foundation organization building",
  "臺北市私立愛愛院": "elderly care nursing home institution",
  "院本部":      "headquarters main building",
  "東明":        "branch care unit building",
  "愛力勇":      "care service unit",
  "A單位":       "care unit A department",
  "日照中心":     "elderly day care center",

  // f02-report — Financial reports
  "收支表":      "income expense statement financial report",
  "收支餘絀表":   "surplus deficit financial balance report",
  "全年度收支餘絀表": "annual full-year financial report",
  "合併":        "merge combine documents together",
  "初版":        "first draft version document",
  "單位：元":    "currency unit yuan coin",

  // f03-period — Periods / totals
  "科目編號":     "account code number label",
  "項目":        "item category list checklist",
  "01期":        "first period quarter calendar",
  "02期":        "second period quarter calendar",
  "03期":        "third period quarter calendar",
  "合計":        "total sum calculation adding numbers",
  "小計":        "subtotal partial sum",
  "總額":        "grand total amount sum",

  // f04-income — Income
  "收入":        "income money coming in revenue",
  "收入合計":    "total income sum revenue",
  "政府補助款":   "government grant subsidy money",
  "社會局補助款": "social welfare bureau subsidy",
  "衛福部補助款": "ministry health welfare grant",
  "加菜金補助":   "meal supplement food allowance",
  "特別處遇費":   "special treatment care service fee",
  "專業服務人員補助": "professional staff subsidy allowance",
  "其他補助收入": "other additional subsidy income",
  "捐款收入":    "donation income charity money",
  "一般捐款":    "general donation box charity",
  "勸募捐款":    "fundraising donation campaign",
  "實物捐贈":    "in-kind donation goods supplies",
  "安養護收入":   "nursing care service income",
  "安養護月費收入": "monthly nursing care fee payment",
  "安養護耗材收入": "nursing consumable supplies income",
  "愛心扶助":    "charity assistance helping hand",
  "日照收入":    "day care service income",
  "日照服務收入": "day care program income revenue",
  "A單位服務收入": "unit A service income",
  "利息收入":    "interest income bank money growing",
  "其他收入":    "other miscellaneous income",
  "其他雜項收入": "other various miscellaneous income",
  "優免":        "discount exemption reduction fee",

  // f05-personnel — Personnel costs
  "支出":        "expenditure money going out expense",
  "支出總額":    "total expenditure sum",
  "人事費":      "personnel human resources cost",
  "人事費-1":    "personnel cost category one",
  "人事費-2":    "personnel cost category two",
  "薪資":        "salary wages paycheck money",
  "薪資支出-應稅": "taxable salary expense",
  "薪資支出-免稅": "tax-exempt salary expense",
  "伙食津貼":    "meal allowance food benefit",
  "加班費":      "overtime pay extra work hours",
  "加班費-免稅":  "tax-exempt overtime pay",
  "職工福利":    "employee welfare benefits package",
  "訓練費":      "training course fee education",
  "外勞就業安定費": "foreign worker employment stability fund",

  // f06-operating — Operating expenses
  "事務費":      "office administration fee",
  "交通費":      "transportation travel expense car",
  "文具用品":    "stationery office supplies pen paper",
  "印刷費":      "printing fee paper documents",
  "運費":        "shipping freight delivery cost",
  "郵電費":      "postage mail communication fee",
  "交際費":      "entertainment hospitality expense",
  "書報雜誌":    "books newspapers magazines reading",
  "水費":        "water bill utility tap water",
  "電費":        "electricity bill power utility",
  "瓦斯費":      "gas bill cooking fuel utility",
  "租金支出":    "rent expense building lease",
  "稅捐":        "tax levy government fee",
  "團體會費":    "group organization membership fee",
  "募款活動支出": "fundraising event campaign expense",
  "設施器具費":   "facility equipment tools fee",
  "雜項購置":    "miscellaneous purchase items",
  "維護費":      "maintenance upkeep fee",
  "修繕費":      "repair fix maintenance fee",
  "院舍修繕費":   "facility building repair maintenance",
  "公共安全費":   "public safety inspection fee",
  "折舊":        "depreciation old equipment aging worn",
  "各項耗竭及攤提": "depletion amortization accounting",

  // f07-insurance — Insurance and retirement
  "保險退休金":   "insurance retirement pension fund",
  "勞健保":      "labor health insurance card",
  "勞工退休金":   "worker retirement pension savings",
  "保險費":      "insurance premium protection",
  "其他成本":    "other additional costs",
  "雜項支出":    "miscellaneous various expenses",

  // f08-material — Materials and resident expenses
  "業務費":      "business operation service fee",
  "住民活動費":   "resident activity recreation fee",
  "住民交通費":   "resident transportation outing fee",
  "材料費":      "material supplies raw cost",
  "主副食費":    "main side dish meal food cost",
  "被服費":      "clothing textile fabric expense",
  "住民用品費":   "resident daily supplies expense",
  "住民醫藥保健費": "resident medical health care fee",
  "住民就醫門診費": "resident clinic doctor visit fee",
  "醫療耗材":    "medical disposable supplies gauze",
  "消耗品費":    "consumable supplies expense",
  "一般耗材":    "general consumable supplies",
  "住民營養品":   "resident nutritional supplement vitamin",
  "清潔用品":    "cleaning supplies mop detergent",

  // f09-admin — Administration
  "行政管理支出": "administrative management expense office",
  "目的事業支出": "mission purpose program expense",
  "行政作業費":   "administrative operational work fee",
  "兼任行政總務費": "part-time administrative general affairs fee",
  "事務器材分攤費": "office equipment shared allocated cost",
  "分攤":        "cost sharing allocation split",

  // f10-profit — Profit / loss
  "餘絀":        "surplus deficit balance accounting",
  "本期餘(絀)":  "current period surplus deficit",
  "本期餘絀":    "current period balance result",
  "盈餘":        "profit surplus positive balance",
  "虧損":        "loss deficit negative balance",
  "支出率":      "expense ratio percentage chart",
  "餘絀率":      "surplus deficit ratio percentage",
  "預算":        "budget financial plan document",
  "預估":        "estimate forecast projection",
  "暫估":        "provisional temporary estimate",
  "精準收入":    "accurate precise income target",

  // f11-deprec — Depreciation and asset records
  "資產編號":    "asset identification number tag label",
  "資產名稱":    "asset name label tag",
  "資產規格":    "asset specification model detail",
  "管理區分":    "management classification category",
  "型態":        "type form shape category",
  "主件":        "main unit principal component",
  "主件編號":    "main component number code",
  "取得日期":    "purchase acquisition date calendar",
  "取得成本":    "acquisition purchase cost price",
  "原幣取得成本": "original currency purchase cost",
  "銷帳日期":    "write-off disposal date end",
  "開始提列":    "start begin depreciation record",
  "折舊方法":    "depreciation method accounting",
  "平均法":      "straight-line average method equal",
  "耐用年限":    "useful life years duration",
  "未用年限":    "remaining useful life years",
  "預留殘值":    "residual salvage value remaining",
  "資產價值":    "asset value worth price tag",
  "本期提列折舊": "current period depreciation charge",
  "累積折舊":    "accumulated total depreciation",
  "帳面價值":    "book value accounting record",
  "折舊分攤方式": "depreciation allocation sharing method",
  "依保管部門":  "by custodian department division",
  "續提殘值":    "continuing residual value extension",
  "續提耐用月數": "continuing useful months extension",
  "數量":        "quantity count number amount",
  "單位":        "unit measurement label",
  "備註":        "notes remarks annotation memo",

  // f12-measure — Measure words / units
  "式":  "set formula type unit",
  "組":  "group set assembled parts",
  "套":  "complete set package suit",
  "台":  "machine device unit counter",
  "輛":  "vehicle car unit counter",
  "個":  "piece individual item unit",
  "張":  "sheet flat paper card unit",
  "萬":  "ten thousand large number",
  "元":  "yuan dollar coin currency",

  // f13-asset — Physical assets / equipment (most visually rich)
  "裝修工程":    "renovation construction interior decoration work",
  "資訊系統":    "computer information IT system server",
  "硬體設備":    "computer hardware equipment server rack",
  "臉部辨識系統": "face recognition camera system security",
  "投影機":      "projector beaming light screen",
  "電視機":      "television TV flat screen",
  "擴音機":      "speaker amplifier sound system microphone",
  "液晶螢幕":    "LCD monitor flat display screen",
  "壁掛桌機":    "wall-mounted desktop computer",
  "空氣品質監測": "air quality sensor monitor device",
  "車輛追蹤管理": "vehicle GPS tracker car tracking",
  "蒸烤箱":      "steam oven cooking appliance",
  "生命徵象量測": "vital signs medical monitor pulse oximeter",
  "換藥車":      "medical dressing medication cart trolley",
  "座椅式體重機": "chair weighing scale elderly medical",
  "上肢復健器材": "arm upper limb rehabilitation equipment",
  "餐桌":        "dining table eating",
  "長桌":        "long rectangular table",
  "圓桌":        "round circle table",
  "扶手餐椅":    "dining chair with armrests",
  "沙發":        "sofa couch comfortable seat",
  "飲水機":      "water dispenser cooler",
  "洗碗機":      "dishwasher machine kitchen",
  "崁入式":      "built-in embedded fitted appliance",
  "變頻冰箱":    "inverter refrigerator fridge",
  "空調設備":    "air conditioning HVAC unit",
  "分離式冷氣機": "split-type air conditioner wall unit",
  "休閒藤椅":    "rattan wicker leisure chair",
  "休閒躺椅":    "recliner lounge chair comfortable",
  "印柚集成桌組": "teak wood table furniture set",
  "不斷電系統":   "UPS uninterruptible power supply battery backup",
  "灌溉系統":    "irrigation water sprinkler garden system",
  "影印機":      "photocopier printer office machine",

  // f14-glossary — Care home operations glossary
  "長輩":        "elderly senior person grandparent",
  "住民":        "elderly resident nursing home",
  "入住":        "check-in admission entering care home",
  "床位":        "hospital bed space slot",
  "床頭卡":      "bedside name card label",
  "床墊":        "mattress bed cushion",
  "照服員":      "caregiver care worker nurse aide",
  "進階培訓":    "advanced training workshop seminar",
  "獎勵金":      "bonus incentive reward money prize",
  "服務天數":    "service days count calendar",
  "服務人次":    "service person times count",
  "預計":        "planned expected scheduled",
  "實際":        "actual real result",
  "收費":        "fee charge payment collection",
  "調漲":        "price increase adjustment raise",
  "春酒":        "spring banquet party celebration dinner",
  "頂樓":        "rooftop terrace top floor",
  "現金支出":    "cash payment money out wallet",
};

// ─── Clients ──────────────────────────────────────────────────────────────────
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: parseInt(process.env.MINIO_PORT ?? "9000", 10),
  useSSL: (process.env.MINIO_USE_SSL ?? "false") === "true",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY ?? "chinese_learn_minio_pwd",
});
const BUCKET = process.env.MINIO_BUCKET_VOCAB_IMAGES ?? "chinese-learn-vocab-images";

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function isCached(hanzi: string) {
  // Either format counts as cached
  for (const ext of ["webp", "png"]) {
    try { await minioClient.statObject(BUCKET, `vocab-images/${hanzi}.${ext}`); return true; } catch {}
  }
  return false;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const imagesOnly = args.includes("--images-only");
  const dbOnly = args.includes("--db-only");
  const categoryFilter = args.find((a) => a.startsWith("--category="))?.split("=")[1]
    ?? (args.includes("--category") ? args[args.indexOf("--category") + 1] : undefined);

  if (!process.env.OPENAI_API_KEY && !dbOnly) {
    console.error("❌ OPENAI_API_KEY not set — use --db-only to skip image generation");
    process.exit(1);
  }

  // Ensure bucket exists
  try {
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) await minioClient.makeBucket(BUCKET);
  } catch {}

  // Fetch target vocab
  const where = categoryFilter ? { category: categoryFilter } : { category: { startsWith: "f" } };
  const vocab = await prisma.vocabulary.findMany({
    where,
    select: { hanzi: true, translations: true, category: true },
    orderBy: [{ category: "asc" }],
  });

  console.log(`\n📚 Processing ${vocab.length} vocabulary words${categoryFilter ? ` [${categoryFilter}]` : ""}\n`);

  // ── Step 1: Update English translations in DB ───────────────────────────────
  if (!imagesOnly) {
    console.log("=== Step 1: Updating English translations in DB ===");
    let updated = 0;
    let skipped = 0;
    for (const v of vocab) {
      const en = EN[v.hanzi];
      if (!en) { console.log(`  ⚠  No EN mapping for: ${v.hanzi}`); continue; }
      const existing = v.translations as Record<string, string> | null;
      if (existing?.en === en) { skipped++; continue; }
      await prisma.vocabulary.update({
        where: { hanzi: v.hanzi },
        data: { translations: { ...(existing ?? {}), en } },
      });
      updated++;
    }
    console.log(`  ✅ Updated ${updated} words, skipped ${skipped} (already had correct EN)\n`);
  }

  if (dbOnly) {
    console.log("✅ DB update complete (--db-only flag set, skipping images)");
    await prisma.$disconnect();
    return;
  }

  // ── Step 2: Generate images ────────────────────────────────────────────────
  console.log("=== Step 2: Generating clay-style images ===");
  let generated = 0;
  let skippedCache = 0;
  let failed = 0;
  const CONCURRENCY = 2;

  for (let i = 0; i < vocab.length; i += CONCURRENCY) {
    const batch = vocab.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (v) => {
      const en = EN[v.hanzi];
      if (!en) return; // no mapping, skip

      if (await isCached(v.hanzi)) {
        console.log(`  ⏭  ${v.hanzi} (cached)`);
        skippedCache++;
        return;
      }

      console.log(`  🎨 [${i + 1}/${vocab.length}] ${v.hanzi} → "${en}"`);
      try {
        const prompt = buildVocabImagePrompt(en);
        const res = await openai.images.generate({
          model: "dall-e-3", prompt, n: 1, size: "1024x1024",
          quality: "standard", response_format: "b64_json",
        });
        const b64 = res.data?.[0]?.b64_json;
        if (!b64) throw new Error("no image data");
        const png = Buffer.from(b64, "base64");
        // Resize + WebP for ~10× smaller files
        const webp = await sharp(png)
          .resize(TARGET_SIZE, TARGET_SIZE, { fit: "cover" })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        await minioClient.putObject(BUCKET, `vocab-images/${v.hanzi}.webp`, webp, webp.length, {
          "Content-Type": "image/webp",
        });
        console.log(`     ✅ saved ${(webp.length / 1024).toFixed(0)} KB (was ${(png.length / 1024).toFixed(0)} KB)`);
        generated++;
      } catch (err) {
        console.error(`     ❌ ${v.hanzi} failed: ${err}`);
        failed++;
      }
    }));
    if (i + CONCURRENCY < vocab.length) await sleep(1200);
  }

  console.log(`\n🎉 Done — generated: ${generated}, cached: ${skippedCache}, failed: ${failed}`);
  await prisma.$disconnect();
}

main().catch(console.error);
