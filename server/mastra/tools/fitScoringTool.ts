import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface Signal {
  name: string;
  weight: number;
  value: number; // 0-1 score
}

export const fitScoringTool = createTool({
  id: "calculate-fit-score",
  description: "Calculate qualification fit score based on 8 signals: industry match, company size match, geographic match, need/intent, timing, budget alignment, decision authority, and tech stack compatibility",
  inputSchema: z.object({
    sellerProfile: z.object({
      targetIndustries: z.array(z.string()),
      targetCompanySize: z.object({
        min: z.number(),
        max: z.number(),
      }),
      targetGeo: z.array(z.string()),
      budgetRange: z.object({
        min: z.number(),
        max: z.number(),
      }),
      requiredTechStack: z.array(z.string()).optional(),
    }),
    buyerProfile: z.object({
      industry: z.string(),
      companySize: z.number(),
      location: z.string(),
      budget: z.number().optional(),
      techStack: z.array(z.string()).optional(),
      timing: z.string().optional(), // e.g., "Q1 2025", "immediate", "exploring"
      authority: z.string().optional(), // e.g., "decision maker", "influencer", "researcher"
    }),
    emailContent: z.string().describe("The email message content to analyze for intent signals"),
  }),
  outputSchema: z.object({
    overallScore: z.number().describe("0-100 fit score"),
    signals: z.array(z.object({
      name: z.string(),
      matched: z.boolean(),
      value: z.string(),
      weight: z.number(),
      score: z.number(),
    })),
    recommendation: z.enum(["decline", "clarify", "propose_meeting"]),
    missingInfo: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { sellerProfile, buyerProfile, emailContent } = context;
    const signals: Signal[] = [];

    // 1. Industry Match (weight: 20)
    const industryMatch = sellerProfile.targetIndustries.some(
      targetInd => buyerProfile.industry.toLowerCase().includes(targetInd.toLowerCase())
    );
    signals.push({
      name: "Industry Match",
      weight: 20,
      value: industryMatch ? 1 : 0,
    });

    // 2. Company Size Match (weight: 15)
    const sizeMatch = buyerProfile.companySize >= sellerProfile.targetCompanySize.min &&
                      buyerProfile.companySize <= sellerProfile.targetCompanySize.max;
    signals.push({
      name: "Company Size",
      weight: 15,
      value: sizeMatch ? 1 : 0,
    });

    // 3. Geographic Match (weight: 10)
    const geoMatch = sellerProfile.targetGeo.some(
      targetGeo => buyerProfile.location.toLowerCase().includes(targetGeo.toLowerCase())
    );
    signals.push({
      name: "Geographic Match",
      weight: 10,
      value: geoMatch ? 1 : 0,
    });

    // 4. Need/Intent (weight: 15) - analyze email content
    const intentKeywords = ['looking for', 'need', 'interested in', 'want to', 'seeking', 'help us'];
    const hasIntent = intentKeywords.some(keyword =>
      emailContent.toLowerCase().includes(keyword)
    );
    signals.push({
      name: "Need Intent",
      weight: 15,
      value: hasIntent ? 1 : 0.5,
    });

    // 5. Timing (weight: 10)
    const timingUrgent = buyerProfile.timing?.toLowerCase().includes('q1') ||
                        buyerProfile.timing?.toLowerCase().includes('immediate') ||
                        emailContent.toLowerCase().includes('asap') ||
                        emailContent.toLowerCase().includes('soon');
    signals.push({
      name: "Timing",
      weight: 10,
      value: timingUrgent ? 1 : (buyerProfile.timing ? 0.7 : 0.3),
    });

    // 6. Budget Alignment (weight: 15)
    let budgetScore = 0.5;
    if (buyerProfile.budget) {
      budgetScore = (buyerProfile.budget >= sellerProfile.budgetRange.min &&
                    buyerProfile.budget <= sellerProfile.budgetRange.max) ? 1 : 0.3;
    }
    signals.push({
      name: "Budget Range",
      weight: 15,
      value: budgetScore,
    });

    // 7. Authority (weight: 10)
    const hasAuthority = buyerProfile.authority?.toLowerCase().includes('decision') ||
                        buyerProfile.authority?.toLowerCase().includes('director') ||
                        buyerProfile.authority?.toLowerCase().includes('vp') ||
                        buyerProfile.authority?.toLowerCase().includes('c-level');
    signals.push({
      name: "Authority",
      weight: 10,
      value: hasAuthority ? 1 : 0.5,
    });

    // 8. Tech Stack Compatibility (weight: 5)
    let techScore = 0.5;
    if (sellerProfile.requiredTechStack && buyerProfile.techStack) {
      const matches = sellerProfile.requiredTechStack.filter(tech =>
        buyerProfile.techStack?.some(buyerTech =>
          buyerTech.toLowerCase().includes(tech.toLowerCase())
        )
      );
      techScore = matches.length > 0 ? 1 : 0.3;
    }
    signals.push({
      name: "Stack Compatibility",
      weight: 5,
      value: techScore,
    });

    // Calculate overall score
    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = signals.reduce((sum, s) => sum + (s.weight * s.value), 0);
    const overallScore = Math.round((weightedSum / totalWeight) * 100);

    // Determine recommendation
    let recommendation: "decline" | "clarify" | "propose_meeting";
    if (overallScore >= 75) {
      recommendation = "propose_meeting";
    } else if (overallScore >= 50) {
      recommendation = "clarify";
    } else {
      recommendation = "decline";
    }

    // Identify missing information
    const missingInfo: string[] = [];
    if (!buyerProfile.budget) missingInfo.push("budget");
    if (!buyerProfile.timing) missingInfo.push("timing");
    if (!buyerProfile.authority) missingInfo.push("authority");
    if (!buyerProfile.techStack || buyerProfile.techStack.length === 0) {
      if (sellerProfile.requiredTechStack && sellerProfile.requiredTechStack.length > 0) {
        missingInfo.push("tech stack");
      }
    }

    return {
      overallScore,
      signals: signals.map(s => ({
        name: s.name,
        matched: s.value >= 0.7,
        value: String(s.value),
        weight: s.weight,
        score: Math.round(s.value * s.weight),
      })),
      recommendation,
      missingInfo,
    };
  },
});
