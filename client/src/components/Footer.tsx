import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-product">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-docs">Docs</Link></li>
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-directory">Directory</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-resources">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-faq">FAQ</Link></li>
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-legal">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy</Link></li>
              <li><Link href="/demo" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms</Link></li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-status">Status</h4>
            <p className="text-sm text-muted-foreground mb-2">Free during beta</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © 2024 AgentBox. Built for HackHalloween.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold text-primary">AgentMail</span>
            <span>•</span>
            <span className="font-semibold text-primary">Convex</span>
            <span>•</span>
            <span className="font-semibold text-primary">Replit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
