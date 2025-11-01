import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import DemoProgress from "@/components/DemoProgress";
import HeroSection from "@/components/HeroSection";
import ValuePropositionCards from "@/components/ValuePropositionCards";
import HowItWorks from "@/components/HowItWorks";
import LinkedInMockup from "@/components/LinkedInMockup";
import TrustSection from "@/components/TrustSection";

const DEMO_STEPS = [
  { number: 1, label: "Cover" },
  { number: 2, label: "Landing" },
  { number: 3, label: "Live Demo" },
  { number: 4, label: "Tech Stack" },
];

export default function DemoLanding() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/demo/live");
  };

  return (
    <div className="min-h-screen pt-16">
      <DemoProgress currentStep={2} steps={DEMO_STEPS} />
      
      <div className="pt-12">
        <HeroSection />
        <ValuePropositionCards />
        <HowItWorks />
        <LinkedInMockup />
        <TrustSection />
        
        {/* Next button */}
        <div className="py-16 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleNext}
            className="text-lg px-10 h-14 shadow-lg shadow-primary/30 hover-elevate active-elevate-2"
            data-testid="button-next-to-live-demo"
          >
            See Live Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
