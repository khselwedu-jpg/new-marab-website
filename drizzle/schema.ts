import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Hero slider slides
 */
export const heroSlides = mysqlTable("hero_slides", {
  id: int("id").autoincrement().primaryKey(),
  titleAr: text("titleAr").notNull(),
  titleEn: text("titleEn").notNull(),
  subtitleAr: text("subtitleAr"),
  subtitleEn: text("subtitleEn"),
  imageUrl: text("imageUrl").notNull(),
  ctaTextAr: varchar("ctaTextAr", { length: 100 }),
  ctaTextEn: varchar("ctaTextEn", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 255 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = typeof heroSlides.$inferInsert;

/**
 * Insurance types
 */
export const insuranceTypes = mysqlTable("insurance_types", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  imageUrl: text("imageUrl").notNull(),
  icon: varchar("icon", { length: 50 }),
  featuresAr: text("featuresAr"), // JSON array of features
  featuresEn: text("featuresEn"), // JSON array of features
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InsuranceType = typeof insuranceTypes.$inferSelect;
export type InsertInsuranceType = typeof insuranceTypes.$inferInsert;

/**
 * Company statistics
 */
export const statistics = mysqlTable("statistics", {
  id: int("id").autoincrement().primaryKey(),
  labelAr: varchar("labelAr", { length: 255 }).notNull(),
  labelEn: varchar("labelEn", { length: 255 }).notNull(),
  value: int("value").notNull(),
  suffix: varchar("suffix", { length: 10 }),
  prefix: varchar("prefix", { length: 10 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = typeof statistics.$inferInsert;

/**
 * Partners
 */
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  logoUrl: text("logoUrl").notNull(),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  category: mysqlEnum("category", ["reinsurer", "broker", "medical", "other"]).default("other").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

/**
 * Branch locations
 */
export const branches = mysqlTable("branches", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  addressAr: text("addressAr").notNull(),
  addressEn: text("addressEn").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  imageUrl: text("imageUrl"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  mapUrl: text("mapUrl"),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Branch = typeof branches.$inferSelect;
export type InsertBranch = typeof branches.$inferInsert;

/**
 * News and events
 */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  titleAr: text("titleAr").notNull(),
  titleEn: text("titleEn").notNull(),
  summaryAr: text("summaryAr").notNull(),
  summaryEn: text("summaryEn").notNull(),
  contentAr: text("contentAr"),
  contentEn: text("contentEn"),
  imageUrl: text("imageUrl").notNull(),
  category: mysqlEnum("category", ["news", "event", "announcement"]).default("news").notNull(),
  publishDate: timestamp("publishDate").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

/**
 * Contact form submissions
 */
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  messageType: mysqlEnum("messageType", ["inquiry", "quote", "complaint", "suggestion"]).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Site settings
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  valueAr: text("valueAr"),
  valueEn: text("valueEn"),
  category: varchar("category", { length: 50 }).default("general").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * About section content
 */
export const aboutContent = mysqlTable("about_content", {
  id: int("id").autoincrement().primaryKey(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  contentAr: text("contentAr").notNull(),
  contentEn: text("contentEn").notNull(),
  imageUrl: text("imageUrl"),
  section: varchar("section", { length: 50 }).default("main").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = typeof aboutContent.$inferInsert;

/**
 * Why choose us features
 */
export const whyUsFeatures = mysqlTable("why_us_features", {
  id: int("id").autoincrement().primaryKey(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhyUsFeature = typeof whyUsFeatures.$inferSelect;
export type InsertWhyUsFeature = typeof whyUsFeatures.$inferInsert;
