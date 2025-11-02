import ProgressIndicator from "@/components/ProgressIndicator";
import TechStack from "@/components/TechStack";

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator />
      <div className="pt-16">
        <TechStack />
      </div>
    </div>
  );
}
