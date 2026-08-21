import { ConversationListItem } from "./ConversationListItem";
import { Skeleton } from "@/components/ui/Skeleton";

export function ConversationList({ conversations, activeId, currentUserId, onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-3 py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center">
        <p className="text-sm font-medium text-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground">Search for someone above to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation._id}
          conversation={conversation}
          isActive={conversation._id === activeId}
          currentUserId={currentUserId}
          onClick={() => onSelect(conversation._id)}
        />
      ))}
    </div>
  );
}
