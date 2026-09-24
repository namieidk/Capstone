"use client";

import { BookOpen, FileCheck, GraduationCap, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { CoordinatorMonitorHeader } from "@/app/(Coordinator)/CoordinatorMonitor/components/CoordinatorMonitorHeader";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { BaselineAuditDrawer } from "@/components/coordinator/baseline/BaselineAuditDrawer";
import { EnrollmentAuditDrawer } from "@/components/coordinator/enrollment/EnrollmentAuditDrawer";
import { GradeAuditDrawer } from "@/components/coordinator/grade/GradeAuditDrawer";
import { ScholarMonitorDrawer } from "@/components/coordinator/monitor/ScholarMonitorDrawer";
import type { HeaderFilterProps } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveScholarsTab } from "./components/ActiveScholarsTab";
import { BaselineAuditsTab } from "./components/BaselineAuditsTab";
import { CoordinatorGradeAuditsTab } from "./components/CoordinatorGradeAuditsTab";
import { CoordinatorMonitorBanners } from "./components/CoordinatorMonitorBanners";
import { EnrollmentAuditsTab } from "./components/EnrollmentAuditsTab";
import { useCoordinatorMonitorData } from "./hooks/useCoordinatorMonitorData";

export default function CoordinatorMonitorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active-scholars");

  // Per-tab filter state (drives the header's icon-only filter dropdown)
  const [healthFilter, setHealthFilter] = useState("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [baselineFilter, setBaselineFilter] = useState("ALL");
  const [enrollmentFilter, setEnrollmentFilter] = useState("ALL");

  // Selection & drawer states
  const [selectedScholar, setSelectedScholar] = useState<ActiveScholar | null>(null);
  const [openMonitorDrawer, setOpenMonitorDrawer] = useState(false);
  const [selectedAuditProfileId, setSelectedAuditProfileId] = useState<number | null>(null);
  const [openAuditDrawer, setOpenAuditDrawer] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [openEnrollmentDrawer, setOpenEnrollmentDrawer] = useState(false);
  const [selectedGradeDocId, setSelectedGradeDocId] = useState<number | null>(null);
  const [openGradeDrawer, setOpenGradeDrawer] = useState(false);

  const {
    activeScholars,
    loadingActiveScholars,
    activeScholarsError,
    fetchActiveScholars,
    baselineItems,
    loadingBaselines,
    enrollmentItems,
    loadingEnrollments,
    gradeDocs,
    loadingGradeDocs,
    refreshAll,
  } = useCoordinatorMonitorData();

  const pendingAuditCount = baselineItems.filter(
    (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
  ).length;

  const pendingEnrollmentCount = enrollmentItems.filter((i) => i.status === "PENDING_REVIEW").length;
  const pendingGradeDocCount = gradeDocs.filter(
    (i) => i.status === "PENDING" || i.status === "STUDENT_CONFIRMED" || i.status === "PASSED_PRECHECK",
  ).length;

  // Filter config shown in the header, swapped per active tab
  const headerFilter: HeaderFilterProps | undefined = useMemo(() => {
    if (activeTab === "active-scholars") {
      return {
        value: healthFilter,
        onChange: setHealthFilter,
        label: "Health Standing",
        hasActive: healthFilter !== "ALL",
        onClear: () => setHealthFilter("ALL"),
        options: [
          { value: "ALL", label: `All Standings (${activeScholars.length})` },
          { value: "good", label: "On Track" },
          { value: "warn", label: "Needs Attention / Probation" },
          { value: "bad", label: "Action Required" },
        ],
      };
    }
    if (activeTab === "grade-audits") {
      return {
        value: gradeFilter,
        onChange: setGradeFilter,
        label: "Audit Status",
        hasActive: gradeFilter !== "ALL",
        onClear: () => setGradeFilter("ALL"),
        options: [
          { value: "ALL", label: "All Submissions" },
          { value: "PENDING", label: "Awaiting Audit" },
          { value: "VERIFIED", label: "Verified" },
          { value: "NEEDS_REUPLOAD", label: "Needs Re-upload" },
        ],
      };
    }
    if (activeTab === "baseline-audits") {
      const pendingCount = baselineItems.filter(
        (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
      ).length;
      return {
        value: baselineFilter,
        onChange: setBaselineFilter,
        label: "Baseline Status",
        hasActive: baselineFilter !== "ALL",
        onClear: () => setBaselineFilter("ALL"),
        options: [
          { value: "ALL", label: `All Baselines (${baselineItems.length})` },
          { value: "PENDING_COORDINATOR_REVIEW", label: `Ready for Audit (${pendingCount})` },
          { value: "PENDING_PROSPECTUS", label: "Draft Ingestion" },
          { value: "BASELINE_FROZEN", label: "Locked Baselines" },
        ],
      };
    }
    if (activeTab === "enrollment-audits") {
      const pendingCount = enrollmentItems.filter(
        (i) => i.status === "PENDING_REVIEW" || i.status === "SUBMITTED",
      ).length;
      return {
        value: enrollmentFilter,
        onChange: setEnrollmentFilter,
        label: "Term Status",
        hasActive: enrollmentFilter !== "ALL",
        onClear: () => setEnrollmentFilter("ALL"),
        options: [
          { value: "ALL", label: `All Enrollments (${enrollmentItems.length})` },
          { value: "PENDING", label: `Pending Review (${pendingCount})` },
          { value: "APPROVED", label: "Endorsed to Grantor" },
          { value: "COMPLETED", label: "Completed" },
          { value: "CHANGES_REQUESTED", label: "Changes Requested" },
          { value: "REJECTED", label: "Rejected" },
        ],
      };
    }
    return undefined;
  }, [
    activeTab,
    healthFilter,
    gradeFilter,
    baselineFilter,
    enrollmentFilter,
    activeScholars.length,
    baselineItems,
    enrollmentItems,
  ]);

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <CoordinatorMonitorHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} filter={headerFilter} />

      {/* Main Content Area */}
      <div className="px-5 pb-24 md:px-10 space-y-4">
        {/* Action Callout Banners */}
        <CoordinatorMonitorBanners
          pendingAuditCount={pendingAuditCount}
          pendingEnrollmentCount={pendingEnrollmentCount}
          pendingGradeDocCount={pendingGradeDocCount}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Main 4 Tabs: Active Scholars, Prospectus Audits, Term Enrollments, & CCG Audits */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5 w-full space-y-4">
          <TabsList className="grid h-11 w-full grid-cols-4 rounded-full bg-[#f1efe9] p-1 sm:w-210">
            <TabsTrigger
              value="active-scholars"
              className="gap-1.5 rounded-full text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
            >
              <Users className="size-3.5" />
              Active Scholars
              {!loadingActiveScholars && activeScholars.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4.5 min-w-4.5 rounded-full px-1 text-[10px] font-bold">
                  {activeScholars.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="baseline-audits"
              className="gap-1.5 rounded-full text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
            >
              <BookOpen className="size-3.5" />
              Prospectus Audits
              {pendingAuditCount > 0 && (
                <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {pendingAuditCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="enrollment-audits"
              className="gap-1.5 rounded-full text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
            >
              <FileCheck className="size-3.5" />
              Term Enrollments
              {pendingEnrollmentCount > 0 && (
                <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#0a4f42] px-1 text-[10px] font-bold text-white">
                  {pendingEnrollmentCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="grade-audits"
              className="gap-1.5 rounded-full text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
            >
              <GraduationCap className="size-3.5" />
              Grade Audits
              {pendingGradeDocCount > 0 && (
                <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {pendingGradeDocCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Active Scholars Directory */}
          <TabsContent value="active-scholars">
            <ActiveScholarsTab
              scholars={activeScholars}
              loading={loadingActiveScholars}
              loadError={activeScholarsError}
              onRetry={fetchActiveScholars}
              searchQuery={searchQuery}
              healthFilter={healthFilter}
              onSelectScholar={(sch) => {
                setSelectedScholar(sch);
                setOpenMonitorDrawer(true);
              }}
            />
          </TabsContent>

          {/* Tab 2: Prospectus Audits */}
          <TabsContent value="baseline-audits">
            <BaselineAuditsTab
              items={baselineItems}
              loading={loadingBaselines}
              searchQuery={searchQuery}
              filter={baselineFilter}
              onSelectScholar={(id) => {
                setSelectedAuditProfileId(id);
                setOpenAuditDrawer(true);
              }}
            />
          </TabsContent>

          {/* Tab 3: Term Enrollments */}
          <TabsContent value="enrollment-audits">
            <EnrollmentAuditsTab
              items={enrollmentItems}
              loading={loadingEnrollments}
              searchQuery={searchQuery}
              filter={enrollmentFilter}
              onSelectAudit={(id) => {
                setSelectedEnrollmentId(id);
                setOpenEnrollmentDrawer(true);
              }}
            />
          </TabsContent>

          {/* Tab 4: CCG / Grade Audits */}
          <TabsContent value="grade-audits">
            <CoordinatorGradeAuditsTab
              items={gradeDocs}
              loading={loadingGradeDocs}
              searchQuery={searchQuery}
              filter={gradeFilter}
              onSelectAudit={(id) => {
                setSelectedGradeDocId(id);
                setOpenGradeDrawer(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Side Baseline Audit Drawer */}
      <BaselineAuditDrawer
        scholarProfileId={selectedAuditProfileId}
        open={openAuditDrawer}
        onOpenChange={setOpenAuditDrawer}
        onSuccess={refreshAll}
      />

      {/* Side Term Enrollment Audit Drawer */}
      <EnrollmentAuditDrawer
        enrollmentId={selectedEnrollmentId}
        open={openEnrollmentDrawer}
        onClose={() => setOpenEnrollmentDrawer(false)}
        onReviewed={refreshAll}
      />

      {/* Side Grade Audit Drawer */}
      <GradeAuditDrawer
        documentId={selectedGradeDocId}
        open={openGradeDrawer}
        onClose={() => setOpenGradeDrawer(false)}
        onReviewed={refreshAll}
      />

      {/* Active Scholar Monitor Drawer */}
      <ScholarMonitorDrawer scholar={selectedScholar} open={openMonitorDrawer} onOpenChange={setOpenMonitorDrawer} />
    </div>
  );
}
