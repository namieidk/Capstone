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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <History className="w-5 h-5 text-primary" />
            Upload Historical Transcript / CCG
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            For continuing scholars (2nd, 3rd, or 4th Year) to auto-credit previously finished courses.
          </DialogDescription>
        </DialogHeader>

        {resultSummary ? (
          <div className="space-y-4 py-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-sm">Historical Grades Processed Successfully!</h3>
              <p className="text-xs text-muted-foreground">
                <strong>{resultSummary.creditedCount}</strong> courses have been matched and marked as{" "}
                <span className="text-emerald-600 font-semibold">CREDITED</span> on your active checklist.
              </p>
              {resultSummary.unmappedCount > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  ({resultSummary.unmappedCount} electives/unmapped items detected)
                </p>
              )}
            </div>
            <DialogFooter className="pt-2 sm:justify-center">
              <Button size="sm" onClick={handleClose} className="bg-primary text-primary-foreground">
                Done & View Checklist
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <label
              htmlFor="historical-ccg-file-input"
              className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              {file ? (
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[280px]">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Click to select past transcript or grade slips
                  </p>
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

            <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 text-muted-foreground border border-border/40">
              <div className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Fuzzy Course Reconciler
              </div>
              <p className="text-[11px] leading-relaxed">
                Passed courses will automatically be credited on your checklist based on your institution's passing
                threshold.
              </p>
            </div>

            {error && (
              <p className="text-xs font-medium text-destructive bg-destructive/10 p-2.5 rounded-md border border-destructive/20">
                {error}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={handleClose} disabled={uploading}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reconciling Courses...
                  </>
                ) : (
                  <>
                    <History className="w-4 h-4" />
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
