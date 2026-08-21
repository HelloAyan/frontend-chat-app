import { Header } from "./Header";
import { Hero } from "./Hero";
import { ChatPreviewSection } from "./ChatPreviewSection";
import { FeatureSection } from "./FeatureSection";
import { heroContent, chatPreviewContent, featureSectionContent } from "@/lib/landingContent";

// composition root for "/" — more sections (testimonials, footer, etc.) get
// added here later, each its own component reading from lib/landingContent.js
// the same way the sections below do
export function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <Hero {...heroContent} />
      <ChatPreviewSection {...chatPreviewContent} />
      <FeatureSection {...featureSectionContent} />
    </main>
  );
}
