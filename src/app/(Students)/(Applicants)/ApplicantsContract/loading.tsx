import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicantsContractLoading() {
  return (
    <div className="min-h-full bg-[#faf8f5]">
      <div className="sticky top-0 z-30 border-b border-line bg-white px-5 py-3.5 md:px-8">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="px-5 pt-5 pb-24 md:px-10">
        <Card className="rounded-[18px]! shadow-va-sm">
          <CardContent className="flex flex-col gap-3 px-6 py-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
