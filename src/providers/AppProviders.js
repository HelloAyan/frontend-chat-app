"use client";

import { StoreProvider } from "./StoreProvider";
import { AuthSessionGuard } from "./AuthSessionGuard";

// redux (with RTK Query baked in) covers both client and server state now,
// so this is just the store provider plus the session guard that depends
// on it being mounted
export function AppProviders({ children }) {
  return (
    <StoreProvider>
      <AuthSessionGuard />
      {children}
    </StoreProvider>
  );
}
