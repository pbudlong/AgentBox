import ProgressIndicator from "@/components/ProgressIndicator";
import HeroSection from "@/components/HeroSection";
import ValuePropositionCards from "@/components/ValuePropositionCards";
import HowItWorks from "@/components/HowItWorks";
import LinkedInMockup from "@/components/LinkedInMockup";
import TrustSection from "@/components/TrustSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function ProblemSolution() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator />
      
      {/* AgentBox logo in header space */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-gradient-via/20 border border-primary/30 backdrop-blur-sm">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
            AgentBox
          </span>
        </div>
      </div>

      <div className="pt-16">
        <HeroSection />
        <ValuePropositionCards />
        <HowItWorks />
        <LinkedInMockup />
        <TrustSection />
        
        {/* CTA to next step */}
        <div className="py-12 text-center">
          <Button 
            size="lg"
            className="text-lg px-8 h-12 hover-elevate active-elevate-2"
            onClick={() => navigate("/demo")}
            data-testid="button-next-demo"
          >
            Watch Agents in Action
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
