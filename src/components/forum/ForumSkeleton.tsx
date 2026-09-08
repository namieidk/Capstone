"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ForumSkeleton() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Main Feed Column */}
          <div className="space-y-4 lg:col-span-8">
            {/* Composer Skeleton */}
            <Card className="rounded-2xl border-border/60 bg-white/80 backdrop-blur-xs p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <Skeleton className="h-10 flex-1 rounded-full" />
              </div>
            </Card>

            {/* Filter / Search Info Skeleton */}
            <div className="flex items-center justify-between px-1 py-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>

            {/* Post Card Skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton preview items
                key={i}
                className="rounded-2xl border-border/60 bg-white p-5 shadow-xs space-y-4"
              >
                <CardHeader className="p-0 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <Skeleton className="h-3 w-24 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                </CardContent>
                <CardFooter className="p-0 pt-2 flex items-center justify-between border-t border-border/40">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Right Sidebar Column */}
          <div className="hidden lg:col-span-4 lg:block sticky top-6">
            <Card className="rounded-2xl border-border/60 bg-white p-6 shadow-xs space-y-6">
              <div className="space-y-1">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-3.5 w-48 rounded-md" />
              </div>

              {/* Author Spotlight Skeleton */}
              <div className="flex flex-col items-center space-y-3 py-2">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 gap-3 border-y border-border/50 py-4">
                <div className="flex flex-col items-center space-y-1">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-3 w-10 rounded-md" />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              </div>

              {/* Other Discussions Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded-md" />
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton preview items
                    key={idx}
                    className="flex items-center gap-3 p-2"
                  >
                    <Skeleton className="size-7 rounded-full shrink-0" />
                    <Skeleton className="h-4 flex-1 rounded-md" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
