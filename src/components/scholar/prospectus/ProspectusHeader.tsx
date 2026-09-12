"use client";

import { BookOpen, Clock, FileUp, History, Lock, Pencil, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 gap-1.5 px-3 py-1 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" /> Baseline Locked & Verified
        </Badge>
      );
    }
    if (baselineStatus === "PENDING_COORDINATOR_REVIEW") {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" /> Under Coordinator Review
        </Badge>
      );
    }
    if (baselineStatus === "PENDING_HISTORICAL_CCG") {
      return (
        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
          <History className="w-3.5 h-3.5" /> Historical CCG Required
        </Badge>
      );
    }
    if (baselineStatus === "PENDING_PROSPECTUS") {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 px-3 py-1 text-xs font-semibold">
          <FileUp className="w-3.5 h-3.5" /> Prospectus Ingestion Pending
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-semibold">
        <Clock className="w-3.5 h-3.5" /> School Selection Required
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-2 border-b border-border">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Academic Prospectus & Curriculum Checklist
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your degree curriculum baseline, verify completed subjects, and maintain retention records.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {getStatusBadge()}

        {!isFrozen && (
          <>
            <Button variant="outline" size="sm" onClick={onUploadProspectus} className="gap-1.5 shadow-sm">
              <FileUp className="w-4 h-4 text-primary" />
              Upload Prospectus
            </Button>

            <Button variant="outline" size="sm" onClick={onUploadHistoricalCcg} className="gap-1.5 shadow-sm">
              <History className="w-4 h-4 text-primary" />
              Upload Historical CCG
            </Button>

            {totalSubjects > 0 && (
              <Button variant="outline" size="sm" onClick={onEditSubjects} className="gap-1.5 shadow-sm">
                <Pencil className="w-4 h-4" />
                Edit Checklist
              </Button>
            )}

            {totalSubjects > 0 && baselineStatus !== "PENDING_COORDINATOR_REVIEW" && (
              <Button
                size="sm"
                onClick={onSubmitForReview}
                disabled={submittingReview}
                className="gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
                {submittingReview ? "Submitting..." : "Submit for Review"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
