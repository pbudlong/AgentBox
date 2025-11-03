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
    name: "Mastra",
    role: "AI Agent Framework",
    status: "active",
    description: "Framework for building AI agents with tool integration (wraps OpenAI for buyer and seller agents)",
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
    status: "active",
    description: "Integrated as agent tool for real-time company research and market context enrichment (available to agents but not triggered in current 5-email demo).",
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

// Sponsor technologies for color-coding
const sponsorTech = [
  "AgentMail", "Replit", "LiveKit", "Browser-Use", "Hyperspell", 
  "OpenAI", "Mastra", "Composio", "Moss", "Perplexity", "Convex"
];

// To Make Fully Functional
const techAlreadyInPlace = [
  {
    name: "Webhook Infrastructure",
    description: "Real-time email webhooks with duplicate detection and status tracking",
    tech: ["AgentMail", "Replit"],
  },
  {
    name: "AI Agent Framework",
    description: "GPT-4 powered buyer and seller agents with tool integration",
    tech: ["Mastra", "OpenAI", "Perplexity"],
  },
  {
    name: "Database-Backed Sessions",
    description: "Demo sessions persisted across deployments",
    tech: ["PostgreSQL", "Drizzle", "Replit"],
  },
  {
    name: "Real-time Updates",
    description: "Polling-based message and webhook status updates",
    tech: ["TanStack Query"],
  },
];

const techToBeImplemented = [
  {
    name: "AgentMail Inbox Creation",
    description: "Build UI for users to claim their own @agentbox.ai email addresses",
    tech: ["AgentMail", "React"],
  },
  {
    name: "Mastra Fit Scoring",
    description: "Implement multi-signal evaluation algorithm with weighted scoring",
    tech: ["Mastra", "OpenAI"],
  },
  {
    name: "Perplexity Active Usage",
    description: "Trigger company research tool in agent workflows for enrichment",
    tech: ["Perplexity", "Mastra"],
  },
  {
    name: "Composio Calendar Integration",
    description: "Generate .ics files and Google Calendar event links from meeting proposals",
    tech: ["Composio"],
  },
  {
    name: "Convex Real-time Sync",
    description: "Replace polling with WebSocket-based real-time updates",
    tech: ["Convex"],
  },
  {
    name: "Replit Production Scaling",
    description: "Multi-user support, custom domain verification, and optimization",
    tech: ["Replit"],
  },
  {
    name: "Profile Management",
    description: "Create forms for buyers/sellers to configure qualification preferences",
    tech: ["React", "Zod"],
  },
];

export default function TechStack() {
  return (
    <section className="py-12 px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2" data-testid="text-tech-stack-heading">
            Tech Stack
          </h2>
          <p className="text-muted-foreground text-base">
            Built for AgentMail's HackHalloween @YC
          </p>
        </div>

        {/* Section 1: Standard Tech */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-standard-tech-heading">
              Standard Tech
            </h3>
          </div>

          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-rows-4 md:grid-flow-col gap-3">
              {standardTech.map((tech, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm" data-testid={`text-standard-tech-${index}`}>
                        {tech.name}
                      </p>
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section 2: Sponsor Tech */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-sponsor-tech-heading">
              Sponsor Tech
            </h3>
          </div>

          {/* Scripted Demo Sponsors */}
          <Card className="p-4 mb-4">
            <h4 className="font-semibold text-base mb-3">Scripted Demo (/demo)</h4>
            <div className="space-y-3">
              {scriptedSponsorTech.map((tech, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-3">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h5 className="font-semibold text-sm" data-testid={`text-scripted-sponsor-${index}`}>
                      {tech.name}
                    </h5>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      {tech.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-primary/80 mb-0.5">{tech.role}</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Demo Sponsors */}
          <Card className="p-4">
            <h4 className="font-semibold text-base mb-3">Live Demo (/live)</h4>
            <div className="space-y-3">
              {/* Active sponsors first */}
              {liveSponsorTech
                .filter(tech => tech.status === "active")
                .map((tech, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-3">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h5 className="font-semibold text-sm" data-testid={`text-live-sponsor-${index}`}>
                        {tech.name}
                      </h5>
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-primary/80 mb-0.5">{tech.role}</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {tech.description}
                    </p>
                  </div>
                ))}
              {/* Not-used sponsors */}
              {liveSponsorTech
                .filter(tech => tech.status === "not-used")
                .map((tech, index) => (
                  <div key={index} className="border-l-2 border-muted/50 pl-3">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h5 className="font-semibold text-sm text-muted-foreground" data-testid={`text-live-sponsor-inactive-${index}`}>
                        {tech.name}
                      </h5>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {tech.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mb-0.5">{tech.role}</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {tech.description}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Section 3: To Make Fully Functional */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-fully-functional-heading">
              To Make Fully Functional
            </h3>
          </div>

          <Card className="p-4 border-primary/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tech Already in Place */}
              <div>
                <h4 className="font-semibold text-base mb-3 text-primary">
                  Features and Tech Already in Place
                </h4>
                <div className="space-y-2">
                  {techAlreadyInPlace.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-card/50 border border-card-border">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-0.5" data-testid={`text-in-place-${index}`}>
                          {feature.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug mb-1.5">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {feature.tech.map((techName, techIndex) => {
                            const isSponsor = sponsorTech.includes(techName);
                            return (
                              <Badge 
                                key={techIndex} 
                                variant="secondary" 
                                className={`text-[10px] px-1.5 py-0 ${isSponsor ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : ''}`}
                              >
                                {techName}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech to be Implemented */}
              <div>
                <h4 className="font-semibold text-base mb-3 text-gradient-to">
                  Features and Tech to be Implemented
                </h4>
                <div className="space-y-2">
                  {techToBeImplemented.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover-elevate bg-card/50 border border-card-border">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-0.5" data-testid={`text-to-implement-${index}`}>
                          {feature.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug mb-1.5">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {feature.tech.map((techName, techIndex) => {
                            const isSponsor = sponsorTech.includes(techName);
                            return (
                              <Badge 
                                key={techIndex} 
                                variant="outline" 
                                className={`text-[10px] px-1.5 py-0 ${isSponsor ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : ''}`}
                              >
                                {techName}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Powered by footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-card-border">
            <span className="text-xs text-muted-foreground">Deployed on</span>
            <SiReplit className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Replit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
