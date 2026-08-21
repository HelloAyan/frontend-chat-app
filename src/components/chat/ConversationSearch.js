"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/shared/Avatar";

// filters the given user list client-side for now; once the API layer is
// wired in this becomes a debounced call to GET /users/search?q=
export function ConversationSearch({ users, onStartConversation }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return users.filter((user) => user.name.toLowerCase().includes(q) || user.phone.includes(q));
  }, [query, users]);

  function handleSelect(user) {
    onStartConversation(user);
    setQuery("");
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search name or phone"
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {query.trim() && (
        <div className="absolute inset-x-0 top-full z-10 mt-1.5 max-h-64 overflow-y-auto rounded-lg border border-border bg-card p-1.5 shadow-lg">
          {results.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-muted-foreground">No one found</p>
          ) : (
            results.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleSelect(user)}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-secondary"
              >
                <Avatar name={user.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.phone}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
