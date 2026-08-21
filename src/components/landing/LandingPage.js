import { Header } from "./Header";
import { Hero } from "./Hero";
import { heroContent } from "@/lib/landingContent";

// composition root for "/" — more sections (features, how-it-works, footer,
// etc.) get added here later, each its own component reading from
// lib/landingContent.js the same way Hero does
export function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <Hero {...heroContent} />
    </main>
  );
}
