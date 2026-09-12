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
      <Card className="border-amber-500/40 bg-amber-500/5 shadow-sm">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                No Institution Grading Scale Selected
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Please select your university or configure its grading parameters to enable automated GWA computation.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={onOpenSelection}
            className="whitespace-nowrap gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Select Institution Scale
            <ChevronRight className="w-4 h-4" />
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
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground text-base">{schoolSystem.school_name}</h3>
                {schoolSystem.is_verified ? (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20 text-[11px] gap-1 py-0"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Verified Scale
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[11px] gap-1 py-0"
                  >
                    <HelpCircle className="w-3 h-3" /> Pending Verification
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

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-md border border-border/60">
              <span className="text-muted-foreground">Max:</span>
              <span className="font-semibold text-foreground">{highest.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-md border border-border/60">
              <span className="text-muted-foreground">Passing:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{passing.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-md border border-border/60">
              <span className="text-muted-foreground">Failing:</span>
              <span className="font-semibold text-destructive">{failing.toFixed(2)}</span>
            </div>

            {!isFrozen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSelection}
                className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10 gap-1"
              >
                Change Scale
              </Button>
            )}
          </div>
        </div>

        {schoolSystem.special_codes && Object.keys(schoolSystem.special_codes).length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Special Codes:
            </span>
            {Object.entries(schoolSystem.special_codes).map(([code, meaning]) => (
              <span
                key={code}
                className="bg-muted px-2 py-0.5 rounded text-[11px] text-muted-foreground border border-border/40"
              >
                <strong className="text-foreground">{code}</strong> = {String(meaning)}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
