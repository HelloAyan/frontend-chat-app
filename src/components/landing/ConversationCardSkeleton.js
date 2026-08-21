import { Skeleton } from "@/components/ui/Skeleton";

export function ConversationCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      <div className="mt-5 flex-1 space-y-2.5 rounded-xl bg-secondary/50 p-4">
        <Skeleton className="h-9 w-2/3 rounded-2xl" />
        <Skeleton className="ml-auto h-9 w-1/2 rounded-2xl" />
      </div>
    </div>
  );
}
