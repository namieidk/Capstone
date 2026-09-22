"use client";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CoordinatorApplicantPipelineCard } from "./components/CoordinatorApplicantPipelineCard";
import { CoordinatorDashboardHeader } from "./components/CoordinatorDashboardHeader";
import { CoordinatorDashboardSkeleton } from "./components/CoordinatorDashboardSkeleton";
import { CoordinatorDisbursementClearanceCard } from "./components/CoordinatorDisbursementClearanceCard";
import { CoordinatorEnrollmentQueueCard } from "./components/CoordinatorEnrollmentQueueCard";
import { CoordinatorKpiCards } from "./components/CoordinatorKpiCards";
import { CoordinatorMeetingsAndMessagesCard } from "./components/CoordinatorMeetingsAndMessagesCard";
import { CoordinatorScholarHealthCard } from "./components/CoordinatorScholarHealthCard";
import { CoordinatorUrgentActionsBanner } from "./components/CoordinatorUrgentActionsBanner";
import { useCoordinatorDashboardData } from "./hooks/useCoordinatorDashboardData";

export default function CoordinatorDashboardPage() {
  const { user } = useAuth();
  const { data, loading, loadError, refetch } = useCoordinatorDashboardData();

  const coordinatorName = user ? `${user.first_name} ${user.last_name}`.trim() : "Coordinator";

  if (loading && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader title="Coordinator Dashboard" subtitle="Intake Pipeline, Scholar Monitoring & Disbursements" />
        <CoordinatorDashboardSkeleton />
      </div>
    );
  }

  if (loadError && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader title="Coordinator Dashboard" subtitle="Intake Pipeline, Scholar Monitoring & Disbursements" />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-rose-950">
            <h2 className="text-base font-bold">Failed to Load Coordinator Dashboard</h2>
            <p className="text-xs text-rose-800/80 leading-relaxed">{loadError}</p>
            <Button
              type="button"
              onClick={() => refetch()}
              className="mt-2 rounded-full bg-rose-700 px-5 text-xs font-semibold text-white! hover:bg-rose-800"
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
        <PageHeader title="Coordinator Dashboard" subtitle="Intake Pipeline, Scholar Monitoring & Disbursements" />
        <CoordinatorDashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Top Header */}
      <PageHeader
        title="Coordinator Dashboard"
        subtitle="Applicant Pipeline, Scholar Baseline Monitoring & Disbursement Clearance"
      />

      {/* Main Content Body */}
      <div className="flex-1 space-y-6 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {/* 1. Header & Identity */}
        <CoordinatorDashboardHeader
          coordinatorName={coordinatorName}
          onRefresh={() => refetch(true)}
          isRefreshing={loading}
        />

        {/* 2. Urgent Actions Alert Banner */}
        <CoordinatorUrgentActionsBanner kpis={data.kpis} />

        {/* 3. Core Operational KPI Cards (4 metrics) */}
        <CoordinatorKpiCards kpis={data.kpis} />

        {/* 4. Row 1: Applicant Pipeline Funnel + Scholar Academic Standing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CoordinatorApplicantPipelineCard
            applicantStages={data.applicantStages}
            recentApplicants={data.recentApplicants}
          />
          <CoordinatorScholarHealthCard scholars={data.scholars} />
        </div>

        {/* 5. Row 2: Term Enrollment Queue + Disbursements & OR Clearance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CoordinatorEnrollmentQueueCard enrollmentQueue={data.enrollmentQueue} />
          <CoordinatorDisbursementClearanceCard disbursements={data.disbursements} />
        </div>

        {/* 6. Row 3: Upcoming Interviews & Direct Messages */}
        <CoordinatorMeetingsAndMessagesCard meetings={data.meetings} conversations={data.recentConversations} />
      </div>
    </div>
  );
}
