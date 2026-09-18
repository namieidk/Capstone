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
      <DialogContent className="max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-navy flex items-center gap-2">
            <FileText className="size-5 text-rose-600" />
            Request Second Chance • Academic Appeal
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Submit a formal appeal for{" "}
            <strong>
              AY {report.academic_year} • {report.semester}
            </strong>{" "}
            (Computed GWA: <span className="font-bold text-navy">{Number(report.gpa).toFixed(2)}</span>). Your appeal
            will be routed directly to the Grantor for consideration.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 space-y-1">
            <span className="font-bold text-rose-900">Academic Standing Discrepancy:</span>
            <p className="text-rose-800">
              Retention flag: <span className="font-bold">{report.evaluation_flag || "BELOW_PASSING_MARK"}</span>.
              Explain any extenuating personal, financial, or health challenges and your concrete academic recovery
              plan.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="appeal-statement" className="font-bold text-navy">
              Explanation & Mitigation Statement <span className="text-rose-600">*</span>
            </label>
            <Textarea
              id="appeal-statement"
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Detail the circumstances that impacted your performance and the steps you are taking to maintain passing marks next term..."
              className="rounded-xl border-line text-xs placeholder:text-muted-foreground focus-visible:ring-[#0a4f42]"
            />
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-navy block">Supporting Documentation (Optional)</span>
            <div className="flex items-center gap-3">
              <label
                htmlFor="appeal-file-upload"
                className="cursor-pointer px-3.5 py-2 rounded-xl border border-line bg-[#fdfcfb] hover:bg-[#faf8f5] font-semibold text-navy text-xs transition-colors"
              >
                {file ? file.name : "Attach Medical Cert / Proof (PDF, JPG)"}
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
                <button type="button" onClick={() => setFile(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-line">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="h-9 rounded-xl border-line text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submitting || !statement.trim()}
            onClick={handleSubmit}
            className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-1.5 shadow-xs"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-3.5" />}
            <span>Submit Appeal to Grantor</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
