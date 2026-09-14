"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CoordinatorProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Skeleton className="h-44 sm:h-52 w-full rounded-2xl" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 px-2 sm:px-4">
        <div className="flex items-end gap-3.5 sm:gap-4">
          <Skeleton className="size-24 sm:size-28 rounded-full border-4 border-white" />
          <div className="space-y-2 pb-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  );
}
