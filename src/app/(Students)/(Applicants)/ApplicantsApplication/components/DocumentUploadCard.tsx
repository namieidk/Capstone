"use client";

import { FileText, GraduationCap, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getRequiredDocumentInfo } from "./wizard-helpers";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentUploadCardProps {
  currentYearLevel: number;
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
  const reqInfo = getRequiredDocumentInfo(currentYearLevel);

  return (
    <Card className="rounded-[18px]! border-border bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg! text-navy">Upload your grades</CardTitle>
        <CardDescription className="text-sm!">{reqInfo.uploadPrompt}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Requirement & Auto-Detection Specification Banner (Replaces redundant dropdown) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-sky-100 bg-sky-50/50 p-3.5 sm:p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300">
              {currentYearLevel >= 2 ? <GraduationCap className="size-5" /> : <FileText className="size-5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-200">
                {currentYearLevel >= 2 ? `Year ${currentYearLevel} Requirement` : "1st-Year Requirement"}
              </span>
              <p className="mt-1 text-sm font-semibold text-navy">{reqInfo.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {currentYearLevel >= 2
                  ? "Only College Transcript of Records (TOR) is accepted. High school report cards cannot be accepted."
                  : "Only Senior High School Form 138 or Form 9 (SF9) is accepted. College transcripts cannot be accepted."}
              </p>
            </div>
          </div>
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            type="button"
            className="h-11 px-5 text-sm! shadow-xs w-full sm:w-auto shrink-0"
            onClick={onUpload}
            disabled={uploading || picked.length === 0}
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {uploading ? "Uploading..." : reqInfo.uploadButtonLabel}
          </Button>
          {uploading && phase && (
            <p className="text-xs text-sky-700 dark:text-sky-400 font-medium animate-pulse">{phase}</p>
          )}
          {!uploading && !hasConfirmed && hasDocuments && (
            <p className="text-xs text-muted-foreground">Confirm a document below to unlock status tracking.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
