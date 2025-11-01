import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const perplexityEnrichmentTool = createTool({
  id: "perplexity-company-research",
  description: "Research a company using Perplexity AI to get information about company size, industry, tech stack, funding, and other business details",
  inputSchema: z.object({
    companyName: z.string().describe("Company name to research"),
    companyDomain: z.string().optional().describe("Company website domain (optional)"),
  }),
  outputSchema: z.object({
    industry: z.string().optional(),
    companySize: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    funding: z.string().optional(),
    headquarters: z.string().optional(),
    description: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const query = context.companyDomain
      ? `Research ${context.companyName} (${context.companyDomain}): What is their industry, approximate company size (number of employees), tech stack, funding status, and headquarters location?`
      : `Research ${context.companyName}: What is their industry, approximate company size (number of employees), tech stack, funding status, and headquarters location?`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a business research assistant. Provide factual, concise information about companies. Format your response as structured data."
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // Parse the response to extract structured data
    // This is a simple parser - in production you'd want more robust extraction
    return {
      industry: extractField(content, ["industry", "sector"]),
      companySize: extractField(content, ["employees", "company size", "team size"]),
      techStack: extractTechStack(content),
      funding: extractField(content, ["funding", "raised", "valuation"]),
      headquarters: extractField(content, ["headquarters", "location", "based in"]),
      description: content.substring(0, 200),
    };
  },
});

function extractField(text: string, keywords: string[]): string | undefined {
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[:\\s]+(.*?)(?:[.\\n]|$)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractTechStack(text: string): string[] | undefined {
  const techKeywords = ['stack', 'technology', 'technologies', 'tools', 'using'];
  for (const keyword of techKeywords) {
    const regex = new RegExp(`${keyword}[:\\s]+(.*?)(?:[.\\n]|$)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1]
        .split(/[,;]/)
        .map(t => t.trim())
        .filter(t => t.length > 0);
    }
  }
  return undefined;
}
