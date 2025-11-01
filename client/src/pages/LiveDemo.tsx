import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";

export default function LiveDemo() {
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [sellerEmail, setSellerEmail] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
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
    </div>
  );
}
