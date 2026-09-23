"use client";

import { RefreshCw, Sparkles, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AiChartExplanationModal } from "@/components/analytics/AiChartExplanationModal";
import { AnalyticsKpiCards } from "@/components/analytics/AnalyticsKpiCards";
import { CohortCategoryTable } from "@/components/analytics/CohortCategoryTable";
import { ExportAnalyticsButton } from "@/components/analytics/ExportAnalyticsButton";
import { GwaDispersionChart } from "@/components/analytics/GwaDispersionChart";
import { ScholarPercentileRankCard } from "@/components/analytics/ScholarPercentileRankCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type AiExplanationResponse,
  type AnalyticsSummaryResponse,
  type CategoryBreakdownItem,
  explainAnalyticsChart,
  getAnalyticsSummary,
} from "@/lib/api/analytics";

export default function CoordinatorAnalyticsPage() {
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
        subtitle="Scholar performance, document status & application pipeline"
        actions={
          <div className="flex items-center gap-2.5">
            <ExportAnalyticsButton data={data} userRole="COORDINATOR" />
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
              Calculating scholar grades, passing rates, and document status.
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
              documentCompliance={data.documentCompliance}
              userRole="COORDINATOR"
              onExplain={(type, title, metrics) => handleExplain(type, title, metrics)}
            />

            {/* 2. Main Grid: GWA Dispersion Boxplot & Intake Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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

              {/* Intake Conversion Funnel Card */}
              <div>
                <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42]">
                        <Users className="size-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-[#14213a]">Application Pipeline</h2>
                        <p className="text-[11px] text-muted-foreground">Where are applicants right now?</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Explain with AI"
                      onClick={() =>
                        handleExplain("INTAKE_FUNNEL", "Application Pipeline", {
                          funnel: data.intakeFunnel,
                        })
                      }
                      className="size-6 text-[#0a4f42] hover:bg-[#0a4f42]/10 rounded-full"
                    >
                      <Sparkles className="size-3.5" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-5 pt-1 space-y-3.5">
                    {data.intakeFunnel.map((stage) => (
                      <div key={stage.stage} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#14213a]">{stage.stage}</span>
                          <span className="font-bold text-[#0a4f42]">
                            {stage.count} ({stage.pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#FAF8F5] border border-line/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0a4f42] transition-all"
                            style={{ width: `${stage.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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

            {/* 4. Individual Scholar Relative Peer Rankings & Percentiles */}
            <ScholarPercentileRankCard scholars={data.scholars} globalThreshold={data.globalThresholdPercent} />
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
