"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { listApplications } from "@/lib/api/applications";
import { getCoordinatorPendingBaselines } from "@/lib/api/baseline";
import { getDisbursementsQueue } from "@/lib/api/disbursements";
import { getPendingAcademicAppeals, getPendingDocuments } from "@/lib/api/documents";
import { getCoordinatorPendingEnrollments } from "@/lib/api/enrollment";
import { listMeetings } from "@/lib/api/meetings";

import type { SidebarRole } from "./types";

export interface StaffBadges {
  applicants?: number;
  meetings?: number;
  scholars?: number;
  disbursements?: number;
}

// Live sidebar counts. Badges stay hidden while loading (or on error) so
// the sidebar never flashes stale mock numbers — undefined means no badge.
export function useStaffBadges(opts: { includeApplicants: boolean; role?: SidebarRole }): StaffBadges {
  const [applicants, setApplicants] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<number | null>(null);
  const [scholars, setScholars] = useState<number | null>(null);
  const [disbursements, setDisbursements] = useState<number | null>(null);

  const refreshBadges = useCallback(() => {
    let alive = true;
    if (opts.includeApplicants) {
      listApplications()
        .then((rows) => {
          if (alive) {
            const active = rows.filter((r) => r.status !== "APPROVED");
            setApplicants(active.length);
          }
        })
        .catch(() => undefined);

      Promise.all([
        getCoordinatorPendingBaselines().catch(() => []),
        getCoordinatorPendingEnrollments().catch(() => []),
        getDisbursementsQueue().catch(() => []),
        getPendingDocuments().catch(() => []),
        getPendingAcademicAppeals().catch(() => []),
      ])
        .then(([baselines, enrollments, disbList, gradeDocs, appeals]) => {
          if (alive) {
            const pendingBaselines = baselines.filter(
              (i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW",
            ).length;

            let pendingEnrollments = 0;
            let pendingDisbursements = 0;
            let pendingGradeAudits = 0;
            let pendingAppeals = 0;

            if (opts.role === "grantor") {
              // For Grantor: count Coordinator-endorsed enrollments awaiting authorization
              pendingEnrollments = enrollments.filter(
                (e) => e.status === "APPROVED" && (!e.disbursement || e.disbursement.status === "PENDING"),
              ).length;
              // For Grantor: count disbursements pending batch authorization
              pendingDisbursements = disbList.filter((d) => d.status === "PENDING").length;
              // For Grantor: count pending academic second-chance appeals
              pendingAppeals = appeals.filter((a) => a.appeal_status === "PENDING_GRANTOR").length;
            } else if (opts.role === "coordinator") {
              // For Coordinator: count enrollments awaiting coordinator audit
              pendingEnrollments = enrollments.filter((e) => e.status === "PENDING_REVIEW").length;
              // For Coordinator: count items ready for check issuance + ORs submitted awaiting audit
              pendingDisbursements = disbList.filter(
                (d) => d.status === "AUTHORIZED" || d.status === "RELEASED" || d.status === "OR_SUBMITTED",
              ).length;
              // For Coordinator: count CCG/grade docs awaiting review
              pendingGradeAudits = gradeDocs.filter(
                (g) => g.status === "PENDING" || g.status === "STUDENT_CONFIRMED" || g.status === "PASSED_PRECHECK",
              ).length;
            } else {
              // For Admin
              pendingEnrollments = enrollments.filter(
                (e) =>
                  e.status === "PENDING_REVIEW" ||
                  (e.status === "APPROVED" && (!e.disbursement || e.disbursement.status === "PENDING")),
              ).length;
              pendingDisbursements = disbList.filter(
                (d) => d.status === "PENDING" || d.status === "AUTHORIZED" || d.status === "OR_SUBMITTED",
              ).length;
              pendingGradeAudits = gradeDocs.filter(
                (g) => g.status === "PENDING" || g.status === "STUDENT_CONFIRMED",
              ).length;
              pendingAppeals = appeals.filter((a) => a.appeal_status === "PENDING_GRANTOR").length;
            }

            setScholars(pendingBaselines + pendingEnrollments + pendingGradeAudits + pendingAppeals);
            setDisbursements(pendingDisbursements);
          }
        })
        .catch(() => undefined);
    }
    // limit: 1 keeps payloads tiny — only `total` is used.
    // Query only upcoming meetings from current time onwards
    const nowIso = new Date().toISOString();
    Promise.all([
      listMeetings({ status: "SCHEDULED", from: nowIso, limit: 1, page: 1 }),
      listMeetings({ status: "RESCHEDULED", from: nowIso, limit: 1, page: 1 }),
    ])
      .then(([scheduled, rescheduled]) => {
        if (alive) setMeetings(scheduled.total + rescheduled.total);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [opts.includeApplicants, opts.role]);

  useEffect(() => {
    return refreshBadges();
  }, [refreshBadges]);

  // Real-time updates for sidebar badges
  useSocketEvent("application:submitted", refreshBadges);
  useSocketEvent("application:stage_updated", refreshBadges);
  useSocketEvent("interview:scheduled", refreshBadges);
  useSocketEvent("interview:rescheduled", refreshBadges);
  useSocketEvent("interview:cancelled", refreshBadges);
  useSocketEvent("baseline:submitted_for_review", refreshBadges);
  useSocketEvent("baseline:frozen", refreshBadges);
  useSocketEvent("baseline:unfrozen", refreshBadges);
  useSocketEvent("enrollment:submitted_for_review", refreshBadges);
  useSocketEvent("enrollment:approved", refreshBadges);
  useSocketEvent("enrollment:changes_requested", refreshBadges);
  useSocketEvent("enrollment:rejected", refreshBadges);
  useSocketEvent("disbursement:created", refreshBadges);
  useSocketEvent("disbursement:authorized", refreshBadges);
  useSocketEvent("disbursement:updated", refreshBadges);
  useSocketEvent("disbursement:or_submitted", refreshBadges);
  useSocketEvent("grade_report:submitted", refreshBadges);
  useSocketEvent("academic_appeal:submitted", refreshBadges);
  useSocketEvent("academic_appeal:reviewed", refreshBadges);

  return {
    applicants: applicants != null && applicants > 0 ? applicants : undefined,
    meetings: meetings != null && meetings > 0 ? meetings : undefined,
    scholars: scholars != null && scholars > 0 ? scholars : undefined,
    disbursements: disbursements != null && disbursements > 0 ? disbursements : undefined,
  };
}
