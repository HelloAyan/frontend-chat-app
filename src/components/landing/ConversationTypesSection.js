"use client";

import { useEffect, useState } from "react";
import { ConversationCard } from "./ConversationCard";
import { ConversationCardSkeleton } from "./ConversationCardSkeleton";

// same simulated-loading treatment as the other static landing sections, for
// a consistent feel across the page
const SIMULATED_LOAD_MS = 500;

/**
 * @param {import("@/lib/landingContent").ConversationTypesContent} props
 */
export function ConversationTypesSection({ eyebrow, title, description, cards }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), SIMULATED_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="px-6 py-20 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">{description}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {isLoading
            ? cards.map((card) => <ConversationCardSkeleton key={card.id} />)
            : cards.map((card) => <ConversationCard key={card.id} {...card} />)}
        </div>
      </div>
    </section>
  );
}
