import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  heroSlides, 
  insuranceTypes, 
  statistics, 
  partners, 
  branches, 
  news, 
  contactSubmissions,
  whyUsFeatures,
  aboutContent,
  siteSettings
} from "../../drizzle/schema";
import { count, eq } from "drizzle-orm";

// Middleware to check admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Dashboard statistics
  getDashboardStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const [
      heroSlidesCount,
      insuranceTypesCount,
      statisticsCount,
      partnersCount,
      branchesCount,
      newsCount,
      contactSubmissionsCount,
      whyUsFeaturesCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(heroSlides),
      db.select({ count: count() }).from(insuranceTypes),
      db.select({ count: count() }).from(statistics),
      db.select({ count: count() }).from(partners),
      db.select({ count: count() }).from(branches),
      db.select({ count: count() }).from(news),
      db.select({ count: count() }).from(contactSubmissions),
      db.select({ count: count() }).from(whyUsFeatures),
    ]);

    return {
      heroSlides: heroSlidesCount[0]?.count || 0,
      insuranceTypes: insuranceTypesCount[0]?.count || 0,
      statistics: statisticsCount[0]?.count || 0,
      partners: partnersCount[0]?.count || 0,
      branches: branchesCount[0]?.count || 0,
      news: newsCount[0]?.count || 0,
      contactSubmissions: contactSubmissionsCount[0]?.count || 0,
      whyUsFeatures: whyUsFeaturesCount[0]?.count || 0,
    };
  }),

  // Hero Slides
  heroSlides: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(heroSlides).orderBy(heroSlides.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(heroSlides).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(heroSlides).set(data).where(eq(heroSlides.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(heroSlides).where(eq(heroSlides.id, input.id));
      return { success: true };
    }),
  }),

  // Insurance Types
  insuranceTypes: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(insuranceTypes).orderBy(insuranceTypes.displayOrder);
    }),
  }),

  // Statistics
  statistics: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(statistics).orderBy(statistics.displayOrder);
    }),
  }),

  // Partners
  partners: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(partners).orderBy(partners.displayOrder);
    }),
  }),

  // Branches
  branches: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(branches).orderBy(branches.displayOrder);
    }),
  }),

  // News
  news: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(news).orderBy(news.publishDate);
    }),
  }),

  // Contact Submissions
  contacts: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
    }),
    updateStatus: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(contactSubmissions).set({ status: input.status }).where(eq(contactSubmissions.id, input.id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(contactSubmissions).where(eq(contactSubmissions.id, input.id));
      return { success: true };
    }),
  }),

  // Why Us Features
  whyUs: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(whyUsFeatures).orderBy(whyUsFeatures.displayOrder);
    }),
  }),

  // About Content
  about: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(aboutContent);
    }),
  }),

  // Site Settings
  settings: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(siteSettings);
    }),
  }),
});
