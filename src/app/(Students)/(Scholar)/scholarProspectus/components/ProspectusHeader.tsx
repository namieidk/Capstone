"use client";

import { CheckCircle2, Clock, FileUp, History, Lock, Pencil, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProspectusHeaderProps {
  baselineStatus: string;
  isFrozen: boolean;
  totalSubjects: number;
  onUploadProspectus: () => void;
  onUploadHistoricalCcg: () => void;
  onEditSubjects: () => void;
  onSubmitForReview: () => void;
  submittingReview: boolean;
}

export function ProspectusHeader({
  baselineStatus,
  isFrozen,
  totalSubjects,
  onUploadProspectus,
  onUploadHistoricalCcg,
  onEditSubjects,
  onSubmitForReview,
  submittingReview,
}: ProspectusHeaderProps) {
  const getStatusBadge = () => {
    if (isFrozen || baselineStatus === "BASELINE_FROZEN") {
      return (
        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 gap-1.5 px-3 py-1 text-xs font-semibold">
          <Lock className="size-3.5 text-emerald-700" /> Baseline Locked & Verified
        </Badge>
      );
    }
    if (baselineStatus === "PENDING_COORDINATOR_REVIEW") {
      return (
        <Badge className="bg-amber-50 text-amber-900 border-amber-300 gap-1.5 px-3 py-1 text-xs font-semibold">
          <Clock className="size-3.5 text-amber-700" /> Under Coordinator Review
        </Badge>
      );
    }
    if (baselineStatus === "PENDING_HISTORICAL_CCG") {
      return (
        <Badge className="bg-blue-50 text-blue-800 border-blue-300 gap-1.5 px-3 py-1 text-xs font-semibold">
          <History className="size-3.5 text-blue-700" /> Historical CCG Required
        </Badge>
      );
    }
    if (baselineStatus === "PENDING_PROSPECTUS") {
      return (
        <Badge className="bg-amber-50 text-amber-900 border-amber-300 gap-1.5 px-3 py-1 text-xs font-semibold">
          <FileUp className="size-3.5 text-amber-700" /> Prospectus Ingestion Pending
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-line text-muted-foreground gap-1.5 px-3 py-1 text-xs font-semibold">
        <Clock className="size-3.5" /> School Selection Required
      </Badge>
    );
  };

  return (
    <Card className="rounded-xl border border-line bg-white shadow-2xs">
      <CardContent className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tint text-navy">
            <CheckCircle2 className="size-4 text-navy" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-navy">Curriculum Status:</span>
              {getStatusBadge()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
              Verify your completed courses and submit your curriculum baseline for coordinator approval.
            </p>
          </div>
        </div>

        {!isFrozen && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onUploadProspectus}
              className="h-8 gap-1.5 rounded-lg border-line text-xs font-medium text-navy hover:bg-tint"
            >
              <FileUp className="size-3.5 text-navy" />
              Upload Prospectus
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onUploadHistoricalCcg}
              className="h-8 gap-1.5 rounded-lg border-line text-xs font-medium text-navy hover:bg-tint"
            >
              <History className="size-3.5 text-navy" />
              Upload Past CCG
            </Button>

            {totalSubjects > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onEditSubjects}
                className="h-8 gap-1.5 rounded-lg border-line text-xs font-medium text-navy hover:bg-tint"
              >
                <Pencil className="size-3.5 text-navy" />
                Edit
              </Button>
            )}

            {totalSubjects > 0 && baselineStatus !== "PENDING_COORDINATOR_REVIEW" && (
              <Button
                type="button"
                size="sm"
                onClick={onSubmitForReview}
                disabled={submittingReview}
                className="h-8 gap-1.5 rounded-lg bg-navy px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
              >
                <Send className="size-3.5 text-white" />
                {submittingReview ? "Submitting..." : "Submit for Review"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
