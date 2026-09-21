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
              className="group flex w-full items-center gap-3 rounded-lg border border-border/60 bg-muted/40 px-3.5 py-3 text-left text-sm transition-all hover:border-navy/40 hover:bg-white hover:shadow-xs"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-navy/10 text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                <FileText className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="block truncate font-medium text-foreground">
                    {d.document_type.replace(/_/g, " ")}
                  </span>
                  <Badge variant={meta.variant} className="h-5 shrink-0 px-1.5 text-[0.65rem]!">
                    {meta.label}
                  </Badge>
                </div>
                <span className="block truncate text-xs text-muted-foreground">{d.file_name ?? "Document"}</span>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-border/70 bg-white px-2.5 py-1 text-xs font-semibold text-navy shadow-2xs transition-colors group-hover:border-navy group-hover:bg-navy group-hover:text-white">
                <Eye className="size-3.5" />
                <span>Inspect</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
