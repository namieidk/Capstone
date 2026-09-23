"use client";

import { AlertCircle, AlertTriangle, Award, BarChart3, CheckCircle2, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DescriptiveStats, ScholarPercentileItem } from "@/lib/api/analytics";

interface GwaDispersionChartProps {
  stats: DescriptiveStats;
  scholars?: ScholarPercentileItem[];
  globalThreshold?: number;
  onExplain: () => void;
}

export function GwaDispersionChart({ stats, scholars = [], globalThreshold = 90, onExplain }: GwaDispersionChartProps) {
  const { min, max, mean, median, count, complianceRate } = stats;
  const [selectedBracket, setSelectedBracket] = useState<string | null>(null);

  // Group scholars into 4 natural performance tiers based on normalized percentage score (0-100)
  const highHonors = scholars.filter((s) => s.normalizedScore >= 95);
  const goodStanding = scholars.filter((s) => s.normalizedScore >= globalThreshold && s.normalizedScore < 95);
  const onWatch = scholars.filter(
    (s) => s.normalizedScore >= globalThreshold - 5 && s.normalizedScore < globalThreshold,
  );
  const atRisk = scholars.filter((s) => s.normalizedScore < globalThreshold - 5);

  // Fallbacks if scholars array is not yet populated
  const totalCount = count || scholars.length || 0;
  const b1Count = scholars.length > 0 ? highHonors.length : Math.round(stats.goodStandingCount * 0.4);
  const b2Count = scholars.length > 0 ? goodStanding.length : stats.goodStandingCount - b1Count;
  const b3Count = scholars.length > 0 ? onWatch.length : stats.probationCount;
  const b4Count = scholars.length > 0 ? atRisk.length : stats.flaggedCount;

  const brackets = [
    {
      key: "high_honors",
      label: "High Honors",
      sublabel: "95% – 100%",
      count: b1Count,
      pct: totalCount > 0 ? Math.round((b1Count / totalCount) * 100) : 0,
      icon: Award,
      scholars: highHonors,
      barColor: "bg-[#0a4f42]",
      barBorder: "border-[#0a4f42]",
      badgeBg: "bg-[#ddeee3]",
      badgeText: "text-[#0a4f42]",
      description: "Exceeding expectations (Dean's list tier)",
      isAboveThreshold: true,
    },
    {
      key: "good_standing",
      label: "Good Standing",
      sublabel: `${globalThreshold}% – 94%`,
      count: b2Count,
      pct: totalCount > 0 ? Math.round((b2Count / totalCount) * 100) : 0,
      icon: CheckCircle2,
      scholars: goodStanding,
      barColor: "bg-[#2d8a74]",
      barBorder: "border-[#2d8a74]",
      badgeBg: "bg-[#e5f5ed]",
      badgeText: "text-[#0a4f42]",
      description: "Meets CRDC retention requirement",
      isAboveThreshold: true,
    },
    {
      key: "on_watch",
      label: "On Watch",
      sublabel: `${globalThreshold - 5}% – ${globalThreshold - 1}%`,
      count: b3Count,
      pct: totalCount > 0 ? Math.round((b3Count / totalCount) * 100) : 0,
      icon: AlertTriangle,
      scholars: onWatch,
      barColor: "bg-[#f1b71e]",
      barBorder: "border-[#f1b71e]",
      badgeBg: "bg-[#fceec4]",
      badgeText: "text-[#8a6410]",
      description: "Borderline — needs monitoring before midterms",
      isAboveThreshold: false,
    },
    {
      key: "at_risk",
      label: "At Risk",
      sublabel: `< ${globalThreshold - 5}%`,
      count: b4Count,
      pct: totalCount > 0 ? Math.round((b4Count / totalCount) * 100) : 0,
      icon: AlertCircle,
      scholars: atRisk,
      barColor: "bg-rose-500",
      barBorder: "border-rose-500",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-800",
      description: "Below passing bar — intervention advised",
      isAboveThreshold: false,
    },
  ];

  const maxBracketCount = Math.max(1, ...brackets.map((b) => b.count));
  const activeDetail = brackets.find((b) => b.key === selectedBracket);

  return (
    <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all h-full flex flex-col justify-between">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4.5 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42]">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Grade Overview</h2>
            <p className="text-[11px] text-muted-foreground">
              {complianceRate}% meet the {globalThreshold}% retention bar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="rounded-full bg-[#ddeee3] text-[#0a4f42] text-[9.5px] font-bold border-none px-2 py-0.5 hidden sm:inline-flex items-center gap-1">
            <Target className="size-2.5" />
            <span>Target: {globalThreshold}%</span>
          </Badge>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExplain}
            className="h-7 px-2.5 gap-1 rounded-lg border-[#0a4f42]/30 bg-[#ddeee3]/40 text-[11px] font-semibold text-[#0a4f42] hover:bg-[#ddeee3]"
          >
            <Sparkles className="size-3" />
            <span>Explain</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4.5 pt-1 space-y-3 flex-1 flex flex-col justify-between">
        {totalCount === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No scholar grade data available yet.
          </div>
        ) : (
          <>
            {/* Histogram Columns Container */}
            <div className="rounded-xl border border-line/70 bg-[#FAF8F5]/60 p-3 space-y-2.5">
              {/* Columns Grid */}
              <div className="grid grid-cols-4 gap-2">
                {brackets.map((b) => {
                  const isSelected = selectedBracket === b.key;
                  // Calculate compact relative height (min 24% for bars)
                  const heightPercent = b.count > 0 ? Math.max(28, Math.round((b.count / maxBracketCount) * 100)) : 16;
                  const Icon = b.icon;

                  return (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setSelectedBracket(isSelected ? null : b.key)}
                      className={`group relative flex flex-col items-center justify-end rounded-lg border p-2 pt-2.5 transition-all text-left ${
                        isSelected
                          ? "border-[#0a4f42] bg-white shadow-xs ring-1 ring-[#0a4f42]/20"
                          : "border-line/60 bg-white/70 hover:bg-white hover:border-line"
                      }`}
                    >
                      {/* Count badge */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-black text-[#14213a]">{b.count}</span>
                        <span className="text-[9px] text-muted-foreground font-semibold">({b.pct}%)</span>
                      </div>

                      {/* Column Bar Visual - compact h-16 */}
                      <div className="w-full h-16 flex items-end justify-center px-1 py-0.5">
                        <div
                          className={`w-full max-w-10 rounded-md transition-all duration-300 flex items-center justify-center ${b.barColor} ${
                            b.count === 0 ? "opacity-20" : "opacity-90 group-hover:opacity-100 shadow-2xs"
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {b.count > 0 && <Icon className="size-3 text-white/90" />}
                        </div>
                      </div>

                      {/* Bracket Label and Range */}
                      <div className="mt-1.5 text-center w-full space-y-0.5 border-t border-line/50 pt-1">
                        <span className="text-[10.5px] font-bold text-[#14213a] block leading-tight truncate">
                          {b.label}
                        </span>
                        <p className="text-[9px] font-semibold text-muted-foreground">{b.sublabel}</p>
                      </div>

                      {/* Active indicator dot */}
                      {isSelected && <div className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#0a4f42]" />}
                    </button>
                  );
                })}
              </div>

              {/* Scholar Detail Expandable Box */}
              {activeDetail && (
                <div className="rounded-lg border border-line/80 bg-white p-2.5 space-y-1.5 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#14213a]">
                      <span className={`size-2 rounded-full ${activeDetail.barColor}`} />
                      <span>
                        {activeDetail.label} ({activeDetail.sublabel}) — {activeDetail.count} Scholar
                        {activeDetail.count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{activeDetail.description}</span>
                  </div>

                  {activeDetail.scholars.length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {activeDetail.scholars.map((sc) => (
                        <Badge
                          key={sc.id}
                          className="rounded-md bg-[#FAF8F5] border border-line/70 text-[#14213a] text-[10px] font-medium px-1.5 py-0.5 gap-1"
                        >
                          <span className="font-bold">{sc.name}</span>
                          <span className="text-[#0a4f42] font-black">{sc.gwa.toFixed(2)}</span>
                          <span className="text-muted-foreground text-[9px]">({sc.course})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10.5px] text-muted-foreground italic">
                      No scholars currently in this performance bracket.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 4 Compact Summary Metrics */}
            <div className="grid grid-cols-4 gap-2 pt-0.5">
              <div className="rounded-lg border border-line/60 bg-[#FAF8F5] px-2 py-1.5 text-center">
                <p className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">Average</p>
                <p className="text-sm font-extrabold text-[#0a4f42]">{mean.toFixed(2)}</p>
              </div>

              <div className="rounded-lg border border-line/60 bg-[#FAF8F5] px-2 py-1.5 text-center">
                <p className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">Median</p>
                <p className="text-sm font-extrabold text-[#14213a]">{median.toFixed(2)}</p>
              </div>

              <div className="rounded-lg border border-line/60 bg-[#FAF8F5] px-2 py-1.5 text-center">
                <p className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">Highest</p>
                <p className="text-sm font-extrabold text-[#14213a]">{max.toFixed(2)}</p>
              </div>

              <div className="rounded-lg border border-line/60 bg-[#FAF8F5] px-2 py-1.5 text-center">
                <p className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">Lowest</p>
                <p className="text-sm font-extrabold text-[#14213a]">{min.toFixed(2)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
