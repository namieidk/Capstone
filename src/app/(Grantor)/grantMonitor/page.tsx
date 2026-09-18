"use client";

import { ArrowRight, BookOpen, FileCheck, Users } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActiveScholarsTab } from "@/app/(Coordinator)/CoordinatorMonitor/components/ActiveScholarsTab";
import { BaselineAuditsTab } from "@/app/(Coordinator)/CoordinatorMonitor/components/BaselineAuditsTab";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { BaselineAuditDrawer } from "@/components/coordinator/baseline/BaselineAuditDrawer";
import { ScholarMonitorDrawer } from "@/components/coordinator/monitor/ScholarMonitorDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocketContext } from "@/contexts/SocketContext";
import {
  getCoordinatorActiveScholars,
  getCoordinatorPendingBaselines,
  type PendingBaselineItem,
} from "@/lib/api/baseline";
import { getCoordinatorPendingEnrollments, type TermEnrollment } from "@/lib/api/enrollment";
import { GrantorEnrollmentDrawer } from "./components/GrantorEnrollmentDrawer";
import { GrantorEnrollmentsTab } from "./components/GrantorEnrollmentsTab";
import { GrantorMonitorHeader } from "./components/GrantorMonitorHeader";

export default function GrantorMonitorPage() {
  const { socket } = useContext(SocketContext);

  // Search & Navigation state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active-scholars");

  // Active Monitoring State
  const [activeScholars, setActiveScholars] = useState<ActiveScholar[]>([]);
  const [loadingActiveScholars, setLoadingActiveScholars] = useState(true);
  const [activeScholarsError, setActiveScholarsError] = useState("");
  const [selectedScholar, setSelectedScholar] = useState<ActiveScholar | null>(null);
  const [openMonitorDrawer, setOpenMonitorDrawer] = useState(false);

  // Baseline Audit State
  const [baselineItems, setBaselineItems] = useState<PendingBaselineItem[]>([]);
  const [loadingBaselines, setLoadingBaselines] = useState(true);
  const [selectedAuditProfileId, setSelectedAuditProfileId] = useState<number | null>(null);
  const [openAuditDrawer, setOpenAuditDrawer] = useState(false);

  // Term Enrollment & Disbursement State
  const [enrollmentItems, setEnrollmentItems] = useState<TermEnrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [openEnrollmentDrawer, setOpenEnrollmentDrawer] = useState(false);

  const fetchActiveScholars = useCallback(async () => {
    try {
      setLoadingActiveScholars(true);
      setActiveScholarsError("");
      const data = await getCoordinatorActiveScholars();
      setActiveScholars(data || []);
      setSelectedScholar((prev) => (prev ? (data?.find((s) => s.id === prev.id) ?? prev) : null));
    } catch (err) {
      console.error("Failed to load active scholars:", err);
      setActiveScholarsError(err instanceof Error ? err.message : "Failed to load active scholars.");
    } finally {
      setLoadingActiveScholars(false);
    }
  }, []);

  const fetchPendingBaselines = useCallback(async () => {
    try {
      setLoadingBaselines(true);
      const data = await getCoordinatorPendingBaselines();
      setBaselineItems(data || []);
    } catch (err) {
      console.error("Failed to load grantor pending baselines:", err);
    } finally {
      setLoadingBaselines(false);
    }
  }, []);

  const fetchPendingEnrollments = useCallback(async () => {
    try {
      setLoadingEnrollments(true);
      const data = await getCoordinatorPendingEnrollments();
      setEnrollmentItems(data || []);
    } catch (err) {
      console.error("Failed to load pending enrollments for grantor:", err);
    } finally {
      setLoadingEnrollments(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchActiveScholars();
    fetchPendingBaselines();
    fetchPendingEnrollments();
  }, [fetchActiveScholars, fetchPendingBaselines, fetchPendingEnrollments]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Real-time socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      refreshAll();
    };

    socket.on("baseline:submitted_for_review", handleRefresh);
    socket.on("baseline:prospectus_processed", handleRefresh);
    socket.on("baseline:frozen", handleRefresh);
    socket.on("baseline:unfrozen", handleRefresh);
    socket.on("school_grading:verified", handleRefresh);
    socket.on("enrollment:submitted_for_review", handleRefresh);
    socket.on("enrollment:approved", handleRefresh);
    socket.on("enrollment:changes_requested", handleRefresh);
    socket.on("application:stage_updated", handleRefresh);
    socket.on("contract:signed", handleRefresh);
    socket.on("disbursement:created", handleRefresh);
    socket.on("disbursement:updated", handleRefresh);
    socket.on("grade_report:submitted", handleRefresh);

    return () => {
      socket.off("baseline:submitted_for_review", handleRefresh);
      socket.off("baseline:prospectus_processed", handleRefresh);
      socket.off("baseline:frozen", handleRefresh);
      socket.off("baseline:unfrozen", handleRefresh);
      socket.off("school_grading:verified", handleRefresh);
      socket.off("enrollment:submitted_for_review", handleRefresh);
      socket.off("enrollment:approved", handleRefresh);
      socket.off("enrollment:changes_requested", handleRefresh);
      socket.off("application:stage_updated", handleRefresh);
      socket.off("contract:signed", handleRefresh);
      socket.off("disbursement:created", handleRefresh);
      socket.off("disbursement:updated", handleRefresh);
      socket.off("grade_report:submitted", handleRefresh);
    };
  }, [socket, refreshAll]);

  const handleSelectScholarForAudit = (profileId: number) => {
    setSelectedAuditProfileId(profileId);
    setOpenAuditDrawer(true);
  };

  const handleSelectEnrollment = (enrollmentId: number) => {
    setSelectedEnrollmentId(enrollmentId);
    setOpenEnrollmentDrawer(true);
  };

  const pendingAuditCount = baselineItems.filter(
    (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
  ).length;

  const endorsedEnrollmentCount = enrollmentItems.filter(
    (i) => i.status === "APPROVED" && (!i.disbursement || i.disbursement.status === "PENDING"),
  ).length;

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <GrantorMonitorHeader />

      {/* Main Content Area */}
      <div className="px-5 pb-24 md:px-10 space-y-4">
        {/* Action Callout Banner for Endorsed Enrollments Awaiting Grantor Approval */}
        {endorsedEnrollmentCount > 0 && activeTab !== "enrollment-audits" && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-950 dark:text-teal-100 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#0a4f42] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-200">
                  {endorsedEnrollmentCount} {endorsedEnrollmentCount === 1 ? "enrollment has" : "enrollments have"} been
                  endorsed by the Coordinator.
                </span>{" "}
                <span className="text-muted-foreground hidden md:inline">
                  Review verified course credentials and authorize tuition disbursements.
                </span>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("enrollment-audits")}
              className="h-7.5 px-3 rounded-lg border-teal-500/40 bg-white/90 dark:bg-teal-950/40 hover:bg-white text-[#0a4f42] font-semibold text-xs shrink-0 gap-1.5 shadow-2xs self-start sm:self-auto"
            >
              <span>Review Endorsements ({endorsedEnrollmentCount})</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        )}

        {/* Action Callout Banner for Pending Prospectus Audits */}
        {pendingAuditCount > 0 && activeTab !== "baseline-audits" && (
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  {pendingAuditCount} {pendingAuditCount === 1 ? "scholar is" : "scholars are"} awaiting prospectus
                  audit.
                </span>{" "}
                <span className="text-muted-foreground hidden md:inline">
                  Review submitted degree checklists and historical credits to freeze curriculum baselines.
                </span>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("baseline-audits")}
              className="h-7.5 px-3 rounded-lg border-amber-500/40 bg-white/90 dark:bg-amber-950/40 hover:bg-white dark:hover:bg-amber-900/40 text-amber-950 dark:text-amber-100 font-semibold text-xs shrink-0 gap-1.5 shadow-2xs self-start sm:self-auto"
            >
              <span>Review Audits ({pendingAuditCount})</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        )}

        {/* Main 3 Tabs: Active Scholars, Prospectus Audits, & Term Enrollments */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5 w-full space-y-4">
          <TabsList className="grid w-full sm:w-160 grid-cols-3">
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
          </TabsList>

          {/* Tab 1: Active Scholars Directory & Health Monitoring */}
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
              onSelectScholar={handleSelectScholarForAudit}
            />
          </TabsContent>

          {/* Tab 3: Term Enrollments & Disbursement Endorsement */}
          <TabsContent value="enrollment-audits">
            <GrantorEnrollmentsTab
              items={enrollmentItems}
              loading={loadingEnrollments}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectAudit={handleSelectEnrollment}
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

      {/* Active Scholar Monitor Drawer */}
      <ScholarMonitorDrawer scholar={selectedScholar} open={openMonitorDrawer} onOpenChange={setOpenMonitorDrawer} />
    </div>
  );
}
