"use client";

import { BookOpen, FileCheck, HeartHandshake, Users } from "lucide-react";
import { useState } from "react";
import { ActiveScholarsTab } from "@/app/(Coordinator)/CoordinatorMonitor/components/ActiveScholarsTab";
import { BaselineAuditsTab } from "@/app/(Coordinator)/CoordinatorMonitor/components/BaselineAuditsTab";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { BaselineAuditDrawer } from "@/components/coordinator/baseline/BaselineAuditDrawer";
import { ScholarMonitorDrawer } from "@/components/coordinator/monitor/ScholarMonitorDrawer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GradeReport } from "@/lib/api/documents";
import { GrantorAppealDrawer } from "./components/GrantorAppealDrawer";
import { GrantorAppealsTab } from "./components/GrantorAppealsTab";
import { GrantorEnrollmentDrawer } from "./components/GrantorEnrollmentDrawer";
import { GrantorEnrollmentsTab } from "./components/GrantorEnrollmentsTab";
import { GrantorMonitorBanners } from "./components/GrantorMonitorBanners";
import { GrantorMonitorHeader } from "./components/GrantorMonitorHeader";
import { useGrantorMonitorData } from "./hooks/useGrantorMonitorData";

export default function GrantorMonitorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active-scholars");

  // Selection & drawer states
  const [selectedScholar, setSelectedScholar] = useState<ActiveScholar | null>(null);
  const [openMonitorDrawer, setOpenMonitorDrawer] = useState(false);
  const [selectedAuditProfileId, setSelectedAuditProfileId] = useState<number | null>(null);
  const [openAuditDrawer, setOpenAuditDrawer] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [openEnrollmentDrawer, setOpenEnrollmentDrawer] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<GradeReport | null>(null);
  const [openAppealDrawer, setOpenAppealDrawer] = useState(false);

  const {
    activeScholars,
    loadingActiveScholars,
    activeScholarsError,
    fetchActiveScholars,
    baselineItems,
    loadingBaselines,
    enrollmentItems,
    loadingEnrollments,
    appealItems,
    loadingAppeals,
    refreshAll,
  } = useGrantorMonitorData();

  const pendingAuditCount = baselineItems.filter(
    (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
  ).length;

  const endorsedEnrollmentCount = enrollmentItems.filter(
    (i) => i.status === "APPROVED" && (!i.disbursement || i.disbursement.status === "PENDING"),
  ).length;

  const pendingAppealCount = appealItems.filter((i) => i.appeal_status === "PENDING_GRANTOR").length;

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <GrantorMonitorHeader />

      {/* Main Content Area */}
      <div className="px-5 pb-24 md:px-10 space-y-4">
        {/* Action Callout Banners */}
        <GrantorMonitorBanners
          endorsedEnrollmentCount={endorsedEnrollmentCount}
          pendingAuditCount={pendingAuditCount}
          pendingAppealCount={pendingAppealCount}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Main 4 Tabs: Active Scholars, Prospectus Audits, Term Enrollments, & Second Chance Appeals */}
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
              {endorsedEnrollmentCount > 0 && (
                <Badge className="ml-1 h-5 rounded-full bg-[#0a4f42] px-1.5 text-[10px] text-white">
                  {endorsedEnrollmentCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="academic-appeals" className="text-xs gap-1.5 font-semibold">
              <HeartHandshake className="size-4" />
              Appeals
              {pendingAppealCount > 0 && (
                <Badge className="ml-1 h-5 rounded-full bg-rose-600 px-1.5 text-[10px] text-white">
                  {pendingAppealCount}
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

          {/* Tab 2: Academic Prospectus & Baseline Audits */}
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

          {/* Tab 3: Term Enrollments & Disbursement Endorsement */}
          <TabsContent value="enrollment-audits">
            <GrantorEnrollmentsTab
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

          {/* Tab 4: Second Chance Academic Appeals */}
          <TabsContent value="academic-appeals">
            <GrantorAppealsTab
              items={appealItems}
              loading={loadingAppeals}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectAppeal={(report) => {
                setSelectedAppeal(report);
                setOpenAppealDrawer(true);
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

      {/* Side Grantor Term Enrollment Drawer */}
      <GrantorEnrollmentDrawer
        enrollmentId={selectedEnrollmentId}
        open={openEnrollmentDrawer}
        onClose={() => setOpenEnrollmentDrawer(false)}
        onReviewed={refreshAll}
      />

      {/* Side Second Chance Appeal Drawer */}
      <GrantorAppealDrawer
        report={selectedAppeal}
        open={openAppealDrawer}
        onClose={() => setOpenAppealDrawer(false)}
        onReviewed={refreshAll}
      />

      {/* Active Scholar Monitor Drawer */}
      <ScholarMonitorDrawer scholar={selectedScholar} open={openMonitorDrawer} onOpenChange={setOpenMonitorDrawer} />
    </div>
  );
}
