"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
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

  return {
    applicants: applicants != null && applicants > 0 ? applicants : undefined,
    meetings: meetings != null && meetings > 0 ? meetings : undefined,
  };
}
