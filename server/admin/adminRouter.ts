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
  siteSettings,
  dynamicPages,
  teamMembers,
  mediaItems,
  adminAccounts,
} from "../../drizzle/schema";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

  // Dynamic Pages CRUD
  pages: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(dynamicPages).orderBy(dynamicPages.slug);
    }),
    getBySlug: adminProcedure.input((val: any) => val).query(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db.select().from(dynamicPages).where(eq(dynamicPages.slug, input.slug));
      return rows[0] ?? null;
    }),
    upsert: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db.select().from(dynamicPages).where(eq(dynamicPages.slug, input.slug));
      if (existing.length > 0) {
        await db.update(dynamicPages).set({
          titleAr: input.titleAr,
          titleEn: input.titleEn,
          contentAr: input.contentAr,
          contentEn: input.contentEn,
          imageUrl: input.imageUrl,
          metaDescriptionAr: input.metaDescriptionAr,
          metaDescriptionEn: input.metaDescriptionEn,
          isActive: input.isActive ?? true,
        }).where(eq(dynamicPages.slug, input.slug));
      } else {
        await db.insert(dynamicPages).values(input);
      }
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(dynamicPages).where(eq(dynamicPages.id, input.id));
      return { success: true };
    }),
  }),

  // Team Members CRUD
  team: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(teamMembers).orderBy(teamMembers.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(teamMembers).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(teamMembers).where(eq(teamMembers.id, input.id));
      return { success: true };
    }),
  }),

  // User Management CRUD
  users: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select({
        id: adminAccounts.id,
        username: adminAccounts.username,
        name: adminAccounts.name,
        isActive: adminAccounts.isActive,
        lastSignedIn: adminAccounts.lastSignedIn,
        createdAt: adminAccounts.createdAt,
      }).from(adminAccounts);
      return rows;
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db.select().from(adminAccounts).where(eq(adminAccounts.username, input.username)).limit(1);
      if (existing.length > 0) throw new TRPCError({ code: "CONFLICT", message: "اسم المستخدم موجود مسبقاً" });
      const hash = await bcrypt.hash(input.password, 10);
      await db.insert(adminAccounts).values({ username: input.username, passwordHash: hash, name: input.name || null });
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.username !== undefined) updateData.username = data.username;
      await db.update(adminAccounts).set(updateData).where(eq(adminAccounts.id, id));
      return { success: true };
    }),
    changePassword: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const hash = await bcrypt.hash(input.newPassword, 10);
      await db.update(adminAccounts).set({ passwordHash: hash }).where(eq(adminAccounts.id, input.id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Prevent deleting the last admin
      const allAdmins = await db.select().from(adminAccounts);
      if (allAdmins.length <= 1) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف المستخدم الأخير" });
      await db.delete(adminAccounts).where(eq(adminAccounts.id, input.id));
      return { success: true };
    }),
  }),

  // Backup - Export all data
  backup: router({
    export: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const [heroSlidesData, insuranceTypesData, statisticsData, partnersData, branchesData, newsData, contactSubmissionsData, whyUsFeaturesData, aboutContentData, siteSettingsData, dynamicPagesData, teamMembersData] = await Promise.all([
        db.select().from(heroSlides),
        db.select().from(insuranceTypes),
        db.select().from(statistics),
        db.select().from(partners),
        db.select().from(branches),
        db.select().from(news),
        db.select().from(contactSubmissions),
        db.select().from(whyUsFeatures),
        db.select().from(aboutContent),
        db.select().from(siteSettings),
        db.select().from(dynamicPages),
        db.select().from(teamMembers),
      ]);
      return {
        exportedAt: new Date().toISOString(),
        version: "v18",
        data: {
          heroSlides: heroSlidesData,
          insuranceTypes: insuranceTypesData,
          statistics: statisticsData,
          partners: partnersData,
          branches: branchesData,
          news: newsData,
          contactSubmissions: contactSubmissionsData,
          whyUsFeatures: whyUsFeaturesData,
          aboutContent: aboutContentData,
          siteSettings: siteSettingsData,
          dynamicPages: dynamicPagesData,
          teamMembers: teamMembersData,
        },
      };
    }),
  }),

  // Media Items CRUD
  media: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(mediaItems).orderBy(mediaItems.displayOrder);
    }),
    create: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(mediaItems).values(input);
      return { success: true };
    }),
    update: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(mediaItems).set(data).where(eq(mediaItems.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input((val: any) => val).mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(mediaItems).where(eq(mediaItems.id, input.id));
      return { success: true };
    }),
  }),
});
