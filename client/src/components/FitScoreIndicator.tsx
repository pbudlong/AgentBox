import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Signal {
  name: string;
  matched: boolean;
  value?: string;
}

interface FitScoreIndicatorProps {
  score: number;
  signals: Signal[];
  threshold: number;
}

export default function FitScoreIndicator({ score, signals, threshold }: FitScoreIndicatorProps) {
  const getScoreColor = () => {
    if (score >= threshold) return "text-primary";
    if (score >= threshold * 0.6) return "text-gradient-to";
    return "text-muted-foreground";
  };

  const getScoreBgColor = () => {
    if (score >= threshold) return "from-primary/20 to-primary/5";
    if (score >= threshold * 0.6) return "from-gradient-to/20 to-gradient-to/5";
    return "from-muted/20 to-muted/5";
  };

  const matchedSignals = signals.filter(s => s.matched);
  const unmatchedSignals = signals.filter(s => !s.matched);

  return (
    <Card className={`p-6 bg-gradient-to-br ${getScoreBgColor()} border-primary/20 animate-in fade-in slide-in-from-right-4 duration-500`}>
      {/* Score circle */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              className={getScoreColor()}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor()}`} data-testid="text-fit-score">
              {Math.round(score)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-1" data-testid="text-fit-score-label">Fit Score</h4>
          <p className="text-sm text-muted-foreground">
            {score >= threshold 
              ? "Strong fit - proposing times" 
              : score >= threshold * 0.6
              ? "Potential fit - clarifying"
              : "Not a fit"}
          </p>
        </div>
      </div>

      {/* Matched signals */}
      {matchedSignals.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Matched Signals
          </p>
          <div className="space-y-1.5">
            {matchedSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground" data-testid={`text-signal-matched-${index}`}>
                  {signal.name}
                  {signal.value && <span className="text-foreground ml-1">({signal.value})</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing/unmatched signals */}
      {unmatchedSignals.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Missing Info
          </p>
          <div className="space-y-1.5">
            {unmatchedSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <XCircle className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                <span className="text-muted-foreground/70" data-testid={`text-signal-missing-${index}`}>
                  {signal.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
