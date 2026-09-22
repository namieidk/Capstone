"use client";

import { AlertTriangle, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GrantorAppealItem } from "@/lib/api/grantor-dashboard";

interface GrantorAppealsReviewCardProps {
  appeals: GrantorAppealItem[];
}

export function GrantorAppealsReviewCard({ appeals }: GrantorAppealsReviewCardProps) {
  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-amber-50 text-[#8a6410]">
            <Scale className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Academic Retention Appeals</h2>
            <p className="text-xs text-muted-foreground">
              Grade probation & retention appeals escalated for Grantor ruling
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#8a6410] hover:bg-amber-50"
        >
          <Link href="/grantMonitor" className="flex items-center gap-1">
            <span>Adjudicate Appeals</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {appeals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No academic grade retention appeals currently pending Grantor review.
          </div>
        ) : (
          appeals.map((appeal) => (
            <div
              key={appeal.id}
              className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-amber-300 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-[#8a6410] font-bold text-xs shrink-0">
                  <AlertTriangle className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#14213a] truncate">{appeal.scholar_name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {appeal.term} • {appeal.course} ({appeal.school})
                  </p>
                  <p className="text-[10px] text-amber-900/80 italic line-clamp-1 mt-0.5">"{appeal.appeal_notes}"</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-[#14213a]">{appeal.gpa.toFixed(2)} GPA</p>
                  <p className="text-[10px] text-muted-foreground">Appealed Mark</p>
                </div>
                <Badge className="h-5.5 w-28 justify-center rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-2 text-[10px] font-bold text-[#8a6410]">
                  <Scale className="mr-1 size-3 shrink-0" /> Pending Ruling
                </Badge>
                <Button
                  asChild
                  size="sm"
                  className="h-7 rounded-full bg-[#8a6410] px-2.5 text-[10px] font-semibold text-white! hover:bg-[#705009]"
                >
                  <Link href="/grantMonitor">
                    <span className="text-white!">Rule</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
