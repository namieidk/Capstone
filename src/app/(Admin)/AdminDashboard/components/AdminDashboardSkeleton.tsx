"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Header skeleton */}
      <div className="border-b border-line bg-white px-5 py-4 sm:px-8">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="px-5 pb-24 md:px-10 space-y-5 mt-5">
        {/* KPI Row skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-[18px]! border-line bg-white shadow-va-sm p-5 space-y-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
            </Card>
          ))}
        </div>

        {/* Quick Operations skeleton */}
        <Card className="rounded-[18px]! border-line bg-white shadow-va-sm p-6">
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </Card>

        {/* Grid 2-columns skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="rounded-[18px]! border-line bg-white shadow-va-sm p-6">
            <Skeleton className="h-4 w-44 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          </Card>

          <Card className="rounded-[18px]! border-line bg-white shadow-va-sm p-6">
            <Skeleton className="h-4 w-44 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
