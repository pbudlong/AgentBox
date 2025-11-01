import ProgressIndicator from "@/components/ProgressIndicator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Clock, Target, Users, CheckCircle2, Star } from "lucide-react";
import { useLocation } from "wouter";

const metrics = [
  {
    icon: TrendingUp,
    value: "40%",
    label: "Higher Win Rates",
    description: "Only qualified meetings reach your calendar",
  },
  {
    icon: Clock,
    value: "12hrs",
    label: "Saved Per Week",
    description: "No more unqualified discovery calls",
  },
  {
    icon: Target,
    value: "3x",
    label: "Better Targeting",
    description: "Agents pre-qualify on 8+ signals",
  },
  {
    icon: Users,
    value: "85%",
    label: "Show-up Rate",
    description: "When agents book, both parties are committed",
  },
];

const testimonials = [
  {
    quote: "Our SDRs went from 30 intros a week to 12 qualified meetings. Revenue up, burnout down.",
    author: "Sarah Chen",
    role: "VP Sales, SaaS Startup",
    company: "TechFlow",
  },
  {
    quote: "I was drowning in pitch emails. Now my agent filters to my criteria and I only see what matters.",
    author: "Marcus Johnson",
    role: "Head of Procurement",
    company: "Enterprise Co",
  },
  {
    quote: "The fit scoring is incredible. It's like having a senior BDR working 24/7.",
    author: "Alex Rivera",
    role: "Founder",
    company: "GrowthLabs",
  },
];

const outcomes = [
  "No more ghost meetings from cold outreach",
  "Budget & timeline qualified before the call",
  "CRM-ready notes from agent conversations",
  "Calendar synced automatically",
  "Respectful follow-ups that close loops",
];

export default function Results() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      <div className="flex-1 pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-results-heading">
              Real Results from AgentBox
            </h1>
            <p className="text-xl text-muted-foreground">
              What happens when your email thinks like you
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 hover-elevate transition-all duration-300 border-card-border"
                  data-testid={`card-metric-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-gradient-from to-gradient-via bg-clip-text text-transparent" data-testid={`text-metric-value-${index}`}>
                        {metric.value}
                      </div>
                      <div className="font-semibold mb-1" data-testid={`text-metric-label-${index}`}>
                        {metric.label}
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-metric-desc-${index}`}>
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Outcomes */}
          <Card className="p-8 mb-16 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <h2 className="text-2xl font-semibold mb-6" data-testid="text-outcomes-heading">
              What You Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground" data-testid={`text-outcome-${index}`}>
                    {outcome}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-center" data-testid="text-testimonials-heading">
              What Early Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index}
                  className="p-6 hover-elevate transition-all duration-300"
                  data-testid={`card-testimonial-${index}`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gradient-from fill-gradient-from" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic" data-testid={`text-testimonial-quote-${index}`}>
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-sm" data-testid={`text-testimonial-author-${index}`}>
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg"
              className="text-lg px-8 h-12 hover-elevate active-elevate-2"
              onClick={() => navigate("/setup")}
              data-testid="button-next-setup"
            >
              See How to Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
