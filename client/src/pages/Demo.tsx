import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import DemoControls from "@/components/DemoControls";
import EmailPane from "@/components/EmailPane";
import CalendarEventCard from "@/components/CalendarEventCard";
import FitScoreIndicator from "@/components/FitScoreIndicator";
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
  const [currentStep, setCurrentStep] = useState(0);

  const sellerMessages = messages.filter(m => 
    m.from === 'pete.b.seller@agentbox.ai' || m.to === 'pete.b.seller@agentbox.ai'
  );
  
  const buyerMessages = messages.filter(m => 
    m.from === 'aria.h.buyer@agentbox.ai' || m.to === 'aria.h.buyer@agentbox.ai'
  );

  const runDemo = async () => {
    setIsRunning(true);
    setMessages([]);
    setShowScore(false);
    setShowCalendar(false);
    setCurrentStep(0);

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
    setCurrentStep(0);
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Demo controls */}
      <DemoControls
        onStart={runDemo}
        onReset={resetDemo}
        threadStatus={threadStatus}
        isRunning={isRunning}
      />

      {/* Two-pane email viewer */}
      <div className="flex-1 flex">
        {/* Left: Seller pane */}
        <div className="w-1/2 border-r border-border bg-card/30">
          <EmailPane
            title="Seller Agent"
            email="pete.b.seller@agentbox.ai"
            messages={sellerMessages}
            status={isRunning && sellerMessages.length < buyerMessages.length ? "thinking" : "idle"}
          />
        </div>

        {/* Right: Buyer pane */}
        <div className="w-1/2 bg-card/50">
          <EmailPane
            title="Buyer Agent"
            email="aria.h.buyer@agentbox.ai"
            messages={buyerMessages}
            status={isRunning && buyerMessages.length < sellerMessages.length ? "thinking" : "idle"}
          />
        </div>
      </div>

      {/* Floating fit score indicator */}
      {showScore && (
        <div className="fixed bottom-8 right-8 w-80 z-30">
          <FitScoreIndicator
            score={fitScore}
            signals={mockSignals}
            threshold={70}
          />
        </div>
      )}

      {/* Calendar event card overlay */}
      {showCalendar && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-30 px-8">
          <CalendarEventCard
            title="AgentBox Intro Call - Sales Automation Platform"
            whenISO={new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString()}
            durationMins={30}
            attendees={['pete.b.seller@agentbox.ai', 'aria.h.buyer@agentbox.ai']}
            icsUrl="/api/ics/demo-thread.ics"
            gcalUrl="https://calendar.google.com/calendar/r/eventedit"
            summary="Strong fit based on industry alignment (B2B SaaS), company size match (50-200 employees), Salesforce integration capability, and budget compatibility. Both parties are looking for Q1 2025 implementation."
          />
        </div>
      )}
    </div>
  );
}
