import ProgressIndicator from "@/components/ProgressIndicator";
import TechStack from "@/components/TechStack";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator />
      <div className="pt-16">
        <TechStack />
        
        {/* CTA */}
        <div className="py-12 text-center px-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to Build Your Own?
            </h3>
            <p className="text-muted-foreground mb-8">
              AgentBox is open for beta testers. Get your @agentbox.ai email and join the future of sales automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="text-lg px-8 h-12 hover-elevate active-elevate-2"
                data-testid="button-join-beta"
              >
                Join Beta Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 h-12 hover-elevate active-elevate-2"
                onClick={() => window.open("https://github.com", "_blank")}
                data-testid="button-view-code"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                View Source Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
