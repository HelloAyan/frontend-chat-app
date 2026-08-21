"use client";

import { useState } from "react";
import { MemberPicker } from "./MemberPicker";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/Button";

export function GroupInfoDialog({ conversation, currentUserId, onClose, onAddMembers, isAddingMembers }) {
  const isAdmin = conversation.admins.includes(currentUserId);
  const memberIds = conversation.participants.map((member) => member._id);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  async function handleAdd() {
    if (selectedUsers.length === 0) return;
    const added = await onAddMembers(selectedUsers.map((user) => user._id));
    if (added) {
      setSelectedUsers([]);
      setIsAdding(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">{conversation.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{conversation.participants.length} members</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-secondary"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-border">
          {conversation.participants.map((member) => (
            <div key={member._id} className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0">
              <Avatar name={member.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {member._id === currentUserId ? `${member.name} (you)` : member.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">{member.phone}</p>
              </div>
              {conversation.admins.includes(member._id) && (
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-4">
            {!isAdding ? (
              <Button type="button" variant="secondary" className="w-full" onClick={() => setIsAdding(true)}>
                + Add members
              </Button>
            ) : (
              <>
                <MemberPicker
                  selectedUsers={selectedUsers}
                  onChange={setSelectedUsers}
                  excludeIds={memberIds}
                  placeholder="Search name or phone to add"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsAdding(false);
                      setSelectedUsers([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAdd}
                    disabled={selectedUsers.length === 0 || isAddingMembers}
                    loading={isAddingMembers}
                  >
                    Add{selectedUsers.length > 0 ? ` ${selectedUsers.length}` : ""}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
