"use client";

import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
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
  const { loading, loadError, data, refetch } = useGrantorDashboardData();

  if (loading && !data) {
    return (
      <div className="space-y-6">
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
      <div className="space-y-6">
        <PageHeader
          title="Grantor Executive Dashboard"
          subtitle="Scholarship program oversight, candidate verdicts & fund releases"
        />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
          <AlertCircle className="mx-auto mb-2 size-6" />
          <p className="font-semibold">Failed to load Grantor Dashboard data</p>
          <p className="text-xs text-muted-foreground mt-1">{loadError}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[#0a4f42] px-4 py-1.5 text-xs font-semibold text-white! shadow-xs hover:bg-[#083c32]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const grantorName =
    user?.employee?.first_name && user?.employee?.last_name
      ? `${user.employee.first_name} ${user.employee.last_name}`
      : user?.email?.split("@")[0] || "Executive Sponsor";

  const grantorTitle = user?.employee?.title || "Scholarship Grantor & Sponsor";
  const grantorOrg = user?.employee?.department || "Executive Board";

  const kpis = data?.kpis || {
    endorsedApplicantsCount: 0,
    totalApplicants: 0,
    pendingAppealsCount: 0,
    pendingDisbursementsCount: 0,
    pendingDisbursementsSum: 0,
    totalScholars: 0,
    goodStandingCount: 0,
    probationCount: 0,
    actionRequiredCount: 0,
    totalDisbursedSum: 0,
    pendingOrCount: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grantor Executive Dashboard"
        subtitle="Scholarship program oversight, candidate verdicts & fund releases"
      />

      {/* 1. Header Banner */}
      <GrantorDashboardHeader
        grantorName={grantorName}
        grantorTitle={grantorTitle}
        grantorOrg={grantorOrg}
        onRefresh={() => refetch(true)}
      />

      {/* 2. Operational Verdict Banner */}
      <GrantorUrgentActionsBanner kpis={kpis} />

      {/* 3. Top Row KPI Meters */}
      <GrantorKpiCards kpis={kpis} />

      {/* 4. Primary Decision Queues (Endorsed Candidates + Academic Appeals) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GrantorEndorsedApplicantsCard applicants={data?.endorsedApplicants || []} />
        <GrantorAppealsReviewCard appeals={data?.pendingAppeals || []} />
      </div>

      {/* 5. Financial Authorizations & Scholar Program Retention */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GrantorDisbursementQueueCard disbursements={data?.pendingDisbursements || []} />
        <GrantorScholarHealthCard scholars={data?.scholars || []} />
      </div>

      {/* 6. Executive Meetings & Comms */}
      <GrantorMeetingsAndCommsCard meetings={data?.meetings || []} conversations={data?.recentConversations || []} />
    </div>
  );
}
