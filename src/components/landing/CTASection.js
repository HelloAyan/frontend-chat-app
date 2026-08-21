"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CTASectionSkeleton } from "./CTASectionSkeleton";

// same simulated-loading treatment as the other static landing sections
const SIMULATED_LOAD_MS = 500;

/**
 * Closing call-to-action, deliberately reusing the Hero's background glow
 * and primary-button styling so the page opens and closes with the same
 * visual signature.
 *
 * @param {import("@/lib/landingContent").CTASectionContent} props
 */
export function CTASection({ title, description, cta }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), SIMULATED_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CTASectionSkeleton />;
  }

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28 lg:px-8">
      {/* soft background glow, same treatment as the Hero section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-[4/3] w-[56rem] rounded-full bg-gradient-to-tr from-primary/25 to-primary/5" />
      </div>

      <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground text-balance">{description}</p>

        <div className="mt-9 flex justify-center">
          <Link
            href={cta.href}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
