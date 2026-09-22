"use client";

import { FileText, Loader2, Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { type GradeReport, submitAcademicAppeal, uploadDocuments } from "@/lib/api/documents";

interface AcademicAppealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: GradeReport | null;
  onSuccess: () => void;
}

export function AcademicAppealModal({ open, onOpenChange, report, onSuccess }: AcademicAppealModalProps) {
  const [statement, setStatement] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!report) return null;

  const handleSubmit = async () => {
    if (!statement.trim()) {
      toast.error("Please enter an explanation statement for your academic appeal.");
      return;
    }

    try {
      setSubmitting(true);
      let supportDocId: number | undefined;

      if (file) {
        const uploadRes = await uploadDocuments([file], "APPEAL_EVIDENCE");
        supportDocId = uploadRes.document_id;
      }

      await submitAcademicAppeal(report.report_id, {
        appeal_notes: statement.trim(),
        appeal_document_id: supportDocId,
      });

      toast.success("Academic second chance appeal submitted directly to the Grantor!");
      setStatement("");
      setFile(null);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit academic appeal.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="space-y-1.5 pb-2">
          <DialogTitle className="text-lg font-bold text-navy flex items-center gap-2.5 tracking-tight">
            <div className="size-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="size-5" />
            </div>
            <span>Request Second Chance • Academic Appeal</span>
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Submit a formal academic appeal for{" "}
            <strong className="text-foreground">
              AY {report.academic_year} • {report.semester}
            </strong>{" "}
            (Computed GWA: <span className="font-bold text-navy">{Number(report.gpa).toFixed(2)}</span>). Your appeal
            will be reviewed directly by the Grantor for probationary continuation.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs sm:text-sm">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-900 text-xs">Academic Standing Discrepancy:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-200/80 text-rose-900 uppercase">
                {report.evaluation_flag || "BELOW_PASSING_MARK"}
              </span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Please explain any extenuating personal, medical, financial, or academic challenges that impacted your
              performance, and outline your concrete academic recovery plan for the upcoming semester.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="appeal-statement" className="font-bold text-navy block text-xs sm:text-sm">
              Explanation & Mitigation Statement <span className="text-rose-600">*</span>
            </label>
            <Textarea
              id="appeal-statement"
              rows={6}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Provide a detailed explanation of the circumstances that affected your grades and the specific steps, study schedule, or tutoring you will take to maintain good academic standing next term..."
              className="min-h-36 rounded-2xl border-line text-xs sm:text-sm placeholder:text-muted-foreground p-3.5 focus-visible:ring-[#0a4f42] leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <span className="font-bold text-navy block text-xs sm:text-sm">Supporting Documentation (Optional)</span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="appeal-file-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-muted/30 hover:bg-muted/60 font-semibold text-navy text-xs transition-colors shadow-2xs"
              >
                <FileText className="size-4 text-navy/70" />
                <span>{file ? file.name : "Attach Medical Cert, Excuse Letter, or Proof (PDF, JPG, PNG)"}</span>
                <input
                  id="appeal-file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  <X className="size-3.5" />
                  <span>Remove attachment</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Official letters from university professors, hospital certificates, or receipts strengthen your appeal.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-4 border-t border-line">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="h-10 px-5 rounded-xl border-line text-xs sm:text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submitting || !statement.trim()}
            onClick={handleSubmit}
            className="h-10 px-6 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs sm:text-sm font-bold gap-2 shadow-xs"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span>Submit Appeal to Grantor</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
