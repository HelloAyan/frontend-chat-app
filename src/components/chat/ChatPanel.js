"use client";

import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { ChatEmptyState } from "./ChatEmptyState";
import { GroupInfoDialog } from "./GroupInfoDialog";
import { cn } from "@/lib/cn";

export function ChatPanel({
  conversation,
  messages,
  currentUserId,
  isLoadingMessages,
  isMessagesError,
  onRetryMessages,
  hasMoreOlderMessages,
  isLoadingOlderMessages,
  onLoadOlderMessages,
  onBack,
  onSendMessage,
  onAddMembers,
  isAddingMembers,
  onRemoveMember,
  onPromoteAdmin,
  onLeaveGroup,
  className,
}) {
  const [isGroupInfoOpen, setGroupInfoOpen] = useState(false);

  if (!conversation) {
    return <ChatEmptyState className={className} />;
  }

  return (
    <div className={cn("flex h-full flex-1 flex-col bg-background", className)}>
      <ChatHeader conversation={conversation} onBack={onBack} onOpenGroupInfo={() => setGroupInfoOpen(true)} />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isGroup={conversation.type === "group"}
        isLoading={isLoadingMessages}
        isError={isMessagesError}
        onRetry={onRetryMessages}
        hasMoreOlder={hasMoreOlderMessages}
        isLoadingOlder={isLoadingOlderMessages}
        onLoadOlder={onLoadOlderMessages}
      />
      <MessageComposer onSend={onSendMessage} />

      {isGroupInfoOpen && conversation.type === "group" && (
        <GroupInfoDialog
          conversation={conversation}
          currentUserId={currentUserId}
          onClose={() => setGroupInfoOpen(false)}
          onAddMembers={onAddMembers}
          isAddingMembers={isAddingMembers}
          onRemoveMember={onRemoveMember}
          onPromoteAdmin={onPromoteAdmin}
          onLeaveGroup={onLeaveGroup}
        />
      )}
    </div>
  );
}
