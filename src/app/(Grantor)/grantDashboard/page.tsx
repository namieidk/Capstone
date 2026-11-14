"use client";

import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GrantorAppealsReviewCard } from "./components/GrantorAppealsReviewCard";
import { GrantorDashboardHeader } from "./components/GrantorDashboardHeader";
import { GrantorDashboardSkeleton } from "./components/GrantorDashboardSkeleton";
import { GrantorDisbursementQueueCard } from "./components/GrantorDisbursementQueueCard";
import { GrantorEndorsedApplicantsCard } from "./components/GrantorEndorsedApplicantsCard";
import { GrantorKpiCards } from "./components/GrantorKpiCards";
import { GrantorMeetingsAndCommsCard } from "./components/GrantorMeetingsAndCommsCard";
import { GrantorScholarHealthCard } from "./components/GrantorScholarHealthCard";
import { GrantorUrgentActionsBanner } from "./components/GrantorUrgentActionsBanner";
import { useGrantorDashboardData } from "./hooks/useGrantorDashboardData";

export default function GrantorDashboardPage() {
  const { user } = useAuth();
  const { loading, refreshing, loadError, data, refetch, refresh } = useGrantorDashboardData();

  if (loading && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader
          title="Grantor Executive Dashboard"
          subtitle="Scholarship program oversight, candidate verdicts & fund releases"
        />
        <GrantorDashboardSkeleton />
      </div>
    );
  }

  if (loadError && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader
          title="Grantor Executive Dashboard"
          subtitle="Scholarship program oversight, candidate verdicts & fund releases"
        />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            <AlertCircle className="mx-auto size-6 text-destructive" />
            <h2 className="text-base font-bold">Failed to load Grantor Dashboard data</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{loadError}</p>
            <Button
              type="button"
              onClick={() => refetch()}
              className="mt-2 rounded-full bg-[#0a4f42] px-5 text-xs font-semibold text-white! hover:bg-[#083c32]"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader
          title="Grantor Executive Dashboard"
          subtitle="Scholarship program oversight, candidate verdicts & fund releases"
        />
        <GrantorDashboardSkeleton />
      </div>
    );
  }

  const grantorName =
    user?.employee?.first_name && user?.employee?.last_name
      ? `${user.employee.first_name} ${user.employee.last_name}`
      : user?.email?.split("@")[0] || "Executive Sponsor";

  const grantorTitle = user?.employee?.title || "Scholarship Grantor & Executive Sponsor";
  const grantorOrg = user?.employee?.department || "Scholarship Foundation";

  const kpis = data.kpis;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Top Header */}
      <PageHeader
        title="Grantor Executive Dashboard"
        subtitle="Scholarship program oversight, candidate verdicts & fund releases"
      />

      {/* Main Content Body */}
      <div className="flex-1 space-y-6 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {/* 1. Header Banner */}
        <GrantorDashboardHeader
          grantorName={grantorName}
          grantorTitle={grantorTitle}
          grantorOrg={grantorOrg}
          onRefresh={refresh}
          isRefreshing={refreshing}
        />

        {/* 2. Operational Verdict Banner */}
        <GrantorUrgentActionsBanner kpis={kpis} />

        {/* 3. Top Row KPI Meters */}
        <GrantorKpiCards kpis={kpis} />

        {/* 4. Primary Decision Queues (Endorsed Candidates + Academic Appeals) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GrantorEndorsedApplicantsCard applicants={data.endorsedApplicants} />
          <GrantorAppealsReviewCard appeals={data.pendingAppeals} />
        </div>

        {/* 5. Financial Authorizations & Scholar Program Retention */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GrantorDisbursementQueueCard disbursements={data.pendingDisbursements} />
          <GrantorScholarHealthCard scholars={data.scholars} />
        </div>

        {/* 6. Executive Meetings & Comms */}
        <GrantorMeetingsAndCommsCard meetings={data.meetings} conversations={data.recentConversations} />
      </div>
    </div>
  );
}
