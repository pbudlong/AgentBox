import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DemoCover from "@/pages/DemoCover";
import DemoLanding from "@/pages/DemoLanding";
import DemoLive from "@/pages/DemoLive";
import DemoTechStack from "@/pages/DemoTechStack";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/demo" />} />
      <Route path="/demo" component={DemoCover} />
      <Route path="/demo/landing" component={DemoLanding} />
      <Route path="/demo/live" component={DemoLive} />
      <Route path="/demo/tech-stack" component={DemoTechStack} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
