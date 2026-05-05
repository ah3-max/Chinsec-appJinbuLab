/**
 * Add multi-language translations to every example sentence in MS-C1/C2/C3.
 *
 * Each example currently has `translation: <thai>`. This script preserves that
 * and adds a `translations: { en, th, vi, id }` map. The lesson page resolves
 * the right locale at request time.
 *
 * 166 vocab examples × 3 languages = 498 strings, all hand-translated.
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

interface Tri { en: string; vi: string; id: string }

// ─── MS-C1-D1-VOCAB (35 items) ─────────────────────────────────────────────
const C1_D1: Record<string, Tri> = {
  "安德思":     { en: "His name is An Desi, he comes from Honduras.", vi: "Anh ấy tên là An Desi, đến từ Honduras.", id: "Namanya An Desi, dia berasal dari Honduras." },
  "羅珊蒂":     { en: "Luo Shandi is my classmate.",                   vi: "Luo Shandi là bạn cùng lớp của tôi.",     id: "Luo Shandi adalah teman sekelasku." },
  "何雅婷":     { en: "He Yating studies in Taiwan.",                  vi: "Hà Nhã Đình học ở Đài Loan.",              id: "He Yating belajar di Taiwan." },
  "開學":       { en: "School starts on September 1st — are you ready?", vi: "Khai giảng vào ngày 1 tháng 9, bạn đã sẵn sàng chưa?", id: "Sekolah dimulai 1 September, apakah kamu sudah siap?" },
  "班":         { en: "Our class has thirty students.",                vi: "Lớp tôi có ba mươi học sinh.",             id: "Kelas kami ada tiga puluh siswa." },
  "新生":       { en: "I'm a new student this semester.",              vi: "Tôi là tân sinh viên học kỳ này.",         id: "Saya mahasiswa baru semester ini." },
  "嚴":         { en: "This teacher is very strict.",                  vi: "Giáo viên này rất nghiêm khắc.",           id: "Guru ini sangat tegas." },
  "口試":       { en: "There's an oral exam tomorrow.",                vi: "Ngày mai có thi vấn đáp.",                  id: "Besok ada ujian lisan." },
  "筆試":       { en: "The written exam is easier than the oral one.", vi: "Thi viết dễ hơn thi vấn đáp.",             id: "Ujian tulis lebih mudah dari ujian lisan." },
  "以外":       { en: "Everyone has come except me.",                  vi: "Ngoài tôi ra, mọi người đều đã đến.",      id: "Selain saya, semua orang sudah datang." },
  "口頭":       { en: "Please give me an oral report.",                vi: "Vui lòng báo cáo bằng miệng cho tôi.",     id: "Tolong berikan laporan lisan." },
  "報告":       { en: "I have to hand in a report next week.",         vi: "Tuần sau tôi phải nộp báo cáo.",            id: "Minggu depan saya harus menyerahkan laporan." },
  "壓力":       { en: "When work pressure is high, rest well.",        vi: "Khi áp lực công việc lớn, hãy nghỉ ngơi tốt.", id: "Saat tekanan kerja besar, istirahat yang baik." },
  "說明":       { en: "Please read the user instructions.",            vi: "Vui lòng đọc hướng dẫn sử dụng.",           id: "Tolong lihat petunjuk penggunaan." },
  "清楚":       { en: "The teacher explained very clearly.",           vi: "Giáo viên nói rất rõ ràng.",                id: "Guru menjelaskan dengan sangat jelas." },
  "位子":       { en: "Is this seat taken?",                            vi: "Chỗ này có ai ngồi không?",                 id: "Apakah tempat duduk ini ada yang menempati?" },
  "旁聽":       { en: "I'll go audit his class.",                       vi: "Tôi sẽ đi học dự thính lớp của anh ấy.",   id: "Saya akan audit kelasnya." },
  "分":         { en: "The exam score was 90.",                         vi: "Điểm thi là 90.",                            id: "Nilai ujiannya 90." },
  "羨慕":       { en: "I really envy your job.",                        vi: "Tôi rất ngưỡng mộ công việc của bạn.",      id: "Saya sangat iri dengan pekerjaanmu." },
  "休學":       { en: "He took a year off school and went home.",       vi: "Anh ấy nghỉ học một năm về nhà.",          id: "Dia cuti kuliah satu tahun pulang ke rumah." },
  "用功":       { en: "She's the most diligent — she studies every day.", vi: "Cô ấy chăm chỉ nhất, ngày nào cũng học.", id: "Dia paling rajin, belajar setiap hari." },
  "行":         { en: "Will this method work?",                         vi: "Phương pháp này có được không?",            id: "Apakah cara ini bisa?" },
  "轉":         { en: "She wants to switch to another department.",     vi: "Cô ấy muốn chuyển sang khoa khác.",         id: "Dia ingin pindah jurusan lain." },
  "原來":       { en: "Oh, you're here too!",                           vi: "Hóa ra bạn cũng ở đây!",                    id: "Ternyata kamu juga di sini!" },
  "會計":       { en: "She studies accounting.",                        vi: "Cô ấy học khoa kế toán.",                   id: "Dia kuliah jurusan akuntansi." },
  "熱門":       { en: "Computer science is a popular major.",           vi: "Khoa máy tính là ngành hot.",               id: "Komputer adalah jurusan populer." },
  "熬夜":       { en: "Staying up late is bad for your skin.",          vi: "Thức khuya không tốt cho da.",              id: "Begadang tidak baik untuk kulit." },
  "當":         { en: "He failed this course.",                         vi: "Anh ấy đã trượt môn này.",                  id: "Dia tidak lulus mata kuliah ini." },
  "恐怕":       { en: "I'm afraid we won't make it in time.",           vi: "E rằng không kịp rồi.",                     id: "Khawatir tidak akan keburu." },
  "口才":       { en: "He's very eloquent.",                            vi: "Anh ấy rất có tài ăn nói.",                 id: "Dia sangat pandai bicara." },
  "事":         { en: "I have something to discuss with you.",          vi: "Tôi có việc cần nói với bạn.",              id: "Saya ada urusan dengan kamu." },
  "遲到":       { en: "He's often late.",                               vi: "Anh ấy thường xuyên đến trễ.",              id: "Dia sering terlambat." },
  "差一點":     { en: "I almost fell asleep.",                          vi: "Tôi suýt nữa thì ngủ quên.",                id: "Saya hampir saja tertidur." },
  "這樣下去":   { en: "We can't keep going like this.",                 vi: "Cứ tiếp tục thế này thì không ổn.",         id: "Kalau begini terus tidak akan berhasil." },
  "沒辦法":     { en: "I can't do anything about it either.",           vi: "Tôi cũng không có cách nào.",               id: "Saya juga tidak bisa berbuat apa-apa." },
};

// ─── MS-C1-D2-VOCAB (21 items) ─────────────────────────────────────────────
const C1_D2: Record<string, Tri> = {
  "獨生女":     { en: "She's the only daughter in the family.",        vi: "Cô ấy là con gái một trong nhà.",          id: "Dia anak perempuan tunggal di keluarganya." },
  "私立":       { en: "I attend a private school.",                     vi: "Tôi học trường tư thục.",                   id: "Saya bersekolah di sekolah swasta." },
  "理想":       { en: "This is the ideal job.",                         vi: "Đây là công việc lý tưởng.",                id: "Ini pekerjaan ideal." },
  "合":         { en: "He and I don't get along.",                      vi: "Tôi với anh ấy không hợp nhau.",            id: "Saya dan dia tidak cocok." },
  "痛苦":       { en: "Losing a family member is very painful.",        vi: "Mất người thân là điều rất đau khổ.",      id: "Kehilangan anggota keluarga sangat menyakitkan." },
  "科系":       { en: "What's your major?",                             vi: "Bạn học khoa nào?",                         id: "Kamu jurusan apa?" },
  "放棄":       { en: "Don't give up on your dream.",                   vi: "Đừng từ bỏ ước mơ của bạn.",                id: "Jangan menyerah pada impianmu." },
  "不管":       { en: "Whether or not it rains, I'm going.",            vi: "Dù trời có mưa hay không, tôi cũng đi.",   id: "Tidak peduli hujan atau tidak, saya tetap pergi." },
  "反對":       { en: "Mom is against me going out at night.",          vi: "Mẹ phản đối tôi ra ngoài lúc nửa đêm.",    id: "Ibu menentang saya keluar malam-malam." },
  "個性":       { en: "His personality is very cheerful.",              vi: "Tính cách của anh ấy rất vui vẻ.",          id: "Kepribadiannya sangat ceria." },
  "活潑":       { en: "This little girl is lively and adorable.",       vi: "Cô bé này rất hoạt bát và dễ thương.",     id: "Anak perempuan ini lincah dan menggemaskan." },
  "外語":       { en: "Learning a foreign language requires lots of listening and speaking.", vi: "Học ngoại ngữ phải nghe nhiều nói nhiều.", id: "Belajar bahasa asing harus banyak mendengar dan bicara." },
  "擔心":       { en: "Don't worry — everything will be fine.",         vi: "Đừng lo, mọi chuyện sẽ ổn thôi.",          id: "Jangan khawatir, semuanya akan baik-baik saja." },
  "填":         { en: "Please fill out this form.",                     vi: "Vui lòng điền vào biểu mẫu này.",          id: "Tolong isi formulir ini." },
  "表":         { en: "This is the application form.",                  vi: "Đây là đơn đăng ký.",                       id: "Ini formulir pendaftaran." },
  "辦":         { en: "I have errands to run.",                         vi: "Tôi phải đi lo việc.",                      id: "Saya harus pergi mengurus sesuatu." },
  "手續":       { en: "The paperwork is a hassle.",                     vi: "Làm thủ tục rất phiền phức.",               id: "Mengurus prosedur sangat merepotkan." },
  "申請":       { en: "I want to apply to study abroad.",               vi: "Tôi muốn đăng ký du học nước ngoài.",      id: "Saya ingin mendaftar studi ke luar negeri." },
  "成績單":     { en: "Please give me my transcript.",                  vi: "Vui lòng đưa cho tôi bảng điểm.",           id: "Tolong berikan transkrip nilai saya." },
  "考上":       { en: "She got into university.",                       vi: "Cô ấy đã thi đỗ đại học.",                   id: "Dia lolos masuk universitas." },
  "推薦信":     { en: "The professor wrote a recommendation letter.",   vi: "Giáo sư đã viết thư giới thiệu.",           id: "Profesor sudah menulis surat rekomendasi." },
};

// ─── MS-C2-VOCAB-1 (32 items) ──────────────────────────────────────────────
const C2_V1: Record<string, Tri> = {
  "起":         { en: "Tickets start at 100 NT.",                       vi: "Giá vé bắt đầu từ 100 tệ.",                id: "Harga tiket mulai dari 100 NT." },
  "外套":       { en: "It's cold — remember to wear a coat.",           vi: "Trời lạnh, nhớ mặc áo khoác.",              id: "Dingin, jangan lupa pakai mantel." },
  "一般":       { en: "Students generally like the holidays.",          vi: "Học sinh nói chung đều thích kỳ nghỉ.",    id: "Siswa pada umumnya suka liburan." },
  "商品":       { en: "All this shop's products are cheap.",            vi: "Hàng của cửa hàng này đều rất rẻ.",        id: "Barang-barang toko ini semua murah." },
  "折扣":       { en: "Today's discount is decent.",                    vi: "Giảm giá hôm nay khá ổn.",                  id: "Diskon hari ini lumayan." },
  "省":         { en: "I want to save up to buy a new phone.",          vi: "Tôi phải tiết kiệm tiền mua điện thoại mới.", id: "Saya harus hemat uang untuk beli HP baru." },
  "牌子":       { en: "This brand is very famous in Taiwan.",           vi: "Thương hiệu này rất nổi tiếng ở Đài Loan.", id: "Merek ini sangat terkenal di Taiwan." },
  "品質":       { en: "Expensive things aren't always high quality.",   vi: "Đồ đắt chưa chắc chất lượng đã tốt.",       id: "Barang mahal belum tentu kualitasnya bagus." },
  "選擇":       { en: "We have lots of choices.",                       vi: "Chúng tôi có rất nhiều lựa chọn.",          id: "Kami punya banyak pilihan." },
  "樣子":       { en: "I like the look of this coat.",                  vi: "Tôi thích kiểu của chiếc áo khoác này.",   id: "Saya suka model mantel ini." },
  "摸":         { en: "Please don't touch this glass.",                 vi: "Xin đừng sờ vào kính này.",                 id: "Tolong jangan sentuh kaca ini." },
  "店員":       { en: "The clerk was very polite to me.",               vi: "Nhân viên cửa hàng rất lịch sự với tôi.",   id: "Pelayan toko sangat sopan padaku." },
  "短":         { en: "These pants are too short.",                     vi: "Cái quần này ngắn quá.",                    id: "Celana ini terlalu pendek." },
  "羊毛":       { en: "Wool clothes are warmer.",                       vi: "Quần áo bằng len ấm hơn.",                  id: "Pakaian wol lebih hangat." },
  "暖和":       { en: "It's warm today — let's go out for a walk.",     vi: "Hôm nay ấm áp, ra ngoài đi dạo nhé.",      id: "Hari ini hangat, ayo keluar jalan-jalan." },
  "打折":       { en: "Department stores often have sales.",            vi: "Trung tâm thương mại thường giảm giá.",     id: "Mall sering memberi diskon." },
  "原價":       { en: "Original price 2,000, now 1,500.",               vi: "Giá gốc 2000, bây giờ 1500.",               id: "Harga asli 2000, sekarang 1500." },
  "刷卡":       { en: "Can I pay by card?",                             vi: "Tôi có thể quẹt thẻ không?",                id: "Bisakah saya bayar dengan kartu?" },
  "現金":       { en: "I only brought a little cash.",                  vi: "Tôi chỉ mang theo một ít tiền mặt.",        id: "Saya hanya bawa sedikit uang tunai." },
  "麻煩":       { en: "Could you please hold this for me?",             vi: "Phiền bạn cầm giúp tôi một chút.",          id: "Tolong bantu pegang sebentar." },
  "簽名":       { en: "Please sign here.",                              vi: "Vui lòng ký tên ở đây.",                    id: "Mohon tanda tangan di sini." },
  "破洞":       { en: "My socks have a hole.",                          vi: "Tất của tôi bị thủng.",                     id: "Kaus kakiku berlubang." },
  "發票":       { en: "Please give me the receipt.",                    vi: "Cho tôi xin hóa đơn.",                       id: "Tolong berikan saya nota." },
  "弄":         { en: "Who broke the window?",                          vi: "Ai làm vỡ cửa sổ vậy?",                     id: "Siapa yang memecahkan jendela?" },
  "退":         { en: "I'd like to return this piece of clothing.",     vi: "Tôi muốn trả lại bộ đồ này.",                id: "Saya ingin mengembalikan baju ini." },
  "換":         { en: "Can I exchange for a bigger one?",               vi: "Đổi sang cỡ lớn hơn được không?",            id: "Bisa tukar dengan ukuran yang lebih besar?" },
  "店長":       { en: "The store manager just stepped out.",            vi: "Quản lý cửa hàng vừa ra ngoài.",            id: "Manajer toko baru saja keluar." },
  "週年慶":     { en: "Anniversary sales are the best deal.",           vi: "Mua đồ dịp khuyến mãi kỷ niệm lợi nhất.",   id: "Belanja saat ulang tahun toko paling menguntungkan." },
  "一般來說":   { en: "Generally, weekends are more crowded.",          vi: "Nói chung, cuối tuần đông người hơn.",      id: "Secara umum, akhir pekan lebih ramai." },
  "試穿":       { en: "Can I try this on?",                             vi: "Tôi có thể mặc thử cái này không?",         id: "Bisakah saya mencoba pakai ini?" },
  "打完折":     { en: "It's cheaper after the discount.",               vi: "Sau khi giảm giá thì rẻ hơn.",              id: "Lebih murah setelah diskon." },
  "弄丟":       { en: "I lost my keys.",                                vi: "Tôi đã làm mất chìa khóa.",                  id: "Saya kehilangan kunci." },
};

// ─── MS-C2-VOCAB-2 (24 items) ──────────────────────────────────────────────
const C2_V2: Record<string, Tri> = {
  "購物":       { en: "I like shopping online.",                        vi: "Tôi thích mua sắm trên mạng.",              id: "Saya suka belanja online." },
  "糾紛":       { en: "They have a small dispute.",                     vi: "Họ có chút tranh chấp.",                    id: "Mereka punya sedikit perselisihan." },
  "電信":       { en: "The telecom company is right ahead.",            vi: "Công ty viễn thông ở ngay phía trước.",     id: "Perusahaan telekomunikasi ada di depan." },
  "門市":       { en: "The closest branch to my home is here.",         vi: "Chi nhánh gần nhà tôi nhất ở đây.",         id: "Cabang terdekat dari rumah saya ada di sini." },
  "居留證":     { en: "Next month I'll go apply for the ARC.",          vi: "Tháng sau tôi đi làm thẻ cư trú.",          id: "Bulan depan saya akan urus kartu izin tinggal." },
  "月租型":     { en: "Monthly plans are more convenient.",             vi: "Gói thuê bao tháng tiện hơn.",              id: "Paket bulanan lebih praktis." },
  "帳單":       { en: "The bill is due next week.",                     vi: "Hóa đơn phải nộp tuần sau.",                id: "Tagihan harus dibayar minggu depan." },
  "並":         { en: "He actually doesn't know about this.",           vi: "Anh ấy thực ra không biết chuyện này.",     id: "Sebenarnya dia tidak tahu hal ini." },
  "包括":       { en: "Rent doesn't include utilities.",                vi: "Tiền thuê không bao gồm điện nước.",        id: "Sewa tidak termasuk listrik dan air." },
  "解釋":       { en: "Please listen to my explanation.",               vi: "Vui lòng nghe tôi giải thích.",             id: "Tolong dengarkan penjelasan saya." },
  "顧客":       { en: "The customer is always right.",                  vi: "Khách hàng là thượng đế.",                  id: "Pelanggan adalah raja." },
  "尤其":       { en: "I love fruit, especially mango.",                vi: "Tôi thích trái cây, đặc biệt là xoài.",     id: "Saya suka buah, terutama mangga." },
  "騙":         { en: "He cheated me out of 200 NT.",                   vi: "Anh ta lừa tôi 200 tệ.",                    id: "Dia menipu saya 200 NT." },
  "頓":         { en: "Mom gave little brother a scolding.",            vi: "Mẹ mắng em trai một trận.",                 id: "Ibu memarahi adik laki-laki sebentar." },
  "辦法":       { en: "I have a good idea.",                            vi: "Tôi có một cách hay.",                      id: "Saya punya satu cara yang bagus." },
  "自動":       { en: "The door closes automatically.",                 vi: "Cửa sẽ tự động đóng.",                      id: "Pintu akan menutup secara otomatis." },
  "關機":       { en: "Please turn off your phone in class.",           vi: "Trong giờ học vui lòng tắt máy.",           id: "Saat pelajaran tolong matikan ponsel." },
  "修理":       { en: "I need to take my phone in for repair.",         vi: "Tôi phải mang điện thoại đi sửa.",          id: "Saya harus bawa HP untuk diperbaiki." },
  "繳費":       { en: "You can pay at convenience stores.",             vi: "Có thể thanh toán ở cửa hàng tiện lợi.",    id: "Bisa bayar di minimarket." },
  "預付卡":     { en: "When you first arrive in Taiwan, you can buy a prepaid SIM.", vi: "Mới đến Đài Loan có thể mua SIM trả trước.", id: "Saat baru tiba di Taiwan bisa beli SIM prabayar." },
  "換成":       { en: "Please exchange USD for NT dollars.",            vi: "Vui lòng đổi đô la sang tiền Đài Loan.",    id: "Tolong tukar USD ke dolar Taiwan." },
  "吃到飽":     { en: "This restaurant is all-you-can-eat.",            vi: "Nhà hàng này là buffet không giới hạn.",    id: "Restoran ini buffet sepuasnya." },
  "嚇一跳":     { en: "He suddenly appeared and startled me.",          vi: "Anh ấy đột nhiên xuất hiện làm tôi giật mình.", id: "Dia tiba-tiba muncul, membuatku kaget." },
  "客服中心":   { en: "If there's a problem, please call customer service.", vi: "Có vấn đề vui lòng gọi trung tâm chăm sóc khách hàng.", id: "Jika ada masalah, tolong hubungi pusat layanan pelanggan." },
};

// ─── MS-C3-VOCAB-1 (37 items) ──────────────────────────────────────────────
const C3_V1: Record<string, Tri> = {
  "陳敏萱":     { en: "Chen Minxuan is from the Netherlands.",          vi: "Trần Mẫn Huyên đến từ Hà Lan.",            id: "Chen Minxuan berasal dari Belanda." },
  "高橋健太":   { en: "Takahashi Kenta is Japanese.",                   vi: "Takahashi Kenta là người Nhật.",            id: "Takahashi Kenta orang Jepang." },
  "空氣":       { en: "Today's air is very clean.",                    vi: "Không khí hôm nay rất trong lành.",         id: "Udara hari ini sangat bersih." },
  "影響":       { en: "The weather has a big impact.",                 vi: "Thời tiết ảnh hưởng rất lớn.",              id: "Cuaca berpengaruh besar." },
  "穩定":       { en: "A stable job is important.",                    vi: "Công việc ổn định rất quan trọng.",         id: "Pekerjaan yang stabil itu penting." },
  "幸虧":       { en: "Good thing I brought an umbrella.",             vi: "May mà tôi đã mang theo ô.",                id: "Untung saya bawa payung." },
  "躲":         { en: "It's raining — let's take shelter.",            vi: "Trời mưa rồi, chúng ta núp một lát đi.",   id: "Hujan turun, kita berlindung sebentar." },
  "度":         { en: "It's 18 degrees today.",                        vi: "Hôm nay 18 độ.",                            id: "Hari ini 18 derajat." },
  "溫度":       { en: "Please look at the thermometer.",               vi: "Vui lòng xem nhiệt kế.",                     id: "Tolong lihat termometer." },
  "零下":       { en: "In the north, winters are often below zero.",   vi: "Mùa đông phía bắc thường dưới 0 độ.",       id: "Musim dingin di utara sering di bawah nol." },
  "感覺":       { en: "I feel really cold.",                           vi: "Tôi cảm thấy rất lạnh.",                    id: "Saya merasa sangat dingin." },
  "實際":       { en: "The actual temperature is high.",               vi: "Nhiệt độ thực tế rất cao.",                  id: "Suhu sebenarnya sangat tinggi." },
  "難怪":       { en: "No wonder you're so tired.",                    vi: "Thảo nào bạn mệt như vậy.",                  id: "Pantas kamu capek begitu." },
  "季節":       { en: "This season is the most comfortable.",          vi: "Mùa này dễ chịu nhất.",                      id: "Musim ini paling nyaman." },
  "火鍋":       { en: "Winter is best for hotpot.",                    vi: "Mùa đông thích hợp ăn lẩu nhất.",            id: "Musim dingin paling cocok makan hotpot." },
  "海鮮":       { en: "Seafood at the coast is fresh.",                vi: "Hải sản ở bờ biển rất tươi.",                id: "Makanan laut di pantai segar." },
  "新鮮":       { en: "This fish is very fresh.",                      vi: "Con cá này rất tươi.",                       id: "Ikan ini sangat segar." },
  "櫻花":       { en: "Watching cherry blossoms in spring is beautiful.", vi: "Ngắm hoa anh đào mùa xuân đẹp lắm.",     id: "Menonton sakura di musim semi sangat indah." },
  "變化":       { en: "The weather changes a lot.",                    vi: "Thời tiết thay đổi rất nhiều.",              id: "Cuaca berubah-ubah." },
  "氣溫":       { en: "The temperature has dropped.",                  vi: "Nhiệt độ đã giảm.",                          id: "Suhu telah turun." },
  "差":         { en: "The weather differs greatly between the two cities.", vi: "Thời tiết hai thành phố chênh lệch nhiều.", id: "Cuaca dua kota itu berbeda jauh." },
  "幾乎":       { en: "I work out almost every day.",                  vi: "Tôi gần như tập thể dục mỗi ngày.",          id: "Saya hampir berolahraga setiap hari." },
  "乾":         { en: "The clothes aren't dry yet.",                   vi: "Quần áo vẫn chưa khô.",                      id: "Pakaian belum kering." },
  "發霉":       { en: "The bread has gone moldy.",                     vi: "Bánh mì đã bị mốc.",                         id: "Roti sudah berjamur." },
  "除濕機":     { en: "I have a dehumidifier at home.",                vi: "Nhà tôi có máy hút ẩm.",                     id: "Di rumah saya ada dehumidifier." },
  "雨季":       { en: "You should bring an umbrella in the rainy season.", vi: "Mùa mưa phải mang theo ô.",              id: "Musim hujan harus bawa payung." },
  "涼快":       { en: "It's much cooler at night.",                    vi: "Buổi tối mát mẻ hơn nhiều.",                 id: "Malam hari jauh lebih sejuk." },
  "潮濕":       { en: "Taipei is very humid.",                         vi: "Đài Bắc rất ẩm.",                            id: "Taipei sangat lembap." },
  "悶":         { en: "Summer is stuffy and hot.",                     vi: "Mùa hè vừa ngột ngạt vừa nóng.",            id: "Musim panas pengap dan panas." },
  "冷氣":       { en: "Please turn on the AC.",                        vi: "Xin bật máy lạnh.",                          id: "Tolong nyalakan AC." },
  "荷蘭":       { en: "She comes from the Netherlands.",               vi: "Cô ấy đến từ Hà Lan.",                       id: "Dia berasal dari Belanda." },
  "出大太陽":   { en: "It's blazing hot today.",                       vi: "Hôm nay nắng gắt.",                          id: "Hari ini matahari menyengat." },
  "颳風":       { en: "It's windy outside.",                           vi: "Bên ngoài đang có gió mạnh.",                id: "Di luar sedang berangin kencang." },
  "受到":       { en: "Affected by the typhoon.",                      vi: "Bị ảnh hưởng bởi bão.",                      id: "Terdampak oleh topan." },
  "受不了":     { en: "It's too hot — I can't stand it.",              vi: "Nóng quá, không chịu nổi.",                  id: "Terlalu panas, tidak tahan." },
  "餓死了":     { en: "I'm starving!",                                  vi: "Đói chết mất rồi!",                          id: "Saya kelaparan!" },
  "後母臉":     { en: "Spring weather is like a stepmother's face.",   vi: "Thời tiết mùa xuân thay đổi như mặt mẹ kế.", id: "Cuaca musim semi seperti wajah ibu tiri (berubah-ubah)." },
};

// ─── MS-C3-VOCAB-2 (17 items) ──────────────────────────────────────────────
const C3_V2: Record<string, Tri> = {
  "祖先":       { en: "Our ancestors are very important.",             vi: "Tổ tiên của chúng ta rất quan trọng.",      id: "Leluhur kita sangat penting." },
  "移民":       { en: "He immigrated to America.",                     vi: "Anh ấy di cư sang Mỹ.",                      id: "Dia berimigrasi ke Amerika." },
  "當中":       { en: "Of the three festivals, Lunar New Year is most important.", vi: "Trong ba lễ hội, Tết Nguyên Đán quan trọng nhất.", id: "Di antara tiga festival, Imlek paling penting." },
  "根據":       { en: "Celebrate festivals according to tradition.",   vi: "Mừng lễ theo truyền thống.",                 id: "Merayakan festival sesuai tradisi." },
  "農曆":       { en: "Happy Lunar New Year!",                         vi: "Chúc mừng Tết Nguyên Đán!",                  id: "Selamat Tahun Baru Imlek!" },
  "農業":       { en: "Ancient times had an agricultural society.",    vi: "Thời cổ đại là xã hội nông nghiệp.",         id: "Zaman dahulu adalah masyarakat agraris." },
  "農人":       { en: "Farmers work very hard.",                       vi: "Nông dân rất vất vả.",                       id: "Petani bekerja sangat keras." },
  "難得":       { en: "It's rare to get a holiday — rest well.",       vi: "Hiếm khi được nghỉ, hãy nghỉ ngơi tốt.",     id: "Langka dapat libur, istirahatlah dengan baik." },
  "祭祖":       { en: "We venerate ancestors at New Year.",            vi: "Tết phải cúng tổ tiên.",                     id: "Saat tahun baru harus memuja leluhur." },
  "拜":         { en: "Go to the temple to pay homage.",               vi: "Đi đến chùa để lạy.",                        id: "Pergi ke kuil untuk bersembahyang." },
  "神":         { en: "I hope the gods bless us.",                     vi: "Mong các vị thần phù hộ chúng ta.",         id: "Semoga para dewa melindungi kami." },
  "端午節":     { en: "Eat zongzi at the Dragon Boat Festival.",       vi: "Tết Đoan Ngọ ăn bánh ú.",                   id: "Saat Festival Perahu Naga makan bakcang." },
  "中秋節":     { en: "Eat mooncakes at Mid-Autumn Festival.",         vi: "Tết Trung Thu ăn bánh trung thu.",           id: "Saat Festival Pertengahan Musim Gugur makan kue bulan." },
  "雄黃酒":     { en: "Ancient people drank realgar liquor.",          vi: "Người xưa uống rượu hùng hoàng.",           id: "Orang zaman dahulu minum arak realgar." },
  "古時候":     { en: "In ancient times there was no electricity.",    vi: "Thời xưa không có điện.",                    id: "Zaman dahulu tidak ada listrik." },
  "趕走":       { en: "Drive away the mosquitos.",                     vi: "Đuổi muỗi đi.",                              id: "Mengusir nyamuk." },
  "過節":       { en: "Spend the holidays with family.",               vi: "Đón Tết cùng gia đình.",                     id: "Merayakan hari raya bersama keluarga." },
};

interface Item {
  hanzi: string;
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string; translations?: Record<string, string> }>;
  [key: string]: unknown;
}

async function fillExamples(lessonCode: string, map: Record<string, Tri>) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { items?: Item[]; [key: string]: unknown } | null;
  if (!content?.items) return 0;

  let filled = 0;
  const updated = content.items.map((item) => {
    const tri = map[item.hanzi];
    if (!tri) return item;
    const exArr = item.examples;
    if (!exArr || exArr.length === 0) return item;
    const first = exArr[0]!;
    const existingTr = first.translations ?? {};
    if (existingTr.en && existingTr.vi && existingTr.id) return item; // already filled
    filled++;
    const newFirst = {
      ...first,
      translations: {
        en: tri.en,
        th: existingTr.th ?? first.translation ?? "",
        vi: tri.vi,
        id: tri.id,
      },
    };
    return { ...item, examples: [newFirst, ...exArr.slice(1)] };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: updated } as object },
  });
  console.log(`  ✅ ${lessonCode}: filled ${filled} / ${content.items.length} (en+vi+id)`);
  return filled;
}

async function main() {
  console.log("=== Translating example sentences (en/vi/id) ===\n");
  let total = 0;
  total += await fillExamples("MS-C1-D1-VOCAB", C1_D1);
  total += await fillExamples("MS-C1-D2-VOCAB", C1_D2);
  total += await fillExamples("MS-C2-VOCAB-1",  C2_V1);
  total += await fillExamples("MS-C2-VOCAB-2",  C2_V2);
  total += await fillExamples("MS-C3-VOCAB-1",  C3_V1);
  total += await fillExamples("MS-C3-VOCAB-2",  C3_V2);
  console.log(`\n🎉 Total examples filled: ${total} (× 3 langs each = ${total * 3} translations)`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
