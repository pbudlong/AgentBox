import { useState, useEffect } from "react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";

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
  const [isPlaying, setIsPlaying] = useState(initialState?.isPlaying || false);
  const [hasAutoStarted, setHasAutoStarted] = useState(!!initialState);
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

  // Auto-start on first load with delay
  useEffect(() => {
    if (!hasAutoStarted) {
      const timeout = setTimeout(() => {
        setIsPlaying(true);
        setHasAutoStarted(true);
      }, 500); // 500ms delay to let page load
      
      return () => clearTimeout(timeout);
    }
  }, [hasAutoStarted]);

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
      }, 20); // 20ms per character for typewriter effect (33% slower)

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
    setHasAutoStarted(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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
              togglePlayPause();
            }}
            className="hover-elevate active-elevate-2"
            data-testid="button-start-scripted"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isPlaying ? "Pause" : "Play"}
          </Button>
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
            onClick={() => navigate("/profiles")}
            className="hover-elevate active-elevate-2"
            data-testid="button-next-profiles"
          >
            See Profiles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Two-pane viewer */}
      <div 
        className="flex-1 flex cursor-pointer" 
        onClick={togglePlayPause}
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
    </div>
  );
}
