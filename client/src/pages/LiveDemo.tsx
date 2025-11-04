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
import type { BuildInfo } from "@shared/build-info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [debugLogs, setDebugLogs] = useState<{ agent: 'seller' | 'buyer', message: string, status: 'success' | 'error' | 'pending', timestamp: Date, details?: string, duration?: number, isWebhook?: boolean, webhookData?: any, isWebhookPlaceholder?: boolean }[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
  const [processedWebhookIds, setProcessedWebhookIds] = useState<Set<string>>(new Set());
  const [, navigate] = useLocation();
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [selectedWebhookPayload, setSelectedWebhookPayload] = useState<any>(null);
  const [showDebugPanels, setShowDebugPanels] = useState(false);
  
  // DEBUG: Persistent filtering diagnostics to compare dev vs prod behavior
  const [filteringDebug, setFilteringDebug] = useState<{
    lastUpdate: Date;
    apiMessageCount: number;
    sessionFilteredCount: number;
    uniqueCount: number;
    sessionStartTime: string | null;
    sampleMessageTimestamps: string[];
    filteredOutCount: number;
    environment: string;
  } | null>(null);

  // DEBUG: Database diagnostics to show webhook deduplication state
  const [dbDiagnostics, setDbDiagnostics] = useState<{
    tableExists: boolean;
    recordCount: number | string;
    inMemoryCacheSize: number;
    lastChecked: Date;
  } | null>(null);

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
        const errorData = await response.json();
        const errorMessage = errorData.details || errorData.error || "Failed to initialize demo";
        
        // Use execution details from error response if available
        // Convert timestamp strings to Date objects
        if (errorData.executionDetails && errorData.executionDetails.length > 0) {
          setDebugLogs(errorData.executionDetails.map((detail: any) => ({
            ...detail,
            timestamp: new Date(detail.timestamp)
          })));
        } else {
          setDebugLogs([
            { agent: 'seller', message: `Demo initialization failed: ${errorMessage}`, status: 'error', timestamp: new Date(), details: errorData.sessionId ? `Session ID: ${errorData.sessionId}` : undefined },
          ]);
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      
      // Use execution details from backend (includes API call info, timing, errors)
      // Convert timestamp strings to Date objects
      const executionDetails = data.executionDetails || [];
      setDebugLogs(executionDetails.map((detail: any) => ({
        ...detail,
        timestamp: new Date(detail.timestamp),
        isWebhookPlaceholder: detail.status === 'pending' && detail.message.includes('Waiting for webhook')
      })));
      
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

  // Fetch build version info
  const { data: buildInfo } = useQuery<BuildInfo>({
    queryKey: ["/api/meta/version"],
    staleTime: Infinity, // Version doesn't change during session
  });

  // Detect if conversation is complete (6 messages = 5 exchanges: seller → buyer → seller → buyer → seller → buyer)
  // Once complete, stop polling to avoid infinite API calls
  const isConversationComplete = liveMessages.length >= 6;
  
  // Poll for messages when initialized (stop when conversation complete)
  const { data: messagesData } = useQuery({
    queryKey: ["/api/demo/messages"],
    enabled: isInitialized,
    refetchInterval: isConversationComplete ? false : 3000,
  });

  // Poll for webhook events when initialized (stop when conversation complete)
  const { data: webhooksData } = useQuery({
    queryKey: ["/api/demo/webhooks"],
    enabled: isInitialized,
    refetchInterval: isConversationComplete ? false : 2000,
  });

  // Poll for debug logs (production execution flow) when initialized (stop when conversation complete)
  const { data: debugLogsData } = useQuery({
    queryKey: ["/api/debug/logs", { limit: 50 }],
    enabled: isInitialized,
    refetchInterval: isConversationComplete ? false : 2000,
  });

  // Poll for database diagnostics to monitor webhook deduplication state
  const { data: dbDiagData } = useQuery({
    queryKey: ["/api/admin/diagnose-webhook-table"],
    enabled: isInitialized,
    refetchInterval: 4000, // Poll every 4 seconds
  });

  // Update database diagnostics state
  useEffect(() => {
    if (dbDiagData) {
      setDbDiagnostics({
        tableExists: (dbDiagData as any).tableExists ?? false,
        recordCount: (dbDiagData as any).recordCount ?? 'N/A',
        inMemoryCacheSize: (dbDiagData as any).inMemoryCacheSize ?? 0,
        lastChecked: new Date(),
      });
    }
  }, [dbDiagData]);

  // Update debug logs from production/development logs
  useEffect(() => {
    if (debugLogsData && (debugLogsData as any).logs) {
      const logs = (debugLogsData as any).logs;
      
      // Merge debug logs with existing execution flow
      setDebugLogs(prevLogs => {
        // Keep only initial setup logs (from initialization)
        const setupLogs = prevLogs.filter((log: any) => 
          log.message.includes('Created fresh AgentMail inbox') ||
          log.message.includes('Generated outreach email') ||
          log.message.includes('Sent email to buyer')
        );
        
        // Add all production/development logs
        const newLogs = logs.map((log: any) => ({
          agent: log.agent,
          message: log.message,
          status: log.status,
          timestamp: new Date(log.timestamp),
          details: log.details,
          duration: log.duration,
          endpoint: log.endpoint,
          method: log.method,
          statusCode: log.statusCode,
        }));
        
        // Combine and deduplicate by timestamp + message
        const allLogs = [...setupLogs, ...newLogs];
        const uniqueLogs = allLogs.reduce((acc: any[], log: any) => {
          const key = `${log.timestamp.getTime()}-${log.message}`;
          if (!acc.some((l: any) => `${l.timestamp.getTime()}-${l.message}` === key)) {
            acc.push(log);
          }
          return acc;
        }, []);
        
        // Sort by timestamp
        return uniqueLogs.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        );
      });
    }
  }, [debugLogsData]);

  // Update webhook events and merge with debug logs
  useEffect(() => {
    if (webhooksData && (webhooksData as any).webhooks) {
      const webhooks = (webhooksData as any).webhooks;
      setWebhookEvents(webhooks);
      
      // Process webhooks: add new ones OR update existing ones if status changed
      setDebugLogs(prevLogs => {
        const logsWithoutPlaceholder = prevLogs.filter((log: any) => !log.isWebhookPlaceholder);
        
        webhooks
          .filter((w: any) => !w.status?.includes('ignored'))
          .forEach((webhook: any) => {
            const existingLogIndex = logsWithoutPlaceholder.findIndex(
              (log: any) => log.isWebhook && log.webhookData?.event_id === webhook.event_id
            );
            
            const newWebhookLog = {
              agent: webhook.to?.includes('buyer') ? 'buyer' : 'seller' as 'buyer' | 'seller',
              message: `Webhook ${webhook.status}`,
              status: webhook.status?.includes('error') || webhook.status?.includes('fail') ? 'error' : webhook.status?.includes('success') ? 'success' : 'pending' as 'success' | 'error' | 'pending',
              timestamp: new Date(webhook.timestamp),
              isWebhook: true,
              webhookData: webhook,
            };
            
            if (existingLogIndex >= 0) {
              // Update existing webhook if status changed
              const existingLog = logsWithoutPlaceholder[existingLogIndex] as any;
              if (existingLog.webhookData?.status !== webhook.status) {
                logsWithoutPlaceholder[existingLogIndex] = newWebhookLog;
              }
            } else {
              // Add new webhook
              logsWithoutPlaceholder.push(newWebhookLog);
            }
          });
        
        // Sort by timestamp
        return logsWithoutPlaceholder.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        );
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
      
      // CAPTURE filtering diagnostics for visual debugging
      setFilteringDebug({
        lastUpdate: new Date(),
        apiMessageCount: allMessages.length,
        sessionFilteredCount: sessionMessages.length,
        uniqueCount: uniqueMessages.length,
        sessionStartTime: sessionStartTime?.toISOString() || null,
        sampleMessageTimestamps: allMessages.slice(0, 3).map((m: any) => m.timestamp.toISOString()),
        filteredOutCount: allMessages.length - sessionMessages.length,
        environment: import.meta.env.MODE || 'unknown'
      });
      
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
    setProcessedWebhookIds(new Set());
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
          
          <Badge variant="outline" className="ml-2">
            {buildInfo?.buildLabel || 'loading...'} [{buildInfo?.environment === 'production' ? 'PROD' : 'DEV'}]
          </Badge>
          
          {(filteringDebug || dbDiagnostics) && (
            <Button 
              onClick={() => setShowDebugPanels(!showDebugPanels)}
              variant="outline"
              size="sm"
              className="hover-elevate active-elevate-2"
              data-testid="button-toggle-debug"
            >
              {showDebugPanels ? 'Hide' : 'Show'} Debug Info
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

      {/* DEBUG PANEL - Shows filtering diagnostics to compare dev vs prod */}
      {showDebugPanels && filteringDebug && (
        <div className="mx-8 my-4 p-4 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500">
              🔍 DEBUG: Message Filtering Diagnostics
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Env: {filteringDebug.environment}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">API Messages</p>
              <p className="text-2xl font-bold text-foreground">{filteringDebug.apiMessageCount}</p>
            </div>
            
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">After Time Filter</p>
              <p className="text-2xl font-bold text-foreground">{filteringDebug.sessionFilteredCount}</p>
              <p className="text-xs text-red-400 mt-1">
                Filtered: {filteringDebug.filteredOutCount}
              </p>
            </div>
            
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">Final (Unique)</p>
              <p className="text-2xl font-bold text-foreground">{filteringDebug.uniqueCount}</p>
            </div>
            
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">Polling</p>
              <p className="text-lg font-bold">
                {isConversationComplete ? (
                  <span className="text-green-400">STOPPED ✓</span>
                ) : (
                  <span className="text-orange-400">ACTIVE...</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-background/30 rounded text-xs font-mono">
            <p className="text-muted-foreground mb-1">Session Start:</p>
            <p className="text-foreground">{filteringDebug.sessionStartTime || 'Not set'}</p>
            
            {filteringDebug.sampleMessageTimestamps.length > 0 && (
              <>
                <p className="text-muted-foreground mt-2 mb-1">Sample Message Timestamps:</p>
                {filteringDebug.sampleMessageTimestamps.map((ts, i) => (
                  <p key={i} className="text-foreground">{i + 1}. {ts}</p>
                ))}
              </>
            )}
            
            <p className="text-yellow-400 mt-2">
              Last updated: {filteringDebug.lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* DATABASE DIAGNOSTICS PANEL - Shows webhook deduplication state */}
      {showDebugPanels && dbDiagnostics && (
        <div className="mx-8 mb-4 p-4 bg-blue-500/10 border-2 border-blue-500/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
              🗄️ DEBUG: Database Webhook Deduplication
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">Table Status</p>
              <p className="text-lg font-bold">
                {dbDiagnostics.tableExists ? (
                  <span className="text-green-400">EXISTS ✓</span>
                ) : (
                  <span className="text-red-400">MISSING ✗</span>
                )}
              </p>
            </div>
            
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">DB Webhook Count</p>
              <p className="text-2xl font-bold text-foreground">{dbDiagnostics.recordCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {typeof dbDiagnostics.recordCount === 'number' && dbDiagnostics.recordCount === 0 
                  ? 'Table cleared ✓' 
                  : 'Old webhooks present'}
              </p>
            </div>
            
            <div className="bg-background/30 p-3 rounded">
              <p className="text-muted-foreground text-xs mb-1">In-Memory Cache</p>
              <p className="text-2xl font-bold text-foreground">{dbDiagnostics.inMemoryCacheSize}</p>
              <p className="text-xs text-muted-foreground mt-1">Current session</p>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-background/30 rounded text-xs">
            <p className="text-blue-400">
              Last checked: {dbDiagnostics.lastChecked.toLocaleTimeString()}
            </p>
            <p className="text-muted-foreground mt-2">
              {dbDiagnostics.tableExists && typeof dbDiagnostics.recordCount === 'number' 
                ? (dbDiagnostics.recordCount === 0 
                    ? '✅ Database clear working - no old webhooks blocking new ones'
                    : '⚠️ Old webhook IDs in database may block duplicates')
                : '❌ Cannot verify database state'}
            </p>
          </div>
        </div>
      )}

      {/* Status message */}
      {!isInitialized && (
        <div className="p-8 text-center">
          <p className="text-foreground text-lg font-bold">
            Click "Start Live Demo" to watch real AI agents communicate via email
          </p>
        </div>
      )}

      {isInitialized && liveMessages.length === 0 && !filteringDebug && (
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
            
            {/* Debug panel - show ALL execution steps */}
            {debugLogs.length > 0 && (
              <div className="px-6 py-3 bg-card border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Agentmail Execution Flow:</p>
                <div className="space-y-1">
                  {debugLogs.map((log: any, idx) => (
                    <div 
                      key={idx}
                      className={`text-xs px-2 py-1 rounded ${
                        log.agent !== 'seller' ? 'opacity-50' : ''
                      } ${
                        log.status === 'success' ? 'bg-green-500/20 text-green-400' : 
                        log.status === 'error' ? 'bg-red-500/20 text-red-400' : 
                        'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {log.status === 'success' && '✓ '}
                      {log.status === 'error' && '✗ '}
                      {log.status === 'pending' && '⏳ '}
                      {log.agent === 'buyer' && <span className="opacity-60">[Buyer] </span>}
                      {log.message}
                      {log.isWebhook && (
                        <button
                          onClick={() => {
                            setSelectedWebhookPayload(log.webhookData?.payload || log.webhookData || { message: log.message, details: log.details, timestamp: log.timestamp });
                            setWebhookDialogOpen(true);
                          }}
                          className="ml-1 underline text-[10px] hover:opacity-80"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-auto p-6">
              {sellerMessages.map((msg, idx) => (
                <div 
                  key={msg.id} 
                  className="flex justify-end mb-8"
                >
                  <Card 
                    className="p-4 border-primary/20 bg-card max-w-[85%]" 
                    data-testid={`message-seller-${idx}`}
                  >
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
                </div>
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
            
            {/* Debug panel - show ALL execution steps */}
            {debugLogs.length > 0 && (
              <div className="px-6 py-3 bg-card border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Agentmail Execution Flow:</p>
                <div className="space-y-1">
                  {debugLogs.map((log: any, idx) => (
                    <div 
                      key={idx}
                      className={`text-xs px-2 py-1 rounded ${
                        log.agent !== 'buyer' ? 'opacity-50' : ''
                      } ${
                        log.status === 'success' ? 'bg-green-500/20 text-green-400' : 
                        log.status === 'error' ? 'bg-red-500/20 text-red-400' : 
                        'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {log.status === 'success' && '✓ '}
                      {log.status === 'error' && '✗ '}
                      {log.status === 'pending' && '⏳ '}
                      {log.agent === 'seller' && <span className="opacity-60">[Seller] </span>}
                      {log.message}
                      {log.isWebhook && (
                        <button
                          onClick={() => {
                            setSelectedWebhookPayload(log.webhookData?.payload || log.webhookData || { message: log.message, details: log.details, timestamp: log.timestamp });
                            setWebhookDialogOpen(true);
                          }}
                          className="ml-1 underline text-[10px] hover:opacity-80"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-auto p-6" style={{ paddingTop: '150px' }}>
              {buyerMessages.map((msg, idx) => (
                <div 
                  key={msg.id} 
                  className="flex justify-start mb-[150px]"
                >
                  <Card 
                    className="p-4 border-gradient-via/20 bg-card max-w-[85%]" 
                    data-testid={`message-buyer-${idx}`}
                  >
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
                </div>
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

      {/* Webhook Payload Dialog */}
      <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Webhook Payload</DialogTitle>
            <DialogDescription>
              Full JSON payload from the webhook event
            </DialogDescription>
          </DialogHeader>
          <pre className="text-xs whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(selectedWebhookPayload, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
