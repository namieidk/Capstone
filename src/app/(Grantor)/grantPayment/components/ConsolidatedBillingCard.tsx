"use client";

import { Building2, CheckCircle2, ChevronDown, ChevronUp, FileText, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ConsolidatedUniversityBilling, DisbursementItem } from "@/lib/api/disbursements";

interface ConsolidatedBillingCardProps {
  group: ConsolidatedUniversityBilling;
  isAuthorizing: boolean;
  onAuthorizeGroup: (disbursementIds: number[]) => void;
  onViewVoucher?: (voucherNumber: string) => void;
}

export function ConsolidatedBillingCard({
  group,
  isAuthorizing,
  onAuthorizeGroup,
  onViewVoucher,
}: ConsolidatedBillingCardProps) {
  const [expanded, setExpanded] = useState(true);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const pendingItems = group.disbursements.filter((d) => d.status === "PENDING");
  const hasPending = pendingItems.length > 0;

  const handleAuthorizeAllPending = () => {
    const ids = pendingItems.map((d) => d.disbursement_id);
    onAuthorizeGroup(ids);
  };

  return (
    <Card className="rounded-[18px]! border-line bg-white shadow-va-sm transition-all overflow-hidden">
      <CardHeader className="p-5 pb-4 border-b border-line bg-[#fdfcfb]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-[#0a4f42] border border-teal-500/20 shrink-0 mt-0.5">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-navy">{group.school_name}</h3>
                <Badge variant="outline" className="text-xs bg-white text-muted-foreground border-line">
                  <Users className="size-3 mr-1" />
                  {group.total_scholars} {group.total_scholars === 1 ? "Scholar" : "Scholars"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Payee Institution: <span className="font-semibold text-slate-700">{group.school_name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Billing Amount
              </p>
              <p className="text-lg font-black text-[#0a4f42] tabular-nums">{formatCurrency(group.total_amount)}</p>
            </div>

            {hasPending && (
              <Button
                type="button"
                disabled={isAuthorizing}
                onClick={handleAuthorizeAllPending}
                className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-4 gap-1.5 shadow-xs"
              >
                {isAuthorizing ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                <span>
                  Authorize {pendingItems.length} {pendingItems.length === 1 ? "SOA" : "SOAs"} (
                  {formatCurrency(group.pending_amount)})
                </span>
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-tint"
              aria-label={expanded ? "Collapse university group" : "Expand university group"}
            >
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-0">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-line hover:bg-transparent">
                <TableHead className="py-2.5 pl-6 font-bold text-slate-600">Scholar & Student ID</TableHead>
                <TableHead className="py-2.5 text-center font-bold text-slate-600">Academic Term</TableHead>
                <TableHead className="py-2.5 text-center font-bold text-slate-600">Units</TableHead>
                <TableHead className="py-2.5 text-center font-bold text-slate-600">Verified Assessment</TableHead>
                <TableHead className="py-2.5 text-center font-bold text-slate-600">Disbursement Status</TableHead>
                <TableHead className="py-2.5 text-center font-bold text-slate-600">Action / Voucher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.disbursements.map((d: DisbursementItem) => {
                const scholarName = `${d.scholar_profile?.first_name || ""} ${d.scholar_profile?.last_name || ""}`;
                return (
                  <TableRow key={d.disbursement_id} className="border-b border-line/60 hover:bg-[#faf8f5]">
                    <TableCell className="py-3 pl-6">
                      <p className="font-bold text-navy">{scholarName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        ID: {d.scholar_profile?.student_number || "—"} •{" "}
                        {d.scholar_profile?.course_of_study || "Scholar"}
                      </p>
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      <p className="font-semibold text-slate-700">AY {d.academic_year}</p>
                      <p className="text-[10px] text-muted-foreground">{d.semester}</p>
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      <span className="font-semibold text-slate-800">
                        {d.term_enrollment?.total_units ? Number(d.term_enrollment.total_units).toFixed(1) : "—"}
                      </span>
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      <span className="font-black text-[#0a4f42] tabular-nums">{formatCurrency(Number(d.amount))}</span>
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      {d.status === "PENDING" && (
                        <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[10px] font-semibold py-0.5">
                          Pending Authorization
                        </Badge>
                      )}
                      {(d.status === "AUTHORIZED" || d.status === "RELEASED") && (
                        <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] font-semibold py-0.5">
                          Authorized (Awaiting Check)
                        </Badge>
                      )}
                      {d.status === "CHECK_ISSUED" && (
                        <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-semibold py-0.5">
                          Check Issued #{d.check_number}
                        </Badge>
                      )}
                      {d.status === "OR_SUBMITTED" && (
                        <Badge className="bg-[#0a4f42]/10 text-[#0a4f42] border-[#0a4f42]/20 text-[10px] font-semibold py-0.5">
                          OR Submitted ({d.or_number})
                        </Badge>
                      )}
                      {d.status === "SETTLED" && (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-semibold py-0.5">
                          Settled & Reconciled
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {d.status === "PENDING" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isAuthorizing}
                            onClick={() => onAuthorizeGroup([d.disbursement_id])}
                            className="h-7 text-[11px] rounded-lg border-teal-500/30 bg-teal-50 text-[#0a4f42] hover:bg-teal-100 font-bold shadow-2xs"
                          >
                            Authorize
                          </Button>
                        ) : d.voucher_number ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (d.voucher_number) onViewVoucher?.(d.voucher_number);
                            }}
                            className="h-7 text-[11px] rounded-lg border-line bg-white hover:bg-tint text-[#0a4f42] font-semibold gap-1 shadow-2xs"
                          >
                            <FileText className="size-3" />
                            <span>{d.voucher_number}</span>
                          </Button>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-semibold text-slate-500 bg-slate-50 border-slate-200"
                          >
                            Authorized
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}
