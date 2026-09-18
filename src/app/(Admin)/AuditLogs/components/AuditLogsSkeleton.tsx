import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

export function AuditLogsSkeleton() {
  return (
    <div className="min-h-full bg-[#faf8f5]">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3.5 md:px-8">
        <div className="flex min-w-0 flex-col gap-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Skeleton className="hidden h-10 w-55 rounded-full md:block" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
      <div className="px-5 pb-24 md:px-10">
        <Card className="mt-5 rounded-[18px]! shadow-va-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap items-center gap-2.5">
                <Skeleton className="h-11 w-full sm:w-44" />
                <Skeleton className="h-11 w-full sm:w-36" />
                <Skeleton className="h-11 w-32 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0!">
            <div className="divide-y divide-line px-6 py-2">
              {SKELETON_ROWS.map((key) => (
                <div key={key} className="flex items-center gap-4 py-4">
                  <Skeleton className="h-3.5 w-10 shrink-0" />
                  <Skeleton className="h-6 w-28 shrink-0 rounded-full" />
                  <Skeleton className="h-3.5 w-40 shrink-0" />
                  <Skeleton className="h-3.5 w-32 shrink-0" />
                  <Skeleton className="ml-auto size-9 shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
