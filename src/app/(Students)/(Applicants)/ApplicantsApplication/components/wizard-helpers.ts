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
    case "PENDING":
      return { label: "Analyzing with AI...", variant: "outline" };
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
  { value: "Form 138", label: "Form 138 / Report Card (Senior High)" },
  { value: "Form 9", label: "Form 9 / SF9 (Senior High School)" },
  { value: "TOR", label: "Transcript of Records / TOR (College)" },
  { value: "Certificate of Grades", label: "Certificate of Grades / COG" },
] as const;
export const DEFAULT_DOCUMENT_TYPE = DOCUMENT_TYPE_OPTIONS[0].value;

export function isHighSchoolDoc(docType: string): boolean {
  return /138|137|form\s*9|sf9|report card|high school|shs|senior high/i.test(docType || "");
}

export function getFilteredDocumentTypeOptions(yearLevel: number = 1) {
  if (yearLevel >= 2) {
    // 2nd to 4th year college: TOR or Certificate of Grades
    return [
      { value: "TOR", label: "Transcript of Records / TOR (College)" },
      { value: "Certificate of Grades", label: "Certificate of Grades / COG" },
    ];
  }
  // 1st year applicant: Form 138 or Form 9 from Senior High School
  return [
    { value: "Form 138", label: "Form 138 / Report Card (Senior High)" },
    { value: "Form 9", label: "Form 9 / SF9 (Senior High School)" },
  ];
}

export function getDefaultDocumentType(yearLevel: number = 1): string {
  return yearLevel >= 2 ? "TOR" : "Form 138";
}

export function getWizardSteps(yearLevel: number = 1): Array<{ step: WizardStep; label: string; sub: string }> {
  return [
    { step: 1, label: "Application", sub: "Your details" },
    { step: 2, label: "Documents", sub: yearLevel >= 2 ? "TOR / Grades" : "Form 138 / Form 9" },
    { step: 3, label: "Status", sub: "Track progress" },
  ];
}

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
