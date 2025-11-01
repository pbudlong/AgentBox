import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { buyerAgent, sellerAgent } from "./mastra/index";
import { replyToEmail, type InboundEmail, createInbox, sendEmail, listMessages, findInboxByEmail } from "./agentmail";

// In-memory storage for demo inbox IDs
let demoInboxes: {
  seller?: { inbox_id: string; email: string };
  buyer?: { inbox_id: string; email: string };
} = {};

export async function registerRoutes(app: Express): Promise<Server> {
  // AgentMail webhook endpoint for inbound emails
  app.post("/webhooks/agentmail", async (req, res) => {
    try {
      const inboundEmail: InboundEmail = req.body;
      
      console.log("Received inbound email:", {
        from: inboundEmail.from,
        to: inboundEmail.to,
        subject: inboundEmail.subject,
      });

      // Quick response to webhook
      res.json({ success: true, message: "Email received" });

      // Process email asynchronously
      const isBuyerEmail = inboundEmail.to.includes("buyer-demo");
      
      // Only auto-respond if buyer receives an email
      if (isBuyerEmail && demoInboxes.buyer) {
        console.log("Buyer received email, generating response...");
        
        const emailBody = inboundEmail.text || inboundEmail.html || "";
        const prompt = `You received a sales outreach email:
From: ${inboundEmail.from}
Subject: ${inboundEmail.subject}
Body: ${emailBody}

Respond as a buyer evaluating this product. Ask a qualifying question about pricing, features, or implementation. Keep it under 80 words.`;

        const response = await buyerAgent.generate(prompt);
        
        // Send reply
        await replyToEmail({
          inbox_id: inboundEmail.inbox_id,
          message_id: inboundEmail.message_id,
          text: response.text,
        });

        console.log("Buyer response sent successfully");
      } else {
        console.log("Email received by seller, no auto-response needed");
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  });

  // Initialize demo inboxes and start conversation
  app.post("/api/demo/initialize", async (req, res) => {
    try {
      console.log("Initializing demo inboxes...");

      // Create or reuse seller inbox
      try {
        const sellerInbox = await createInbox("seller-demo", "AgentBox Seller");
        demoInboxes.seller = {
          inbox_id: (sellerInbox as any).inbox_id,
          email: (sellerInbox as any).email,
        };
        console.log("Created new seller inbox:", demoInboxes.seller.email);
      } catch (error: any) {
        // If inbox already exists, find it by email
        if (error?.status === 403 || error?.message?.includes("already exists")) {
          console.log("Seller inbox already exists, fetching existing inbox...");
          const existingInbox = await findInboxByEmail("seller-demo@agentmail.to");
          if (existingInbox) {
            demoInboxes.seller = {
              inbox_id: (existingInbox as any).inboxId, // inboxId contains the email
              email: (existingInbox as any).inboxId,
            };
            console.log("Reusing seller inbox:", demoInboxes.seller.email);
          } else {
            throw new Error("Seller inbox exists but could not be found");
          }
        } else {
          throw error;
        }
      }

      // Create or reuse buyer inbox
      try {
        const buyerInbox = await createInbox("buyer-demo", "AgentBox Buyer");
        demoInboxes.buyer = {
          inbox_id: (buyerInbox as any).inbox_id,
          email: (buyerInbox as any).email,
        };
        console.log("Created new buyer inbox:", demoInboxes.buyer.email);
      } catch (error: any) {
        // If inbox already exists, find it by email
        if (error?.status === 403 || error?.message?.includes("already exists")) {
          console.log("Buyer inbox already exists, fetching existing inbox...");
          const existingInbox = await findInboxByEmail("buyer-demo@agentmail.to");
          if (existingInbox) {
            demoInboxes.buyer = {
              inbox_id: (existingInbox as any).inboxId, // inboxId contains the email
              email: (existingInbox as any).inboxId,
            };
            console.log("Reusing buyer inbox:", demoInboxes.buyer.email);
          } else {
            throw new Error("Buyer inbox exists but could not be found");
          }
        } else {
          throw error;
        }
      }

      console.log("Inboxes ready:", demoInboxes);

      // Generate seller's first email using agent
      const sellerMessage = await sellerAgent.generate(
        "Write a brief sales outreach email to a potential B2B SaaS buyer. Introduce a product that helps with sales qualification. Keep it under 100 words and professional."
      );

      // Send first email from seller to buyer
      await sendEmail({
        inbox_id: demoInboxes.seller.inbox_id,
        to: demoInboxes.buyer.email,
        subject: "Streamline Your Sales Qualification Process",
        text: sellerMessage.text,
      });

      console.log("Initial email sent from seller to buyer");

      res.json({
        success: true,
        seller: demoInboxes.seller.email,
        buyer: demoInboxes.buyer.email,
        message: "Demo initialized successfully",
      });
    } catch (error) {
      console.error("Error initializing demo:", error);
      res.status(500).json({ error: "Failed to initialize demo" });
    }
  });

  // Fetch demo messages
  app.get("/api/demo/messages", async (req, res) => {
    try {
      if (!demoInboxes.seller || !demoInboxes.buyer) {
        return res.json({ messages: [], initialized: false });
      }

      // Fetch messages from both inboxes
      const [sellerMessages, buyerMessages] = await Promise.all([
        listMessages(demoInboxes.seller.inbox_id),
        listMessages(demoInboxes.buyer.inbox_id),
      ]);

      // Combine and sort by timestamp
      const allMessages = [
        ...(sellerMessages.messages || []).map((m: any) => ({ ...m, inbox: "seller" })),
        ...(buyerMessages.messages || []).map((m: any) => ({ ...m, inbox: "buyer" })),
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      res.json({
        messages: allMessages,
        initialized: true,
        seller: demoInboxes.seller.email,
        buyer: demoInboxes.buyer.email,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
