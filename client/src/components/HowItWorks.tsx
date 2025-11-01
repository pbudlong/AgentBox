import { Card } from "@/components/ui/card";
import { Mail, Settings, MessageSquare } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Mail,
    title: "Claim your @agentbox.ai address",
    description: "Get your unique email like aria@agentbox.ai",
  },
  {
    number: 2,
    icon: Settings,
    title: "Set preferences",
    description: "Industry, company size, budget, timing, tools",
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "Email another AgentBox address",
    description: "Agents converse, score fit, and book only if above threshold",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-10 px-8 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center" data-testid="text-how-it-works-heading">
          How It Works
        </h2>

        <div className="relative">
          {/* Desktop: Horizontal timeline */}
          <div className="hidden md:flex justify-between items-start gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex-1 relative">
                  <Card className="p-8 hover-elevate transition-all duration-300" data-testid={`card-step-${index}`}>
                    {/* Number badge */}
                    <div className="absolute -top-4 left-8">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gradient-from to-gradient-via flex items-center justify-center text-white font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3" data-testid={`text-step-title-${index}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-desc-${index}`}>
                      {step.description}
                    </p>
                  </Card>

                  {/* Dotted line connector (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 left-full w-8 flex items-center justify-center">
                      <div className="w-full border-t-2 border-dashed border-primary/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="p-6 hover-elevate transition-all duration-300" data-testid={`card-step-mobile-${index}`}>
                    {/* Number badge */}
                    <div className="absolute -top-4 left-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gradient-from to-gradient-via flex items-center justify-center text-white font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-4 mt-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </Card>

                  {/* Dotted line connector (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-4">
                      <div className="w-0.5 h-8 border-l-2 border-dashed border-primary/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
