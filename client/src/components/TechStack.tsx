import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Wrench, Play, Zap } from "lucide-react";
import { SiReplit } from "react-icons/si";

// Scripted Demo Tech
const scriptedSponsorTech = [
  {
    name: "Replit",
    role: "Hosting Platform",
    status: "active",
    description: "Hosting the static demo experience",
  },
];

const scriptedOtherTech = [
  {
    name: "React + TypeScript",
    status: "active",
    description: "Frontend framework with full type safety",
  },
  {
    name: "Tailwind CSS + shadcn/ui",
    status: "active",
    description: "Professional UI components with dark mode",
  },
  {
    name: "Wouter",
    status: "active",
    description: "Lightweight client-side routing",
  },
];

// Live Demo Tech
const liveSponsorTech = [
  {
    name: "AgentMail",
    role: "Core Email Infrastructure",
    status: "active",
    description: "Provides @agentmail.to email addresses, webhook delivery, and real-time email routing for agent conversations.",
  },
  {
    name: "Neon / PostgreSQL",
    role: "Production Database",
    status: "active",
    description: "Persists demo sessions, inbox IDs, and exchange counters to survive deployments and enable webhook state recovery.",
  },
  {
    name: "Mastra / OpenAI",
    role: "Agent Intelligence",
    status: "active",
    description: "Powers buyer and seller AI agents with GPT-4 for natural language generation and intelligent email responses.",
  },
  {
    name: "Perplexity",
    role: "Research & Context",
    status: "not-used",
    description: "Enriches agent knowledge with real-time company research and market context for better qualification (available but not used in current demo).",
  },
  {
    name: "Replit",
    role: "Hosting & Deployment",
    status: "active",
    description: "Full-stack hosting with integrated database, webhooks, and seamless deployment for rapid prototyping.",
  },
];

const liveOtherTech = [
  {
    name: "React + TypeScript",
    status: "active",
    description: "Frontend framework with full type safety",
  },
  {
    name: "Tailwind CSS + shadcn/ui",
    status: "active",
    description: "Professional UI components with dark mode",
  },
  {
    name: "Express.js",
    status: "active",
    description: "Backend API server with webhook handling",
  },
  {
    name: "Drizzle ORM",
    status: "active",
    description: "Type-safe database operations and schema management",
  },
  {
    name: "TanStack Query",
    status: "active",
    description: "Efficient data fetching and caching with real-time polling",
  },
  {
    name: "AgentMail Webhooks",
    status: "active",
    description: "Real-time email webhook delivery with duplicate detection",
  },
];

// To Make Fully Functional
const techAlreadyInPlace = [
  {
    name: "Database-Backed Sessions",
    description: "Demo sessions persisted across deployments with PostgreSQL",
  },
  {
    name: "Webhook Infrastructure",
    description: "AgentMail webhooks with duplicate detection and status tracking",
  },
  {
    name: "AI Agent Framework",
    description: "GPT-4 powered buyer and seller agents with Mastra",
  },
  {
    name: "Exchange Counter",
    description: "Infinite loop prevention limiting conversations to 5 emails",
  },
  {
    name: "Real-time Updates",
    description: "Polling-based message and webhook status updates",
  },
];

const techToBeImplemented = [
  {
    name: "User Inbox Creation",
    description: "Build UI for users to claim their own @agentbox.ai email addresses via AgentMail API",
  },
  {
    name: "Profile Management",
    description: "Create forms for buyers/sellers to configure qualification preferences (industry, company size, budget, timing, tech stack)",
  },
  {
    name: "Fit Score Calculation",
    description: "Implement multi-signal evaluation algorithm with weighted scoring and decision thresholds",
  },
  {
    name: "Calendar File Generation",
    description: "Generate .ics files and Google Calendar event links from meeting proposals",
  },
  {
    name: "Perplexity Integration",
    description: "Use Perplexity API for real-time company research to enrich agent context",
  },
  {
    name: "Convex Real-time Sync",
    description: "Replace polling with WebSocket-based real-time updates using Convex",
  },
  {
    name: "Production Scaling",
    description: "Multi-user support, custom domain verification, and performance optimization",
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

        {/* Section 1: Scripted Demo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-gradient-from to-gradient-via/50">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-scripted-demo-heading">
              Scripted Demo (/demo)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scripted: Sponsors */}
            <Card className="p-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Sponsors
              </h4>
              <div className="space-y-4">
                {scriptedSponsorTech.map((tech, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-semibold" data-testid={`text-scripted-sponsor-${index}`}>
                        {tech.name}
                      </h5>
                      <Badge variant="default" className="text-xs">
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-primary/80 mb-1">{tech.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scripted: Other Tech */}
            <Card className="p-6">
              <h4 className="font-semibold text-lg mb-4">Other Technologies</h4>
              <div className="space-y-3">
                {scriptedOtherTech.map((tech, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold" data-testid={`text-scripted-other-${index}`}>
                          {tech.name}
                        </p>
                        <Badge variant="default" className="text-xs">
                          {tech.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Section 2: Live Demo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-live-demo-heading">
              Live Demo (/live)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live: Sponsors */}
            <Card className="p-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Sponsors
              </h4>
              <div className="space-y-4">
                {liveSponsorTech.map((tech, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-semibold" data-testid={`text-live-sponsor-${index}`}>
                        {tech.name}
                      </h5>
                      <Badge 
                        variant={tech.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-primary/80 mb-1">{tech.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live: Other Tech */}
            <Card className="p-6">
              <h4 className="font-semibold text-lg mb-4">Other Technologies</h4>
              <div className="space-y-3">
                {liveOtherTech.map((tech, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold" data-testid={`text-live-other-${index}`}>
                          {tech.name}
                        </p>
                        <Badge variant="default" className="text-xs">
                          {tech.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Section 3: To Make Fully Functional */}
        <Card className="p-8 border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-fully-functional-heading">
              To Make Fully Functional
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tech Already in Place */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-primary">
                Tech Already in Place
              </h4>
              <div className="space-y-3">
                {techAlreadyInPlace.map((tech, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-card-border">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1" data-testid={`text-in-place-${index}`}>
                        {tech.name}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech to be Implemented */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gradient-to">
                Tech to be Implemented
              </h4>
              <div className="space-y-3">
                {techToBeImplemented.map((tech, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover-elevate bg-card/50 border border-card-border">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1" data-testid={`text-to-implement-${index}`}>
                        {tech.name}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
