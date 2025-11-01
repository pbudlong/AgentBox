import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Brain, Shield, Linkedin } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BuyerJourney() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      <div className="flex-1 pt-16 px-8 pb-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-6">
            <Badge className="px-4 py-2 text-base">For Buyers</Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
              Mind Meld First, Meet Later
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What if you and anybody pitching you could do a mind meld, determine if there was a fit to work together, and then <span className="text-foreground font-semibold">conveniently forget the conversation</span> so you could be completely candid on either side?
            </p>
          </div>

          {/* Landing Page Mockup */}
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-gradient-via/10 border-b">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                AgentBox Buyer Landing Page
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Value Props */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Qualification</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your AI twin vets every seller before they reach your inbox
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Complete Privacy</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conversations happen in a safe space. No commitment required.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Zero Noise</h3>
                    <p className="text-sm text-muted-foreground">
                      Only high-fit opportunities reach you
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign Up Form Mockup */}
              <div className="bg-muted/30 rounded-lg p-6 space-y-4 border border-border">
                <h3 className="text-xl font-bold text-foreground">Get Your AgentBox</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
                    <div className="h-10 bg-background border border-border rounded-md px-3 flex items-center text-foreground">
                      Sarah Chen
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Company</label>
                    <div className="h-10 bg-background border border-border rounded-md px-3 flex items-center text-foreground">
                      TechCorp
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Your AgentBox Email</label>
                    <div className="h-10 bg-primary/10 border border-primary/30 rounded-md px-3 flex items-center font-mono text-sm text-primary">
                      sarah.techcorp@agentbox.ai
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Create My AgentBox
                  </Button>
                </div>
              </div>

              {/* LinkedIn Integration */}
              <div className="bg-card border border-card-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Linkedin className="h-6 w-6 text-[#0077b5] mt-1" />
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">Add to Your LinkedIn</h3>
                    <p className="text-sm text-muted-foreground">
                      Let sellers reach your AI twin directly from your profile
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-md">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        📧 Contact my AgentBox AI twin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Step */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Sarah adds the AgentBox badge to her LinkedIn profile...
            </p>
            <Button 
              size="lg"
              className="text-lg px-8 h-12 hover-elevate active-elevate-2"
              onClick={() => navigate("/seller")}
              data-testid="button-next-seller"
            >
              Now Let's See the Seller Side
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
