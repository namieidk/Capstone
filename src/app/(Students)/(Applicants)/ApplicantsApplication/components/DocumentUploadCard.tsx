"use client";

import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentUploadCardProps {
  currentYearLevel: number;
  docType: string;
  onDocTypeChange: (value: string) => void;
  documentOptions: Array<{ value: string; label: string }>;
  picked: File[];
  onPickFiles: (files: FileList | null) => void;
  onRemovePicked: (file: File) => void;
  onUpload: () => Promise<void>;
  uploading: boolean;
  phase: string | null;
  error: string;
  hasConfirmed: boolean;
  hasDocuments: boolean;
}

export function DocumentUploadCard({
  currentYearLevel,
  docType,
  onDocTypeChange,
  documentOptions,
  picked,
  onPickFiles,
  onRemovePicked,
  onUpload,
  uploading,
  phase,
  error,
  hasConfirmed,
  hasDocuments,
}: DocumentUploadCardProps) {
  return (
    <Card className="rounded-[18px]! border-border bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg! text-navy">Upload your grades</CardTitle>
        <CardDescription className="text-sm!">
          {currentYearLevel >= 2
            ? "Upload your Transcript of Records (TOR) or Certificate of Grades. Select multiple images or PDFs — the system will automatically parse and merge all pages."
            : "Upload your Senior High School Form 138 or Form 9. Select multiple images or PDFs (e.g. front and back pages) — the system will automatically parse and merge all pages."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="max-w-sm">
          <Label htmlFor="doc-type" className="text-sm! font-semibold text-navy">
            Document type <span className="text-amber">*</span>
          </Label>
          <Select value={docType} onValueChange={onDocTypeChange}>
            <SelectTrigger
              id="doc-type"
              size="lg"
              className="mt-2 h-11! w-full bg-white! text-sm! md:text-sm!"
              aria-label="Document type"
            >
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-sm!">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={(e) => onPickFiles(e.target.files)}
            aria-label="Choose document files"
            className="h-11! bg-white! text-sm! md:text-sm!"
          />
          {picked.length > 1 && (
            <p className="mt-2 text-xs font-semibold text-navy">
              {picked.length} files selected · Will be parsed and merged into a single multi-page PDF on the server.
            </p>
          )}
          {picked.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {picked.map((f) => (
                <li
                  key={`${f.name}-${f.size}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2"
                >
                  <span className="min-w-0 truncate text-sm text-navy">
                    {f.name} <span className="text-xs text-muted-foreground tabular-nums">({formatBytes(f.size)})</span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => onRemovePicked(f)}
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-navy"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="rounded-[10px] border border-destructive/30 bg-bad-bg px-3.5 py-3 text-sm leading-relaxed text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            className="h-11 px-5 text-sm! shadow-xs"
            onClick={onUpload}
            disabled={uploading || picked.length === 0}
          >
            <UploadCloud className="size-4" />
            {uploading ? (phase ?? "Uploading...") : `Upload ${docType}`}
          </Button>
          {!hasConfirmed && hasDocuments && (
            <p className="text-xs text-muted-foreground">Confirm a document below to unlock status tracking.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
