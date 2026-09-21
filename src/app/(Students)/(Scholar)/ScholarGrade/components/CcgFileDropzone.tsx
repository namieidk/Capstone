"use client";

import { Info, Loader2, Upload } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CcgFileDropzoneProps {
  enrollmentDetected: string | null;
  academicYear: string;
  setAcademicYear: (ay: string) => void;
  semester: string;
  setSemester: (sem: string) => void;
  file: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  onUpload: () => void;
}

export function CcgFileDropzone({
  enrollmentDetected,
  academicYear,
  setAcademicYear,
  semester,
  setSemester,
  file,
  onFileSelect,
  uploading,
  onUpload,
}: CcgFileDropzoneProps) {
  return (
    <div className="space-y-4">
      {enrollmentDetected && (
        <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-[#0a4f42]" />
            <span>
              Initial period pre-filled from your enrolled term: <strong>{enrollmentDetected}</strong>
            </span>
          </div>
          <Badge variant="outline" className="bg-white border-teal-300 text-[10px] text-teal-800 font-bold">
            Enrolled Term Synced
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="academic-year-input" className="text-xs font-semibold text-slate-700 block mb-1">
            Academic Year
          </label>
          <Input
            id="academic-year-input"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="e.g. 2025-2026"
            className="h-9 w-full rounded-xl bg-white text-xs font-semibold text-navy border-input shadow-xs px-3"
          />
        </div>
        <div>
          <label htmlFor="semester-select" className="text-xs font-semibold text-slate-700 block mb-1">
            Semester
          </label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger
              id="semester-select"
              className="h-9! min-h-9! py-1.5! w-full rounded-xl bg-white text-xs font-semibold text-navy border-input shadow-xs px-3"
            >
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-line">
              <SelectItem value="1st Semester" className="text-xs font-medium">
                1st Semester
              </SelectItem>
              <SelectItem value="2nd Semester" className="text-xs font-medium">
                2nd Semester
              </SelectItem>
              <SelectItem value="Summer" className="text-xs font-medium">
                Summer
              </SelectItem>
              <SelectItem value="Annual" className="text-xs font-medium">
                Annual
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-line rounded-2xl p-8 bg-[#faf8f5] hover:bg-[#f5f2ed] transition-colors cursor-pointer text-center relative">
        <input
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={onFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <Upload className="size-8 text-[#0a4f42] mb-2" />
        {file ? (
          <div className="space-y-1">
            <p className="text-xs font-bold text-navy">{file.name}</p>
            <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-bold text-navy">Click or Drag CCG PDF / Image here</p>
            <p className="text-[10px] text-muted-foreground">Supported formats: PDF, JPG, PNG, WEBP (Max 10MB)</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!file || uploading}
          onClick={onUpload}
          className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-1.5 shadow-xs"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          <span>Upload & Extract Grades</span>
        </Button>
      </div>
    </div>
  );
}
