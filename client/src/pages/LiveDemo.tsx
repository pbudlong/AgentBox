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
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [debugLogs, setDebugLogs] = useState<{ agent: 'seller' | 'buyer', message: string, status: 'success' | 'error' | 'pending', timestamp: Date }[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
  const [, navigate] = useLocation();

  // Initialize demo mutation
  const initMutation = useMutation({
    mutationFn: async () => {
      // Set session start time BEFORE sending the email
      // Subtract 5 seconds to account for any clock skew or processing time
      const sessionStart = new Date(Date.now() - 5000);
      console.log("🎬 Demo session starting at:", sessionStart.toISOString());
      
      const response = await fetch("/api/demo/initialize", {
        method: "POST",
      });
      if (!response.ok) {
        setDebugLogs([
          { agent: 'seller', message: 'Demo initialization failed', status: 'error', timestamp: new Date() },
        ]);
        throw new Error("Failed to initialize demo");
      }
      const data = await response.json();
      
      // Set initial debug logs (webhooks will be added dynamically)
      setDebugLogs([
        { agent: 'seller', message: 'Created fresh AgentMail inbox', status: 'success', timestamp: new Date() },
        { agent: 'buyer', message: 'Created fresh AgentMail inbox', status: 'success', timestamp: new Date() },
        { agent: 'seller', message: 'Generated outreach email via OpenAI', status: 'success', timestamp: new Date() },
        { agent: 'seller', message: 'Sent email to buyer', status: 'success', timestamp: new Date() },
        { agent: 'buyer', message: 'Waiting for webhook...', status: 'pending', timestamp: new Date(), isWebhookPlaceholder: true } as any,
      ]);
      
      return { ...data, sessionStart };
    },
    onSuccess: (data: any) => {
      setSessionStartTime(data.sessionStart);
      setSellerEmail(data.seller);
      setBuyerEmail(data.buyer);
      setIsInitialized(true);
      console.log("✅ Demo session started, filtering messages after:", data.sessionStart.toISOString());
      queryClient.invalidateQueries({ queryKey: ["/api/demo/messages"] });
    },
  });

  // Poll for messages when initialized
  const { data: messagesData } = useQuery({
    queryKey: ["/api/demo/messages"],
    enabled: isInitialized,
    refetchInterval: 3000,
  });

  // Poll for webhook events when initialized
  const { data: webhooksData } = useQuery({
    queryKey: ["/api/demo/webhooks"],
    enabled: isInitialized,
    refetchInterval: 2000,
  });

  // Update webhook events and merge with debug logs
  useEffect(() => {
    if (webhooksData && (webhooksData as any).webhooks) {
      const webhooks = (webhooksData as any).webhooks;
      setWebhookEvents(webhooks);
      
      // Merge webhooks inline with execution flow
      setDebugLogs(prevLogs => {
        // Remove existing webhook entries and placeholder
        const baseLogs = prevLogs.filter((log: any) => !log.isWebhook && !log.isWebhookPlaceholder);
        
        // Add webhook events chronologically
        const newLogs = [...baseLogs];
        
        webhooks.forEach((webhook: any) => {
          const webhookLog: any = {
            agent: webhook.to?.includes('buyer') ? 'buyer' : 'seller',
            message: 'Webhook received',
            status: webhook.status?.includes('success') ? 'success' : webhook.status?.includes('error') ? 'error' : 'pending',
            timestamp: new Date(webhook.timestamp),
            isWebhook: true,
            webhookData: webhook,
          };
          
          // Insert webhook at correct chronological position
          if (webhookLog.agent === 'buyer') {
            // Buyer webhook goes after "Sent email to buyer" (seller step 4)
            const insertIndex = newLogs.findIndex((log: any) => log.message === 'Sent email to buyer') + 1;
            newLogs.splice(insertIndex, 0, webhookLog);
            
            // Add buyer's response steps after webhook if successful
            if (webhook.status?.includes('success')) {
              newLogs.splice(insertIndex + 1, 0, 
                { agent: 'buyer', message: 'Generated response via OpenAI', status: 'success', timestamp: new Date(webhook.timestamp) } as any,
                { agent: 'buyer', message: 'Sent reply email via webhook', status: 'success', timestamp: new Date(webhook.timestamp) } as any
              );
            }
          } else if (webhookLog.agent === 'seller') {
            // Seller webhook goes at the end (after buyer sends reply)
            newLogs.push(webhookLog);
          }
        });
        
        return newLogs;
      });
    }
  }, [webhooksData]);

  // Update messages from real API data
  useEffect(() => {
    if (messagesData && (messagesData as any).initialized) {
      const allMessages = ((messagesData as any).messages || []).map((m: any, idx: number) => {
        const messageTimestamp = new Date(m.createdAt || m.created_at || Date.now());
        return {
          id: m.messageId || m.message_id || `msg-${idx}`,
          from: m.from,
          to: m.to,
          subject: m.subject || "No Subject",
          // AgentMail: getMessage returns full 'text', fallback to 'preview' from list
          body: m.text || m.preview || m.html || "",
          timestamp: messageTimestamp,
          raw: m, // Keep raw message for debugging
        };
      });
      
      // Only show messages from the current session (sent after session start)
      const sessionMessages = sessionStartTime 
        ? allMessages.filter((m: any) => {
            const msgTime = m.timestamp.getTime();
            const sessionTime = sessionStartTime.getTime();
            const isAfterSession = msgTime >= sessionTime;
            
            if (!isAfterSession) {
              console.log(`🗑️ Filtering out old message from ${m.timestamp.toISOString()} (session: ${sessionStartTime.toISOString()})`);
            }
            
            return isAfterSession;
          })
        : allMessages;
      
      // Deduplicate by message ID
      const uniqueMessages = sessionMessages.reduce((acc: any[], msg: any) => {
        if (!acc.find((m: any) => m.id === msg.id)) {
          acc.push(msg);
        }
        return acc;
      }, []);
      
      console.log("📊 Total messages from API:", allMessages.length);
      console.log("📊 Session messages (after time filter):", sessionMessages.length);
      console.log("📊 Unique messages (after dedup):", uniqueMessages.length);
      if (allMessages.length > 0 && sessionMessages.length < allMessages.length) {
        console.log("🗑️ Filtered out", allMessages.length - sessionMessages.length, "historical messages");
      }
      if (sessionMessages.length > uniqueMessages.length) {
        console.log("🗑️ Removed", sessionMessages.length - uniqueMessages.length, "duplicate messages");
      }
      
      setLiveMessages(uniqueMessages);
    }
  }, [messagesData, sessionStartTime]);

  // Filter messages by from/to addresses (AgentMail returns all messages for the pod)
  // Seller pane: Messages FROM seller (seller's sent emails)
  const sellerMessages = liveMessages.filter(m => 
    m.from && (m.from.includes('seller-demo@agentmail.to') || m.from.includes(sellerEmail))
  );
  
  // Buyer pane: Messages FROM buyer (buyer's replies)  
  const buyerMessages = liveMessages.filter(m => 
    m.from && (m.from.includes('buyer-demo@agentmail.to') || m.from.includes(buyerEmail))
  );

  const resetDemo = () => {
    setLiveMessages([]);
    setSellerEmail("");
    setBuyerEmail("");
    setIsInitialized(false);
    setSessionStartTime(null);
    setDebugLogs([]);
    setWebhookEvents([]);
    console.log("🔄 Demo reset");
  };

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
          
          {isInitialized && (
            <Button 
              onClick={resetDemo}
              variant="outline"
              className="hover-elevate active-elevate-2"
              data-testid="button-reset-live-demo"
            >
              Reset
            </Button>
          )}
        </div>
        
        {liveMessages.length > 0 && (
          <Button 
            onClick={() => navigate("/tech")}
            className="hover-elevate active-elevate-2"
            data-testid="button-next-tech"
          >
            See Tech Stack
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Status message */}
      {!isInitialized && (
        <div className="p-8 text-center">
          <p className="text-foreground text-lg font-bold">
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
                  <h2 className="font-semibold text-lg text-foreground">Seller Agent (Mike)</h2>
                  <p className="text-sm text-primary font-mono">{sellerEmail}</p>
                </div>
              </div>
            </div>
            
            {/* Debug panel */}
            {debugLogs.filter((log: any) => log.agent === 'seller').length > 0 && (
              <div className="px-6 py-3 bg-card border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Execution Flow:</p>
                <div className="space-y-1">
                  {debugLogs.filter((log: any) => log.agent === 'seller').map((log: any, idx) => (
                    <div key={idx}>
                      {!log.isWebhook ? (
                        <div 
                          className={`text-xs px-2 py-1 rounded ${
                            log.status === 'success' ? 'bg-green-500/20 text-green-400' : 
                            log.status === 'error' ? 'bg-red-500/20 text-red-400' : 
                            'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {log.status === 'success' && '✓ '}
                          {log.status === 'error' && '✗ '}
                          {log.status === 'pending' && '⏳ '}
                          {log.message}
                        </div>
                      ) : (
                        <div className={`text-xs rounded overflow-hidden ${
                          log.webhookData.status?.includes('success') ? 'bg-green-500/10 border border-green-500/30' : 
                          log.webhookData.status?.includes('error') ? 'bg-red-500/10 border border-red-500/30' : 
                          'bg-gray-500/10 border border-gray-500/30'
                        }`}>
                          <div className={`px-2 py-1 font-semibold ${
                            log.webhookData.status?.includes('success') ? 'bg-green-500/20 text-green-400' : 
                            log.webhookData.status?.includes('error') ? 'bg-red-500/20 text-red-400' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            🔔 Webhook {log.webhookData.status}
                          </div>
                          <details className="px-2 py-2 font-mono text-[10px]">
                            <summary className="cursor-pointer text-primary hover:underline">
                              View Details
                            </summary>
                            <div className="mt-2 space-y-1">
                              <div className="text-muted-foreground">
                                <span className="opacity-60">Event ID:</span> {log.webhookData.event_id?.substring(0, 20)}...
                              </div>
                              <div className="text-muted-foreground">
                                <span className="opacity-60">From:</span> {log.webhookData.from}
                              </div>
                              <div className="text-muted-foreground">
                                <span className="opacity-60">To:</span> {log.webhookData.to}
                              </div>
                              <div className="mt-2 p-2 bg-background/50 rounded border border-border max-h-40 overflow-auto">
                                <div className="mb-2">
                                  <div className="font-semibold text-primary mb-1">Request Payload:</div>
                                  <pre className="whitespace-pre-wrap break-all text-[9px]">
                                    {JSON.stringify(log.webhookData.payload, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {sellerMessages.map((msg, idx) => (
                <Card key={msg.id} className="p-4 border-primary/20 bg-card" data-testid={`message-seller-${idx}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">To: {msg.to}</p>
                        <p className="font-semibold text-foreground mt-1">{msg.subject}</p>
                      </div>
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
                  <h2 className="font-semibold text-lg text-foreground">Buyer Agent (Sarah)</h2>
                  <p className="text-sm text-gradient-via font-mono">{buyerEmail}</p>
                </div>
              </div>
            </div>
            
            {/* Debug panel */}
            {debugLogs.filter((log: any) => log.agent === 'buyer').length > 0 && (
              <div className="px-6 py-3 bg-card border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Execution Flow:</p>
                <div className="space-y-1">
                  {debugLogs.filter((log: any) => log.agent === 'buyer').map((log: any, idx) => (
                    <div key={idx}>
                      {!log.isWebhook ? (
                        <div 
                          className={`text-xs px-2 py-1 rounded ${
                            log.status === 'success' ? 'bg-green-500/20 text-green-400' : 
                            log.status === 'error' ? 'bg-red-500/20 text-red-400' : 
                            'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {log.status === 'success' && '✓ '}
                          {log.status === 'error' && '✗ '}
                          {log.status === 'pending' && '⏳ '}
                          {log.message}
                        </div>
                      ) : (
                        <div className={`text-xs rounded overflow-hidden ${
                          log.webhookData.status?.includes('success') ? 'bg-green-500/10 border border-green-500/30' : 
                          log.webhookData.status?.includes('error') ? 'bg-red-500/10 border border-red-500/30' : 
                          'bg-gray-500/10 border border-gray-500/30'
                        }`}>
                          <div className={`px-2 py-1 font-semibold ${
                            log.webhookData.status?.includes('success') ? 'bg-green-500/20 text-green-400' : 
                            log.webhookData.status?.includes('error') ? 'bg-red-500/20 text-red-400' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            🔔 Webhook {log.webhookData.status}
                          </div>
                          <details className="px-2 py-2 font-mono text-[10px]">
                            <summary className="cursor-pointer text-primary hover:underline">
                              View Details
                            </summary>
                            <div className="mt-2 space-y-1">
                              <div className="text-muted-foreground">
                                <span className="opacity-60">Event ID:</span> {log.webhookData.event_id?.substring(0, 20)}...
                              </div>
                              <div className="text-muted-foreground">
                                <span className="opacity-60">From:</span> {log.webhookData.from}
                              </div>
                              <div className="text-muted-foreground">
                                <span className="opacity-60">To:</span> {log.webhookData.to}
                              </div>
                              <div className="mt-2 p-2 bg-background/50 rounded border border-border max-h-40 overflow-auto">
                                <div className="mb-2">
                                  <div className="font-semibold text-primary mb-1">Request Payload:</div>
                                  <pre className="whitespace-pre-wrap break-all text-[9px]">
                                    {JSON.stringify(log.webhookData.payload, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {buyerMessages.map((msg, idx) => (
                <Card key={msg.id} className="p-4 border-gradient-via/20 bg-card" data-testid={`message-buyer-${idx}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">To: {msg.to}</p>
                        <p className="font-semibold text-foreground mt-1">{msg.subject}</p>
                      </div>
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

      {/* Profile Data Section - Only show when conversation is concluded with meeting scheduled */}
      {isInitialized && liveMessages.some(m => 
        m.subject?.toLowerCase().includes('meeting confirmed') || 
        m.subject?.toLowerCase().includes('confirmed:') ||
        m.body?.toLowerCase().includes('✓ confirmed') ||
        m.body?.toLowerCase().includes('meeting confirmed')
      ) && (
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
