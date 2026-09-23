"use client";

import { Award, BarChart3, DollarSign, FileCheck, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DescriptiveStats, DocumentComplianceData, FinancialAnalyticsData } from "@/lib/api/analytics";

interface AnalyticsKpiCardsProps {
  stats: DescriptiveStats;
  globalThreshold: number;
  documentCompliance?: DocumentComplianceData;
  financialAnalytics?: FinancialAnalyticsData;
  userRole: "GRANTOR" | "COORDINATOR";
  onExplain: (chartType: string, title: string, metrics: Record<string, unknown>) => void;
}

function getConsistencyLabel(sd: number): { label: string; color: string } {
  if (sd <= 0.25) return { label: "High", color: "bg-[#ddeee3] text-[#0a4f42]" };
  if (sd <= 0.5) return { label: "Fair", color: "bg-[#fceec4] text-[#8a6410]" };
  return { label: "Low", color: "bg-rose-100 text-rose-800" };
}

export function AnalyticsKpiCards({
  stats,
  globalThreshold,
  documentCompliance,
  financialAnalytics,
  userRole,
  onExplain,
}: AnalyticsKpiCardsProps) {
  const isGrantor = userRole === "GRANTOR";
  const consistency = getConsistencyLabel(stats.standardDeviation);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Average Grade */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-[#0a4f42]" />
        <CardContent className="p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42]">
                <BarChart3 className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Average Grade</p>
                <p className="text-[10px] text-muted-foreground">Across all scholars</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Explain"
              onClick={() =>
                onExplain("MEAN_GWA", "Average Grade", {
                  mean: stats.mean,
                  count: stats.count,
                  min: stats.min,
                  max: stats.max,
                  median: stats.median,
                  globalThreshold,
                })
              }
              className="size-6 text-[#0a4f42] hover:bg-[#0a4f42]/10 rounded-full"
            >
              <Sparkles className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#14213a] tracking-tight">{stats.mean.toFixed(2)}</span>
            <Badge className="rounded-full bg-[#FAF8F5] text-[#14213a] border-line/80 text-[10px] font-bold">
              {stats.count} Scholars
            </Badge>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-line/50 pt-2">
            <span>
              Lowest: {stats.min.toFixed(2)} · Highest: {stats.max.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Grade Consistency */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-[#14213a]" />
        <CardContent className="p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#14213a]/10 text-[#14213a]">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Grade Consistency
                </p>
                <p className="text-[10px] text-muted-foreground">How similar are scholar grades</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Explain"
              onClick={() =>
                onExplain("GWA_DISPERSION", "Grade Consistency", {
                  standardDeviation: stats.standardDeviation,
                  variance: stats.variance,
                  mean: stats.mean,
                  q1: stats.q1,
                  q3: stats.q3,
                  count: stats.count,
                })
              }
              className="size-6 text-[#14213a] hover:bg-[#14213a]/10 rounded-full"
            >
              <Sparkles className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#14213a] tracking-tight">{consistency.label}</span>
            <Badge className={`rounded-full text-[10px] font-bold border-none ${consistency.color}`}>
              {consistency.label === "High"
                ? "Grades are closely grouped"
                : consistency.label === "Fair"
                  ? "Some variation in grades"
                  : "Wide gap between grades"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-line/50 pt-2">
            <span>
              Middle 50% score: {stats.q1.toFixed(2)} – {stats.q3.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Passing Rate */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-[#0a4f42]" />
        <CardContent className="p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42]">
                <Award className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Passing Rate</p>
                <p className="text-[10px] text-muted-foreground">Meeting {globalThreshold}% requirement</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Explain"
              onClick={() =>
                onExplain("RETENTION_COMPLIANCE", "Passing Rate", {
                  complianceRate: stats.complianceRate,
                  goodStandingCount: stats.goodStandingCount,
                  probationCount: stats.probationCount,
                  flaggedCount: stats.flaggedCount,
                  totalScholars: stats.count,
                  globalThreshold,
                })
              }
              className="size-6 text-[#0a4f42] hover:bg-[#0a4f42]/10 rounded-full"
            >
              <Sparkles className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#0a4f42] tracking-tight">{stats.complianceRate}%</span>
            <Badge className="rounded-full bg-[#ddeee3] text-[#0a4f42] text-[10px] font-bold border-none">
              {stats.goodStandingCount} passing
            </Badge>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-line/50 pt-2">
            <span>{stats.probationCount} on watch</span>
            <span className={stats.flaggedCount > 0 ? "text-rose-700 font-bold" : ""}>
              {stats.flaggedCount} at risk
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Role-specific: Total Released (Grantor) OR Documents Verified (Coordinator) */}
      {isGrantor ? (
        <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#f1b71e]" />
          <CardContent className="p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#f1b71e]/20 text-[#8a6410]">
                  <DollarSign className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Released</p>
                  <p className="text-[10px] text-muted-foreground">Scholarship spending</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Explain"
                onClick={() =>
                  onExplain("DISBURSEMENT_SUMMARY", "Total Funds Released", {
                    totalDisbursedSum: financialAnalytics?.totalDisbursedSum || 0,
                    pendingDisbursedSum: financialAnalytics?.pendingDisbursedSum || 0,
                    orComplianceRate: financialAnalytics?.orComplianceRate || 0,
                    totalDisbursementsCount: financialAnalytics?.totalDisbursementsCount || 0,
                  })
                }
                className="size-6 text-[#8a6410] hover:bg-[#f1b71e]/10 rounded-full"
              >
                <Sparkles className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#14213a] tracking-tight">
                ₱{(financialAnalytics?.totalDisbursedSum || 0).toLocaleString()}
              </span>
              <Badge className="rounded-full bg-[#fceec4] text-[#8a6410] text-[10px] font-bold border-none">
                {financialAnalytics?.orComplianceRate || 100}% OR cleared
              </Badge>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-line/50 pt-2">
              <span>Pending: ₱{(financialAnalytics?.pendingDisbursedSum || 0).toLocaleString()}</span>
              <span>{financialAnalytics?.totalDisbursementsCount || 0} records</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#0a4f42]" />
          <CardContent className="p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42]">
                  <FileCheck className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Documents Verified
                  </p>
                  <p className="text-[10px] text-muted-foreground">Submission status</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Explain"
                onClick={() =>
                  onExplain("DOC_COMPLIANCE", "Document Verification Status", {
                    docComplianceRate: documentCompliance?.complianceRate || 100,
                    verifiedDocs: documentCompliance?.verifiedDocs || 0,
                    totalDocs: documentCompliance?.totalDocs || 0,
                    pendingDocs: documentCompliance?.pendingDocs || 0,
                    rejectedDocs: documentCompliance?.rejectedDocs || 0,
                  })
                }
                className="size-6 text-[#0a4f42] hover:bg-[#0a4f42]/10 rounded-full"
              >
                <Sparkles className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#0a4f42] tracking-tight">
                {documentCompliance?.complianceRate || 100}%
              </span>
              <Badge className="rounded-full bg-[#ddeee3] text-[#0a4f42] text-[10px] font-bold border-none">
                {documentCompliance?.verifiedDocs || 0} / {documentCompliance?.totalDocs || 0} verified
              </Badge>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-line/50 pt-2">
              <span>{documentCompliance?.pendingDocs || 0} pending</span>
              <span className={documentCompliance?.rejectedDocs ? "text-rose-700 font-bold" : ""}>
                {documentCompliance?.rejectedDocs || 0} needs reupload
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
