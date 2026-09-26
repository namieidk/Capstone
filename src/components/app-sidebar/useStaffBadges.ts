"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { listApplications } from "@/lib/api/applications";
import { getCoordinatorPendingBaselines } from "@/lib/api/baseline";
import { listContracts } from "@/lib/api/contracts";
import { getDisbursementsQueue, getMyScholarDisbursements } from "@/lib/api/disbursements";
import { getPendingAcademicAppeals, getPendingDocuments } from "@/lib/api/documents";
import { getCoordinatorPendingEnrollments } from "@/lib/api/enrollment";
import { listMeetings } from "@/lib/api/meetings";

import type { SidebarRole } from "./types";

export interface StaffBadges {
  applicants?: number;
  meetings?: number;
  scholars?: number;
  disbursements?: number | string;
}

// Live sidebar counts. Badges stay hidden while loading (or on error) so
// the sidebar never flashes stale mock numbers — undefined means no badge.
export function useStaffBadges(opts: { includeApplicants: boolean; role?: SidebarRole }): StaffBadges {
  const [applicants, setApplicants] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<number | null>(null);
  const [scholars, setScholars] = useState<number | null>(null);
  const [disbursements, setDisbursements] = useState<number | string | null>(null);

  const refreshBadges = useCallback(() => {
    let alive = true;
    if (opts.includeApplicants) {
      Promise.all([listApplications(), listContracts().catch(() => [])])
        .then(([rows, contracts]) => {
          if (alive) {
            const contractProfileIds = new Set(contracts.map((c) => c.scholar_profile_id));
            const active = rows.filter((r) => {
              const isAccepted =
                r.status === "APPROVED" || (typeof r.stage === "string" && r.stage.trim().toLowerCase() === "accepted");
              const hasContract =
                contractProfileIds.has(r.scholar_profile_id) ||
                Boolean(r.scholar_profile?.contracts && r.scholar_profile.contracts.length > 0) ||
                (r.scholar_profile?._count?.contracts ?? 0) > 0;
              return !(isAccepted && hasContract) && r.status !== "REJECTED";
            });
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

    if (opts.role === "scholar") {
      getMyScholarDisbursements()
        .then((items) => {
          if (alive) {
            const needsAction = items.some(
              (d) =>
                (d.status === "CHECK_ISSUED" || d.status === "CLAIMED" || d.status === "RELEASED") && !d.or_document_id,
            );
            setDisbursements(needsAction ? "!" : null);
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
  useSocketEvent("grade_report:verified", refreshBadges);
  useSocketEvent("document:confirmed_by_applicant", refreshBadges);
  useSocketEvent("document:ocr_completed", refreshBadges);
  useSocketEvent("document:verified", refreshBadges);
  useSocketEvent("document:changes_requested", refreshBadges);
  useSocketEvent("academic_appeal:submitted", refreshBadges);
  useSocketEvent("academic_appeal:reviewed", refreshBadges);
  useSocketEvent("contract:created", refreshBadges);
  useSocketEvent("contract:signed", refreshBadges);

  return {
    applicants: applicants != null && applicants > 0 ? applicants : undefined,
    meetings: meetings != null && meetings > 0 ? meetings : undefined,
    scholars: scholars != null && scholars > 0 ? scholars : undefined,
    disbursements:
      disbursements != null && (typeof disbursements === "string" || disbursements > 0) ? disbursements : undefined,
  };
}
