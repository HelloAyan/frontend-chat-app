import Link from "next/link";
import { Hero } from "./Hero";
import { heroContent } from "@/lib/landingContent";

// composition root for "/" — more sections (features, how-it-works, footer,
// etc.) get added here later, each its own component reading from
// lib/landingContent.js the same way Hero does
export function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-2 px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            T
          </span>
          <span className="text-sm font-semibold text-foreground">Threadly</span>
        </Link>
      </header>

      <Hero {...heroContent} />
    </main>
  );
}
