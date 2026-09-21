"use client";

import { CheckCircle2, CreditCard, DollarSign } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SocketContext } from "@/contexts/SocketContext";
import { type DisbursementItem, getMyScholarDisbursements } from "@/lib/api/disbursements";
import { DisbursementTimelineCard } from "./components/DisbursementTimelineCard";
import { SubmitORDialog } from "./components/SubmitORDialog";

export default function ScholarPaymentPage() {
  const { socket } = useContext(SocketContext);

  const [loading, setLoading] = useState(true);
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([]);
  const [selectedForOR, setSelectedForOR] = useState<DisbursementItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyScholarDisbursements();
      setDisbursements(data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load tuition disbursements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => fetchData();
    socket.on("disbursement:updated", handleRefresh);
    socket.on("disbursement:authorized", handleRefresh);
    socket.on("disbursement:or_submitted", handleRefresh);

    return () => {
      socket.off("disbursement:updated", handleRefresh);
      socket.off("disbursement:authorized", handleRefresh);
      socket.off("disbursement:or_submitted", handleRefresh);
    };
  }, [socket, fetchData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val || 0);
  };

  const totalDisbursed = disbursements
    .filter((d) => d.status !== "CANCELLED")
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const settledCount = disbursements.filter((d) => d.status === "SETTLED").length;
  const latestDisbursement = disbursements[0];

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <PageHeader
        title="Tuition & Official Receipt Settlement"
        subtitle="Phase 3 • Track your tuition crossed checks, submit cashier official receipts, and monitor payment settlements."
      />

      <div className="px-5 pt-6 pb-24 md:px-10 space-y-6">
        {/* Metric Cards Row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-[#0a4f42] border border-teal-200">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Program Grants
                  </p>
                  <p className="text-xl font-black text-navy tabular-nums mt-0.5">{formatCurrency(totalDisbursed)}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    {disbursements.length} Academic terms
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Current Term Check
                  </p>
                  <p className="text-base font-bold text-navy mt-0.5 truncate">
                    {latestDisbursement?.check_number
                      ? `#${latestDisbursement.check_number}`
                      : latestDisbursement?.status || "None"}
                  </p>
                  <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                    {latestDisbursement?.check_payee || "University Cashier"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Reconciled Terms
                  </p>
                  <p className="text-xl font-black text-[#0a4f42] tabular-nums mt-0.5">{settledCount}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Official receipts verified</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* List of Disbursements */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-navy">Academic Term Tuition Records</h2>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 rounded-[18px] bg-white border border-line shadow-va-sm" />
              <Skeleton className="h-64 rounded-[18px] bg-white border border-line shadow-va-sm" />
            </div>
          ) : disbursements.length === 0 ? (
            <Card className="rounded-2xl! border-line bg-white p-12 text-center text-muted-foreground text-xs">
              No tuition disbursements on record. Once your term enrollment is audited and endorsed, your check records
              will appear here.
            </Card>
          ) : (
            disbursements.map((d) => (
              <DisbursementTimelineCard
                key={d.disbursement_id}
                disbursement={d}
                onSubmitOR={(item) => setSelectedForOR(item)}
              />
            ))
          )}
        </div>
      </div>

      {/* Submit OR Dialog */}
      <SubmitORDialog
        disbursement={selectedForOR}
        open={Boolean(selectedForOR)}
        onClose={() => setSelectedForOR(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
