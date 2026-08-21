import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { ChatEmptyState } from "./ChatEmptyState";
import { cn } from "@/lib/cn";

export function ChatPanel({ conversation, messages, currentUserId, isLoadingMessages, onBack, onSendMessage, className }) {
  if (!conversation) {
    return <ChatEmptyState className={className} />;
  }

  return (
    <div className={cn("flex h-full flex-1 flex-col bg-background", className)}>
      <ChatHeader conversation={conversation} onBack={onBack} />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isGroup={conversation.type === "group"}
        isLoading={isLoadingMessages}
      />
      <MessageComposer onSend={onSendMessage} />
    </div>
  );
}
