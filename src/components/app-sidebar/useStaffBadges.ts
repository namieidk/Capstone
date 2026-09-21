"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocketEvent } from "@/contexts/SocketContext";
import { listApplications } from "@/lib/api/applications";
import { listMeetings } from "@/lib/api/meetings";

export interface StaffBadges {
  applicants?: number;
  meetings?: number;
}

// Live sidebar counts. Badges stay hidden while loading (or on error) so
// the sidebar never flashes stale mock numbers — undefined means no badge.
export function useStaffBadges(opts: { includeApplicants: boolean }): StaffBadges {
  const [applicants, setApplicants] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<number | null>(null);

  const refreshBadges = useCallback(() => {
    let alive = true;
    if (opts.includeApplicants) {
      listApplications()
        .then((rows) => {
          if (alive) setApplicants(rows.length);
        })
        .catch(() => undefined);
    }
    // limit: 1 keeps payloads tiny — only `total` is used.
    Promise.all([
      listMeetings({ status: "SCHEDULED", limit: 1, page: 1 }),
      listMeetings({ status: "RESCHEDULED", limit: 1, page: 1 }),
    ])
      .then(([scheduled, rescheduled]) => {
        if (alive) setMeetings(scheduled.total + rescheduled.total);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [opts.includeApplicants]);

  useEffect(() => {
    return refreshBadges();
  }, [refreshBadges]);

  // Real-time updates for sidebar badges
  useSocketEvent("application:submitted", refreshBadges);
  useSocketEvent("application:stage_updated", refreshBadges);
  useSocketEvent("interview:scheduled", refreshBadges);
  useSocketEvent("interview:rescheduled", refreshBadges);
  useSocketEvent("interview:cancelled", refreshBadges);

  return {
    applicants: applicants != null && applicants > 0 ? applicants : undefined,
    meetings: meetings != null && meetings > 0 ? meetings : undefined,
  };
}
