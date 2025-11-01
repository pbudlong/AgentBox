import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, ExternalLink, CheckCircle2, X } from "lucide-react";

interface CalendarEventCardProps {
  title: string;
  whenISO: string;
  durationMins: number;
  attendees: string[];
  icsUrl?: string;
  gcalUrl?: string;
  summary?: string;
  onClose?: () => void;
}

export default function CalendarEventCard({ 
  title, 
  whenISO, 
  durationMins, 
  attendees,
  icsUrl,
  gcalUrl,
  summary,
  onClose
}: CalendarEventCardProps) {
  const eventDate = new Date(whenISO);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-lg shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
          onClick={onClose}
          data-testid="button-close-calendar"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {/* Success header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
        <div className="p-2 rounded-full bg-primary/10">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg" data-testid="text-calendar-title">Meeting Scheduled!</h3>
          <p className="text-sm text-muted-foreground">Your agents found a strong fit</p>
        </div>
      </div>

      {/* Event details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold" data-testid="text-event-title">{title}</p>
            <p className="text-sm text-muted-foreground" data-testid="text-event-datetime">
              {formatDate(eventDate)}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {durationMins} minutes
            </p>
          </div>
        </div>

        {/* Attendees */}
        <div className="pl-8">
          <p className="text-sm font-medium mb-2">Attendees:</p>
          <ul className="space-y-1">
            {attendees.map((attendee, index) => (
              <li key={index} className="text-sm font-mono text-muted-foreground" data-testid={`text-attendee-${index}`}>
                {attendee}
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        {summary && (
          <div className="pl-8 pt-2 border-t border-border/50">
            <p className="text-sm font-medium mb-2">Why this is a fit:</p>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-event-summary">
              {summary}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {gcalUrl && (
          <Button 
            className="flex-1 hover-elevate active-elevate-2"
            onClick={() => window.open(gcalUrl, '_blank')}
            data-testid="button-add-google-calendar"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Add to Google Calendar
          </Button>
        )}
        
        {icsUrl && (
          <Button 
            variant="outline"
            className="flex-1 hover-elevate active-elevate-2"
            onClick={() => window.open(icsUrl, '_blank')}
            data-testid="button-download-ics"
          >
            <Download className="h-4 w-4 mr-2" />
            Download .ics
          </Button>
        )}
      </div>
    </Card>
  );
}
