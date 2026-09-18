"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CcgCardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="space-y-2">
          <Skeleton className="h-4.5 w-64 rounded-md" />
          <Skeleton className="h-3 w-80 rounded-md" />
        </div>
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="size-14 rounded-2xl" />
        <div className="space-y-2 text-center flex flex-col items-center">
          <Skeleton className="h-4 w-52 rounded-md" />
          <Skeleton className="h-3 w-72 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl mt-2" />
      </div>
    </div>
  );
}
