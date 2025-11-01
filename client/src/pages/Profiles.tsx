import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, MapPin, DollarSign, Clock, Zap, Users, Code } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import FitScoreIndicator from "@/components/FitScoreIndicator";

interface DataField {
  field: string;
  value: string;
  source: string;
  icon: any;
}

const sellerData: DataField[] = [
  { field: "Industry Focus", value: "B2B SaaS, FinTech", source: "Profile setup", icon: Building2 },
  { field: "Company Size", value: "50-500 employees", source: "Profile setup", icon: Users },
  { field: "Geography", value: "North America, UK", source: "Profile setup", icon: MapPin },
  { field: "Budget Range", value: "$10K-$50K ARR", source: "Profile setup", icon: DollarSign },
  { field: "Sales Cycle", value: "30-60 days", source: "Profile setup", icon: Clock },
  { field: "Tech Stack", value: "Salesforce, HubSpot", source: "CRM integration", icon: Code },
  { field: "Decision Maker", value: "VP Sales, Director", source: "Profile setup", icon: Zap },
];

const buyerData: DataField[] = [
  { field: "Industry", value: "FinTech", source: "LinkedIn profile", icon: Building2 },
  { field: "Company Size", value: "200 employees", source: "LinkedIn profile", icon: Users },
  { field: "Location", value: "San Francisco, CA", source: "LinkedIn profile", icon: MapPin },
  { field: "Budget", value: "$25K", source: "Email conversation", icon: DollarSign },
  { field: "Timeline", value: "Q1 2025", source: "Email conversation", icon: Clock },
  { field: "Current Stack", value: "Salesforce", source: "Website research", icon: Code },
  { field: "Role", value: "VP of Sales", source: "LinkedIn profile", icon: Zap },
];

function ProfilePane({ title, subtitle, data, isLeft }: { 
  title: string; 
  subtitle: string; 
  data: DataField[];
  isLeft?: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="bg-card border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {data.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-4 hover-elevate">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">{item.field}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {item.source}
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Profiles() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background pt-16">
      <ProgressIndicator />
      
      {/* Header */}
      <div className="bg-background border-b border-border px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            How Agents Match Buyer & Seller
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            AgentBox uses a structured data model to evaluate fit across 8 signals. Here's how each side's profile is built and matched.
          </p>
        </div>
      </div>

      {/* Side-by-side profile viewer */}
      <div className="flex-1 flex border-b border-border" style={{ height: 'calc(100vh - 280px)' }}>
        <ProfilePane 
          title="Seller Profile"
          subtitle="pete.b.seller@agentbox.ai"
          data={sellerData}
          isLeft={true}
        />
        
        <div className="w-px bg-border" />
        
        <ProfilePane 
          title="Buyer Profile"
          subtitle="aria.h.buyer@agentbox.ai"
          data={buyerData}
        />
      </div>

      {/* Fit Score Section */}
      <div className="bg-background border-t border-border px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 max-w-md">
              <FitScoreIndicator
                score={85}
                signals={[
                  { name: 'Industry Match', matched: true, value: 'B2B SaaS' },
                  { name: 'Company Size', matched: true, value: '50-200' },
                  { name: 'Geographic Match', matched: true, value: 'North America' },
                  { name: 'Budget Range', matched: true, value: '$25K' },
                  { name: 'Timing', matched: true, value: 'Q1 2025' },
                  { name: 'Tech Stack', matched: true, value: 'Salesforce' },
                  { name: 'Need Intent', matched: true },
                  { name: 'Authority', matched: true, value: 'VP Sales' },
                ]}
                threshold={70}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-foreground">8-Signal Fit Scoring</h3>
              <p className="text-base text-muted-foreground mb-6">
                Agents compute a weighted score across all signals. When the score exceeds the threshold, meeting times are proposed automatically.
              </p>
              <Button 
                onClick={() => navigate("/live")}
                size="lg"
                className="hover-elevate active-elevate-2"
                data-testid="button-next-live"
              >
                Watch Live Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
