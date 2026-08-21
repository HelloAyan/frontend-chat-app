"use client";

import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "@/features/users/api";
import { Avatar } from "@/components/shared/Avatar";

const DEBOUNCE_MS = 300;

export function ConversationSearch({ onStartConversation }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: results = [],
    isFetching,
    isError,
  } = useSearchUsersQuery(debouncedQuery, { skip: !debouncedQuery });

  // the debounce timer hasn't caught up with what's actually typed yet, so
  // `results` still reflects the previous (possibly empty) search term
  const isSearching = isFetching || query.trim() !== debouncedQuery;

  function handleSelect(user) {
    onStartConversation(user);
    setQuery("");
    setDebouncedQuery("");
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
          {isSearching ? (
            <p className="px-2.5 py-2 text-xs text-muted-foreground">Searching...</p>
          ) : isError ? (
            <p className="px-2.5 py-2 text-xs text-destructive">Couldn&rsquo;t search right now</p>
          ) : results.length === 0 ? (
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
