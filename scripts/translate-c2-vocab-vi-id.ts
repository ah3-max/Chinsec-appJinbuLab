/**
 * Add Vietnamese (vi) and Indonesian (id) translations to every Chapter 2 vocab
 * and grammar item. English (en) and Thai (th) already exist.
 *
 * Translations are hand-written here to avoid relying on a working external API.
 * Vietnamese and Indonesian forms aim to match the Thai entry's level of detail
 * (one or two glosses, no long explanations).
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

interface I18n { vi: string; id: string }

// Vocab 1 (32 items)
const V1: Record<string, I18n> = {
  "起":         { vi: "bắt đầu từ…",                       id: "mulai dari…" },
  "外套":       { vi: "áo khoác",                          id: "mantel / jaket" },
  "一般":       { vi: "thông thường / nói chung",          id: "umumnya / pada umumnya" },
  "商品":       { vi: "hàng hóa / sản phẩm",               id: "barang dagangan" },
  "折扣":       { vi: "giảm giá / chiết khấu",             id: "diskon" },
  "省":         { vi: "tiết kiệm",                         id: "menghemat" },
  "牌子":       { vi: "thương hiệu / nhãn hiệu",           id: "merek" },
  "品質":       { vi: "chất lượng",                        id: "kualitas / mutu" },
  "選擇":       { vi: "lựa chọn",                          id: "pilihan" },
  "樣子":       { vi: "kiểu dáng / vẻ ngoài",              id: "bentuk / penampilan" },
  "摸":         { vi: "sờ / chạm",                         id: "menyentuh / meraba" },
  "店員":       { vi: "nhân viên cửa hàng",                id: "pelayan toko" },
  "短":         { vi: "ngắn",                              id: "pendek" },
  "羊毛":       { vi: "len / lông cừu",                    id: "wol" },
  "暖和":       { vi: "ấm áp",                             id: "hangat" },
  "打折":       { vi: "giảm giá",                          id: "memberi diskon" },
  "原價":       { vi: "giá gốc",                           id: "harga asli" },
  "刷卡":       { vi: "quẹt thẻ tín dụng",                 id: "gesek kartu kredit" },
  "現金":       { vi: "tiền mặt",                          id: "uang tunai" },
  "麻煩":       { vi: "làm phiền / xin vui lòng…",         id: "permisi / tolong…" },
  "簽名":       { vi: "ký tên",                            id: "tanda tangan" },
  "破洞":       { vi: "bị thủng",                          id: "berlubang" },
  "發票":       { vi: "hóa đơn",                           id: "nota / kuitansi" },
  "弄":         { vi: "làm / xử lý (động từ chung)",       id: "melakukan / mengurus (kt umum)" },
  "退":         { vi: "trả lại (hàng)",                    id: "mengembalikan (barang)" },
  "換":         { vi: "đổi",                               id: "menukar" },
  "店長":       { vi: "quản lý cửa hàng",                  id: "manajer toko" },
  "週年慶":     { vi: "khuyến mãi kỷ niệm thành lập",      id: "promo ulang tahun toko" },
  "一般來說":   { vi: "nói chung / nhìn chung",            id: "secara umum" },
  "試穿":       { vi: "mặc thử",                           id: "mencoba pakai" },
  "打完折":     { vi: "sau khi giảm giá",                  id: "setelah diskon" },
  "弄丟":       { vi: "làm mất",                           id: "menghilangkan" },
};

// Vocab 2 (24 items)
const V2: Record<string, I18n> = {
  "購物":       { vi: "mua sắm",                           id: "berbelanja" },
  "糾紛":       { vi: "tranh chấp",                        id: "perselisihan / sengketa" },
  "電信":       { vi: "viễn thông",                        id: "telekomunikasi" },
  "門市":       { vi: "chi nhánh / cửa hàng",              id: "cabang / gerai" },
  "居留證":     { vi: "thẻ cư trú (ARC)",                  id: "kartu izin tinggal (ARC)" },
  "月租型":     { vi: "gói thuê bao tháng",                id: "paket bulanan" },
  "帳單":       { vi: "hóa đơn / bill",                    id: "tagihan" },
  "並":         { vi: "thật ra không (trái với mong đợi)", id: "sebenarnya tidak (di luar dugaan)" },
  "包括":       { vi: "bao gồm",                           id: "termasuk / mencakup" },
  "解釋":       { vi: "giải thích",                        id: "penjelasan" },
  "顧客":       { vi: "khách hàng",                        id: "pelanggan" },
  "尤其":       { vi: "đặc biệt là",                       id: "terutama / khususnya" },
  "騙":         { vi: "lừa / lừa đảo",                     id: "menipu" },
  "頓":         { vi: "(lượng từ cho hành động lời)",      id: "(kata bantu untuk tindakan ucap)" },
  "辦法":       { vi: "cách / giải pháp",                  id: "cara / solusi" },
  "自動":       { vi: "tự động",                           id: "otomatis" },
  "關機":       { vi: "tắt máy",                           id: "mematikan perangkat" },
  "修理":       { vi: "sửa chữa",                          id: "memperbaiki" },
  "繳費":       { vi: "nộp / thanh toán phí",              id: "membayar tagihan" },
  "預付卡":     { vi: "thẻ SIM trả trước",                 id: "kartu SIM prabayar" },
  "換成":       { vi: "đổi thành",                         id: "mengganti menjadi" },
  "吃到飽":     { vi: "không giới hạn (ăn no thoả thích)", id: "tanpa batas (makan sepuasnya)" },
  "嚇一跳":     { vi: "giật mình / sợ hết hồn",            id: "kaget" },
  "客服中心":   { vi: "trung tâm chăm sóc khách hàng",     id: "pusat layanan pelanggan" },
};

// Grammar (7 patterns) — translate the short gloss the cards display.
const GRAMMAR: Record<string, I18n> = {
  "一般來說…":      { vi: "nói chung / nhìn chung là…",                       id: "secara umum…" },
  "弄 (general verb)": { vi: "làm / xử lý / lo liệu (động từ chung)",         id: "melakukan / mengurus (kt umum)" },
  "再說…":          { vi: "hơn nữa / vả lại…",                                id: "lagipula / selain itu…" },
  "V + 成…":        { vi: "biến/đổi (cái gì) thành…",                         id: "mengubah (sesuatu) menjadi…" },
  "並 + (不/沒)…":  { vi: "thực ra không / trái với suy nghĩ",                id: "sebenarnya tidak / di luar dugaan" },
  "尤其(是)…":      { vi: "đặc biệt là…",                                     id: "terutama (yaitu)…" },
  "只好…":          { vi: "đành phải / không còn cách nào khác là…",          id: "terpaksa / tidak ada pilihan selain…" },
};

interface Item {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  [key: string]: unknown;
}

async function fillTranslations(lessonCode: string, map: Record<string, I18n>) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) {
    console.log(`  ⏭️  ${lessonCode}: not found`);
    return 0;
  }
  const content = lesson.content as { items?: Item[]; [key: string]: unknown } | null;
  if (!content?.items) return 0;

  let filled = 0;
  const updated = content.items.map((item) => {
    const extra = map[item.hanzi];
    if (!extra) return item;
    const existing = item.translations ?? {};
    if (existing.vi && existing.id) return item;
    filled++;
    return {
      ...item,
      translations: { ...existing, vi: extra.vi, id: extra.id },
    };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: updated } as object },
  });
  console.log(`  ✅ ${lessonCode}: filled ${filled} / ${content.items.length} (vi+id)`);
  return filled;
}

async function main() {
  console.log("=== Translating Chapter 2 vocab + grammar to vi/id ===\n");
  const v1 = await fillTranslations("MS-C2-VOCAB-1", V1);
  const v2 = await fillTranslations("MS-C2-VOCAB-2", V2);
  const g  = await fillTranslations("MS-C2-GRAMMAR", GRAMMAR);
  console.log(`\n🎉 Total filled: ${v1 + v2 + g} entries`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
