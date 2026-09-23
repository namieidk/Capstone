"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AnalyticsSummaryResponse } from "@/lib/api/analytics";

interface ExportAnalyticsButtonProps {
  data: AnalyticsSummaryResponse | null;
  userRole: "GRANTOR" | "COORDINATOR";
}

export function ExportAnalyticsButton({ data, userRole }: ExportAnalyticsButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportCsv = () => {
    if (!data) return;
    setExporting(true);

    try {
      const rows: string[] = [];

      // 1. Header Information
      rows.push(`"ViaScholar Descriptive Analytics & Retention Report"`);
      rows.push(`"Generated On:","${new Date().toLocaleString()}"`);
      rows.push(`"Role Perspective:","${userRole}"`);
      rows.push(`"Global Retention Threshold:","${data.globalThresholdPercent}%"`);
      rows.push("");

      // 2. Overall Cohort Descriptive Statistics
      rows.push(`"=== OVERALL DESCRIPTIVE STATISTICS ==="`);
      rows.push(`"Metric","Value"`);
      rows.push(`"Total Active Scholars (N)","${data.overallStats.count}"`);
      rows.push(`"Mean GWA (μ)","${data.overallStats.mean.toFixed(2)}"`);
      rows.push(`"Standard Deviation (σ)","${data.overallStats.standardDeviation.toFixed(2)}"`);
      rows.push(`"Variance (σ²)","${data.overallStats.variance.toFixed(4)}"`);
      rows.push(`"Minimum GWA","${data.overallStats.min.toFixed(2)}"`);
      rows.push(`"1st Quartile (Q1)","${data.overallStats.q1.toFixed(2)}"`);
      rows.push(`"Median (Q2)","${data.overallStats.median.toFixed(2)}"`);
      rows.push(`"3rd Quartile (Q3)","${data.overallStats.q3.toFixed(2)}"`);
      rows.push(`"Maximum GWA","${data.overallStats.max.toFixed(2)}"`);
      rows.push(`"Retention Compliance Rate","${data.overallStats.complianceRate}%"`);
      rows.push(`"Good Standing Count","${data.overallStats.goodStandingCount}"`);
      rows.push(`"Probation Count","${data.overallStats.probationCount}"`);
      rows.push(`"Flagged Count","${data.overallStats.flaggedCount}"`);
      rows.push("");

      // 3. Category Breakdown by Course
      rows.push(`"=== BREAKDOWN BY DEGREE PROGRAM ==="`);
      rows.push(
        `"Degree Program","Count (N)","Mean GWA (μ)","Std Dev (σ)","Compliance Rate (%)","Good Standing","Probation","Flagged"`,
      );
      data.courseBreakdown.forEach((c) => {
        rows.push(
          `"${c.category}","${c.count}","${c.mean.toFixed(2)}","${c.standardDeviation.toFixed(2)}","${c.complianceRate}%","${c.goodStandingCount}","${c.probationCount}","${c.flaggedCount}"`,
        );
      });
      rows.push("");

      // 4. Category Breakdown by Scholarship Track
      rows.push(`"=== BREAKDOWN BY SCHOLARSHIP TRACK ==="`);
      rows.push(
        `"Track","Count (N)","Mean GWA (μ)","Std Dev (σ)","Compliance Rate (%)","Good Standing","Probation","Flagged"`,
      );
      data.trackBreakdown.forEach((t) => {
        rows.push(
          `"${t.category}","${t.count}","${t.mean.toFixed(2)}","${t.standardDeviation.toFixed(2)}","${t.complianceRate}%","${t.goodStandingCount}","${t.probationCount}","${t.flaggedCount}"`,
        );
      });
      rows.push("");

      // 5. Individual Scholar Peer Rankings
      rows.push(`"=== INDIVIDUAL SCHOLAR PERCENTILE RANKINGS ==="`);
      rows.push(
        `"Scholar Name","Email","School","Degree Program","GWA","Percentile Rank (%)","Standing","Retention Compliant"`,
      );
      data.scholars.forEach((sc) => {
        rows.push(
          `"${sc.name}","${sc.email}","${sc.school}","${sc.course}","${sc.gwa.toFixed(2)}","${sc.percentileRank.toFixed(1)}%","${sc.health.toUpperCase()}","${sc.isCompliant ? "YES" : "NO"}"`,
        );
      });

      // Blob generation and trigger download
      const csvString = rows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ViaScholar_Analytics_${userRole}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export analytics CSV:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!data || exporting}
      onClick={handleExportCsv}
      className="h-8 gap-1.5 rounded-xl border-[#0a4f42]/30 bg-white text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10 shadow-2xs"
    >
      <Download className="size-3.5" />
      <span>{exporting ? "Exporting..." : "Export CSV Report"}</span>
    </Button>
  );
}
