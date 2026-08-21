import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

export function ChatPreviewSkeleton() {
  return (
    <section className="px-6 py-20 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="mt-5 h-9 w-3/4" />
          <Skeleton className="mt-4 h-5 w-2/3" />
        </div>

        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex h-[560px] flex-col sm:flex-row">
            <div className="hidden shrink-0 space-y-4 border-r border-border p-4 sm:block sm:w-64">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col justify-end gap-3 p-4">
              {[false, true, false, true].map((own, i) => (
                <Skeleton key={i} className={cn("h-10 rounded-2xl", own ? "ml-auto w-1/3" : "w-2/5")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
