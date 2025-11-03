import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { SiReplit } from "react-icons/si";

// Standard Tech (applies to both demos)
const standardTech = [
  {
    name: "React + TypeScript",
    demos: ["Scripted Demo", "Live Demo"],
    description: "Frontend framework with full type safety for UI components",
  },
  {
    name: "Tailwind CSS + shadcn/ui",
    demos: ["Scripted Demo", "Live Demo"],
    description: "Professional UI component library with dark mode and gradient system",
  },
  {
    name: "Wouter",
    demos: ["Scripted Demo", "Live Demo"],
    description: "Lightweight client-side routing for multi-page navigation",
  },
  {
    name: "Vite",
    demos: ["Scripted Demo", "Live Demo"],
    description: "Fast build tool and development server",
  },
  {
    name: "Lucide React",
    demos: ["Scripted Demo", "Live Demo"],
    description: "Icon system for UI elements and visual indicators",
  },
  {
    name: "Express.js",
    demos: ["Live Demo"],
    description: "Backend API server with webhook handling",
  },
  {
    name: "Drizzle ORM",
    demos: ["Live Demo"],
    description: "Type-safe database operations and schema management",
  },
  {
    name: "TanStack Query",
    demos: ["Live Demo"],
    description: "Efficient data fetching and caching with real-time polling",
  },
];

// All Sponsor Tech (combined)
const allSponsorTech = [
  {
    name: "Replit",
    role: "Hosting & Deployment",
    demos: ["Scripted Demo", "Live Demo"],
    status: "active",
    description: "Full-stack hosting with integrated database and instant deployments",
  },
  {
    name: "AgentMail",
    role: "Core Email Infrastructure",
    demos: ["Live Demo"],
    status: "active",
    description: "Provides @agentmail.to addresses, webhooks, and email routing",
  },
  {
    name: "Mastra",
    role: "AI Agent Framework",
    demos: ["Live Demo"],
    status: "active",
    description: "Framework for building AI agents with tool integration",
  },
  {
    name: "OpenAI",
    role: "Agent Intelligence",
    demos: ["Live Demo"],
    status: "active",
    description: "Powers buyer and seller AI agents with GPT-4",
  },
  {
    name: "Perplexity",
    role: "Research & Context",
    demos: ["Live Demo"],
    status: "active",
    description: "Real-time company research and market context enrichment",
  },
  {
    name: "Convex",
    role: "Real-time Database",
    demos: [],
    status: "not-used",
    description: "WebSocket-based real-time updates (not currently used)",
  },
  {
    name: "LiveKit",
    role: "Real-time Communication",
    demos: [],
    status: "not-used",
    description: "Not used in demo",
  },
  {
    name: "Browser-Use",
    role: "Browser Automation",
    demos: [],
    status: "not-used",
    description: "Not used in demo",
  },
  {
    name: "Hyperspell",
    role: "Spell Check",
    demos: [],
    status: "not-used",
    description: "Not used in demo",
  },
  {
    name: "Composio",
    role: "Tool Integration",
    demos: [],
    status: "not-used",
    description: "Not used in demo",
  },
  {
    name: "Moss",
    role: "Infrastructure",
    demos: [],
    status: "not-used",
    description: "Not used in demo",
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
    <section className="py-8 px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-1" data-testid="text-tech-stack-heading">
            Tech Stack
          </h2>
          <p className="text-muted-foreground text-sm">
            Built for AgentMail's HackHalloween @YC
          </p>
        </div>

        {/* Section 1: Standard Tech */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-standard-tech-heading">
              Active Standard Tech
            </h3>
          </div>

          <Card className="p-3">
            <div className="grid grid-cols-1 md:grid-rows-4 md:grid-flow-col gap-2">
              {standardTech.map((tech, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="font-semibold text-sm" data-testid={`text-standard-tech-${index}`}>
                        {tech.name}
                      </p>
                      {tech.demos.map((demo, demoIndex) => (
                        <Badge 
                          key={demoIndex} 
                          variant="default" 
                          className={`text-[10px] px-1.5 py-0 ${
                            demo === "Scripted Demo" 
                              ? "bg-orange-500/20 text-orange-300 border-orange-500/30" 
                              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {demo}
                        </Badge>
                      ))}
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-sponsor-tech-heading">
              Sponsor Tech
            </h3>
          </div>

          <Card className="p-3">
            {/* DEBUG: Grid container with red border */}
            <div className="grid grid-cols-1 md:grid-rows-6 md:grid-flow-col gap-x-4 gap-y-2 border-4 border-red-500">
              {allSponsorTech.map((tech, index) => (
                <div key={index} className="flex items-start gap-2 border-2 border-blue-500 bg-blue-500/5 relative">
                  {/* DEBUG: Item index number */}
                  <span className="absolute -top-2 -left-2 bg-yellow-400 text-black text-xs px-1 rounded font-bold z-10">
                    {index}
                  </span>
                  <CheckCircle2 
                    className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                      tech.status === "not-used" ? "text-foreground" : "text-purple-300"
                    }`} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="font-semibold text-sm" data-testid={`text-sponsor-${index}`}>
                        {tech.name}
                      </p>
                      {tech.demos.map((demo, demoIndex) => (
                        <Badge 
                          key={demoIndex} 
                          variant="default" 
                          className={`text-[10px] px-1.5 py-0 ${
                            demo === "Scripted Demo" 
                              ? "bg-orange-500/20 text-orange-300 border-orange-500/30" 
                              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {demo}
                        </Badge>
                      ))}
                      {tech.status === "not-used" && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          not-used
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-primary/80 mb-0.5">{tech.role}</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section 3: To Make Fully Functional */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-fully-functional-heading">
              To Make Fully Functional
            </h3>
          </div>

          <Card className="p-3 border-primary/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Tech Already in Place */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">
                  Features and Tech Already in Place
                </h4>
                <div className="space-y-1.5">
                  {techAlreadyInPlace.map((feature, index) => (
                    <div key={index} className="flex items-start gap-1.5 p-1.5 rounded-lg bg-card/50 border border-card-border">
                      <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-xs mb-0" data-testid={`text-in-place-${index}`}>
                          {feature.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight mb-1">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-0.5">
                          {feature.tech.map((techName, techIndex) => {
                            const isSponsor = sponsorTech.includes(techName);
                            return (
                              <Badge 
                                key={techIndex} 
                                variant="secondary" 
                                className={`text-[9px] px-1 py-0 ${isSponsor ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : ''}`}
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
                <h4 className="font-semibold text-sm mb-2 text-foreground">
                  Features and Tech to Implement
                </h4>
                <div className="space-y-1.5">
                  {techToBeImplemented.map((feature, index) => {
                    const hasSponsorTech = feature.tech.some(techName => sponsorTech.includes(techName));
                    return (
                      <div key={index} className="flex items-start gap-1.5 p-1.5 rounded-lg bg-card/50 border border-card-border">
                        <CheckCircle2 className={`h-3 w-3 flex-shrink-0 mt-0.5 ${hasSponsorTech ? 'text-purple-300' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-xs mb-0" data-testid={`text-to-implement-${index}`}>
                            {feature.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-tight mb-1">
                            {feature.description}
                          </p>
                          <div className="flex flex-wrap gap-0.5">
                            {feature.tech.map((techName, techIndex) => {
                              const isSponsor = sponsorTech.includes(techName);
                              return (
                                <Badge 
                                  key={techIndex} 
                                  variant="outline" 
                                  className={`text-[9px] px-1 py-0 ${isSponsor ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : ''}`}
                                >
                                  {techName}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Powered by footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border">
            <span className="text-[10px] text-muted-foreground">Deployed on</span>
            <SiReplit className="h-3 w-3 text-primary" />
            <span className="font-semibold text-xs">Replit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
