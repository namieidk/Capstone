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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <FileUp className="w-5 h-5 text-primary" />
            Upload Curriculum Prospectus
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Upload your university program evaluation checklist or portal prospectus PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label
            htmlFor="prospectus-file-input"
            className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            {file ? (
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-foreground truncate max-w-[280px]">{file.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to ingest
                </p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">Click to select or drag & drop prospectus</p>
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

          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 text-muted-foreground border border-border/40">
            <div className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Automated OCR Extraction
            </div>
            <p className="text-[11px] leading-relaxed">
              Our Vision OCR parser will read all 4 years of courses, units, titles, and prerequisites to build your
              individualized academic checklist.
            </p>
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive bg-destructive/10 p-2.5 rounded-md border border-destructive/20">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={uploading}>
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
                Parsing Curriculum...
              </>
            ) : (
              <>
                <FileUp className="w-4 h-4" />
                Ingest Prospectus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
