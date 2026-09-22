"use client";

import { ArrowRight, CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GrantorDisbursementItem } from "@/lib/api/grantor-dashboard";

interface GrantorDisbursementQueueCardProps {
  disbursements: GrantorDisbursementItem[];
}

export function GrantorDisbursementQueueCard({ disbursements }: GrantorDisbursementQueueCardProps) {
  const getDisbBadge = (status: string) => {
    switch (status) {
      case "AUTHORIZED":
        return (
          <Badge className="h-5.5 w-28 justify-center rounded-full border-blue-300 bg-blue-50 px-2 text-[10px] font-bold text-blue-800">
            Authorized
          </Badge>
        );
      case "RELEASED":
        return (
          <Badge className="h-5.5 w-28 justify-center rounded-full border-emerald-300 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-800">
            Released
          </Badge>
        );
      case "SETTLED":
        return (
          <Badge className="h-5.5 w-28 justify-center rounded-full border-emerald-300 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-800">
            <CheckCircle2 className="mr-1 size-3 shrink-0" /> Settled
          </Badge>
        );
      default:
        return (
          <Badge className="h-5.5 w-28 justify-center rounded-full border-amber-300 bg-amber-50 px-2 text-[10px] font-bold text-amber-800">
            Pending Auth
          </Badge>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-emerald-50 text-[#0a4f42]">
            <CreditCard className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Fund Authorization & Release Queue</h2>
            <p className="text-xs text-muted-foreground">
              Vouchers, living allowances, and tuition payments requiring Grantor sign-off
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/grantPayment" className="flex items-center gap-1">
            <span>Payment Hub</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {disbursements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No disbursements currently awaiting Grantor authorization.
          </div>
        ) : (
          disbursements.map((d) => (
            <div
              key={d.disbursement_id}
              className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-emerald-300 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-[#0a4f42] font-bold text-xs">
                  ₱
                </div>
                <div>
                  <p className="font-bold text-[#14213a]">{d.scholar_name}</p>
                  <p className="text-[10px] text-muted-foreground">{d.term}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-[#14213a]">₱{d.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Allocation</p>
                </div>
                {getDisbBadge(d.status)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
