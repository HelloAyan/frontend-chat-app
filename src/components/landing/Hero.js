import Link from "next/link";
import { HeroImage } from "./HeroImage";
import { cn } from "@/lib/cn";

export function Hero({ eyebrow, title, description, primaryCta, secondaryCta, image, previewMessages = [] }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28 lg:px-8">
      {/* soft background glow, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-[4/3] w-[56rem] rounded-full bg-gradient-to-tr from-primary/25 to-primary/5" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-in-up text-center lg:text-left">
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance lg:max-w-xl">{description}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fade-in-up [animation-delay:150ms] lg:mx-0 lg:max-w-none">
          <HeroImage src={image.src} alt={image.alt} className="aspect-[4/5] w-full" />

          {/* floating message previews, tying the pitch back to the actual
              product's own bubble styling instead of a generic stock photo */}
          {previewMessages.map((message, index) => (
            <div
              key={message.text}
              style={{ animationDelay: `${index * 500 + 400}ms` }}
              className={cn(
                "animate-float absolute hidden max-w-[220px] rounded-2xl px-3.5 py-2.5 text-sm shadow-lg sm:block",
                message.variant === "own"
                  ? "-right-4 top-10 rounded-br-sm bg-bubble-own text-bubble-own-foreground"
                  : "-left-6 bottom-14 rounded-bl-sm bg-bubble-other text-bubble-other-foreground ring-1 ring-border",
              )}
            >
              {message.variant !== "own" && <p className="text-xs font-medium opacity-70">{message.from}</p>}
              <p className={message.variant !== "own" ? "mt-0.5" : undefined}>{message.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
