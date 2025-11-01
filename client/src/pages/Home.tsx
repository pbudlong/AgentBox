import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ValuePropositionCards from "@/components/ValuePropositionCards";
import HowItWorks from "@/components/HowItWorks";
import LinkedInMockup from "@/components/LinkedInMockup";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ValuePropositionCards />
      <HowItWorks />
      <LinkedInMockup />
      <TrustSection />
      <Footer />
    </div>
  );
}
