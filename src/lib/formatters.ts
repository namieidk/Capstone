/**
 * Utility functions for formatting database enums and technical keys
 * into clean, user-friendly, readable text for toasts and notifications.
 */

export function formatStageLabel(raw?: string | null): string {
  if (!raw) return "Under Review";
  const trimmed = raw.trim();

  const map: Record<string, string> = {
    UNDER_REVIEW: "Under Review",
    PASSED_PRECHECK: "Passed Pre-check",
    NEEDS_REUPLOAD: "Needs Re-upload",
    DOCUMENT_VERIFICATION_COMPLETE: "Document Verification Complete",
    INTERVIEW_SCHEDULED: "Interview Scheduled",
    INTERVIEW_COMPLETED: "Interview Completed",
    INTERVIEWED: "Interview Completed",
    ENDORSED_TO_GRANTOR: "Endorsed to Grantor",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PENDING: "Pending",
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    FLAGGED_FOR_REVIEW: "Flagged for Review",
  };

  const key = trimmed.toUpperCase().replace(/\s+/g, "_");
  if (map[key]) return map[key];

  // If already mixed case with spaces (e.g. "Under Review")
  if (/^[A-Za-z\s-]+$/.test(trimmed) && trimmed.includes(" ")) {
    return trimmed;
  }

  // Convert SCREAMING_SNAKE or slug to Title Case
  return trimmed
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRoleLabel(raw?: string | null): string {
  if (!raw) return "Staff";
  const trimmed = raw.trim().toUpperCase();
  const map: Record<string, string> = {
    ADMIN: "Administrator",
    COORDINATOR: "Coordinator",
    GRANTOR: "Grantor",
    SCHOLAR: "Scholar",
    APPLICANT: "Applicant",
  };
  return map[trimmed] || formatStageLabel(raw);
}

export function formatRetentionThreshold(
  thresholdPercent = 90,
  schoolGrading?: {
    school_name?: string;
    grading_scale?: string;
    passing_grade?: number;
    highest_grade?: number;
    failing_grade?: number;
  } | null,
): string {
  const norm = Math.max(75, Math.min(100, Number(thresholdPercent) || 90));
  const isUM =
    schoolGrading?.school_name?.toLowerCase().includes("mindanao") ||
    schoolGrading?.school_name?.toLowerCase().includes("(um)");
  const highest = schoolGrading?.highest_grade != null ? Number(schoolGrading.highest_grade) : isUM ? 4.0 : 1.0;
  const passing = schoolGrading?.passing_grade != null ? Number(schoolGrading.passing_grade) : isUM ? 2.0 : 3.0;
  const failing = schoolGrading?.failing_grade != null ? Number(schoolGrading.failing_grade) : isUM ? 1.0 : 5.0;

  const isPercentage = schoolGrading?.grading_scale === "PERCENTAGE_100" || (highest > 10 && highest >= 100);
  const isFourPoint =
    schoolGrading?.grading_scale === "NUMERIC_4_POINT" ||
    isUM ||
    (highest === 4.0 && (passing === 2.0 || failing === 1.0));

  if (isPercentage) {
    return `${norm.toFixed(0)}%`;
  }

  if (isFourPoint) {
    // 4.0 ascending scale (e.g. UM: 4.00 highest, 2.00 passing at 75%, 3.00 retention at 90%)
    const thresholdGwa =
      norm <= 90 ? passing + ((norm - 75) / 15) * (3.0 - passing) : 3.0 + ((norm - 90) / 10) * (highest - 3.0);
    return `${thresholdGwa.toFixed(2)} (${norm.toFixed(0)}%)`;
  }

  if (highest < failing) {
    // 5-point inverted scale (e.g. 1.00 highest, 3.00 passing at 75%)
    const thresholdGwa = passing - ((norm - 75) / 25) * (passing - highest);
    return `${thresholdGwa.toFixed(2)} (${norm.toFixed(0)}%)`;
  }

  const thresholdGwa = passing - ((norm - 75) / 25) * (passing - highest);
  return `${thresholdGwa.toFixed(2)} (${norm.toFixed(0)}%)`;
}
