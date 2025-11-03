import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { buyerAgent, sellerAgent } from "./mastra/index";
import { replyToEmail, type InboundEmail, createInbox, sendEmail, listMessages, getMessage, findInboxByEmail, registerWebhook } from "./agentmail";

// MAX_EXCHANGES constant for preventing infinite loops
const MAX_EXCHANGES = 4; // Seller sends 1, buyer replies 1, seller replies 1, buyer replies 1, seller replies 1, stop

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

// Track processed event IDs to prevent duplicates
const processedEventIds = new Set<string>();

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

      // Check for duplicate events (in-memory only for now - dev focused)
      if (event.event_id && processedEventIds.has(event.event_id)) {
        console.log("⚠️ Duplicate webhook event detected, skipping:", event.event_id);
        console.log(`${"=".repeat(80)}\n`);
        // Don't add duplicate events to webhookEvents array
        return;
      }
      
      // Mark event as processed (prevents duplicates from being added to webhookEvents)
      if (event.event_id) {
        processedEventIds.add(event.event_id);
      }

      // Process email asynchronously
      // AgentMail structure: event.event_type = "message.received", event.message contains the data
      if (event.event_type === "message.received" && event.message) {
        const inboundEmail = event.message;
        
        // Load demo session from in-memory storage
        const session = currentDemoSession;
        
        if (!session) {
          console.log("⚠️ No demo session found in memory");
          webhookEvents.push({
            timestamp: new Date(),
            from: inboundEmail.from || 'unknown',
            to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
            subject: inboundEmail.subject || 'No subject',
            status: 'error (no session found)',
            event_id: event.event_id || 'unknown',
            payload: event,
            response: { success: true }
          });
          return;
        }
        
        // Check if message is older than session (AgentMail replays historical messages)
        const messageTimestamp = new Date(inboundEmail.created_at || inboundEmail.timestamp);
        const sessionTimestamp = session.createdAt;
        
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
        
        // Log webhook event for debugging
        webhookEvents.push({
          timestamp: new Date(),
          from: inboundEmail.from || 'unknown',
          to: Array.isArray(inboundEmail.to) ? inboundEmail.to.join(', ') : (inboundEmail.to || 'unknown'),
          subject: inboundEmail.subject || 'No subject',
          status: receivedByBuyer ? 'processing (buyer received)' : receivedBySeller ? 'received (seller inbox)' : 'unknown inbox',
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
            webhookEvents[webhookEvents.length - 1].status = 'ignored (max exchanges reached)';
            return;
          }
          
          const emailBody = inboundEmail.text || inboundEmail.html || "";
          const newContent = extractNewContent(emailBody);
          console.log("📝 Extracted new content:", newContent.substring(0, 100) + "...");
          
          const prompt = `You received a sales outreach email:
From: ${inboundEmail.from}
Subject: ${inboundEmail.subject}
Body: ${newContent}

Respond as a buyer evaluating this product. Ask a qualifying question about pricing, features, or implementation. Keep it under 80 words.`;

          console.log("🤖 Calling buyer agent...");
          const response = await buyerAgent.generate(prompt);
          console.log("💬 Buyer response generated:", response.text.substring(0, 100) + "...");
          
          // Send reply
          console.log("📮 Sending buyer reply via webhook...");
          await replyToEmail({
            inbox_id: inboundEmail.inbox_id,
            message_id: inboundEmail.message_id,
            text: response.text,
          });

          // Increment exchange count in memory
          session.exchangeCount++;
          console.log(`📊 Exchange count: ${session.exchangeCount}/${MAX_EXCHANGES}`);

          // Update webhook event status
          webhookEvents[webhookEvents.length - 1].status = 'success (buyer replied)';
          console.log("✅ Buyer response sent successfully via webhook");
        } 
        // Seller receives email → generate reply
        else if (receivedBySeller) {
          console.log("📧 SELLER INBOX received email from buyer - generating response...");
          
          // Check if we've hit the exchange limit
          if (session.exchangeCount >= MAX_EXCHANGES) {
            console.log(`⏹️ Maximum exchanges (${MAX_EXCHANGES}) reached. Stopping conversation.`);
            webhookEvents[webhookEvents.length - 1].status = 'ignored (max exchanges reached)';
            return;
          }
          
          const emailBody = inboundEmail.text || inboundEmail.html || "";
          const newContent = extractNewContent(emailBody);
          console.log("📝 Extracted new content:", newContent.substring(0, 100) + "...");
          
          const prompt = `You received a reply to your sales outreach:
From: ${inboundEmail.from}
Subject: ${inboundEmail.subject}
Body: ${newContent}

Respond as a helpful sales person. Answer their questions professionally and try to move toward scheduling a meeting. Keep it under 100 words.`;

          console.log("🤖 Calling seller agent...");
          const response = await sellerAgent.generate(prompt);
          console.log("💬 Seller response generated:", response.text.substring(0, 100) + "...");
          
          // Send reply
          console.log("📮 Sending seller reply via webhook...");
          await replyToEmail({
            inbox_id: inboundEmail.inbox_id,
            message_id: inboundEmail.message_id,
            text: response.text,
          });

          // Increment exchange count in memory
          session.exchangeCount++;
          console.log(`📊 Exchange count: ${session.exchangeCount}/${MAX_EXCHANGES}`);

          // Update webhook event status
          webhookEvents[webhookEvents.length - 1].status = 'success (seller replied)';
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
    }
  });

  // Initialize demo inboxes and start conversation
  app.post("/api/demo/initialize", async (req, res) => {
    // Generate unique session ID for detailed tracking
    const timestamp = Date.now();
    const sessionId = `session-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionStartTime = new Date().toISOString();
    
    try {
      console.log("\n" + "█".repeat(100));
      console.log("█".repeat(100));
      console.log(`🆕 NEW DEMO SESSION STARTED`);
      console.log(`📋 Session ID: ${sessionId}`);
      console.log(`⏰ Timestamp: ${sessionStartTime}`);
      console.log("█".repeat(100));
      console.log("█".repeat(100) + "\n");
      
      // Clear previous webhook events and processed IDs
      webhookEvents = [];
      processedEventIds.clear();
      console.log("🔄 Reset webhook tracking");

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

      // Save session to in-memory storage
      console.log("💾 Saving demo session to memory...");
      currentDemoSession = {
        sellerInboxId,
        sellerEmail,
        buyerInboxId,
        buyerEmail,
        exchangeCount: 0,
        createdAt: new Date(),
      };
      console.log("✅ Demo session created in memory");

      console.log("Inboxes ready:", { seller: sellerEmail, buyer: buyerEmail });

      console.log("\n" + "=".repeat(80));
      console.log("🌐 PHASE 2: WEBHOOK REGISTRATION");
      console.log("=".repeat(80));
      console.log(`Session ID: ${sessionId}`);
      
      // Register webhooks for both inboxes
      // In development: use REPLIT_DEV_DOMAIN
      // In production: use REPLIT_DOMAINS (comma-separated list)
      console.log("🔍 Checking environment variables:");
      console.log("  - REPLIT_DEV_DOMAIN:", process.env.REPLIT_DEV_DOMAIN || "(not set)");
      console.log("  - REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS || "(not set)");
      console.log("  - NODE_ENV:", process.env.NODE_ENV);
      
      let replitDomain = process.env.REPLIT_DEV_DOMAIN;
      if (!replitDomain && process.env.REPLIT_DOMAINS) {
        // Production: extract first domain from comma-separated list
        replitDomain = process.env.REPLIT_DOMAINS.split(',')[0];
        console.log("📍 Using production domain:", replitDomain);
      } else if (replitDomain) {
        console.log("📍 Using development domain:", replitDomain);
      }

      if (!replitDomain) {
        console.error("\n" + "❌".repeat(40));
        console.error("❌ NO REPLIT DOMAIN FOUND");
        console.error("❌".repeat(40));
        console.error("Session ID:", sessionId);
        console.error("Cannot register webhooks - demo initialization failed");
        console.error("❌".repeat(40) + "\n");
        throw new Error("No Replit domain found - cannot register webhooks");
      }

      const webhookUrl = `https://${replitDomain}/webhooks/agentmail`;
      console.log(`🔗 Webhook URL: ${webhookUrl}`);
      console.log(`📬 Seller inbox ID: ${sellerInboxId}`);
      console.log(`📬 Buyer inbox ID: ${buyerInboxId}`);
      
      // Register webhooks - let errors propagate and fail the entire initialization
      console.log("⏳ Registering webhooks with AgentMail API...");
      const webhookStart = Date.now();
      const results = await Promise.all([
        registerWebhook(sellerInboxId, webhookUrl),
        registerWebhook(buyerInboxId, webhookUrl),
      ]);
      const webhookDuration = Date.now() - webhookStart;
      console.log(`✅ Webhook registration successful in ${webhookDuration}ms!`);
      console.log("📋 Seller webhook result:", JSON.stringify(results[0], null, 2));
      console.log("📋 Buyer webhook result:", JSON.stringify(results[1], null, 2));
      console.log("=".repeat(80) + "\n");

      console.log("\n" + "=".repeat(80));
      console.log("📧 PHASE 3: EMAIL SENDING");
      console.log("=".repeat(80));
      console.log(`Session ID: ${sessionId}`);
      
      // Generate seller's first email using agent
      console.log("🤖 Generating seller's outreach email using AI agent...");
      const agentStart = Date.now();
      const sellerMessage = await sellerAgent.generate(
        "Write a brief sales outreach email to Sarah, a VP of Sales at TechCorp. Introduce AgentBox, a product that helps with sales qualification using AI agents. Keep it under 100 words and professional."
      );
      const agentDuration = Date.now() - agentStart;
      console.log(`✅ Seller message generated in ${agentDuration}ms`);
      console.log("📝 Generated message preview:", sellerMessage.text.substring(0, 150) + "...");
      console.log("📏 Message length:", sellerMessage.text.length, "characters");

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
        message: "Demo initialized - webhooks will handle buyer response",
      });
    } catch (error) {
      console.error("Error initializing demo:", error);
      res.status(500).json({ error: "Failed to initialize demo" });
    }
  });

  // Fetch demo messages
  app.get("/api/demo/messages", async (req, res) => {
    try {
      // Load session from in-memory storage
      const session = currentDemoSession;
      
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

  const httpServer = createServer(app);

  return httpServer;
}
