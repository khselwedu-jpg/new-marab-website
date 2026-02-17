import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed Hero Slides
  await db.insert(schema.heroSlides).values([
    {
      titleAr: "حصن الأمان والضمان",
      titleEn: "Fortress of Security and Guarantee",
      subtitleAr: "نحن نوفر لك أفضل حلول التأمين الشاملة لحماية مستقبلك وأعمالك",
      subtitleEn: "We provide you with the best comprehensive insurance solutions to protect your future and business",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
      ctaTextAr: "احصل على عرض تأمين",
      ctaTextEn: "Get Insurance Quote",
      ctaLink: "/contact",
      displayOrder: 1,
      isActive: true,
    },
    {
      titleAr: "شريكك الموثوق في التأمين",
      titleEn: "Your Trusted Insurance Partner",
      subtitleAr: "أكثر من 15 عاماً من الخبرة في خدمة عملائنا",
      subtitleEn: "Over 15 years of experience serving our clients",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80",
      ctaTextAr: "تعرف على خدماتنا",
      ctaTextEn: "Explore Our Services",
      ctaLink: "/about/who-we-are",
      displayOrder: 2,
      isActive: true,
    },
    {
      titleAr: "حلول تأمينية متكاملة",
      titleEn: "Comprehensive Insurance Solutions",
      subtitleAr: "نغطي جميع احتياجاتك التأمينية من الصحة إلى السيارات والمشاريع",
      subtitleEn: "We cover all your insurance needs from health to vehicles and projects",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
      ctaTextAr: "استكشف أنواع التأمين",
      ctaTextEn: "Explore Insurance Types",
      ctaLink: "/insurance/health",
      displayOrder: 3,
      isActive: true,
    },
  ]);
  console.log("✅ Hero slides seeded");

  // Seed Statistics
  await db.insert(schema.statistics).values([
    { labelAr: "عميل راضٍ", labelEn: "Satisfied Clients", value: 25000, suffix: "+", displayOrder: 1, isActive: true },
    { labelAr: "شريك موثوق", labelEn: "Trusted Partners", value: 60, suffix: "+", displayOrder: 2, isActive: true },
    { labelAr: "سنة خبرة", labelEn: "Years Experience", value: 15, suffix: "+", displayOrder: 3, isActive: true },
    { labelAr: "نسبة الرضا", labelEn: "Satisfaction Rate", value: 98, suffix: "%", displayOrder: 4, isActive: true },
  ]);
  console.log("✅ Statistics seeded");

  // Seed Why Us Features
  await db.insert(schema.whyUsFeatures).values([
    {
      titleAr: "خبرة واسعة",
      titleEn: "Extensive Experience",
      descriptionAr: "أكثر من 15 عاماً في مجال التأمين",
      descriptionEn: "Over 15 years in the insurance industry",
      icon: "Award",
      displayOrder: 1,
      isActive: true,
    },
    {
      titleAr: "تغطية شاملة",
      titleEn: "Comprehensive Coverage",
      descriptionAr: "نوفر جميع أنواع التأمين التي تحتاجها",
      descriptionEn: "We provide all types of insurance you need",
      icon: "Shield",
      displayOrder: 2,
      isActive: true,
    },
    {
      titleAr: "خدمة سريعة",
      titleEn: "Fast Service",
      descriptionAr: "معالجة سريعة للمطالبات والاستفسارات",
      descriptionEn: "Quick processing of claims and inquiries",
      icon: "Zap",
      displayOrder: 3,
      isActive: true,
    },
    {
      titleAr: "دعم على مدار الساعة",
      titleEn: "24/7 Support",
      descriptionAr: "فريق دعم متاح دائماً لمساعدتك",
      descriptionEn: "Support team always available to help you",
      icon: "HeadphonesIcon",
      displayOrder: 4,
      isActive: true,
    },
  ]);
  console.log("✅ Why Us features seeded");

  // Seed About Content
  await db.insert(schema.aboutContent).values([
    {
      titleAr: "من نحن",
      titleEn: "Who We Are",
      contentAr: "شركة مأرب اليمنية للتأمين هي إحدى الشركات الرائدة في مجال التأمين باليمن، تأسست بهدف تقديم خدمات تأمينية متميزة تلبي احتياجات السوق اليمني.",
      contentEn: "Mareb Insurance Company is one of the leading insurance companies in Yemen, established to provide distinguished insurance services that meet the needs of the Yemeni market.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      section: "main",
    },
  ]);
  console.log("✅ About content seeded");

  console.log("🎉 Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
