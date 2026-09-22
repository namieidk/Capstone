/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Building2, CheckCircle2, Clock, DollarSign, FileCheck } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocketContext } from "@/contexts/SocketContext";
import {
  authorizeGrantorDisbursementBatch,
  type ConsolidatedUniversityBilling,
  type DisbursementItem,
  getDisbursementsQueue,
  getGrantorConsolidatedBilling,
} from "@/lib/api/disbursements";
import { ConsolidatedBillingCard } from "./components/ConsolidatedBillingCard";
import { DisbursementVoucherModal } from "./components/DisbursementVoucherModal";
import { GrantorDisbursementHistoryTable } from "./components/GrantorDisbursementHistoryTable";

export default function GrantorDisbursementsPage() {
  const { socket } = useContext(SocketContext);

  const [activeTab, setActiveTab] = useState("consolidated-billing");
  const [loading, setLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const [billingGroups, setBillingGroups] = useState<ConsolidatedUniversityBilling[]>([]);
  const [allDisbursements, setAllDisbursements] = useState<DisbursementItem[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [groups, queue] = await Promise.all([getGrantorConsolidatedBilling(), getDisbursementsQueue()]);
      setBillingGroups(groups || []);
      setAllDisbursements(queue || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load disbursement records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time socket events
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

  const handleAuthorizeGroup = async (disbursementIds: number[]) => {
    try {
      setIsAuthorizing(true);
      const res = await authorizeGrantorDisbursementBatch({
        disbursement_ids: disbursementIds,
        remarks: "Batch authorized for direct-to-school check issuance.",
      });
      toast.success(res.message);
      setSelectedVoucher(res.voucher_number);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to authorize disbursements.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val || 0);
  };

  // Summary Metrics
  const totalPendingAmount = billingGroups.reduce((sum, g) => sum + g.pending_amount, 0);
  const totalPendingCount = billingGroups.reduce((sum, g) => sum + g.pending_count, 0);
  const totalAuthorizedAmount = allDisbursements
    .filter((d) => d.status !== "PENDING" && d.status !== "CANCELLED")
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const totalSettledAmount = allDisbursements
    .filter((d) => d.status === "SETTLED")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <PageHeader
        title="Disbursements & Consolidated Billing"
        subtitle="Phase 3 • Review university billing summaries, authorize batch fund releases, and track disbursement vouchers."
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
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Pending Authorization
                  </p>
                  <p className="text-xl font-black text-navy tabular-nums mt-0.5">
                    {formatCurrency(totalPendingAmount)}
                  </p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                    {totalPendingCount} SOA records waiting
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-[#0a4f42] border border-teal-200">
                  <FileCheck className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Authorized
                  </p>
                  <p className="text-xl font-black text-[#0a4f42] tabular-nums mt-0.5">
                    {formatCurrency(totalAuthorizedAmount)}
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Under disbursement vouchers</p>
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
                    Settled & Reconciled
                  </p>
                  <p className="text-xl font-black text-emerald-800 tabular-nums mt-0.5">
                    {formatCurrency(totalSettledAmount)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Verified official receipts</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl! border-line bg-white shadow-va-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0a4f42]/10 text-[#0a4f42] border border-[#0a4f42]/20">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Partner Universities
                  </p>
                  <p className="text-xl font-black text-navy tabular-nums mt-0.5">{billingGroups.length}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Institutional entities</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-200/60 p-1 rounded-xl h-10">
            <TabsTrigger
              value="consolidated-billing"
              className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-navy gap-1.5"
            >
              <Building2 className="size-3.5" />
              <span>Consolidated University Billing ({billingGroups.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="all-vouchers"
              className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-navy gap-1.5"
            >
              <DollarSign className="size-3.5" />
              <span>Disbursement History & Vouchers ({allDisbursements.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Consolidated University Billing */}
          <TabsContent value="consolidated-billing" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-44 w-full rounded-[18px] bg-white border border-line shadow-va-sm" />
                <Skeleton className="h-44 w-full rounded-[18px] bg-white border border-line shadow-va-sm" />
              </div>
            ) : billingGroups.length === 0 ? (
              <Card className="rounded-2xl! border-line bg-white p-12 text-center text-muted-foreground text-xs">
                No active billing reports found. Once coordinators audit and endorse SOAs, they will group here.
              </Card>
            ) : (
              billingGroups.map((group) => (
                <ConsolidatedBillingCard
                  key={group.school_name}
                  group={group}
                  isAuthorizing={isAuthorizing}
                  onAuthorizeGroup={handleAuthorizeGroup}
                  onViewVoucher={(voucher) => setSelectedVoucher(voucher)}
                />
              ))
            )}
          </TabsContent>

          {/* Tab 2: All Vouchers & History */}
          <TabsContent value="all-vouchers">
            <GrantorDisbursementHistoryTable
              items={allDisbursements}
              loading={loading}
              onViewVoucher={(voucher) => setSelectedVoucher(voucher)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Disbursement Voucher Modal */}
      <DisbursementVoucherModal
        voucherNumber={selectedVoucher}
        open={Boolean(selectedVoucher)}
        onClose={() => setSelectedVoucher(null)}
      />
    </div>
  );
}
