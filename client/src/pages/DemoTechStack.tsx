import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "wouter";
import DemoProgress from "@/components/DemoProgress";
import TechStack from "@/components/TechStack";

const DEMO_STEPS = [
  { number: 1, label: "Cover" },
  { number: 2, label: "Landing" },
  { number: 3, label: "Live Demo" },
  { number: 4, label: "Tech Stack" },
];

export default function DemoTechStack() {
  const [, setLocation] = useLocation();

  const handleBackToStart = () => {
    setLocation("/demo");
  };

  return (
    <div className="min-h-screen pt-16">
      <DemoProgress currentStep={4} steps={DEMO_STEPS} />
      
      <div className="pt-12">
        <TechStack />
        
        {/* Back to start button */}
        <div className="py-16 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleBackToStart}
            variant="outline"
            className="text-lg px-10 h-14 hover-elevate active-elevate-2"
            data-testid="button-back-to-start"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Start
          </Button>
        </div>
      </div>
    </div>
  );
}
