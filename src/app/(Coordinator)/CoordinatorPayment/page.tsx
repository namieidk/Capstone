"use client";

import { CheckCircle2, Clock, CreditCard, FileCheck } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SocketContext } from "@/contexts/SocketContext";
import { type DisbursementItem, getDisbursementsQueue } from "@/lib/api/disbursements";
import { CoordinatorDisbursementsTable } from "./components/CoordinatorDisbursementsTable";
import { RecordCheckModal } from "./components/RecordCheckModal";
import { VerifyORModal } from "./components/VerifyORModal";

export default function CoordinatorDisbursementsPage() {
  const { socket } = useContext(SocketContext);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<DisbursementItem[]>([]);
  const [checkModalItem, setCheckModalItem] = useState<DisbursementItem | null>(null);
  const [verifyModalItem, setVerifyModalItem] = useState<DisbursementItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDisbursementsQueue();
      setItems(data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load disbursement queue.");
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
    socket.on("disbursement:created", handleRefresh);
    socket.on("disbursement:authorized", handleRefresh);
    socket.on("disbursement:updated", handleRefresh);
    socket.on("disbursement:or_submitted", handleRefresh);

    return () => {
      socket.off("disbursement:created", handleRefresh);
      socket.off("disbursement:authorized", handleRefresh);
      socket.off("disbursement:updated", handleRefresh);
      socket.off("disbursement:or_submitted", handleRefresh);
    };
  }, [socket, fetchData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val || 0);
  };

  // Metrics
  const readyForCheckCount = items.filter((i) => i.status === "AUTHORIZED" || i.status === "RELEASED").length;
  const awaitingORCount = items.filter((i) => i.status === "CHECK_ISSUED").length;
  const orAuditQueueCount = items.filter((i) => i.status === "OR_SUBMITTED").length;
  const settledCount = items.filter((i) => i.status === "SETTLED").length;
  const settledTotalAmount = items.filter((i) => i.status === "SETTLED").reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <PageHeader
        title="Check Issuance & Tuition Settlement"
        subtitle="Phase 3 • Record direct-to-school crossed checks, manage student handovers, and verify university official receipts."
      />

      <div className="px-5 pt-6 pb-24 md:px-10 space-y-6">
        {/* Metric Cards Row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-line shadow-va-sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Ready for Check
                  </p>
                  <p className="text-xl font-black text-navy tabular-nums mt-0.5">{readyForCheckCount}</p>
                  <p className="text-[11px] text-teal-800 font-semibold mt-0.5">Authorized vouchers</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Awaiting Official Receipt
                  </p>
                  <p className="text-xl font-black text-navy tabular-nums mt-0.5">{awaitingORCount}</p>
                  <p className="text-[11px] text-amber-800 font-semibold mt-0.5">Handed over to scholars</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0a4f42]/10 text-[#0a4f42] border border-[#0a4f42]/20">
                  <FileCheck className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">OR Audit Queue</p>
                  <p className="text-xl font-black text-navy tabular-nums mt-0.5">{orAuditQueueCount}</p>
                  <p className="text-[11px] text-[#0a4f42] font-semibold mt-0.5">Receipts uploaded</p>
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
                    Settled Transactions
                  </p>
                  <p className="text-xl font-black text-[#0a4f42] tabular-nums mt-0.5">
                    {formatCurrency(settledTotalAmount)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{settledCount} reconciled</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Disbursements Table */}
        <CoordinatorDisbursementsTable
          items={items}
          loading={loading}
          onRecordCheck={(item) => setCheckModalItem(item)}
          onVerifyOR={(item) => setVerifyModalItem(item)}
        />
      </div>

      {/* Record Check Modal */}
      <RecordCheckModal
        disbursement={checkModalItem}
        open={Boolean(checkModalItem)}
        onClose={() => setCheckModalItem(null)}
        onSuccess={fetchData}
      />

      {/* Verify OR Modal */}
      <VerifyORModal
        disbursement={verifyModalItem}
        open={Boolean(verifyModalItem)}
        onClose={() => setVerifyModalItem(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
