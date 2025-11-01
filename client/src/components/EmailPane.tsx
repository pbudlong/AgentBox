import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Mail } from "lucide-react";
import type { EmailMessage } from "@shared/schema";

interface EmailPaneProps {
  title: string;
  email: string;
  messages: EmailMessage[];
  status: "idle" | "thinking" | "responding";
}

export default function EmailPane({ title, email, messages, status }: EmailPaneProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = () => {
    switch (status) {
      case "thinking": return "bg-gradient-to-r from-gradient-from to-gradient-via";
      case "responding": return "bg-gradient-to-r from-gradient-via to-gradient-to";
      default: return "bg-muted";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "thinking": return "Thinking...";
      case "responding": return "Responding...";
      default: return "Idle";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-card-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg" data-testid={`text-pane-title-${email}`}>{title}</h3>
            <p className="text-sm font-mono text-muted-foreground" data-testid={`text-pane-email-${email}`}>{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
            <span className="text-xs text-muted-foreground" data-testid={`text-pane-status-${email}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground" data-testid={`text-empty-state-${email}`}>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromAgent = message.from === email;
            return (
              <Card 
                key={message.id}
                className={`p-4 ${isFromAgent ? 'ml-auto bg-primary/5 border-primary/20' : 'mr-auto'} max-w-[85%]`}
                data-testid={`card-message-${message.id}`}
              >
                {/* Message header */}
                <div className="flex items-center justify-between mb-3 gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0">
                      {isFromAgent ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-muted-foreground truncate" data-testid={`text-message-from-${message.id}`}>
                        {message.from}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground/70 truncate">
                        to: {message.to}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0" data-testid={`text-message-time-${message.id}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {/* Subject */}
                {message.subject && (
                  <p className="text-sm font-semibold mb-2" data-testid={`text-message-subject-${message.id}`}>
                    {message.subject}
                  </p>
                )}

                {/* Body */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid={`text-message-body-${message.id}`}>
                    {message.body}
                  </p>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
