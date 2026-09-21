"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CoordinatorDashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 max-w-7xl w-full mx-auto animate-pulse">
      {/* 1. Header Skeleton */}
      <Card className="rounded-2xl border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-13 sm:size-14 rounded-2xl bg-muted/80" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-56 bg-muted/80" />
                <Skeleton className="h-5 w-28 rounded-full bg-muted/70" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-40 bg-muted/60" />
                <Skeleton className="h-4 w-32 bg-muted/60" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 self-end sm:self-center">
            <Skeleton className="h-9 w-32 rounded-full bg-muted/70" />
            <Skeleton className="size-9 rounded-full bg-muted/70" />
          </div>
        </div>
      </Card>

      {/* 2. Urgent Actions Banner Skeleton */}
      <Card className="rounded-2xl border-line/70 bg-muted/30 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-xl bg-muted/80" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-52 bg-muted/80" />
              <Skeleton className="h-3 w-96 bg-muted/60" />
            </div>
          </div>
          <Skeleton className="h-8 w-32 rounded-full bg-muted/70 hidden sm:block" />
        </div>
      </Card>

      {/* 3. 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-2xl border-line/80 bg-white p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 bg-muted/70" />
              <Skeleton className="size-8 rounded-xl bg-muted/80" />
            </div>
            <Skeleton className="h-8 w-24 bg-muted/80" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-24 rounded-full bg-muted/70" />
              <Skeleton className="h-3.5 w-16 bg-muted/60" />
            </div>
          </Card>
        ))}
      </div>

      {/* 4. Row 1 (2 cols): Applicants Funnel + Scholar Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-line/80 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-line/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8.5 rounded-xl bg-muted/80" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36 bg-muted/80" />
                <Skeleton className="h-3 w-48 bg-muted/60" />
              </div>
            </div>
            <Skeleton className="h-7 w-20 rounded-md bg-muted/70" />
          </div>
          <Skeleton className="h-20 w-full rounded-xl bg-muted/50" />
          <div className="space-y-2">
            <Skeleton className="h-12 rounded-xl bg-muted/60" />
            <Skeleton className="h-12 rounded-xl bg-muted/60" />
          </div>
        </Card>

        <Card className="rounded-2xl border-line/80 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-line/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8.5 rounded-xl bg-muted/80" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36 bg-muted/80" />
                <Skeleton className="h-3 w-48 bg-muted/60" />
              </div>
            </div>
            <Skeleton className="h-7 w-20 rounded-md bg-muted/70" />
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl bg-muted/60" />
            ))}
          </div>
        </Card>
      </div>

      {/* 5. Row 2 (2 cols): Enrollment Queue + Disbursements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-line/80 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-line/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8.5 rounded-xl bg-muted/80" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36 bg-muted/80" />
                <Skeleton className="h-3 w-48 bg-muted/60" />
              </div>
            </div>
            <Skeleton className="h-7 w-24 rounded-md bg-muted/70" />
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl bg-muted/60" />
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-line/80 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-line/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8.5 rounded-xl bg-muted/80" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36 bg-muted/80" />
                <Skeleton className="h-3 w-48 bg-muted/60" />
              </div>
            </div>
            <Skeleton className="h-7 w-24 rounded-md bg-muted/70" />
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl bg-muted/60" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
