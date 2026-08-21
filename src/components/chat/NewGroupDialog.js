"use client";

import { useState } from "react";
import { MemberPicker } from "./MemberPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// a group needs the creator plus at least 2 others to actually be a group
// (the API treats 3+ members as "group", 2 as "direct", see docs/openapi.yaml)
const MIN_OTHER_MEMBERS = 2;

export function NewGroupDialog({ onClose, onCreate, isSubmitting }) {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

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

        <div className="mt-3">
          <MemberPicker selectedUsers={selectedUsers} onChange={setSelectedUsers} placeholder="Search name or phone to add" />
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
