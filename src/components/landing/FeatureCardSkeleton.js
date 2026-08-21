import { Skeleton } from "@/components/ui/Skeleton";

export function FeatureCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <Skeleton className="mt-5 h-4 w-2/3" />
      <div className="mt-2 flex-1 space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="mt-4 h-3 w-1/3" />
    </div>
  );
}
