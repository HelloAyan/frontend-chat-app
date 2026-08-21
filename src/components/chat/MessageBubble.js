import { formatBubbleTime } from "@/lib/formatMessageTime";
import { cn } from "@/lib/cn";

export function MessageBubble({ message, isOwn, showSender, senderName }) {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      {showSender && !isOwn && (
        <span className="mb-0.5 px-1 text-xs font-medium text-muted-foreground">{senderName}</span>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words",
          isOwn
            ? "rounded-br-sm bg-bubble-own text-bubble-own-foreground"
            : "rounded-bl-sm bg-bubble-other text-bubble-other-foreground",
        )}
      >
        {message.text}
      </div>
      <span className="mt-0.5 px-1 text-[11px] text-muted-foreground">{formatBubbleTime(message.createdAt)}</span>
    </div>
  );
}
