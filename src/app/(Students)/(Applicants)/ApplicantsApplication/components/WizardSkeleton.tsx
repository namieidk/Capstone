import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WizardSkeleton() {
  return (
    <div>
      <div className="sticky top-0 z-20 border-b border-border bg-white px-5 py-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-6">
        <div className="flex items-start rounded-[18px]! border border-border bg-white p-4 shadow-xs">
          {[0, 1, 2].map((i) => (
            <div key={`wizard-step-${i}`} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              {i < 2 && <Skeleton className="mx-1 mt-4 h-0.5 flex-1 rounded-full" />}
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
