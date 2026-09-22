"use client";

import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, GraduationCap, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CoordinatorScholarItem } from "@/lib/api/coordinator-dashboard";

interface CoordinatorScholarHealthCardProps {
  scholars: CoordinatorScholarItem[];
}

export function CoordinatorScholarHealthCard({ scholars }: CoordinatorScholarHealthCardProps) {
  const getHealthBadge = (health: "good" | "warn" | "bad", _isFrozen: boolean) => {
    if (health === "warn") {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-2 text-[10px] font-bold text-[#8a6410]">
          <AlertTriangle className="mr-1 size-3 shrink-0" /> Probation
        </Badge>
      );
    }
    if (health === "bad") {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-rose-300 bg-rose-50 px-2 text-[10px] font-bold text-rose-800">
          <AlertCircle className="mr-1 size-3 shrink-0" /> Flagged
        </Badge>
      );
    }
    return (
      <Badge className="h-5.5 w-28 justify-center rounded-full border-[#0a4f42]/30 bg-[#ddeee3] px-2 text-[10px] font-bold text-[#0a4f42]">
        <CheckCircle2 className="mr-1 size-3 shrink-0" /> Good Standing
      </Badge>
    );
  };

  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
            <GraduationCap className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Active Scholar Standing & Retention</h2>
            <p className="text-xs text-muted-foreground">Academic health, baselines & GPA oversight</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/CoordinatorMonitor" className="flex items-center gap-1">
            <span>Scholar Monitor</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {scholars.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No active scholars enrolled in the system.
          </div>
        ) : (
          scholars.map((sc) => (
            <div
              key={sc.id}
              className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#0a4f42] text-white font-bold text-xs">
                  {sc.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "SC"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[#14213a]">{sc.name}</p>
                    {sc.is_frozen && (
                      <span title="Baseline Frozen">
                        <Lock className="size-3 text-[#0a4f42]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {sc.course} • {sc.school}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="font-bold text-[#14213a]">{sc.gwa.toFixed(2)} GWA</p>
                  <p className="text-[10px] text-muted-foreground">Current Term</p>
                </div>
                {getHealthBadge(sc.health, sc.is_frozen)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
