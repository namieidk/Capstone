"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function OnboardingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Top Nav Skeleton */}
      <header className="flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-[9px]" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <div className="hidden sm:flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </header>

      {/* Main Skeleton */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Stepper Skeleton */}
        <div className="flex items-center justify-between rounded-[18px]! border border-border bg-white p-4 shadow-xs">
          {[1, 2, 3, 4].map((step, idx) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              {idx < 3 && <Skeleton className="h-1 flex-1 mx-2 rounded-full" />}
            </div>
          ))}
        </div>

        {/* Content Card Skeleton */}
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64 rounded-md" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>

          <div className="space-y-3 pt-2">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
