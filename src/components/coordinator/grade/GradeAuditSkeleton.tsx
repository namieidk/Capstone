"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function GradeAuditSkeleton() {
  return (
    <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* Left Column: Document Preview Skeleton */}
      <div className="lg:col-span-6 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <Skeleton className="h-4 w-28 bg-slate-800" />
          <Skeleton className="h-4 w-24 bg-slate-800" />
        </div>
        <div className="flex-1 bg-slate-950 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
          <Skeleton className="h-4 w-48 bg-slate-800" />
          <Skeleton className="h-3 w-64 bg-slate-800" />
        </div>
      </div>

      {/* Right Column: Grade Verification Panel Skeleton */}
      <div className="lg:col-span-6 flex flex-col h-full overflow-hidden p-5 space-y-4 bg-white">
        {/* Metric Strip Skeleton */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Subjects Table Skeleton */}
        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <div className="space-y-2.5 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 w-14 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <Skeleton className="h-9.5 w-36 rounded-xl" />
          <Skeleton className="h-9.5 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
