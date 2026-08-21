"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

const SIMULATED_LOAD_MS = 500;
const TYPING_START_DELAY_MS = 1300;
const TYPING_DURATION_MS = 1800;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// useSyncExternalStore instead of a useEffect+setState pair: matchMedia is a
// real external data source (and this also reacts live if the OS setting
// changes while the page is open), not state React owns
function subscribeToReducedMotion(callback) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Runs once per mount: base messages appear, then a typing indicator, then
 * the incoming message lands with its own entrance animation and a brief
 * "new message" badge. No socket, no store — a scripted demo of what the
 * real thing looks like. Loops only in the sense that remounting (e.g.
 * navigating back to "/") plays it again; it doesn't repeat on a timer,
 * showing the same message "arriving" over and over would read as a bug,
 * not a feature.
 *
 * @param {import("@/lib/landingContent").RealtimeShowcaseContent} props
 */
export function RealtimeShowcase({ eyebrow, title, description, participant, baseMessages, incomingMessage }) {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState("idle"); // idle -> typing -> delivered
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), SIMULATED_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // reduced motion skips straight to the end state, same conversation,
    // no typing indicator or timed reveal to sit through
    if (isLoading || prefersReducedMotion) return undefined;

    const typingTimer = setTimeout(() => setPhase("typing"), TYPING_START_DELAY_MS);
    const deliverTimer = setTimeout(() => setPhase("delivered"), TYPING_START_DELAY_MS + TYPING_DURATION_MS);
    return () => {
      clearTimeout(typingTimer);
      clearTimeout(deliverTimer);
    };
  }, [isLoading, prefersReducedMotion]);

  const showIncoming = prefersReducedMotion || phase === "delivered";
  const showTyping = !prefersReducedMotion && phase === "typing";
  const showNewMessageBadge = !prefersReducedMotion && phase === "delivered";

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

        <div className="relative mx-auto mt-14 max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {isLoading ? (
            <ShowcaseSkeleton />
          ) : (
            <>
              <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                <div className="relative shrink-0">
                  <Avatar name={participant.name} size="sm" />
                  {participant.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">{participant.isOnline ? "Active now" : "Offline"}</p>
                </div>
              </div>

              <div className="flex min-h-[280px] flex-col justify-end gap-3 px-4 py-5">
                {baseMessages.map((message) => (
                  <ShowcaseBubble key={message.id} message={message} />
                ))}

                {showTyping && (
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-bubble-other px-4 py-3 w-fit">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bubble-other-foreground/50 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bubble-other-foreground/50 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bubble-other-foreground/50" />
                  </div>
                )}

                {showIncoming && (
                  <div className="animate-fade-in-up">
                    <ShowcaseBubble message={incomingMessage} />
                  </div>
                )}
              </div>

              {showNewMessageBadge && (
                <div
                  aria-live="polite"
                  className="animate-badge-pop pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-lg"
                >
                  New message
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * @param {Object} props
 * @param {import("@/lib/landingContent").ShowcaseMessage} props.message
 */
function ShowcaseBubble({ message }) {
  const isOwn = message.direction === "outgoing";

  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          isOwn
            ? "rounded-br-sm bg-bubble-own text-bubble-own-foreground"
            : "rounded-bl-sm bg-bubble-other text-bubble-other-foreground",
        )}
      >
        {message.text}
      </div>
      <span className="mt-0.5 px-1 text-[11px] text-muted-foreground">{message.time}</span>
    </div>
  );
}

function ShowcaseSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-14" />
        </div>
      </div>
      <div className="flex min-h-[280px] flex-col justify-end gap-3 px-4 py-5">
        {[false, true, false].map((own, i) => (
          <Skeleton key={i} className={cn("h-10 rounded-2xl", own ? "ml-auto w-1/3" : "w-2/5")} />
        ))}
      </div>
    </div>
  );
}
