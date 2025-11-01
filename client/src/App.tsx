import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Cover from "@/pages/Cover";
import Problem from "@/pages/Problem";
import BuyerJourney from "@/pages/BuyerJourney";
import SellerJourney from "@/pages/SellerJourney";
import ScriptedDemo from "@/pages/ScriptedDemo";
import LiveDemo from "@/pages/LiveDemo";
import TechStackPage from "@/pages/TechStackPage";
import NotFound from "@/pages/not-found";

const pageOrder = ["/", "/problem", "/buyer", "/seller", "/demo", "/live", "/tech"];

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = pageOrder.indexOf(location);
      if (currentIndex === -1) return;

      if (e.key === "ArrowRight") {
        if (currentIndex < pageOrder.length - 1) {
          setLocation(pageOrder[currentIndex + 1]);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          setLocation(pageOrder[currentIndex - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Cover} />
      <Route path="/problem" component={Problem} />
      <Route path="/buyer" component={BuyerJourney} />
      <Route path="/seller" component={SellerJourney} />
      <Route path="/demo" component={ScriptedDemo} />
      <Route path="/live" component={LiveDemo} />
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
