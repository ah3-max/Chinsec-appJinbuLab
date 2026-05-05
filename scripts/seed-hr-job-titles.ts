/**
 * Seed HR / job-title reference vocabulary from the Excel
 * 「職別對照表 ตารางคำศัพท์ตำแหน่งงาน.xlsx」.
 *
 * 55 entries, 4 categories:
 *   - hr-position        (43)   職別/職稱
 *   - hr-employment-type (2)    任別
 *   - hr-gender          (2)    性別
 *   - hr-education       (8)    學歷
 *
 * Each entry carries translations for zh-TW / en / th / vi / id so cards
 * render properly in every locale. Pinyin is from the source spreadsheet;
 * zhuyin is left as the pinyin string (it's a non-null column but rarely
 * displayed for workplace vocab).
 */
import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Level } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, "");
  });
}

const db = new PrismaClient();

interface Row {
  hanzi: string;
  pinyin: string;
  category: "hr-position" | "hr-employment-type" | "hr-gender" | "hr-education";
  partOfSpeech: string;
  tr: { en: string; th: string; vi: string; id: string };
}

// ─── 職別 / 職稱 (43 entries) ──────────────────────────────────────────────
const POSITIONS: Row[] = [
  { hanzi: "院長",                 pinyin: "yuàn zhǎng",                       category: "hr-position", partOfSpeech: "N", tr: { en: "facility director / superintendent",        th: "ผู้อำนวยการ",                                  vi: "Giám đốc viện",                              id: "Direktur lembaga" } },
  { hanzi: "護理師兼秘書長",       pinyin: "hùlǐ shī jiān mìshū zhǎng",         category: "hr-position", partOfSpeech: "N", tr: { en: "registered nurse & secretary-general",     th: "พยาบาล/เลขาธิการ",                              vi: "Y tá kiêm Tổng thư ký",                      id: "Perawat merangkap Sekretaris Jenderal" } },
  { hanzi: "行政主任",             pinyin: "xíngzhèng zhǔrèn",                  category: "hr-position", partOfSpeech: "N", tr: { en: "administration manager",                    th: "ผู้จัดการฝ่ายธุรการ",                          vi: "Giám đốc hành chính",                        id: "Manajer administrasi" } },
  { hanzi: "系統應用組長",         pinyin: "xìtǒng yìngyòng zǔ zhǎng",          category: "hr-position", partOfSpeech: "N", tr: { en: "head of systems & applications team",        th: "หัวหน้ากลุ่มระบบสารสนเทศ",                       vi: "Trưởng nhóm Ứng dụng hệ thống",              id: "Kepala Grup Aplikasi Sistem" } },
  { hanzi: "運務管理組長",         pinyin: "yùnwù guǎnlǐ zǔ zhǎng",             category: "hr-position", partOfSpeech: "N", tr: { en: "head of operations management team",         th: "หัวหน้ากลุ่มจัดการปฏิบัติการ",                    vi: "Trưởng nhóm Quản lý vận hành",               id: "Kepala Grup Manajemen Operasional" } },
  { hanzi: "人資組長",             pinyin: "rénzī zǔ zhǎng",                    category: "hr-position", partOfSpeech: "N", tr: { en: "head of HR team",                            th: "หัวหน้ากลุ่มทรัพยากรบุคคล",                      vi: "Trưởng nhóm Nhân sự",                        id: "Kepala Grup SDM" } },
  { hanzi: "膳食組長",             pinyin: "shànshí zǔ zhǎng",                  category: "hr-position", partOfSpeech: "N", tr: { en: "head of food-service / nutrition team",      th: "หัวหน้ากลุ่มโภชนาการ",                          vi: "Trưởng nhóm Dinh dưỡng",                     id: "Kepala Grup Tata Boga" } },
  { hanzi: "財會組長",             pinyin: "cáikuài zǔ zhǎng",                  category: "hr-position", partOfSpeech: "N", tr: { en: "head of finance & accounting team",          th: "หัวหน้ากลุ่มบัญชีการเงิน",                       vi: "Trưởng nhóm Tài chính – Kế toán",            id: "Kepala Grup Keuangan & Akuntansi" } },
  { hanzi: "財會副組長",           pinyin: "cáikuài fù zǔ zhǎng",               category: "hr-position", partOfSpeech: "N", tr: { en: "deputy head of finance & accounting team",   th: "รองหัวหน้ากลุ่มบัญชีการเงิน",                   vi: "Phó nhóm Tài chính – Kế toán",               id: "Wakil Kepala Grup Keuangan & Akuntansi" } },
  { hanzi: "財務管理組副組長",     pinyin: "cáiwù guǎnlǐ zǔ fù zǔ zhǎng",       category: "hr-position", partOfSpeech: "N", tr: { en: "deputy head of financial management team",   th: "รองหัวหน้ากลุ่มบริหารการเงิน",                   vi: "Phó nhóm Quản lý tài chính",                 id: "Wakil Kepala Grup Manajemen Keuangan" } },
  { hanzi: "數位智能副組長",       pinyin: "shùwèi zhìnéng fù zǔ zhǎng",        category: "hr-position", partOfSpeech: "N", tr: { en: "deputy head of digital & AI team",           th: "รองหัวหน้ากลุ่มดิจิทัลและ AI",                  vi: "Phó nhóm Số hóa & AI",                       id: "Wakil Kepala Grup Digital & AI" } },
  { hanzi: "日照主任",             pinyin: "rìzhào zhǔrèn",                     category: "hr-position", partOfSpeech: "N", tr: { en: "day-care center manager",                    th: "ผู้จัดการศูนย์ดูแลกลางวัน",                       vi: "Trưởng trung tâm chăm sóc ban ngày",         id: "Manajer Pusat Day Care" } },
  { hanzi: "行政專員",             pinyin: "xíngzhèng zhuānyuán",               category: "hr-position", partOfSpeech: "N", tr: { en: "senior administrative officer",              th: "เจ้าหน้าที่อาวุโสฝ่ายธุรการ",                    vi: "Chuyên viên Hành chính",                     id: "Staf Senior Administrasi" } },
  { hanzi: "行政人員",             pinyin: "xíngzhèng rényuán",                 category: "hr-position", partOfSpeech: "N", tr: { en: "administrative staff",                       th: "เจ้าหน้าที่ฝ่ายธุรการ",                          vi: "Nhân viên Hành chính",                       id: "Staf Administrasi" } },
  { hanzi: "行政助理",             pinyin: "xíngzhèng zhùlǐ",                   category: "hr-position", partOfSpeech: "N", tr: { en: "administrative assistant",                   th: "ผู้ช่วยฝ่ายธุรการ",                              vi: "Trợ lý Hành chính",                          id: "Asisten Administrasi" } },
  { hanzi: "人資管理師",           pinyin: "rénzī guǎnlǐ shī",                  category: "hr-position", partOfSpeech: "N", tr: { en: "HR manager / specialist",                    th: "นักจัดการทรัพยากรบุคคล",                        vi: "Chuyên viên Quản lý Nhân sự",                id: "Manajer SDM" } },
  { hanzi: "招募管理師",           pinyin: "zhāomù guǎnlǐ shī",                 category: "hr-position", partOfSpeech: "N", tr: { en: "recruitment manager / specialist",           th: "นักจัดการสรรหาบุคลากร",                          vi: "Chuyên viên Tuyển dụng",                     id: "Manajer Rekrutmen" } },
  { hanzi: "薪酬管理師",           pinyin: "xīnchóu guǎnlǐ shī",                category: "hr-position", partOfSpeech: "N", tr: { en: "compensation & benefits manager",            th: "นักจัดการค่าตอบแทน",                            vi: "Chuyên viên C&B (Lương thưởng)",              id: "Manajer Kompensasi & Tunjangan" } },
  { hanzi: "組訓專員",             pinyin: "zǔxùn zhuānyuán",                   category: "hr-position", partOfSpeech: "N", tr: { en: "training & development officer",             th: "เจ้าหน้าที่อบรมและพัฒนา",                        vi: "Chuyên viên Đào tạo & Phát triển",           id: "Staf Pelatihan & Pengembangan" } },
  { hanzi: "工務管理師",           pinyin: "gōngwù guǎnlǐ shī",                 category: "hr-position", partOfSpeech: "N", tr: { en: "facilities / engineering manager",           th: "นักจัดการงานวิศวกรรม",                          vi: "Quản lý Công trình – Kỹ thuật",              id: "Manajer Teknik / Fasilitas" } },
  { hanzi: "室內設計師",           pinyin: "shìnèi shèjì shī",                  category: "hr-position", partOfSpeech: "N", tr: { en: "interior designer",                          th: "นักออกแบบภายใน",                                vi: "Kiến trúc sư nội thất",                       id: "Desainer Interior" } },
  { hanzi: "資訊專員",             pinyin: "zīxùn zhuānyuán",                   category: "hr-position", partOfSpeech: "N", tr: { en: "senior IT officer",                          th: "เจ้าหน้าที่อาวุโสฝ่ายไอที",                      vi: "Chuyên viên CNTT",                            id: "Staf Senior TI" } },
  { hanzi: "資訊資深專員",         pinyin: "zīxùn zīshēn zhuānyuán",            category: "hr-position", partOfSpeech: "N", tr: { en: "senior / lead IT officer",                   th: "เจ้าหน้าที่ไอทีระดับชำนาญการ",                    vi: "Chuyên viên CNTT cao cấp",                    id: "Staf TI Senior / Ahli" } },
  { hanzi: "個案管理師",           pinyin: "gèʼàn guǎnlǐ shī",                  category: "hr-position", partOfSpeech: "N", tr: { en: "case manager",                                th: "นักจัดการรายกรณี (Case Manager)",                vi: "Quản lý ca / Case Manager",                   id: "Manajer Kasus (Case Manager)" } },
  { hanzi: "社工督導",             pinyin: "shègōng dūdǎo",                     category: "hr-position", partOfSpeech: "N", tr: { en: "social-work supervisor",                      th: "หัวหน้านักสังคมสงเคราะห์",                       vi: "Giám sát Công tác xã hội",                    id: "Supervisor Pekerja Sosial" } },
  { hanzi: "社工員",               pinyin: "shègōng yuán",                      category: "hr-position", partOfSpeech: "N", tr: { en: "social worker",                                th: "นักสังคมสงเคราะห์",                              vi: "Nhân viên Công tác xã hội",                   id: "Pekerja Sosial" } },
  { hanzi: "社工助理",             pinyin: "shègōng zhùlǐ",                     category: "hr-position", partOfSpeech: "N", tr: { en: "social-worker assistant",                      th: "ผู้ช่วยนักสังคมสงเคราะห์",                        vi: "Trợ lý Công tác xã hội",                       id: "Asisten Pekerja Sosial" } },
  { hanzi: "日照社工員",           pinyin: "rìzhào shègōng yuán",               category: "hr-position", partOfSpeech: "N", tr: { en: "day-care center social worker",                th: "นักสังคมสงเคราะห์ศูนย์ดูแลกลางวัน",               vi: "Nhân viên xã hội (Day care)",                  id: "Pekerja Sosial Day Care" } },
  { hanzi: "護理人員",             pinyin: "hùlǐ rényuán",                      category: "hr-position", partOfSpeech: "N", tr: { en: "nurse",                                         th: "พยาบาล",                                          vi: "Y tá / Điều dưỡng",                            id: "Perawat" } },
  { hanzi: "日照護理人員",         pinyin: "rìzhào hùlǐ rényuán",               category: "hr-position", partOfSpeech: "N", tr: { en: "day-care nurse",                                th: "พยาบาลศูนย์ดูแลกลางวัน",                          vi: "Y tá tại Day care",                            id: "Perawat Day Care" } },
  { hanzi: "照服人員-台籍",         pinyin: "zhàofú rényuán - táijí",            category: "hr-position", partOfSpeech: "N", tr: { en: "caregiver (Taiwanese national)",                th: "ผู้ดูแล (สัญชาติไต้หวัน)",                        vi: "Nhân viên chăm sóc (Đài Loan)",                id: "Caregiver (warganegara Taiwan)" } },
  { hanzi: "照服人員-印籍",         pinyin: "zhàofú rényuán - yìnjí",            category: "hr-position", partOfSpeech: "N", tr: { en: "caregiver (Indonesian national)",               th: "ผู้ดูแล (สัญชาติอินโดนีเซีย)",                    vi: "Nhân viên chăm sóc (Indonesia)",               id: "Caregiver (warganegara Indonesia)" } },
  { hanzi: "日照照服人員-台籍",     pinyin: "rìzhào zhàofú rényuán - táijí",     category: "hr-position", partOfSpeech: "N", tr: { en: "day-care caregiver (Taiwanese national)",       th: "ผู้ดูแลศูนย์ดูแลกลางวัน (สัญชาติไต้หวัน)",         vi: "Nhân viên chăm sóc Day care (Đài Loan)",       id: "Caregiver Day Care (warganegara Taiwan)" } },
  { hanzi: "生活管理員",           pinyin: "shēnghuó guǎnlǐ yuán",              category: "hr-position", partOfSpeech: "N", tr: { en: "residential life manager",                       th: "เจ้าหน้าที่จัดการที่พักอาศัย",                     vi: "Quản lý đời sống cư trú",                       id: "Pengelola Hunian / Asrama" } },
  { hanzi: "營養師",                pinyin: "yíngyǎng shī",                      category: "hr-position", partOfSpeech: "N", tr: { en: "dietitian / nutritionist",                       th: "นักโภชนาการ",                                       vi: "Chuyên gia dinh dưỡng",                          id: "Ahli Gizi" } },
  { hanzi: "職能治療師",           pinyin: "zhínéng zhìliáo shī",               category: "hr-position", partOfSpeech: "N", tr: { en: "occupational therapist",                          th: "นักกิจกรรมบำบัด",                                  vi: "Trị liệu phục hồi chức năng",                    id: "Terapis Okupasi" } },
  { hanzi: "會計人員",             pinyin: "kuàijì rényuán",                    category: "hr-position", partOfSpeech: "N", tr: { en: "accounting staff / accountant",                   th: "พนักงานบัญชี",                                      vi: "Nhân viên Kế toán",                              id: "Staf Akuntansi" } },
  { hanzi: "總務組長",             pinyin: "zǒngwù zǔ zhǎng",                   category: "hr-position", partOfSpeech: "N", tr: { en: "head of general-affairs team",                    th: "หัวหน้ากลุ่มงานทั่วไป",                            vi: "Trưởng nhóm Tổng vụ",                           id: "Kepala Grup Umum" } },
  { hanzi: "總務人員",             pinyin: "zǒngwù rényuán",                    category: "hr-position", partOfSpeech: "N", tr: { en: "general-affairs staff",                            th: "พนักงานงานทั่วไป",                                vi: "Nhân viên Tổng vụ",                              id: "Staf Umum" } },
  { hanzi: "總務助理",             pinyin: "zǒngwù zhùlǐ",                      category: "hr-position", partOfSpeech: "N", tr: { en: "general-affairs assistant",                        th: "ผู้ช่วยงานทั่วไป",                                  vi: "Trợ lý Tổng vụ",                                 id: "Asisten Umum" } },
  { hanzi: "膳食人員",             pinyin: "shànshí rényuán",                   category: "hr-position", partOfSpeech: "N", tr: { en: "kitchen staff / cook",                              th: "พนักงานโภชนาการ/แม่ครัว",                         vi: "Nhân viên Bếp / Đầu bếp",                       id: "Staf Dapur / Juru Masak" } },
  { hanzi: "清潔人員",             pinyin: "qīngjié rényuán",                   category: "hr-position", partOfSpeech: "N", tr: { en: "cleaning staff / janitor",                         th: "พนักงานทำความสะอาด",                            vi: "Nhân viên Vệ sinh",                              id: "Petugas Kebersihan" } },
  { hanzi: "司機",                  pinyin: "sījī",                              category: "hr-position", partOfSpeech: "N", tr: { en: "driver",                                            th: "พนักงานขับรถ",                                     vi: "Tài xế",                                         id: "Sopir / Pengemudi" } },
];

// ─── 任別 Employment Type (2 entries) ─────────────────────────────────────
const EMPLOYMENT_TYPE: Row[] = [
  { hanzi: "專任",  pinyin: "zhuānrèn", category: "hr-employment-type", partOfSpeech: "N", tr: { en: "full-time",  th: "พนักงานประจำ (Full-time)",   vi: "Chính thức (Toàn thời gian)", id: "Penuh waktu (Full-time)"  } },
  { hanzi: "兼任",  pinyin: "jiānrèn",  category: "hr-employment-type", partOfSpeech: "N", tr: { en: "part-time",  th: "พนักงานพาร์ทไทม์ (Part-time)", vi: "Bán thời gian (Part-time)",   id: "Paruh waktu (Part-time)" } },
];

// ─── 性別 Gender (2 entries) ──────────────────────────────────────────────
const GENDER: Row[] = [
  { hanzi: "男",  pinyin: "nán", category: "hr-gender", partOfSpeech: "N", tr: { en: "male",   th: "ชาย",   vi: "Nam",   id: "Laki-laki / Pria" } },
  { hanzi: "女",  pinyin: "nǚ",  category: "hr-gender", partOfSpeech: "N", tr: { en: "female", th: "หญิง",  vi: "Nữ",    id: "Perempuan / Wanita" } },
];

// ─── 學歷 Education Level (8 entries) ─────────────────────────────────────
const EDUCATION: Row[] = [
  { hanzi: "博士",  pinyin: "bóshì",      category: "hr-education", partOfSpeech: "N", tr: { en: "doctorate / PhD",                  th: "ปริญญาเอก",          vi: "Tiến sĩ",                  id: "Doktor (S3)" } },
  { hanzi: "碩士",  pinyin: "shuòshì",    category: "hr-education", partOfSpeech: "N", tr: { en: "master's degree",                  th: "ปริญญาโท",           vi: "Thạc sĩ",                   id: "Magister (S2)" } },
  { hanzi: "大學",  pinyin: "dàxué",      category: "hr-education", partOfSpeech: "N", tr: { en: "bachelor's degree / university",   th: "ปริญญาตรี",          vi: "Cử nhân (Đại học)",         id: "Sarjana (S1)" } },
  { hanzi: "專科",  pinyin: "zhuānkē",    category: "hr-education", partOfSpeech: "N", tr: { en: "associate degree / junior college", th: "อนุปริญญา",          vi: "Cao đẳng",                  id: "Diploma" } },
  { hanzi: "高中職", pinyin: "gāozhōngzhí", category: "hr-education", partOfSpeech: "N", tr: { en: "senior-high / vocational",         th: "มัธยมปลาย/อาชีวะ",   vi: "Trung học/Trung cấp nghề",   id: "SMA / SMK" } },
  { hanzi: "高中",  pinyin: "gāozhōng",   category: "hr-education", partOfSpeech: "N", tr: { en: "senior high school",               th: "มัธยมปลาย",          vi: "Trung học phổ thông",        id: "SMA" } },
  { hanzi: "國中",  pinyin: "guózhōng",   category: "hr-education", partOfSpeech: "N", tr: { en: "junior high school",               th: "มัธยมต้น",           vi: "Trung học cơ sở",            id: "SMP" } },
  { hanzi: "國小",  pinyin: "guóxiǎo",    category: "hr-education", partOfSpeech: "N", tr: { en: "elementary school",                th: "ประถมศึกษา",         vi: "Tiểu học",                  id: "SD" } },
];

const ALL: Row[] = [...POSITIONS, ...EMPLOYMENT_TYPE, ...GENDER, ...EDUCATION];

async function main() {
  console.log(`📚 Seeding ${ALL.length} HR vocabulary entries…`);
  const counts: Record<string, number> = {};

  for (const r of ALL) {
    counts[r.category] = (counts[r.category] ?? 0) + 1;
    await db.vocabulary.upsert({
      where: { hanzi: r.hanzi },
      create: {
        hanzi: r.hanzi,
        zhuyin: r.pinyin,            // non-null column; pinyin doubles for these workplace terms
        pinyin: r.pinyin,
        partOfSpeech: r.partOfSpeech,
        translations: { en: r.tr.en, th: r.tr.th, vi: r.tr.vi, id: r.tr.id },
        level: Level.A2_BASIC,
        tocflBand: "A2",
        frequency: 4,
        difficulty: 2,
        category: r.category,
        tags: ["a2", "hr", "eldercare", "workplace", r.category],
        isEldercareVocab: true,
      },
      update: {
        pinyin: r.pinyin,
        partOfSpeech: r.partOfSpeech,
        translations: { en: r.tr.en, th: r.tr.th, vi: r.tr.vi, id: r.tr.id },
        category: r.category,
        tags: ["a2", "hr", "eldercare", "workplace", r.category],
        isEldercareVocab: true,
      },
    });
  }

  console.log(`\n✅ Seeded:`);
  for (const [cat, n] of Object.entries(counts)) {
    console.log(`   ${cat.padEnd(22)} ${n}`);
  }
  console.log(`   ${"TOTAL".padEnd(22)} ${ALL.length}`);

  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
