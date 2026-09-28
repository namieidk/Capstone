import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WizardSkeleton() {
  return (
    <div>
      <div className="sticky top-0 z-20 border-b border-border bg-white px-5 py-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="flex w-full flex-col gap-5 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="relative grid grid-cols-3 rounded-[18px]! border border-border bg-white p-3.5 sm:p-4 shadow-xs">
          {[0, 1, 2].map((i) => (
            <div key={`wizard-step-${i}`} className="flex w-full flex-col items-center gap-1.5">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="hidden h-3 w-28 sm:block" />
            </div>
          ))}
        </div>
        <Card className="rounded-[18px]! border-border bg-white shadow-xs">
          <CardHeader>
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-11 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-40 self-end" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
