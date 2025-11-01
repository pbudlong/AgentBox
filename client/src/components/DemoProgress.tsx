import { CheckCircle2 } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface DemoProgressProps {
  currentStep: number;
  steps: Step[];
}

export default function DemoProgress({ currentStep, steps }: DemoProgressProps) {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="max-w-5xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step indicator */}
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-gradient-to-br from-gradient-from to-gradient-via text-white ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${step.number}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors hidden sm:inline ${
                      isActive
                        ? "text-foreground"
                        : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/70"
                    }`}
                    data-testid={`step-label-${step.number}`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2">
                    <div
                      className={`h-full transition-all ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
