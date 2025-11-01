import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, ArrowRight } from "lucide-react";
import type { Status } from "@shared/schema";

interface DemoControlsProps {
  onStart: () => void;
  onReset: () => void;
  threadStatus: Status;
  isRunning: boolean;
  showNext?: boolean;
  onNext?: () => void;
}

export default function DemoControls({ onStart, onReset, threadStatus, isRunning, showNext, onNext }: DemoControlsProps) {
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
          <Button
            onClick={onStart}
            disabled={isRunning}
            className="hover-elevate active-elevate-2"
            data-testid="button-start-demo"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Demo Thread
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

        {/* Right: Next button or placeholder */}
        {showNext && onNext ? (
          <Button
            onClick={onNext}
            size="default"
            className="hover-elevate active-elevate-2"
            data-testid="button-next-profiles"
          >
            See Profile Matching
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <div className="w-32" />
        )}
      </div>
    </div>
  );
}
