"use client";

import { CheckCircle, FileCheck2, Loader2, School, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ScholarBaselineState, submitBaselineForReview } from "@/lib/api/baseline";

interface Step4FinalReviewProps {
  data: ScholarBaselineState;
  onSuccess: () => void | Promise<void>;
  onBack: () => void;
}

export function Step4FinalReview({ data, onSuccess, onBack }: Step4FinalReviewProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metrics = data.metrics;
  const prospectus = data.prospectus;
  const subjects = prospectus?.subjects || [];
  const school = data.school_grading_system;

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      setError(null);
      await submitBaselineForReview();
      await onSuccess();
    } catch (err) {
      console.error("Failed to submit baseline for review:", err);
      const msg = err instanceof Error ? err.message : "Failed to submit for review.";
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Final Curriculum Baseline Summary</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review your baseline curriculum details before submitting for coordinator audit and freezing.
        </p>
      </div>

      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-border bg-white shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Subjects</span>
          <p className="text-xl font-black text-navy mt-0.5">{metrics.total_subjects}</p>
          <span className="text-[11px] text-muted-foreground">in degree curriculum</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-border bg-white shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Units</span>
          <p className="text-xl font-black text-navy mt-0.5">{metrics.total_units.toFixed(1)}</p>
          <span className="text-[11px] text-muted-foreground">credit unit requirement</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-good/20 bg-good-bg/30 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-good">Credited Units</span>
          <p className="text-xl font-black text-good mt-0.5">{metrics.credited_units.toFixed(1)}</p>
          <span className="text-[11px] text-good font-semibold">{metrics.credited_subjects} completed courses</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-border bg-white shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Remaining Units</span>
          <p className="text-xl font-black text-amber mt-0.5">{metrics.remaining_units.toFixed(1)}</p>
          <span className="text-[11px] text-muted-foreground">{metrics.untaken_subjects} untaken courses</span>
        </div>
      </div>

      {/* 2. Program & Institution Config Badge */}
      <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl border border-border bg-white gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy text-amber flex items-center justify-center shrink-0 shadow-2xs">
            <School className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-navy">{school?.school_name || "Institution Selected"}</span>
              {school?.is_verified && (
                <Badge className="bg-good-bg text-good border-good/20 text-[10px] py-0 px-1.5 gap-1 font-semibold">
                  <ShieldCheck className="size-3" /> Verified Scale
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Program:{" "}
              <span className="font-semibold text-foreground">{prospectus?.course_name || data.course_of_study}</span> •
              Catalog: <span className="font-semibold text-foreground">{prospectus?.curriculum_year}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Subjects Table Preview */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
        <div className="p-3.5 bg-secondary border-b border-border flex items-center justify-between text-xs font-bold text-navy">
          <span>Curriculum Subject Breakdown ({subjects.length} Subjects)</span>
          <span className="text-[11px] font-normal text-muted-foreground">Categorized by catalog sequence</span>
        </div>

        <div className="max-h-75 overflow-y-auto divide-y divide-border">
          {subjects.map((sub) => {
            const isCredited = sub.status === "CREDITED" || sub.status === "PASSED";
            return (
              <div key={sub.subject_id} className="p-3 flex items-center justify-between hover:bg-secondary/60 text-xs">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`text-[10px] font-bold ${
                      isCredited
                        ? "bg-good-bg text-good border-good/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {isCredited ? "CREDITED" : "UNTAKEN"}
                  </Badge>
                  <div>
                    <span className="font-bold text-navy">{sub.subject_code}</span>
                    <span className="text-muted-foreground ml-2 truncate">{sub.descriptive_title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-muted-foreground">
                    Year {sub.year_level} - {sub.semester}
                  </span>
                  <span className="font-bold text-navy text-xs">{sub.units} Units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Submission Notice */}
      <div className="rounded-2xl border border-good/20 bg-good-bg/30 p-4 flex items-start gap-3 shadow-2xs">
        <FileCheck2 className="size-5 text-good shrink-0 mt-0.5" />
        <div className="text-xs text-foreground/80 space-y-0.5">
          <p className="font-bold text-good">Next Step: Coordinator 1-Time Audit & Freeze</p>
          <p>
            Submitting locks your checklist into review. Your academic coordinator will perform a side-by-side
            verification and freeze your baseline. You will be redirected to your dashboard.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-bad-bg border border-bad/20 text-xs text-bad font-medium">{error}</div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="text-xs sm:text-sm font-semibold rounded-xl h-11 px-5 border-border hover:bg-muted"
        >
          ← Back to Credits
        </Button>

        <Button
          type="button"
          disabled={submitting || subjects.length === 0}
          onClick={handleSubmit}
          className="h-11 px-7 rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01]"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" /> Submitting for Review...
            </>
          ) : (
            <>
              <CheckCircle className="size-4 mr-2 text-amber" /> Submit Baseline for Coordinator Review
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
