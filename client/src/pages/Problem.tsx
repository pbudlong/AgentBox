import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Inbox, Send } from "lucide-react";
import { useLocation } from "wouter";

export default function Problem() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      <div className="flex-1 flex items-center justify-center pt-16 px-8">
        <div className="max-w-6xl w-full">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-10 bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
            The Sales Inbox Problem
          </h1>

          {/* Two-column pain points */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Buyer Pain */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <Inbox className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">For Buyers</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 rounded-lg bg-card border border-card-border">
                  <p className="text-lg text-foreground leading-relaxed">
                    Aren't you <span className="text-destructive font-semibold">tired of salespeople bombarding your inbox</span> with lazy, templated emails that show zero understanding of your actual needs?
                  </p>
                </div>

                <div className="p-5 rounded-lg bg-card border border-card-border">
                  <p className="text-lg text-foreground leading-relaxed">
                    Every day: dozens of pitches. Every week: hundreds of interruptions. Every month: thousands of wasted minutes.
                  </p>
                </div>

                <div className="p-5 rounded-lg bg-card border border-card-border">
                  <p className="text-lg text-foreground leading-relaxed">
                    You want to be open to opportunities, but <span className="text-destructive font-semibold">the signal-to-noise ratio is broken</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Pain */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <Send className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">For Sellers</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 rounded-lg bg-card border border-card-border">
                  <p className="text-lg text-foreground leading-relaxed">
                    Aren't you <span className="text-destructive font-semibold">tired of sending thousands of emails</span> without a single one being opened or read?
                  </p>
                </div>

                <div className="p-5 rounded-lg bg-card border border-card-border">
                  <p className="text-lg text-foreground leading-relaxed">
                    Hours crafting personalized messages. Days waiting for responses. Weeks of effort yielding nothing but silence.
                  </p>
                </div>

                <div className="p-5 rounded-lg bg-card border border-card-border">
                  <p className="text-lg text-foreground leading-relaxed">
                    You have a great solution, but <span className="text-destructive font-semibold">you can't even get a conversation started</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution tease */}
          <div className="text-center space-y-6">
            <p className="text-2xl text-muted-foreground">
              What if there was a better way?
            </p>
            
            <Button 
              size="lg"
              className="text-lg px-8 h-12 hover-elevate active-elevate-2"
              onClick={() => navigate("/buyer")}
              data-testid="button-see-solution"
            >
              See the Solution
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
