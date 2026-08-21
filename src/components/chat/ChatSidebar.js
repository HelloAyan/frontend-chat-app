"use client";

import { useState } from "react";
import { ConversationSearch } from "./ConversationSearch";
import { ConversationList } from "./ConversationList";
import { NewGroupDialog } from "./NewGroupDialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function ChatSidebar({
  conversations,
  activeId,
  currentUserId,
  isLoading,
  isError,
  onRetry,
  isCreatingGroup,
  onSelectConversation,
  onStartConversation,
  onCreateGroup,
  className,
}) {
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);

  return (
    <aside className={cn("flex h-full flex-col border-r border-border bg-card", className)}>
      <div className="border-b border-border p-3">
        <ConversationSearch onStartConversation={onStartConversation} />
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          currentUserId={currentUserId}
          onSelect={onSelectConversation}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
        />
      </div>

      <div className="border-t border-border p-3">
        <Button type="button" variant="secondary" className="w-full" onClick={() => setGroupDialogOpen(true)}>
          + New group
        </Button>
      </div>

      {isGroupDialogOpen && (
        <NewGroupDialog
          isSubmitting={isCreatingGroup}
          onClose={() => setGroupDialogOpen(false)}
          onCreate={async (payload) => {
            const created = await onCreateGroup(payload);
            if (created) setGroupDialogOpen(false);
          }}
        />
      )}
    </aside>
  );
}
