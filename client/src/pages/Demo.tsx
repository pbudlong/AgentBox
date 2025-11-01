import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProgressIndicator from "@/components/ProgressIndicator";
import DemoControls from "@/components/DemoControls";
import EmailPane from "@/components/EmailPane";
import CalendarEventCard from "@/components/CalendarEventCard";
import FitScoreIndicator from "@/components/FitScoreIndicator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import type { EmailMessage, Status } from "@shared/schema";

//todo: remove mock functionality
const MOCK_MESSAGES = {
  initial: {
    id: '1',
    from: 'pete.b.seller@agentbox.ai',
    to: 'aria.h.buyer@agentbox.ai',
    subject: 'Introduction - Sales Automation Platform',
    body: 'Hi Aria,\n\nI noticed your company is scaling fast in the SaaS space. We help teams like yours close deals 40% faster with our AI-powered sales platform.\n\nWould love to chat if it makes sense for your team.\n\nBest,\nPete',
    timestamp: new Date(Date.now() - 1000 * 10),
    threadId: 'demo-thread',
  },
  clarify: {
    id: '2',
    from: 'aria.h.buyer@agentbox.ai',
    to: 'pete.b.seller@agentbox.ai',
    subject: 'Re: Introduction - Sales Automation Platform',
    body: 'Thanks for reaching out, Pete.\n\nTo confirm fit, could you share:\n1. Your current CRM integrations (we use Salesforce)\n2. Rough pricing range for a team of 50-100 users\n\nThis will help me understand if there\'s alignment.\n\nBest,\nAria (via AgentBox)',
    timestamp: new Date(Date.now() - 1000 * 5),
    threadId: 'demo-thread',
  },
  response: {
    id: '3',
    from: 'pete.b.seller@agentbox.ai',
    to: 'aria.h.buyer@agentbox.ai',
    subject: 'Re: Introduction - Sales Automation Platform',
    body: 'Great questions!\n\n1. We have native Salesforce integration with bi-directional sync\n2. For 50-100 users, pricing ranges from $8-12K annually\n\nHappy to share more details.\n\nBest,\nPete (via AgentBox)',
    timestamp: new Date(Date.now() - 1000 * 2),
    threadId: 'demo-thread',
  },
  propose: {
    id: '4',
    from: 'aria.h.buyer@agentbox.ai',
    to: 'pete.b.seller@agentbox.ai',
    subject: 'Re: Introduction - Sales Automation Platform',
    body: 'Looks like a strong fit based on:\n• Industry alignment (B2B SaaS)\n• Company size match (50-200 employees)\n• Budget compatibility\n• Salesforce integration\n\nHere are three times that work:\nA) Tue, Nov 5 - 2:00 PM PT\nB) Wed, Nov 6 - 9:30 AM PT  \nC) Thu, Nov 7 - 1:00 PM PT\n\nReply with A, B, or C and I\'ll confirm.\n\nBest,\nAria (via AgentBox)',
    timestamp: new Date(),
    threadId: 'demo-thread',
  },
  confirm: {
    id: '5',
    from: 'pete.b.seller@agentbox.ai',
    to: 'aria.h.buyer@agentbox.ai',
    subject: 'Re: Introduction - Sales Automation Platform',
    body: 'B works great for me!\n\nLooking forward to it.\n\nBest,\nPete (via AgentBox)',
    timestamp: new Date(),
    threadId: 'demo-thread',
  },
  scheduled: {
    id: '6',
    from: 'aria.h.buyer@agentbox.ai',
    to: 'pete.b.seller@agentbox.ai',
    subject: 'Meeting Confirmed - Nov 6 @ 9:30 AM PT',
    body: 'Confirmed for Wed, Nov 6 at 9:30 AM PT.\n\nCalendar invite and details below.\n\nSummary: Strong fit based on industry alignment (B2B SaaS), company size match (50-200 employees), Salesforce integration capability, and budget compatibility. Both parties are looking for Q1 2025 implementation.\n\nSee you then!\n\nBest,\nAria (via AgentBox)',
    timestamp: new Date(),
    threadId: 'demo-thread',
  },
};

export default function Demo() {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [threadStatus, setThreadStatus] = useState<Status>("collecting");
  const [isRunning, setIsRunning] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [, navigate] = useLocation();

  // Initialize demo mutation
  const initMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/demo/initialize", {
        method: "POST",
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setSellerEmail(data.seller);
      setBuyerEmail(data.buyer);
      setLiveMode(true);
      setIsRunning(true);
      queryClient.invalidateQueries({ queryKey: ["/api/demo/messages"] });
    },
  });

  // Poll for messages when in live mode
  const { data: messagesData } = useQuery({
    queryKey: ["/api/demo/messages"],
    enabled: liveMode,
    refetchInterval: 3000, // Poll every 3 seconds
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
        threadId: "live-demo",
      }));
      
      setMessages(realMessages);
      
      // Show score after first exchange
      if (realMessages.length >= 2) {
        setShowScore(true);
      }
      
      // Update status based on message count
      if (realMessages.length >= 4) {
        setThreadStatus("approved");
      }
      
      // Stop running indicator after initial message
      if (realMessages.length > 0 && isRunning) {
        setTimeout(() => setIsRunning(false), 2000);
      }
    }
  }, [messagesData, isRunning]);

  const sellerMessages = liveMode
    ? messages.filter(m => m.from.includes(sellerEmail) || m.to.includes(sellerEmail))
    : messages.filter(m => 
        m.from === 'pete.b.seller@agentbox.ai' || m.to === 'pete.b.seller@agentbox.ai'
      );
  
  const buyerMessages = liveMode
    ? messages.filter(m => m.from.includes(buyerEmail) || m.to.includes(buyerEmail))
    : messages.filter(m => 
        m.from === 'aria.h.buyer@agentbox.ai' || m.to === 'aria.h.buyer@agentbox.ai'
      );

  const runDemo = async () => {
    // First, completely reset state
    setMessages([]);
    setShowScore(false);
    setShowCalendar(false);
    setShowCalendarModal(false);
    setThreadStatus("collecting");
    
    // Small delay to ensure state is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setIsRunning(true);

    // Step 1: Initial seller email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages([MOCK_MESSAGES.initial]);
    setThreadStatus("collecting");

    // Step 2: Buyer clarifying question
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages(prev => [...prev, MOCK_MESSAGES.clarify]);
    setShowScore(true);

    // Step 3: Seller response
    await new Promise(resolve => setTimeout(resolve, 2500));
    setMessages(prev => [...prev, MOCK_MESSAGES.response]);

    // Step 4: Recalculate score and propose slots
    await new Promise(resolve => setTimeout(resolve, 2000));
    setThreadStatus("approved");
    setMessages(prev => [...prev, MOCK_MESSAGES.propose]);

    // Step 5: Buyer selects slot
    await new Promise(resolve => setTimeout(resolve, 2500));
    setMessages(prev => [...prev, MOCK_MESSAGES.confirm]);

    // Step 6: Final confirmation with calendar
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages(prev => [...prev, MOCK_MESSAGES.scheduled]);
    setThreadStatus("scheduled");
    setShowCalendar(true);

    setIsRunning(false);
  };

  const resetDemo = () => {
    setMessages([]);
    setThreadStatus("collecting");
    setIsRunning(false);
    setShowScore(false);
    setShowCalendar(false);
    setShowCalendarModal(false);
    setLiveMode(false);
    setSellerEmail("");
    setBuyerEmail("");
  };

  const startLiveDemo = () => {
    resetDemo();
    initMutation.mutate();
  };

  const mockSignals = [
    { name: 'Industry Match', matched: true, value: 'B2B SaaS' },
    { name: 'Company Size', matched: true, value: '50-200' },
    { name: 'Geographic Match', matched: true, value: 'North America' },
    { name: 'Budget Range', matched: threadStatus === "approved", value: '$8-12K' },
    { name: 'Timing', matched: true, value: 'Q1 2025' },
    { name: 'Tech Stack', matched: threadStatus === "approved", value: 'Salesforce' },
  ];

  const fitScore = threadStatus === "approved" ? 85 : 68;

  return (
    <div className="min-h-screen flex flex-col bg-background pt-16">
      <ProgressIndicator />
      
      {/* Demo controls */}
      <DemoControls
        onStart={runDemo}
        onReset={resetDemo}
        threadStatus={threadStatus}
        isRunning={isRunning}
        showNext={showCalendar && !isRunning}
        onNext={() => navigate("/profiles")}
        showCalendar={showCalendar && !isRunning}
        onViewCalendar={() => setShowCalendarModal(true)}
        onStartLive={startLiveDemo}
        liveMode={liveMode}
      />

      {/* Two-pane email viewer */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-1">
          {/* Left: Seller pane */}
          <div className="w-1/2 border-r border-border bg-card/30">
            <EmailPane
              title="Seller Agent"
              email={liveMode && sellerEmail ? sellerEmail : "pete.b.seller@agentbox.ai"}
              messages={sellerMessages}
              status={isRunning && sellerMessages.length < buyerMessages.length ? "thinking" : "idle"}
            />
          </div>

          {/* Right: Buyer pane */}
          <div className="w-1/2 bg-card/50">
            <EmailPane
              title="Buyer Agent"
              email={liveMode && buyerEmail ? buyerEmail : "aria.h.buyer@agentbox.ai"}
              messages={buyerMessages}
              status={isRunning && buyerMessages.length < sellerMessages.length ? "thinking" : "idle"}
            />
          </div>
        </div>

        {/* Fit score indicator underneath emails */}
        {showScore && (
          <div className="border-t border-border bg-background/50 p-8 flex justify-center gap-8 items-center">
            <div className="w-full max-w-md">
              <FitScoreIndicator
                score={fitScore}
                signals={mockSignals}
                threshold={70}
              />
            </div>
            {showCalendar && !isRunning && (
              <Button
                onClick={() => navigate("/profiles")}
                size="default"
                className="hover-elevate active-elevate-2 flex-shrink-0"
                data-testid="button-next-profiles-bottom"
              >
                See Profiles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Calendar event card modal - only shows when button clicked */}
      {showCalendarModal && showCalendar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setShowCalendarModal(false)}
          />
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-8">
            <CalendarEventCard
              title="AgentBox Intro Call - Sales Automation Platform"
              whenISO={new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString()}
              durationMins={30}
              attendees={['pete.b.seller@agentbox.ai', 'aria.h.buyer@agentbox.ai']}
              icsUrl="/api/ics/demo-thread.ics"
              gcalUrl="https://calendar.google.com/calendar/r/eventedit"
              summary="Strong fit based on industry alignment (B2B SaaS), company size match (50-200 employees), Salesforce integration capability, and budget compatibility. Both parties are looking for Q1 2025 implementation."
              onClose={() => setShowCalendarModal(false)}
            />
          </div>
        </>
      )}

    </div>
  );
}
