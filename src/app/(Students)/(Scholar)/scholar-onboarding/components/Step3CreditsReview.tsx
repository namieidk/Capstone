"use client";

import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Sparkles, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ProspectusSubject, type ScholarProspectus, uploadHistoricalCcg } from "@/lib/api/baseline";

interface Step3CreditsReviewProps {
  prospectus?: ScholarProspectus | null;
  currentYearLevel?: number | null;
  onSuccess: () => void;
  onBack: () => void;
}

export function Step3CreditsReview({ prospectus, currentYearLevel = 1, onSuccess, onBack }: Step3CreditsReviewProps) {
  const [showOptionalTorUpload, setShowOptionalTorUpload] = useState(false);
  const [torFiles, setTorFiles] = useState<File[]>([]);
  const [torUploading, setTorUploading] = useState(false);
  const [torError, setTorError] = useState<string | null>(null);

  const subjects = prospectus?.subjects || [];
  const creditedSubjects = subjects.filter((s) => s.status === "CREDITED" || s.status === "PASSED");
  const creditedUnits = creditedSubjects.reduce((acc, s) => acc + (Number(s.units) || 0), 0);

  const hasAutoCredits = creditedSubjects.length > 0;
  const isFreshman = (currentYearLevel || 1) === 1 && !hasAutoCredits;

  const handleTorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTorFiles(Array.from(e.target.files));
      setTorError(null);
    }
  };

  const handleUploadTor = async () => {
    if (torFiles.length === 0) {
      setTorError("Please select at least one transcript file.");
      return;
    }

    try {
      setTorUploading(true);
      setTorError(null);
      const formData = new FormData();
      for (const f of torFiles) {
        formData.append("files", f);
      }

      await uploadHistoricalCcg(formData);
      onSuccess();
    } catch (err) {
      console.error("Historical transcript upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to process transcript.";
      setTorError(msg);
    } finally {
      setTorUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Review Completed Courses & Credits</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verify previous academic courses credited toward your degree before freezing your baseline.
        </p>
      </div>

      {/* Case 1: Grades were automatically detected on the prospectus */}
      {hasAutoCredits ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-good/20 bg-good-bg/30 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-xl bg-good text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-good">
                  {creditedSubjects.length} Completed Subjects Recognized ({creditedUnits.toFixed(1)} Units)
                </h3>
                <p className="text-xs text-foreground/80">
                  Your grades were automatically extracted from your uploaded evaluation checklist. These courses will
                  be marked as credited.
                </p>
              </div>
            </div>
          </div>

          {/* Credited Subject List Card */}
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
            <div className="p-3.5 bg-secondary border-b border-border flex items-center justify-between text-xs font-bold text-navy">
              <span>Recognized Completed Courses</span>
              <span className="text-[11px] font-semibold text-muted-foreground">{creditedSubjects.length} Courses</span>
            </div>

            <div className="max-h-70 overflow-y-auto divide-y divide-border">
              {creditedSubjects.map((sub: ProspectusSubject) => (
                <div
                  key={sub.subject_id}
                  className="p-3 flex items-center justify-between hover:bg-secondary/60 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Badge className="bg-good-bg text-good border-good/20 text-[10px] font-bold">
                      {sub.grade !== undefined && sub.grade !== null ? `Grade: ${sub.grade}` : "CREDITED"}
                    </Badge>
                    <div>
                      <span className="font-bold text-navy">{sub.subject_code}</span>
                      <span className="text-muted-foreground ml-2 truncate">{sub.descriptive_title}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-muted-foreground text-[11px]">{sub.units} Units</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional secondary TOR accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptionalTorUpload(!showOptionalTorUpload)}
              className="text-xs text-muted-foreground hover:text-navy font-semibold flex items-center gap-1 cursor-pointer"
            >
              {showOptionalTorUpload ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              Have additional transfer courses from another institution? (Optional)
            </button>

            {showOptionalTorUpload && (
              <div className="mt-3 p-4 rounded-xl border border-dashed border-border bg-card space-y-3">
                <p className="text-[11px] text-muted-foreground">
                  Upload an official Transcript of Records (TOR) or Grade Slip to match additional courses.
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.png"
                  onChange={handleTorFileChange}
                  className="text-xs"
                />
                {torFiles.length > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={torUploading}
                    onClick={handleUploadTor}
                    className="text-xs h-9 bg-navy hover:bg-navy/90 text-white rounded-lg px-4"
                  >
                    {torUploading ? "Processing TOR..." : "Upload & Reconcile TOR"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : isFreshman ? (
        /* Case 2: Incoming 1st Year (Freshman) */
        <div className="rounded-2xl border border-good/20 bg-good-bg/30 p-5 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-good text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="size-5 text-amber" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-good">Incoming 1st-Year Freshman Student</h3>
              <p className="text-xs text-foreground/80">
                You are entering your 1st year of college. All curriculum subjects are set to <strong>UNTAKEN</strong>.
                You will record grades at the end of each academic grading term.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Case 3: Upper-year student with no grades found on uploaded sheet */
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber/30 bg-amber-bg/30 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-xl bg-amber text-navy flex items-center justify-center shrink-0 shadow-2xs">
                <AlertCircle className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-navy">No Completed Grades Found on Sheet</h3>
                <p className="text-xs text-muted-foreground">
                  If you are a continuing 2nd, 3rd, or 4th-year student, you can upload your Transcript (TOR) / Grade
                  Slip below to auto-credit your completed courses.
                </p>
              </div>
            </div>
          </div>

          {/* Optional TOR dropzone */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center text-center">
            <UploadCloud className="size-8 text-amber mb-2" />
            <label className="text-xs sm:text-sm font-bold text-navy cursor-pointer hover:underline">
              Upload Official Transcript / Certified Copy of Grades (Optional)
              <input type="file" multiple accept=".pdf,.jpg,.png" onChange={handleTorFileChange} className="sr-only" />
            </label>
            <p className="text-[11px] text-muted-foreground mt-1">Multi-page PDF or image grade slips</p>

            {torFiles.length > 0 && (
              <div className="w-full mt-3 space-y-1.5 text-xs">
                {torFiles.map((f, i) => (
                  <div
                    key={`${f.name}-${f.lastModified}-${f.size}`}
                    className="p-2.5 rounded-lg bg-white border border-border flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-semibold text-navy truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setTorFiles(torFiles.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-bad"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  disabled={torUploading}
                  onClick={handleUploadTor}
                  className="mt-2 h-10 w-full bg-navy hover:bg-navy/90 text-white text-xs font-semibold rounded-xl"
                >
                  {torUploading ? "Processing Transcript OCR..." : "Match Grades with Curriculum"}
                </Button>
              </div>
            )}
          </div>

          {torError && (
            <div className="p-3 rounded-xl bg-bad-bg border border-bad/20 text-xs text-bad font-medium">{torError}</div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold rounded-xl h-11 px-5 border-border hover:bg-muted"
        >
          ← Back to Prospectus
        </Button>

        <Button
          type="button"
          onClick={onSuccess}
          className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs"
        >
          Proceed to Step 4: Final Summary →
        </Button>
      </div>
    </div>
  );
}
