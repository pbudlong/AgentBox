import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Demo sessions table to persist inbox IDs across server restarts
export const demoSessions = pgTable("demo_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerInboxId: text("seller_inbox_id").notNull(),
  sellerEmail: text("seller_email").notNull(),
  buyerInboxId: text("buyer_inbox_id").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  exchangeCount: integer("exchange_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertDemoSessionSchema = createInsertSchema(demoSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertDemoSession = z.infer<typeof insertDemoSessionSchema>;
export type DemoSession = typeof demoSessions.$inferSelect;

// Processed webhook events table to prevent duplicate processing after server restarts
export const processedWebhookEvents = pgTable("processed_webhook_events", {
  eventId: text("event_id").primaryKey(),
  processedAt: text("processed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertProcessedWebhookEventSchema = createInsertSchema(processedWebhookEvents).omit({
  processedAt: true,
});

export type InsertProcessedWebhookEvent = z.infer<typeof insertProcessedWebhookEventSchema>;
export type ProcessedWebhookEvent = typeof processedWebhookEvents.$inferSelect;

// Development logs table to persist debugging logs across server restarts
export const developmentLogs = pgTable("development_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  agent: text("agent").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(),
  timestamp: text("timestamp").notNull(),
  details: text("details"),
  endpoint: text("endpoint"),
  method: text("method"),
  statusCode: integer("status_code"),
  duration: integer("duration"),
});

export const insertDevelopmentLogSchema = createInsertSchema(developmentLogs).omit({
  id: true,
});

export type InsertDevelopmentLog = z.infer<typeof insertDevelopmentLogSchema>;
export type DevelopmentLog = typeof developmentLogs.$inferSelect;

// AgentBox types
export type Party = "seller" | "buyer";
export type Status = "collecting" | "approved" | "declined" | "scheduled";
export type BccStage = "never" | "clarify" | "confirm";

export interface Profile {
  handle: string;
  company: string;
  industry: string[];
  sizeRange: [number, number];
  geo?: string;
  stack?: string[];
  budgetBand?: string;
  timing?: string;
  mustHave?: string[];
}

export interface ThreadState {
  threadId: string;
  seller: Profile;
  buyer: Profile;
  status: Status;
  lastScore: number;
  missing: string[];
  summary?: string;
  event?: { 
    whenISO: string; 
    durationMins: number; 
    title: string; 
    icsUrl?: string; 
    gcalUrl?: string 
  };
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  threadId: string;
}

export interface ScoringConfig {
  weights: Record<string, number>;
  thresholdClarify: number;
  thresholdMeet: number;
}
