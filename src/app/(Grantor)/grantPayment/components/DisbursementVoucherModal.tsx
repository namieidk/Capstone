"use client";

import { FileText, Loader2, Printer, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type DisbursementVoucherDetails, getDisbursementVoucherDetails } from "@/lib/api/disbursements";

interface DisbursementVoucherModalProps {
  voucherNumber: string | null;
  open: boolean;
  onClose: () => void;
}

export function DisbursementVoucherModal({ voucherNumber, open, onClose }: DisbursementVoucherModalProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<DisbursementVoucherDetails | null>(null);

  useEffect(() => {
    if (!voucherNumber || !open) return;
    const currentVoucher = voucherNumber;
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await getDisbursementVoucherDetails(currentVoucher);
        setDetails(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load voucher details.");
        onClose();
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [voucherNumber, open, onClose]);

  if (!open || !voucherNumber) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-line w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-[#0a4f42]" />
            <h2 className="text-base font-bold text-navy">Disbursement Voucher Preview</h2>
            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-semibold">
              Authorized
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 rounded-lg border-line text-xs font-semibold gap-1.5"
            >
              <Printer className="size-3.5" />
              <span>Print Voucher</span>
            </Button>
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
        </div>

        {/* Voucher Content Area */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-[#0a4f42]" />
              <p className="text-xs font-medium">Loading voucher records...</p>
            </div>
          ) : details ? (
            <div className="space-y-6 border border-slate-300 rounded-xl p-6 bg-white shadow-2xs print:border-none print:p-0">
              {/* Institutional Header */}
              <div className="text-center border-b border-slate-300 pb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0a4f42]">
                  ViaScholar Program Foundation
                </p>
                <h1 className="text-xl font-black text-navy mt-0.5 tracking-tight">DISBURSEMENT VOUCHER</h1>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Voucher No: <span className="text-slate-900 font-mono font-bold">{details.voucher_number}</span>
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Payee Institution
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{details.payee_school}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mode: Direct-to-School Crossed Check</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Date Authorized
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {new Date(details.authorized_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Authorized by: {details.authorized_by}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <p className="text-xs font-bold text-slate-800 mb-2">
                  Student Beneficiary Schedule ({details.item_count} Scholars)
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="py-2 pl-4 font-bold text-slate-700">#</TableHead>
                        <TableHead className="py-2 font-bold text-slate-700">Scholar Name</TableHead>
                        <TableHead className="py-2 font-bold text-slate-700">Student ID</TableHead>
                        <TableHead className="py-2 font-bold text-slate-700">Academic Term</TableHead>
                        <TableHead className="py-2 pr-4 text-right font-bold text-slate-700">Tuition Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {details.items.map((item, idx) => (
                        <TableRow key={item.disbursement_id} className="border-b border-slate-100">
                          <TableCell className="py-2 pl-4 text-slate-500 font-mono">{idx + 1}</TableCell>
                          <TableCell className="py-2 font-bold text-slate-900">
                            {item.scholar_profile?.first_name} {item.scholar_profile?.last_name}
                          </TableCell>
                          <TableCell className="py-2 font-mono text-slate-600">
                            {item.scholar_profile?.student_number || "—"}
                          </TableCell>
                          <TableCell className="py-2 text-slate-700">
                            {item.academic_year} {item.semester}
                          </TableCell>
                          <TableCell className="py-2 pr-4 text-right font-bold text-[#0a4f42] tabular-nums">
                            {formatCurrency(Number(item.amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                <div>
                  <p className="text-[11px] font-bold text-[#0a4f42] uppercase tracking-wide">Total Voucher Amount</p>
                  <p className="text-xs text-muted-foreground">
                    Certified for direct check remittance to school cashier
                  </p>
                </div>
                <p className="text-xl font-black text-[#0a4f42] tabular-nums font-mono">
                  {formatCurrency(details.total_amount)}
                </p>
              </div>

              {/* Signatures block */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-xs text-slate-900">
                    {details.authorized_by}
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Grantor Approving Authority
                  </p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-xs text-slate-900">
                    Scholarship Finance / Treasury
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                    Check Preparation & Release
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-slate-50 flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8.5 rounded-xl border-line text-xs font-semibold text-slate-600"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
