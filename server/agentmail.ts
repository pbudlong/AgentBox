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

  return await agentmail.inboxes.create({
    username,
    domain: "agentmail.to",
    displayName,
  });
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

  return await agentmail.inboxes.messages.send(params);
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

  return await agentmail.inboxes.messages.reply(params);
}

export async function listMessages(inbox_id: string) {
  if (!agentmail) {
    throw new Error("AgentMail not configured");
  }

  return await agentmail.inboxes.messages.list({ inbox_id });
}
