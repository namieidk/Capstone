"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BODY_GRID, LINE } from "./profile-styles";

export function CoordinatorProfileSkeleton() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <Skeleton className="h-52 w-full rounded-none sm:h-72" />
      <div className="flex flex-col gap-4 px-5 pb-8 sm:flex-row sm:items-start sm:gap-6 sm:px-10">
        <Skeleton className="-mt-16 size-32 shrink-0 rounded-full border-4 border-white sm:-mt-[4.5rem] sm:size-36" />
        <div className="min-w-0 flex-1 sm:pt-6">
          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="mt-3 h-4 w-40 max-w-full" />
        </div>
      </div>
      <div className={`${BODY_GRID} border-t ${LINE}`}>
        <div className="space-y-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
