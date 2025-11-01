import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import linkedinMockup from "@assets/generated_images/LinkedIn_profile_mockup_card_86bf7971.png";

export default function LinkedInMockup() {
  const [copied, setCopied] = useState(false);
  const agentEmail = "aria.h.buyer@agentbox.ai";

  const handleCopy = () => {
    navigator.clipboard.writeText(agentEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center" data-testid="text-discovery-heading">
          Discovery Made Simple
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Prospects find your AgentBox email on LinkedIn. Click to start the conversation.
        </p>

        <div className="relative">
          <Card className="overflow-hidden max-w-md mx-auto hover-elevate transition-all duration-300 border-card-border shadow-xl">
            {/* LinkedIn mockup image */}
            <div className="relative">
              <img 
                src={linkedinMockup} 
                alt="LinkedIn Profile" 
                className="w-full"
              />
              
              {/* Glowing highlight overlay on contact section */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
            </div>

            {/* Contact info overlay */}
            <div className="p-6 bg-card border-t border-card-border">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">AgentBox Email</p>
                  <p className="font-mono text-sm md:text-base text-primary font-semibold" data-testid="text-agentbox-email">
                    {agentEmail}
                  </p>
                </div>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="flex-shrink-0 hover-elevate active-elevate-2"
                  data-testid="button-copy-email"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Pulse animation around card */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl animate-pulse" 
              style={{ animationDuration: '3s' }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
