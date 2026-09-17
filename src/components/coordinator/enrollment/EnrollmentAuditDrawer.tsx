"use client";

import { AlertTriangle, BookOpen, CheckCircle2, ExternalLink, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  getCoordinatorEnrollmentDetails,
  reviewCoordinatorEnrollment,
  type TermEnrollment,
} from "@/lib/api/enrollment";

interface EnrollmentAuditDrawerProps {
  enrollmentId: number | null;
  open: boolean;
  onClose: () => void;
  onReviewed: () => void;
}

export function EnrollmentAuditDrawer({ enrollmentId, open, onClose, onReviewed }: EnrollmentAuditDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [enrollment, setEnrollment] = useState<TermEnrollment | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<"COR" | "SOA">("COR");

  // Review state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [coordinatorNotes, setCoordinatorNotes] = useState("");
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REQUEST_CHANGES" | "REJECT">("APPROVE");
  const [approvedAmount, setApprovedAmount] = useState<number>(0);

  useEffect(() => {
    if (!enrollmentId || !open) return;
    const currentId = enrollmentId;
    async function loadData() {
      try {
        setLoading(true);
        const data = await getCoordinatorEnrollmentDetails(currentId);
        setEnrollment(data);
        setApprovedAmount(Number(data.total_assessment) || 0);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load enrollment details.";
        toast.error(msg);
        onClose();
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [enrollmentId, open, onClose]);

  if (!open || !enrollmentId) return null;

  const handleAction = async (action: "APPROVE" | "REQUEST_CHANGES" | "REJECT") => {
    if (action === "REQUEST_CHANGES" || action === "REJECT") {
      setReviewAction(action);
      setNotesModalOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await reviewCoordinatorEnrollment(enrollmentId, {
        action: "APPROVE",
        approved_amount: approvedAmount,
      });
      toast.success(res.message);
      onReviewed();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to endorse enrollment.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmWithNotes = async () => {
    try {
      setIsSubmitting(true);
      const res = await reviewCoordinatorEnrollment(enrollmentId, {
        action: reviewAction,
        coordinator_notes: coordinatorNotes,
      });
      toast.success(res.message);
      setNotesModalOpen(false);
      onReviewed();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to process review.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val || 0);
  };

  const activeDocUrl = activeDocTab === "COR" ? enrollment?.cor_document?.file_url : enrollment?.soa_document?.file_url;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-6xl bg-slate-50 h-full flex flex-col shadow-2xl overflow-hidden border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">Start-of-Term Quick-Audit & Endorsement</h2>
              <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs font-semibold">60s Audit</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {enrollment?.scholar_profile?.first_name} {enrollment?.scholar_profile?.last_name} •{" "}
              {enrollment?.scholar_profile?.school_name} ({enrollment?.academic_year} • {enrollment?.semester})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !enrollment ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0a4f42] animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Document Viewer */}
            <div className="lg:col-span-6 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveDocTab("COR")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeDocTab === "COR" ? "bg-[#0a4f42] text-white" : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Proof of Subjects (COR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDocTab("SOA")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeDocTab === "SOA" ? "bg-[#0a4f42] text-white" : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Proof of Billing (SOA)
                  </button>
                </div>

                {activeDocUrl && (
                  <a
                    href={activeDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                  >
                    <span>Open External</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex-1 p-2 bg-slate-950 flex items-center justify-center overflow-auto relative">
                {activeDocUrl ? (
                  activeDocUrl.toLowerCase().includes(".pdf") ? (
                    <iframe
                      src={`${activeDocUrl}#toolbar=0`}
                      className="w-full h-full rounded-md border-0"
                      title="Document preview"
                    />
                  ) : (
                    <Image
                      src={activeDocUrl}
                      alt="Uploaded proof"
                      fill
                      unoptimized
                      className="object-contain rounded-md"
                    />
                  )
                ) : (
                  <p className="text-xs text-slate-500">No document attached.</p>
                )}
              </div>
            </div>

            {/* Right: Audit Panel */}
            <div className="lg:col-span-6 flex flex-col h-full overflow-y-auto p-5 space-y-4 bg-white">
              {/* Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-teal-50/70 border border-teal-100 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">Total Units</span>
                  <span className="text-base font-black text-[#0a4f42]">
                    {Number(enrollment.total_units).toFixed(1)}
                  </span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Tuition Due</span>
                  <span className="text-base font-black text-emerald-900">{formatCurrency(approvedAmount)}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Subjects</span>
                  <span className="text-base font-black text-slate-800">
                    {enrollment.enrolled_subjects?.length || 0}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Status</span>
                  <span className="text-xs font-black text-slate-800 block mt-1">{enrollment.status}</span>
                </div>
              </div>

              {/* Advisory Flags */}
              {enrollment.audit_flags && enrollment.audit_flags.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Automated System Flags:
                  </span>
                  {enrollment.audit_flags.map((flag) => (
                    <p key={flag} className="text-xs text-amber-800 pl-5">
                      • {flag.replace(/_/g, " ")}
                    </p>
                  ))}
                </div>
              )}

              {/* Subjects Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#0a4f42]" />
                  Enrolled Subjects & Prerequisite Check
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                      <tr>
                        <th className="p-2">Code</th>
                        <th className="p-2">Title</th>
                        <th className="p-2 text-center">Units</th>
                        <th className="p-2">Audit Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(enrollment.enrolled_subjects || []).map((sub, i) => {
                        const rowKey = sub.curriculum_subject_id
                          ? `drawer-sub-${sub.curriculum_subject_id}`
                          : `drawer-code-${sub.subject_code}-${i}`;
                        return (
                          <tr key={rowKey} className="hover:bg-slate-50/50">
                            <td className="p-2 font-bold text-slate-900">{sub.subject_code}</td>
                            <td className="p-2 text-slate-700 font-medium">{sub.descriptive_title}</td>
                            <td className="p-2 text-center font-bold text-slate-800">{Number(sub.units).toFixed(1)}</td>
                            <td className="p-2">
                              {sub.status === "MISSING_PREREQUISITE" ? (
                                <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                                  Prereq Unmet
                                </Badge>
                              ) : sub.status === "OFF_TRACK" ? (
                                <Badge className="bg-rose-50 text-rose-800 border-rose-200 text-[10px]">
                                  Off-Track
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                                  On-Track
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 mt-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleAction("REQUEST_CHANGES")}
                    className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Request Correction
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleAction("REJECT")}
                    className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleAction("APPROVE")}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-[#0a4f42] hover:bg-[#083c32] rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Approve & Endorse to Grantor</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Correction / Reject Modal */}
        {notesModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {reviewAction === "REQUEST_CHANGES" ? "Request Changes from Scholar" : "Reject Term Enrollment"}
              </h3>
              <p className="text-xs text-slate-500">
                Specify the reason or instructions so the scholar can rectify their submission.
              </p>
              <textarea
                value={coordinatorNotes}
                onChange={(e) => setCoordinatorNotes(e.target.value)}
                placeholder="e.g. Please re-upload a clear copy of your Official Statement of Account showing the matriculation assessment date."
                className="w-full h-24 p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4f42]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNotesModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || !coordinatorNotes.trim()}
                  onClick={handleConfirmWithNotes}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0a4f42] hover:bg-[#083c32] rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
