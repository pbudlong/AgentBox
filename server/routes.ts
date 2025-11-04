import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { buyerAgent, sellerAgent } from "./mastra/index";
import { replyToEmail, type InboundEmail, createInbox, sendEmail, listMessages, getMessage, findInboxByEmail } from "./agentmail";
import { db } from "./db";
import * as schema from "@shared/schema";
import type { DemoSession } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

// MAX_EXCHANGES constant for preventing infinite loops
const MAX_EXCHANGES = 5; // Seller → buyer (1) → seller (2) → buyer (3) → seller (4) → buyer (5) → STOP

// Track webhook events for debugging
let webhookEvents: Array<{ 
  timestamp: Date; 
  from: string; 
  to: string; 
  subject: string; 
  status: string;
  event_id: string;
  payload: any;
  response: any;
}> = [];

// Track processed webhooks using composite key (event_id + message_id) to prevent duplicates
// AgentMail may reuse event_ids, so we need both to uniquely identify a message
const processedWebhooks = new Set<string>();

// Production debug log storage - accessible via /api/debug/logs
// Tagged with [PROD] for easy identification when fetching from production
interface ProductionLogEntry {
  timestamp: string;
  environment: 'PROD';
  sessionId: string | null;
  agent: 'seller' | 'buyer' | 'system';
  message: string;
  status: 'success' | 'error' | 'pending';
  details?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

async function logToProduction(entry: Omit<ProductionLogEntry, 'timestamp' | 'environment'>) {
  const logEntry: ProductionLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    environment: 'PROD'
  };
  
  // Save to database for persistence across restarts
  try {
    await db.insert(schema.productionLogs).values({
      sessionId: entry.sessionId || 'unknown',
      agent: entry.agent,
      message: entry.message,
      status: entry.status,
      timestamp: logEntry.timestamp,
      details: entry.details,
      endpoint: entry.endpoint,
      method: entry.method,
      statusCode: entry.statusCode,
      duration: entry.duration,
    });
  } catch (err) {
    console.error('[PROD] Failed to save log to database:', err);
  }
  
  // Also log to console for dev debugging
  const prefix = `[PROD] [${entry.agent}]`;
  const statusSymbol = entry.status === 'success' ? '✓' : entry.status === 'error' ? '✗' : '⏳';
  console.log(`${prefix} ${statusSymbol} ${entry.message}${entry.details ? ` - ${entry.details}` : ''}`);
}

// Development debug log storage - accessible via /api/debug/dev-logs
// Tagged with [DEV] for easy identification during local development
interface DevelopmentLogEntry {
  timestamp: string;
  environment: 'DEV';
  sessionId: string | null;
  agent: 'seller' | 'buyer' | 'system';
  message: string;
  status: 'success' | 'error' | 'pending';
  details?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

async function logToDevelopment(entry: Omit<DevelopmentLogEntry, 'timestamp' | 'environment'>) {
  const logEntry: DevelopmentLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    environment: 'DEV'
  };
  
  // Save to database for persistence across restarts
  try {
    await db.insert(schema.developmentLogs).values({
      sessionId: entry.sessionId || 'unknown',
      agent: entry.agent,
      message: entry.message,
      status: entry.status,
      timestamp: logEntry.timestamp,
      details: entry.details,
      endpoint: entry.endpoint,
      method: entry.method,
      statusCode: entry.statusCode,
      duration: entry.duration,
    });
  } catch (err) {
    console.error('[DEV] Failed to save log to database:', err);
  }
  
  // Also log to console for dev debugging
  const prefix = `[DEV] [${entry.agent}]`;
  const statusSymbol = entry.status === 'success' ? '✓' : entry.status === 'error' ? '✗' : '⏳';
  console.log(`${prefix} ${statusSymbol} ${entry.message}${entry.details ? ` - ${entry.details}` : ''}`);
}

// In-memory demo session storage (production-ready for hackathon demo)
let currentDemoSession: {
  sellerInboxId: string;
  sellerEmail: string;
  buyerInboxId: string;
  buyerEmail: string;
  exchangeCount: number;
  createdAt: Date;
} | null = null;

// Helper function to extract only the new message content (strip quoted history)
function extractNewContent(emailBody: string): string {
  // Split by common reply markers
  const replyMarkers = [
    '\n\nOn 20', // "On 2025-11-01..."
    '\n> ', // Quoted lines starting with >
    '\nOn 20', // Alternative format
  ];
  
  let newContent = emailBody;
  
  // Find the first occurrence of any reply marker
  for (const marker of replyMarkers) {
    const index = emailBody.indexOf(marker);
    if (index !== -1) {
      newContent = emailBody.substring(0, index);
      break;
    }
  }
  
  // Also try to split on multiple > characters (deeply nested quotes)
  const lines = newContent.split('\n');
  const cleanLines = lines.filter(line => !line.trim().startsWith('>'));
  
  return cleanLines.join('\n').trim();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // AgentMail webhook endpoint for inbound emails
  app.post("/webhooks/agentmail", async (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`\n${"=".repeat(80)}`);
    console.log(`🔔 WEBHOOK RECEIVED at ${timestamp}`);
    console.log(`${"=".repeat(80)}`);
    
    try {
      const event = req.body;
      
      console.log("📦 Full webhook payload:", JSON.stringify(event, null, 2));
      console.log("📋 Event wrapper type:", event.type);
      console.log("📋 Event type:", event.event_type);
      console.log("📋 Event ID:", event.event_id);
      console.log("📧 Message data:", {
        from: event.message?.from,
        to: event.message?.to,
        subject: event.message?.subject,
        inbox_id: event.message?.inbox_id,
        message_id: event.message?.message_id,
      });

      // Quick response to webhook (must respond immediately)
      res.status(200).json({ success: true });
      console.log("✅ Webhook acknowledged (200 OK sent)");

      // Create composite key for duplicate detection (event_id + message_id)
      // This prevents false duplicates when AgentMail reuses event_ids for different messages
      const eventId = event.event_id || '';
      const messageId = event.message?.message_id || '';
      
      // Edge case: If both identifiers are missing, skip deduplication
      // (otherwise all webhooks without IDs would share the "::" key)
      if (!eventId && !messageId) {
        console.log("⚠️ WARNING: Webhook has no event_id or message_id - skipping deduplication");
        console.log("   This webhook will be processed without duplicate checking");
      } else {
        const compositeKey = `${eventId}::${messageId}`;
        
        console.log("🔑 Composite key:", compositeKey);
        console.log("📊 Total processed webhooks:", processedWebhooks.size);
        
        if (processedWebhooks.has(compositeKey)) {
          console.log("⚠️ DUPLICATE DETECTED - Already processed this exact webhook");
          console.log("   Event ID:", eventId);
          console.log("   Message ID:", messageId);
          console.log("   Composite Key:", compositeKey);
          console.log(`${"=".repeat(80)}\n`);
          
          await logToProduction({
            sessionId: null,
            agent: 'system',
            message: 'Duplicate webhook ignored',
            status: 'success',
            details: `Event ID: ${eventId}, Message ID: ${messageId}`
          });
          
          await logToDevelopment({
            sessionId: null,
            agent: 'system',
            message: 'Duplicate webhook ignored',
            status: 'success',
            details: `Event ID: ${eventId}, Message ID: ${messageId}`
          });
          
          // Don't add duplicate events to webhookEvents array
          return;
        }
        
        // Mark webhook as processed using composite key
        processedWebhooks.add(compositeKey);
        console.log("✅ Marked webhook as processed (composite key added to Set)");
      }

      // Process email asynchronously
      // AgentMail structure: event.event_type = "message.received", event.message contains the data
      if (event.event_type === "message.received" && event.message) {
        const inboundEmail = event.message;
        
        // Load demo session - try in-memory first (dev), then database (production)
        // This hybrid approach supports both local dev and production deployments
        let session = currentDemoSession;
        
        if (!session) {
          // Fallback to database lookup for production (serverless deployments)
          const inboxId = inboundEmail.inbox_id;
          if (inboxId) {
            session = await storage.getDemoSessionByInboxId(inboxId);
            console.log(`🔍 Session lookup from database by inbox_id ${inboxId}:`, session ? '✓ Found' : '✗ Not found');
          }
        } else {
          console.log("🔍 Session found in memory (dev mode)");
        }
        
        if (!session) {
          console.log("⚠️ No demo session found in memory or database");
          
          await logToProduction({
            sessionId: null,
            agent: 'system',
            message: 'Webhook received but no active session in database',
            status: 'error',
            details: `Inbox ID: ${inboxId || 'missing'}, From: ${inboundEmail.from || 'unknown'}, Subject: ${inboundEmail.subject || 'No subject'}`
          });
          
          await logToDevelopment({
            sessionId: null,
            agent: 'system',
            message: 'Webhook received but no active session in database',
            status: 'error',
            details: `Inbox ID: ${inboxId || 'missing'}, From: ${inboundEmail.from || 'unknown'}, Subject: ${inboundEmail.subject || 'No subject'}`
          });
          
          webhookEvents.push({
            timestamp: new Date(),
            from: inboundEmail.from || 'unknown',
            to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
            subject: inboundEmail.subject || 'No subject',
            status: 'error (no session found in database)',
            event_id: event.event_id || 'unknown',
            payload: event,
            response: { success: true }
          });
          return;
        }
        
        // Calculate session ID for logging (now that we have the session from database)
        const sessionId = `session-${new Date(session.createdAt).getTime()}`;
        
        // Check if message is older than session (AgentMail replays historical messages)
        const messageTimestamp = new Date(inboundEmail.created_at || inboundEmail.timestamp);
        const sessionTimestamp = new Date(session.createdAt);
        
        if (messageTimestamp < sessionTimestamp) {
          console.log("⏮️ Ignoring old message from before session creation:", {
            messageTime: messageTimestamp.toISOString(),
            sessionTime: sessionTimestamp.toISOString(),
            from: inboundEmail.from,
            subject: inboundEmail.subject
          });
          webhookEvents.push({
            timestamp: new Date(),
            from: inboundEmail.from || 'unknown',
            to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
            subject: inboundEmail.subject || 'No subject',
            status: 'ignored (message older than session)',
            event_id: event.event_id || 'unknown',
            payload: event,
            response: { success: true }
          });
          return;
        }
        
        // Check which inbox RECEIVED the email (inbox_id is the recipient)
        const receivedByBuyer = inboundEmail.inbox_id === session.buyerInboxId;
        const receivedBySeller = inboundEmail.inbox_id === session.sellerInboxId;
        
        const receiverName = receivedByBuyer ? 'buyer' : receivedBySeller ? 'seller' : 'unknown';
        
        console.log("🔍 Webhook received:", {
          inbox_id: inboundEmail.inbox_id,
          from: inboundEmail.from,
          to: inboundEmail.to,
          receivedBy: receiverName,
          buyerInbox: session.buyerInboxId,
          sellerInbox: session.sellerInboxId,
          currentExchangeCount: session.exchangeCount,
        });
        
        // Log webhook reception at development level
        await logToDevelopment({
          sessionId,
          agent: receivedByBuyer ? 'buyer' : receivedBySeller ? 'seller' : 'system',
          message: `Webhook received at ${receiverName} inbox`,
          status: 'pending',
          details: `From: ${inboundEmail.from || 'unknown'}, Exchange: ${session.exchangeCount}/${MAX_EXCHANGES}`
        });
        
        // Log webhook reception event (persistent, stays visible)
        webhookEvents.push({
          timestamp: new Date(),
          from: inboundEmail.from || 'unknown',
          to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
          subject: inboundEmail.subject || 'No subject',
          status: receivedByBuyer ? 'webhook received (buyer inbox)' : receivedBySeller ? 'webhook received (seller inbox)' : 'unknown inbox',
          event_id: event.event_id || 'unknown',
          payload: event,
          response: { success: true }
        });
        
        // Buyer receives email → generate reply
        if (receivedByBuyer) {
          console.log("📧 BUYER INBOX received email from seller - generating response...");
          
          // Check if we've hit the exchange limit
          if (session.exchangeCount >= MAX_EXCHANGES) {
            console.log(`⏹️ Maximum exchanges (${MAX_EXCHANGES}) reached. Stopping conversation.`);
            
            // Add separate event for max exchanges reached (don't mutate webhook reception)
            webhookEvents.push({
              timestamp: new Date(),
              from: inboundEmail.from || 'unknown',
              to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
              subject: inboundEmail.subject || 'No subject',
              status: 'ignored (max exchanges reached)',
              event_id: event.event_id || 'unknown',
              payload: event,
              response: { success: true }
            });
            
            await logToDevelopment({
              sessionId,
              agent: 'buyer',
              message: `Max exchanges reached (${MAX_EXCHANGES}), conversation stopped`,
              status: 'success',
              details: `Exchange count: ${session.exchangeCount}/${MAX_EXCHANGES}`
            });
            
            return;
          }
          
          const emailBody = inboundEmail.text || inboundEmail.html || "";
          const newContent = extractNewContent(emailBody);
          console.log("📝 Extracted new content:", newContent.substring(0, 100) + "...");
          
          // Determine conversation stage based on exchange count
          const isFirstResponse = session.exchangeCount === 0;
          const isSecondResponse = session.exchangeCount === 2;
          
          let prompt = '';
          if (isFirstResponse) {
            // First buyer response: Ask qualifying questions NOT in profile
            prompt = `You are an AI buying agent for Sarah Chen, VP of Sales at TechCorp. Your AgentBox profile shows: 200 employees, FinTech, SF, $25K budget, Q1 2025 timeline, uses Salesforce.

Seller's outreach:
${newContent}

This looks like a good profile match. Ask ONE specific qualifying question about something NOT in your profile (pricing tiers, implementation time, security/compliance, or technical requirements). Under 40 words. Direct and professional.`;
          } else if (isSecondResponse) {
            // Second buyer response: Accept meeting and pick time
            prompt = `You are an AI buying agent for Sarah Chen at TechCorp. The seller answered your questions satisfactorily.

Seller's response:
${newContent}

Accept the meeting offer and select ONE specific time from their suggestions (or propose Tuesday 2PM PT if they didn't give options). Under 35 words. Direct: "Accepted. [Time] works. Confirm?"`;
          } else {
            // Fallback for additional exchanges
            prompt = `You are an AI buying agent. 

Seller said:
${newContent}

Acknowledge briefly. Under 25 words.`;
          }

          console.log("🤖 Calling buyer agent...");
          const agentStart = Date.now();
          const response = await buyerAgent.generate(prompt);
          const agentDuration = Date.now() - agentStart;
          console.log("💬 Buyer response generated:", response.text.substring(0, 100) + "...");
          
          await logToProduction({
            sessionId,
            agent: 'buyer',
            message: 'Generated email response via OpenAI',
            status: 'success',
            details: 'OpenAI GPT-4',
            duration: agentDuration
          });
          
          await logToDevelopment({
            sessionId,
            agent: 'buyer',
            message: 'Generated email response via OpenAI',
            status: 'success',
            details: `Response: "${response.text.substring(0, 100)}..."`,
            duration: agentDuration
          });
          
          // Send reply
          console.log("📮 Sending buyer reply via webhook...");
          const emailStart = Date.now();
          await replyToEmail({
            inbox_id: inboundEmail.inbox_id,
            message_id: inboundEmail.message_id,
            text: response.text,
          });
          const emailDuration = Date.now() - emailStart;

          await logToProduction({
            sessionId,
            agent: 'buyer',
            message: 'Sent reply email',
            status: 'success',
            endpoint: '/messages',
            method: 'POST',
            statusCode: 200,
            duration: emailDuration
          });
          
          await logToDevelopment({
            sessionId,
            agent: 'buyer',
            message: 'Sent reply email',
            status: 'success',
            endpoint: '/messages',
            method: 'POST',
            statusCode: 200,
            duration: emailDuration
          });

          // Increment exchange count in memory
          session.exchangeCount++;
          console.log(`📊 Exchange count: ${session.exchangeCount}/${MAX_EXCHANGES}`);
          
          await logToDevelopment({
            sessionId,
            agent: 'buyer',
            message: 'Exchange count incremented',
            status: 'success',
            details: `Now at ${session.exchangeCount}/${MAX_EXCHANGES}`
          });

          // Add separate completion event (don't mutate webhook reception)
          webhookEvents.push({
            timestamp: new Date(),
            from: 'Buyer Agent',
            to: inboundEmail.from || 'unknown',
            subject: `Re: ${inboundEmail.subject || 'No subject'}`,
            status: 'success (buyer replied)',
            event_id: event.event_id || 'unknown',
            payload: { responseText: response.text },
            response: { success: true }
          });
          console.log("✅ Buyer response sent successfully via webhook");
        } 
        // Seller receives email → generate reply
        else if (receivedBySeller) {
          console.log("📧 SELLER INBOX received email from buyer - generating response...");
          
          // Check if we've hit the exchange limit
          if (session.exchangeCount >= MAX_EXCHANGES) {
            console.log(`⏹️ Maximum exchanges (${MAX_EXCHANGES}) reached. Stopping conversation.`);
            
            // Add separate event for max exchanges reached (don't mutate webhook reception)
            webhookEvents.push({
              timestamp: new Date(),
              from: inboundEmail.from || 'unknown',
              to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
              subject: inboundEmail.subject || 'No subject',
              status: 'ignored (max exchanges reached)',
              event_id: event.event_id || 'unknown',
              payload: event,
              response: { success: true }
            });
            
            await logToDevelopment({
              sessionId,
              agent: 'seller',
              message: `Max exchanges reached (${MAX_EXCHANGES}), conversation stopped`,
              status: 'success',
              details: `Exchange count: ${session.exchangeCount}/${MAX_EXCHANGES}`
            });
            
            return;
          }
          
          const emailBody = inboundEmail.text || inboundEmail.html || "";
          const newContent = extractNewContent(emailBody);
          console.log("📝 Extracted new content:", newContent.substring(0, 100) + "...");
          
          // Determine conversation stage based on exchange count
          const isFirstResponse = session.exchangeCount === 1;
          const isSecondResponse = session.exchangeCount === 3;
          const isFinalResponse = session.exchangeCount === 5;
          
          let prompt = '';
          if (isFirstResponse) {
            // First seller response: Answer questions and suggest meeting
            prompt = `You are an AI sales agent for Mike Rodriguez at AgentBox. Profile: B2B SaaS (50-500 employees), $10K-$50K ARR, integrates Salesforce/HubSpot.

Buyer's question:
${newContent}

Answer their question directly with specific data. Then suggest 2-3 meeting time options (day + time). Under 50 words. Direct and professional.`;
          } else if (isSecondResponse) {
            // Second seller response: Acknowledge meeting acceptance
            prompt = `You are an AI sales agent.

Buyer accepted meeting:
${newContent}

Confirm the meeting time they selected and state "Calendar invite sent." Under 20 words. Direct.`;
          } else if (isFinalResponse) {
            // Final confirmation
            prompt = `Buyer said:
${newContent}

Brief final acknowledgment. Under 15 words.`;
          } else {
            // Fallback
            prompt = `Respond briefly to:
${newContent}

Under 30 words.`;
          }

          console.log("🤖 Calling seller agent...");
          const agentStartSeller = Date.now();
          const response = await sellerAgent.generate(prompt);
          const agentDurationSeller = Date.now() - agentStartSeller;
          console.log("💬 Seller response generated:", response.text.substring(0, 100) + "...");
          
          await logToProduction({
            sessionId,
            agent: 'seller',
            message: 'Generated email response via OpenAI',
            status: 'success',
            details: 'OpenAI GPT-4',
            duration: agentDurationSeller
          });
          
          await logToDevelopment({
            sessionId,
            agent: 'seller',
            message: 'Generated email response via OpenAI',
            status: 'success',
            details: `Response: "${response.text.substring(0, 100)}..."`,
            duration: agentDurationSeller
          });
          
          // Send reply
          console.log("📮 Sending seller reply via webhook...");
          const emailStartSeller = Date.now();
          await replyToEmail({
            inbox_id: inboundEmail.inbox_id,
            message_id: inboundEmail.message_id,
            text: response.text,
          });
          const emailDurationSeller = Date.now() - emailStartSeller;

          await logToProduction({
            sessionId,
            agent: 'seller',
            message: 'Sent reply email',
            status: 'success',
            endpoint: '/messages',
            method: 'POST',
            statusCode: 200,
            duration: emailDurationSeller
          });
          
          await logToDevelopment({
            sessionId,
            agent: 'seller',
            message: 'Sent reply email',
            status: 'success',
            endpoint: '/messages',
            method: 'POST',
            statusCode: 200,
            duration: emailDurationSeller
          });

          // Increment exchange count in memory
          session.exchangeCount++;
          console.log(`📊 Exchange count: ${session.exchangeCount}/${MAX_EXCHANGES}`);
          
          await logToDevelopment({
            sessionId,
            agent: 'seller',
            message: 'Exchange count incremented',
            status: 'success',
            details: `Now at ${session.exchangeCount}/${MAX_EXCHANGES}`
          });

          // Add separate completion event (don't mutate webhook reception)
          webhookEvents.push({
            timestamp: new Date(),
            from: 'Seller Agent',
            to: inboundEmail.from || 'unknown',
            subject: `Re: ${inboundEmail.subject || 'No subject'}`,
            status: 'success (seller replied)',
            event_id: event.event_id || 'unknown',
            payload: { responseText: response.text },
            response: { success: true }
          });
          console.log("✅ Seller response sent successfully via webhook");
        }
        else {
          console.log("⚠️ Email received by unknown inbox");
        }
      } else {
        webhookEvents.push({
          timestamp: new Date(),
          from: 'unknown',
          to: 'unknown',
          subject: 'Unknown event',
          status: 'error (unhandled event type)',
          event_id: event.event_id || 'unknown',
          payload: event,
          response: { success: true }
        });
        console.log("⚠️ Webhook event type not handled. event_type:", event.event_type, "type:", event.type);
      }
      console.log(`${"=".repeat(80)}\n`);
    } catch (error) {
      console.error("❌ Error processing webhook:", error);
      console.error("Stack trace:", (error as Error).stack);
      console.log(`${"=".repeat(80)}\n`);
      
      // Log webhook processing error (sessionId unknown in error case)
      await logToProduction({
        sessionId: null,
        agent: 'system',
        message: 'Webhook processing failed',
        status: 'error',
        details: (error as Error).message
      });
      
      await logToDevelopment({
        sessionId: null,
        agent: 'system',
        message: 'Webhook processing failed',
        status: 'error',
        details: (error as Error).message
      });
    }
  });

  // Initialize demo inboxes and start conversation
  app.post("/api/demo/initialize", async (req, res) => {
    // Generate unique session ID for detailed tracking
    const timestamp = Date.now();
    const sessionId = `session-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionStartTime = new Date().toISOString();
    
    // Track execution details for frontend display
    const executionDetails: Array<{
      agent: 'seller' | 'buyer';
      message: string;
      status: 'success' | 'error' | 'pending';
      timestamp: Date;
      details?: string;
      duration?: number;
    }> = [];
    
    try {
      console.log("\n" + "█".repeat(100));
      console.log("█".repeat(100));
      console.log(`🆕 NEW DEMO SESSION STARTED`);
      console.log(`📋 Session ID: ${sessionId}`);
      console.log(`⏰ Timestamp: ${sessionStartTime}`);
      console.log("█".repeat(100));
      console.log("█".repeat(100) + "\n");
      
      // Clear previous webhook events and processed webhooks (composite keys)
      webhookEvents = [];
      processedWebhooks.clear();
      console.log("🔄 Reset webhook tracking (cleared composite key Set)");

      // Create FRESH inboxes with timestamp to avoid old messages
      const sellerInboxName = `seller-${timestamp}`;
      const buyerInboxName = `buyer-${timestamp}`;
      
      console.log("\n" + "=".repeat(80));
      console.log("📬 PHASE 1: INBOX CREATION");
      console.log("=".repeat(80));
      console.log(`Session ID: ${sessionId}`);
      console.log("Creating fresh inboxes:", sellerInboxName, buyerInboxName);

      // Create seller inbox
      console.log(`⏳ Creating seller inbox: ${sellerInboxName}@agentmail.to`);
      const sellerInboxStart = Date.now();
      const sellerInbox = await createInbox(sellerInboxName, "Mike (Seller)");
      const sellerInboxDuration = Date.now() - sellerInboxStart;
      console.log(`✅ Seller inbox created in ${sellerInboxDuration}ms`);
      console.log("📦 Full API response:", JSON.stringify(sellerInbox, null, 2));
      const sellerInboxId = (sellerInbox as any).inboxId; // AgentMail API uses camelCase
      const sellerEmail = (sellerInbox as any).inboxId;    // inboxId IS the email address
      console.log(`📧 Seller email address: ${sellerEmail}`);
      
      executionDetails.push({
        agent: 'seller',
        message: 'Created fresh AgentMail inbox',
        status: 'success',
        timestamp: new Date(),
        details: `POST /inboxes → 200 OK (${sellerInboxDuration}ms)`,
        duration: sellerInboxDuration
      });
      
      await logToProduction({
        sessionId,
        agent: 'seller',
        message: 'Created fresh AgentMail inbox',
        status: 'success',
        endpoint: '/inboxes',
        method: 'POST',
        statusCode: 200,
        duration: sellerInboxDuration
      });
      
      await logToDevelopment({
        sessionId,
        agent: 'seller',
        message: 'Created fresh AgentMail inbox',
        status: 'success',
        endpoint: '/inboxes',
        method: 'POST',
        statusCode: 200,
        duration: sellerInboxDuration
      });

      // Create buyer inbox
      console.log(`⏳ Creating buyer inbox: ${buyerInboxName}@agentmail.to`);
      const buyerInboxStart = Date.now();
      const buyerInbox = await createInbox(buyerInboxName, "Sarah (Buyer)");
      const buyerInboxDuration = Date.now() - buyerInboxStart;
      console.log(`✅ Buyer inbox created in ${buyerInboxDuration}ms`);
      console.log("📦 Full API response:", JSON.stringify(buyerInbox, null, 2));
      const buyerInboxId = (buyerInbox as any).inboxId; // AgentMail API uses camelCase
      const buyerEmail = (buyerInbox as any).inboxId;    // inboxId IS the email address
      console.log(`📧 Buyer email address: ${buyerEmail}`);
      
      executionDetails.push({
        agent: 'buyer',
        message: 'Created fresh AgentMail inbox',
        status: 'success',
        timestamp: new Date(),
        details: `POST /inboxes → 200 OK (${buyerInboxDuration}ms)`,
        duration: buyerInboxDuration
      });
      
      await logToProduction({
        sessionId,
        agent: 'buyer',
        message: 'Created fresh AgentMail inbox',
        status: 'success',
        endpoint: '/inboxes',
        method: 'POST',
        statusCode: 200,
        duration: buyerInboxDuration
      });
      
      await logToDevelopment({
        sessionId,
        agent: 'buyer',
        message: 'Created fresh AgentMail inbox',
        status: 'success',
        endpoint: '/inboxes',
        method: 'POST',
        statusCode: 200,
        duration: buyerInboxDuration
      });

      // Save session to DATABASE (production-ready, survives restarts)
      console.log("💾 Saving demo session to database...");
      const sessionCreatedAt = new Date();
      const dbSession = await storage.createDemoSession({
        id: sessionId,
        sellerInboxId,
        sellerEmail,
        buyerInboxId,
        buyerEmail,
        exchangeCount: 0,
        createdAt: sessionCreatedAt.toISOString(),
      });
      console.log("✅ Demo session saved to database");
      
      // Also save to in-memory for backward compatibility
      currentDemoSession = {
        sellerInboxId,
        sellerEmail,
        buyerInboxId,
        buyerEmail,
        exchangeCount: 0,
        createdAt: sessionCreatedAt,
      };
      console.log("✅ Demo session also cached in memory");

      console.log("Inboxes ready:", { seller: sellerEmail, buyer: buyerEmail });
      console.log("ℹ️  Webhooks are configured at organization level - no per-inbox registration needed");
      console.log("=".repeat(80) + "\n");

      console.log("\n" + "=".repeat(80));
      console.log("📧 PHASE 3: EMAIL SENDING");
      console.log("=".repeat(80));
      console.log(`Session ID: ${sessionId}`);
      
      // Generate seller's first email using agent
      console.log("🤖 Generating seller's outreach email using AI agent...");
      const agentStart = Date.now();
      const sellerMessage = await sellerAgent.generate(
        `You are an AI sales agent reaching out to Sarah Chen, VP of Sales at TechCorp (200 employees, FinTech, SF). Based on your AgentBox profile data, she's a strong fit: needs sales qualification solution, $25K budget, Q1 timeline, uses Salesforce.

Write a terse, data-driven outreach email introducing AgentBox - AI-powered sales qualification platform. Reference how your solution aligns with her profile. Under 60 words. No fluff or pleasantries. Direct and professional.`
      );
      const agentDuration = Date.now() - agentStart;
      console.log(`✅ Seller message generated in ${agentDuration}ms`);
      console.log("📝 Generated message preview:", sellerMessage.text.substring(0, 150) + "...");
      console.log("📏 Message length:", sellerMessage.text.length, "characters");
      
      executionDetails.push({
        agent: 'seller',
        message: 'Generated outreach email via OpenAI',
        status: 'success',
        timestamp: new Date(),
        details: `OpenAI GPT-4 (${agentDuration}ms)`,
        duration: agentDuration
      });
      
      await logToProduction({
        sessionId,
        agent: 'seller',
        message: 'Generated outreach email via OpenAI',
        status: 'success',
        details: 'OpenAI GPT-4',
        duration: agentDuration
      });
      
      await logToDevelopment({
        sessionId,
        agent: 'seller',
        message: 'Generated outreach email via OpenAI',
        status: 'success',
        details: `Initial outreach: "${sellerMessage.text.substring(0, 100)}..."`,
        duration: agentDuration
      });

      // Send first email from seller to buyer
      console.log(`📮 Sending email from ${sellerEmail} to ${buyerEmail}...`);
      const emailStart = Date.now();
      const sellerEmailResult = await sendEmail({
        inbox_id: sellerInboxId,
        to: buyerEmail,
        subject: "Streamline Your Sales Qualification Process",
        text: sellerMessage.text,
      });
      const emailDuration = Date.now() - emailStart;
      console.log(`✅ Email sent successfully in ${emailDuration}ms`);
      console.log("📦 AgentMail send response:", JSON.stringify(sellerEmailResult, null, 2));
      console.log("⏳ Waiting for buyer webhook to fire and auto-generate response...");
      console.log("=".repeat(80) + "\n");
      
      executionDetails.push({
        agent: 'seller',
        message: 'Sent email to buyer',
        status: 'success',
        timestamp: new Date(),
        details: `POST /messages → 200 OK (${emailDuration}ms)`,
        duration: emailDuration
      });
      
      await logToProduction({
        sessionId,
        agent: 'seller',
        message: 'Sent email to buyer',
        status: 'success',
        endpoint: '/messages',
        method: 'POST',
        statusCode: 200,
        duration: emailDuration
      });
      
      await logToDevelopment({
        sessionId,
        agent: 'seller',
        message: 'Sent initial email to buyer',
        status: 'success',
        endpoint: '/messages',
        method: 'POST',
        statusCode: 200,
        duration: emailDuration
      });
      
      executionDetails.push({
        agent: 'buyer',
        message: 'Waiting for webhook...',
        status: 'pending',
        timestamp: new Date(),
        details: 'Webhook will trigger when AgentMail delivers the email'
      });
      
      await logToProduction({
        sessionId,
        agent: 'buyer',
        message: 'Waiting for webhook...',
        status: 'pending',
        details: 'Webhook will trigger when AgentMail delivers the email'
      });
      
      await logToDevelopment({
        sessionId,
        agent: 'buyer',
        message: 'Waiting for webhook to trigger buyer response',
        status: 'pending',
        details: 'AgentMail will deliver email and fire webhook'
      });

      const sessionEndTime = new Date().toISOString();
      const totalDuration = Date.now() - timestamp;
      console.log("\n" + "█".repeat(100));
      console.log("✅ DEMO SESSION INITIALIZED SUCCESSFULLY");
      console.log(`📋 Session ID: ${sessionId}`);
      console.log(`⏱️  Total duration: ${totalDuration}ms`);
      console.log(`⏰ Started: ${sessionStartTime}`);
      console.log(`⏰ Ended: ${sessionEndTime}`);
      console.log(`📧 Seller: ${sellerEmail}`);
      console.log(`📧 Buyer: ${buyerEmail}`);
      console.log("█".repeat(100) + "\n");

      res.json({
        success: true,
        sessionId,
        seller: sellerEmail,
        buyer: buyerEmail,
        message: "Demo initialized - webhooks configured at organization level",
        executionDetails, // Send detailed API call info to frontend
      });
    } catch (error) {
      console.error("\n" + "❌".repeat(40));
      console.error("❌ DEMO INITIALIZATION FAILED");
      console.error("❌".repeat(40));
      console.error("Session ID:", sessionId);
      console.error("Error Type:", (error as any).constructor.name);
      console.error("Error Message:", (error as Error).message);
      console.error("Full Error:", error);
      console.error("Stack Trace:", (error as Error).stack);
      console.error("❌".repeat(40) + "\n");
      
      // Add error to execution details
      executionDetails.push({
        agent: 'seller',
        message: 'Demo initialization failed',
        status: 'error',
        timestamp: new Date(),
        details: (error as Error).message
      });
      
      await logToProduction({
        sessionId,
        agent: 'seller',
        message: 'Demo initialization failed',
        status: 'error',
        details: (error as Error).message
      });
      
      res.status(500).json({ 
        error: "Failed to initialize demo",
        details: (error as Error).message,
        sessionId,
        executionDetails // Include partial execution details even on failure
      });
    }
  });

  // Fetch demo messages
  app.get("/api/demo/messages", async (req, res) => {
    try {
      // Load latest session from DATABASE (production-ready, survives restarts)
      const session = await storage.getLatestDemoSession();
      
      if (!session) {
        return res.json({ messages: [], initialized: false });
      }

      // Fetch messages from both inboxes (list gives us message IDs)
      const [sellerMessages, buyerMessages] = await Promise.all([
        listMessages(session.sellerInboxId),
        listMessages(session.buyerInboxId),
      ]);

      // AgentMail returns all messages for the pod (not per-inbox)
      // So both listMessages calls return the same data - just use one
      const messageList = (sellerMessages.messages || []);
      
      // Fetch full content for each message (list only returns preview)
      const fullMessages = await Promise.all(
        messageList.map(async (msg: any) => {
          try {
            // getMessage returns full text/html content
            const fullMsg = await getMessage(session.sellerInboxId, msg.messageId);
            const fullText = fullMsg.text || msg.preview;
            
            // Strip quoted email history for cleaner display
            const cleanText = extractNewContent(fullText);
            
            return {
              ...msg,
              text: cleanText,  // Use cleaned text without quoted history
              html: fullMsg.html,
            };
          } catch (err) {
            console.error("Failed to fetch full message:", msg.messageId, err);
            // Fallback to preview if getMessage fails
            return { ...msg, text: msg.preview };
          }
        })
      );

      const allMessages = fullMessages.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.created_at).getTime();
        const dateB = new Date(b.createdAt || b.created_at).getTime();
        return dateA - dateB;
      });

      res.json({
        messages: allMessages,
        initialized: true,
        seller: session.sellerEmail,
        buyer: session.buyerEmail,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Get webhook events for debugging
  app.get("/api/demo/webhooks", (req, res) => {
    res.json({ webhooks: webhookEvents });
  });

  // Production debug logs endpoint - accessible from deployed app for remote debugging
  // Tagged with [PROD] environment identifier for clear distinction from dev logs
  app.get("/api/debug/logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const sessionId = req.query.sessionId as string;
      
      // Query from database with limit, ordered by timestamp
      const logs = sessionId
        ? await db
            .select()
            .from(schema.productionLogs)
            .where(eq(schema.productionLogs.sessionId, sessionId))
            .orderBy(schema.productionLogs.timestamp)
            .limit(limit)
        : await db
            .select()
            .from(schema.productionLogs)
            .orderBy(schema.productionLogs.timestamp)
            .limit(limit);
      
      res.json({
        environment: 'PROD',
        returned: logs.length,
        logs: logs.map(log => ({
          timestamp: log.timestamp,
          environment: 'PROD',
          sessionId: log.sessionId,
          agent: log.agent,
          message: log.message,
          status: log.status,
          details: log.details,
          endpoint: log.endpoint,
          method: log.method,
          statusCode: log.statusCode,
          duration: log.duration,
        }))
      });
    } catch (error) {
      console.error("Error fetching production logs:", error);
      res.status(500).json({ error: "Failed to fetch production logs" });
    }
  });

  // Development debug logs endpoint - accessible during local development for webhook debugging
  // Tagged with [DEV] environment identifier for clear distinction from production logs
  app.get("/api/debug/dev-logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const sessionId = req.query.sessionId as string;
      
      // Query from database with limit, ordered by timestamp
      const logs = sessionId
        ? await db
            .select()
            .from(schema.developmentLogs)
            .where(eq(schema.developmentLogs.sessionId, sessionId))
            .orderBy(schema.developmentLogs.timestamp)
            .limit(limit)
        : await db
            .select()
            .from(schema.developmentLogs)
            .orderBy(schema.developmentLogs.timestamp)
            .limit(limit);
      
      res.json({
        environment: 'DEV',
        returned: logs.length,
        logs: logs.map(log => ({
          timestamp: log.timestamp,
          environment: 'DEV',
          sessionId: log.sessionId,
          agent: log.agent,
          message: log.message,
          status: log.status,
          details: log.details,
          endpoint: log.endpoint,
          method: log.method,
          statusCode: log.statusCode,
          duration: log.duration,
        }))
      });
    } catch (error) {
      console.error("Error fetching dev logs:", error);
      res.status(500).json({ error: "Failed to fetch development logs" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
