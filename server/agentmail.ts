import { AgentMailClient } from "agentmail";

const apiKey = process.env.AGENTMAIL_API_KEY;

if (!apiKey) {
  console.warn("AGENTMAIL_API_KEY not configured - email functionality will be limited");
}

export const agentmail = apiKey ? new AgentMailClient({ apiKey }) : null;

export interface InboundEmail {
  inbox_id: string;
  message_id: string;
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  thread_id?: string;
}

export async function createInbox(username: string, displayName: string) {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  const result = await agentmail.inboxes.create({
    username,
    domain: "agentmail.to",
    displayName,
  });
  
  console.log("Created inbox result:", JSON.stringify(result, null, 2));
  return result;
}

export async function sendEmail(params: {
  inbox_id: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  return await agentmail.inboxes.messages.send(params.inbox_id, {
    to: [params.to],
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}

export async function replyToEmail(params: {
  inbox_id: string;
  message_id: string;
  text?: string;
  html?: string;
}) {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  return await agentmail.inboxes.messages.reply(
    params.inbox_id,
    params.message_id,
    {
      text: params.text,
      html: params.html,
    }
  );
}

export async function listMessages(inbox_id: string) {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  console.log("Calling listMessages with inbox_id:", inbox_id);
  const result = await agentmail.inboxes.messages.list(inbox_id);
  console.log("listMessages returned", result.messages?.length || 0, "messages for inbox:", inbox_id);
  return result;
}

export async function getMessage(inbox_id: string, message_id: string) {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  const result = await agentmail.inboxes.messages.get(inbox_id, message_id);
  return result;
}

export async function listInboxes() {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  // Get first page of inboxes
  const response: any = await agentmail.inboxes.list();
  
  // AgentMail API returns { count: X, inboxes: [...] }
  return response?.inboxes || [];
}

export async function findInboxByEmail(email: string) {
  const inboxes = await listInboxes();
  
  // AgentMail inboxes have inboxId field that contains the email address
  const found = inboxes.find((inbox: any) => inbox.inboxId === email);
  
  if (found) {
    console.log("Found existing inbox:", email);
    console.log("Inbox object keys:", Object.keys(found));
    console.log("Inbox object:", JSON.stringify(found, null, 2));
  } else {
    console.log("Inbox not found:", email);
  }
  
  return found;
}

export async function registerWebhook(inbox_id: string, webhookUrl: string) {
  if (!agentmail || !apiKey) {
    throw new Error("AgentMail not configured");
  }

  console.log(`Registering webhook for inbox ${inbox_id} at ${webhookUrl}`);

  // Call AgentMail API to register webhook
  const response = await fetch("https://api.agentmail.to/v0/webhooks", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inbox_id: inbox_id,
      url: webhookUrl,
      event_types: ["message.received"], // Note: AgentMail uses dot notation, not underscore
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to register webhook:", error);
    throw new Error(`Webhook registration failed: ${error}`);
  }

  const result = await response.json();
  console.log("Webhook registered successfully:", result);
  return result;
}
