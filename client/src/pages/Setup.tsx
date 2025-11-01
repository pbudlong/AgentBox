import ProgressIndicator from "@/components/ProgressIndicator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Settings, Calendar, Database, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    number: 1,
    icon: Mail,
    title: "Claim Your AgentBox Email",
    description: "Pick your unique @agentbox.ai address",
    details: [
      "Choose: firstname.lastname@agentbox.ai",
      "Verify via your business email",
      "Get instant SMTP/IMAP credentials",
    ],
    duration: "2 min",
  },
  {
    number: 2,
    icon: Settings,
    title: "Set Your Preferences",
    description: "Tell your agent what matters",
    details: [
      "Industry & company size targets",
      "Budget ranges you work with",
      "Tech stack requirements",
      "Geographic preferences",
      "Timing windows (Q1, H2, etc)",
    ],
    duration: "5 min",
  },
  {
    number: 3,
    icon: Calendar,
    title: "Connect Your Calendar",
    description: "For automatic scheduling",
    details: [
      "OAuth with Google/Outlook",
      "Set availability rules",
      "Define meeting types & durations",
      "Add buffer times",
    ],
    duration: "3 min",
  },
  {
    number: 4,
    icon: Database,
    title: "Link Your CRM (Optional)",
    description: "Auto-sync qualified leads",
    details: [
      "Supports Salesforce, HubSpot, Pipedrive",
      "Map fields to agent data",
      "Set auto-create rules",
      "Configure notifications",
    ],
    duration: "5 min",
  },
];

const quickTips = [
  "Add your AgentBox email to your LinkedIn & website",
  "Set bCC preferences (never, clarify, confirm)",
  "Configure scoring threshold (default: 70/100)",
  "Test with a colleague's AgentBox first",
  "One-click pause/override always available",
];

export default function Setup() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      <div className="flex-1 pt-24 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-setup-heading">
              Get Started in Minutes
            </h1>
            <p className="text-xl text-muted-foreground">
              Simple onboarding, powerful automation
            </p>
          </div>

          {/* Onboarding Steps */}
          <div className="space-y-8 mb-16">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={index}
                  className="p-8 hover-elevate transition-all duration-300"
                  data-testid={`card-setup-step-${index}`}
                >
                  <div className="flex items-start gap-6">
                    {/* Step number */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gradient-from to-gradient-via flex items-center justify-center text-white font-bold text-xl">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold" data-testid={`text-setup-step-title-${index}`}>
                          {step.title}
                        </h3>
                        <Badge variant="secondary" className="ml-auto">
                          {step.duration}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4" data-testid={`text-setup-step-desc-${index}`}>
                        {step.description}
                      </p>

                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span data-testid={`text-setup-detail-${index}-${detailIndex}`}>
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Tips */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-gradient-via/5 to-transparent border-gradient-via/30">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" data-testid="text-quick-tips-heading">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Pro Tips for Success
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground" data-testid={`text-quick-tip-${index}`}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg"
              className="text-lg px-8 h-12 hover-elevate active-elevate-2"
              onClick={() => navigate("/tech")}
              data-testid="button-next-tech"
            >
              See the Tech Behind It
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
