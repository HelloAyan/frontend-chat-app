"use client";

import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "@/features/users/api";
import { Avatar } from "@/components/shared/Avatar";

const DEBOUNCE_MS = 300;

// debounced user search with a chip-style multi-select, used anywhere a set
// of real people needs to be picked (new group, adding members to one)
export function MemberPicker({ selectedUsers, onChange, excludeIds = [], placeholder = "Search name or phone" }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isFetching } = useSearchUsersQuery(debouncedQuery, { skip: !debouncedQuery });
  const isSearching = isFetching || query.trim() !== debouncedQuery;

  const excluded = new Set([...excludeIds, ...selectedUsers.map((user) => user._id)]);
  const visibleResults = results.filter((user) => !excluded.has(user._id));

  function toggleUser(user) {
    const alreadySelected = selectedUsers.some((u) => u._id === user._id);
    onChange(alreadySelected ? selectedUsers.filter((u) => u._id !== user._id) : [...selectedUsers, user]);
    setQuery("");
    setDebouncedQuery("");
  }

  return (
    <div>
      {selectedUsers.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedUsers.map((user) => (
            <button
              key={user._id}
              type="button"
              onClick={() => toggleUser(user)}
              className="flex items-center gap-1.5 rounded-full bg-secondary py-1 pl-1 pr-2.5 text-xs text-secondary-foreground hover:bg-secondary/70"
            >
              <Avatar name={user.name} size="sm" className="h-5 w-5 text-[10px]" />
              {user.name}
              <span aria-hidden="true">&times;</span>
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border">
        {!query.trim() ? (
          <p className="px-3 py-2.5 text-xs text-muted-foreground">Search to add people</p>
        ) : isSearching ? (
          <p className="px-3 py-2.5 text-xs text-muted-foreground">Searching...</p>
        ) : visibleResults.length === 0 ? (
          <p className="px-3 py-2.5 text-xs text-muted-foreground">No one found</p>
        ) : (
          visibleResults.map((user) => (
            <button
              key={user._id}
              type="button"
              onClick={() => toggleUser(user)}
              className="flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-left last:border-b-0 hover:bg-secondary"
            >
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.phone}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
