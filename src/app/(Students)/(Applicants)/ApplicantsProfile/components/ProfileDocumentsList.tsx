"use client";

import { Download, Eye, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ScholarDocument } from "@/lib/api/documents";
import { DocumentViewerDialog } from "./DocumentViewerDialog";

function getDocumentStatusBadge(status: string) {
  switch (status) {
    case "VERIFIED":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">Verified</Badge>;
    case "STUDENT_CONFIRMED":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">Confirmed</Badge>;
    case "PASSED_PRECHECK":
    case "PENDING":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">In Review</Badge>;
    case "NEEDS_REUPLOAD":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-0">Needs Re-upload</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

interface ProfileDocumentsListProps {
  documents: ScholarDocument[];
}

export function ProfileDocumentsList({ documents }: ProfileDocumentsListProps) {
  const [selectedDoc, setSelectedDoc] = useState<ScholarDocument | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-navy">Application Documents</h2>
        <span className="text-xs text-muted-foreground font-medium">
          {documents.length} document{documents.length === 1 ? "" : "s"}
        </span>
      </div>

      {documents.length === 0 ? (
        <Card className="rounded-xl border border-line bg-white p-6 text-center shadow-xs">
          <FileText className="mx-auto size-8 text-muted-foreground/60 mb-2" />
          <p className="text-sm font-semibold text-navy">No documents uploaded yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Documents you submit with your application will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {documents.map((doc) => {
            const title = doc.label || doc.document_type.replace(/_/g, " ");

            return (
              <div
                key={doc.document_id}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3.5 rounded-xl border border-line bg-white p-4 shadow-xs transition-colors hover:border-navy/20"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="truncate text-sm font-bold text-navy hover:text-navy/80 hover:underline transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                      title="Click to preview document"
                    >
                      <span className="truncate">{title}</span>
                      <Eye className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc.file_name || doc.document_type}
                      {doc.uploaded_at
                        ? ` · Uploaded ${new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto sm:ml-0 shrink-0">
                  {getDocumentStatusBadge(doc.status)}
                  {doc.file_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-navy hover:bg-tint"
                      asChild
                    >
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download document"
                        title="Download file"
                      >
                        <Download className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Carousel Preview Dialog */}
      <DocumentViewerDialog
        document={selectedDoc}
        open={selectedDoc !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDoc(null);
        }}
      />
    </div>
  );
}
