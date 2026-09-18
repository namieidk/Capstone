"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function EnrollmentAuditSkeleton() {
  return (
    <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* Left: Document Viewer Skeleton */}
      <div className="lg:col-span-6 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
        <div className="bg-slate-800/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-36 rounded-lg bg-slate-700" />
            <Skeleton className="h-7 w-36 rounded-lg bg-slate-700" />
          </div>
          <Skeleton className="h-4 w-24 rounded bg-slate-700" />
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-3 bg-slate-950">
          <Skeleton className="h-3/4 w-4/5 rounded-xl bg-slate-900/80" />
          <Skeleton className="h-4 w-48 rounded bg-slate-800" />
        </div>
      </div>

      {/* Right: Audit Panel Skeleton */}
      <div className="lg:col-span-6 flex flex-col h-full p-5 space-y-4 bg-white overflow-hidden">
        {/* Metric Strip Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>

        {/* Advisory Flag Skeleton */}
        <Skeleton className="h-12 w-full rounded-xl" />

        {/* Subjects Table Skeleton */}
        <div className="flex-1 min-h-0 flex flex-col space-y-2">
          <Skeleton className="h-4 w-52 rounded" />
          <div className="flex-1 rounded-xl border border-slate-200 p-3 space-y-3">
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </div>

        {/* Bottom Actions Skeleton */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
