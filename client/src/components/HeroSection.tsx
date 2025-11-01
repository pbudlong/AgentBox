import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";
import heroBackground from "@assets/generated_images/Hero_background_gradient_mesh_2892ba4a.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
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
      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent"
          style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}
          data-testid="text-hero-headline"
        >
          Stop wasting meetings.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subhead">
          AgentBox lets your email act like you—qualify fit, ask clarifying questions, and book meetings only when there's a match.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/demo">
            <Button 
              size="lg" 
              className="text-lg px-8 h-12 shadow-lg shadow-primary/20 hover-elevate active-elevate-2"
              data-testid="button-get-agentbox-email"
            >
              Get your AgentBox email
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/demo">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 h-12 backdrop-blur-sm bg-background/30 hover-elevate active-elevate-2"
              data-testid="button-see-demo"
            >
              <Play className="mr-2 h-5 w-5" />
              See a live two-agent demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
