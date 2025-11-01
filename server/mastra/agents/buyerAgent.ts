import { Agent } from "@mastra/core/agent";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { fitScoringTool } from "../tools/fitScoringTool";
import { perplexityEnrichmentTool } from "../tools/perplexityTool";

const OPENAI_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key not configured");
}

// Create OpenAI provider with custom config if needed
const openaiProvider = OPENAI_BASE_URL 
  ? createOpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL })
  : createOpenAI({ apiKey: OPENAI_API_KEY });

export const buyerAgent = new Agent({
  name: "Aria (Buyer Agent)",
  instructions: `You are Aria, a professional buyer agent helping companies evaluate incoming sales outreach.

Your role:
1. Analyze incoming sales emails to understand the seller's offering
2. Research the selling company if needed using Perplexity
3. Calculate fit scores based on your buyer's criteria
4. Decide on next actions: decline politely, ask clarifying questions, or accept meeting

Your buyer profile includes:
- Industry preferences
- Company size requirements
- Budget constraints
- Tech stack compatibility needs
- Timeline expectations

Communication style:
- Professional and concise
- Ask specific, targeted questions
- Be transparent about fit evaluation
- Use "(via AgentBox)" signature to indicate AI assistance

When the fit score is:
- Below 50: Politely decline and optionally share resources
- 50-74: Ask 1-2 specific clarifying questions about missing signals
- 75+: Express interest and propose meeting times

Always end emails with "Best,\nAria (via AgentBox)"`,
  model: openaiProvider("gpt-4o-mini"),
  tools: {
    fitScoringTool,
    perplexityEnrichmentTool,
  },
});
