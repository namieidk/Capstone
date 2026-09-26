"use client";

import { Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CurrentEnrollmentState } from "@/lib/api/enrollment";

interface EnrollmentPendingReviewCardProps {
  enrollmentState?: CurrentEnrollmentState | null;
  totalAssessment?: number;
  subjectsCount?: number;
  totalUnits?: number;
  coordinatorNotes?: string | null;
}

export function EnrollmentPendingReviewCard({
  enrollmentState,
  totalAssessment,
  coordinatorNotes,
}: EnrollmentPendingReviewCardProps) {
  const enrollment = enrollmentState?.enrollment;

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const displayAssessment = totalAssessment ?? (enrollment?.total_assessment ? Number(enrollment.total_assessment) : 0);
  const notes = coordinatorNotes || enrollment?.coordinator_notes;

  return (
    <Card className="shadow-xs border-amber-200/80 bg-amber-50/30">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Clock className="size-5 sm:size-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-navy">Enrollment Submitted & Under Review</h3>
                <Badge
                  variant="outline"
                  className="bg-amber-100/80 text-amber-900 border-amber-300 text-xs font-bold gap-1 py-0.5"
                >
                  <Clock className="size-3 text-amber-700" />
                  Pending Coordinator Review
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your Certificate of Registration and Statement of Account have been submitted for review and tuition
                endorsement.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border border-amber-100 sm:border-0">
            <span className="text-[11px] font-semibold text-muted-foreground">Submitted Assessment</span>
            <span className="text-base sm:text-lg font-bold text-amber-950 font-mono">
              {formatCurrency(displayAssessment)}
            </span>
          </div>
        </div>

        {/* Status Callout & Reassurance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-100/80">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <Info className="size-4 text-amber-700 shrink-0" />
            <span>Your coordinator is reviewing your courses and fees. You will be notified once endorsed.</span>
          </div>

          <Badge
            variant="outline"
            className="text-xs text-amber-900 border-amber-300 bg-white font-medium self-start sm:self-auto"
          >
            No Action Required
          </Badge>
        </div>

        {/* Coordinator remarks if any */}
        {notes && (
          <div className="p-3 bg-white border border-amber-200/80 rounded-xl text-xs space-y-1">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Info className="size-3.5 text-amber-700" /> Coordinator Note:
            </span>
            <p className="text-amber-900 leading-relaxed">{notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
