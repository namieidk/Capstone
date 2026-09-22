"use client";

import { ArrowRight, CreditCard, DollarSign, Receipt, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ScholarDisbursementsData } from "@/lib/api/scholar-dashboard";

interface ScholarDisbursementCardProps {
  disbursements: ScholarDisbursementsData;
}

export function ScholarDisbursementCard({ disbursements }: ScholarDisbursementCardProps) {
  const latest = disbursements.latest;
  const history = disbursements.history || [];
  const status = latest?.status || "PENDING";
  const amountStr = latest ? `₱${latest.amount.toLocaleString()}` : "₱0.00";

  return (
    <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
            <CreditCard className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Financial Aid & Disbursements</h2>
            <p className="text-xs text-muted-foreground">Tuition stipends & grant release ledger</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/ScholarPayment" className="flex items-center gap-1">
            <span>Payment Ledger</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Latest disbursement banner */}
        <div className="rounded-xl border border-line/60 bg-[#FAF8F5] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {latest ? `${latest.academic_year} • ${latest.semester}` : "Active Term Grant"}
            </span>
            <Badge
              className={`h-5.5 rounded-full px-2 text-[10px] font-bold ${
                status === "SETTLED" || status === "CLAIMED"
                  ? "border-[#0a4f42]/30 bg-[#ddeee3] text-[#0a4f42]"
                  : status === "RELEASED" || status === "AUTHORIZED"
                    ? "border-[#f1b71e]/40 bg-[#fceec4] text-[#8a6410]"
                    : "border-muted-foreground/20 bg-muted/60 text-muted-foreground"
              }`}
            >
              {status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-[#14213a]">{amountStr}</span>
            <span className="text-xs text-muted-foreground">
              Total Cumulative: ₱{disbursements.total_disbursed_amount.toLocaleString()}
            </span>
          </div>

          {latest?.voucher_number && (
            <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
              <span>Voucher: {latest.voucher_number}</span>
              {latest.check_number && <span>• Check: {latest.check_number}</span>}
            </div>
          )}

          {/* OR Required banner if claimed but no OR */}
          {disbursements.pending_or_count > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#fceec4]/60 border border-[#f1b71e]/40 p-2.5 text-xs text-[#8a6410]">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 shrink-0 text-[#8a6410]" />
                <span className="font-semibold">Official Receipt (OR) Pending Upload</span>
              </div>
              <Button
                asChild
                size="sm"
                className="h-7 rounded-full bg-[#8a6410] px-2.5 text-[11px] font-semibold text-white hover:bg-[#705009]"
              >
                <Link href="/ScholarPayment">
                  <UploadCloud className="mr-1 size-3" /> Upload OR
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Recent mini history rows */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Recent Grant Distributions
          </p>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No historical disbursements found.</p>
          ) : (
            history.slice(0, 3).map((item) => (
              <div
                key={item.disbursement_id}
                className="flex items-center justify-between rounded-xl border border-line/50 bg-white p-2.5 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-lg bg-tint text-navy">
                    <DollarSign className="size-3 text-[#0a4f42]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#14213a]">
                      {item.academic_year} {item.semester}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.date_claimed || item.date_issued || "Processed"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#0a4f42]">₱{item.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {item.status.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
