import type { GradeItem, ScholarDocument } from "@/lib/api/documents";

export interface DocumentReviewDialogProps {
  document: ScholarDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    documentId: number,
    data: {
      academic_year?: string;
      general_average?: number;
      grade_items?: GradeItem[];
    },
  ) => Promise<void>;
}

export interface EditableGradeItem {
  id: string;
  subject_code: string;
  subject_name: string;
  units: number;
  grade: number | "";
  semester?: string;
}

export interface ExtractedGradeRaw {
  grade?: number | string | null;
  semester?: string | null;
  subject_code?: string | null;
  subject_name?: string | null;
  units?: number | string | null;
}

export interface ExtractedDataShape {
  academic_year?: string | null;
  general_average?: number | string | null;
  grades?: ExtractedGradeRaw[] | null;
  school_name?: string | null;
  student_name?: string | null;
  course_name?: string | null;
  forensic_analysis?: {
    summary?: string | null;
    is_flagged?: boolean;
    risk_level?: string | null;
  } | null;
  validation_flags?: string[] | null;
}

export interface ConfirmedDataShape {
  academic_year?: string | null;
  general_average?: number | string | null;
  grade_items?: ExtractedGradeRaw[] | null;
}

export function generatePreviewPageUrls(url: string, fileType?: string | null): string[] {
  if (!url) return [];
  const isPdf = fileType === "pdf" || /\.pdf($|\?)/i.test(url);
  if (!isPdf) return [url];

  if (url.includes("/image/upload/")) {
    const cleanUrl = url.replace(/\.pdf(\?.*)?$/i, ".jpg");
    // Generate potential page URLs for pages 1 to 4
    return [1, 2, 3, 4].map((page) => cleanUrl.replace("/image/upload/", `/image/upload/pg_${page}/`));
  }

  return [url];
}
