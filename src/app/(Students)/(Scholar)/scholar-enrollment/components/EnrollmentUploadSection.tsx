"use client";

import { EnrollmentDropzone } from "./EnrollmentDropzone";
import { EnrollmentModeToggle } from "./EnrollmentModeToggle";

interface UploadedFileMetadata {
  name: string;
  size?: string;
  url?: string;
}

interface EnrollmentUploadSectionProps {
  isConsolidated: boolean;
  onToggleConsolidated: (val: boolean) => void;
  isReadOnly: boolean;
  isUploadingConsolidated: boolean;
  consolidatedFile: UploadedFileMetadata | null;
  onUploadConsolidated: (file: File) => void;
  onClearConsolidated: () => void;
  isUploadingCor: boolean;
  corFile: UploadedFileMetadata | null;
  onUploadCor: (file: File) => void;
  onClearCor: () => void;
  isUploadingSoa: boolean;
  soaFile: UploadedFileMetadata | null;
  onUploadSoa: (file: File) => void;
  onClearSoa: () => void;
}

export function EnrollmentUploadSection({
  isConsolidated,
  onToggleConsolidated,
  isReadOnly,
  isUploadingConsolidated,
  consolidatedFile,
  onUploadConsolidated,
  onClearConsolidated,
  isUploadingCor,
  corFile,
  onUploadCor,
  onClearCor,
  isUploadingSoa,
  soaFile,
  onUploadSoa,
  onClearSoa,
}: EnrollmentUploadSectionProps) {
  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <div className="flex justify-start">
          <EnrollmentModeToggle isConsolidated={isConsolidated} onChange={onToggleConsolidated} disabled={isReadOnly} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isConsolidated ? (
          <div className="md:col-span-2">
            <EnrollmentDropzone
              title="Official Consolidated Enrollment & Assessment Document"
              subtitle="Upload your Certificate of Matriculation containing both registered subject table and tuition assessment."
              fileTypeLabel="Consolidated Form"
              isUploading={isUploadingConsolidated}
              uploadedFile={consolidatedFile}
              onFileUpload={onUploadConsolidated}
              onClearFile={onClearConsolidated}
              disabled={isReadOnly}
            />
          </div>
        ) : (
          <>
            <EnrollmentDropzone
              title="Proof of Enrolled Subjects (COR / Form 1)"
              subtitle="Upload your Certificate of Registration, Matriculation, or E-COR showing class schedule and credit units."
              fileTypeLabel="Proof of Subjects"
              isUploading={isUploadingCor}
              uploadedFile={corFile}
              onFileUpload={onUploadCor}
              onClearFile={onClearCor}
              disabled={isReadOnly}
            />

            <EnrollmentDropzone
              title="Proof of Billing Assessment (SOA / Ledger)"
              subtitle="Upload your Statement of Account, Assessment Form, or Student Ledger displaying tuition balance due."
              fileTypeLabel="Proof of Billing"
              isUploading={isUploadingSoa}
              uploadedFile={soaFile}
              onFileUpload={onUploadSoa}
              onClearFile={onClearSoa}
              disabled={isReadOnly}
            />
          </>
        )}
      </div>
    </div>
  );
}
