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
  consolidatedError?: string | null;
  onUploadConsolidated: (file: File) => void;
  onClearConsolidated: () => void;
  onClearConsolidatedError?: () => void;
  isUploadingCor: boolean;
  corFile: UploadedFileMetadata | null;
  corError?: string | null;
  onUploadCor: (file: File) => void;
  onClearCor: () => void;
  onClearCorError?: () => void;
  isUploadingSoa: boolean;
  soaFile: UploadedFileMetadata | null;
  soaError?: string | null;
  onUploadSoa: (file: File) => void;
  onClearSoa: () => void;
  onClearSoaError?: () => void;
}

export function EnrollmentUploadSection({
  isConsolidated,
  onToggleConsolidated,
  isReadOnly,
  isUploadingConsolidated,
  consolidatedFile,
  consolidatedError,
  onUploadConsolidated,
  onClearConsolidated,
  onClearConsolidatedError,
  isUploadingCor,
  corFile,
  corError,
  onUploadCor,
  onClearCor,
  onClearCorError,
  isUploadingSoa,
  soaFile,
  soaError,
  onUploadSoa,
  onClearSoa,
  onClearSoaError,
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
              errorMessage={consolidatedError}
              onFileUpload={onUploadConsolidated}
              onClearFile={onClearConsolidated}
              onClearError={onClearConsolidatedError}
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
              errorMessage={corError}
              onFileUpload={onUploadCor}
              onClearFile={onClearCor}
              onClearError={onClearCorError}
              disabled={isReadOnly}
            />

            <EnrollmentDropzone
              title="Proof of Billing Assessment (SOA / Ledger)"
              subtitle="Upload your Statement of Account, Assessment Form, or Student Ledger displaying tuition balance due."
              fileTypeLabel="Proof of Billing"
              isUploading={isUploadingSoa}
              uploadedFile={soaFile}
              errorMessage={soaError}
              onFileUpload={onUploadSoa}
              onClearFile={onClearSoa}
              onClearError={onClearSoaError}
              disabled={isReadOnly}
            />
          </>
        )}
      </div>
    </div>
  );
}
