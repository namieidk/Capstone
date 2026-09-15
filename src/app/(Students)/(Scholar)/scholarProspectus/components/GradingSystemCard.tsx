"use client";

import { Building2, CheckCircle2, ChevronRight, GraduationCap, HelpCircle, Info, Scale } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SchoolGradingSystem } from "@/lib/api/baseline";

interface GradingSystemCardProps {
  schoolSystem?: SchoolGradingSystem | null;
  isFrozen: boolean;
  onOpenSelection: () => void;
}

export function GradingSystemCard({ schoolSystem, isFrozen, onOpenSelection }: GradingSystemCardProps) {
  const [openDetails, setOpenDetails] = useState(false);

  if (!schoolSystem) {
    return (
      <Card
        onClick={onOpenSelection}
        className="rounded-xl border border-amber-300/80 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors shadow-2xs"
      >
        <CardContent className="p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
              <Building2 className="size-4 text-amber-800" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy text-xs sm:text-sm truncate">No Grading Scale Configured</span>
                <Badge variant="outline" className="border-amber-300 bg-amber-100/70 text-amber-900 text-[10px] py-0">
                  Required
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                Click to select your institution and enable automated GWA computation.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="h-7 px-2.5 rounded-lg bg-navy text-white text-[11px] font-semibold shrink-0 gap-1"
          >
            Select School
            <ChevronRight className="size-3.5" />
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
    <>
      <Card
        onClick={() => setOpenDetails(true)}
        className="rounded-xl border border-line bg-white hover:border-navy/30 hover:shadow-xs transition-all cursor-pointer shadow-2xs group"
      >
        <CardContent className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tint text-navy group-hover:bg-navy group-hover:text-white transition-colors">
              <Scale className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-navy text-xs sm:text-sm truncate">{schoolSystem.school_name}</span>
                {schoolSystem.is_verified ? (
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] gap-0.5 py-0 px-1.5 font-semibold">
                    <CheckCircle2 className="size-2.5 text-emerald-700" /> Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-amber-800 text-[10px] gap-0.5 py-0 px-1.5 font-semibold"
                  >
                    <HelpCircle className="size-2.5 text-amber-700" /> Unverified
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                Scale: <strong>{highest.toFixed(1)}</strong> max &bull; <strong>{passing.toFixed(1)}</strong> pass
                &bull; {isLowerBetter ? "Inverted" : "Standard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-navy shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span className="hidden sm:inline">View Scale</span>
            <Info className="size-3.5 text-muted-foreground group-hover:text-navy" />
          </div>
        </CardContent>
      </Card>

      {/* Information Dialog */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tint text-navy">
                <Scale className="size-4 text-navy" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-navy">Institution Grading Scale</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Grading parameters configured for your degree audits and GWA computation.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Institution Info */}
            <div className="p-3 rounded-lg bg-tint/40 border border-line flex items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-navy text-sm">{schoolSystem.school_name}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isLowerBetter
                    ? "Inverted Academic Scale (1.0 Highest mark, 3.0 Passing, 5.0 Failing)"
                    : `Standard Academic Scale (${highest} Max, ${passing} Passing, ${failing} Failing)`}
                </p>
              </div>
              {schoolSystem.is_verified ? (
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs gap-1 py-0.5 font-semibold shrink-0">
                  <CheckCircle2 className="size-3 text-emerald-700" /> Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-300 bg-amber-50 text-amber-800 text-xs gap-1 py-0.5 font-semibold shrink-0"
                >
                  <HelpCircle className="size-3 text-amber-700" /> Pending Verification
                </Badge>
              )}
            </div>

            {/* Scale Thresholds */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-card border border-border/60">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Highest Grade</span>
                <span className="text-base font-bold text-navy mt-0.5 block">{highest.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                  Passing Grade
                </span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                  {passing.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 block">
                  Failing Grade
                </span>
                <span className="text-base font-bold text-red-700 dark:text-red-400 mt-0.5 block">
                  {failing.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Special Codes Section */}
            {schoolSystem.special_codes && Object.keys(schoolSystem.special_codes).length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-navy" /> Recognized Special Codes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(schoolSystem.special_codes).map(([code, meaning]) => (
                    <div
                      key={code}
                      className="p-2 rounded-md bg-tint/30 border border-line flex items-center justify-between gap-2"
                    >
                      <span className="font-mono font-bold text-navy text-xs">{code}</span>
                      <span className="text-muted-foreground text-[11px] truncate">{String(meaning)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 border-t border-border flex sm:justify-between items-center gap-2">
            {!isFrozen ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpenDetails(false);
                  onOpenSelection();
                }}
                className="text-xs h-8"
              >
                Change Institution
              </Button>
            ) : (
              <div className="text-[11px] text-muted-foreground">Baseline is locked by coordinator.</div>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => setOpenDetails(false)}
              className="text-xs h-8 bg-navy text-white hover:bg-navy/90"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
