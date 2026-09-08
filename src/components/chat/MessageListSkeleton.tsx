"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MessageListSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#FAF9F7]/50">
      {/* 1. Incoming bubble */}
      <div className="flex flex-col items-start space-y-1">
        <Skeleton className="h-12 w-[65%] max-w-sm rounded-2xl rounded-tl-xs bg-muted/60" />
        <Skeleton className="h-2.5 w-12 rounded bg-muted/40 ml-1" />
      </div>

      {/* 2. Outgoing bubble */}
      <div className="flex flex-col items-end space-y-1 ml-auto">
        <Skeleton className="h-16 w-[70%] max-w-md rounded-2xl rounded-tr-xs bg-muted/50" />
        <Skeleton className="h-2.5 w-14 rounded bg-muted/40 mr-1" />
      </div>

      {/* 3. Incoming bubble */}
      <div className="flex flex-col items-start space-y-1">
        <Skeleton className="h-10 w-[45%] max-w-xs rounded-2xl rounded-tl-xs bg-muted/60" />
        <Skeleton className="h-2.5 w-12 rounded bg-muted/40 ml-1" />
      </div>

      {/* 4. Outgoing bubble */}
      <div className="flex flex-col items-end space-y-1 ml-auto">
        <Skeleton className="h-14 w-[55%] max-w-sm rounded-2xl rounded-tr-xs bg-muted/50" />
        <Skeleton className="h-2.5 w-14 rounded bg-muted/40 mr-1" />
      </div>

      {/* 5. Incoming bubble */}
      <div className="flex flex-col items-start space-y-1">
        <Skeleton className="h-11 w-[50%] max-w-xs rounded-2xl rounded-tl-xs bg-muted/60" />
        <Skeleton className="h-2.5 w-12 rounded bg-muted/40 ml-1" />
      </div>
    </div>
  );
}
