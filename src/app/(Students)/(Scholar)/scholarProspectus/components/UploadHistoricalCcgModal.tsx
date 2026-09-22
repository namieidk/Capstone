"use client";

import { CheckCircle2, History, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadHistoricalCcg } from "@/lib/api/baseline";

interface UploadHistoricalCcgModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadHistoricalCcgModal({ open, onOpenChange, onSuccess }: UploadHistoricalCcgModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState<{
    creditedCount: number;
    unmappedCount: number;
  } | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("files", file);

      const res = await uploadHistoricalCcg(formData);
      setResultSummary({
        creditedCount: res.matched_credited?.length || 0,
        unmappedCount: res.unmapped_items?.length || 0,
      });
      onSuccess();
    } catch (err: unknown) {
      console.error("Historical CCG upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to parse historical transcript.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFile(null);
    setResultSummary(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-120 rounded-2xl border-line bg-white p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
            <span className="flex size-9 items-center justify-center rounded-lg bg-tint text-navy">
              <History className="size-5" />
            </span>
            Upload Historical Transcript / CCG
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            For continuing scholars (2nd, 3rd, or 4th Year) to auto-credit previously finished courses.
          </DialogDescription>
        </DialogHeader>

        {resultSummary ? (
          <div className="space-y-4 py-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-navy text-sm">Historical Grades Processed Successfully!</h3>
              <p className="text-xs text-muted-foreground">
                <strong className="text-navy">{resultSummary.creditedCount}</strong> courses have been matched and
                marked as <span className="text-emerald-800 font-bold">CREDITED</span> on your active checklist.
              </p>
              {resultSummary.unmappedCount > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  ({resultSummary.unmappedCount} electives/unmapped items detected)
                </p>
              )}
            </div>
            <DialogFooter className="pt-2 sm:justify-center">
              <Button
                type="button"
                size="sm"
                onClick={handleClose}
                className="h-10 rounded-lg bg-navy px-6 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
              >
                Done & View Checklist
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <label
              htmlFor="historical-ccg-file-input"
              className="border-2 border-dashed border-line hover:border-navy/50 bg-[#f7f9fb] hover:bg-tint/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <div className="p-3 bg-tint rounded-full text-navy mb-3">
                <UploadCloud className="size-6" />
              </div>
              {file ? (
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-navy truncate max-w-70">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-navy">Click to select past transcript or grade slips</p>
                  <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG or WEBP (Max 10MB)</p>
                </div>
              )}
              <input
                id="historical-ccg-file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFile(e.target.files[0]);
                }}
              />
            </label>

            <div className="p-3.5 bg-tint/50 rounded-xl text-xs space-y-1 text-muted-foreground border border-line">
              <div className="font-bold text-navy flex items-center gap-1.5 text-[11px]">
                <Sparkles className="size-3.5 text-amber" />
                Fuzzy Course Reconciler
              </div>
              <p className="text-[11px] leading-relaxed">
                Passed courses will automatically be credited on your checklist based on your institution's passing
                threshold.
              </p>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={uploading}
                className="h-10 rounded-lg border-line px-4 text-xs font-semibold text-navy hover:bg-tint"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="h-10 gap-1.5 rounded-lg bg-navy px-5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Reconciling Courses...
                  </>
                ) : (
                  <>
                    <History className="size-4" />
                    Auto-Credit Grades
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
