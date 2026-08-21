import { Skeleton } from "@/components/ui/Skeleton";

export function CTASectionSkeleton() {
  return (
    <section className="px-6 py-20 sm:py-28 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="mt-4 h-5 w-2/3" />
        <Skeleton className="mt-9 h-12 w-44 rounded-lg" />
      </div>
    </section>
  );
}
