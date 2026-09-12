"use client";

import { Activity, BookOpen, Building2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import type { ActiveScholar } from "@/components/Coordinatorshared";
import { BaselineAuditDrawer } from "@/components/coordinator/baseline/BaselineAuditDrawer";
import { BaselinePendingQueue } from "@/components/coordinator/baseline/BaselinePendingQueue";
import { SchoolVerificationCard } from "@/components/coordinator/baseline/SchoolVerificationCard";
import { ActiveScholarsTable } from "@/components/coordinator/monitor/ActiveScholarsTable";
import { ScholarMonitorDrawer } from "@/components/coordinator/monitor/ScholarMonitorDrawer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocketContext } from "@/contexts/SocketContext";
import { getCoordinatorPendingBaselines, type PendingBaselineItem } from "@/lib/api/baseline";

export default function CoordinatorMonitorPage() {
  const { socket } = useContext(SocketContext);

  // Active Monitoring State
  const [selectedScholar, setSelectedScholar] = useState<ActiveScholar | null>(null);
  const [openMonitorDrawer, setOpenMonitorDrawer] = useState(false);

  // Baseline Audit State
  const [baselineItems, setBaselineItems] = useState<PendingBaselineItem[]>([]);
  const [loadingBaselines, setLoadingBaselines] = useState(true);
  const [selectedAuditProfileId, setSelectedAuditProfileId] = useState<number | null>(null);
  const [openAuditDrawer, setOpenAuditDrawer] = useState(false);

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

  useEffect(() => {
    fetchPendingBaselines();
  }, [fetchPendingBaselines]);

  // Real-time socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchPendingBaselines();
    };

    socket.on("baseline:submitted_for_review", handleRefresh);
    socket.on("baseline:prospectus_processed", handleRefresh);
    socket.on("baseline:frozen", handleRefresh);
    socket.on("baseline:unfrozen", handleRefresh);
    socket.on("school_grading:verified", handleRefresh);

    return () => {
      socket.off("baseline:submitted_for_review", handleRefresh);
      socket.off("baseline:prospectus_processed", handleRefresh);
      socket.off("baseline:frozen", handleRefresh);
      socket.off("baseline:unfrozen", handleRefresh);
      socket.off("school_grading:verified", handleRefresh);
    };
  }, [socket, fetchPendingBaselines]);

  const handleSelectScholarForAudit = (profileId: number) => {
    setSelectedAuditProfileId(profileId);
    setOpenAuditDrawer(true);
  };

  const pendingAuditCount = baselineItems.filter(
    (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
  ).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Scholar Academic Monitoring & Baseline Audits
        </h1>
        <p className="text-sm text-muted-foreground">
          Track active scholar standing, verify onboarding curriculum baselines, and manage university grading scales.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="baseline-audits" className="w-full space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-[540px]">
          <TabsTrigger value="baseline-audits" className="text-xs gap-1.5">
            <BookOpen className="w-4 h-4" />
            Baseline Audits
            {pendingAuditCount > 0 && (
              <Badge className="ml-1 bg-amber-500 text-white text-[10px] px-1.5 py-0">{pendingAuditCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active-monitor" className="text-xs gap-1.5">
            <Activity className="w-4 h-4" />
            Active Scholars
          </TabsTrigger>
          <TabsTrigger value="school-scales" className="text-xs gap-1.5">
            <Building2 className="w-4 h-4" />
            Grading Scales
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Academic Baseline Audits (Phase 1) */}
        <TabsContent value="baseline-audits" className="space-y-4">
          <BaselinePendingQueue
            items={baselineItems}
            loading={loadingBaselines}
            onSelectScholar={handleSelectScholarForAudit}
          />
        </TabsContent>

        {/* Tab 2: Active Scholars Monitoring */}
        <TabsContent value="active-monitor" className="space-y-4">
          <ActiveScholarsTable
            onSelectScholar={(sch) => {
              setSelectedScholar(sch);
              setOpenMonitorDrawer(true);
            }}
          />
        </TabsContent>

        {/* Tab 3: University Grading Scales */}
        <TabsContent value="school-scales" className="space-y-4">
          <SchoolVerificationCard onScaleUpdated={fetchPendingBaselines} />
        </TabsContent>
      </Tabs>

      {/* Side Audit Drawer */}
      <BaselineAuditDrawer
        scholarProfileId={selectedAuditProfileId}
        open={openAuditDrawer}
        onOpenChange={setOpenAuditDrawer}
        onSuccess={fetchPendingBaselines}
      />

      {/* Active Scholar Monitor Drawer */}
      <ScholarMonitorDrawer scholar={selectedScholar} open={openMonitorDrawer} onOpenChange={setOpenMonitorDrawer} />
    </div>
  );
}
