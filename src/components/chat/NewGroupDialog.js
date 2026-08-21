"use client";

import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "@/features/users/api";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

// a group needs the creator plus at least 2 others to actually be a group
// (the API treats 3+ members as "group", 2 as "direct", see docs/openapi.yaml)
const MIN_OTHER_MEMBERS = 2;
const DEBOUNCE_MS = 300;

export function NewGroupDialog({ onClose, onCreate, isSubmitting }) {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isFetching } = useSearchUsersQuery(debouncedQuery, { skip: !debouncedQuery });
  const isSearching = isFetching || query.trim() !== debouncedQuery;

  const selectedIds = new Set(selectedUsers.map((user) => user._id));
  const visibleResults = results.filter((user) => !selectedIds.has(user._id));

  function toggleUser(user) {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user],
    );
    setQuery("");
    setDebouncedQuery("");
  }

  const canCreate = name.trim() && selectedUsers.length >= MIN_OTHER_MEMBERS;

  function handleCreate() {
    if (!canCreate) return;
    onCreate({ name: name.trim(), participantIds: selectedUsers.map((user) => user._id) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-base font-semibold text-foreground">New group</h2>
        <p className="mt-1 text-xs text-muted-foreground">Pick at least 2 people to start a group.</p>

        <Input
          id="group-name"
          className="mt-4"
          placeholder="Group name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        {selectedUsers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
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
          placeholder="Search name or phone to add"
          className="mt-3 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border">
          {!query.trim() ? (
            <p className="px-3 py-2.5 text-xs text-muted-foreground">Search to add members</p>
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
                className={cn(
                  "flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-left last:border-b-0",
                  "hover:bg-secondary",
                )}
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

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreate} disabled={!canCreate || isSubmitting} loading={isSubmitting}>
            Create group
          </Button>
        </div>
      </div>
    </div>
  );
}
