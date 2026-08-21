import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ChatPreviewSection } from "./ChatPreviewSection";
import { ConversationTypesSection } from "./ConversationTypesSection";
import { RealtimeShowcase } from "./RealtimeShowcase";
import { FeatureSection } from "./FeatureSection";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";
import {
  navbarContent,
  heroContent,
  chatPreviewContent,
  conversationTypesContent,
  realtimeShowcaseContent,
  featureSectionContent,
  ctaSectionContent,
  footerContent,
} from "@/lib/landingContent";

// composition root for "/" — more sections get added here later, each its
// own component reading from lib/landingContent.js the same way the
// sections below do
export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar {...navbarContent} />
      <main className="flex flex-1 flex-col">
        <Hero {...heroContent} />
        <ChatPreviewSection {...chatPreviewContent} />
        <ConversationTypesSection {...conversationTypesContent} />
        <RealtimeShowcase {...realtimeShowcaseContent} />
        <FeatureSection {...featureSectionContent} />
        <CTASection {...ctaSectionContent} />
      </main>
      <Footer {...footerContent} />
    </div>
  );
}
