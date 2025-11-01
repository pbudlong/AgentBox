import { type User, type InsertUser, type DemoSession, type InsertDemoSession, demoSessions } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Demo session methods
  createDemoSession(session: InsertDemoSession): Promise<DemoSession>;
  getDemoSessionByInboxId(inboxId: string): Promise<DemoSession | undefined>;
  getLatestDemoSession(): Promise<DemoSession | undefined>;
  incrementExchangeCount(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDemoSession(session: InsertDemoSession): Promise<DemoSession> {
    const result = await db.insert(demoSessions).values(session).returning();
    return result[0];
  }

  async getDemoSessionByInboxId(inboxId: string): Promise<DemoSession | undefined> {
    const results = await db
      .select()
      .from(demoSessions)
      .where(
        sql`${demoSessions.sellerInboxId} = ${inboxId} OR ${demoSessions.buyerInboxId} = ${inboxId}`
      )
      .limit(1);
    return results[0];
  }

  async getLatestDemoSession(): Promise<DemoSession | undefined> {
    const results = await db
      .select()
      .from(demoSessions)
      .orderBy(desc(demoSessions.createdAt))
      .limit(1);
    return results[0];
  }

  async incrementExchangeCount(sessionId: string): Promise<void> {
    await db
      .update(demoSessions)
      .set({ exchangeCount: sql`${demoSessions.exchangeCount} + 1` })
      .where(eq(demoSessions.id, sessionId));
  }
}

export const storage = new MemStorage();
