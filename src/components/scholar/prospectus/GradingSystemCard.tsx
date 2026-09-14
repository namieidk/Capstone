"use client";

import { Building2, CheckCircle2, ChevronRight, GraduationCap, HelpCircle, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SchoolGradingSystem } from "@/lib/api/baseline";

interface GradingSystemCardProps {
  schoolSystem?: SchoolGradingSystem | null;
  isFrozen: boolean;
  onOpenSelection: () => void;
}

export function GradingSystemCard({ schoolSystem, isFrozen, onOpenSelection }: GradingSystemCardProps) {
  if (!schoolSystem) {
    return (
      <Card className="rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
              <Building2 className="size-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-navy text-sm sm:text-base">No Institution Grading Scale Selected</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select your university or configure its grading parameters to enable automated GWA computation.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onOpenSelection}
            className="h-9 whitespace-nowrap gap-1.5 rounded-lg bg-navy px-4 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
          >
            Select Institution Scale
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const highest = Number(schoolSystem.highest_grade);
  const passing = Number(schoolSystem.passing_grade);
  const failing = Number(schoolSystem.failing_grade);
  const isLowerBetter = highest < failing;

  return (
    <Card className="rounded-xl border border-line bg-white shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint text-navy mt-0.5">
              <Scale className="size-5 text-navy" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-navy text-base">{schoolSystem.school_name}</h3>
                {schoolSystem.is_verified ? (
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[11px] gap-1 py-0.5 font-semibold">
                    <CheckCircle2 className="size-3 text-emerald-700" /> Verified Scale
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-amber-800 text-[11px] gap-1 py-0.5 font-semibold"
                  >
                    <HelpCircle className="size-3 text-amber-700" /> Pending Verification
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLowerBetter
                  ? "Inverted Scale (1.0 Highest mark, 3.0 Passing, 5.0 Failing)"
                  : `Standard Scale (${highest} Max, ${passing} Passing, ${failing} Failing)`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-tint/60 px-3 py-1.5 rounded-lg border border-line">
              <span className="text-muted-foreground">Highest:</span>
              <span className="font-bold text-navy">{highest.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="text-emerald-800">Passing:</span>
              <span className="font-bold text-emerald-900">{passing.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
              <span className="text-red-700">Failing:</span>
              <span className="font-bold text-red-800">{failing.toFixed(2)}</span>
            </div>

            {!isFrozen && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenSelection}
                className="h-8 rounded-lg border-line text-xs font-semibold text-navy hover:bg-tint"
              >
                Change Scale
              </Button>
            )}
          </div>
        </div>

        {schoolSystem.special_codes && Object.keys(schoolSystem.special_codes).length > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-line/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-navy/70" /> Special Codes:
            </span>
            {Object.entries(schoolSystem.special_codes).map(([code, meaning]) => (
              <span
                key={code}
                className="bg-tint/70 px-2.5 py-0.5 rounded-md text-[11px] text-foreground font-medium border border-line"
              >
                <strong className="text-navy font-bold">{code}</strong>: {String(meaning)}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
