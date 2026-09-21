"use client";

import { Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { getApplicationDocuments } from "@/lib/api/applications";
import type { ScholarDocument } from "@/lib/api/documents";
import { getDocStatusMeta } from "./document-helpers";

interface ApplicantDocumentsListProps {
  applicationId: number;
  refreshToken: number;
  onVerify: (doc: ScholarDocument) => void;
  onDocumentsLoaded?: (docs: ScholarDocument[]) => void;
}

export function ApplicantDocumentsList({
  applicationId,
  refreshToken,
  onVerify,
  onDocumentsLoaded,
}: ApplicantDocumentsListProps) {
  const [docs, setDocs] = useState<ScholarDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshToken/attempt intentionally retrigger the fetch without being read
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getApplicationDocuments(applicationId)
      .then((rows) => {
        if (!cancelled) {
          setDocs(rows);
          onDocumentsLoaded?.(rows);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load documents.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId, refreshToken, attempt]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {["sk-1", "sk-2", "sk-3"].map((key) => (
          <Skeleton key={key} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border px-3 py-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 text-xs!"
          onClick={() => setAttempt((a) => a + 1)}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {docs.map((d) => {
        const meta = getDocStatusMeta(d.status);
        return (
          <li key={d.document_id}>
            <button
              type="button"
              onClick={() => onVerify(d)}
              className="flex w-full items-center gap-2.5 rounded-md bg-muted px-3 py-2.5 text-left text-sm transition-colors hover:bg-tint"
            >
              <FileText className="size-4 shrink-0 text-navy" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{d.document_type}</span>
                <span className="block truncate text-xs text-muted-foreground">{d.file_name ?? "Document"}</span>
              </span>
              <Badge variant={meta.variant} className="h-6 shrink-0 px-2 text-[0.7rem]!">
                {meta.label}
              </Badge>
              <Eye className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
