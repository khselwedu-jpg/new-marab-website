/**
 * Seed script: populates default settings, insurance types, and branches
 * Run with: node seed-defaults.mjs
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL + (DATABASE_URL.includes("?") ? "&" : "?") + "charset=utf8mb4");
await conn.execute("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

console.log("Connected to database");

// ─── Site Settings ────────────────────────────────────────────────────────────
const settings = [
  { key: "phone_main",       valueAr: "+967 1 234 567",          valueEn: "+967 1 234 567",          category: "contact" },
  { key: "phone_secondary",  valueAr: "+967 1 234 568",          valueEn: "+967 1 234 568",          category: "contact" },
  { key: "email_main",       valueAr: "info@marebinsurance.com", valueEn: "info@marebinsurance.com", category: "contact" },
  { key: "email_support",    valueAr: "support@marebinsurance.com", valueEn: "support@marebinsurance.com", category: "contact" },
  { key: "address_ar",       valueAr: "شارع الزبيري، صنعاء، اليمن", valueEn: "Al-Zubairi Street, Sana'a, Yemen", category: "contact" },
  { key: "address_en",       valueAr: "شارع الزبيري، صنعاء، اليمن", valueEn: "Al-Zubairi Street, Sana'a, Yemen", category: "contact" },
  { key: "social_facebook",  valueAr: "https://facebook.com/marebinsurance", valueEn: "https://facebook.com/marebinsurance", category: "social" },
  { key: "social_twitter",   valueAr: "https://twitter.com/marebinsurance",  valueEn: "https://twitter.com/marebinsurance",  category: "social" },
  { key: "social_linkedin",  valueAr: "https://linkedin.com/company/marebinsurance", valueEn: "https://linkedin.com/company/marebinsurance", category: "social" },
  { key: "social_youtube",   valueAr: "",                        valueEn: "",                        category: "social" },
  { key: "social_instagram", valueAr: "",                        valueEn: "",                        category: "social" },
  { key: "company_name_ar",  valueAr: "شركة مأرب للتأمين",      valueEn: "Mareb Insurance Company", category: "company" },
  { key: "company_name_en",  valueAr: "شركة مأرب للتأمين",      valueEn: "Mareb Insurance Company", category: "company" },
  { key: "company_slogan_ar",valueAr: "نحمي مستقبلك",           valueEn: "Protecting Your Future",  category: "company" },
  { key: "company_slogan_en",valueAr: "نحمي مستقبلك",           valueEn: "Protecting Your Future",  category: "company" },
  { key: "company_founded",  valueAr: "1990",                   valueEn: "1990",                    category: "company" },
  { key: "company_license",  valueAr: "001/2024",               valueEn: "001/2024",                category: "company" },
];

for (const s of settings) {
  const [existing] = await conn.execute("SELECT id FROM site_settings WHERE `key` = ?", [s.key]);
  if (existing.length === 0) {
    await conn.execute(
      "INSERT INTO site_settings (`key`, valueAr, valueEn, category) VALUES (?, ?, ?, ?)",
      [s.key, s.valueAr, s.valueEn, s.category]
    );
    console.log(`  ✓ Inserted setting: ${s.key}`);
  } else {
    console.log(`  - Skipped (exists): ${s.key}`);
  }
}

// ─── Insurance Types ──────────────────────────────────────────────────────────
const insuranceTypes = [
  {
    slug: "health",
    titleAr: "التأمين الصحي",
    titleEn: "Health Insurance",
    descriptionAr: "نقدم لكم أفضل حلول التأمين الصحي الشاملة التي تغطي جميع احتياجاتكم الطبية وتوفر لكم الرعاية الصحية المتميزة.",
    descriptionEn: "We offer the best comprehensive health insurance solutions that cover all your medical needs and provide you with excellent healthcare.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    icon: "heart-pulse",
    featuresAr: "تغطية شاملة للعلاج في المستشفيات الخاصة والحكومية\nتغطية الأدوية والفحوصات الطبية\nتغطية العمليات الجراحية والطوارئ\nخدمات الرعاية الوقائية والفحوصات الدورية\nتغطية علاج الأسنان والعيون\nخدمة الطوارئ على مدار الساعة",
    featuresEn: "Comprehensive coverage for treatment in private and public hospitals\nCoverage for medicines and medical tests\nCoverage for surgical operations and emergencies\nPreventive care services and periodic examinations\nDental and eye treatment coverage\n24/7 emergency service",
    displayOrder: 1,
    isActive: 1,
  },
  {
    slug: "car",
    titleAr: "تأمين السيارات",
    titleEn: "Car Insurance",
    descriptionAr: "نوفر لكم حماية شاملة لمركباتكم ضد جميع المخاطر المحتملة على الطرق.",
    descriptionEn: "We provide comprehensive protection for your vehicles against all potential road risks.",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    icon: "car",
    featuresAr: "تغطية شاملة ضد الحوادث والتصادم\nتغطية الأضرار الناتجة عن الحريق والسرقة\nالمسؤولية تجاه الطرف الثالث\nخدمة المساعدة على الطريق\nتغطية الكوارث الطبيعية\nسرعة في معالجة المطالبات",
    featuresEn: "Comprehensive coverage against accidents and collisions\nCoverage for fire and theft damage\nThird party liability\nRoadside assistance service\nNatural disaster coverage\nFast claims processing",
    displayOrder: 2,
    isActive: 1,
  },
  {
    slug: "marine",
    titleAr: "التأمين البحري",
    titleEn: "Marine Insurance",
    descriptionAr: "حماية شاملة للبضائع والسفن أثناء النقل البحري.",
    descriptionEn: "Comprehensive protection for cargo and vessels during maritime transport.",
    imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80",
    icon: "anchor",
    featuresAr: "تغطية البضائع أثناء النقل البحري\nتأمين السفن والقوارب\nتغطية المسؤولية البحرية\nحماية ضد الكوارث البحرية\nتغطية التلف والفقدان\nخدمات استشارية متخصصة",
    featuresEn: "Cargo coverage during maritime transport\nShip and boat insurance\nMarine liability coverage\nProtection against marine disasters\nDamage and loss coverage\nSpecialized consulting services",
    displayOrder: 3,
    isActive: 1,
  },
  {
    slug: "engineering",
    titleAr: "التأمين الهندسي",
    titleEn: "Engineering Insurance",
    descriptionAr: "حلول تأمينية متخصصة للمشاريع الهندسية والإنشائية.",
    descriptionEn: "Specialized insurance solutions for engineering and construction projects.",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
    icon: "hard-hat",
    featuresAr: "تأمين المشاريع الإنشائية\nتغطية المعدات والآلات\nتأمين المسؤولية المهنية\nحماية ضد أخطار التشييد\nتغطية فترة الصيانة\nاستشارات هندسية متخصصة",
    featuresEn: "Construction project insurance\nEquipment and machinery coverage\nProfessional liability insurance\nProtection against construction risks\nMaintenance period coverage\nSpecialized engineering consultations",
    displayOrder: 4,
    isActive: 1,
  },
  {
    slug: "energy",
    titleAr: "تأمين الطاقة",
    titleEn: "Energy Insurance",
    descriptionAr: "تغطية شاملة لمشاريع الطاقة والبنية التحتية.",
    descriptionEn: "Comprehensive coverage for energy projects and infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    icon: "zap",
    featuresAr: "تأمين مشاريع الطاقة المتجددة\nتغطية محطات الكهرباء\nتأمين خطوط النقل والتوزيع\nحماية المنشآت النفطية\nتغطية الأضرار التشغيلية\nخدمات إدارة المخاطر",
    featuresEn: "Renewable energy project insurance\nPower plant coverage\nTransmission and distribution line insurance\nOil facility protection\nOperational damage coverage\nRisk management services",
    displayOrder: 5,
    isActive: 1,
  },
  {
    slug: "takaful",
    titleAr: "التأمين التكافلي الإسلامي",
    titleEn: "Islamic Takaful Insurance",
    descriptionAr: "حلول تأمينية متوافقة مع أحكام الشريعة الإسلامية.",
    descriptionEn: "Insurance solutions compliant with Islamic Sharia principles.",
    imageUrl: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=800&q=80",
    icon: "star",
    featuresAr: "منتجات متوافقة مع الشريعة الإسلامية\nنظام التكافل والتعاون\nاستثمارات حلال\nشفافية كاملة في العمليات\nإشراف هيئة شرعية\nتوزيع عادل للفوائض",
    featuresEn: "Sharia-compliant products\nTakaful and cooperation system\nHalal investments\nFull transparency in operations\nSharia board supervision\nFair surplus distribution",
    displayOrder: 6,
    isActive: 1,
  },
];

for (const it of insuranceTypes) {
  const [existing] = await conn.execute("SELECT id FROM insurance_types WHERE slug = ?", [it.slug]);
  if (existing.length === 0) {
    await conn.execute(
      `INSERT INTO insurance_types (slug, titleAr, titleEn, descriptionAr, descriptionEn, imageUrl, icon, featuresAr, featuresEn, displayOrder, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [it.slug, it.titleAr, it.titleEn, it.descriptionAr, it.descriptionEn, it.imageUrl, it.icon, it.featuresAr, it.featuresEn, it.displayOrder, it.isActive]
    );
    console.log(`  ✓ Inserted insurance type: ${it.slug}`);
  } else {
    console.log(`  - Skipped (exists): ${it.slug}`);
  }
}

// ─── Branches ─────────────────────────────────────────────────────────────────
const branches = [
  {
    nameAr: "فرع صنعاء الرئيسي",
    nameEn: "Sana'a Main Branch",
    addressAr: "شارع الزبيري، صنعاء، اليمن",
    addressEn: "Al-Zubairi Street, Sana'a, Yemen",
    phone: "+967 1 234 567",
    email: "sanaa@marebinsurance.com",
    workingHoursAr: "السبت - الخميس: 8 صباحاً - 4 مساءً",
    workingHoursEn: "Sat - Thu: 8am - 4pm",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    mapUrl: "https://maps.google.com/?q=Sanaa,Yemen",
    isMain: 1,
    displayOrder: 1,
    isActive: 1,
  },
  {
    nameAr: "فرع عدن",
    nameEn: "Aden Branch",
    addressAr: "شارع المعلا، عدن، اليمن",
    addressEn: "Al-Mualla Street, Aden, Yemen",
    phone: "+967 2 345 678",
    email: "aden@marebinsurance.com",
    workingHoursAr: "السبت - الخميس: 8 صباحاً - 4 مساءً",
    workingHoursEn: "Sat - Thu: 8am - 4pm",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    mapUrl: "https://maps.google.com/?q=Aden,Yemen",
    isMain: 0,
    displayOrder: 2,
    isActive: 1,
  },
  {
    nameAr: "فرع تعز",
    nameEn: "Taiz Branch",
    addressAr: "شارع جمال، تعز، اليمن",
    addressEn: "Jamal Street, Taiz, Yemen",
    phone: "+967 4 456 789",
    email: "taiz@marebinsurance.com",
    workingHoursAr: "السبت - الخميس: 8 صباحاً - 4 مساءً",
    workingHoursEn: "Sat - Thu: 8am - 4pm",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    mapUrl: "https://maps.google.com/?q=Taiz,Yemen",
    isMain: 0,
    displayOrder: 3,
    isActive: 1,
  },
];

for (const b of branches) {
  const [existing] = await conn.execute("SELECT id FROM branches WHERE nameAr = ?", [b.nameAr]);
  if (existing.length === 0) {
    await conn.execute(
      `INSERT INTO branches (nameAr, nameEn, addressAr, addressEn, phone, email, imageUrl, mapUrl, displayOrder, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.nameAr, b.nameEn, b.addressAr, b.addressEn, b.phone, b.email, b.imageUrl, b.mapUrl, b.displayOrder, b.isActive]
    );
    console.log(`  ✓ Inserted branch: ${b.nameAr}`);
  } else {
    console.log(`  - Skipped (exists): ${b.nameAr}`);
  }
}

await conn.end();
console.log("\n✅ Seeding complete!");
