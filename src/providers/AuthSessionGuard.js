"use client";

import { useSessionGuard } from "@/features/auth/hooks";

// no UI of its own, just mounts the effect that kicks the user back to
// /login if their session cookie turns out to be stale. see the comment on
// useSessionGuard for why this can't just live in proxy.js.
export function AuthSessionGuard() {
  useSessionGuard();
  return null;
}
