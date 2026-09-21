"use client";

import { BookOpen, FileCheck, GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { BaselineAuditDrawer } from "@/components/coordinator/baseline/BaselineAuditDrawer";
import { EnrollmentAuditDrawer } from "@/components/coordinator/enrollment/EnrollmentAuditDrawer";
import { GradeAuditDrawer } from "@/components/coordinator/grade/GradeAuditDrawer";
import { ScholarMonitorDrawer } from "@/components/coordinator/monitor/ScholarMonitorDrawer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveScholarsTab } from "./components/ActiveScholarsTab";
import { BaselineAuditsTab } from "./components/BaselineAuditsTab";
import { CoordinatorGradeAuditsTab } from "./components/CoordinatorGradeAuditsTab";
import { CoordinatorMonitorBanners } from "./components/CoordinatorMonitorBanners";
import { CoordinatorMonitorHeader } from "./components/CoordinatorMonitorHeader";
import { EnrollmentAuditsTab } from "./components/EnrollmentAuditsTab";
import { useCoordinatorMonitorData } from "./hooks/useCoordinatorMonitorData";

export default function CoordinatorMonitorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active-scholars");

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

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <CoordinatorMonitorHeader />

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
          <TabsList className="grid w-full sm:w-210 grid-cols-4">
            <TabsTrigger value="active-scholars" className="text-xs gap-1.5 font-semibold">
              <Users className="size-4" />
              Active Scholars
              {!loadingActiveScholars && activeScholars.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[10px]">
                  {activeScholars.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="baseline-audits" className="text-xs gap-1.5 font-semibold">
              <BookOpen className="size-4" />
              Prospectus Audits
              {pendingAuditCount > 0 && (
                <Badge className="ml-1 h-5 rounded-full bg-amber-500 px-1.5 text-[10px] text-white">
                  {pendingAuditCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="enrollment-audits" className="text-xs gap-1.5 font-semibold">
              <FileCheck className="size-4" />
              Term Enrollments
              {pendingEnrollmentCount > 0 && (
                <Badge className="ml-1 h-5 rounded-full bg-[#0a4f42] px-1.5 text-[10px] text-white">
                  {pendingEnrollmentCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="grade-audits" className="text-xs gap-1.5 font-semibold">
              <GraduationCap className="size-4" />
              Grade Audits
              {pendingGradeDocCount > 0 && (
                <Badge className="ml-1 h-5 rounded-full bg-emerald-600 px-1.5 text-[10px] text-white">
                  {pendingGradeDocCount}
                </Badge>
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
              onSearchChange={setSearchQuery}
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
              onSearchChange={setSearchQuery}
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
              onSearchChange={setSearchQuery}
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
              onSearchChange={setSearchQuery}
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
