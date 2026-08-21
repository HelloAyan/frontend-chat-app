import { Header } from "./Header";
import { Hero } from "./Hero";
import { ChatPreviewSection } from "./ChatPreviewSection";
import { heroContent, chatPreviewContent } from "@/lib/landingContent";

// composition root for "/" — more sections (testimonials, footer, etc.) get
// added here later, each its own component reading from lib/landingContent.js
// the same way Hero and ChatPreviewSection do
export function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <Hero {...heroContent} />
      <ChatPreviewSection {...chatPreviewContent} />
    </main>
  );
}
