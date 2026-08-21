"use client";

import { useState } from "react";
import { useCurrentUser, useLogout } from "@/features/auth/hooks";
import { Avatar } from "@/components/shared/Avatar";

export function ChatTopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const userName = user?.name ?? "";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <span className="text-sm font-semibold text-foreground">Threadly</span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary"
        >
          <span className="hidden text-sm text-foreground sm:inline">{userName}</span>
          <Avatar name={userName} size="sm" />
        </button>

        {menuOpen && (
          <>
            {/* covers the rest of the page so a click anywhere else closes the menu */}
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1.5 w-40 rounded-lg border border-border bg-card p-1 shadow-lg">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
              >
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
