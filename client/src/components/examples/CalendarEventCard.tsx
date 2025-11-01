import CalendarEventCard from '../CalendarEventCard';

export default function CalendarEventCardExample() {
  const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2); // 2 days from now
  futureDate.setHours(14, 30, 0, 0);

  return (
    <div className="max-w-2xl p-8">
      <CalendarEventCard
        title="AgentBox Intro Call"
        whenISO={futureDate.toISOString()}
        durationMins={30}
        attendees={['pete.b.seller@agentbox.ai', 'aria.h.buyer@agentbox.ai']}
        icsUrl="/api/ics/thread-123.ics"
        gcalUrl="https://calendar.google.com/calendar/r/eventedit"
        summary="Strong fit based on industry alignment (SaaS), company size match (50-200 employees), and budget compatibility. Both parties are looking for Q1 2025 implementation."
      />
    </div>
  );
}
