"use client";

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { type ScholarProspectus, uploadProspectus } from "@/lib/api/baseline";

interface Step2ProspectusUploadProps {
  existingProspectus?: ScholarProspectus | null;
  onSuccess: () => void | Promise<void>;
  onBack: () => void;
}

export function Step2ProspectusUpload({ existingProspectus, onSuccess, onBack }: Step2ProspectusUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [showReplaceAlert, setShowReplaceAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<ScholarProspectus | null>(existingProspectus || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      setError(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const dropped = Array.from(e.dataTransfer.files);
      setFiles(dropped);
      setError(null);
    }
  }, []);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one prospectus document file.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      for (const f of files) {
        formData.append("files", f);
      }

      const res = await uploadProspectus(formData);
      setExtractedResult(res.prospectus);
    } catch (err: unknown) {
      console.error("Prospectus extraction failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to extract prospectus. Please try another file format.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmReplace = () => {
    setExtractedResult(null);
    setFiles([]);
    setError(null);
    setShowReplaceAlert(false);
  };

  const handleProceedToStep3 = async () => {
    if (proceeding) return;
    try {
      setProceeding(true);
      await onSuccess();
    } catch (err) {
      console.error("Failed to proceed to Step 3:", err);
    } finally {
      setProceeding(false);
    }
  };

  const subjects = extractedResult?.subjects || [];
  const creditedCount = subjects.filter((s) => s.status === "CREDITED" || s.status === "PASSED").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Upload Your Curriculum Prospectus</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload your official university curriculum evaluation sheet, portal program checklist, or catalog brochure.
          The system will automatically read your degree requirements.
        </p>
      </div>

      {/* When prospectus has already been extracted, hide the dropzone to prevent accidental overwrite */}
      {extractedResult ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-good/25 bg-good-bg/30 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-good/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-good-bg text-good flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckCircle2 className="size-6 text-good" />
                </div>
                <div>
                  <span className="text-xs font-bold text-good block">
                    Curriculum Prospectus Uploaded
                  </span>
                  <p className="text-sm font-bold text-navy mt-0.5">
                    {extractedResult.course_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplaceAlert(true)}
                  className="h-8.5 px-3 rounded-xl border-line text-navy hover:text-bad hover:border-bad/40 hover:bg-bad-bg/40 font-semibold text-xs gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Replace Prospectus</span>
                </Button>
              </div>
            </div>

            {/* Extracted Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white border border-good/15 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Degree Program</span>
                <p className="font-bold text-navy truncate mt-0.5">{extractedResult.course_name}</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-good/15 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Catalog Year</span>
                <p className="font-bold text-navy truncate mt-0.5">{extractedResult.curriculum_year}</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-good/15 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Units</span>
                <p className="font-bold text-navy mt-0.5">{extractedResult.total_units || 0} Units</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-good/15 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Auto-Credited</span>
                <p className="font-bold text-good mt-0.5">{creditedCount} Courses</p>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground pt-1">
              Your curriculum requirements have been scanned and extracted ({subjects.length} courses). If you need to upload a different syllabus or evaluation sheet, click <strong>Replace Prospectus</strong>.
            </p>
          </div>
        </div>
      ) : (
        /* File Upload Dropzone (only displayed when no prospectus is active) */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all ${
            files.length > 0
              ? "border-amber bg-amber-bg/20"
              : "border-border bg-card hover:border-amber/60 hover:bg-amber-bg/10"
          }`}
        >
          <input
            id="prospectus-file-input"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="sr-only"
          />

          <div className="flex size-12 items-center justify-center rounded-2xl bg-white border border-border text-navy shadow-2xs mb-3">
            <UploadCloud className="size-6 text-amber" />
          </div>

          <label
            htmlFor="prospectus-file-input"
            className="text-xs sm:text-sm font-bold text-navy hover:underline cursor-pointer"
          >
            Click to browse files <span className="font-normal text-muted-foreground">or drag and drop</span>
          </label>
          <p className="text-[11px] text-muted-foreground mt-1 text-center">
            Supports multi-page PDF documents, JPG, PNG or WEBP scans up to 10MB
          </p>

          {files.length > 0 && (
            <div className="w-full mt-4 space-y-2 pt-3 border-t border-border">
              <span className="text-[11px] font-bold text-navy uppercase tracking-wider">Selected Files:</span>
              <div className="space-y-1.5">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${file.size}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-white text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="size-4 text-amber shrink-0" />
                      <span className="font-semibold text-navy truncate">{file.name}</span>
                      <span className="text-muted-foreground text-[11px]">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 text-muted-foreground hover:text-bad rounded-md cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-bad-bg border border-bad/20 text-xs text-bad font-medium">{error}</div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={proceeding || uploading}
          className="text-xs sm:text-sm font-semibold rounded-xl h-11 px-5 border-border hover:bg-muted"
        >
          ← Back to School
        </Button>

        {files.length > 0 && !extractedResult ? (
          <Button
            type="button"
            disabled={uploading}
            onClick={handleUpload}
            className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Processing Document...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2 text-amber" /> Extract & Ingest Curriculum
              </>
            )}
          </Button>
        ) : extractedResult ? (
          <Button
            type="button"
            disabled={proceeding}
            onClick={handleProceedToStep3}
            className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs gap-2"
          >
            {proceeding ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading Confirmation...</span>
              </>
            ) : (
              <span>Proceed to Step 3: Review Credits →</span>
            )}
          </Button>
        ) : null}
      </div>

      {/* Confirmation Dialog before Replacing Prospectus */}
      <AlertDialog open={showReplaceAlert} onOpenChange={setShowReplaceAlert}>
        <AlertDialogContent className="w-[92vw]! max-w-lg! sm:max-w-lg! rounded-2xl border-line bg-white shadow-2xl p-6 sm:p-7 flex flex-col gap-4 overflow-visible">
          <AlertDialogHeader className="flex flex-col text-left space-y-2">
            <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mb-1">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-navy">
              Replace Uploaded Prospectus?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to replace your currently uploaded curriculum prospectus? This will clear the currently extracted courses, and you will need to upload a new document to re-parse your curriculum requirements.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-3 border-t border-slate-100">
            <AlertDialogCancel className="h-10 sm:h-11 px-5 rounded-xl border-line text-navy hover:bg-slate-100 font-semibold text-xs sm:text-sm cursor-pointer m-0">
              Keep Current Prospectus
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReplace}
              className="h-10 sm:h-11 px-5 rounded-xl bg-bad hover:bg-bad/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer m-0"
            >
              Yes, Replace Prospectus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
