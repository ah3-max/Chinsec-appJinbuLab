/**
 * Add Vietnamese (vi) and Indonesian (id) translations to every Chapter 1 + 3
 * vocab and grammar entry. Hand-written to avoid relying on a working API.
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

// ─── Chapter 1 Vocab 1 — 35 items ─────────────────────────────────────────
const C1_V1: Record<string, I18n> = {
  "安德思":     { vi: "(tên) chàng trai từ Honduras",          id: "(nama) pria dari Honduras" },
  "羅珊蒂":     { vi: "(tên) cô gái từ Indonesia",             id: "(nama) wanita dari Indonesia" },
  "何雅婷":     { vi: "(tên) cô gái từ Đài Loan",              id: "(nama) wanita dari Taiwan" },
  "開學":       { vi: "khai giảng / vào học kỳ mới",           id: "tahun ajaran dimulai" },
  "班":         { vi: "lớp học",                                id: "kelas" },
  "新生":       { vi: "tân sinh viên / học sinh mới",          id: "siswa baru / mahasiswa baru" },
  "嚴":         { vi: "nghiêm khắc",                            id: "tegas / ketat" },
  "口試":       { vi: "thi vấn đáp",                            id: "ujian lisan" },
  "筆試":       { vi: "thi viết",                               id: "ujian tulis" },
  "以外":       { vi: "ngoài (cái gì) ra",                      id: "selain / kecuali" },
  "口頭":       { vi: "miệng / bằng lời",                       id: "lisan / verbal" },
  "報告":       { vi: "báo cáo / thuyết trình",                 id: "laporan / presentasi" },
  "壓力":       { vi: "áp lực",                                  id: "tekanan / stres" },
  "說明":       { vi: "giải thích / hướng dẫn",                 id: "penjelasan / petunjuk" },
  "清楚":       { vi: "rõ ràng",                                 id: "jelas" },
  "位子":       { vi: "chỗ ngồi",                                id: "tempat duduk" },
  "旁聽":       { vi: "học dự thính (không tính tín chỉ)",     id: "audit kelas (tanpa kredit)" },
  "分":         { vi: "điểm",                                    id: "nilai / poin" },
  "羨慕":       { vi: "ngưỡng mộ / ghen tị",                    id: "iri / mengagumi" },
  "休學":       { vi: "nghỉ học (tạm)",                         id: "cuti kuliah" },
  "用功":       { vi: "chăm chỉ / siêng học",                   id: "rajin belajar" },
  "行":         { vi: "được / OK",                               id: "boleh / oke" },
  "轉":         { vi: "chuyển (ngành/trường)",                  id: "pindah (jurusan)" },
  "原來":       { vi: "thì ra / hóa ra là",                     id: "ternyata" },
  "會計":       { vi: "kế toán",                                 id: "akuntansi" },
  "熱門":       { vi: "phổ biến / hot",                         id: "populer / diminati" },
  "熬夜":       { vi: "thức khuya",                              id: "begadang" },
  "當":         { vi: "rớt môn / trượt môn",                    id: "tidak lulus mata kuliah" },
  "恐怕":       { vi: "e rằng / có lẽ",                         id: "khawatir bahwa / mungkin" },
  "口才":       { vi: "tài ăn nói",                              id: "kepandaian berbicara" },
  "事":         { vi: "việc / chuyện",                          id: "hal / urusan" },
  "遲到":       { vi: "đến trễ / muộn",                         id: "terlambat" },
  "差一點":     { vi: "suýt nữa / gần như",                     id: "hampir saja" },
  "這樣下去":   { vi: "cứ thế này / đà này",                    id: "kalau begini terus" },
  "沒辦法":     { vi: "không có cách nào / đành chịu",          id: "tidak ada cara / tidak bisa apa-apa" },
};

// ─── Chapter 1 Vocab 2 — 21 items ─────────────────────────────────────────
const C1_V2: Record<string, I18n> = {
  "獨生女":     { vi: "con gái một",                            id: "anak perempuan tunggal" },
  "私立":       { vi: "tư thục / dân lập",                      id: "swasta" },
  "理想":       { vi: "lý tưởng",                                id: "ideal" },
  "合":         { vi: "hợp / phù hợp",                          id: "cocok / sesuai" },
  "痛苦":       { vi: "đau khổ",                                 id: "menderita / sengsara" },
  "科系":       { vi: "khoa / chuyên ngành",                    id: "jurusan / fakultas" },
  "放棄":       { vi: "từ bỏ",                                   id: "menyerah / melepaskan" },
  "不管":       { vi: "bất kể / dù sao",                        id: "tak peduli / terlepas dari" },
  "反對":       { vi: "phản đối",                                id: "menentang" },
  "個性":       { vi: "tính cách",                               id: "kepribadian" },
  "活潑":       { vi: "hoạt bát / sôi nổi",                     id: "lincah / aktif" },
  "外語":       { vi: "ngoại ngữ",                               id: "bahasa asing" },
  "擔心":       { vi: "lo lắng",                                 id: "khawatir" },
  "填":         { vi: "điền (đơn)",                              id: "mengisi (formulir)" },
  "表":         { vi: "biểu mẫu / bảng",                        id: "formulir / tabel" },
  "辦":         { vi: "lo / xử lý",                              id: "mengurus / menangani" },
  "手續":       { vi: "thủ tục",                                 id: "prosedur" },
  "申請":       { vi: "đăng ký / xin",                          id: "mengajukan / mendaftar" },
  "成績單":     { vi: "bảng điểm",                              id: "transkrip nilai" },
  "考上":       { vi: "thi đỗ vào",                              id: "lolos ujian masuk" },
  "推薦信":     { vi: "thư giới thiệu",                          id: "surat rekomendasi" },
};

// ─── Chapter 1 Grammar — 6 patterns ───────────────────────────────────────
const C1_G: Record<string, I18n> = {
  "…的話":          { vi: "nếu… (đặt cuối mệnh đề điều kiện)",            id: "jika… (di akhir klausa pengandaian)" },
  "不到":           { vi: "không đến (số lượng)",                          id: "kurang dari (jumlah)" },
  "差一點(就)…":    { vi: "suýt chút nữa thì…",                            id: "hampir saja… (tetapi tidak terjadi)" },
  "恐怕…":          { vi: "e rằng / có lẽ…",                                id: "khawatir bahwa…" },
  "好不容易":       { vi: "khó khăn lắm mới…",                              id: "akhirnya berhasil… (setelah susah payah)" },
  "說…就…":         { vi: "vừa nói đã…",                                    id: "begitu saja / dalam sekejap" },
};

// ─── Chapter 3 Vocab 1 — 37 items ─────────────────────────────────────────
const C3_V1: Record<string, I18n> = {
  "陳敏萱":     { vi: "(tên) cô gái từ Hà Lan",                id: "(nama) wanita dari Belanda" },
  "高橋健太":   { vi: "(tên) chàng trai từ Nhật Bản",          id: "(nama) pria dari Jepang" },
  "空氣":       { vi: "không khí",                              id: "udara" },
  "影響":       { vi: "ảnh hưởng",                              id: "pengaruh" },
  "穩定":       { vi: "ổn định",                                 id: "stabil" },
  "幸虧":       { vi: "may mà / may là",                        id: "untungnya" },
  "躲":         { vi: "trốn / núp",                              id: "bersembunyi / berlindung" },
  "度":         { vi: "độ (nhiệt độ)",                           id: "derajat (suhu)" },
  "溫度":       { vi: "nhiệt độ",                                id: "suhu" },
  "零下":       { vi: "dưới 0 độ",                               id: "di bawah nol" },
  "感覺":       { vi: "cảm thấy",                                id: "merasa" },
  "實際":       { vi: "thực tế",                                 id: "sebenarnya / aktual" },
  "難怪":       { vi: "thảo nào / không trách",                 id: "pantas saja" },
  "季節":       { vi: "mùa",                                     id: "musim" },
  "火鍋":       { vi: "lẩu",                                     id: "hotpot / steamboat" },
  "海鮮":       { vi: "hải sản",                                 id: "makanan laut" },
  "新鮮":       { vi: "tươi / mới",                              id: "segar" },
  "櫻花":       { vi: "hoa anh đào",                            id: "bunga sakura" },
  "變化":       { vi: "biến đổi",                                id: "perubahan" },
  "氣溫":       { vi: "nhiệt độ không khí",                     id: "suhu udara" },
  "差":         { vi: "chênh lệch",                              id: "berbeda / selisih" },
  "幾乎":       { vi: "hầu như / gần như",                      id: "hampir" },
  "乾":         { vi: "khô",                                     id: "kering" },
  "發霉":       { vi: "bị mốc",                                  id: "berjamur" },
  "除濕機":     { vi: "máy hút ẩm",                              id: "dehumidifier" },
  "雨季":       { vi: "mùa mưa",                                 id: "musim hujan" },
  "涼快":       { vi: "mát mẻ",                                  id: "sejuk" },
  "潮濕":       { vi: "ẩm ướt",                                  id: "lembap" },
  "悶":         { vi: "ngột ngạt / oi",                         id: "pengap" },
  "冷氣":       { vi: "máy lạnh / điều hòa",                    id: "AC" },
  "荷蘭":       { vi: "Hà Lan",                                  id: "Belanda" },
  "出大太陽":   { vi: "nắng gắt",                                id: "matahari menyengat" },
  "颳風":       { vi: "có gió mạnh",                             id: "berangin kencang" },
  "受到":       { vi: "nhận / chịu (ảnh hưởng)",                id: "menerima / mengalami" },
  "受不了":     { vi: "không chịu nổi",                          id: "tidak tahan" },
  "餓死了":     { vi: "đói chết được (cường điệu)",            id: "lapar sekali / kelaparan (lebay)" },
  "後母臉":     { vi: "mặt mẹ kế (thời tiết thất thường)",     id: "wajah ibu tiri (cuaca berubah-ubah)" },
};

// ─── Chapter 3 Vocab 2 — 17 items ─────────────────────────────────────────
const C3_V2: Record<string, I18n> = {
  "祖先":       { vi: "tổ tiên",                                 id: "leluhur / nenek moyang" },
  "移民":       { vi: "di cư / nhập cư",                        id: "berimigrasi" },
  "當中":       { vi: "trong số / giữa",                        id: "di antara" },
  "根據":       { vi: "căn cứ vào / dựa trên",                  id: "berdasarkan" },
  "農曆":       { vi: "âm lịch",                                 id: "kalender lunar / Imlek" },
  "農業":       { vi: "nông nghiệp",                            id: "pertanian" },
  "農人":       { vi: "nông dân",                                id: "petani" },
  "難得":       { vi: "hiếm có / khó được",                     id: "langka / sulit didapat" },
  "祭祖":       { vi: "cúng tổ tiên",                            id: "memuja leluhur" },
  "拜":         { vi: "lạy / thờ cúng",                          id: "menghormati / menyembah" },
  "神":         { vi: "thần / vị thần",                          id: "dewa / dewi" },
  "端午節":     { vi: "Tết Đoan Ngọ",                            id: "Festival Perahu Naga" },
  "中秋節":     { vi: "Tết Trung Thu",                           id: "Festival Pertengahan Musim Gugur" },
  "雄黃酒":     { vi: "rượu hùng hoàng (rượu lễ hội)",         id: "arak realgar (minuman festival)" },
  "古時候":     { vi: "thời cổ đại",                             id: "zaman dahulu" },
  "趕走":       { vi: "đuổi đi",                                 id: "mengusir" },
  "過節":       { vi: "đón Tết / mừng lễ",                      id: "merayakan hari raya" },
};

// ─── Chapter 3 Grammar — 9 patterns ───────────────────────────────────────
const C3_G: Record<string, I18n> = {
  "受到 (…的) 影響":  { vi: "chịu ảnh hưởng từ…",                          id: "dipengaruhi oleh…" },
  "幸虧…":            { vi: "may mà…",                                      id: "untungnya…" },
  "算是…":            { vi: "có thể coi là…",                                id: "bisa dianggap…" },
  "是…":              { vi: "đúng là… (xác nhận)",                          id: "memang benar… (penegasan)" },
  "難怪…":            { vi: "thảo nào / không trách…",                      id: "pantas saja…" },
  "…死了":            { vi: "cực kỳ… / …chết đi được",                     id: "sangat… / …sekali" },
  "幾乎…":            { vi: "hầu như / gần như…",                           id: "hampir / nyaris…" },
  "多少…":            { vi: "ít nhiều cũng…",                                id: "setidaknya sedikit…" },
  "再…也…":           { vi: "dù… cũng…",                                    id: "tidak peduli betapa… tetap…" },
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
  console.log("=== Translating Chapter 1 + 3 vocab + grammar to vi/id ===\n");
  const a = await fillTranslations("MS-C1-D1-VOCAB", C1_V1);
  const b = await fillTranslations("MS-C1-D2-VOCAB", C1_V2);
  const c = await fillTranslations("MS-C1-GRAMMAR",  C1_G);
  const d = await fillTranslations("MS-C3-VOCAB-1",  C3_V1);
  const e = await fillTranslations("MS-C3-VOCAB-2",  C3_V2);
  const f = await fillTranslations("MS-C3-GRAMMAR",  C3_G);
  console.log(`\n🎉 Total filled: ${a + b + c + d + e + f} entries`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
