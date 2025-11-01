import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles, Loader2, Building2, MapPin, DollarSign, Clock, Zap, Users, Code } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FitScoreIndicator from "@/components/FitScoreIndicator";

interface DataField {
  field: string;
  value: string;
  source: string;
  icon: any;
}

const sellerData: DataField[] = [
  { field: "Industry Focus", value: "B2B SaaS, FinTech", source: "Profile setup", icon: Building2 },
  { field: "Company Size", value: "50-500 employees", source: "Profile setup", icon: Users },
  { field: "Geography", value: "North America, UK", source: "Profile setup", icon: MapPin },
  { field: "Budget Range", value: "$10K-$50K ARR", source: "Profile setup", icon: DollarSign },
  { field: "Sales Cycle", value: "30-60 days", source: "Profile setup", icon: Clock },
  { field: "Tech Stack", value: "Salesforce, HubSpot", source: "CRM integration", icon: Code },
  { field: "Decision Maker", value: "VP Sales, Director", source: "Profile setup", icon: Zap },
];

const buyerData: DataField[] = [
  { field: "Industry", value: "FinTech", source: "LinkedIn profile", icon: Building2 },
  { field: "Company Size", value: "200 employees", source: "LinkedIn profile", icon: Users },
  { field: "Location", value: "San Francisco, CA", source: "LinkedIn profile", icon: MapPin },
  { field: "Budget", value: "$25K", source: "Email conversation", icon: DollarSign },
  { field: "Timeline", value: "Q1 2025", source: "Email conversation", icon: Clock },
  { field: "Current Stack", value: "Salesforce", source: "Website research", icon: Code },
  { field: "Role", value: "VP of Sales", source: "LinkedIn profile", icon: Zap },
];

function ProfilePane({ title, subtitle, data }: { 
  title: string; 
  subtitle: string; 
  data: DataField[];
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="bg-card border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {data.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-4 hover-elevate">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">{item.field}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {item.source}
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function LiveDemo() {
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [sellerEmail, setSellerEmail] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [, navigate] = useLocation();

  // Initialize demo mutation
  const initMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/demo/initialize", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to initialize demo");
      }
      return await response.json();
    },
    onSuccess: (data: any) => {
      setSellerEmail(data.seller);
      setBuyerEmail(data.buyer);
      setIsInitialized(true);
      queryClient.invalidateQueries({ queryKey: ["/api/demo/messages"] });
    },
  });

  // Poll for messages when initialized
  const { data: messagesData } = useQuery({
    queryKey: ["/api/demo/messages"],
    enabled: isInitialized,
    refetchInterval: 3000,
  });

  // Update messages from real API data
  useEffect(() => {
    if (messagesData && (messagesData as any).initialized) {
      const realMessages = ((messagesData as any).messages || []).map((m: any, idx: number) => ({
        id: m.message_id || `msg-${idx}`,
        from: m.from,
        to: m.to,
        subject: m.subject || "No Subject",
        body: m.text || m.html || "",
        timestamp: new Date(m.created_at),
      }));
      
      setLiveMessages(realMessages);
    }
  }, [messagesData]);

  const sellerMessages = liveMessages.filter(m => 
    m.from.includes(sellerEmail) || m.to.includes(sellerEmail)
  );
  
  const buyerMessages = liveMessages.filter(m => 
    m.from.includes(buyerEmail) || m.to.includes(buyerEmail)
  );

  // Auto-start on page load with delay
  useEffect(() => {
    if (!hasAutoStarted && !isInitialized) {
      const timeout = setTimeout(() => {
        initMutation.mutate();
        setHasAutoStarted(true);
      }, 500); // 500ms delay to let page load
      
      return () => clearTimeout(timeout);
    }
  }, [hasAutoStarted, isInitialized]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      {/* Controls */}
      <div className="pt-16 px-8 py-4 border-b border-border flex items-center justify-between">
        <div className="flex gap-3">
          <Button 
            onClick={() => initMutation.mutate()}
            disabled={initMutation.isPending || isInitialized}
            className="hover-elevate active-elevate-2"
            data-testid="button-start-live-demo"
          >
            {initMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!initMutation.isPending && <Sparkles className="h-4 w-4 mr-2" />}
            {isInitialized ? "Watching Live Agents" : "Start Live Demo"}
          </Button>
        </div>
        
        <Button 
          onClick={() => navigate("/tech")}
          className="hover-elevate active-elevate-2"
          data-testid="button-next-tech"
        >
          See Tech Stack
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Status message */}
      {!isInitialized && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">
            Click "Start Live Demo" to watch real AI agents communicate via email
          </p>
        </div>
      )}

      {isInitialized && liveMessages.length === 0 && (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Waiting for agents to start communicating...
          </p>
        </div>
      )}

      {/* Two-pane viewer */}
      {isInitialized && (
        <div className="flex-1 flex">
          {/* Seller pane */}
          <div className="w-1/2 border-r border-border bg-card/30 flex flex-col">
            <div className="p-6 border-b border-border bg-background/50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Seller Agent</h2>
                  <p className="text-sm text-primary font-mono">{sellerEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {sellerMessages.map((msg, idx) => (
                <Card key={msg.id} className="p-4 border-primary/20 bg-card" data-testid={`message-seller-${idx}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">To: {msg.to}</p>
                        <p className="font-semibold text-foreground mt-1">{msg.subject}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Buyer pane */}
          <div className="w-1/2 bg-card/50 flex flex-col">
            <div className="p-6 border-b border-border bg-background/50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gradient-via" />
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Buyer Agent</h2>
                  <p className="text-sm text-gradient-via font-mono">{buyerEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {buyerMessages.map((msg, idx) => (
                <Card key={msg.id} className="p-4 border-gradient-via/20 bg-card" data-testid={`message-buyer-${idx}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">To: {msg.to}</p>
                        <p className="font-semibold text-foreground mt-1">{msg.subject}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Data Section - Only show when there are messages */}
      {liveMessages.length > 0 && (
        <div className="bg-background border-t border-border">
        {/* Header */}
        <div className="px-8 py-8 border-b border-border">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              How Agents Match Buyer & Seller
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AgentBox uses a structured data model to evaluate fit across 8 signals. Here's how each side's profile is built and matched.
            </p>
          </div>
        </div>

        {/* Side-by-side profile viewer */}
        <div className="flex border-b border-border" style={{ height: '500px' }}>
          <ProfilePane 
            title="Seller Profile"
            subtitle="seller-demo@agentmail.to"
            data={sellerData}
          />
          
          <div className="w-px bg-border" />
          
          <ProfilePane 
            title="Buyer Profile"
            subtitle="buyer-demo@agentmail.to"
            data={buyerData}
          />
        </div>

        {/* Fit Score Section */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-6">
              <div className="max-w-md">
                <FitScoreIndicator
                  score={85}
                  signals={[
                    { name: 'Industry Match', matched: true, value: 'B2B SaaS' },
                    { name: 'Company Size', matched: true, value: '50-200' },
                    { name: 'Geographic Match', matched: true, value: 'North America' },
                    { name: 'Budget Range', matched: true, value: '$25K' },
                    { name: 'Timing', matched: true, value: 'Q1 2025' },
                    { name: 'Tech Stack', matched: true, value: 'Salesforce' },
                    { name: 'Need Intent', matched: true },
                    { name: 'Authority', matched: true, value: 'VP Sales' },
                  ]}
                  threshold={70}
                />
              </div>
              <Button 
                size="lg"
                onClick={() => navigate("/tech")}
                className="hover-elevate active-elevate-2"
                data-testid="button-view-tech-stack"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                View Tech Stack
              </Button>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
