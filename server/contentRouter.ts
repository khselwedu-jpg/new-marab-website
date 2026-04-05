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
  dynamicPages,
  teamMembers,
  mediaItems,
} from "../drizzle/schema";
import { eq, asc, desc } from "drizzle-orm";
import { z } from "zod";

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

  insuranceBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const rows = await (await db()).select().from(insuranceTypes)
        .where(eq(insuranceTypes.slug, input.slug));
      return rows[0] ?? null;
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

  partnersByCategory: publicProcedure
    .input(z.object({ category: z.enum(["reinsurer", "broker", "medical", "other"]) }))
    .query(async ({ input }) => {
      return (await db()).select().from(partners)
        .where(eq(partners.category, input.category))
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

  newsById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await (await db()).select().from(news)
        .where(eq(news.id, input.id));
      return rows[0] ?? null;
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
    return rows;
  }),

  // Dynamic pages - fetch by slug
  pageBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const rows = await (await db()).select().from(dynamicPages)
        .where(eq(dynamicPages.slug, input.slug));
      return rows[0] ?? null;
    }),

  // Team members
  teamMembers: publicProcedure.query(async () => {
    return (await db()).select().from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(asc(teamMembers.displayOrder));
  }),

  // Media items by type
  mediaByType: publicProcedure
    .input(z.object({ type: z.enum(["photo", "video", "conference", "event"]) }))
    .query(async ({ input }) => {
      return (await db()).select().from(mediaItems)
        .where(eq(mediaItems.mediaType, input.type))
        .orderBy(desc(mediaItems.publishDate));
    }),

  allMedia: publicProcedure.query(async () => {
    return (await db()).select().from(mediaItems)
      .where(eq(mediaItems.isActive, true))
      .orderBy(desc(mediaItems.publishDate));
  }),
});
