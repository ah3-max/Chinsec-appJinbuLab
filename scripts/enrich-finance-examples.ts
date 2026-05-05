/**
 * Add example sentences to every AAY-FINANCE vocab word (all 14 categories).
 * One short example each, eldercare-finance context, originally written.
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

interface Ex { sentence: string; pinyin: string; translation: string }

// One example per word. Pinyin written without strict accent in some cases for brevity.
const EXAMPLES: Record<string, Ex> = {
  // ─── f01-org (7) ──────────────────────────────────────────────────────────
  "財團法人":           { sentence: "本院是非營利的財團法人。",      pinyin: "Běn yuàn shì fēi yínglì de cáituán fǎrén.",       translation: "ที่นี่เป็นมูลนิธิไม่แสวงหาผลกำไร" },
  "臺北市私立愛愛院":   { sentence: "我在臺北市私立愛愛院工作。",   pinyin: "Wǒ zài Táiběi shì sīlì Àiʼài yuàn gōngzuò.",      translation: "ฉันทำงานที่บ้านพักคนชราอ้ายอ้ายเอกชนเมืองไทเป" },
  "院本部":             { sentence: "院本部在三樓。",                pinyin: "Yuàn běnbù zài sān lóu.",                          translation: "สำนักงานใหญ่อยู่ชั้น 3" },
  "東明":               { sentence: "東明分院有 50 位住民。",         pinyin: "Dōngmíng fēnyuàn yǒu wǔshí wèi zhùmín.",          translation: "สาขาตงหมิงมีผู้พักอาศัย 50 คน" },
  "愛力勇":             { sentence: "愛力勇提供日照服務。",          pinyin: "Àilìyǒng tígōng rìzhào fúwù.",                     translation: "อ้ายลี่หย่งให้บริการดูแลกลางวัน" },
  "A單位":              { sentence: "A單位照顧失智長輩。",           pinyin: "A dānwèi zhàogù shīzhì zhǎngbèi.",                 translation: "หน่วย A ดูแลผู้สูงอายุภาวะสมองเสื่อม" },
  "日照中心":           { sentence: "日照中心每天開放。",            pinyin: "Rìzhào zhōngxīn měitiān kāifàng.",                 translation: "ศูนย์ดูแลกลางวันเปิดทุกวัน" },

  // ─── f02-report (6) ───────────────────────────────────────────────────────
  "收支表":             { sentence: "請看本月的收支表。",            pinyin: "Qǐng kàn běn yuè de shōuzhī biǎo.",                translation: "กรุณาดูงบรายรับรายจ่ายเดือนนี้" },
  "收支餘絀表":         { sentence: "收支餘絀表顯示有盈餘。",        pinyin: "Shōuzhī yúchù biǎo xiǎnshì yǒu yíngyú.",            translation: "งบกำไรขาดทุนแสดงว่ามีกำไร" },
  "全年度收支餘絀表":   { sentence: "全年度收支餘絀表年底公布。",   pinyin: "Quán niándù shōuzhī yúchù biǎo niándǐ gōngbù.",    translation: "งบประจำปีจะประกาศเมื่อสิ้นปี" },
  "合併":               { sentence: "兩個分院的數字要合併。",        pinyin: "Liǎng ge fēnyuàn de shùzì yào hébìng.",            translation: "ตัวเลขของสองสาขาต้องรวมกัน" },
  "初版":               { sentence: "這是初版,還會修改。",           pinyin: "Zhè shì chū bǎn, hái huì xiūgǎi.",                  translation: "นี่คือฉบับร่าง ยังต้องแก้ไข" },
  "單位：元":           { sentence: "金額單位：元。",                 pinyin: "Jīn'é dānwèi: yuán.",                                translation: "หน่วยจำนวนเงิน: หยวน" },

  // ─── f03-period (8) ───────────────────────────────────────────────────────
  "科目編號":           { sentence: "科目編號是 4101。",              pinyin: "Kēmù biānhào shì sì-yī-líng-yī.",                  translation: "หมายเลขรหัสบัญชีคือ 4101" },
  "項目":               { sentence: "請填寫每個項目。",              pinyin: "Qǐng tiánxiě měi ge xiàngmù.",                      translation: "กรุณากรอกข้อมูลแต่ละหัวข้อ" },
  "01期":               { sentence: "01期的數字是這樣。",             pinyin: "Líng-yī qí de shùzì shì zhèyàng.",                 translation: "ตัวเลขของงวด 1 เป็นแบบนี้" },
  "02期":               { sentence: "02期還沒結算。",                pinyin: "Líng-èr qí hái méi jiésuàn.",                       translation: "งวด 2 ยังไม่ได้สรุป" },
  "03期":               { sentence: "03期的報表完成了。",             pinyin: "Líng-sān qí de bàobiǎo wánchéng le.",              translation: "รายงานงวด 3 เสร็จแล้ว" },
  "合計":               { sentence: "請填合計金額。",                pinyin: "Qǐng tián héjì jīn'é.",                              translation: "กรุณากรอกยอดรวม" },
  "小計":               { sentence: "這一欄是小計。",                pinyin: "Zhè yì lán shì xiǎojì.",                             translation: "คอลัมน์นี้เป็นยอดย่อย" },
  "總額":               { sentence: "總額是十萬元。",                pinyin: "Zǒng'é shì shí wàn yuán.",                            translation: "ยอดรวมคือหนึ่งแสนหยวน" },

  // ─── f04-income (23) ──────────────────────────────────────────────────────
  "收入":               { sentence: "本月收入比上月多。",            pinyin: "Běn yuè shōurù bǐ shàng yuè duō.",                  translation: "รายรับเดือนนี้มากกว่าเดือนที่แล้ว" },
  "收入合計":           { sentence: "收入合計是 50 萬。",             pinyin: "Shōurù héjì shì wǔshí wàn.",                          translation: "รายรับรวม 500,000 หยวน" },
  "政府補助款":         { sentence: "政府補助款下個月撥付。",        pinyin: "Zhèngfǔ bǔzhù kuǎn xià ge yuè bōfù.",              translation: "เงินอุดหนุนจากรัฐบาลจะโอนเดือนหน้า" },
  "社會局補助款":       { sentence: "社會局補助款增加了。",          pinyin: "Shèhuìjú bǔzhù kuǎn zēngjiā le.",                    translation: "เงินอุดหนุนจากกรมประชาสงเคราะห์เพิ่มขึ้น" },
  "衛福部補助款":       { sentence: "衛福部補助款是主要收入。",      pinyin: "Wèifúbù bǔzhù kuǎn shì zhǔyào shōurù.",            translation: "เงินอุดหนุนจากกระทรวงสาธารณสุขเป็นรายรับหลัก" },
  "加菜金補助":         { sentence: "節慶時有加菜金補助。",          pinyin: "Jiéqìng shí yǒu jiācài jīn bǔzhù.",                  translation: "ช่วงเทศกาลมีเงินสนับสนุนค่าอาหารพิเศษ" },
  "特別處遇費":         { sentence: "特別處遇費用於高需求住民。",    pinyin: "Tèbié chǔyù fèi yòng yú gāo xūqiú zhùmín.",        translation: "ค่าดูแลพิเศษใช้กับผู้พักอาศัยที่ต้องการการดูแลสูง" },
  "專業服務人員補助":   { sentence: "我們申請了專業服務人員補助。", pinyin: "Wǒmen shēnqǐng le zhuānyè fúwù rényuán bǔzhù.",    translation: "เราขอเงินอุดหนุนบุคลากรวิชาชีพแล้ว" },
  "其他補助收入":       { sentence: "其他補助收入很少。",            pinyin: "Qítā bǔzhù shōurù hěn shǎo.",                       translation: "เงินอุดหนุนอื่นๆ มีน้อย" },
  "捐款收入":           { sentence: "捐款收入要記錄清楚。",          pinyin: "Juānkuǎn shōurù yào jìlù qīngchǔ.",                  translation: "รายได้จากเงินบริจาคต้องบันทึกให้ชัดเจน" },
  "一般捐款":           { sentence: "一般捐款用於日常開支。",        pinyin: "Yìbān juānkuǎn yòng yú rìcháng kāizhī.",            translation: "เงินบริจาคทั่วไปใช้กับค่าใช้จ่ายประจำวัน" },
  "勸募捐款":           { sentence: "我們舉辦勸募捐款活動。",        pinyin: "Wǒmen jǔbàn quànmù juānkuǎn huódòng.",              translation: "เราจัดกิจกรรมระดมทุนบริจาค" },
  "實物捐贈":           { sentence: "感謝實物捐贈的米跟油。",        pinyin: "Gǎnxiè shíwù juānzèng de mǐ gēn yóu.",              translation: "ขอบคุณการบริจาคข้าวและน้ำมัน" },
  "安養護收入":         { sentence: "安養護收入是月費。",            pinyin: "Ānyǎnghù shōurù shì yuèfèi.",                        translation: "รายได้จากการดูแลคือค่าธรรมเนียมรายเดือน" },
  "安養護月費收入":     { sentence: "安養護月費收入按月計算。",      pinyin: "Ānyǎnghù yuèfèi shōurù àn yuè jìsuàn.",            translation: "รายได้ค่าธรรมเนียมรายเดือนคิดทุกเดือน" },
  "安養護耗材收入":     { sentence: "安養護耗材收入包含尿布。",      pinyin: "Ānyǎnghù hàocái shōurù bāohán niàobù.",            translation: "รายได้ค่าวัสดุสิ้นเปลืองรวมผ้าอ้อม" },
  "愛心扶助":           { sentence: "愛心扶助來自善心人士。",        pinyin: "Àixīn fúzhù láizì shànxīn rénshì.",                  translation: "เงินช่วยเหลือมาจากผู้ใจบุญ" },
  "日照收入":           { sentence: "日照收入持續成長。",            pinyin: "Rìzhào shōurù chíxù chéngzhǎng.",                    translation: "รายได้บริการกลางวันโตต่อเนื่อง" },
  "日照服務收入":       { sentence: "日照服務收入按人次計算。",      pinyin: "Rìzhào fúwù shōurù àn réncì jìsuàn.",                translation: "รายได้บริการกลางวันคิดตามจำนวนครั้ง" },
  "A單位服務收入":      { sentence: "A單位服務收入計算到月底。",     pinyin: "A dānwèi fúwù shōurù jìsuàn dào yuèdǐ.",            translation: "รายได้บริการของหน่วย A คิดถึงสิ้นเดือน" },
  "利息收入":           { sentence: "存款利息收入很少。",            pinyin: "Cúnkuǎn lìxí shōurù hěn shǎo.",                      translation: "รายได้ดอกเบี้ยเงินฝากน้อย" },
  "其他收入":           { sentence: "其他收入是零星項目。",          pinyin: "Qítā shōurù shì língxīng xiàngmù.",                  translation: "รายได้อื่นๆ เป็นรายการเบ็ดเตล็ด" },
  "其他雜項收入":       { sentence: "其他雜項收入要分類。",          pinyin: "Qítā záxiàng shōurù yào fēnlèi.",                    translation: "รายได้เบ็ดเตล็ดอื่นๆ ต้องจำแนก" },
  "優免":               { sentence: "本月有優免項目。",              pinyin: "Běn yuè yǒu yōumiǎn xiàngmù.",                       translation: "เดือนนี้มีรายการลดหย่อน" },

  // ─── f05-personnel (14) ───────────────────────────────────────────────────
  "支出":               { sentence: "本月支出多了。",                pinyin: "Běn yuè zhīchū duō le.",                              translation: "รายจ่ายเดือนนี้มากขึ้น" },
  "支出總額":           { sentence: "支出總額不能超過預算。",        pinyin: "Zhīchū zǒng'é bù néng chāoguò yùsuàn.",            translation: "รายจ่ายรวมห้ามเกินงบประมาณ" },
  "人事費":             { sentence: "人事費是最大的支出。",          pinyin: "Rénshì fèi shì zuì dà de zhīchū.",                    translation: "ค่าบุคลากรเป็นรายจ่ายที่ใหญ่ที่สุด" },
  "人事費-1":           { sentence: "人事費-1包含全職員工。",        pinyin: "Rénshì fèi yī bāohán quánzhí yuángōng.",            translation: "ค่าบุคลากร-1 รวมพนักงานเต็มเวลา" },
  "人事費-2":           { sentence: "人事費-2是兼職人員。",          pinyin: "Rénshì fèi èr shì jiānzhí rényuán.",                  translation: "ค่าบุคลากร-2 คือพนักงานบางเวลา" },
  "薪資":               { sentence: "薪資每月底發放。",              pinyin: "Xīnzī měi yuèdǐ fāfàng.",                            translation: "เงินเดือนจ่ายทุกสิ้นเดือน" },
  "薪資支出-應稅":      { sentence: "薪資支出-應稅要報所得稅。",     pinyin: "Xīnzī zhīchū yìngshuì yào bào suǒdéshuì.",          translation: "เงินเดือนต้องเสียภาษีต้องยื่นภาษีรายได้" },
  "薪資支出-免稅":      { sentence: "薪資支出-免稅不需扣稅。",       pinyin: "Xīnzī zhīchū miǎnshuì bù xū kòushuì.",              translation: "เงินเดือนยกเว้นภาษีไม่ต้องหักภาษี" },
  "伙食津貼":           { sentence: "我們有伙食津貼。",              pinyin: "Wǒmen yǒu huǒshí jīntiē.",                            translation: "เรามีเบี้ยเลี้ยงค่าอาหาร" },
  "加班費":             { sentence: "假日加班費較高。",              pinyin: "Jiàrì jiābān fèi jiào gāo.",                          translation: "ค่าล่วงเวลาวันหยุดสูงกว่า" },
  "加班費-免稅":        { sentence: "加班費-免稅有限額。",           pinyin: "Jiābān fèi miǎnshuì yǒu xiàn'é.",                    translation: "ค่าล่วงเวลายกเว้นภาษีมีขีดจำกัด" },
  "職工福利":           { sentence: "職工福利包含體檢。",            pinyin: "Zhígōng fúlì bāohán tǐjiǎn.",                        translation: "สวัสดิการพนักงานรวมการตรวจสุขภาพ" },
  "訓練費":             { sentence: "訓練費用於員工進修。",          pinyin: "Xùnliàn fèi yòng yú yuángōng jìnxiū.",                translation: "ค่าฝึกอบรมใช้เพื่อการพัฒนาพนักงาน" },
  "外勞就業安定費":     { sentence: "外勞就業安定費要按月繳。",      pinyin: "Wàiláo jiùyè āndìng fèi yào àn yuè jiǎo.",          translation: "ค่าธรรมเนียมเสถียรภาพแรงงานต่างชาติต้องจ่ายรายเดือน" },

  // ─── f06-operating (24) ───────────────────────────────────────────────────
  "事務費":             { sentence: "事務費包含文具用品。",          pinyin: "Shìwù fèi bāohán wénjù yòngpǐn.",                    translation: "ค่าสำนักงานรวมเครื่องเขียน" },
  "交通費":             { sentence: "交通費要拿單據。",              pinyin: "Jiāotōng fèi yào ná dānjù.",                          translation: "ค่าเดินทางต้องมีใบเสร็จ" },
  "文具用品":           { sentence: "文具用品在櫃子裡。",            pinyin: "Wénjù yòngpǐn zài guìzi lǐ.",                        translation: "เครื่องเขียนอยู่ในตู้" },
  "印刷費":             { sentence: "印刷費這個月很多。",            pinyin: "Yìnshuā fèi zhè ge yuè hěn duō.",                    translation: "ค่าพิมพ์เดือนนี้มาก" },
  "運費":               { sentence: "貨物的運費已付。",              pinyin: "Huòwù de yùnfèi yǐ fù.",                              translation: "ค่าขนส่งสินค้าจ่ายแล้ว" },
  "郵電費":             { sentence: "郵電費包含網路費。",            pinyin: "Yóudiàn fèi bāohán wǎnglù fèi.",                      translation: "ค่าไปรษณีย์โทรศัพท์รวมค่าอินเทอร์เน็ต" },
  "交際費":             { sentence: "交際費要嚴格控管。",            pinyin: "Jiāojì fèi yào yángé kòngguǎn.",                      translation: "ค่ารับรองต้องควบคุมเข้มงวด" },
  "書報雜誌":           { sentence: "圖書館訂了書報雜誌。",          pinyin: "Túshūguǎn dìng le shūbào zázhì.",                    translation: "ห้องสมุดสั่งหนังสือพิมพ์และนิตยสาร" },
  "水費":               { sentence: "夏天水費比較貴。",              pinyin: "Xiàtiān shuǐfèi bǐjiào guì.",                        translation: "ค่าน้ำหน้าร้อนแพงกว่า" },
  "電費":               { sentence: "冷氣讓電費變高。",              pinyin: "Lěngqì ràng diànfèi biàn gāo.",                      translation: "เครื่องปรับอากาศทำให้ค่าไฟสูง" },
  "瓦斯費":             { sentence: "瓦斯費按使用量計算。",          pinyin: "Wǎsī fèi àn shǐyòngliàng jìsuàn.",                    translation: "ค่าก๊าซคิดตามปริมาณที่ใช้" },
  "租金支出":           { sentence: "東明分院的租金支出。",          pinyin: "Dōngmíng fēnyuàn de zūjīn zhīchū.",                  translation: "ค่าเช่าของสาขาตงหมิง" },
  "稅捐":               { sentence: "稅捐要按時繳納。",              pinyin: "Shuìjuān yào àn shí jiǎonà.",                        translation: "ภาษีต้องจ่ายตรงเวลา" },
  "團體會費":           { sentence: "公會的團體會費每年繳。",        pinyin: "Gōnghuì de tuántǐ huìfèi měi nián jiǎo.",            translation: "ค่าสมาชิกสมาคมจ่ายทุกปี" },
  "募款活動支出":       { sentence: "募款活動支出包含場地費。",      pinyin: "Mùkuǎn huódòng zhīchū bāohán chǎngdì fèi.",        translation: "ค่าใช้จ่ายกิจกรรมระดมทุนรวมค่าสถานที่" },
  "設施器具費":         { sentence: "設施器具費用於採購。",          pinyin: "Shèshī qìjù fèi yòng yú cǎigòu.",                    translation: "ค่าอุปกรณ์สิ่งอำนวยความสะดวกใช้ในการจัดซื้อ" },
  "雜項購置":           { sentence: "雜項購置要編列預算。",          pinyin: "Záxiàng gòuzhì yào biānliè yùsuàn.",                  translation: "การจัดซื้อเบ็ดเตล็ดต้องจัดทำงบประมาณ" },
  "維護費":             { sentence: "電梯的維護費每月支付。",        pinyin: "Diàntī de wéihù fèi měi yuè zhīfù.",                  translation: "ค่าบำรุงรักษาลิฟต์จ่ายรายเดือน" },
  "修繕費":             { sentence: "屋頂漏水的修繕費很貴。",        pinyin: "Wūdǐng lòushuǐ de xiūshàn fèi hěn guì.",            translation: "ค่าซ่อมหลังคารั่วแพงมาก" },
  "院舍修繕費":         { sentence: "院舍修繕費由總院支付。",        pinyin: "Yuànshè xiūshàn fèi yóu zǒngyuàn zhīfù.",            translation: "ค่าซ่อมแซมอาคารโดยสำนักงานใหญ่จ่าย" },
  "公共安全費":         { sentence: "公共安全費包含消防檢查。",      pinyin: "Gōnggòng ānquán fèi bāohán xiāofáng jiǎnchá.",      translation: "ค่าความปลอดภัยรวมการตรวจสอบดับเพลิง" },
  "折舊":               { sentence: "電腦的折舊年限是 5 年。",        pinyin: "Diànnǎo de zhéjiù niánxiàn shì wǔ nián.",            translation: "อายุค่าเสื่อมของคอมพิวเตอร์คือ 5 ปี" },
  "各項耗竭及攤提":     { sentence: "各項耗竭及攤提要分年計算。",   pinyin: "Gè xiàng hàojié jí tāntí yào fēn nián jìsuàn.",    translation: "การหักค่าเสื่อมทุกรายการต้องคิดเป็นรายปี" },

  // ─── f07-insurance (6) ────────────────────────────────────────────────────
  "保險退休金":         { sentence: "保險退休金每月提撥。",          pinyin: "Bǎoxiǎn tuìxiūjīn měi yuè tíbō.",                    translation: "เงินเกษียณประกันโอนทุกเดือน" },
  "勞健保":             { sentence: "勞健保是法定保險。",            pinyin: "Láojiànbǎo shì fǎdìng bǎoxiǎn.",                      translation: "ประกันแรงงานสุขภาพเป็นประกันตามกฎหมาย" },
  "勞工退休金":         { sentence: "勞工退休金每月 6%。",            pinyin: "Láogōng tuìxiūjīn měi yuè bǎi fēn zhī liù.",        translation: "เงินบำนาญแรงงานรายเดือน 6%" },
  "保險費":             { sentence: "員工保險費由機構負擔一半。",    pinyin: "Yuángōng bǎoxiǎn fèi yóu jīgòu fùdān yībàn.",      translation: "ค่าประกันพนักงานสถาบันรับครึ่งหนึ่ง" },
  "其他成本":           { sentence: "其他成本要詳細說明。",          pinyin: "Qítā chéngběn yào xiángxì shuōmíng.",                  translation: "ต้นทุนอื่นๆ ต้องอธิบายโดยละเอียด" },
  "雜項支出":           { sentence: "雜項支出要附單據。",            pinyin: "Záxiàng zhīchū yào fù dānjù.",                        translation: "รายจ่ายเบ็ดเตล็ดต้องแนบใบเสร็จ" },

  // ─── f08-material (14) ────────────────────────────────────────────────────
  "業務費":             { sentence: "業務費用於日常營運。",          pinyin: "Yèwù fèi yòng yú rìcháng yíngyùn.",                  translation: "ค่าดำเนินงานใช้ในการบริหารประจำวัน" },
  "住民活動費":         { sentence: "住民活動費辦慶生會。",          pinyin: "Zhùmín huódòng fèi bàn qìngshēng huì.",              translation: "ค่ากิจกรรมผู้พักใช้จัดงานวันเกิด" },
  "住民交通費":         { sentence: "住民交通費包含復康巴士。",      pinyin: "Zhùmín jiāotōng fèi bāohán fùkāng bāshì.",          translation: "ค่าเดินทางผู้พักรวมรถบัสฟื้นฟู" },
  "材料費":             { sentence: "活動的材料費要報帳。",          pinyin: "Huódòng de cáiliào fèi yào bàozhàng.",              translation: "ค่าวัสดุกิจกรรมต้องเบิก" },
  "主副食費":           { sentence: "主副食費按月結算。",            pinyin: "Zhǔ fùshí fèi àn yuè jiésuàn.",                      translation: "ค่าอาหารหลักและรองคิดรายเดือน" },
  "被服費":             { sentence: "被服費包含床單。",              pinyin: "Bèifú fèi bāohán chuángdān.",                          translation: "ค่าผ้าปูที่นอนรวมผ้าปูเตียง" },
  "住民用品費":         { sentence: "住民用品費包含日用品。",        pinyin: "Zhùmín yòngpǐn fèi bāohán rìyòngpǐn.",              translation: "ค่าของใช้ผู้พักรวมของใช้ประจำวัน" },
  "住民醫藥保健費":     { sentence: "住民醫藥保健費要記錄。",        pinyin: "Zhùmín yīyào bǎojiàn fèi yào jìlù.",                  translation: "ค่ายาและสุขภาพผู้พักต้องบันทึก" },
  "住民就醫門診費":     { sentence: "住民就醫門診費依次申報。",      pinyin: "Zhùmín jiùyī ménzhěn fèi yīcì shēnbào.",            translation: "ค่ารักษาพยาบาลผู้พักยื่นทีละครั้ง" },
  "醫療耗材":           { sentence: "醫療耗材每週訂購。",            pinyin: "Yīliáo hàocái měi zhōu dìnggòu.",                    translation: "วัสดุการแพทย์สั่งซื้อทุกสัปดาห์" },
  "消耗品費":           { sentence: "消耗品費要分類記帳。",          pinyin: "Xiāohàopǐn fèi yào fēnlèi jìzhàng.",                  translation: "ค่าวัสดุสิ้นเปลืองต้องลงบัญชีแยกประเภท" },
  "一般耗材":           { sentence: "一般耗材包含衛生紙。",          pinyin: "Yìbān hàocái bāohán wèishēngzhǐ.",                    translation: "วัสดุสิ้นเปลืองทั่วไปรวมกระดาษทิชชู่" },
  "住民營養品":         { sentence: "住民營養品由醫師建議。",        pinyin: "Zhùmín yíngyǎngpǐn yóu yīshī jiànyì.",                translation: "อาหารเสริมผู้พักโดยแพทย์แนะนำ" },
  "清潔用品":           { sentence: "清潔用品在儲物間。",            pinyin: "Qīngjié yòngpǐn zài chǔwù jiān.",                    translation: "ของทำความสะอาดอยู่ห้องเก็บของ" },

  // ─── f09-admin (6) ────────────────────────────────────────────────────────
  "行政管理支出":       { sentence: "行政管理支出佔 10%。",          pinyin: "Xíngzhèng guǎnlǐ zhīchū zhàn bǎi fēn zhī shí.",     translation: "ค่าใช้จ่ายบริหารคิดเป็น 10%" },
  "目的事業支出":       { sentence: "目的事業支出是核心業務。",      pinyin: "Mùdì shìyè zhīchū shì héxīn yèwù.",                  translation: "รายจ่ายภารกิจหลักคือธุรกิจหลัก" },
  "行政作業費":         { sentence: "行政作業費按月攤提。",          pinyin: "Xíngzhèng zuòyè fèi àn yuè tāntí.",                  translation: "ค่าธุรการดำเนินงานหักทุกเดือน" },
  "兼任行政總務費":     { sentence: "兼任行政總務費要分攤。",        pinyin: "Jiānrèn xíngzhèng zǒngwù fèi yào fēntān.",          translation: "ค่าธุรการชั่วคราวต้องเฉลี่ย" },
  "事務器材分攤費":     { sentence: "事務器材分攤費共三個單位。",   pinyin: "Shìwù qìcái fēntān fèi gòng sān ge dānwèi.",        translation: "ค่าอุปกรณ์สำนักงานเฉลี่ยให้ 3 หน่วย" },
  "分攤":               { sentence: "費用要按比例分攤。",            pinyin: "Fèiyòng yào àn bǐlì fēntān.",                          translation: "ค่าใช้จ่ายต้องเฉลี่ยตามสัดส่วน" },

  // ─── f10-profit (11) ──────────────────────────────────────────────────────
  "餘絀":               { sentence: "本月餘絀為正數。",              pinyin: "Běn yuè yúchù wéi zhèngshù.",                          translation: "กำไรขาดทุนเดือนนี้เป็นบวก" },
  "本期餘(絀)":         { sentence: "本期餘(絀)是 5 萬。",            pinyin: "Běn qí yú-chù shì wǔ wàn.",                            translation: "กำไรขาดทุนงวดนี้คือ 50,000" },
  "本期餘絀":           { sentence: "本期餘絀請仔細核對。",          pinyin: "Běn qí yúchù qǐng zǐxì héduì.",                      translation: "กำไรขาดทุนงวดนี้กรุณาตรวจสอบให้ละเอียด" },
  "盈餘":               { sentence: "今年有盈餘。",                  pinyin: "Jīnnián yǒu yíngyú.",                                  translation: "ปีนี้มีกำไร" },
  "虧損":               { sentence: "去年小幅虧損。",                pinyin: "Qùnián xiǎofú kuīsǔn.",                                translation: "ปีที่แล้วขาดทุนเล็กน้อย" },
  "支出率":             { sentence: "支出率不可超過 90%。",          pinyin: "Zhīchū lǜ bù kě chāoguò bǎi fēn zhī jiǔshí.",      translation: "อัตราส่วนรายจ่ายไม่เกิน 90%" },
  "餘絀率":             { sentence: "餘絀率反映財務健康。",          pinyin: "Yúchù lǜ fǎnyìng cáiwù jiànkāng.",                    translation: "อัตรากำไรขาดทุนสะท้อนสุขภาพการเงิน" },
  "預算":               { sentence: "請按預算控管支出。",            pinyin: "Qǐng àn yùsuàn kòngguǎn zhīchū.",                    translation: "กรุณาควบคุมรายจ่ายตามงบประมาณ" },
  "預估":               { sentence: "明年預估收入。",                pinyin: "Míngnián yùgū shōurù.",                                translation: "ประมาณการรายรับปีหน้า" },
  "暫估":               { sentence: "這個數字是暫估的。",            pinyin: "Zhè ge shùzì shì zàngū de.",                          translation: "ตัวเลขนี้เป็นการประมาณชั่วคราว" },
  "精準收入":           { sentence: "精準收入由系統計算。",          pinyin: "Jīngzhǔn shōurù yóu xìtǒng jìsuàn.",                  translation: "รายรับที่แม่นยำคำนวณโดยระบบ" },

  // ─── f11-deprec (28) ──────────────────────────────────────────────────────
  "資產編號":           { sentence: "資產編號是 A001。",              pinyin: "Zīchǎn biānhào shì A líng-líng-yī.",                 translation: "หมายเลขทรัพย์สินคือ A001" },
  "資產名稱":           { sentence: "請填寫資產名稱。",              pinyin: "Qǐng tiánxiě zīchǎn míngchēng.",                      translation: "กรุณากรอกชื่อทรัพย์สิน" },
  "資產規格":           { sentence: "請註明資產規格。",              pinyin: "Qǐng zhùmíng zīchǎn guīgé.",                          translation: "กรุณาระบุข้อมูลจำเพาะของทรัพย์สิน" },
  "管理區分":           { sentence: "管理區分有兩種。",              pinyin: "Guǎnlǐ qūfēn yǒu liǎng zhǒng.",                       translation: "การจำแนกประเภทการจัดการมี 2 ประเภท" },
  "型態":               { sentence: "請選擇資產型態。",              pinyin: "Qǐng xuǎnzé zīchǎn xíngtài.",                        translation: "กรุณาเลือกประเภททรัพย์สิน" },
  "主件":               { sentence: "電腦是主件,滑鼠是配件。",      pinyin: "Diànnǎo shì zhǔjiàn, huáshǔ shì pèijiàn.",          translation: "คอมพิวเตอร์เป็นชิ้นหลัก เมาส์เป็นอุปกรณ์เสริม" },
  "主件編號":           { sentence: "主件編號要連結配件。",          pinyin: "Zhǔjiàn biānhào yào liánjié pèijiàn.",                translation: "หมายเลขชิ้นหลักต้องเชื่อมโยงอุปกรณ์เสริม" },
  "取得日期":           { sentence: "取得日期是 2024-01-15。",        pinyin: "Qǔdé rìqí shì èr-líng-èr-sì-líng-yī-yī-wǔ.",        translation: "วันที่ได้มาคือ 2024-01-15" },
  "取得成本":           { sentence: "取得成本是十萬元。",            pinyin: "Qǔdé chéngběn shì shí wàn yuán.",                    translation: "ต้นทุนที่ได้มาคือ 100,000 หยวน" },
  "原幣取得成本":       { sentence: "原幣取得成本是美金 3000。",     pinyin: "Yuán bì qǔdé chéngběn shì měijīn sān qiān.",        translation: "ต้นทุนสกุลเงินเดิมคือ USD 3000" },
  "銷帳日期":           { sentence: "銷帳日期是去年底。",            pinyin: "Xiāozhàng rìqí shì qùnián dǐ.",                      translation: "วันที่ตัดบัญชีคือสิ้นปีที่แล้ว" },
  "開始提列":           { sentence: "開始提列折舊的日期。",          pinyin: "Kāishǐ tíliè zhéjiù de rìqí.",                        translation: "วันที่เริ่มหักค่าเสื่อม" },
  "折舊方法":           { sentence: "折舊方法用平均法。",            pinyin: "Zhéjiù fāngfǎ yòng píngjūn fǎ.",                      translation: "วิธีค่าเสื่อมใช้วิธีเส้นตรง" },
  "平均法":             { sentence: "我們採用平均法折舊。",          pinyin: "Wǒmen cǎiyòng píngjūn fǎ zhéjiù.",                    translation: "เราใช้วิธีค่าเสื่อมแบบเส้นตรง" },
  "耐用年限":           { sentence: "電腦的耐用年限是 5 年。",        pinyin: "Diànnǎo de nàiyòng niánxiàn shì wǔ nián.",            translation: "อายุการใช้งานคอมพิวเตอร์คือ 5 ปี" },
  "未用年限":           { sentence: "未用年限剩 2 年。",              pinyin: "Wèiyòng niánxiàn shèng liǎng nián.",                    translation: "อายุการใช้งานเหลืออีก 2 ปี" },
  "預留殘值":           { sentence: "預留殘值是 5%。",                pinyin: "Yùliú cánzhí shì bǎi fēn zhī wǔ.",                    translation: "มูลค่าซากที่กันไว้คือ 5%" },
  "資產價值":           { sentence: "資產價值要評估。",              pinyin: "Zīchǎn jiàzhí yào pínggū.",                            translation: "มูลค่าทรัพย์สินต้องประเมิน" },
  "本期提列折舊":       { sentence: "本期提列折舊是 5000 元。",      pinyin: "Běn qí tíliè zhéjiù shì wǔ qiān yuán.",              translation: "ค่าเสื่อมงวดนี้คือ 5,000 หยวน" },
  "累積折舊":           { sentence: "累積折舊三萬元。",              pinyin: "Lěijī zhéjiù sān wàn yuán.",                          translation: "ค่าเสื่อมสะสม 30,000 หยวน" },
  "帳面價值":           { sentence: "帳面價值是七萬元。",            pinyin: "Zhàngmiàn jiàzhí shì qī wàn yuán.",                  translation: "มูลค่าตามบัญชีคือ 70,000 หยวน" },
  "折舊分攤方式":       { sentence: "折舊分攤方式按部門。",          pinyin: "Zhéjiù fēntān fāngshì àn bùmén.",                    translation: "วิธีเฉลี่ยค่าเสื่อมตามแผนก" },
  "依保管部門":         { sentence: "依保管部門分攤折舊。",          pinyin: "Yī bǎoguǎn bùmén fēntān zhéjiù.",                    translation: "เฉลี่ยค่าเสื่อมตามแผนกผู้รับผิดชอบ" },
  "續提殘值":           { sentence: "續提殘值要重新計算。",          pinyin: "Xù tí cánzhí yào chóngxīn jìsuàn.",                  translation: "มูลค่าซากต่อต้องคำนวณใหม่" },
  "續提耐用月數":       { sentence: "續提耐用月數延長 24 個月。",     pinyin: "Xù tí nàiyòng yuè shù yáncháng èrshísì ge yuè.",     translation: "เดือนที่ใช้ต่อขยาย 24 เดือน" },
  "數量":               { sentence: "數量請填整數。",                pinyin: "Shùliàng qǐng tián zhěngshù.",                        translation: "จำนวนกรุณากรอกเลขจำนวนเต็ม" },
  "單位":               { sentence: "單位是「台」。",                pinyin: "Dānwèi shì 'tái'.",                                    translation: "หน่วยคือ 'เครื่อง'" },
  "備註":               { sentence: "請寫備註。",                    pinyin: "Qǐng xiě bèizhù.",                                      translation: "กรุณาเขียนหมายเหตุ" },

  // ─── f12-measure (9) ──────────────────────────────────────────────────────
  "式":                 { sentence: "印表機 1 式。",                  pinyin: "Yìnbiǎojī yí shì.",                                    translation: "เครื่องพิมพ์ 1 ชุด" },
  "組":                 { sentence: "桌椅一組。",                    pinyin: "Zhuō yǐ yì zǔ.",                                        translation: "ชุดโต๊ะเก้าอี้ 1 ชุด" },
  "套":                 { sentence: "床組一套。",                    pinyin: "Chuáng zǔ yí tào.",                                    translation: "เซ็ตเตียง 1 ชุด" },
  "台":                 { sentence: "電視 3 台。",                    pinyin: "Diànshì sān tái.",                                      translation: "ทีวี 3 เครื่อง" },
  "輛":                 { sentence: "復康巴士兩輛。",                pinyin: "Fùkāng bāshì liǎng liàng.",                            translation: "รถบัสฟื้นฟู 2 คัน" },
  "個":                 { sentence: "椅子十個。",                    pinyin: "Yǐzi shí ge.",                                          translation: "เก้าอี้ 10 ตัว" },
  "張":                 { sentence: "床 5 張。",                      pinyin: "Chuáng wǔ zhāng.",                                      translation: "เตียง 5 หลัง" },
  "萬":                 { sentence: "十萬元。",                      pinyin: "Shí wàn yuán.",                                          translation: "หนึ่งแสนหยวน" },
  "元":                 { sentence: "一千元。",                      pinyin: "Yì qiān yuán.",                                          translation: "หนึ่งพันหยวน" },

  // ─── f13-asset (33) ───────────────────────────────────────────────────────
  "裝修工程":           { sentence: "新房間的裝修工程完成了。",      pinyin: "Xīn fángjiān de zhuāngxiū gōngchéng wánchéng le.", translation: "การตกแต่งห้องใหม่เสร็จแล้ว" },
  "資訊系統":           { sentence: "資訊系統升級了。",              pinyin: "Zīxùn xìtǒng shēngjí le.",                            translation: "ระบบสารสนเทศอัปเกรดแล้ว" },
  "硬體設備":           { sentence: "硬體設備需要更新。",            pinyin: "Yìngtǐ shèbèi xūyào gēngxīn.",                        translation: "อุปกรณ์ฮาร์ดแวร์ต้องอัปเดต" },
  "臉部辨識系統":       { sentence: "大門裝了臉部辨識系統。",        pinyin: "Dàmén zhuāng le liǎnbù biànshí xìtǒng.",            translation: "ประตูใหญ่ติดตั้งระบบจดจำใบหน้า" },
  "投影機":             { sentence: "活動室有投影機。",              pinyin: "Huódòngshì yǒu tóuyǐngjī.",                            translation: "ห้องกิจกรรมมีโปรเจ็กเตอร์" },
  "電視機":             { sentence: "客廳電視機壞了。",              pinyin: "Kètīng diànshìjī huài le.",                            translation: "ทีวีห้องรับแขกเสีย" },
  "擴音機":             { sentence: "演講需要擴音機。",              pinyin: "Yǎnjiǎng xūyào kuòyīnjī.",                            translation: "การบรรยายต้องการเครื่องขยายเสียง" },
  "液晶螢幕":           { sentence: "液晶螢幕掛在牆上。",            pinyin: "Yèjīng yíngmù guà zài qiáng shàng.",                  translation: "จอ LCD แขวนบนผนัง" },
  "壁掛桌機":           { sentence: "壁掛桌機節省空間。",            pinyin: "Bìguà zhuōjī jiéshěng kōngjiān.",                    translation: "คอมพิวเตอร์ติดผนังประหยัดพื้นที่" },
  "空氣品質監測":       { sentence: "空氣品質監測 24 小時運作。",     pinyin: "Kōngqì pǐnzhì jiāncè èrshísì xiǎoshí yùnzuò.",      translation: "เครื่องตรวจคุณภาพอากาศทำงาน 24 ชั่วโมง" },
  "車輛追蹤管理":       { sentence: "車輛追蹤管理掌握位置。",        pinyin: "Chēliàng zhuīzōng guǎnlǐ zhǎngwò wèizhì.",          translation: "ระบบติดตามรถเช็กตำแหน่ง" },
  "蒸烤箱":             { sentence: "廚房有新蒸烤箱。",              pinyin: "Chúfáng yǒu xīn zhēng kǎoxiāng.",                    translation: "ครัวมีเตาอบนึ่งใหม่" },
  "生命徵象量測":       { sentence: "生命徵象量測每日記錄。",        pinyin: "Shēngmìng zhēngxiàng liángcè měi rì jìlù.",          translation: "วัดสัญญาณชีพบันทึกทุกวัน" },
  "換藥車":             { sentence: "護士推著換藥車。",              pinyin: "Hùshì tuī zhe huànyào chē.",                          translation: "พยาบาลเข็นรถเปลี่ยนยา" },
  "座椅式體重機":       { sentence: "座椅式體重機方便長輩。",        pinyin: "Zuòyǐ shì tǐzhòng jī fāngbiàn zhǎngbèi.",            translation: "เครื่องชั่งน้ำหนักแบบนั่งสะดวกสำหรับผู้สูงอายุ" },
  "上肢復健器材":       { sentence: "上肢復健器材在治療室。",        pinyin: "Shàngzhī fùjiàn qìcái zài zhìliáo shì.",              translation: "อุปกรณ์ฟื้นฟูแขนอยู่ห้องบำบัด" },
  "餐桌":               { sentence: "餐桌可以坐 8 人。",              pinyin: "Cānzhuō kěyǐ zuò bā rén.",                            translation: "โต๊ะอาหารนั่งได้ 8 คน" },
  "長桌":               { sentence: "會議用長桌。",                  pinyin: "Huìyì yòng cháng zhuō.",                              translation: "ประชุมใช้โต๊ะยาว" },
  "圓桌":               { sentence: "圓桌坐 6 人。",                  pinyin: "Yuán zhuō zuò liù rén.",                              translation: "โต๊ะกลมนั่งได้ 6 คน" },
  "扶手餐椅":           { sentence: "扶手餐椅安全多了。",            pinyin: "Fúshǒu cān yǐ ānquán duō le.",                        translation: "เก้าอี้กินข้าวมีที่เท้าแขนปลอดภัยกว่ามาก" },
  "沙發":               { sentence: "客廳的沙發很舒服。",            pinyin: "Kètīng de shāfā hěn shūfu.",                          translation: "โซฟาห้องรับแขกสบายมาก" },
  "飲水機":             { sentence: "走廊有飲水機。",                pinyin: "Zǒuláng yǒu yǐnshuǐjī.",                              translation: "มีเครื่องกดน้ำดื่มที่ทางเดิน" },
  "洗碗機":             { sentence: "廚房裝了洗碗機。",              pinyin: "Chúfáng zhuāng le xǐwǎnjī.",                          translation: "ครัวติดตั้งเครื่องล้างจาน" },
  "崁入式":             { sentence: "崁入式設備節省空間。",          pinyin: "Qiànrù shì shèbèi jiéshěng kōngjiān.",                translation: "อุปกรณ์แบบฝังประหยัดพื้นที่" },
  "變頻冰箱":           { sentence: "變頻冰箱比較省電。",            pinyin: "Biànpín bīngxiāng bǐjiào shěng diàn.",                translation: "ตู้เย็นอินเวอร์เตอร์ประหยัดไฟกว่า" },
  "空調設備":           { sentence: "夏天空調設備全開。",            pinyin: "Xiàtiān kōngtiáo shèbèi quán kāi.",                  translation: "หน้าร้อนเปิดเครื่องปรับอากาศทั้งหมด" },
  "分離式冷氣機":       { sentence: "每個房間有分離式冷氣機。",      pinyin: "Měi ge fángjiān yǒu fēnlí shì lěngqì jī.",          translation: "แต่ละห้องมีแอร์ติดผนังแยก" },
  "休閒藤椅":           { sentence: "陽台有休閒藤椅。",              pinyin: "Yángtái yǒu xiūxián téng yǐ.",                        translation: "ระเบียงมีเก้าอี้หวายพักผ่อน" },
  "休閒躺椅":           { sentence: "午休用休閒躺椅。",              pinyin: "Wǔxiū yòng xiūxián tǎng yǐ.",                        translation: "พักเที่ยงใช้เก้าอี้นอนพักผ่อน" },
  "印柚集成桌組":       { sentence: "印柚集成桌組很耐用。",          pinyin: "Yìnyòu jíchéng zhuō zǔ hěn nàiyòng.",                translation: "ชุดโต๊ะไม้สักทนทานมาก" },
  "不斷電系統":         { sentence: "不斷電系統保護電腦。",          pinyin: "Bù duàndiàn xìtǒng bǎohù diànnǎo.",                  translation: "ระบบ UPS ปกป้องคอมพิวเตอร์" },
  "灌溉系統":           { sentence: "花園裝了灌溉系統。",            pinyin: "Huāyuán zhuāng le guàngài xìtǒng.",                  translation: "สวนติดตั้งระบบรดน้ำ" },
  "影印機":             { sentence: "辦公室的影印機壞了。",          pinyin: "Bàngōngshì de yǐngyìnjī huài le.",                    translation: "เครื่องถ่ายเอกสารสำนักงานเสีย" },

  // ─── f14-glossary (18) ────────────────────────────────────────────────────
  "長輩":               { sentence: "尊敬長輩。",                    pinyin: "Zūnjìng zhǎngbèi.",                                    translation: "เคารพผู้สูงอายุ" },
  "住民":               { sentence: "本院住民共 80 位。",             pinyin: "Běn yuàn zhùmín gòng bāshí wèi.",                    translation: "ที่นี่มีผู้พักอาศัย 80 คน" },
  "入住":               { sentence: "他下個月入住。",                pinyin: "Tā xià ge yuè rùzhù.",                                  translation: "เขาเข้าพักเดือนหน้า" },
  "床位":               { sentence: "我們有 80 個床位。",             pinyin: "Wǒmen yǒu bāshí ge chuángwèi.",                      translation: "เรามีเตียง 80 เตียง" },
  "床頭卡":             { sentence: "床頭卡寫著姓名。",              pinyin: "Chuángtóu kǎ xiě zhe xìngmíng.",                      translation: "ป้ายหัวเตียงเขียนชื่อ" },
  "床墊":               { sentence: "床墊每年更換。",                pinyin: "Chuángdiàn měi nián gēnghuàn.",                        translation: "ที่นอนเปลี่ยนทุกปี" },
  "照服員":             { sentence: "照服員很辛苦。",                pinyin: "Zhàofúyuán hěn xīnkǔ.",                                translation: "ผู้ดูแลเหนื่อยมาก" },
  "進階培訓":           { sentence: "明年舉辦進階培訓。",            pinyin: "Míngnián jǔbàn jìnjiē péixùn.",                        translation: "ปีหน้าจัดอบรมขั้นสูง" },
  "獎勵金":             { sentence: "績效好有獎勵金。",              pinyin: "Jìxiào hǎo yǒu jiǎnglì jīn.",                          translation: "ผลงานดีมีโบนัส" },
  "服務天數":           { sentence: "服務天數要超過 20 天。",        pinyin: "Fúwù tiānshù yào chāoguò èrshí tiān.",                translation: "วันที่ให้บริการต้องเกิน 20 วัน" },
  "服務人次":           { sentence: "本月服務人次 5000。",           pinyin: "Běn yuè fúwù réncì wǔ qiān.",                          translation: "ครั้งบริการเดือนนี้ 5,000" },
  "預計":               { sentence: "預計下週完成。",                pinyin: "Yùjì xià zhōu wánchéng.",                              translation: "คาดว่าจะเสร็จสัปดาห์หน้า" },
  "實際":               { sentence: "實際比預計多。",                pinyin: "Shíjì bǐ yùjì duō.",                                    translation: "ตามจริงมากกว่าที่คาด" },
  "收費":               { sentence: "收費標準寫在公告欄。",          pinyin: "Shōufèi biāozhǔn xiě zài gōnggào lán.",              translation: "อัตราค่าบริการเขียนไว้บนกระดานข่าว" },
  "調漲":               { sentence: "明年月費要調漲 5%。",            pinyin: "Míngnián yuèfèi yào tiáozhǎng bǎi fēn zhī wǔ.",      translation: "ปีหน้าค่าธรรมเนียมรายเดือนปรับขึ้น 5%" },
  "春酒":               { sentence: "春酒在元月舉辦。",              pinyin: "Chūnjiǔ zài yuán yuè jǔbàn.",                          translation: "งานเลี้ยงตรุษจีนจัดเดือนมกราคม" },
  "頂樓":               { sentence: "頂樓有花園。",                  pinyin: "Dǐnglóu yǒu huāyuán.",                                  translation: "ดาดฟ้ามีสวน" },
  "現金支出":           { sentence: "現金支出要記錄。",              pinyin: "Xiànjīn zhīchū yào jìlù.",                            translation: "ค่าใช้จ่ายเงินสดต้องบันทึก" },
};

interface Item {
  hanzi: string;
  pinyin?: string;
  translations?: Record<string, string>;
  note?: string;
  example?: { sentence?: string; sentencePinyin?: string; sentenceTh?: string };
  examples?: Array<{ sentence: string; pinyin?: string; translation?: string }>;
  mnemonic?: string;
  usageNote?: string;
}

async function enrichLesson(lessonCode: string) {
  const lesson = await db.lesson.findFirst({
    where: { code: lessonCode },
    select: { id: true, content: true },
  });
  if (!lesson) return 0;
  const content = lesson.content as { type?: string; heading?: string; items?: Item[] } | null;
  if (!content?.items) return 0;

  let added = 0;
  const updated: Item[] = content.items.map((item) => {
    const ex = EXAMPLES[item.hanzi];
    if (!ex) return item;
    added += 1;
    // Preserve any existing examples, prepend the new one if not already there
    const existing = item.examples ?? [];
    const already = existing.some((e) => e.sentence === ex.sentence);
    return {
      ...item,
      examples: already ? existing : [ex, ...existing],
    };
  });

  await db.lesson.update({
    where: { id: lesson.id },
    data: { content: { ...content, items: updated } as object },
  });
  console.log(`  ✅ ${lessonCode}: +${added} examples`);
  return added;
}

async function main() {
  console.log("=== AAY-FINANCE example enrichment (all 14 categories) ===\n");
  const lessons = [
    "F01-ORG-VOCAB", "F02-REPORT-VOCAB", "F03-PERIOD-VOCAB",
    "F04-INCOME-VOCAB", "F05-PERSONNEL-VOCAB", "F06-OPERATING-VOCAB",
    "F07-INSURANCE-VOCAB", "F08-MATERIAL-VOCAB", "F09-ADMIN-VOCAB",
    "F10-PROFIT-VOCAB", "F11-DEPREC-VOCAB", "F12-MEASURE-VOCAB",
    "F13-ASSET-VOCAB", "F14-GLOSSARY-VOCAB",
  ];
  let total = 0;
  for (const code of lessons) total += await enrichLesson(code);
  console.log(`\n🎉 Total: ${total} examples added across ${lessons.length} lessons`);
  await db.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
