"use client";

import { ArrowRight, CheckCircle2, CreditCard, DollarSign, Receipt } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CoordinatorDisbursementItem } from "@/lib/api/coordinator-dashboard";

interface CoordinatorDisbursementClearanceCardProps {
  disbursements: CoordinatorDisbursementItem[];
}

export function CoordinatorDisbursementClearanceCard({ disbursements }: CoordinatorDisbursementClearanceCardProps) {
  const getDisbBadge = (status: string, hasOr: boolean) => {
    if (status === "SETTLED") {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-emerald-300 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-800">
          <CheckCircle2 className="mr-1 size-3 shrink-0" /> Settled
        </Badge>
      );
    }
    if ((status === "CLAIMED" || status === "RELEASED") && !hasOr) {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-2 text-[10px] font-bold text-[#8a6410]">
          <Receipt className="mr-1 size-3 shrink-0" /> OR Pending
        </Badge>
      );
    }
    return (
      <Badge className="h-5.5 w-28 justify-center rounded-full border-line bg-muted/60 px-2 text-[10px] font-semibold text-muted-foreground">
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
            <CreditCard className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Disbursement & OR Clearance</h2>
            <p className="text-xs text-muted-foreground">Vouchers, releases & student OR settlement</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/CoordinatorPayment" className="flex items-center gap-1">
            <span>Payment Hub</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {disbursements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No active disbursement records found in the ledger.
          </div>
        ) : (
          disbursements.map((d) => (
            <div
              key={d.disbursement_id}
              className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7.5 items-center justify-center rounded-lg bg-tint text-navy font-bold text-xs">
                  <DollarSign className="size-3.5 text-[#0a4f42]" />
                </div>
                <div>
                  <p className="font-bold text-[#14213a]">{d.scholar_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {d.term} • Amount: ₱{d.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">{getDisbBadge(d.status, d.has_or)}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
