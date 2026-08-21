"use client";

import { useState } from "react";
import { MemberPicker } from "./MemberPicker";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/Button";

export function GroupInfoDialog({
  conversation,
  currentUserId,
  onClose,
  onAddMembers,
  isAddingMembers,
  onRemoveMember,
  onPromoteAdmin,
  onLeaveGroup,
}) {
  const isAdmin = conversation.admins.includes(currentUserId);
  const memberIds = conversation.participants.map((member) => member._id);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [promotingId, setPromotingId] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  async function handleAdd() {
    if (selectedUsers.length === 0) return;
    const added = await onAddMembers(selectedUsers.map((user) => user._id));
    if (added) {
      setSelectedUsers([]);
      setIsAdding(false);
    }
  }

  async function handleRemove(userId) {
    setRemovingId(userId);
    await onRemoveMember(userId);
    setRemovingId(null);
  }

  async function handlePromote(userId) {
    setPromotingId(userId);
    await onPromoteAdmin(userId);
    setPromotingId(null);
  }

  async function handleLeave() {
    if (!window.confirm("Leave this group? You won't be able to see its messages anymore.")) return;
    setIsLeaving(true);
    await onLeaveGroup();
    // no need to reset isLeaving on success: the dialog unmounts along with
    // the rest of the panel once the active conversation is cleared
    setIsLeaving(false);
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
          {conversation.participants.map((member) => {
            const isSelf = member._id === currentUserId;
            const memberIsAdmin = conversation.admins.includes(member._id);
            const canManage = isAdmin && !isSelf;

            return (
              <div key={member._id} className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0">
                <Avatar name={member.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{isSelf ? `${member.name} (you)` : member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.phone}</p>
                </div>
                {memberIsAdmin && (
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                    Admin
                  </span>
                )}
                {canManage && !memberIsAdmin && (
                  <button
                    type="button"
                    onClick={() => handlePromote(member._id)}
                    disabled={promotingId === member._id}
                    aria-label={`Make ${member.name} admin`}
                    title="Make admin"
                    className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
                  >
                    {promotingId === member._id ? (
                      <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <PromoteIcon />
                    )}
                  </button>
                )}
                {canManage && (
                  <button
                    type="button"
                    onClick={() => handleRemove(member._id)}
                    disabled={removingId === member._id}
                    aria-label={`Remove ${member.name}`}
                    title="Remove"
                    className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-destructive disabled:opacity-50"
                  >
                    {removingId === member._id ? (
                      <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <RemoveIcon />
                    )}
                  </button>
                )}
              </div>
            );
          })}
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

        <div className="mt-4 border-t border-border pt-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={handleLeave}
            disabled={isLeaving}
            loading={isLeaving}
          >
            Leave group
          </Button>
        </div>
      </div>
    </div>
  );
}

function PromoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
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
