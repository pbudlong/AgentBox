import { Shield, Database, Download, Pause } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    text: "Built on modern agent infra; works with your calendar & CRM",
  },
  {
    icon: Pause,
    text: "You're always bCC'd for preselected stages; one-click pause/override",
  },
  {
    icon: Database,
    text: "Data stays in your workspace; export any time",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4"
                data-testid={`trust-point-${index}`}
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-trust-${index}`}>
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
