/**
 * Mareb Insurance - Full Content Seed Script
 * Populates the website with real company data from official documents
 * Run with: ~/nodevenv/test.myicyemen.com/20/bin/node namecheap-content.mjs
 */
import mysql from "mysql2/promise";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env file");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);
await conn.execute("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
console.log("✅ Connected to database\n");

// ─── Helper: upsert setting ───────────────────────────────────────────────────
async function upsertSetting(key, valueAr, valueEn, category = "general") {
  const [ex] = await conn.execute("SELECT id FROM site_settings WHERE `key`=?", [key]);
  if (ex.length === 0) {
    await conn.execute(
      "INSERT INTO site_settings (`key`,valueAr,valueEn,category) VALUES (?,?,?,?)",
      [key, valueAr, valueEn, category]
    );
  } else {
    await conn.execute(
      "UPDATE site_settings SET valueAr=?,valueEn=?,category=? WHERE `key`=?",
      [valueAr, valueEn, category, key]
    );
  }
  console.log(`  ✓ Setting: ${key}`);
}

// ─── Helper: check if column exists ──────────────────────────────────────────
async function columnExists(table, column) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

// ─── 1. Company Settings ──────────────────────────────────────────────────────
console.log("📋 Updating company settings...");

await upsertSetting("company_name_ar",   "شركة مأرب للتأمين",              "Mareb Insurance Co.",            "company");
await upsertSetting("company_name_en",   "شركة مأرب للتأمين",              "Mareb Insurance Co.",            "company");
await upsertSetting("company_slogan_ar", "الحماية الشاملة منذ عام 1974",   "Comprehensive Protection Since 1974", "company");
await upsertSetting("company_slogan_en", "الحماية الشاملة منذ عام 1974",   "Comprehensive Protection Since 1974", "company");
await upsertSetting("company_founded",   "1974",                            "1974",                           "company");
await upsertSetting("company_type_ar",   "شركة مساهمة يمنية",              "Yemeni Joint Stock Company",     "company");

// ─── 2. Contact Settings ─────────────────────────────────────────────────────
console.log("\n📋 Updating contact settings...");

await upsertSetting("phone_main",        "+967 02 362 317",                 "+967 02 362 317",                "contact");
await upsertSetting("phone_secondary",   "+967 02 362 318 / 319",           "+967 02 362 318 / 319",          "contact");
await upsertSetting("email_main",        "info@marebinsurance.com",         "info@marebinsurance.com",        "contact");
await upsertSetting("address_ar",        "عدن - صندوق بريد 729",            "Aden - P.O.Box: 729",            "contact");
await upsertSetting("address_en",        "عدن - صندوق بريد 729",            "Aden - P.O.Box: 729",            "contact");
await upsertSetting("fax_main",          "+967 02 362 317",                 "+967 02 362 317",                "contact");

// ─── 3. About Content ─────────────────────────────────────────────────────────
console.log("\n📋 Updating about content...");

const aboutAr = `شركة مأرب اليمنية للتأمين (شركة مساهمة يمنية) تأسست عام 1974م على يد مجموعة من رجال الأعمال اليمنيين والبنك اليمني للإنشاء والتعمير والشركة الكويتية لإعادة التأمين وشركة J.H. Limit البريطانية، لتكون أول شركة مساهمة يمنية للتأمين على مختلف الأخطار وضمان الحقوق المكتسبة لها وتقوم بإعادة التأمين لدى معيدي تأمين عالميين من الدرجة الأولى.

يبلغ رأس مال الشركة مليار ريال وتُدار بواسطة مجلس إدارة يمثل كل 10% من الأسهم عضواً في المجلس، وهناك إدارة تنفيذية تقوم بمتابعة الأعمال من خلال كادر مؤهل متخصص في مجال صناعة التأمين.

تمتلك الشركة استثمارات وأصولاً عقارية، وهي عضو نشط في الاتحادات العربية والمحلية في مجال التأمين.`;

const aboutEn = `Mareb Insurance Company (Yemeni Joint Stock Company) was established in 1974 by a group of Yemeni businessmen, the Yemeni Bank for Reconstruction and Development, the Kuwaiti Reinsurance Company, and J.H. Limit (British), making it the first Yemeni joint-stock insurance company covering all types of risks. The company reinsures with first-class international reinsurers.

The company's capital reaches one billion Yemeni Riyals, managed by a Board of Directors where every 10% of shares is represented by one board member. An executive management team handles daily operations through a qualified and specialized insurance workforce.

The company holds real estate investments and assets, and is an active member of Arab and local insurance federations.`;

// Check if about_content table exists
try {
  const [abRows] = await conn.execute("SELECT id FROM about_content LIMIT 1");
  if (abRows.length === 0) {
    await conn.execute(
      "INSERT INTO about_content (titleAr, titleEn, contentAr, contentEn, isActive) VALUES (?,?,?,?,1)",
      ["عن شركة مأرب للتأمين", "About Mareb Insurance Company", aboutAr, aboutEn]
    );
    console.log("  ✓ Inserted about content");
  } else {
    await conn.execute(
      "UPDATE about_content SET titleAr=?,titleEn=?,contentAr=?,contentEn=? WHERE id=?",
      ["عن شركة مأرب للتأمين", "About Mareb Insurance Company", aboutAr, aboutEn, abRows[0].id]
    );
    console.log("  ✓ Updated about content");
  }
} catch (e) {
  console.log("  ℹ️  about_content table not found, skipping");
}

// ─── 4. Insurance Types (from document) ──────────────────────────────────────
console.log("\n📋 Updating insurance types with real data...");

const insuranceTypes = [
  {
    slug: "car",
    titleAr: "تأمين السيارات",
    titleEn: "Motor Insurance",
    descriptionAr: "نوفر تأمين السيارات الشامل وتأمين الطرف الثالث لحماية مركبتك ضد الحوادث والسرقة والحريق والأضرار الطبيعية، مع تغطية المسؤولية المدنية تجاه الغير.",
    descriptionEn: "We provide comprehensive motor insurance and third-party liability coverage protecting your vehicle against accidents, theft, fire, and natural damages, with civil liability coverage toward third parties.",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80&fit=crop",
    icon: "car",
    featuresAr: "تأمين شامل (حوادث، انقلاب، حريق، سرقة)\nتأمين الطرف الثالث (مسؤولية مدنية)\nتغطية الأضرار المادية والجسدية للغير\nخدمة المساعدة على الطريق\nسرعة في معالجة المطالبات\nتغطية الكوارث الطبيعية بقسط إضافي",
    featuresEn: "Comprehensive coverage (accidents, rollover, fire, theft)\nThird-party liability insurance\nMaterial and physical damage coverage for others\nRoadside assistance service\nFast claims processing\nNatural disaster coverage with additional premium",
    displayOrder: 1,
  },
  {
    slug: "fire-theft",
    titleAr: "تأمين الحريق والسرقة",
    titleEn: "Fire & Theft Insurance",
    descriptionAr: "تغطية شاملة للممتلكات ضد مخاطر الحريق والسرقة والأخطار الإضافية كالانفجار والعواصف والفيضانات والزلازل والأعمال التخريبية.",
    descriptionEn: "Comprehensive property coverage against fire, theft, and additional risks including explosion, storms, floods, earthquakes, and vandalism.",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&fit=crop",
    icon: "flame",
    featuresAr: "تغطية الحريق كخطر رئيسي\nتغطية الانفجار والصواعق والعواصف والأعاصير\nتغطية الفيضانات والزلازل والبراكين\nتغطية أعمال الشغب والإضرابات العمالية\nتغطية السرقة بالإكراه أو بالقوة\nالأعمال الكيدية والتخريبية",
    featuresEn: "Fire coverage as primary risk\nExplosion, lightning, storms, and hurricane coverage\nFlood, earthquake, and volcano coverage\nRiots and labor strikes coverage\nTheft by force or coercion\nMalicious acts and vandalism",
    displayOrder: 2,
  },
  {
    slug: "marine",
    titleAr: "التأمين البحري والجوي والبري",
    titleEn: "Marine, Air & Land Insurance",
    descriptionAr: "تغطية شاملة للبضائع المستوردة أثناء الرحلة البحرية أو الجوية من دولة إلى دولة، تشمل الحريق والتصادم والغرق والعواصف وأخطار التفريغ والتحميل.",
    descriptionEn: "Comprehensive coverage for imported goods during sea or air transport from country to country, including fire, collision, sinking, storms, and loading/unloading risks.",
    imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80&fit=crop",
    icon: "anchor",
    featuresAr: "تغطية البضائع أثناء النقل البحري والجوي\nتغطية الحريق والتصادم والغرق\nتغطية العواصف والأعاصير والأمواج\nأخطار التحميل والتفريغ\nعدم التسليم وسقوط الطائرة\nالحرب والقرصنة البحرية",
    featuresEn: "Cargo coverage during sea and air transport\nFire, collision, and sinking coverage\nStorms, hurricanes, and wave coverage\nLoading and unloading risks\nNon-delivery and aircraft crash\nWar and maritime piracy",
    displayOrder: 3,
  },
  {
    slug: "engineering",
    titleAr: "تأمين المقاولين وأخطار التشييد",
    titleEn: "Contractors & Engineering Insurance",
    descriptionAr: "تغطية شاملة لعقود المقاولات ضد الأضرار المادية والمسؤولية المدنية تجاه الغير خلال فترة التنفيذ والصيانة، تشمل الآلات والمعدات والمشاريع الإنشائية.",
    descriptionEn: "Comprehensive coverage for construction contracts against material damage and civil liability toward third parties during execution and maintenance periods, including machinery, equipment, and construction projects.",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80&fit=crop",
    icon: "hard-hat",
    featuresAr: "تأمين أخطار المقاولين الشاملة\nتأمين أخطار التركيب والتشييد\nتأمين الآلات والمعدات\nتغطية المسؤولية المدنية تجاه الغير\nتغطية فترة الصيانة\nتأمين تعطل الآلات",
    featuresEn: "Comprehensive contractors all risks insurance\nErection and construction risks insurance\nMachinery and equipment insurance\nCivil liability coverage toward third parties\nMaintenance period coverage\nMachinery breakdown insurance",
    displayOrder: 4,
  },
  {
    slug: "health",
    titleAr: "التأمين الصحي الجماعي",
    titleEn: "Group Health Insurance",
    descriptionAr: "تغطية شاملة للمصاريف الطبية تشمل رسوم المعاينة والفحوصات والأدوية والعمليات والمستشفيات والعيادات الخارجية وعلاج الأسنان والعيون داخل وخارج اليمن.",
    descriptionEn: "Comprehensive medical expense coverage including consultation fees, tests, medicines, surgeries, hospitals, outpatient clinics, dental and eye treatment inside and outside Yemen.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&fit=crop",
    icon: "heart-pulse",
    featuresAr: "تغطية رسوم المعاينة والفحوصات الطبية\nتغطية الأدوية والعمليات الجراحية\nالمستشفيات والعيادات الخارجية\nعلاج الأسنان والعيون\nالعلاج في الخارج\nتحديد سقوف التغطية حسب الاحتياج",
    featuresEn: "Consultation and medical test fees coverage\nMedicines and surgical operations coverage\nHospitals and outpatient clinics\nDental and eye treatment\nTreatment abroad\nCustomizable coverage limits",
    displayOrder: 5,
  },
  {
    slug: "life",
    titleAr: "تأمين الحياة الجماعي",
    titleEn: "Group Life Insurance",
    descriptionAr: "تغطية مخاطر الوفاة الطبيعية والوفاة بحادث والعجز الكلي الدائم أو المؤقت مع تغطية المصاريف الطبية وفقدان الراتب لمدة 52 أسبوعاً.",
    descriptionEn: "Coverage for natural death, accidental death, permanent or temporary total disability, with medical expenses coverage and salary loss for up to 52 weeks.",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&fit=crop",
    icon: "shield",
    featuresAr: "تغطية الوفاة الطبيعية بـ 100% من مبلغ التأمين\nتغطية الوفاة بحادث بـ 200% من مبلغ التأمين\nالعجز الكلي الدائم (حسب جدول المنافع)\nالعجز الكلي المؤقت (حسب جدول المنافع)\nفقدان الراتب لمدة 52 أسبوعاً\nالمصاريف الطبية\nإمكانية تغطية الحروب والأوبئة بقسط إضافي",
    featuresEn: "Natural death coverage at 100% of insured amount\nAccidental death coverage at 200% of insured amount\nPermanent total disability (per benefits schedule)\nTemporary total disability (per benefits schedule)\nSalary loss for 52 weeks\nMedical expenses\nOptional war and epidemic coverage with additional premium",
    displayOrder: 6,
  },
  {
    slug: "personal-accident",
    titleAr: "تأمين الحوادث الشخصية",
    titleEn: "Personal Accident Insurance",
    descriptionAr: "تغطية أي حادث جسدي مفاجئ وعرضي يؤدي إلى وفاة المؤمن له أو عجزه الكلي أو الجزئي الدائم أو المؤقت، مع تغطية المصاريف الطبية.",
    descriptionEn: "Coverage for any sudden and accidental physical accident leading to death, permanent or temporary total or partial disability, with medical expenses coverage.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&fit=crop",
    icon: "user-shield",
    featuresAr: "تغطية الوفاة الناتجة عن الحادث\nالعجز الكلي الدائم (حسب جدول المنافع)\nالعجز الجزئي الدائم (حسب جدول المنافع)\nالعجز الكلي المؤقت (حسب جدول المنافع)\nالمصاريف الطبية\nمناسب للبنوك والمؤسسات المالية وشركات الصرافة",
    featuresEn: "Death resulting from accident coverage\nPermanent total disability (per benefits schedule)\nPermanent partial disability (per benefits schedule)\nTemporary total disability (per benefits schedule)\nMedical expenses\nSuitable for banks, financial institutions, and exchange companies",
    displayOrder: 7,
  },
  {
    slug: "work-injury",
    titleAr: "تأمين إصابات العمل",
    titleEn: "Work Injury Insurance",
    descriptionAr: "تغطية صاحب العمل ضد الوفاة أو الإصابة الناتجة عن حادث في موقع العمل، مع تغطية العجز الدائم أو المؤقت وفقدان الراتب والمصاريف الطبية.",
    descriptionEn: "Employer coverage against death or injury resulting from a workplace accident, with permanent or temporary disability coverage, salary loss, and medical expenses.",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80&fit=crop",
    icon: "briefcase",
    featuresAr: "تغطية وفاة أو إصابة الموظف في موقع العمل\nالعجز الدائم أو المؤقت (حسب جدول المنافع)\nفقدان الراتب لمدة 52 أسبوعاً\nالمصاريف الطبية المحددة في الوثيقة\nمناسب للمقاولين والمصانع والفنادق والشركات",
    featuresEn: "Employee death or injury at workplace coverage\nPermanent or temporary disability (per benefits schedule)\nSalary loss for 52 weeks\nMedical expenses specified in the policy\nSuitable for contractors, factories, hotels, and companies",
    displayOrder: 8,
  },
  {
    slug: "home",
    titleAr: "التأمين المنزلي الشامل",
    titleEn: "Comprehensive Home Insurance",
    descriptionAr: "تغطية المبنى السكني ومحتوياته ضد مخاطر الحريق والصاعقة والانفجار والزلازل والأعاصير والفيضانات والسطو والسرقة بالإكراه والمسؤولية المدنية.",
    descriptionEn: "Coverage for residential buildings and contents against fire, lightning, explosion, earthquakes, hurricanes, floods, burglary, theft by force, and civil liability.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&fit=crop",
    icon: "home",
    featuresAr: "تغطية الحريق والصاعقة والانفجار\nتغطية الزلازل والأعاصير والفيضانات\nتغطية السطو والسرقة بالإكراه\nتصادم المركبات غير المؤمن عليها\nالمسؤولية المدنية تجاه المالك أو المستأجر\nمناسب للمباني المملوكة والمستأجرة",
    featuresEn: "Fire, lightning, and explosion coverage\nEarthquake, hurricane, and flood coverage\nBurglary and theft by force coverage\nCollision of uninsured vehicles\nCivil liability toward owner or tenant\nSuitable for owned and rented buildings",
    displayOrder: 9,
  },
  {
    slug: "cash",
    titleAr: "تأمين النقود",
    titleEn: "Cash Insurance",
    descriptionAr: "تغطية فقدان النقود المملوكة لكم أو التي تقع ضمن مسؤوليتكم نتيجة السطو المسلح أو السرقة أو الحريق أثناء عملية النقل أو التصادم والانقلاب.",
    descriptionEn: "Coverage for loss of cash owned by you or under your responsibility due to armed robbery, theft, fire during transport, or collision and rollover.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&fit=crop",
    icon: "banknote",
    featuresAr: "تغطية السطو المسلح والسرقة\nتغطية الحريق أثناء النقل\nتغطية التصادم والانقلاب أثناء النقل\nتأمين النقود في الخزينة أو الغرف المحصنة\nتأمين النقود على الكاونتر\nمناسب للبنوك وشركات الصرافة والمؤسسات",
    featuresEn: "Armed robbery and theft coverage\nFire during transport coverage\nCollision and rollover during transport\nCash in vault or secured rooms insurance\nCash on counter insurance\nSuitable for banks, exchange companies, and institutions",
    displayOrder: 10,
  },
];

for (const it of insuranceTypes) {
  const [ex] = await conn.execute("SELECT id FROM insurance_types WHERE slug=?", [it.slug]);
  if (ex.length === 0) {
    await conn.execute(
      `INSERT INTO insurance_types (slug,titleAr,titleEn,descriptionAr,descriptionEn,imageUrl,icon,featuresAr,featuresEn,displayOrder,isActive)
       VALUES (?,?,?,?,?,?,?,?,?,?,1)`,
      [it.slug, it.titleAr, it.titleEn, it.descriptionAr, it.descriptionEn, it.imageUrl, it.icon, it.featuresAr, it.featuresEn, it.displayOrder]
    );
    console.log(`  ✓ Inserted: ${it.titleAr}`);
  } else {
    await conn.execute(
      `UPDATE insurance_types SET titleAr=?,titleEn=?,descriptionAr=?,descriptionEn=?,imageUrl=?,icon=?,featuresAr=?,featuresEn=?,displayOrder=? WHERE slug=?`,
      [it.titleAr, it.titleEn, it.descriptionAr, it.descriptionEn, it.imageUrl, it.icon, it.featuresAr, it.featuresEn, it.displayOrder, it.slug]
    );
    console.log(`  ↺ Updated: ${it.titleAr}`);
  }
}

// ─── 5. Branches (from document) ─────────────────────────────────────────────
console.log("\n📋 Updating branches with real data...");

const branches = [
  {
    nameAr: "المركز الرئيسي - عدن",
    nameEn: "Head Office - Aden",
    addressAr: "عدن - صندوق بريد 729",
    addressEn: "Aden - P.O.Box: 729",
    phone: "+967 02 362 317 / 318 / 319",
    email: "info@marebinsurance.com",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop",
    mapUrl: "https://maps.google.com/?q=Aden,Yemen",
    isMain: 1,
    displayOrder: 1,
  },
  {
    nameAr: "فرع صنعاء",
    nameEn: "Sana'a Branch",
    addressAr: "صنعاء - صندوق بريد 2284",
    addressEn: "Sana'a - P.O.Box: 2284",
    phone: "+967 1 206127 / 402049 / 402010",
    email: "sanaa@marebinsurance.com",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop",
    mapUrl: "https://maps.google.com/?q=Sanaa,Yemen",
    isMain: 0,
    displayOrder: 2,
  },
  {
    nameAr: "فرع تعز",
    nameEn: "Taiz Branch",
    addressAr: "تعز - صندوق بريد 6077",
    addressEn: "Taiz - P.O.Box: 6077",
    phone: "+967 4 240933 / 240934 / 240927",
    email: "taiz@marebinsurance.com",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop",
    mapUrl: "https://maps.google.com/?q=Taiz,Yemen",
    isMain: 0,
    displayOrder: 3,
  },
  {
    nameAr: "فرع الحديدة",
    nameEn: "Hodeidah Branch",
    addressAr: "الحديدة - صندوق بريد 3726",
    addressEn: "Hodeidah - P.O.Box: 3726",
    phone: "+967 3 219545 / 219548",
    email: "hodeidah@marebinsurance.com",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop",
    mapUrl: "https://maps.google.com/?q=Hodeidah,Yemen",
    isMain: 0,
    displayOrder: 4,
  },
  {
    nameAr: "مكتب المكلا - حضرموت",
    nameEn: "Al-Mukalla Office - Hadhramaut",
    addressAr: "المكلا - حضرموت",
    addressEn: "Al-Mukalla - Hadhramaut",
    phone: "+967 5 314544",
    email: "mukalla@marebinsurance.com",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop",
    mapUrl: "https://maps.google.com/?q=Mukalla,Yemen",
    isMain: 0,
    displayOrder: 5,
  },
];

// Delete old branches and re-insert with real data
await conn.execute("DELETE FROM branches");
console.log("  ✓ Cleared old branches");

// Check which optional columns exist
const hasIsMain = await columnExists("branches", "isMain");
const hasMapUrl = await columnExists("branches", "mapUrl");
const hasImageUrl = await columnExists("branches", "imageUrl");

for (const b of branches) {
  if (hasIsMain && hasMapUrl && hasImageUrl) {
    await conn.execute(
      `INSERT INTO branches (nameAr,nameEn,addressAr,addressEn,phone,email,imageUrl,mapUrl,isMain,displayOrder,isActive)
       VALUES (?,?,?,?,?,?,?,?,?,?,1)`,
      [b.nameAr, b.nameEn, b.addressAr, b.addressEn, b.phone, b.email, b.imageUrl, b.mapUrl, b.isMain, b.displayOrder]
    );
  } else if (hasMapUrl && hasImageUrl) {
    await conn.execute(
      `INSERT INTO branches (nameAr,nameEn,addressAr,addressEn,phone,email,imageUrl,mapUrl,displayOrder,isActive)
       VALUES (?,?,?,?,?,?,?,?,?,1)`,
      [b.nameAr, b.nameEn, b.addressAr, b.addressEn, b.phone, b.email, b.imageUrl, b.mapUrl, b.displayOrder]
    );
  } else {
    await conn.execute(
      `INSERT INTO branches (nameAr,nameEn,addressAr,addressEn,phone,email,displayOrder,isActive)
       VALUES (?,?,?,?,?,?,?,1)`,
      [b.nameAr, b.nameEn, b.addressAr, b.addressEn, b.phone, b.email, b.displayOrder]
    );
  }
  console.log(`  ✓ Inserted: ${b.nameAr}`);
}

// ─── 6. Statistics ────────────────────────────────────────────────────────────
console.log("\n📋 Updating statistics...");

const stats = [
  { labelAr: "سنة تأسيس",       labelEn: "Years of Experience", value: 50,   suffix: "+",  prefix: "", displayOrder: 1 },
  { labelAr: "فروع ومكاتب",     labelEn: "Branches & Offices",  value: 5,    suffix: "",   prefix: "", displayOrder: 2 },
  { labelAr: "معيد تأمين دولي", labelEn: "International Reinsurers", value: 16, suffix: "+", prefix: "", displayOrder: 3 },
  { labelAr: "نوع تأمين",       labelEn: "Insurance Types",     value: 25,   suffix: "+",  prefix: "", displayOrder: 4 },
];

try {
  await conn.execute("DELETE FROM statistics");
  for (const s of stats) {
    await conn.execute(
      "INSERT INTO statistics (labelAr,labelEn,value,suffix,prefix,displayOrder,isActive) VALUES (?,?,?,?,?,?,1)",
      [s.labelAr, s.labelEn, s.value, s.suffix, s.prefix, s.displayOrder]
    );
    console.log(`  ✓ Inserted stat: ${s.labelAr}`);
  }
} catch (e) {
  console.log("  ℹ️  statistics table issue:", e.message);
}

// ─── 7. Hero Slides ───────────────────────────────────────────────────────────
console.log("\n📋 Updating hero slides...");

const slides = [
  {
    titleAr: "شركة مأرب للتأمين\nمنذ عام 1974",
    titleEn: "Mareb Insurance Co.\nSince 1974",
    subtitleAr: "أول شركة مساهمة يمنية للتأمين — نحمي أصولكم وممتلكاتكم وأعمالكم بأفضل الحلول التأمينية المدعومة بشبكة من معيدي التأمين العالميين",
    subtitleEn: "Yemen's first joint-stock insurance company — protecting your assets, properties, and businesses with the best insurance solutions backed by a global reinsurance network",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=85&fit=crop",
    ctaTextAr: "احصل على عرض تأمين",
    ctaTextEn: "Get a Quote",
    ctaLink: "/contact",
    displayOrder: 1,
  },
  {
    titleAr: "تأمين السيارات\nالشامل والطرف الثالث",
    titleEn: "Motor Insurance\nComprehensive & Third Party",
    subtitleAr: "نوفر لكم تأمين السيارات الشامل وتأمين الطرف الثالث — حماية كاملة ضد الحوادث والسرقة والحريق مع خدمة معالجة سريعة للمطالبات",
    subtitleEn: "We provide comprehensive motor insurance and third-party coverage — full protection against accidents, theft, and fire with fast claims processing",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=85&fit=crop",
    ctaTextAr: "تأمين سيارتك الآن",
    ctaTextEn: "Insure Your Car Now",
    ctaLink: "/insurance/car",
    displayOrder: 2,
  },
  {
    titleAr: "التأمين الصحي الجماعي\nلموظفيك وعائلتك",
    titleEn: "Group Health Insurance\nFor Your Employees & Family",
    subtitleAr: "خطط صحية شاملة تغطي المعاينة والفحوصات والأدوية والعمليات والعلاج داخل وخارج اليمن — استثمر في صحة فريقك",
    subtitleEn: "Comprehensive health plans covering consultations, tests, medicines, surgeries, and treatment inside and outside Yemen — invest in your team's health",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=85&fit=crop",
    ctaTextAr: "استكشف التأمين الصحي",
    ctaTextEn: "Explore Health Plans",
    ctaLink: "/insurance/health",
    displayOrder: 3,
  },
  {
    titleAr: "تأمين المقاولين\nوأخطار التشييد",
    titleEn: "Contractors & Engineering\nInsurance",
    subtitleAr: "حماية شاملة لمشاريعك الإنشائية والهندسية — تأمين الآلات والمعدات والمسؤولية المدنية تجاه الغير خلال فترة التنفيذ والصيانة",
    subtitleEn: "Comprehensive protection for your construction and engineering projects — machinery, equipment, and civil liability coverage during execution and maintenance",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&q=85&fit=crop",
    ctaTextAr: "تعرف على التأمين الهندسي",
    ctaTextEn: "Explore Engineering Insurance",
    ctaLink: "/insurance/engineering",
    displayOrder: 4,
  },
  {
    titleAr: "التأمين البحري\nللبضائع والشحنات",
    titleEn: "Marine Insurance\nFor Cargo & Shipments",
    subtitleAr: "تغطية شاملة لبضائعكم المستوردة والمصدرة أثناء النقل البحري والجوي والبري — حماية ضد جميع مخاطر الرحلة",
    subtitleEn: "Comprehensive coverage for your imported and exported goods during sea, air, and land transport — protection against all voyage risks",
    imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=85&fit=crop",
    ctaTextAr: "تأمين شحنتك الآن",
    ctaTextEn: "Insure Your Cargo Now",
    ctaLink: "/insurance/marine",
    displayOrder: 5,
  },
];

await conn.execute("DELETE FROM hero_slides");
for (const s of slides) {
  await conn.execute(
    `INSERT INTO hero_slides (titleAr,titleEn,subtitleAr,subtitleEn,imageUrl,ctaTextAr,ctaTextEn,ctaLink,displayOrder,isActive)
     VALUES (?,?,?,?,?,?,?,?,?,1)`,
    [s.titleAr, s.titleEn, s.subtitleAr, s.subtitleEn, s.imageUrl, s.ctaTextAr, s.ctaTextEn, s.ctaLink, s.displayOrder]
  );
  console.log(`  ✓ Slide ${s.displayOrder}: ${s.titleAr.split('\n')[0]}`);
}

// ─── 8. Partners / Reinsurers (from document) ─────────────────────────────────
console.log("\n📋 Updating reinsurers as partners...");

const reinsurers = [
  { nameAr: "Swiss Re",          nameEn: "Swiss Re",                    category: "reinsurer", country: "Switzerland" },
  { nameAr: "Libya Re",          nameEn: "Libya Re",                    category: "reinsurer", country: "Libya" },
  { nameAr: "Misr Insurance",    nameEn: "Misr Insurance",              category: "reinsurer", country: "Egypt" },
  { nameAr: "Iraq Re",           nameEn: "Iraq Re",                     category: "reinsurer", country: "Iraq" },
  { nameAr: "Arab Re",           nameEn: "Arab Re",                     category: "reinsurer", country: "Lebanon" },
  { nameAr: "Arab War Risk",     nameEn: "Arab War Risk Insurance",     category: "reinsurer", country: "Bahrain" },
  { nameAr: "Oman Re",           nameEn: "Oman Re",                     category: "reinsurer", country: "Oman" },
  { nameAr: "Tunis Re",          nameEn: "Tunis Re",                    category: "reinsurer", country: "Tunisia" },
  { nameAr: "Kenya Re",          nameEn: "Kenya Re",                    category: "reinsurer", country: "Kenya" },
  { nameAr: "Trust Re",          nameEn: "Trust Re",                    category: "reinsurer", country: "Bahrain" },
  { nameAr: "Barents Re",        nameEn: "Barents Re",                  category: "reinsurer", country: "Lebanon" },
  { nameAr: "Mena Re",           nameEn: "Mena Re",                     category: "reinsurer", country: "Dubai" },
  { nameAr: "Global Re",         nameEn: "Global Re",                   category: "reinsurer", country: "Dubai" },
  { nameAr: "Asia Insurance",    nameEn: "Asia Insurance",              category: "reinsurer", country: "UAE" },
  { nameAr: "Neo Insurance",     nameEn: "Neo Insurance",               category: "reinsurer", country: "UAE" },
];

try {
  // Only insert if partners table exists and is empty
  const [pCount] = await conn.execute("SELECT COUNT(*) as cnt FROM partners WHERE category='reinsurer'");
  if (pCount[0].cnt === 0) {
    for (const r of reinsurers) {
      await conn.execute(
        `INSERT INTO partners (nameAr,nameEn,logoUrl,category,descriptionAr,descriptionEn,displayOrder,isActive)
         VALUES (?,?,?,?,?,?,?,1)`,
        [r.nameAr, r.nameEn, "https://via.placeholder.com/200x80?text=" + encodeURIComponent(r.nameEn), r.category,
         `معيد تأمين دولي - ${r.country}`, `International Reinsurer - ${r.country}`, reinsurers.indexOf(r) + 1]
      );
      console.log(`  ✓ Inserted reinsurer: ${r.nameEn}`);
    }
  } else {
    console.log(`  ℹ️  Reinsurers already exist (${pCount[0].cnt} records), skipping`);
  }
} catch (e) {
  console.log("  ℹ️  partners table issue:", e.message);
}

await conn.end();
console.log("\n✅ All content updated! Restart your Node.js app from cPanel → Node.js App → Restart");
console.log("\n📌 Summary:");
console.log("   - Company settings: updated with real phone, address, founded year");
console.log("   - Insurance types: 10 types with real descriptions from company document");
console.log("   - Branches: 5 branches/offices with real phone numbers and addresses");
console.log("   - Statistics: 4 key company stats");
console.log("   - Hero slides: 5 slides with real company content");
console.log("   - Reinsurers: 15 international reinsurers added as partners");
