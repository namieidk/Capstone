"use client";

import { FileUp, Loader2, Sparkles, UploadCloud } from "lucide-react";
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
import { uploadProspectus } from "@/lib/api/baseline";

interface UploadProspectusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadProspectusModal({ open, onOpenChange, onSuccess }: UploadProspectusModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("files", file);

      await uploadProspectus(formData);
      onSuccess();
      onOpenChange(false);
      setFile(null);
    } catch (err: unknown) {
      console.error("Prospectus upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload and parse prospectus file.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-120 rounded-2xl border-line bg-white p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
            <span className="flex size-9 items-center justify-center rounded-lg bg-tint text-navy">
              <FileUp className="size-5" />
            </span>
            Upload Curriculum Prospectus
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Upload your university program evaluation checklist or portal prospectus PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label
            htmlFor="prospectus-file-input"
            className="border-2 border-dashed border-line hover:border-navy/50 bg-[#f7f9fb] hover:bg-tint/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <div className="p-3 bg-tint rounded-full text-navy mb-3">
              <UploadCloud className="size-6" />
            </div>
            {file ? (
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-navy truncate max-w-70">{file.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to ingest
                </p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-navy">Click to select or drag & drop prospectus</p>
                <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG or WEBP (Max 10MB)</p>
              </div>
            )}
            <input
              id="prospectus-file-input"
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
              Automated Curriculum Extraction
            </div>
            <p className="text-[11px] leading-relaxed">
              Our document parser reads course codes, units, descriptive titles, and prerequisites across all 4 years to
              build your academic checklist.
            </p>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
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
                Parsing Curriculum...
              </>
            ) : (
              <>
                <FileUp className="size-4" />
                Ingest Prospectus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
