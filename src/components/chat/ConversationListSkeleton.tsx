"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ConversationListSkeleton() {
  return (
    <div className="space-y-1 p-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton placeholder keys
          key={`convo-skel-${i}`}
          className="flex items-start gap-3 rounded-xl border border-transparent p-3"
        >
          {/* Avatar Skeleton */}
          <Skeleton className="size-10 shrink-0 rounded-full bg-muted/60" />

          {/* Text lines */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded bg-muted/70" />
              <Skeleton className="h-2.5 w-10 rounded bg-muted/50" />
            </div>
            <Skeleton className="h-3 w-36 rounded bg-muted/50" />
            <div className="flex items-center gap-1.5 pt-0.5">
              <Skeleton className="h-3.5 w-14 rounded-sm bg-muted/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
