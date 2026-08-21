import Link from "next/link";

// Brand name and CTA label are intentionally static here (not props) — this
// is the site's own identity and its one call to action, not marketing copy
// that changes. Same brand mark used on the login page, so the two match.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            T
          </span>
          <span className="text-sm font-semibold text-foreground">Threadly</span>
        </Link>

        <Link
          href="/login"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Start Chatting
        </Link>
      </div>
    </header>
  );
}
