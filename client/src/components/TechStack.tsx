import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code2, Sparkles, Wrench } from "lucide-react";
import { SiReplit, SiOpenai } from "react-icons/si";

const sponsors = [
  {
    name: "AgentMail",
    role: "Core Email Infrastructure",
    description: "Provides @agentbox.ai email addresses, SMTP/IMAP handling, and thread management for agent-to-agent conversations.",
    status: "integrated",
  },
  {
    name: "Convex.dev",
    role: "Real-time Backend",
    description: "Handles state management, thread synchronization, scoring calculations, and real-time updates between agents.",
    status: "integrated",
  },
  {
    name: "Mastra / OpenAI",
    role: "Agent Intelligence",
    description: "Powers the conversational agents with LLM capabilities for qualification, clarification, and meeting coordination.",
    status: "integrated",
  },
  {
    name: "Perplexity",
    role: "Research & Context",
    description: "Enriches agent knowledge with real-time company research, market context, and industry insights for better qualification.",
    status: "integrated",
  },
  {
    name: "Replit",
    role: "Hosting & Deployment",
    description: "Full-stack hosting platform with integrated AI tools, automatic scaling, and seamless deployment for rapid prototyping.",
    status: "integrated",
  },
];

const implemented = [
  {
    name: "React + TypeScript",
    description: "Frontend framework with full type safety",
  },
  {
    name: "Tailwind CSS + shadcn/ui",
    description: "Professional UI components with dark mode support",
  },
  {
    name: "Express + AgentMail Webhooks",
    description: "Backend API with inbound email processing endpoints",
  },
  {
    name: "Mastra AI Agent Framework",
    description: "Buyer and seller agents with tool-calling capabilities",
  },
  {
    name: "Perplexity Research Tool",
    description: "Company enrichment for enhanced qualification",
  },
  {
    name: "8-Signal Fit Scoring Engine",
    description: "Weighted scoring algorithm for match quality",
  },
];

const simulated = [
  {
    feature: "Email Conversations",
    note: "Demo uses mock data - real agents respond to webhooks via AgentMail API",
  },
  {
    feature: "Real-time UI Updates",
    note: "Convex provides live data sync (requires manual npx convex dev setup)",
  },
  {
    feature: "Calendar Integration",
    note: "UI ready for .ics generation and Google Calendar deep links",
  },
  {
    feature: "Profile Onboarding",
    note: "Profile creation flow with Perplexity enrichment ready to build",
  },
];

const remaining = [
  {
    task: "Convex Real-time Sync",
    description: "Run npx convex dev locally to enable live thread updates and persistent storage",
  },
  {
    task: "AgentMail Inbox Creation",
    description: "Build UI for users to claim their @agentbox.ai email addresses",
  },
  {
    task: "Profile Management",
    description: "Create forms for buyers/sellers to configure qualification preferences",
  },
  {
    task: "Calendar File Generation",
    description: "Generate .ics files and Google Calendar event links from meeting proposals",
  },
  {
    task: "Production Deployment",
    description: "Configure webhooks, domain verification, and scale testing",
  },
];

export default function TechStack() {
  return (
    <section className="py-20 px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-tech-stack-heading">
            Tech Stack
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for AgentMail's HackHalloween @YC
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sponsors - What Powers This */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold" data-testid="text-sponsors-heading">
                Sponsor Technologies
              </h3>
            </div>
            <div className="space-y-6">
              {sponsors.map((sponsor, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg" data-testid={`text-sponsor-name-${index}`}>
                      {sponsor.name}
                    </h4>
                    <Badge 
                      variant={sponsor.status === "integrated" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {sponsor.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-primary/80 mb-2">{sponsor.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-sponsor-desc-${index}`}>
                    {sponsor.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Implemented Tech */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-from to-gradient-via/50">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold" data-testid="text-implemented-heading">
                Implemented
              </h3>
            </div>
            <div className="space-y-4">
              {implemented.map((tech, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold" data-testid={`text-implemented-name-${index}`}>
                      {tech.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-implemented-desc-${index}`}>
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Simulated Features */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-gradient-to/5 to-transparent border-gradient-to/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to/10">
              <Sparkles className="h-6 w-6 text-gradient-to" />
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-simulated-heading">
              Currently Simulated (Demo Only)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulated.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                <div className="w-2 h-2 rounded-full bg-gradient-to flex-shrink-0 mt-2" />
                <div>
                  <p className="font-semibold mb-1" data-testid={`text-simulated-feature-${index}`}>
                    {item.feature}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-simulated-note-${index}`}>
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Remaining Work */}
        <Card className="p-8 border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-remaining-heading">
              To Make It Fully Functional
            </h3>
          </div>
          <div className="space-y-4">
            {remaining.map((task, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover-elevate bg-card/50 border border-card-border">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" data-testid={`text-remaining-task-${index}`}>
                    {task.task}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-remaining-desc-${index}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Powered by footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-card border border-card-border">
            <span className="text-sm text-muted-foreground">Deployed on</span>
            <SiReplit className="h-5 w-5 text-primary" />
            <span className="font-semibold">Replit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
