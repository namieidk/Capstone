import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/70 bg-background/95 px-5 py-4 backdrop-blur-sm md:px-8">
        <div className="flex min-w-0 flex-col gap-2">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
        <Skeleton className="size-9 shrink-0 rounded-xl" />
      </div>

      <div className="px-5 pb-24 md:px-10">
        <Card className="mt-5 rounded-2xl! border-border/70 shadow-none">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Skeleton className="size-11 shrink-0 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <Skeleton className="h-3.5 w-64 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl border border-border/70 bg-card px-5 py-4">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="mt-2.5 h-3.5 w-full max-w-sm rounded-md" />
            </div>
            <Skeleton className="h-3.5 w-52 rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
