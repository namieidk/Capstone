"use client";

import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ScholarDocument } from "@/lib/api/documents";
import { docStatusMeta, formatDateTime } from "../wizard-helpers";

interface DialogHeaderBarProps {
  document: ScholarDocument;
}

export function DialogHeaderBar({ document: doc }: DialogHeaderBarProps) {
  const meta = docStatusMeta(doc.status);

  return (
    <DialogHeader className="shrink-0 border-b border-border bg-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5 pr-8 sm:pr-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-navy sm:size-10">
            <FileText className="size-4 sm:size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="flex flex-wrap items-center gap-1.5 text-base! text-navy sm:gap-2 sm:text-lg!">
              <span className="truncate">{doc.document_type}</span>
              <Badge variant={meta.variant} className="h-5 px-1.5 text-[0.65rem]! sm:h-5.5 sm:px-2 sm:text-[0.7rem]!">
                {meta.label}
              </Badge>
            </DialogTitle>
            <DialogDescription className="truncate text-[0.7rem]! sm:text-xs!">
              {doc.file_name ?? "Document"} · Uploaded {formatDateTime(doc.uploaded_at)}
            </DialogDescription>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7.5 shrink-0 px-2.5 text-[0.7rem]! text-navy sm:h-8.5 sm:px-3 sm:text-xs!"
          onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")}
          title="Open raw document in a new tab"
        >
          <ExternalLink className="size-3 sm:size-3.5" />
          <span>Open original file</span>
        </Button>
      </div>
    </DialogHeader>
  );
}
