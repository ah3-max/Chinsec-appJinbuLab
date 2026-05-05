/**
 * Add multi-language example sentences to every Chapter 4 vocab word.
 * Sentences are originally written here. Each example carries
 * `translations: { en, th, vi, id }` plus the legacy `translation` (Thai).
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

interface Ex {
  sentence: string;
  pinyin: string;
  en: string;
  th: string;
  vi: string;
  id: string;
}

// Vocab 1 (35 items)
const V1: Record<string, Ex> = {
  "愛":         { sentence: "我愛我的家人。",                  pinyin: "Wǒ ài wǒ de jiārén.",                       en: "I love my family.",                                   th: "ฉันรักครอบครัวของฉัน",                        vi: "Tôi yêu gia đình mình.",                              id: "Aku menyayangi keluargaku." },
  "人情味":     { sentence: "台灣最美的風景是人情味。",          pinyin: "Táiwān zuì měi de fēngjǐng shì rénqíngwèi.", en: "The most beautiful sight in Taiwan is its hospitality.", th: "วิวที่สวยที่สุดของไต้หวันคือน้ำใจของคน",  vi: "Phong cảnh đẹp nhất ở Đài Loan là tình người.",       id: "Pemandangan terindah Taiwan adalah keramahan orangnya." },
  "放":         { sentence: "他把書放在桌子上。",                pinyin: "Tā bǎ shū fàng zài zhuōzi shàng.",          en: "He put the book on the table.",                       th: "เขาวางหนังสือบนโต๊ะ",                          vi: "Anh ấy đặt cuốn sách lên bàn.",                       id: "Dia meletakkan buku di atas meja." },
  "天燈":       { sentence: "我們去平溪放天燈。",                pinyin: "Wǒmen qù Píngxī fàng tiāndēng.",            en: "We're going to Pingxi to release sky lanterns.",      th: "พวกเราไปผิงซีปล่อยโคมลอย",                    vi: "Chúng tôi đi Bình Khê thả đèn trời.",                 id: "Kami pergi ke Pingxi melepas lampion langit." },
  "願望":       { sentence: "我把願望寫在天燈上。",              pinyin: "Wǒ bǎ yuànwàng xiě zài tiāndēng shàng.",    en: "I wrote my wish on the sky lantern.",                 th: "ฉันเขียนคำอธิษฐานบนโคมลอย",                   vi: "Tôi viết ước nguyện lên đèn trời.",                  id: "Aku menulis harapan di lampion langit." },
  "訊號":       { sentence: "山上的訊號很差。",                  pinyin: "Shān shàng de xùnhào hěn chà.",             en: "The signal on the mountain is poor.",                 th: "สัญญาณบนภูเขาแย่มาก",                          vi: "Tín hiệu trên núi rất kém.",                          id: "Sinyal di gunung sangat buruk." },
  "元宵":       { sentence: "元宵節要吃元宵。",                  pinyin: "Yuánxiāo jié yào chī yuánxiāo.",            en: "We eat tangyuan on the Lantern Festival.",            th: "เทศกาลโคมไฟต้องกินบัวลอย",                     vi: "Tết Nguyên Tiêu phải ăn bánh trôi.",                  id: "Saat Festival Lampion harus makan kue bola ketan." },
  "牆":         { sentence: "牆上掛著一張地圖。",                pinyin: "Qiáng shàng guà zhe yī zhāng dìtú.",        en: "A map is hanging on the wall.",                       th: "บนกำแพงมีแผนที่แขวนอยู่",                      vi: "Trên tường treo một tấm bản đồ.",                     id: "Di tembok tergantung sebuah peta." },
  "耐心":       { sentence: "學語言要有耐心。",                  pinyin: "Xué yǔyán yào yǒu nàixīn.",                 en: "You need patience to learn a language.",              th: "เรียนภาษาต้องมีความอดทน",                     vi: "Học ngôn ngữ cần có kiên nhẫn.",                      id: "Belajar bahasa butuh kesabaran." },
  "感動":       { sentence: "這部電影讓我很感動。",              pinyin: "Zhè bù diànyǐng ràng wǒ hěn gǎndòng.",      en: "This movie really moved me.",                         th: "หนังเรื่องนี้ทำให้ฉันซาบซึ้งมาก",            vi: "Bộ phim này khiến tôi rất cảm động.",                 id: "Film ini sangat menyentuh hatiku." },
  "擔仔麵":     { sentence: "台南的擔仔麵很有名。",              pinyin: "Táinán de dànzǎimiàn hěn yǒumíng.",         en: "Tainan's danzai noodles are famous.",                 th: "บะหมี่ตันไจ้ของไถหนานมีชื่อเสียงมาก",         vi: "Mì Đam Tử Đài Nam rất nổi tiếng.",                    id: "Mi Danzai Tainan sangat terkenal." },
  "招牌":       { sentence: "這家店沒有招牌。",                  pinyin: "Zhè jiā diàn méiyǒu zhāopái.",              en: "This shop has no signboard.",                         th: "ร้านนี้ไม่มีป้าย",                              vi: "Cửa hàng này không có biển hiệu.",                    id: "Toko ini tidak punya papan nama." },
  "當地":       { sentence: "我喜歡吃當地的食物。",              pinyin: "Wǒ xǐhuān chī dāngdì de shíwù.",            en: "I like eating local food.",                           th: "ฉันชอบกินอาหารท้องถิ่น",                       vi: "Tôi thích ăn món ăn địa phương.",                     id: "Aku suka makan makanan lokal." },
  "賺":         { sentence: "他賺了很多錢。",                    pinyin: "Tā zhuàn le hěn duō qián.",                 en: "He earned a lot of money.",                           th: "เขาหาเงินได้เยอะมาก",                          vi: "Anh ấy kiếm được rất nhiều tiền.",                    id: "Dia menghasilkan banyak uang." },
  "而":         { sentence: "我換工作不是為了錢，而是為了興趣。", pinyin: "Wǒ huàn gōngzuò bú shì wèile qián, érshì wèile xìngqù.", en: "I changed jobs not for money, but for interest.",  th: "ฉันเปลี่ยนงานไม่ใช่เพื่อเงิน แต่เพื่อความชอบ",  vi: "Tôi đổi việc không phải vì tiền, mà vì sở thích.",     id: "Aku ganti kerja bukan demi uang, melainkan demi minat." },
  "交":         { sentence: "我在學校交了很多朋友。",            pinyin: "Wǒ zài xuéxiào jiāo le hěn duō péngyǒu.",   en: "I made many friends at school.",                      th: "ฉันได้เพื่อนมากมายที่โรงเรียน",                vi: "Tôi kết nhiều bạn ở trường.",                         id: "Aku punya banyak teman di sekolah." },
  "理想":       { sentence: "她的理想是當醫生。",                pinyin: "Tā de lǐxiǎng shì dāng yīshēng.",           en: "Her dream is to become a doctor.",                    th: "ความใฝ่ฝันของเธอคือเป็นหมอ",                   vi: "Lý tưởng của cô ấy là làm bác sĩ.",                   id: "Cita-citanya menjadi dokter." },
  "剛剛":       { sentence: "他剛剛打電話來。",                  pinyin: "Tā gānggāng dǎ diànhuà lái.",               en: "He just called.",                                     th: "เขาเพิ่งโทรมาเมื่อกี้",                        vi: "Anh ấy vừa gọi điện đến.",                            id: "Dia tadi baru saja menelepon." },
  "改天":       { sentence: "改天我請你吃飯。",                  pinyin: "Gǎitiān wǒ qǐng nǐ chīfàn.",                en: "I'll treat you to a meal another day.",              th: "วันหลังฉันเลี้ยงข้าวคุณ",                      vi: "Hôm khác tôi mời bạn đi ăn.",                         id: "Lain hari aku traktir kamu makan." },
  "無聊":       { sentence: "這部電影很無聊。",                  pinyin: "Zhè bù diànyǐng hěn wúliáo.",               en: "This movie is boring.",                               th: "หนังเรื่องนี้น่าเบื่อ",                        vi: "Bộ phim này rất chán.",                               id: "Film ini membosankan." },
  "東區":       { sentence: "東區的咖啡店很多。",                pinyin: "Dōngqū de kāfēi diàn hěn duō.",             en: "There are lots of cafés in the East District.",       th: "ย่านตงชูมีร้านกาแฟเยอะ",                       vi: "Khu Đông có nhiều quán cà phê.",                      id: "Distrik Timur banyak kedai kopi." },
  "煙火":       { sentence: "今晚有煙火表演。",                  pinyin: "Jīnwǎn yǒu yānhuǒ biǎoyǎn.",                en: "There's a fireworks show tonight.",                   th: "คืนนี้มีโชว์พลุ",                                vi: "Tối nay có bắn pháo hoa.",                            id: "Malam ini ada pertunjukan kembang api." },
  "跨年":       { sentence: "我們去101跨年吧!",                  pinyin: "Wǒmen qù 101 kuànián ba!",                  en: "Let's go to 101 for New Year's countdown!",           th: "ไปนับถอยหลังปีใหม่ที่ 101 กันเถอะ!",            vi: "Chúng ta đến 101 đón giao thừa nhé!",                 id: "Ayo ke 101 untuk pergantian tahun!" },
  "種類":       { sentence: "夜市的小吃種類很多。",              pinyin: "Yèshì de xiǎochī zhǒnglèi hěn duō.",        en: "Night-market snacks come in many types.",             th: "ของกินตลาดกลางคืนมีหลายชนิด",                  vi: "Đồ ăn vặt chợ đêm có nhiều loại.",                    id: "Jajanan pasar malam banyak jenisnya." },
  "價錢":       { sentence: "這個價錢太貴了。",                  pinyin: "Zhège jiàqián tài guì le.",                 en: "This price is too expensive.",                        th: "ราคานี้แพงเกินไป",                              vi: "Giá này quá đắt.",                                    id: "Harga ini terlalu mahal." },
  "感覺":       { sentence: "我有不好的感覺。",                  pinyin: "Wǒ yǒu bù hǎo de gǎnjué.",                  en: "I have a bad feeling.",                               th: "ฉันมีลางสังหรณ์ไม่ดี",                          vi: "Tôi có cảm giác không tốt.",                          id: "Aku punya firasat buruk." },
  "雞排":       { sentence: "我最愛吃雞排。",                    pinyin: "Wǒ zuì ài chī jīpái.",                      en: "I love eating fried chicken cutlets.",                th: "ฉันชอบกินไก่แผ่นทอดที่สุด",                   vi: "Tôi thích nhất ăn miếng gà chiên.",                   id: "Aku paling suka makan fillet ayam goreng." },
  "口":         { sentence: "我喝了一口水。",                    pinyin: "Wǒ hē le yī kǒu shuǐ.",                     en: "I took a sip of water.",                              th: "ฉันจิบน้ำหนึ่งคำ",                              vi: "Tôi uống một ngụm nước.",                             id: "Aku minum air seteguk." },
  "紅茶":       { sentence: "我要一杯冰紅茶。",                  pinyin: "Wǒ yào yī bēi bīng hóngchá.",               en: "I'd like an iced black tea.",                         th: "ฉันขอชาดำเย็นหนึ่งแก้ว",                       vi: "Cho tôi một cốc trà đen đá.",                         id: "Saya minta segelas teh hitam dingin." },
  "平溪":       { sentence: "平溪的天燈節很有名。",              pinyin: "Píngxī de tiāndēng jié hěn yǒumíng.",       en: "Pingxi's Sky Lantern Festival is famous.",            th: "เทศกาลโคมลอยผิงซีมีชื่อเสียง",                vi: "Lễ hội đèn trời Bình Khê rất nổi tiếng.",            id: "Festival Lampion Pingxi sangat terkenal." },
  "元宵節":     { sentence: "元宵節是農曆一月十五。",            pinyin: "Yuánxiāo jié shì nónglì yī yuè shíwǔ.",     en: "The Lantern Festival falls on the 15th of the 1st lunar month.", th: "เทศกาลโคมไฟตรงกับวันที่ 15 เดือน 1 จันทรคติ", vi: "Tết Nguyên Tiêu là ngày 15 tháng giêng âm lịch.",     id: "Festival Lampion jatuh pada 15 bulan 1 Imlek." },
  "孔廟":       { sentence: "我去參觀台南孔廟。",                pinyin: "Wǒ qù cānguān Táinán Kǒngmiào.",            en: "I'm visiting the Tainan Confucian Temple.",           th: "ฉันไปชมศาลขงจื๊อไถหนาน",                       vi: "Tôi đi tham quan Miếu Khổng Tử Đài Nam.",            id: "Aku berkunjung ke Kuil Konfusius Tainan." },
  "校外教學":   { sentence: "下星期有校外教學。",                pinyin: "Xià xīngqí yǒu xiàowài jiāoxué.",           en: "There's a field trip next week.",                     th: "อาทิตย์หน้ามีทัศนศึกษา",                       vi: "Tuần sau có buổi đi tham quan ngoại khóa.",          id: "Minggu depan ada studi lapangan." },
  "碰到":       { sentence: "我在路上碰到老朋友。",              pinyin: "Wǒ zài lùshàng pèngdào lǎo péngyǒu.",       en: "I ran into an old friend on the street.",             th: "ฉันบังเอิญเจอเพื่อนเก่าบนถนน",                vi: "Tôi tình cờ gặp bạn cũ trên đường.",                  id: "Aku kebetulan bertemu teman lama di jalan." },
  "水煎包":     { sentence: "早餐我吃了水煎包。",                pinyin: "Zǎocān wǒ chī le shuǐjiān bāo.",            en: "I had pan-fried buns for breakfast.",                 th: "อาหารเช้าฉันกินซาลาเปาทอดน้ำ",                vi: "Bữa sáng tôi ăn bánh bao chiên.",                     id: "Sarapan aku makan bakpao goreng." },
};

// Vocab 2 (29 items)
const V2: Record<string, Ex> = {
  "同事":       { sentence: "他是我的好同事。",                  pinyin: "Tā shì wǒ de hǎo tóngshì.",                 en: "He's my good coworker.",                              th: "เขาเป็นเพื่อนร่วมงานที่ดีของฉัน",            vi: "Anh ấy là đồng nghiệp tốt của tôi.",                  id: "Dia rekan kerjaku yang baik." },
  "美食":       { sentence: "台北有很多美食。",                  pinyin: "Táiběi yǒu hěn duō měishí.",                en: "Taipei has lots of delicious food.",                  th: "ไทเปมีอาหารอร่อยเยอะมาก",                      vi: "Đài Bắc có rất nhiều món ngon.",                       id: "Taipei punya banyak makanan lezat." },
  "上":         { sentence: "她每天上班都很早。",                pinyin: "Tā měi tiān shàngbān dōu hěn zǎo.",         en: "She goes to work early every day.",                  th: "เธอไปทำงานเช้าทุกวัน",                          vi: "Cô ấy ngày nào cũng đi làm sớm.",                     id: "Dia setiap hari berangkat kerja pagi-pagi." },
  "泡":         { sentence: "我們去泡溫泉吧。",                  pinyin: "Wǒmen qù pào wēnquán ba.",                  en: "Let's go soak in the hot springs.",                  th: "ไปแช่น้ำพุร้อนกันเถอะ",                          vi: "Chúng ta đi tắm suối nước nóng đi.",                  id: "Ayo kita berendam di pemandian air panas." },
  "錯過":       { sentence: "別錯過這次機會。",                  pinyin: "Bié cuòguò zhè cì jīhuì.",                  en: "Don't miss this opportunity.",                        th: "อย่าพลาดโอกาสครั้งนี้",                          vi: "Đừng bỏ lỡ cơ hội lần này.",                          id: "Jangan lewatkan kesempatan ini." },
  "營業":       { sentence: "這家店24小時營業。",                pinyin: "Zhè jiā diàn 24 xiǎoshí yíngyè.",           en: "This shop is open 24 hours.",                        th: "ร้านนี้เปิด 24 ชั่วโมง",                         vi: "Cửa hàng này mở 24 giờ.",                              id: "Toko ini buka 24 jam." },
  "夜景":       { sentence: "101的夜景很漂亮。",                  pinyin: "101 de yèjǐng hěn piàoliang.",              en: "The night view at 101 is beautiful.",                 th: "วิวกลางคืนของ 101 สวยมาก",                       vi: "Cảnh đêm 101 rất đẹp.",                                id: "Pemandangan malam 101 sangat indah." },
  "古老":       { sentence: "台南是個古老的城市。",              pinyin: "Táinán shì gè gǔlǎo de chéngshì.",          en: "Tainan is an ancient city.",                          th: "ไถหนานเป็นเมืองที่เก่าแก่",                     vi: "Đài Nam là một thành phố cổ kính.",                    id: "Tainan adalah kota kuno." },
  "古蹟":       { sentence: "我喜歡參觀古蹟。",                  pinyin: "Wǒ xǐhuān cānguān gǔjī.",                   en: "I like visiting historical sites.",                  th: "ฉันชอบเที่ยวโบราณสถาน",                          vi: "Tôi thích tham quan di tích cổ.",                      id: "Aku suka berkunjung ke situs bersejarah." },
  "重視":       { sentence: "他很重視家庭。",                    pinyin: "Tā hěn zhòngshì jiātíng.",                  en: "He values family highly.",                            th: "เขาให้ความสำคัญกับครอบครัวมาก",                  vi: "Anh ấy rất coi trọng gia đình.",                       id: "Dia sangat mementingkan keluarga." },
  "歷史":       { sentence: "我對中國歷史有興趣。",              pinyin: "Wǒ duì Zhōngguó lìshǐ yǒu xìngqù.",         en: "I'm interested in Chinese history.",                  th: "ฉันสนใจประวัติศาสตร์จีน",                        vi: "Tôi quan tâm đến lịch sử Trung Quốc.",                 id: "Aku tertarik pada sejarah Tiongkok." },
  "風俗":       { sentence: "每個地方的風俗都不一樣。",          pinyin: "Měi gè dìfāng de fēngsú dōu bù yīyàng.",    en: "Every place has different customs.",                  th: "ทุกที่มีขนบธรรมเนียมไม่เหมือนกัน",                vi: "Mỗi nơi có phong tục khác nhau.",                       id: "Setiap tempat punya adat yang berbeda." },
  "習慣":       { sentence: "早睡早起是好習慣。",                pinyin: "Zǎo shuì zǎo qǐ shì hǎo xíguàn.",           en: "Going to bed and getting up early is a good habit.", th: "เข้านอนเช้าตื่นเช้าเป็นนิสัยที่ดี",              vi: "Ngủ sớm dậy sớm là thói quen tốt.",                    id: "Tidur cepat dan bangun pagi kebiasaan baik." },
  "道地":       { sentence: "這是道地的台灣味。",                pinyin: "Zhè shì dàodì de Táiwān wèi.",              en: "This is authentic Taiwanese flavor.",                 th: "นี่คือรสชาติแท้ๆ ของไต้หวัน",                    vi: "Đây là hương vị Đài Loan đích thực.",                   id: "Ini cita rasa Taiwan asli." },
  "粥":         { sentence: "早餐我吃粥。",                       pinyin: "Zǎocān wǒ chī zhōu.",                       en: "I eat congee for breakfast.",                         th: "อาหารเช้าฉันกินโจ๊ก",                              vi: "Bữa sáng tôi ăn cháo.",                                 id: "Aku sarapan bubur." },
  "講究":       { sentence: "他對吃很講究。",                    pinyin: "Tā duì chī hěn jiǎngjiù.",                  en: "He's very particular about food.",                    th: "เขาพิถีพิถันเรื่องอาหารมาก",                     vi: "Anh ấy rất kỹ tính về ăn uống.",                        id: "Dia sangat pilih-pilih soal makanan." },
  "頓":         { sentence: "我們吃了一頓好飯。",                pinyin: "Wǒmen chī le yī dùn hǎo fàn.",              en: "We had a great meal.",                                th: "พวกเรากินมื้อดีๆ ไปมื้อหนึ่ง",                    vi: "Chúng tôi đã ăn một bữa ngon.",                         id: "Kami menyantap satu kali makan yang enak." },
  "速度":       { sentence: "他打字的速度很快。",                pinyin: "Tā dǎzì de sùdù hěn kuài.",                 en: "His typing speed is very fast.",                      th: "ความเร็วในการพิมพ์ของเขาเร็วมาก",                vi: "Tốc độ đánh máy của anh ấy rất nhanh.",                 id: "Kecepatan mengetiknya sangat cepat." },
  "窄":         { sentence: "這條巷子很窄。",                    pinyin: "Zhè tiáo xiàngzi hěn zhǎi.",                en: "This alley is very narrow.",                          th: "ตรอกนี้แคบมาก",                                   vi: "Con hẻm này rất hẹp.",                                  id: "Gang ini sangat sempit." },
  "街道":       { sentence: "台南的街道很有特色。",              pinyin: "Táinán de jiēdào hěn yǒu tèsè.",            en: "Tainan's streets are full of character.",            th: "ถนนของไถหนานมีเอกลักษณ์มาก",                     vi: "Đường phố Đài Nam rất có đặc trưng.",                    id: "Jalanan Tainan sangat khas." },
  "蓋":         { sentence: "他們在蓋新的大樓。",                pinyin: "Tāmen zài gài xīn de dàlóu.",               en: "They are building a new tower.",                      th: "พวกเขากำลังสร้างตึกใหม่",                          vi: "Họ đang xây tòa nhà mới.",                              id: "Mereka sedang membangun gedung baru." },
  "待":         { sentence: "下雨了，我想待在家裡。",            pinyin: "Xià yǔ le, wǒ xiǎng dāi zài jiālǐ.",        en: "It's raining; I want to stay home.",                 th: "ฝนตกแล้ว ฉันอยากอยู่บ้าน",                          vi: "Trời mưa rồi, tôi muốn ở nhà.",                          id: "Hujan turun, aku mau tinggal di rumah." },
  "欣賞":       { sentence: "我們欣賞了美麗的夜景。",            pinyin: "Wǒmen xīnshǎng le měilì de yèjǐng.",        en: "We enjoyed the beautiful night view.",                th: "พวกเราชื่นชมวิวกลางคืนที่สวยงาม",                  vi: "Chúng tôi thưởng ngoạn cảnh đêm tuyệt đẹp.",            id: "Kami menikmati pemandangan malam yang indah." },
  "美麗":       { sentence: "這是一個美麗的城市。",              pinyin: "Zhè shì yī gè měilì de chéngshì.",          en: "This is a beautiful city.",                           th: "นี่เป็นเมืองที่สวยงาม",                              vi: "Đây là một thành phố xinh đẹp.",                         id: "Ini kota yang indah." },
  "鈴木":       { sentence: "鈴木先生來自日本。",                pinyin: "Língmù xiānsheng lái zì Rìběn.",            en: "Mr. Suzuki is from Japan.",                           th: "คุณซูซูกิมาจากญี่ปุ่น",                              vi: "Ông Suzuki đến từ Nhật Bản.",                            id: "Pak Suzuki berasal dari Jepang." },
  "赤崁樓":     { sentence: "赤崁樓是台南的古蹟。",              pinyin: "Chìkǎn Lóu shì Táinán de gǔjī.",            en: "Chihkan Tower is a historical site in Tainan.",       th: "หอชื่อข่านเป็นโบราณสถานของไถหนาน",                  vi: "Lầu Xích Khám là di tích cổ ở Đài Nam.",                 id: "Menara Chihkan adalah situs bersejarah di Tainan." },
  "留下來":     { sentence: "這些書是學生留下來的。",            pinyin: "Zhèxiē shū shì xuéshēng liú xià lái de.",   en: "These books were left behind by students.",          th: "หนังสือพวกนี้นักเรียนทิ้งไว้",                       vi: "Những cuốn sách này do học sinh để lại.",                id: "Buku-buku ini ditinggalkan para pelajar." },
  "木造":       { sentence: "這是一座木造房子。",                pinyin: "Zhè shì yī zuò mù zào fángzi.",             en: "This is a wooden house.",                             th: "นี่เป็นบ้านไม้",                                       vi: "Đây là một ngôi nhà bằng gỗ.",                            id: "Ini rumah berbahan kayu." },
  "非去不可":   { sentence: "台南非去不可。",                    pinyin: "Táinán fēi qù bù kě.",                      en: "Tainan is a must-visit.",                             th: "ไถหนานต้องไปให้ได้",                                   vi: "Đài Nam nhất định phải đi.",                              id: "Tainan wajib didatangi." },
};

interface Item {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  note?: string;
  example?: { sentence?: string; sentencePinyin?: string; sentenceTh?: string };
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string; translations?: Record<string, string> }>;
  mnemonic?: string;
  usageNote?: string;
}

async function fillExamples(lessonCode: string, exMap: Record<string, Ex>) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { type?: string; heading?: string; items?: Item[] } | null;
  if (!content?.items) return 0;

  let filled = 0;
  const updated: Item[] = content.items.map((item) => {
    const ex = exMap[item.hanzi];
    if (!ex) return item;
    if (item.examples && item.examples.length > 0 && item.examples[0]?.translations?.en) {
      return item; // already filled
    }
    filled++;
    return {
      ...item,
      examples: [{
        sentence: ex.sentence,
        pinyin: ex.pinyin,
        translation: ex.th,
        translations: { en: ex.en, th: ex.th, vi: ex.vi, id: ex.id },
      }],
    };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: updated } as object },
  });
  console.log(`  ✅ ${lessonCode}: filled ${filled} / ${content.items.length} (en+th+vi+id)`);
  return filled;
}

async function main() {
  console.log("=== Enriching Chapter 4 with multi-language examples ===\n");
  const a = await fillExamples("MS-C4-VOCAB-1", V1);
  const b = await fillExamples("MS-C4-VOCAB-2", V2);
  console.log(`\n🎉 Total filled: ${a + b} examples × 4 langs = ${(a + b) * 4} translations`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
