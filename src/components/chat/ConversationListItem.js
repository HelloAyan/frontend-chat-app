import { Avatar } from "@/components/shared/Avatar";
import { formatConversationTime } from "@/lib/formatMessageTime";
import { cn } from "@/lib/cn";

export function ConversationListItem({ conversation, isActive, currentUserId, onClick }) {
  const displayName = conversation.type === "group" ? conversation.name : conversation.participant.name;
  const lastMessage = conversation.lastMessage;
  const isOwnLastMessage = lastMessage?.sender === currentUserId;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-secondary" : "hover:bg-secondary/60",
      )}
    >
      <Avatar name={displayName} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
          {conversation.updatedAt && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatConversationTime(conversation.updatedAt)}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {isOwnLastMessage && "You: "}
          {lastMessage?.text || "No messages yet"}
        </p>
      </div>
    </button>
  );
}
