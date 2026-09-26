"use client";

import {
  AlertCircle,
  AlertTriangle,
  Building2,
  ExternalLink,
  FileCheck,
  FileX2,
  Loader2,
  PenTool,
  RotateCcw,
  ShieldAlert,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScholarDocument } from "@/lib/api/documents";

interface CcgNeedsReuploadCardProps {
  doc: ScholarDocument;
  discarding: boolean;
  onDiscard: () => void;
}

export function CcgNeedsReuploadCard({ doc, discarding, onDiscard }: CcgNeedsReuploadCardProps) {
  const extracted = (doc.extracted_data || {}) as Record<string, unknown>;
  const detectedDocType = (extracted.detected_document_type as string) || "UNKNOWN";
  const hasSignature = extracted.has_signature;
  const gradeCount = Array.isArray(extracted.grades) ? extracted.grades.length : 0;

  const formatDocTypeLabel = (type: string) => {
    switch (type) {
      case "STATEMENT_OF_ACCOUNT":
        return "Statement of Account / Tuition Assessment";
      case "CERTIFICATE_OF_REGISTRATION":
        return "Certificate of Registration (COR) / Schedule";
      case "FORM_138":
        return "High School Report Card (Form 138/SF9)";
      case "OTHER":
        return "Unrecognized / Unsupported Document";
      default:
        return type.replace(/_/g, " ");
    }
  };

  return (
    <div className="rounded-2xl border border-rose-200/90 bg-linear-to-b from-rose-50/60 via-white to-white p-5 sm:p-6 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
            <FileX2 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-navy">Document Validation Failed</h3>
              <Badge
                variant="outline"
                className="bg-rose-100 text-rose-900 border-rose-300 text-xs font-bold gap-1 py-0.5"
              >
                <AlertCircle className="size-3 text-rose-700" />
                Upload Rejected
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              The uploaded file does not meet the requirements for an official Certified Copy of Grades (CCG).
            </p>
          </div>
        </div>

        {doc.file_url && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs border-rose-200 text-rose-800 hover:bg-rose-50 self-start sm:self-auto"
          >
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <ExternalLink className="size-3.5" />
              <span>Inspect Uploaded File</span>
            </a>
          </Button>
        )}
      </div>

      {/* Rejection Reason Alert */}
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
        <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-rose-950">Validation Rejection Notice:</p>
          <p className="text-rose-900 leading-relaxed font-medium">
            {doc.rejection_reason ||
              "The document uploaded is not recognized as a Certified Copy of Grades (CCG). Please review the security checklist below."}
          </p>
        </div>
      </div>

      {/* Security & Validation Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Document Classification */}
        <div className="p-3.5 rounded-xl border border-rose-100 bg-white shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
            <Building2 className="size-3.5 text-rose-600" /> Document Type
          </span>
          <p className="text-xs font-bold text-navy truncate">{formatDocTypeLabel(detectedDocType)}</p>
          <p className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
            <XCircle className="size-3 text-rose-600" /> Must be Official CCG / TOR
          </p>
        </div>

        {/* Signature & Seal Verification */}
        <div className="p-3.5 rounded-xl border border-rose-100 bg-white shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
            <PenTool className="size-3.5 text-rose-600" /> Registrar Signature / Seal
          </span>
          <p className="text-xs font-bold text-navy">
            {hasSignature === true ? "Detected" : "Not Detected / Missing"}
          </p>
          <p
            className={`text-[11px] font-semibold flex items-center gap-1 ${
              hasSignature ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {hasSignature ? (
              <>
                <FileCheck className="size-3 text-emerald-600" /> Signature verified
              </>
            ) : (
              <>
                <XCircle className="size-3 text-rose-600" /> Official signature required
              </>
            )}
          </p>
        </div>

        {/* Course Grades Verification */}
        <div className="p-3.5 rounded-xl border border-rose-100 bg-white shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-rose-600" /> Academic Ratings
          </span>
          <p className="text-xs font-bold text-navy">{gradeCount} Courses Detected</p>
          <p
            className={`text-[11px] font-semibold flex items-center gap-1 ${
              gradeCount > 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {gradeCount > 0 ? (
              <>
                <FileCheck className="size-3 text-emerald-600" /> Course grades found
              </>
            ) : (
              <>
                <XCircle className="size-3 text-rose-600" /> No readable grades
              </>
            )}
          </p>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
        <p className="font-bold text-navy">What should I upload?</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Please upload your official <strong>Certified Copy of Grades (CCG)</strong>, <strong>Certificate of Grades (COG)</strong>,
          or <strong>Transcript of Records (TOR)</strong> issued by your university registrar. The document must display your
          subject codes, course units, numerical grades, and the registrar&apos;s authorized signature or dry seal.
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-rose-100">
        <p className="text-xs text-muted-foreground">
          Discard this invalid file to unlock the uploader and select your official grade slip.
        </p>
        <Button
          type="button"
          disabled={discarding}
          onClick={onDiscard}
          className="h-9 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
        >
          {discarding ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
          <span>Discard & Upload New File</span>
        </Button>
      </div>
    </div>
  );
}
