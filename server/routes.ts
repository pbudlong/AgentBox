import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { buyerAgent, sellerAgent } from "./mastra/index";
import { replyToEmail, type InboundEmail } from "./agentmail";

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

      // Determine which agent should handle this email
      const isBuyerEmail = inboundEmail.to.includes("buyer");
      const agent = isBuyerEmail ? buyerAgent : sellerAgent;
      
      // Generate agent response
      const emailBody = inboundEmail.text || inboundEmail.html || "";
      const prompt = `You received an email:
From: ${inboundEmail.from}
Subject: ${inboundEmail.subject}
Body: ${emailBody}

Generate an appropriate response based on your role and instructions.`;

      const response = await agent.generate(prompt);
      
      // Send reply via AgentMail
      await replyToEmail({
        inbox_id: inboundEmail.inbox_id,
        message_id: inboundEmail.message_id,
        text: response.text,
      });

      console.log("Agent response sent successfully");
      res.json({ success: true, message: "Email processed" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Failed to process email" });
    }
  });

  // API endpoint to get demo thread messages
  app.get("/api/threads/:threadId", async (req, res) => {
    try {
      // For now, return mock data - will be replaced with real storage
      res.json({
        threadId: req.params.threadId,
        status: "collecting",
        messages: [],
      });
    } catch (error) {
      console.error("Error fetching thread:", error);
      res.status(500).json({ error: "Failed to fetch thread" });
    }
  });

  // API endpoint to create a test demo conversation
  app.post("/api/demo/start", async (req, res) => {
    try {
      // This will trigger a demo conversation between buyer and seller agents
      const sellerMessage = await sellerAgent.generate(
        "Write a brief introduction email to a potential buyer who works at a B2B SaaS company. Keep it under 100 words."
      );

      res.json({
        success: true,
        message: sellerMessage.text,
      });
    } catch (error) {
      console.error("Error starting demo:", error);
      res.status(500).json({ error: "Failed to start demo" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
