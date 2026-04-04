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

  // Hero Slides - Full CRUD
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

  // Insurance Types - Full CRUD
  insuranceTypes: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(insuranceTypes).orderBy(insuranceTypes.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(insuranceTypes).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(insuranceTypes).set(data).where(eq(insuranceTypes.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(insuranceTypes).where(eq(insuranceTypes.id, input.id));
      return { success: true };
    }),
  }),

  // Statistics - Full CRUD
  statistics: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(statistics).orderBy(statistics.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(statistics).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(statistics).set(data).where(eq(statistics.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(statistics).where(eq(statistics.id, input.id));
      return { success: true };
    }),
  }),

  // Partners - Full CRUD
  partners: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(partners).orderBy(partners.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(partners).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(partners).set(data).where(eq(partners.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(partners).where(eq(partners.id, input.id));
      return { success: true };
    }),
  }),

  // Branches - Full CRUD
  branches: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(branches).orderBy(branches.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(branches).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(branches).set(data).where(eq(branches.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(branches).where(eq(branches.id, input.id));
      return { success: true };
    }),
  }),

  // News - Full CRUD
  news: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(news).orderBy(news.publishDate);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const data = { ...input };
      if (data.publishDate && typeof data.publishDate === 'string') {
        data.publishDate = new Date(data.publishDate);
      }
      await db.insert(news).values(data);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      if (data.publishDate && typeof data.publishDate === 'string') {
        data.publishDate = new Date(data.publishDate);
      }
      await db.update(news).set(data).where(eq(news.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(news).where(eq(news.id, input.id));
      return { success: true };
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

  // Why Us Features - Full CRUD
  whyUs: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(whyUsFeatures).orderBy(whyUsFeatures.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(whyUsFeatures).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(whyUsFeatures).set(data).where(eq(whyUsFeatures.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(whyUsFeatures).where(eq(whyUsFeatures.id, input.id));
      return { success: true };
    }),
  }),

  // About Content - Full CRUD
  about: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(aboutContent);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(aboutContent).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(aboutContent).set(data).where(eq(aboutContent.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(aboutContent).where(eq(aboutContent.id, input.id));
      return { success: true };
    }),
  }),

  // Site Settings - Upsert
  settings: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(siteSettings);
    }),
    upsert: adminProcedure.input((val: any) => val).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // input is array of { key, valueAr, valueEn, category }
      const items = Array.isArray(input) ? input : [input];
      for (const item of items) {
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, item.key));
        if (existing.length > 0) {
          await db.update(siteSettings).set({
            valueAr: item.valueAr,
            valueEn: item.valueEn,
            category: item.category || "general",
          }).where(eq(siteSettings.key, item.key));
        } else {
          await db.insert(siteSettings).values(item);
        }
      }
      return { success: true };
    }),
  }),
});
