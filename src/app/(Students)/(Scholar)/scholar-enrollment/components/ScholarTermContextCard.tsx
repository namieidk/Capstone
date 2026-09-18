"use client";

import { AlertTriangle, Clock, FileCheck2, RefreshCw, Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CurrentEnrollmentState } from "@/lib/api/enrollment";

interface ScholarTermContextCardProps {
  enrollmentState: CurrentEnrollmentState;
  loading: boolean;
  onRefresh: () => void;
}

export function ScholarTermContextCard({ enrollmentState, loading, onRefresh }: ScholarTermContextCardProps) {
  const status = enrollmentState?.enrollment?.status || "NOT_SUBMITTED";

  const renderStatusBadge = () => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold gap-1">
            <FileCheck2 className="size-3.5 text-emerald-600" />
            Approved & Endorsed
          </Badge>
        );
      case "PENDING_REVIEW":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-300 font-semibold gap-1">
            <Clock className="size-3.5 text-amber-600 animate-pulse" />
            Pending Coordinator Review
          </Badge>
        );
      case "CHANGES_REQUESTED":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-900 border-orange-300 font-semibold gap-1">
            <AlertTriangle className="size-3.5 text-orange-600" />
            Changes Requested
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-300 font-semibold gap-1">
            <Sparkles className="size-3.5 text-blue-600" />
            Draft Saved
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-semibold">
            Not Submitted
          </Badge>
        );
    }
  };

  const enrollment = enrollmentState?.enrollment;
  const yearLevel = enrollment?.year_level || enrollmentState?.scholar?.current_year_level || 1;
  const academicYear = enrollment?.academic_year;
  const semester = enrollment?.semester;

  let termSubtitle = `Year ${yearLevel} Scholar • Ready for Term Enrollment`;
  if (academicYear && semester) {
    termSubtitle = `Academic Year ${academicYear} • ${semester} • Year ${yearLevel}`;
  } else if (academicYear) {
    termSubtitle = `Academic Year ${academicYear} • Year ${yearLevel}`;
  } else if (semester) {
    termSubtitle = `${semester} • Year ${yearLevel}`;
  }

  return (
    <Card className="shadow-xs border-border/80">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="size-5 text-emerald-700" />
              {enrollmentState.scholar.first_name} {enrollmentState.scholar.last_name}
            </h2>
            {renderStatusBadge()}
          </div>
          <p className="text-xs text-muted-foreground">
            {enrollmentState.scholar.school_name || "Enrolled University"} •{" "}
            {enrollmentState.scholar.course_of_study || "Degree Program"}
          </p>
          <p className="text-xs font-semibold text-emerald-800">{termSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
