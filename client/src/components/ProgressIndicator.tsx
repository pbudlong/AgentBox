import { useLocation } from "wouter";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const steps = [
  { id: 1, name: "Cover", path: "/" },
  { id: 2, name: "Problem", path: "/problem" },
  { id: 3, name: "Buyer", path: "/buyer" },
  { id: 4, name: "Seller", path: "/seller" },
  { id: 5, name: "Demo", path: "/demo" },
  { id: 6, name: "Live", path: "/live" },
  { id: 7, name: "Tech", path: "/tech" },
];

export default function ProgressIndicator() {
  const [location, navigate] = useLocation();

  const currentStepIndex = steps.findIndex(step => step.path === location);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-8 py-3">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => navigate(step.path)}
                  className={`flex items-center gap-2 hover-elevate px-3 py-1.5 rounded-md transition-all ${
                    isCurrent ? 'bg-primary/10' : ''
                  }`}
                  data-testid={`button-step-${step.id}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : isCurrent ? (
                    <Circle className="h-4 w-4 text-primary fill-primary" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span 
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-foreground' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}
                    data-testid={`text-step-name-${step.id}`}
                  >
                    {step.name}
                  </span>
                </button>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
