import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import ProgressIndicator from "@/components/ProgressIndicator";
import heroBackground from "@assets/generated_images/Hero_background_gradient_mesh_2892ba4a.png";

export default function Cover() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressIndicator />
      
      <div className="flex-1 relative flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackground} 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-gradient-via/20 border border-primary/30 backdrop-blur-sm">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            </div>
          </div>

          {/* Brand name */}
          <h1 
            className="text-7xl md:text-8xl font-bold mb-3 bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}
            data-testid="text-brand-name"
          >
            AgentBox
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light" data-testid="text-tagline">
            Email That Thinks Like You
          </p>

          <div className="flex flex-col items-center gap-8">
            {/* Hackathon badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-card-border">
              <span className="text-sm text-muted-foreground">Built for</span>
              <span className="font-semibold bg-gradient-to-r from-gradient-from to-gradient-via bg-clip-text text-transparent" data-testid="text-hackathon">
                AgentMail's HackHalloween @YC
              </span>
              <span className="text-sm text-muted-foreground">exclusively with Replit</span>
            </div>

            {/* CTA */}
            <Button 
              size="lg"
              className="text-xl px-12 h-14 shadow-lg shadow-primary/20 hover-elevate active-elevate-2"
              onClick={() => navigate("/problem")}
              data-testid="button-start-demo"
            >
              Start Project
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
