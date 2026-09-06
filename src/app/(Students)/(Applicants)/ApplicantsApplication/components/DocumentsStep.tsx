"use client";

import { Check, Eye, FileText, RefreshCw, Trash2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GradeItem, ScholarDocument } from "@/lib/api/documents";
import { DocumentReviewDialog } from "./DocumentReviewDialog";
import {
  DEFAULT_DOCUMENT_TYPE,
  DOCUMENT_TYPE_OPTIONS,
  docStatusMeta,
  formatDateTime,
  validateChosenFiles,
} from "./wizard-helpers";

interface DocumentsStepProps {
  documents: ScholarDocument[];
  onUpload: (files: File[], type: string) => Promise<void>;
  onReplace: (id: number, files: File[]) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onConfirm: (
    id: number,
    data: {
      academic_year?: string;
      general_average?: number;
      grade_items?: GradeItem[];
    },
  ) => Promise<void>;
  onContinue: () => void;
  hasConfirmed: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const CONFIRMABLE = ["PENDING", "PASSED_PRECHECK"];

export function DocumentsStep({
  documents,
  onUpload,
  onReplace,
  onDelete,
  onConfirm,
  onContinue,
  hasConfirmed,
}: DocumentsStepProps) {
  const [docType, setDocType] = useState<string>(DEFAULT_DOCUMENT_TYPE);
  const [picked, setPicked] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScholarDocument | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ScholarDocument | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<number | null>(null);

  function pickFiles(list: FileList | null) {
    if (!list) return;
    const files = Array.from(list);
    const violation = validateChosenFiles(files);
    if (violation) {
      setError(violation);
      return;
    }
    setError("");
    setPicked(files);
  }

  async function handleUpload() {
    if (picked.length === 0) {
      setError("Choose at least one file to upload.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      setPhase(picked.length > 1 ? "Uploading files (backend merging into 1 PDF)..." : "Uploading...");
      await onUpload(picked, docType);
      setPicked([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload documents.");
    } finally {
      setUploading(false);
      setPhase(null);
    }
  }

  async function handleReplaceSelected(list: FileList | null) {
    if (!list || list.length === 0 || replaceTarget === null) return;
    const files = Array.from(list);
    const violation = validateChosenFiles(files);
    if (violation) {
      setError(violation);
      return;
    }
    setActingId(replaceTarget);
    setError("");
    try {
      await onReplace(replaceTarget, files);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to replace document.");
    } finally {
      setActingId(null);
      setReplaceTarget(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await onDelete(deleteTarget.document_id);
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-[18px]! border-border bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg! text-navy">Upload your grades</CardTitle>
          <CardDescription className="text-sm!">
            Upload your Form 138, TOR, or Certificate of Grades. You can select multiple images (front & back) or PDFs —
            the system will automatically parse and merge them into a single document on the server.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="max-w-sm">
            <Label htmlFor="doc-type" className="text-sm! font-semibold text-navy">
              Document type <span className="text-amber">*</span>
            </Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger
                id="doc-type"
                size="lg"
                className="mt-2 h-11! w-full bg-white! text-sm! md:text-sm!"
                aria-label="Document type"
              >
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPE_OPTIONS.map((o) => (
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
              onChange={(e) => pickFiles(e.target.files)}
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
                      {f.name}{" "}
                      <span className="text-xs text-muted-foreground tabular-nums">({formatBytes(f.size)})</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => setPicked((p) => p.filter((x) => x !== f))}
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
              onClick={handleUpload}
              disabled={uploading || picked.length === 0}
            >
              <UploadCloud className="size-4" />
              {uploading ? (phase ?? "Uploading...") : `Upload ${docType}`}
            </Button>
            {!hasConfirmed && documents.length > 0 && (
              <p className="text-xs text-muted-foreground">Confirm a document below to unlock status tracking.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[18px]! border-border bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg! text-navy">My documents ({documents.length})</CardTitle>
          <CardDescription className="text-sm!">Confirm each document so coordinators can verify it.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {documents.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nothing uploaded yet — your files will appear here.
            </p>
          ) : (
            documents.map((doc) => {
              const meta = docStatusMeta(doc.status);
              const busy = actingId === doc.document_id;
              const confirmable = CONFIRMABLE.includes(doc.status);
              return (
                <div
                  key={doc.document_id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3.5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-navy">
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">
                      {doc.document_type}
                      {doc.file_name ? (
                        <span className="font-normal text-muted-foreground"> · {doc.file_name}</span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Uploaded {formatDateTime(doc.uploaded_at)}</p>
                    {doc.status === "NEEDS_REUPLOAD" && doc.rejection_reason && (
                      <p className="mt-1 text-xs font-medium text-destructive">Coordinator: {doc.rejection_reason}</p>
                    )}
                  </div>
                  <Badge variant={meta.variant} className="h-6 px-2.5 text-xs!">
                    {meta.label}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {confirmable ? (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 gap-1.5 text-xs!"
                        onClick={() => setReviewTarget(doc)}
                        disabled={busy}
                      >
                        <Check className="size-3.5" />
                        {busy ? "Confirming..." : "Review & Confirm"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs! text-navy"
                        onClick={() => setReviewTarget(doc)}
                      >
                        <Eye className="size-3.5" />
                        View Data
                      </Button>
                    )}
                    {doc.status !== "VERIFIED" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Replace ${doc.document_type} (select file or files)`}
                        title="Replace file(s)"
                        onClick={() => {
                          setReplaceTarget(doc.document_id);
                          replaceInputRef.current?.click();
                        }}
                        disabled={busy}
                      >
                        <RefreshCw className="size-4" />
                      </Button>
                    )}
                    {doc.status !== "VERIFIED" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${doc.document_type}`}
                        title="Delete document"
                        className="hover:text-destructive"
                        onClick={() => setDeleteTarget(doc)}
                        disabled={busy}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <input
            ref={replaceInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => handleReplaceSelected(e.target.files)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" className="h-11 px-6 text-sm! shadow-xs" onClick={onContinue}>
          Continue to status
        </Button>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete document?"
        description={
          deleteTarget
            ? `${deleteTarget.document_type}${deleteTarget.file_name ? ` (${deleteTarget.file_name})` : ""} will be permanently removed.`
            : "This document will be permanently removed."
        }
        confirmLabel="Delete"
        acting={deleting}
        onConfirm={handleDelete}
      />

      <DocumentReviewDialog
        document={reviewTarget}
        open={reviewTarget !== null}
        onOpenChange={(open) => !open && setReviewTarget(null)}
        onConfirm={async (id, data) => {
          setActingId(id);
          try {
            await onConfirm(id, data);
          } finally {
            setActingId(null);
          }
        }}
      />
    </div>
  );
}
