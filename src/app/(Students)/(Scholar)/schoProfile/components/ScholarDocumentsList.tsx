"use client";

import { Download, Eye, FileText } from "lucide-react";
import { useState } from "react";
import { DocumentViewerDialog } from "@/app/(Students)/(Applicants)/ApplicantsProfile/components/DocumentViewerDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ScholarDocument } from "@/lib/api/documents";

function getDocumentStatusBadge(status: string) {
  switch (status) {
    case "VERIFIED":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-semibold">Verified</Badge>
      );
    case "STUDENT_CONFIRMED":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs font-semibold">Confirmed</Badge>;
    case "PASSED_PRECHECK":
    case "PENDING":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs font-semibold">In Review</Badge>;
    case "NEEDS_REUPLOAD":
      return (
        <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-xs font-semibold">Needs Correction</Badge>
      );
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-800 border-red-300 text-xs font-semibold">Rejected</Badge>;
    default:
      return (
        <Badge variant="outline" className="text-xs font-semibold">
          {status}
        </Badge>
      );
  }
}

interface ScholarDocumentsListProps {
  documents: ScholarDocument[];
}

export function ScholarDocumentsList({ documents }: ScholarDocumentsListProps) {
  const [selectedDoc, setSelectedDoc] = useState<ScholarDocument | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-navy">Academic & Enrollment Documents</h3>
        <span className="text-xs text-muted-foreground font-medium">
          {documents.length} document{documents.length === 1 ? "" : "s"} recorded
        </span>
      </div>

      {documents.length === 0 ? (
        <Card className="rounded-2xl border-line bg-white p-8 text-center shadow-2xs">
          <FileText className="mx-auto size-9 text-muted-foreground/50 mb-2" />
          <p className="text-sm font-semibold text-navy">No academic documents uploaded yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Your Certificate of Registration, Certified Copy of Grades, and tuition receipts will be listed here.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {documents.map((doc) => {
            const title = doc.label || doc.document_type.replace(/_/g, " ");

            return (
              <div
                key={doc.document_id}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-2xs transition-colors hover:border-navy/20"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy border border-navy/10">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="truncate text-xs sm:text-sm font-bold text-navy hover:text-navy/80 hover:underline transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                      title="Click to preview document"
                    >
                      <span className="truncate">{title}</span>
                      <Eye className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                    <p className="truncate text-[11px] text-muted-foreground mt-0.5">
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

                <div className="flex items-center gap-2.5 ml-auto sm:ml-0 shrink-0">
                  {getDocumentStatusBadge(doc.status)}
                  {doc.file_url && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDoc(doc)}
                        className="size-8 text-muted-foreground hover:text-navy hover:bg-slate-100 rounded-lg"
                        title="View Document"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-navy hover:bg-slate-100 rounded-lg"
                        asChild
                        title="Download Document"
                      >
                        <a
                          href={doc.file_url}
                          download={doc.file_name || "document"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="size-4" />
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDoc && (
        <DocumentViewerDialog
          document={selectedDoc}
          open={!!selectedDoc}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedDoc(null);
          }}
        />
      )}
    </div>
  );
}
