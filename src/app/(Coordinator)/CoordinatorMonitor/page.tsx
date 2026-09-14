"use client";

import { Activity, BookOpen, Building2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { BaselineAuditDrawer } from "@/components/coordinator/baseline/BaselineAuditDrawer";
import { ScholarMonitorDrawer } from "@/components/coordinator/monitor/ScholarMonitorDrawer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocketContext } from "@/contexts/SocketContext";
import {
  getCoordinatorActiveScholars,
  getCoordinatorPendingBaselines,
  type PendingBaselineItem,
} from "@/lib/api/baseline";
import { ActiveScholarsTab } from "./components/ActiveScholarsTab";
import { BaselineAuditsTab } from "./components/BaselineAuditsTab";
import { CoordinatorMonitorHeader } from "./components/CoordinatorMonitorHeader";
import { GradingScalesTab } from "./components/GradingScalesTab";

export default function CoordinatorMonitorPage() {
  const { socket } = useContext(SocketContext);

  // Search & Navigation state
  const [searchQuery, setSearchQuery] = useState("");

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
      console.error("Failed to load coordinator pending baselines:", err);
    } finally {
      setLoadingBaselines(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchActiveScholars();
    fetchPendingBaselines();
  }, [fetchActiveScholars, fetchPendingBaselines]);

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
    socket.on("application:stage_updated", handleRefresh);
    socket.on("contract:signed", handleRefresh);
    socket.on("disbursement:updated", handleRefresh);
    socket.on("grade_report:submitted", handleRefresh);

    return () => {
      socket.off("baseline:submitted_for_review", handleRefresh);
      socket.off("baseline:prospectus_processed", handleRefresh);
      socket.off("baseline:frozen", handleRefresh);
      socket.off("baseline:unfrozen", handleRefresh);
      socket.off("school_grading:verified", handleRefresh);
      socket.off("application:stage_updated", handleRefresh);
      socket.off("contract:signed", handleRefresh);
      socket.off("disbursement:updated", handleRefresh);
      socket.off("grade_report:submitted", handleRefresh);
    };
  }, [socket, refreshAll]);

  const handleSelectScholarForAudit = (profileId: number) => {
    setSelectedAuditProfileId(profileId);
    setOpenAuditDrawer(true);
  };

  const pendingAuditCount = baselineItems.filter(
    (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
  ).length;

  return (
    <div className="min-h-full bg-[#faf8f5]">
      {/* Page Header */}
      <CoordinatorMonitorHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content Area */}
      <div className="px-5 pb-24 md:px-10">
        {/* Mobile Search Input */}
        <div className="mt-4 flex h-10 items-center gap-2 rounded-full border border-line bg-tint px-3.5 md:hidden">
          <input
            type="text"
            placeholder="Search scholar or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[0.82rem] outline-none placeholder:text-[#9a9a94]"
            aria-label="Search scholars"
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="active-monitor" className="mt-5 w-full space-y-4">
          <TabsList className="grid w-full sm:w-135 grid-cols-3">
            <TabsTrigger value="active-monitor" className="text-xs gap-1.5">
              <Activity className="size-4" />
              Active Scholars
            </TabsTrigger>
            <TabsTrigger value="baseline-audits" className="text-xs gap-1.5">
              <BookOpen className="size-4" />
              Baseline Audits
              {pendingAuditCount > 0 && (
                <Badge className="ml-1 h-5 rounded-full bg-amber-500 px-1.5 text-[10px] text-white">
                  {pendingAuditCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="school-scales" className="text-xs gap-1.5">
              <Building2 className="size-4" />
              Grading Scales
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Active Scholars Monitoring */}
          <TabsContent value="active-monitor">
            <ActiveScholarsTab
              scholars={activeScholars}
              loading={loadingActiveScholars}
              loadError={activeScholarsError}
              onRetry={fetchActiveScholars}
              searchQuery={searchQuery}
              onSelectScholar={(sch) => {
                setSelectedScholar(sch);
                setOpenMonitorDrawer(true);
              }}
            />
          </TabsContent>

          {/* Tab 2: Academic Baseline Audits */}
          <TabsContent value="baseline-audits">
            <BaselineAuditsTab
              items={baselineItems}
              loading={loadingBaselines}
              onSelectScholar={handleSelectScholarForAudit}
            />
          </TabsContent>

          {/* Tab 3: University Grading Scales */}
          <TabsContent value="school-scales">
            <GradingScalesTab onScaleUpdated={refreshAll} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Side Audit Drawer */}
      <BaselineAuditDrawer
        scholarProfileId={selectedAuditProfileId}
        open={openAuditDrawer}
        onOpenChange={setOpenAuditDrawer}
        onSuccess={refreshAll}
      />

      {/* Active Scholar Monitor Drawer */}
      <ScholarMonitorDrawer scholar={selectedScholar} open={openMonitorDrawer} onOpenChange={setOpenMonitorDrawer} />
    </div>
  );
}
