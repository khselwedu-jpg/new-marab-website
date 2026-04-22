/**
 * Hero Slides Seed Script for Namecheap
 * Adds 5 professional insurance-themed hero slides
 * Run with: ~/nodevenv/test.myicyemen.com/20/bin/node namecheap-seed-slides.mjs
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

// ─── Hero Slides ──────────────────────────────────────────────────────────────
// Using high-quality Unsplash images related to insurance themes

const slides = [
  {
    titleAr: "حصن الأمان والضمان",
    titleEn: "Your Shield of Security",
    subtitleAr: "نحن نوفر لك ولعائلتك وأعمالك الحماية الشاملة التي تستحقونها — بثقة وموثوقية منذ عقود",
    subtitleEn: "We provide you, your family, and your business with the comprehensive protection you deserve — trusted for decades",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=85&fit=crop",
    ctaTextAr: "احصل على عرض تأمين",
    ctaTextEn: "Get a Quote",
    ctaLink: "/contact",
    displayOrder: 1,
  },
  {
    titleAr: "تأمين صحي شامل لعائلتك",
    titleEn: "Comprehensive Health Insurance",
    subtitleAr: "صحتك وصحة عائلتك هي أثمن ما تملك — خططنا الصحية تغطي كل احتياجاتك الطبية بأفضل الأسعار",
    subtitleEn: "Your health and your family's health is your most precious asset — our health plans cover all your medical needs",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=85&fit=crop",
    ctaTextAr: "استكشف التأمين الصحي",
    ctaTextEn: "Explore Health Insurance",
    ctaLink: "/insurance/health",
    displayOrder: 2,
  },
  {
    titleAr: "حماية مركبتك على الطريق",
    titleEn: "Protect Your Vehicle on the Road",
    subtitleAr: "تأمين سيارتك ضد جميع المخاطر — حوادث، سرقة، حريق — مع خدمة مساعدة على الطريق على مدار الساعة",
    subtitleEn: "Insure your vehicle against all risks — accidents, theft, fire — with 24/7 roadside assistance",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=85&fit=crop",
    ctaTextAr: "تأمين سيارتك الآن",
    ctaTextEn: "Insure Your Car Now",
    ctaLink: "/insurance/car",
    displayOrder: 3,
  },
  {
    titleAr: "تأمين أعمالك وممتلكاتك",
    titleEn: "Protect Your Business & Assets",
    subtitleAr: "حلول تأمينية متكاملة للمشاريع التجارية والصناعية — نحمي استثماراتك ونضمن استمرارية أعمالك",
    subtitleEn: "Comprehensive insurance solutions for commercial and industrial projects — protecting your investments and business continuity",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85&fit=crop",
    ctaTextAr: "تعرف على خططنا",
    ctaTextEn: "Explore Our Plans",
    ctaLink: "/insurance/engineering",
    displayOrder: 4,
  },
  {
    titleAr: "تأمين تكافلي متوافق مع الشريعة",
    titleEn: "Sharia-Compliant Takaful Insurance",
    subtitleAr: "منتجات تأمينية إسلامية قائمة على مبدأ التعاون والتكافل — شفافة، عادلة، ومتوافقة مع أحكام الشريعة الإسلامية",
    subtitleEn: "Islamic insurance products based on mutual cooperation and solidarity — transparent, fair, and Sharia-compliant",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=85&fit=crop",
    ctaTextAr: "اكتشف التأمين التكافلي",
    ctaTextEn: "Discover Takaful",
    ctaLink: "/insurance/takaful",
    displayOrder: 5,
  },
];

console.log("🖼️  Seeding hero_slides...");

// Check if slides already exist
const [existing] = await conn.execute("SELECT COUNT(*) as cnt FROM hero_slides");
const count = existing[0].cnt;

if (count > 0) {
  console.log(`  ℹ️  Found ${count} existing slides. Updating all slides...`);
  // Delete existing and re-insert for clean update
  await conn.execute("DELETE FROM hero_slides");
  console.log("  ✓ Cleared old slides");
}

for (const slide of slides) {
  await conn.execute(
    `INSERT INTO hero_slides (titleAr, titleEn, subtitleAr, subtitleEn, imageUrl, ctaTextAr, ctaTextEn, ctaLink, displayOrder, isActive)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [slide.titleAr, slide.titleEn, slide.subtitleAr, slide.subtitleEn, slide.imageUrl, slide.ctaTextAr, slide.ctaTextEn, slide.ctaLink, slide.displayOrder]
  );
  console.log(`  ✓ Added slide ${slide.displayOrder}: ${slide.titleAr}`);
}

// ─── Also update insurance type images with better photos ─────────────────────
console.log("\n🖼️  Updating insurance type images...");

const insuranceImages = [
  { slug: "health",       imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&fit=crop" },
  { slug: "car",          imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80&fit=crop" },
  { slug: "marine",       imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80&fit=crop" },
  { slug: "engineering",  imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80&fit=crop" },
  { slug: "energy",       imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&fit=crop" },
  { slug: "takaful",      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&fit=crop" },
];

for (const item of insuranceImages) {
  const [rows] = await conn.execute("SELECT id FROM insurance_types WHERE slug = ?", [item.slug]);
  if (rows.length > 0) {
    await conn.execute("UPDATE insurance_types SET imageUrl = ? WHERE slug = ?", [item.imageUrl, item.slug]);
    console.log(`  ✓ Updated image for: ${item.slug}`);
  }
}

await conn.end();
console.log("\n✅ Done! Restart your Node.js app from cPanel → Node.js App → Restart");
