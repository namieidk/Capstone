"use client";

import { CheckCircle2, FileText, Loader2, Sparkles, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { type ScholarProspectus, uploadProspectus } from "@/lib/api/baseline";

interface Step2ProspectusUploadProps {
  existingProspectus?: ScholarProspectus | null;
  onSuccess: () => void;
  onBack: () => void;
}

export function Step2ProspectusUpload({ existingProspectus, onSuccess, onBack }: Step2ProspectusUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
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

  const subjects = extractedResult?.subjects || [];
  const creditedCount = subjects.filter((s) => s.status === "CREDITED" || s.status === "PASSED").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Upload Your Curriculum Prospectus</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload your official university curriculum evaluation sheet, portal program checklist, or catalog brochure.
          Our OCR engine will parse your degree requirements automatically.
        </p>
      </div>

      {/* Dropzone */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Drag and drop region for file uploads */}
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
                    className="p-1 text-muted-foreground hover:text-bad rounded-md"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-bad-bg border border-bad/20 text-xs text-bad font-medium">{error}</div>
      )}

      {/* Extraction Result Preview if available */}
      {extractedResult && (
        <div className="rounded-2xl border border-good/20 bg-good-bg/30 p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-good flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-good" /> Curriculum Baseline Extracted Successfully
            </span>
            <span className="text-[11px] font-semibold text-good bg-good-bg px-2 py-0.5 rounded-full border border-good/20">
              {subjects.length} Subjects Found
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-good/15 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Degree Program</span>
              <p className="font-bold text-navy truncate mt-0.5">{extractedResult.course_name}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-good/15 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Catalog Year</span>
              <p className="font-bold text-navy truncate mt-0.5">{extractedResult.curriculum_year}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-good/15 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Units</span>
              <p className="font-bold text-navy mt-0.5">{extractedResult.total_units || 0} Units</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-good/15 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Auto-Credited</span>
              <p className="font-bold text-good mt-0.5">{creditedCount} Courses</p>
            </div>
          </div>
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
            onClick={onSuccess}
            className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs"
          >
            Proceed to Step 3: Review Credits →
          </Button>
        ) : null}
      </div>
    </div>
  );
}
