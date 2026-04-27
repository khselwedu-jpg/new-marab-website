import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, adminAccounts, AdminAccount } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Use mysql2 Pool with explicit utf8mb4 charset to support Arabic text
      const pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        charset: "utf8mb4",
        connectionLimit: 5,
      });
      // Set charset on every new connection from the pool
      pool.on("connection", (conn: any) => {
        conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
      });
      _db = drizzle(pool as any);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Admin account helpers
export async function getAdminByUsername(username: string): Promise<AdminAccount | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminAccounts).where(eq(adminAccounts.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAdminLastSignedIn(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(adminAccounts).set({ lastSignedIn: new Date() }).where(eq(adminAccounts.id, id));
}

export async function createAdminAccount(username: string, passwordHash: string, name?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(adminAccounts).values({ username, passwordHash, name: name || null });
}

export async function seedDefaultAdmin(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    // Check if any admin exists
    const existing = await db.select().from(adminAccounts).limit(1);
    if (existing.length > 0) return; // Already seeded
    // Create default admin: admin / Admin@2024
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("Admin@2024", 10);
    await db.insert(adminAccounts).values({
      username: "admin",
      passwordHash: hash,
      name: "مدير النظام",
    });
    console.log("[seed] Default admin account created: admin / Admin@2024");
  } catch (err) {
    console.error("[seed] Failed to seed admin:", err);
  }
}
