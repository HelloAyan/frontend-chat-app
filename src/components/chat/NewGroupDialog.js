"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

// a group needs the creator plus at least 2 others to actually be a group
// (the API treats 3+ members as "group", 2 as "direct") — see docs/openapi.yaml
const MIN_OTHER_MEMBERS = 2;

export function NewGroupDialog({ users, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  function toggleUser(userId) {
    setSelectedIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  }

  const canCreate = name.trim() && selectedIds.length >= MIN_OTHER_MEMBERS;

  function handleCreate() {
    if (!canCreate) return;
    onCreate({ name: name.trim(), participantIds: selectedIds });
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

        <div className="mt-4 max-h-56 overflow-y-auto rounded-lg border border-border">
          {users.map((user) => {
            const checked = selectedIds.includes(user._id);
            return (
              <label
                key={user._id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0",
                  checked && "bg-secondary",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleUser(user._id)}
                  className="h-4 w-4 accent-primary"
                />
                <Avatar name={user.name} size="sm" />
                <span className="text-sm text-foreground">{user.name}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreate} disabled={!canCreate}>
            Create group
          </Button>
        </div>
      </div>
    </div>
  );
}
