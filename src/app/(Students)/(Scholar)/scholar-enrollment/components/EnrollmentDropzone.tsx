"use client";

import { CheckCircle2, FileText, Loader2, UploadCloud, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

interface EnrollmentDropzoneProps {
  title: string;
  subtitle: string;
  fileTypeLabel: string;
  isUploading: boolean;
  uploadedFile: { name: string; size?: string; url?: string } | null;
  onFileUpload: (file: File) => void;
  onClearFile?: () => void;
  disabled?: boolean;
}

export function EnrollmentDropzone({
  title,
  subtitle,
  fileTypeLabel,
  isUploading,
  uploadedFile,
  onFileUpload,
  onClearFile,
  disabled,
}: EnrollmentDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0a4f42]" />
            {title}
          </h3>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            {fileTypeLabel}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">{subtitle}</p>

        {uploadedFile ? (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 truncate">{uploadedFile.name}</p>
                {uploadedFile.size && <p className="text-[10px] text-slate-500 font-medium">{uploadedFile.size}</p>}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {uploadedFile.url && (
                <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline px-2 py-1"
                >
                  View
                </a>
              )}
              {onClearFile && !disabled && (
                <button
                  type="button"
                  onClick={onClearFile}
                  className="p-1 hover:bg-emerald-100/60 rounded-md text-slate-500 hover:text-slate-700 cursor-pointer"
                  title="Remove document"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || isUploading}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-35 focus:outline-none focus:ring-2 focus:ring-[#0a4f42]/30 ${
              isDragOver
                ? "border-[#0a4f42] bg-teal-50/50"
                : "border-slate-200 hover:border-teal-600/50 hover:bg-slate-50/60"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-[#0a4f42] animate-spin" />
                <p className="text-xs font-semibold text-slate-700">Ingesting and running OCR extraction...</p>
                <p className="text-[11px] text-slate-400">Extracting courses, units, schedule & fee balances</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
                  <UploadCloud className="w-5 h-5 text-[#0a4f42]" />
                </div>
                <p className="text-xs font-semibold text-slate-800">Click to upload or drag & drop</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG, or WEBP (up to 15 MB)</p>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
