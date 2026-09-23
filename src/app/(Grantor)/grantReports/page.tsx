"use client";

import { DollarSign, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AiChartExplanationModal } from "@/components/analytics/AiChartExplanationModal";
import { AnalyticsKpiCards } from "@/components/analytics/AnalyticsKpiCards";
import { CohortCategoryTable } from "@/components/analytics/CohortCategoryTable";
import { ExportAnalyticsButton } from "@/components/analytics/ExportAnalyticsButton";
import { GwaDispersionChart } from "@/components/analytics/GwaDispersionChart";
import { ScholarPercentileRankCard } from "@/components/analytics/ScholarPercentileRankCard";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type AiExplanationResponse,
  type AnalyticsSummaryResponse,
  type CategoryBreakdownItem,
  explainAnalyticsChart,
  getAnalyticsSummary,
} from "@/lib/api/analytics";

export default function GrantAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Explanation Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiCategory, setAiCategory] = useState<string | undefined>(undefined);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AiExplanationResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const res = await getAnalyticsSummary();
      setData(res);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to load analytics data.";
      setError(errMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const handleExplain = async (
    chartType: string,
    title: string,
    metrics: Record<string, unknown>,
    category?: string,
  ) => {
    setAiTitle(title);
    setAiCategory(category);
    setAiExplanation(null);
    setAiError(null);
    setAiLoading(true);
    setAiModalOpen(true);

    try {
      const res = await explainAnalyticsChart({
        chartType,
        title,
        category,
        metrics,
      });
      setAiExplanation(res);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Could not generate AI explanation.";
      setAiError(errMsg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleExplainCategory = (categoryType: string, item: CategoryBreakdownItem) => {
    handleExplain(
      "CATEGORY_BREAKDOWN",
      `${categoryType}: ${item.category}`,
      {
        category: item.category,
        mean: item.mean,
        standardDeviation: item.standardDeviation,
        complianceRate: item.complianceRate,
        count: item.count,
        goodStandingCount: item.goodStandingCount,
        probationCount: item.probationCount,
        flaggedCount: item.flaggedCount,
      },
      item.category,
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF8F5]">
      {/* Top Navigation Bar */}
      <PageHeader
        title="Analytics"
        subtitle="Scholar performance, passing rates & scholarship spending"
        actions={
          <div className="flex items-center gap-2.5">
            <ExportAnalyticsButton data={data} userRole="GRANTOR" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={refreshing || loading}
              onClick={handleRefresh}
              className="h-8 gap-1.5 rounded-xl border-line/80 bg-white text-xs font-semibold text-[#14213a] hover:bg-[#FAF8F5] shadow-2xs"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-[#0a4f42]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-3 text-center">
            <div className="size-9 animate-spin rounded-full border-3 border-[#0a4f42] border-t-transparent" />
            <p className="text-xs font-bold text-[#14213a]">Loading analytics...</p>
            <p className="text-[11px] text-muted-foreground">
              Calculating scholar grades, passing rates, and spending data.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-800">
            <p className="font-bold">Failed to load analytics</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchAnalytics}
              className="mt-4 rounded-xl text-xs"
            >
              Retry
            </Button>
          </div>
        ) : data ? (
          <>
            {/* 1. Descriptive Analytics KPI Cards */}
            <AnalyticsKpiCards
              stats={data.overallStats}
              globalThreshold={data.globalThresholdPercent}
              financialAnalytics={data.financialAnalytics}
              userRole="GRANTOR"
              onExplain={(type, title, metrics) => handleExplain(type, title, metrics)}
            />

            {/* 2. Main Grid: Grade Overview & Scholar Rankings */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-7">
                <GwaDispersionChart
                  stats={data.overallStats}
                  scholars={data.scholars}
                  globalThreshold={data.globalThresholdPercent}
                  onExplain={() =>
                    handleExplain("GRADE_DISTRIBUTION", "Grade Overview", {
                      mean: data.overallStats.mean,
                      standardDeviation: data.overallStats.standardDeviation,
                      complianceRate: data.overallStats.complianceRate,
                      min: data.overallStats.min,
                      max: data.overallStats.max,
                      median: data.overallStats.median,
                      count: data.overallStats.count,
                    })
                  }
                />
              </div>

              {/* Scholar Rankings Leaderboard */}
              <div className="xl:col-span-5">
                <ScholarPercentileRankCard scholars={data.scholars} globalThreshold={data.globalThresholdPercent} />
              </div>
            </div>

            {/* 3. Categorical Descriptive Statistics Table */}
            <CohortCategoryTable
              courseBreakdown={data.courseBreakdown}
              trackBreakdown={data.trackBreakdown}
              schoolBreakdown={data.schoolBreakdown}
              globalThreshold={data.globalThresholdPercent}
              onExplainCategory={handleExplainCategory}
            />

            {/* 4. Financial Capital Deployment by Track */}
            <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-5 pb-3 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#f1b71e]/20 text-[#8a6410]">
                    <DollarSign className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#14213a]">Funds Released by Track</h2>
                    <p className="text-xs text-muted-foreground">
                      Scholarship grant spending across program tracks · Total Released:{" "}
                      <strong className="text-[#0a4f42]">
                        ₱{data.financialAnalytics.totalDisbursedSum.toLocaleString()}
                      </strong>
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Explain with AI"
                  onClick={() =>
                    handleExplain("FINANCIAL_ALLOCATION", "Funds Released by Track", {
                      totalDisbursed: data.financialAnalytics.totalDisbursedSum,
                      disbByTrack: data.financialAnalytics.disbByTrack,
                    })
                  }
                  className="h-8 gap-1.5 rounded-lg border-[#8a6410]/30 bg-[#fceec4]/40 text-xs font-semibold text-[#8a6410] hover:bg-[#fceec4]"
                >
                  <Sparkles className="size-3.5" />
                  <span>Explain</span>
                </Button>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                {(() => {
                  const DEFAULT_TRACKS = ["Academic Track", "Financial Need Track", "Returning Scholar"];
                  const trackList = [...(data.financialAnalytics.disbByTrack || [])];
                  for (const t of DEFAULT_TRACKS) {
                    if (!trackList.some((item) => item.track.toLowerCase() === t.toLowerCase())) {
                      trackList.push({ track: t, amount: 0 });
                    }
                  }
                  const total = data.financialAnalytics.totalDisbursedSum || 1;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {trackList.map((item) => {
                        const pct =
                          data.financialAnalytics.totalDisbursedSum > 0 ? Math.round((item.amount / total) * 100) : 0;
                        return (
                          <div
                            key={item.track}
                            className="rounded-xl border border-line/70 bg-[#FAF8F5]/70 p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#14213a] text-xs">{item.track}</span>
                              <Badge className="rounded-full bg-white border border-line/70 text-[10px] font-bold text-[#14213a]">
                                {pct}% of total
                              </Badge>
                            </div>

                            <p className="text-xl font-black text-[#0a4f42]">₱{item.amount.toLocaleString()}</p>

                            <div className="space-y-1">
                              <div className="h-2 w-full rounded-full bg-white border border-line/60 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#0a4f42] transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>

      {/* AI Explanation Modal */}
      <AiChartExplanationModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiTitle}
        category={aiCategory}
        loading={aiLoading}
        explanation={aiExplanation}
        error={aiError}
      />
    </div>
  );
}
