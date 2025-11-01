import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Mail, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md transition-all cursor-pointer" data-testid="link-logo">
            <div className="relative">
              <Mail className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-lg" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gradient-from to-gradient-via bg-clip-text text-transparent">
              AgentBox
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link href="/demo">
            <Button 
              variant={location === "/demo" ? "default" : "ghost"}
              className="hover-elevate active-elevate-2"
              data-testid="button-nav-demo"
            >
              Demo
            </Button>
          </Link>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="hover-elevate active-elevate-2"
            data-testid="button-theme-toggle"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
