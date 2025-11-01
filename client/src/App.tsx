import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Cover from "@/pages/Cover";
import ProblemSolution from "@/pages/ProblemSolution";
import Demo from "@/pages/Demo";
import Results from "@/pages/Results";
import Setup from "@/pages/Setup";
import TechStackPage from "@/pages/TechStackPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Cover} />
      <Route path="/problem" component={ProblemSolution} />
      <Route path="/demo" component={Demo} />
      <Route path="/results" component={Results} />
      <Route path="/setup" component={Setup} />
      <Route path="/tech" component={TechStackPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Force dark mode on app load
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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
