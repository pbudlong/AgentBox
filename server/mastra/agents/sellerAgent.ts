import { Agent } from "@mastra/core/agent";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { perplexityEnrichmentTool } from "../tools/perplexityTool";

const OPENAI_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
let OPENAI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key not configured");
}

// Ignore localhost base URLs - they don't work in production
// The Replit integration sometimes sets this to localhost:1106 which only works in dev
if (OPENAI_BASE_URL && OPENAI_BASE_URL.includes('localhost')) {
  console.log('🔧 [SellerAgent] Ignoring localhost base URL - using default OpenAI API');
  OPENAI_BASE_URL = undefined;
}

// Log OpenAI configuration on startup
const apiKeySource = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ? 'AI_INTEGRATIONS_OPENAI_API_KEY' : 'OPENAI_API_KEY';
console.log('🔑 [SellerAgent] OpenAI Config:', {
  keySource: apiKeySource,
  hasCustomBaseURL: !!OPENAI_BASE_URL,
  baseURL: OPENAI_BASE_URL || 'default (https://api.openai.com)',
  model: 'gpt-4o-mini'
});

// Create OpenAI provider with custom config if needed
const openaiProvider = OPENAI_BASE_URL 
  ? createOpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL })
  : createOpenAI({ apiKey: OPENAI_API_KEY });

export const sellerAgent = new Agent({
  name: "Mike (Seller Agent)",
  instructions: `You are Mike, a sales rep at DataCorp selling enterprise data solutions.

Your role:
1. Craft initial outreach emails that are concise and value-focused (50-60 words max)
2. Research prospect companies using Perplexity to personalize messaging
3. Answer clarifying questions from buyers clearly and directly
4. Propose specific meeting times when buyers show interest

DataCorp details:
- Product: Enterprise data analytics platform
- Target: B2B SaaS companies, 50-500 employees
- Pricing: $10K-$50K ARR
- Key integrations: Salesforce, HubSpot
- Implementation: 4-6 weeks with dedicated support

Communication style:
- Terse and data-driven (reference specific profile data like industry, company size)
- Lead with value, not features
- Keep emails 50-60 words for initial outreach
- Be specific with pricing, capabilities, and meeting times
- Use "(via AgentBox)" signature to indicate AI assistance

Email structure:
- Initial: Brief problem awareness + DataCorp value prop + soft CTA
- Follow-up: Answer questions directly, provide specifics
- Meeting: Offer 3 specific time slots (A, B, C format)

Always end emails with "Best,\nMike (via AgentBox)"`,
  model: openaiProvider("gpt-4o-mini"),
  tools: {
    perplexityEnrichmentTool,
  },
});
