/**
 * Public content router - no authentication required
 * Used by the frontend to fetch all dynamic content from the database
 */
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  heroSlides,
  insuranceTypes,
  statistics,
  partners,
  branches,
  news,
  whyUsFeatures,
  aboutContent,
  siteSettings,
} from "../drizzle/schema";
import { eq, asc, desc } from "drizzle-orm";

async function db() {
  const d = await getDb();
  if (!d) throw new Error("Database not available");
  return d;
}

export const contentRouter = router({
  heroSlides: publicProcedure.query(async () => {
    return (await db()).select().from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(asc(heroSlides.displayOrder));
  }),

  insuranceTypes: publicProcedure.query(async () => {
    return (await db()).select().from(insuranceTypes)
      .where(eq(insuranceTypes.isActive, true))
      .orderBy(asc(insuranceTypes.displayOrder));
  }),

  statistics: publicProcedure.query(async () => {
    return (await db()).select().from(statistics)
      .where(eq(statistics.isActive, true))
      .orderBy(asc(statistics.displayOrder));
  }),

  partners: publicProcedure.query(async () => {
    return (await db()).select().from(partners)
      .where(eq(partners.isActive, true))
      .orderBy(asc(partners.displayOrder));
  }),

  branches: publicProcedure.query(async () => {
    return (await db()).select().from(branches)
      .where(eq(branches.isActive, true))
      .orderBy(asc(branches.displayOrder));
  }),

  news: publicProcedure.query(async () => {
    return (await db()).select().from(news)
      .where(eq(news.isActive, true))
      .orderBy(desc(news.publishDate));
  }),

  whyUs: publicProcedure.query(async () => {
    return (await db()).select().from(whyUsFeatures)
      .where(eq(whyUsFeatures.isActive, true))
      .orderBy(asc(whyUsFeatures.displayOrder));
  }),

  about: publicProcedure.query(async () => {
    const rows = await (await db()).select().from(aboutContent);
    return rows[0] ?? null;
  }),

  settings: publicProcedure.query(async () => {
    const rows = await (await db()).select().from(siteSettings);
    // Return array of settings with both AR and EN values
    return rows;
  }),
});
