import { Card } from "@/components/ui/card";
import { CheckCircle2, Users, Zap, FileText, Filter, Calendar, Shield } from "lucide-react";

const sellerBenefits = [
  {
    icon: CheckCircle2,
    title: "Fewer no-shows, better win rates",
    description: "Only qualified buyers make it to your calendar.",
  },
  {
    icon: Zap,
    title: "Automatic discovery & follow-ups",
    description: "Your agent asks missing questions, nudges respectfully, and closes loops.",
  },
  {
    icon: FileText,
    title: "Faster handoffs",
    description: "Summary + CRM-ready notes in every thread.",
  },
];

const buyerBenefits = [
  {
    icon: Filter,
    title: "No pitch spam",
    description: "Your agent filters inbound sellers to your criteria.",
  },
  {
    icon: Users,
    title: "One-email intake",
    description: "The agent gathers details from the seller so you don't have to.",
  },
  {
    icon: Calendar,
    title: "Calendars respected",
    description: "Meetings happen only when there's clear value.",
  },
];

export default function ValuePropositionCards() {
  return (
    <section className="py-4 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Why Sellers */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center" data-testid="text-why-sellers-heading">
            Why Sellers Love AgentBox
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 hover-elevate transition-all duration-300 border-card-border"
                  data-testid={`card-seller-benefit-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2" data-testid={`text-seller-benefit-title-${index}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`text-seller-benefit-desc-${index}`}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Why Buyers */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center" data-testid="text-why-buyers-heading">
            Why Buyers Love AgentBox
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 hover-elevate transition-all duration-300 border-card-border"
                  data-testid={`card-buyer-benefit-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-gradient-from to-gradient-via/50 text-white flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2" data-testid={`text-buyer-benefit-title-${index}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`text-buyer-benefit-desc-${index}`}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
