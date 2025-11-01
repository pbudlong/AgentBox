import { Mastra } from "@mastra/core/mastra";
import { buyerAgent } from "./agents/buyerAgent";
import { sellerAgent } from "./agents/sellerAgent";

export const mastra = new Mastra({
  agents: { 
    buyerAgent,
    sellerAgent 
  },
});

export { buyerAgent, sellerAgent };
