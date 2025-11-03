import { useState, useEffect } from "react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles, Building2, MapPin, DollarSign, Clock, Zap, Users, Code } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FitScoreIndicator from "@/components/FitScoreIndicator";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  side: 'seller' | 'buyer';
}

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    side: 'seller',
    from: 'mike.salestech@agentbox.ai',
    to: 'sarah.techcorp@agentbox.ai',
    subject: 'DevOps Automation for TechCorp',
    body: 'Hi Sarah,\n\nI noticed TechCorp recently raised Series B. Congrats!\n\nWe help engineering teams like yours reduce deployment time by 80% with our AI-powered DevOps platform.\n\nWorth a conversation?\n\nBest,\nMike'
  },
  {
    id: '2',
    side: 'buyer',
    from: 'sarah.techcorp@agentbox.ai',
    to: 'mike.salestech@agentbox.ai',
    subject: 'Re: DevOps Automation for TechCorp',
    body: 'Thanks for reaching out, Mike.\n\nTo confirm fit:\n• What\'s your current Kubernetes integration story?\n• Rough pricing for 50-100 engineer team?\n• Can you support our AWS + GCP multi-cloud?\n\nThis helps me understand alignment.\n\nBest,\nSarah (via AgentBox)'
  },
  {
    id: '3',
    side: 'seller',
    from: 'mike.salestech@agentbox.ai',
    to: 'sarah.techcorp@agentbox.ai',
    subject: 'Re: DevOps Automation for TechCorp',
    body: 'Great questions!\n\n• Native K8s integration with auto-scaling\n• $15-20K annually for 50-100 engineers  \n• Full AWS + GCP + Azure support\n\nHappy to dive deeper.\n\nBest,\nMike (via AgentBox)'
  },
  {
    id: '4',
    side: 'buyer',
    from: 'sarah.techcorp@agentbox.ai',
    to: 'mike.salestech@agentbox.ai',
    subject: 'Re: DevOps Automation for TechCorp',
    body: 'Strong fit detected based on:\n✓ Industry: B2B SaaS\n✓ Company size: 50-200 engineers\n✓ Tech stack: Kubernetes, multi-cloud\n✓ Budget: Aligned\n✓ Timing: Q1 2025 implementation\n\nThree times that work:\nA) Tue, Nov 5 - 2:00 PM PT\nB) Wed, Nov 6 - 10:00 AM PT\nC) Thu, Nov 7 - 3:30 PM PT\n\nReply with A, B, or C.\n\nBest,\nSarah (via AgentBox)'
  },
  {
    id: '5',
    side: 'seller',
    from: 'mike.salestech@agentbox.ai',
    to: 'sarah.techcorp@agentbox.ai',
    subject: 'Re: DevOps Automation for TechCorp',
    body: 'B works perfectly!\n\nLooking forward to it.\n\nBest,\nMike (via AgentBox)'
  },
  {
    id: '6',
    side: 'buyer',
    from: 'sarah.techcorp@agentbox.ai',
    to: 'mike.salestech@agentbox.ai',
    subject: 'Meeting Confirmed - Nov 6 @ 10:00 AM PT',
    body: '✓ Confirmed: Wed, Nov 6 at 10:00 AM PT\n\nCalendar invite sent to both parties.\n\n📋 Meeting Summary:\nStrong fit based on industry alignment (B2B SaaS), technical compatibility (K8s, multi-cloud), budget match, and shared Q1 2025 timeline.\n\nSee you then!\n\nBest,\nSarah (via AgentBox)'
  }
];

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

export default function ScriptedDemo() {
  const STORAGE_KEY = 'scriptedDemoState';
  
  // Load initial state from localStorage
  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load demo state', e);
    }
    return null;
  };

  const initialState = loadState();
  
  const [visibleMessages, setVisibleMessages] = useState<Message[]>(initialState?.visibleMessages || []);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(initialState?.currentMessageIndex || 0);
  const [typingProgress, setTypingProgress] = useState(initialState?.typingProgress || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [, navigate] = useLocation();

  const currentMessage = DEMO_MESSAGES[currentMessageIndex];

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      visibleMessages,
      currentMessageIndex,
      typingProgress,
      isPlaying
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [visibleMessages, currentMessageIndex, typingProgress, isPlaying]);

  // Auto-start on page load with delay
  useEffect(() => {
    if (!hasAutoStarted) {
      const timeout = setTimeout(() => {
        setIsPlaying(true);
        setHasAutoStarted(true);
      }, 500); // 500ms delay to let page load
      
      return () => clearTimeout(timeout);
    }
  }, [hasAutoStarted]);

  // Clear localStorage when navigating away to ensure fresh start next time
  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!isPlaying) return;

    if (currentMessageIndex >= DEMO_MESSAGES.length) {
      setIsPlaying(false);
      return;
    }

    const message = DEMO_MESSAGES[currentMessageIndex];
    const fullText = message.body;

    if (typingProgress < fullText.length) {
      const timeout = setTimeout(() => {
        setTypingProgress((prev: number) => prev + 1);
      }, 10); // 10ms per character for typewriter effect (50% faster)

      return () => clearTimeout(timeout);
    } else {
      // Message complete, move to next after delay
      const timeout = setTimeout(() => {
        setVisibleMessages((prev: Message[]) => [...prev, message]);
        setCurrentMessageIndex((prev: number) => prev + 1);
        setTypingProgress(0);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [isPlaying, currentMessageIndex, typingProgress]);

  const startDemo = () => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setTypingProgress(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setTypingProgress(0);
    setIsPlaying(false);
    setHasAutoStarted(true); // Keep true to prevent auto-start after reset
    localStorage.removeItem(STORAGE_KEY);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlayClick = () => {
    // If demo is complete, restart it
    if (visibleMessages.length === DEMO_MESSAGES.length) {
      startDemo();
    } else {
      // Otherwise toggle play/pause
      togglePlayPause();
    }
  };

  const skipAhead = () => {
    setVisibleMessages(DEMO_MESSAGES);
    setCurrentMessageIndex(DEMO_MESSAGES.length);
    setTypingProgress(0);
    setIsPlaying(false);
  };

  const sellerMessages = visibleMessages.filter(m => m.side === 'seller');
  const buyerMessages = visibleMessages.filter(m => m.side === 'buyer');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator />
      
      {/* Controls */}
      <div className="pt-16 px-8 py-4 border-b border-border flex items-center justify-between">
        <div className="flex gap-3">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            className="hover-elevate active-elevate-2"
            data-testid="button-play-pause"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          {visibleMessages.length < DEMO_MESSAGES.length && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                skipAhead();
              }}
              variant="outline"
              className="hover-elevate active-elevate-2"
              data-testid="button-skip-ahead"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Skip Ahead
            </Button>
          )}
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              resetDemo();
            }}
            variant="outline"
            className="hover-elevate active-elevate-2"
            data-testid="button-reset-scripted"
          >
            Reset
          </Button>
        </div>
        
        {visibleMessages.length === DEMO_MESSAGES.length && (
          <Button 
            onClick={() => navigate("/live")}
            className="hover-elevate active-elevate-2"
            data-testid="button-next-live"
          >
            Watch Live Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Two-pane viewer */}
      <div 
        className="flex-1 flex cursor-pointer" 
        onClick={handlePlayClick}
        data-testid="demo-viewer"
      >
        {/* Seller pane */}
        <div className="w-1/2 border-r border-border bg-card/30 flex flex-col">
          <div className="p-6 border-b border-border bg-background/50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-lg text-foreground">Seller Agent</h2>
                <p className="text-sm text-primary font-mono">mike.salestech@agentbox.ai</p>
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
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.body}
                  </p>
                </div>
              </Card>
            ))}
            
            {/* Currently typing message on seller side */}
            {currentMessage?.side === 'seller' && typingProgress > 0 && currentMessageIndex < DEMO_MESSAGES.length && (
              <Card className="p-4 border-primary/40 bg-card">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">To: {currentMessage.to}</p>
                      <p className="font-semibold text-foreground mt-1">{currentMessage.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {currentMessage.body.slice(0, typingProgress)}
                    <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Buyer pane */}
        <div className="w-1/2 bg-card/50 flex flex-col">
          <div className="p-6 border-b border-border bg-background/50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gradient-via" />
              <div>
                <h2 className="font-semibold text-lg text-foreground">Buyer Agent</h2>
                <p className="text-sm text-gradient-via font-mono">sarah.techcorp@agentbox.ai</p>
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
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.body}
                  </p>
                </div>
              </Card>
            ))}
            
            {/* Currently typing message on buyer side */}
            {currentMessage?.side === 'buyer' && typingProgress > 0 && currentMessageIndex < DEMO_MESSAGES.length && (
              <Card className="p-4 border-gradient-via/40 bg-card">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">To: {currentMessage.to}</p>
                      <p className="font-semibold text-foreground mt-1">{currentMessage.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {currentMessage.body.slice(0, typingProgress)}
                    <span className="inline-block w-2 h-4 bg-gradient-via ml-1 animate-pulse" />
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Profile Data Section - Only show when demo is complete */}
      {visibleMessages.length === DEMO_MESSAGES.length && (
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
            subtitle="mike.salestech@agentbox.ai"
            data={sellerData}
          />
          
          <div className="w-px bg-border" />
          
          <ProfilePane 
            title="Buyer Profile"
            subtitle="sarah.techcorp@agentbox.ai"
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
                onClick={() => navigate("/live")}
                className="hover-elevate active-elevate-2"
                data-testid="button-watch-live-demo"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Watch Live Demo
              </Button>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
