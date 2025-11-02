import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { SiReplit } from "react-icons/si";

// Standard Tech (applies to both demos)
const standardTech = [
  {
    name: "React + TypeScript",
    status: "active",
    description: "Frontend framework with full type safety for UI components",
  },
  {
    name: "Tailwind CSS + shadcn/ui",
    status: "active",
    description: "Professional UI component library with dark mode and gradient system",
  },
  {
    name: "Wouter",
    status: "active",
    description: "Lightweight client-side routing for multi-page navigation",
  },
  {
    name: "Vite",
    status: "active",
    description: "Fast build tool and development server",
  },
  {
    name: "Lucide React",
    status: "active",
    description: "Icon system for UI elements and visual indicators",
  },
  {
    name: "Express.js",
    status: "active",
    description: "Backend API server with webhook handling (Live Demo only)",
  },
  {
    name: "Drizzle ORM",
    status: "active",
    description: "Type-safe database operations and schema management (Live Demo only)",
  },
  {
    name: "TanStack Query",
    status: "active",
    description: "Efficient data fetching and caching with real-time polling (Live Demo only)",
  },
];

// Sponsor Tech - Scripted Demo
const scriptedSponsorTech = [
  {
    name: "Replit",
    role: "Hosting Platform",
    status: "active",
    description: "Hosting the static demo experience with instant deployments",
  },
  {
    name: "AgentMail",
    role: "Email Infrastructure",
    status: "not-used",
    description: "Not used in scripted demo (static conversation only)",
  },
  {
    name: "LiveKit",
    role: "Real-time Communication",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "Browser-Use",
    role: "Browser Automation",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "Hyperspell",
    role: "Spell Check",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "OpenAI",
    role: "AI Models",
    status: "not-used",
    description: "Not used in scripted demo (no AI agents)",
  },
  {
    name: "Anthropic",
    role: "AI Models",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "Composio",
    role: "Tool Integration",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "Moss",
    role: "Infrastructure",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "Perplexity",
    role: "Research API",
    status: "not-used",
    description: "Not used in scripted demo",
  },
  {
    name: "Convex",
    role: "Real-time Database",
    status: "not-used",
    description: "Not used in scripted demo",
  },
];

// Sponsor Tech - Live Demo
const liveSponsorTech = [
  {
    name: "AgentMail",
    role: "Core Email Infrastructure",
    status: "active",
    description: "Provides @agentmail.to email addresses, webhook delivery, and real-time email routing for agent conversations.",
  },
  {
    name: "Replit",
    role: "Hosting & Deployment",
    status: "active",
    description: "Full-stack hosting with integrated database, webhooks, and seamless deployment for rapid prototyping.",
  },
  {
    name: "OpenAI",
    role: "Agent Intelligence",
    status: "active",
    description: "Powers buyer and seller AI agents with GPT-4 for natural language generation and intelligent email responses (via Mastra framework).",
  },
  {
    name: "Perplexity",
    role: "Research & Context",
    status: "not-used",
    description: "Enriches agent knowledge with real-time company research and market context for better qualification (available but not used in current demo).",
  },
  {
    name: "Convex",
    role: "Real-time Database",
    status: "not-used",
    description: "Could replace polling with WebSocket-based real-time updates (planned but using PostgreSQL + polling currently)",
  },
  {
    name: "LiveKit",
    role: "Real-time Communication",
    status: "not-used",
    description: "Not used in live demo",
  },
  {
    name: "Browser-Use",
    role: "Browser Automation",
    status: "not-used",
    description: "Not used in live demo",
  },
  {
    name: "Hyperspell",
    role: "Spell Check",
    status: "not-used",
    description: "Not used in live demo",
  },
  {
    name: "Anthropic",
    role: "AI Models",
    status: "not-used",
    description: "Not used in live demo (using OpenAI instead)",
  },
  {
    name: "Composio",
    role: "Tool Integration",
    status: "not-used",
    description: "Not used in live demo",
  },
  {
    name: "Moss",
    role: "Infrastructure",
    status: "not-used",
    description: "Not used in live demo",
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

        {/* Section 1: Standard Tech */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-standard-tech-heading">
              Standard Tech
            </h3>
          </div>

          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {standardTech.map((tech, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold" data-testid={`text-standard-tech-${index}`}>
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

        {/* Section 2: Sponsor Tech */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-sponsor-tech-heading">
              Sponsor Tech
            </h3>
          </div>

          {/* Scripted Demo Sponsors */}
          <Card className="p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">Scripted Demo (/demo)</h4>
            <div className="space-y-4">
              {/* Active sponsors first */}
              {scriptedSponsorTech
                .filter(tech => tech.status === "active")
                .map((tech, index) => (
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
              {/* Not-used sponsors */}
              {scriptedSponsorTech
                .filter(tech => tech.status === "not-used")
                .map((tech, index) => (
                  <div key={index} className="border-l-2 border-muted/50 pl-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-semibold text-muted-foreground" data-testid={`text-scripted-sponsor-inactive-${index}`}>
                        {tech.name}
                      </h5>
                      <Badge variant="secondary" className="text-xs">
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground/80 mb-1">{tech.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                ))}
            </div>
          </Card>

          {/* Live Demo Sponsors */}
          <Card className="p-6">
            <h4 className="font-semibold text-lg mb-4">Live Demo (/live)</h4>
            <div className="space-y-4">
              {/* Active sponsors first */}
              {liveSponsorTech
                .filter(tech => tech.status === "active")
                .map((tech, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-semibold" data-testid={`text-live-sponsor-${index}`}>
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
              {/* Not-used sponsors */}
              {liveSponsorTech
                .filter(tech => tech.status === "not-used")
                .map((tech, index) => (
                  <div key={index} className="border-l-2 border-muted/50 pl-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-semibold text-muted-foreground" data-testid={`text-live-sponsor-inactive-${index}`}>
                        {tech.name}
                      </h5>
                      <Badge variant="secondary" className="text-xs">
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground/80 mb-1">{tech.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Section 3: To Make Fully Functional */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-2xl font-semibold" data-testid="text-fully-functional-heading">
              To Make Fully Functional
            </h3>
          </div>

          <Card className="p-8 border-primary/20">
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
        </div>

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
