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
