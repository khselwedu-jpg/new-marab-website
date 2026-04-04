import { COOKIE_NAME } from "@shared/const";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./admin/adminRouter";
import * as db from "./db";
import { ONE_YEAR_MS } from "@shared/const";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    adminLogin: publicProcedure
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const admin = await db.getAdminByUsername(input.username);
        if (!admin || !admin.isActive) {
          throw new Error("Invalid username or password");
        }
        const valid = await bcrypt.compare(input.password, admin.passwordHash);
        if (!valid) {
          throw new Error("Invalid username or password");
        }
        await db.updateAdminLastSignedIn(admin.id);
        // Create a JWT session cookie
        // Use a fallback secret if JWT_SECRET is not set (should always be set in production)
        const jwtSecret = ENV.cookieSecret || "mareb-insurance-default-secret-change-me";
        const secret = new TextEncoder().encode(jwtSecret);
        // Use a fallback appId if VITE_APP_ID is not set
        const appId = ENV.appId || "mareb-insurance";
        const token = await new SignJWT({
          openId: `admin_${admin.id}`,
          appId,
          name: admin.name || admin.username,
          isAdmin: true,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("365d")
          .sign(secret);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        // Ensure admin user exists in users table
        await db.upsertUser({
          openId: `admin_${admin.id}`,
          name: admin.name || admin.username,
          email: null,
          loginMethod: "local",
          role: "admin",
          lastSignedIn: new Date(),
        });
        return { success: true, name: admin.name || admin.username };
      }),
  }),

  // Admin CMS routes
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
