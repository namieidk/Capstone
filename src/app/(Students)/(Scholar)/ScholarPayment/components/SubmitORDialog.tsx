"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Hash,
  Loader2,
  Sparkles,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  type DisbursementItem,
  type ExtractedOfficialReceiptData,
  submitScholarOfficialReceipt,
  uploadOfficialReceiptFile,
} from "@/lib/api/disbursements";

interface SubmitORDialogProps {
  disbursement: DisbursementItem | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitORDialog({ disbursement, open, onClose, onSuccess }: SubmitORDialogProps) {
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [extractedData, setExtractedData] = useState<ExtractedOfficialReceiptData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open || !disbursement) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadOfficialReceiptFile(file);

      setFileUrl(res.file_url);
      setFileName(res.file_name);

      if (res.extracted_data) {
        setExtractedData(res.extracted_data);
        toast.success("Receipt scanned successfully!");
      } else {
        toast.success("Official Receipt uploaded.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload and scan receipt.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) {
      toast.error("Please take a photo or upload your Official Receipt.");
      return;
    }

    try {
      setSubmitting(true);
      const orNum = extractedData?.or_number?.trim() || "PENDING_VERIFICATION";
      const payDate = extractedData?.payment_date || new Date().toISOString().split("T")[0];

      const res = await submitScholarOfficialReceipt(disbursement.disbursement_id, {
        or_number: orNum,
        or_payment_date: payDate,
        file_url: fileUrl,
        file_name: fileName || undefined,
        extracted_data: extractedData || undefined,
      });
      toast.success(res.message || "Official Receipt submitted successfully for coordinator audit.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit receipt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-line w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="size-5 text-[#0a4f42]" />
            <h2 className="text-base font-bold text-navy">Submit Official Receipt (OR)</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Target Disbursement Info Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-line space-y-1 text-xs">
            <div className="flex items-center justify-between text-navy font-bold">
              <span>Tuition Disbursement #{disbursement.disbursement_id}</span>
              <span className="text-[#0a4f42]">
                ₱{Number(disbursement.amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center justify-between">
              <span>
                {disbursement.academic_year} • {disbursement.semester}
              </span>
              <span>Check #{disbursement.check_number || "—"}</span>
            </div>
          </div>

          {/* Photo Uploader / Preview */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Official Receipt Document</Label>
            {fileUrl ? (
              <div className="rounded-xl border border-line bg-slate-50 p-3 space-y-3">
                <div className="flex items-center justify-between gap-2.5 overflow-hidden">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="relative size-14 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                      <Image src={fileUrl} alt="OR Preview" fill unoptimized className="object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-navy truncate">{fileName || "Official Receipt"}</p>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <FileCheck2 className="size-3.5" /> Ready for submission
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 px-2 text-xs font-semibold text-[#0a4f42]"
                    >
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <ExternalLink className="size-3" />
                        <span>Inspect</span>
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFileUrl("");
                        setExtractedData(null);
                      }}
                      className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0a4f42] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <>
                    <Loader2 className="size-6 animate-spin text-[#0a4f42]" />
                    <p className="text-xs font-semibold text-slate-700">Scanning Receipt...</p>
                    <p className="text-[11px] text-muted-foreground">Reading cashier numbers and payment seal</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="size-6 text-[#0a4f42]" />
                    <p className="text-xs font-bold text-navy">Take Photo or Upload Official Receipt</p>
                    <p className="text-[11px] text-muted-foreground text-center">
                      PNG, JPG, or PDF from university cashier (Continuous / thermal prints supported)
                    </p>
                  </>
                )}
              </label>
            )}
          </div>

          {/* Extracted Receipt Summary Card (Read-Only) */}
          {extractedData && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  <span>Detected Receipt Metadata</span>
                </span>
                <Badge variant="outline" className="bg-white text-emerald-800 border-emerald-300 text-[10px]">
                  Read-Only Preview
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {extractedData.or_number && (
                  <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                    <Hash className="size-3 text-slate-400" />
                    <span>
                      OR #: <strong className="text-slate-900">{extractedData.or_number}</strong>
                    </span>
                  </div>
                )}
                {extractedData.payment_date && (
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="size-3 text-slate-400" />
                    <span>
                      Date: <strong className="text-slate-900">{extractedData.payment_date}</strong>
                    </span>
                  </div>
                )}
                {extractedData.student_id && (
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <User className="size-3 text-slate-400" />
                    <span>
                      Student ID: <strong className="text-slate-900">{extractedData.student_id}</strong>
                    </span>
                  </div>
                )}
                {extractedData.amount_paid != null && (
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="font-semibold text-emerald-800">
                      Amount: ₱{Number(extractedData.amount_paid).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {extractedData.school_name && (
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-700 truncate">
                    <Building2 className="size-3 text-slate-400" />
                    <span className="truncate">
                      School: <strong className="text-slate-900">{extractedData.school_name}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Notice */}
          <div className="flex items-start gap-2 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[11px] text-teal-950">
            <AlertCircle className="size-4 text-[#0a4f42] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              The Coordinator will audit this Official Receipt photo against the released check amount to complete
              settlement. Please ensure the cashier stamp and receipt numbers are clearly readable.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 rounded-xl border-line text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !fileUrl}
              className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-1.5"
            >
              {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              <span>Confirm & Submit Receipt</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
