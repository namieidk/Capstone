import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div className="min-h-full bg-[#faf8f5]">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3.5 md:px-8">
        <div className="flex min-w-0 flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="size-9 shrink-0 rounded-full" />
      </div>
      <div className="px-5 pb-24 md:px-10">
        <Card className="mt-5 rounded-[18px]! shadow-va-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
