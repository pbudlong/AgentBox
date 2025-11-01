import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Linkedin, Send, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SellerJourney() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      <div className="flex-1 pt-16 px-8 pb-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-6">
            <Badge className="px-4 py-2 text-base bg-gradient-to-r from-primary/20 to-gradient-via/20">For Sellers</Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to bg-clip-text text-transparent">
              The Seller Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mike discovers Sarah on LinkedIn and notices something new...
            </p>
          </div>

          {/* Step 1: LinkedIn Discovery */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-gradient-via/10 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-[#0077b5]" />
                Step 1: LinkedIn Discovery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Mockup LinkedIn Profile */}
              <div className="bg-card border border-card-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-gradient-via/30 flex items-center justify-center text-2xl font-bold text-foreground">
                    SC
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">VP of Engineering at TechCorp</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-md hover-elevate cursor-pointer">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        📧 Contact my AgentBox AI twin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Mike thinks: "Perfect! I can reach out without being intrusive. Let me email her AgentBox..."
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Email to AgentBox */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-gradient-via/10 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <Send className="h-5 w-5 text-primary" />
                Step 2: Mike Emails Sarah's AgentBox
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 border border-border font-mono text-sm space-y-2">
                <div className="text-muted-foreground">To: <span className="text-primary">sarah.techcorp@agentbox.ai</span></div>
                <div className="text-muted-foreground">From: <span className="text-foreground">mike@salestech.com</span></div>
                <div className="text-muted-foreground">Subject: <span className="text-foreground">DevOps automation for TechCorp</span></div>
                <div className="mt-4 text-foreground leading-relaxed">
                  Hi Sarah,<br/><br/>
                  I noticed TechCorp recently raised Series B. Congrats!<br/><br/>
                  We help engineering teams like yours reduce deployment time by 80% with our AI-powered DevOps platform. Worth a conversation?
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Auto-Reply from AgentBox */}
          <Card className="border-2 border-gradient-via/40">
            <CardHeader className="bg-gradient-to-r from-gradient-via/10 to-primary/10 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gradient-via" />
                Step 3: AgentBox Auto-Reply
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-gradient-via/5 to-primary/5 rounded-lg p-4 border border-gradient-via/30 font-mono text-sm space-y-2">
                <div className="text-muted-foreground">To: <span className="text-foreground">mike@salestech.com</span></div>
                <div className="text-muted-foreground">From: <span className="text-primary">sarah.techcorp@agentbox.ai</span></div>
                <div className="text-muted-foreground">Subject: <span className="text-foreground">Re: DevOps automation for TechCorp</span></div>
                <div className="mt-4 text-foreground leading-relaxed">
                  Hi Mike,<br/><br/>
                  Thanks for reaching out! This is Sarah's AgentBox AI assistant.<br/><br/>
                  To ensure our conversation is high-value for both of us, I'd like to learn more about your offering.<br/><br/>
                  <span className="text-gradient-via font-semibold">Would you like to get your own AgentBox?</span> Your AI twin can have a candid conversation with mine to see if there's a fit - no obligation, complete privacy.<br/><br/>
                  👉 Get started: <span className="text-primary underline">agentbox.ai/sellers</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Seller Signup */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-gradient-via/10 border-b">
              <CardTitle className="text-xl flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                Step 4: Mike Gets His AgentBox
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-muted/30 rounded-lg p-6 space-y-4 border border-border">
                <h3 className="text-xl font-bold text-foreground">Create Your Seller AgentBox</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
                    <div className="h-10 bg-background border border-border rounded-md px-3 flex items-center text-foreground">
                      Mike Rodriguez
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Company</label>
                    <div className="h-10 bg-background border border-border rounded-md px-3 flex items-center text-foreground">
                      SalesTech
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Your AgentBox Email</label>
                    <div className="h-10 bg-primary/10 border border-primary/30 rounded-md px-3 flex items-center font-mono text-sm text-primary">
                      mike.salestech@agentbox.ai
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Create My AgentBox
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic text-center">
                Now both Mike and Sarah have AI twins that can qualify the fit...
              </p>
            </CardContent>
          </Card>

          {/* Next Step */}
          <div className="text-center">
            <Button 
              size="lg"
              className="text-lg px-8 h-12 hover-elevate active-elevate-2"
              onClick={() => navigate("/demo")}
              data-testid="button-watch-conversation"
            >
              Watch Their AI Twins Converse
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
