"use client";

import { BookOpen, GraduationCap, School, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CategoryBreakdownItem } from "@/lib/api/analytics";

interface CohortCategoryTableProps {
  courseBreakdown: CategoryBreakdownItem[];
  trackBreakdown: CategoryBreakdownItem[];
  schoolBreakdown: CategoryBreakdownItem[];
  globalThreshold?: number;
  onExplainCategory: (categoryType: string, item: CategoryBreakdownItem) => void;
}

function getSpreadBadge(sd: number): { label: string; className: string } {
  if (sd <= 0.25) return { label: "Consistent", className: "bg-[#ddeee3] text-[#0a4f42]" };
  if (sd <= 0.5) return { label: "Moderate", className: "bg-[#fceec4] text-[#8a6410]" };
  return { label: "Wide Spread", className: "bg-rose-100 text-rose-800" };
}

export function CohortCategoryTable({
  courseBreakdown,
  trackBreakdown,
  schoolBreakdown,
  onExplainCategory,
}: CohortCategoryTableProps) {
  const [activeTab, setActiveTab] = useState<"course" | "track" | "school">("course");

  const activeData =
    activeTab === "course" ? courseBreakdown : activeTab === "track" ? trackBreakdown : schoolBreakdown;

  const tabLabels = {
    course: "Degree Program / Course",
    track: "Scholarship Track",
    school: "School / Institution",
  };

  return (
    <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-5 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Performance by Category</h2>
            <p className="text-xs text-muted-foreground">
              Average grades, consistency, and passing rates by course, track, or school
            </p>
          </div>
        </div>

        {/* Category Slicing Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-[#FAF8F5] p-1 border border-line/60 self-start sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("course")}
            className={`h-7 px-2.5 rounded-lg text-xs font-semibold ${
              activeTab === "course"
                ? "bg-white text-[#0a4f42] shadow-2xs"
                : "text-muted-foreground hover:text-[#14213a]"
            }`}
          >
            <BookOpen className="mr-1 size-3" /> By Course
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("track")}
            className={`h-7 px-2.5 rounded-lg text-xs font-semibold ${
              activeTab === "track"
                ? "bg-white text-[#0a4f42] shadow-2xs"
                : "text-muted-foreground hover:text-[#14213a]"
            }`}
          >
            <GraduationCap className="mr-1 size-3" /> By Track
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("school")}
            className={`h-7 px-2.5 rounded-lg text-xs font-semibold ${
              activeTab === "school"
                ? "bg-white text-[#0a4f42] shadow-2xs"
                : "text-muted-foreground hover:text-[#14213a]"
            }`}
          >
            <School className="mr-1 size-3" /> By School
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1">
        {activeData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No scholars categorized under {tabLabels[activeTab]}.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line/70">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line/70 bg-[#FAF8F5] text-[11px] font-bold text-muted-foreground">
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3 text-center">Scholars</th>
                  <th className="py-2.5 px-3 text-center">Avg. Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Spread</th>
                  <th className="py-2.5 px-3 text-center">Passing Rate</th>
                  <th className="py-2.5 px-3 text-center">Standing</th>
                  <th className="py-2.5 px-3 text-right">Explain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 bg-white">
                {activeData.map((item) => {
                  const spread = getSpreadBadge(item.standardDeviation);
                  return (
                    <tr key={item.category} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-[#14213a]">{item.category}</td>
                      <td className="py-3 px-3 text-center font-semibold text-[#14213a]">{item.count}</td>
                      <td className="py-3 px-3 text-center font-extrabold text-[#0a4f42]">{item.mean.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge
                          className={`rounded-full text-[9.5px] font-bold border-none px-1.5 py-0.5 ${spread.className}`}
                        >
                          {spread.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-[#14213a]">{item.complianceRate}%</span>
                          <div className="h-1.5 w-16 rounded-full bg-line/60 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.complianceRate >= 90
                                  ? "bg-[#0a4f42]"
                                  : item.complianceRate >= 75
                                    ? "bg-[#f1b71e]"
                                    : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.min(100, item.complianceRate)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Badge className="rounded-full bg-[#ddeee3] text-[#0a4f42] text-[9.5px] font-bold border-none px-1.5 py-0.5">
                            {item.goodStandingCount} Good
                          </Badge>
                          {item.probationCount > 0 && (
                            <Badge className="rounded-full bg-[#fceec4] text-[#8a6410] text-[9.5px] font-bold border-none px-1.5 py-0.5">
                              {item.probationCount} Watch
                            </Badge>
                          )}
                          {item.flaggedCount > 0 && (
                            <Badge className="rounded-full bg-rose-100 text-rose-800 text-[9.5px] font-bold border-none px-1.5 py-0.5">
                              {item.flaggedCount} At Risk
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onExplainCategory(tabLabels[activeTab], item)}
                          className="h-7 px-2 text-[11px] font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10 gap-1 rounded-lg"
                        >
                          <Sparkles className="size-3" />
                          <span>Explain</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
