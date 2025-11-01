import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, ArrowRight, Calendar, Sparkles } from "lucide-react";
import type { Status } from "@shared/schema";

interface DemoControlsProps {
  onStart: () => void;
  onReset: () => void;
  threadStatus: Status;
  isRunning: boolean;
  showNext?: boolean;
  onNext?: () => void;
  showCalendar?: boolean;
  onViewCalendar?: () => void;
  onStartLive?: () => void;
  liveMode?: boolean;
}

export default function DemoControls({ onStart, onReset, threadStatus, isRunning, showNext, onNext, showCalendar, onViewCalendar, onStartLive, liveMode }: DemoControlsProps) {
  const getStatusBadgeVariant = () => {
    switch (threadStatus) {
      case "collecting": return "secondary";
      case "approved": return "default";
      case "scheduled": return "default";
      case "declined": return "destructive";
      default: return "outline";
    }
  };

  const getStatusText = () => {
    switch (threadStatus) {
      case "collecting": return "Collecting Info";
      case "approved": return "Approved";
      case "scheduled": return "Scheduled";
      case "declined": return "Declined";
      default: return "Ready";
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border h-16 px-8">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Control buttons */}
        <div className="flex items-center gap-4">
          {onStartLive && (
            <Button
              onClick={onStartLive}
              disabled={isRunning}
              variant="default"
              className="hover-elevate active-elevate-2"
              data-testid="button-start-live-demo"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {liveMode ? "Watching Live Agents" : "Start Live Demo"}
            </Button>
          )}
          <Button
            onClick={onStart}
            disabled={isRunning || liveMode}
            variant={liveMode ? "outline" : "default"}
            className="hover-elevate active-elevate-2"
            data-testid="button-start-demo"
          >
            <Play className="h-4 w-4 mr-2" />
            {liveMode ? "Scripted Demo" : "Start Scripted Demo"}
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            className="hover-elevate active-elevate-2"
            data-testid="button-reset-demo"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Center: Thread status */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Thread Status:</span>
          <Badge variant={getStatusBadgeVariant()} className="text-sm" data-testid="badge-thread-status">
            {getStatusText()}
          </Badge>
        </div>

        {/* Right: Calendar button, Next button, or placeholder */}
        <div className="flex items-center gap-3">
          {showCalendar && onViewCalendar && (
            <Button
              variant="outline"
              onClick={onViewCalendar}
              size="default"
              className="hover-elevate active-elevate-2"
              data-testid="button-view-calendar"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          )}
          {showNext && onNext ? (
            <Button
              onClick={onNext}
              size="default"
              className="hover-elevate active-elevate-2"
              data-testid="button-next-profiles"
            >
              See Profiles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : !showCalendar ? (
            <div className="w-32" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
