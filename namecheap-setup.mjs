/**
 * Namecheap Setup Script
 * Automatically migrates old schema to new schema and seeds default data
 * Run with: ~/nodevenv/test.myicyemen.com/20/bin/node namecheap-setup.mjs
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

// ─── Helper: check if column exists ──────────────────────────────────────────
async function columnExists(table, column) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

// ─── Step 1: Migrate site_settings ───────────────────────────────────────────
console.log("📋 Migrating site_settings table...");

if (!(await columnExists("site_settings", "valueAr"))) {
  await conn.execute("ALTER TABLE `site_settings` ADD COLUMN `valueAr` text AFTER `key`");
  console.log("  ✓ Added column: valueAr");
}
if (!(await columnExists("site_settings", "valueEn"))) {
  await conn.execute("ALTER TABLE `site_settings` ADD COLUMN `valueEn` text AFTER `valueAr`");
  console.log("  ✓ Added column: valueEn");
}
if (!(await columnExists("site_settings", "category"))) {
  await conn.execute("ALTER TABLE `site_settings` ADD COLUMN `category` varchar(50) NOT NULL DEFAULT 'general' AFTER `valueEn`");
  console.log("  ✓ Added column: category");
}

// Copy old 'value' column to valueAr and valueEn if it exists
if (await columnExists("site_settings", "value")) {
  await conn.execute("UPDATE `site_settings` SET `valueAr` = `value`, `valueEn` = `value` WHERE `valueAr` IS NULL OR `valueAr` = ''");
  console.log("  ✓ Copied old value -> valueAr, valueEn");
}

// ─── Step 2: Migrate insurance_types ─────────────────────────────────────────
console.log("\n📋 Migrating insurance_types table...");

// Check if old nameAr/nameEn columns exist (old schema)
const hasNameAr = await columnExists("insurance_types", "nameAr");
const hasTitleAr = await columnExists("insurance_types", "titleAr");

if (hasNameAr && !hasTitleAr) {
  // Old schema: rename nameAr -> titleAr, nameEn -> titleEn
  await conn.execute("ALTER TABLE `insurance_types` CHANGE COLUMN `nameAr` `titleAr` varchar(255) NOT NULL");
  await conn.execute("ALTER TABLE `insurance_types` CHANGE COLUMN `nameEn` `titleEn` varchar(255) NOT NULL");
  console.log("  ✓ Renamed nameAr -> titleAr, nameEn -> titleEn");
} else if (!hasTitleAr) {
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `titleAr` varchar(255) NOT NULL DEFAULT '' AFTER `slug`");
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `titleEn` varchar(255) NOT NULL DEFAULT '' AFTER `titleAr`");
  console.log("  ✓ Added columns: titleAr, titleEn");
}

if (!(await columnExists("insurance_types", "descriptionAr"))) {
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `descriptionAr` text NOT NULL DEFAULT '' AFTER `titleEn`");
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `descriptionEn` text NOT NULL DEFAULT '' AFTER `descriptionAr`");
  console.log("  ✓ Added columns: descriptionAr, descriptionEn");
}
if (!(await columnExists("insurance_types", "imageUrl"))) {
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `imageUrl` text AFTER `descriptionEn`");
  console.log("  ✓ Added column: imageUrl");
}
if (!(await columnExists("insurance_types", "featuresAr"))) {
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `featuresAr` text AFTER `imageUrl`");
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `featuresEn` text AFTER `featuresAr`");
  console.log("  ✓ Added columns: featuresAr, featuresEn");
  // Copy old features if exists
  if (await columnExists("insurance_types", "features")) {
    await conn.execute("UPDATE `insurance_types` SET `featuresAr` = `features`, `featuresEn` = `features` WHERE `features` IS NOT NULL");
    console.log("  ✓ Copied old features -> featuresAr, featuresEn");
  }
}
if (!(await columnExists("insurance_types", "icon"))) {
  await conn.execute("ALTER TABLE `insurance_types` ADD COLUMN `icon` varchar(50) AFTER `featuresEn`");
  console.log("  ✓ Added column: icon");
}
if (!(await columnExists("insurance_types", "iconUrl"))) {
  // iconUrl exists in old schema - no action needed
} 

// ─── Step 3: Migrate branches ─────────────────────────────────────────────────
console.log("\n📋 Migrating branches table...");

if (!(await columnExists("branches", "imageUrl"))) {
  await conn.execute("ALTER TABLE `branches` ADD COLUMN `imageUrl` text AFTER `email`");
  console.log("  ✓ Added column: imageUrl");
}
if (!(await columnExists("branches", "mapUrl"))) {
  await conn.execute("ALTER TABLE `branches` ADD COLUMN `mapUrl` text AFTER `imageUrl`");
  console.log("  ✓ Added column: mapUrl");
}
if (!(await columnExists("branches", "isMain"))) {
  await conn.execute("ALTER TABLE `branches` ADD COLUMN `isMain` boolean NOT NULL DEFAULT false AFTER `mapUrl`");
  console.log("  ✓ Added column: isMain");
}

// ─── Step 4: Seed site_settings ──────────────────────────────────────────────
console.log("\n🌱 Seeding site_settings...");

const settings = [
  { key: "phone_main",        valueAr: "+967 1 234 567",                          valueEn: "+967 1 234 567",                          category: "contact" },
  { key: "phone_secondary",   valueAr: "+967 1 234 568",                          valueEn: "+967 1 234 568",                          category: "contact" },
  { key: "email_main",        valueAr: "info@marebinsurance.com",                 valueEn: "info@marebinsurance.com",                 category: "contact" },
  { key: "email_support",     valueAr: "support@marebinsurance.com",              valueEn: "support@marebinsurance.com",              category: "contact" },
  { key: "address_ar",        valueAr: "شارع الزبيري، صنعاء، اليمن",            valueEn: "Al-Zubairi Street, Sana'a, Yemen",        category: "contact" },
  { key: "address_en",        valueAr: "شارع الزبيري، صنعاء، اليمن",            valueEn: "Al-Zubairi Street, Sana'a, Yemen",        category: "contact" },
  { key: "social_facebook",   valueAr: "https://facebook.com/marebinsurance",     valueEn: "https://facebook.com/marebinsurance",     category: "social" },
  { key: "social_twitter",    valueAr: "https://twitter.com/marebinsurance",      valueEn: "https://twitter.com/marebinsurance",      category: "social" },
  { key: "social_linkedin",   valueAr: "https://linkedin.com/company/marebinsurance", valueEn: "https://linkedin.com/company/marebinsurance", category: "social" },
  { key: "social_youtube",    valueAr: "",                                        valueEn: "",                                        category: "social" },
  { key: "social_instagram",  valueAr: "",                                        valueEn: "",                                        category: "social" },
  { key: "company_name_ar",   valueAr: "شركة مأرب للتأمين",                      valueEn: "Mareb Insurance Company",                 category: "company" },
  { key: "company_name_en",   valueAr: "شركة مأرب للتأمين",                      valueEn: "Mareb Insurance Company",                 category: "company" },
  { key: "company_slogan_ar", valueAr: "نحمي مستقبلك",                           valueEn: "Protecting Your Future",                  category: "company" },
  { key: "company_slogan_en", valueAr: "نحمي مستقبلك",                           valueEn: "Protecting Your Future",                  category: "company" },
  { key: "company_founded",   valueAr: "1990",                                   valueEn: "1990",                                    category: "company" },
  { key: "company_license",   valueAr: "001/2024",                               valueEn: "001/2024",                                category: "company" },
];

for (const s of settings) {
  const [existing] = await conn.execute("SELECT id FROM site_settings WHERE `key` = ?", [s.key]);
  if (existing.length === 0) {
    await conn.execute(
      "INSERT INTO site_settings (`key`, valueAr, valueEn, category) VALUES (?, ?, ?, ?)",
      [s.key, s.valueAr, s.valueEn, s.category]
    );
    console.log(`  ✓ Inserted: ${s.key}`);
  } else {
    console.log(`  - Exists: ${s.key}`);
  }
}

// ─── Step 5: Seed insurance_types ────────────────────────────────────────────
console.log("\n🌱 Seeding insurance_types...");

const insuranceTypes = [
  { slug: "health",       titleAr: "التأمين الصحي",                  titleEn: "Health Insurance",          descriptionAr: "نقدم لكم أفضل حلول التأمين الصحي الشاملة التي تغطي جميع احتياجاتكم الطبية وتوفر لكم الرعاية الصحية المتميزة.", descriptionEn: "We offer the best comprehensive health insurance solutions that cover all your medical needs.", imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80", icon: "heart-pulse", featuresAr: "تغطية شاملة للعلاج في المستشفيات\nتغطية الأدوية والفحوصات الطبية\nتغطية العمليات الجراحية والطوارئ\nخدمات الرعاية الوقائية\nتغطية علاج الأسنان والعيون\nخدمة الطوارئ على مدار الساعة", featuresEn: "Comprehensive hospital coverage\nMedicines and medical tests coverage\nSurgical and emergency coverage\nPreventive care services\nDental and eye treatment\n24/7 emergency service", displayOrder: 1 },
  { slug: "car",          titleAr: "تأمين السيارات",                  titleEn: "Car Insurance",             descriptionAr: "نوفر لكم حماية شاملة لمركباتكم ضد جميع المخاطر المحتملة على الطرق.", descriptionEn: "We provide comprehensive protection for your vehicles against all potential road risks.", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80", icon: "car", featuresAr: "تغطية شاملة ضد الحوادث والتصادم\nتغطية الأضرار من الحريق والسرقة\nالمسؤولية تجاه الطرف الثالث\nخدمة المساعدة على الطريق\nتغطية الكوارث الطبيعية\nسرعة في معالجة المطالبات", featuresEn: "Comprehensive accident coverage\nFire and theft damage coverage\nThird party liability\nRoadside assistance\nNatural disaster coverage\nFast claims processing", displayOrder: 2 },
  { slug: "marine",       titleAr: "التأمين البحري",                  titleEn: "Marine Insurance",          descriptionAr: "حماية شاملة للبضائع والسفن أثناء النقل البحري.", descriptionEn: "Comprehensive protection for cargo and vessels during maritime transport.", imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80", icon: "anchor", featuresAr: "تغطية البضائع أثناء النقل البحري\nتأمين السفن والقوارب\nتغطية المسؤولية البحرية\nحماية ضد الكوارث البحرية\nتغطية التلف والفقدان\nخدمات استشارية متخصصة", featuresEn: "Cargo coverage during maritime transport\nShip and boat insurance\nMarine liability coverage\nProtection against marine disasters\nDamage and loss coverage\nSpecialized consulting services", displayOrder: 3 },
  { slug: "engineering",  titleAr: "التأمين الهندسي",                 titleEn: "Engineering Insurance",     descriptionAr: "حلول تأمينية متخصصة للمشاريع الهندسية والإنشائية.", descriptionEn: "Specialized insurance solutions for engineering and construction projects.", imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80", icon: "hard-hat", featuresAr: "تأمين المشاريع الإنشائية\nتغطية المعدات والآلات\nتأمين المسؤولية المهنية\nحماية ضد أخطار التشييد\nتغطية فترة الصيانة\nاستشارات هندسية متخصصة", featuresEn: "Construction project insurance\nEquipment and machinery coverage\nProfessional liability insurance\nProtection against construction risks\nMaintenance period coverage\nSpecialized engineering consultations", displayOrder: 4 },
  { slug: "energy",       titleAr: "تأمين الطاقة",                    titleEn: "Energy Insurance",          descriptionAr: "تغطية شاملة لمشاريع الطاقة والبنية التحتية.", descriptionEn: "Comprehensive coverage for energy projects and infrastructure.", imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80", icon: "zap", featuresAr: "تأمين مشاريع الطاقة المتجددة\nتغطية محطات الكهرباء\nتأمين خطوط النقل والتوزيع\nحماية المنشآت النفطية\nتغطية الأضرار التشغيلية\nخدمات إدارة المخاطر", featuresEn: "Renewable energy project insurance\nPower plant coverage\nTransmission line insurance\nOil facility protection\nOperational damage coverage\nRisk management services", displayOrder: 5 },
  { slug: "takaful",      titleAr: "التأمين التكافلي الإسلامي",       titleEn: "Islamic Takaful Insurance", descriptionAr: "حلول تأمينية متوافقة مع أحكام الشريعة الإسلامية.", descriptionEn: "Insurance solutions compliant with Islamic Sharia principles.", imageUrl: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=800&q=80", icon: "star", featuresAr: "منتجات متوافقة مع الشريعة الإسلامية\nنظام التكافل والتعاون\nاستثمارات حلال\nشفافية كاملة في العمليات\nإشراف هيئة شرعية\nتوزيع عادل للفوائض", featuresEn: "Sharia-compliant products\nTakaful and cooperation system\nHalal investments\nFull transparency\nSharia board supervision\nFair surplus distribution", displayOrder: 6 },
];

for (const it of insuranceTypes) {
  const [existing] = await conn.execute("SELECT id FROM insurance_types WHERE slug = ?", [it.slug]);
  if (existing.length === 0) {
    await conn.execute(
      `INSERT INTO insurance_types (slug, titleAr, titleEn, descriptionAr, descriptionEn, imageUrl, icon, featuresAr, featuresEn, displayOrder, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [it.slug, it.titleAr, it.titleEn, it.descriptionAr, it.descriptionEn, it.imageUrl, it.icon, it.featuresAr, it.featuresEn, it.displayOrder]
    );
    console.log(`  ✓ Inserted: ${it.slug}`);
  } else {
    // Update existing with new column values
    await conn.execute(
      `UPDATE insurance_types SET titleAr=?, titleEn=?, descriptionAr=?, descriptionEn=?, imageUrl=?, icon=?, featuresAr=?, featuresEn=?, displayOrder=? WHERE slug=?`,
      [it.titleAr, it.titleEn, it.descriptionAr, it.descriptionEn, it.imageUrl, it.icon, it.featuresAr, it.featuresEn, it.displayOrder, it.slug]
    );
    console.log(`  ↺ Updated: ${it.slug}`);
  }
}

// ─── Step 6: Seed branches ────────────────────────────────────────────────────
console.log("\n🌱 Seeding branches...");

const branches = [
  { nameAr: "فرع صنعاء الرئيسي", nameEn: "Sana'a Main Branch",  addressAr: "شارع الزبيري، صنعاء، اليمن",  addressEn: "Al-Zubairi Street, Sana'a, Yemen",   phone: "+967 1 234 567", email: "sanaa@marebinsurance.com",  imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", mapUrl: "https://maps.google.com/?q=Sanaa,Yemen",  isMain: 1, displayOrder: 1 },
  { nameAr: "فرع عدن",            nameEn: "Aden Branch",         addressAr: "شارع المعلا، عدن، اليمن",      addressEn: "Al-Mualla Street, Aden, Yemen",       phone: "+967 2 345 678", email: "aden@marebinsurance.com",   imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", mapUrl: "https://maps.google.com/?q=Aden,Yemen",   isMain: 0, displayOrder: 2 },
  { nameAr: "فرع تعز",            nameEn: "Taiz Branch",         addressAr: "شارع جمال، تعز، اليمن",        addressEn: "Jamal Street, Taiz, Yemen",           phone: "+967 4 456 789", email: "taiz@marebinsurance.com",   imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", mapUrl: "https://maps.google.com/?q=Taiz,Yemen",   isMain: 0, displayOrder: 3 },
];

for (const b of branches) {
  const [existing] = await conn.execute("SELECT id FROM branches WHERE nameAr = ?", [b.nameAr]);
  if (existing.length === 0) {
    await conn.execute(
      `INSERT INTO branches (nameAr, nameEn, addressAr, addressEn, phone, email, imageUrl, mapUrl, isMain, displayOrder, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [b.nameAr, b.nameEn, b.addressAr, b.addressEn, b.phone, b.email, b.imageUrl, b.mapUrl, b.isMain, b.displayOrder]
    );
    console.log(`  ✓ Inserted: ${b.nameAr}`);
  } else {
    await conn.execute(
      `UPDATE branches SET imageUrl=?, mapUrl=?, isMain=? WHERE nameAr=?`,
      [b.imageUrl, b.mapUrl, b.isMain, b.nameAr]
    );
    console.log(`  ↺ Updated: ${b.nameAr}`);
  }
}

await conn.end();
console.log("\n✅ Setup complete! Restart your Node.js app from cPanel.");
