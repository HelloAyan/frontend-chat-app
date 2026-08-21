import { cn } from "@/lib/cn";

export function ChatEmptyState({ className }) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-2 bg-background px-6 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">💬</div>
      <p className="text-sm font-medium text-foreground">Select a conversation</p>
      <p className="max-w-[240px] text-xs text-muted-foreground">
        Pick someone from the list, or search above to start a new chat.
      </p>
    </div>
  );
}
