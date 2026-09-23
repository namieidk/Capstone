"use client";

import { ArrowRight, Clock, Download } from "lucide-react";
import { useState } from "react";
import {
  ARCHIVE_STATUS_STYLE,
  type ArchivedScholar,
  GRADE_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
} from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ArchivedScholarDrawerProps {
  scholar: ArchivedScholar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchivedScholarDrawer({ scholar, open, onOpenChange }: ArchivedScholarDrawerProps) {
  const [view, setView] = useState<"overview" | "history">("overview");

  if (!scholar) return null;

  const paidPayments = scholar.paymentHistory.filter((p) => p.status === "Paid");
  const totalDisbursed = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const finalGwa = scholar.gradeHistory[0]?.gwa;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 space-y-5">
        <SheetHeader className="pb-3 border-b border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
              {scholar.initials}
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">{scholar.name}</SheetTitle>
              <p className="text-xs text-muted-foreground">{scholar.course}</p>
            </div>
          </div>
        </SheetHeader>

        {view === "overview" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Archive Status
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Track</span>
                  <div className="text-base font-bold text-foreground">{scholar.track}</div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Final GWA</span>
                  <div className="text-lg font-bold text-foreground">
                    {finalGwa !== undefined ? `${finalGwa}%` : "—"}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Joined</span>
                  <div className="text-sm font-bold text-foreground">{scholar.joined}</div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Exited</span>
                  <div className="text-sm font-bold text-foreground">{scholar.exited}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Disbursed
              </span>
              <Card className="border-border bg-card shadow-xs">
                <CardContent className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-foreground">All paid scholarship payments</div>
                    <div className="text-base font-bold text-primary">₱{totalDisbursed.toLocaleString()}</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[11px] py-0.5"
                    style={{
                      backgroundColor: ARCHIVE_STATUS_STYLE[scholar.status].bg,
                      color: ARCHIVE_STATUS_STYLE[scholar.status].text,
                    }}
                  >
                    {scholar.status}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView("history")}
                className="w-full justify-between text-xs h-9"
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  View Academic & Payment History
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">Exit Note:</span>
              <p className="text-[11px] leading-relaxed">{scholar.note}</p>
            </div>

            <Button size="sm" className="w-full gap-1.5 bg-primary text-primary-foreground text-xs h-9">
              <Download className="w-4 h-4" />
              Download Scholar Record
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("overview")}
              className="text-xs h-8 -ml-2 text-muted-foreground"
            >
              ← Back to overview
            </Button>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Grade History
              </span>
              <div className="space-y-1.5">
                {scholar.gradeHistory.map((g) => (
                  <div
                    key={`${g.term}-${g.gwa}`}
                    className="p-2.5 rounded-md bg-muted/40 border border-border/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{g.term}</div>
                      <div className="text-[11px] text-muted-foreground">GWA: {g.gwa}%</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] py-0"
                      style={{
                        backgroundColor: GRADE_STATUS_COLORS[g.status].bg,
                        color: GRADE_STATUS_COLORS[g.status].text,
                      }}
                    >
                      {g.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Payment History
              </span>
              <div className="space-y-1.5">
                {scholar.paymentHistory.map((p) => (
                  <div
                    key={`${p.term}-${p.date}`}
                    className="p-2.5 rounded-md bg-muted/40 border border-border/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{p.term}</div>
                      <div className="text-[11px] text-muted-foreground">{p.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">₱{p.amount.toLocaleString()}</div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] py-0"
                        style={{
                          backgroundColor: PAYMENT_STATUS_COLORS[p.status].bg,
                          color: PAYMENT_STATUS_COLORS[p.status].text,
                        }}
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
