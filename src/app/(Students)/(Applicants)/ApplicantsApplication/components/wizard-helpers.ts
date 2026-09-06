import type { Application, ApplicationStatus } from "@/lib/api/applications";
import type { DocumentStatus, ScholarDocument } from "@/lib/api/documents";
import { type ApplicationFormValues, applicationSchema } from "@/lib/validation";

export type WizardStep = 1 | 2 | 3;

export const WIZARD_STEPS: Array<{ step: WizardStep; label: string; sub: string }> = [
  { step: 1, label: "Application", sub: "Your details" },
  { step: 2, label: "Documents", sub: "Form 138 / TOR" },
  { step: 3, label: "Status", sub: "Track progress" },
];

// Where the applicant should land based on backend state.
export function resolveStep(app: Application | null, docs: ScholarDocument[]): WizardStep {
  if (!app) return 1;
  const progressed = docs.some((d) => d.status === "STUDENT_CONFIRMED" || d.status === "VERIFIED");
  return progressed ? 3 : 2;
}

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export function appStatusMeta(status: ApplicationStatus): { label: string; variant: BadgeVariant } {
  switch (status) {
    case "APPROVED":
      return { label: "Approved", variant: "default" };
    case "REJECTED":
      return { label: "Rejected", variant: "destructive" };
    case "UNDER_REVIEW":
      return { label: "Under review", variant: "secondary" };
    default:
      return { label: "Pending", variant: "outline" };
  }
}

export function docStatusMeta(status: DocumentStatus): { label: string; variant: BadgeVariant } {
  switch (status) {
    case "VERIFIED":
      return { label: "Verified", variant: "default" };
    case "STUDENT_CONFIRMED":
      return { label: "Confirmed", variant: "secondary" };
    case "PASSED_PRECHECK":
      return { label: "Pre-check passed", variant: "secondary" };
    case "NEEDS_REUPLOAD":
      return { label: "Needs re-upload", variant: "destructive" };
    case "REJECTED":
      return { label: "Rejected", variant: "destructive" };
    default:
      return { label: "Pending", variant: "outline" };
  }
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Document types recognized by the backend verification engine.
export const DOCUMENT_TYPE_OPTIONS = [
  { value: "Form 138", label: "Form 138 / Report Card (High School)" },
  { value: "TOR", label: "Transcript of Records / TOR (College)" },
  { value: "Certificate of Grades", label: "Certificate of Grades" },
  { value: "Form 137", label: "Form 137 (Permanent Record)" },
] as const;
export const DEFAULT_DOCUMENT_TYPE = DOCUMENT_TYPE_OPTIONS[0].value;

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function validateChosenFiles(files: File[]): string | null {
  for (const f of files) {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeOk = /^(image\/(jpeg|png|webp)|application\/pdf)$/i.test(f.type);
    if (!ALLOWED_EXTENSIONS.includes(ext) && !mimeOk) {
      return `File "${f.name}" is not supported. Allowed formats: JPG, PNG, WEBP, PDF.`;
    }
    if (f.size > MAX_FILE_BYTES) {
      return `File "${f.name}" exceeds the 10MB size limit.`;
    }
  }
  return null;
}

// Validates the step-1 form, mapping the first Zod issue per field.
export function parseApplicationForm(values: Record<string, string>): {
  data?: ApplicationFormValues;
  fieldErrors: Record<string, string>;
} {
  const normalized = {
    ...values,
    phone_number: values.phone_number?.trim() ? values.phone_number.trim() : undefined,
    relative_employee: values.relative_employee?.trim() ?? "",
  };
  const parsed = applicationSchema.safeParse(normalized);
  if (parsed.success) return { data: parsed.data, fieldErrors: {} };
  const fieldErrors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { fieldErrors };
}
