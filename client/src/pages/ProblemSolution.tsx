import ProgressIndicator from "@/components/ProgressIndicator";
import HeroSection from "@/components/HeroSection";
import ValuePropositionCards from "@/components/ValuePropositionCards";
import HowItWorks from "@/components/HowItWorks";
import LinkedInMockup from "@/components/LinkedInMockup";
import TrustSection from "@/components/TrustSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function ProblemSolution() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator />
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
