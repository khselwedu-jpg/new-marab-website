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
  contactSubmissions,
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

  // List all dynamic pages that have content (for navigation filtering)
  pagesWithContent: publicProcedure.query(async () => {
    const rows = await (await db()).select({
      id: dynamicPages.id,
      slug: dynamicPages.slug,
      titleAr: dynamicPages.titleAr,
      titleEn: dynamicPages.titleEn,
    }).from(dynamicPages)
      .where(eq(dynamicPages.isActive, true));
    // Only return pages that have actual content
    return rows.filter(p => {
      // We'll check content in the full query below
      return true;
    });
  }),

  // List slugs of dynamic pages that have content (Arabic or English)
  pagesWithContentSlugs: publicProcedure.query(async () => {
    const rows = await (await db()).select().from(dynamicPages)
      .where(eq(dynamicPages.isActive, true));
    // Return slugs of pages that have non-empty content
    return rows
      .filter(p => (p.contentAr && p.contentAr.trim().length > 0) || (p.contentEn && p.contentEn.trim().length > 0))
      .map(p => p.slug);
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

  // Submit contact form
  submitContact: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      subject: z.string().min(1),
      messageType: z.enum(["inquiry", "quote", "complaint", "suggestion"]),
      message: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await (await db()).insert(contactSubmissions).values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        messageType: input.messageType,
        message: input.message,
        status: "new",
      });
      return { success: true };
    }),
});
