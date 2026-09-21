"use client";

import { Clock, Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EnrollmentPendingReviewCardProps {
  coordinatorNotes?: string | null;
}

export function EnrollmentPendingReviewCard({ coordinatorNotes }: EnrollmentPendingReviewCardProps) {
  return (
    <Card className="rounded-2xl border-amber-200 bg-amber-50/40 shadow-xs p-5 sm:p-6">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <Clock className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-navy">
                Enrollment Submitted & Queued for Coordinator Review
              </h3>
              <Badge
                variant="outline"
                className="bg-amber-100/70 text-amber-900 border-amber-300 text-[11px] font-bold"
              >
                Pending Review
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your Certificate of Registration and Statement of Account have been submitted. Your coordinator is
              auditing your course load against your curriculum baseline and verifying your tuition assessment balance
              for Grantor endorsement.
            </p>
          </div>
        </div>

        {coordinatorNotes && (
          <div className="mt-3 p-3 bg-white border border-amber-200 rounded-xl text-xs space-y-1">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Info className="size-3.5 text-amber-700" /> Coordinator Note:
            </span>
            <p className="text-amber-900">{coordinatorNotes}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-amber-800 font-medium pt-1">
          <ShieldCheck className="size-3.5 text-amber-600" />
          <span>You will receive an in-app and email notification once your endorsement is completed.</span>
        </div>
      </CardContent>
    </Card>
  );
}
