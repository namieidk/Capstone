"use client";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ScholarAcademicStandingBanner } from "./components/ScholarAcademicStandingBanner";
import { ScholarAnnouncementsCard } from "./components/ScholarAnnouncementsCard";
import { ScholarCoordinatorAndMeetingsCard } from "./components/ScholarCoordinatorAndMeetingsCard";
import { ScholarCurriculumProgressCard } from "./components/ScholarCurriculumProgressCard";
import { ScholarDashboardHeader } from "./components/ScholarDashboardHeader";
import { ScholarDashboardSkeleton } from "./components/ScholarDashboardSkeleton";
import { ScholarDisbursementCard } from "./components/ScholarDisbursementCard";
import { ScholarEnrollmentQuickHub } from "./components/ScholarEnrollmentQuickHub";
import { ScholarKpiCards } from "./components/ScholarKpiCards";
import { useScholarDashboardData } from "./hooks/useScholarDashboardData";

export default function ScholarDashboardPage() {
  const { data, loading, loadError, refetch } = useScholarDashboardData();

  if (loading && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader title="Scholar Dashboard" subtitle="Academic Standing & Grant Management" />
        <ScholarDashboardSkeleton />
      </div>
    );
  }

  if (loadError && !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <PageHeader title="Scholar Dashboard" subtitle="Academic Standing & Grant Management" />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-rose-950">
            <h2 className="text-base font-bold">Failed to Load Scholar Dashboard</h2>
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
        <PageHeader title="Scholar Dashboard" subtitle="Academic Standing & Grant Management" />
        <ScholarDashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* Top Header */}
      <PageHeader title="Scholar Dashboard" subtitle="Academic Standing, Curriculum & Grant Management" />

      {/* Main Content Body */}
      <div className="flex-1 space-y-6 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {/* 1. Scholar Identity & Program Header */}
        <ScholarDashboardHeader profile={data.profile} onRefresh={() => refetch(true)} isRefreshing={loading} />

        {/* 2. Dynamic Academic Standing / Probation / Appeal Alert Banner */}
        <ScholarAcademicStandingBanner standing={data.academic_standing} />

        {/* 3. Core Metric KPI Cards (4 metrics) */}
        <ScholarKpiCards
          standing={data.academic_standing}
          curriculum={data.curriculum}
          latestEnrollment={data.latest_enrollment}
          disbursements={data.disbursements}
        />

        {/* 4. Row 1 Operational Grid: Curriculum Roadmap & Term Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScholarCurriculumProgressCard curriculum={data.curriculum} />
          <ScholarEnrollmentQuickHub
            latestEnrollment={data.latest_enrollment}
            pendingOrCount={data.disbursements.pending_or_count}
          />
        </div>

        {/* 5. Row 2 Operational Grid: Financial Aid Disbursements + Coordinator Guidance & Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScholarDisbursementCard disbursements={data.disbursements} />
          <ScholarCoordinatorAndMeetingsCard communication={data.communication} meetings={data.upcoming_meetings} />
        </div>

        {/* 6. Row 3: Announcements & Community Forum */}
        <ScholarAnnouncementsCard announcements={data.announcements} />
      </div>
    </div>
  );
}
