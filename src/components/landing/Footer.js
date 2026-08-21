"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FooterSkeleton } from "./FooterSkeleton";

// same simulated-loading treatment as the rest of the landing page
const SIMULATED_LOAD_MS = 400;

/**
 * @param {import("@/lib/landingContent").FooterContent} props
 */
export function Footer({ brand, description, navLinks, copyright }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), SIMULATED_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FooterSkeleton />;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Link href={brand.href} className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              {brand.label.charAt(0)}
            </span>
            <span className="text-sm font-semibold text-foreground">{brand.label}</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          &copy; {year} {brand.label}. {copyright}
        </p>
      </div>
    </footer>
  );
}
