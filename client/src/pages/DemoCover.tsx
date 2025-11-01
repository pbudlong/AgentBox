import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/generated_images/AgentBox_logo_design_326c4f61.png";
import heroBackground from "@assets/generated_images/Hero_background_gradient_mesh_2892ba4a.png";

export default function DemoCover() {
  const [, setLocation] = useLocation();

  const handleNext = () => {
    setLocation("/demo/landing");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
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
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img 
              src={logoImage} 
              alt="AgentBox Logo" 
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
              data-testid="img-agentbox-logo"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-3xl -z-10" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent"
          style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}
          data-testid="text-agentbox-title"
        >
          AgentBox
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-muted-foreground mb-4" data-testid="text-tagline">
          Stop wasting meetings.
        </p>

        <p className="text-lg md:text-xl text-muted-foreground/80 mb-12" data-testid="text-subtitle">
          Let your email act like you.
        </p>

        {/* Hackathon badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 border border-primary/30 backdrop-blur-sm mb-12">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gradient-from to-gradient-via animate-pulse" />
          <span className="text-sm font-semibold text-muted-foreground" data-testid="text-hackathon">
            AgentMail's HackHalloween @YC
          </span>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleNext}
            className="text-lg px-10 h-14 shadow-lg shadow-primary/30 hover-elevate active-elevate-2"
            data-testid="button-start-demo"
          >
            Start Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Hint text */}
        <p className="text-sm text-muted-foreground/60 mt-8">
          Press Enter or click to begin
        </p>
      </div>
    </div>
  );
}
