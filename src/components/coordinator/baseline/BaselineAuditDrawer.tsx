"use client";

import { BookOpen, ExternalLink, FileText, Lock, Plus, Save, Trash2, Unlock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  coordinatorUpdateSubjects,
  freezeBaseline,
  getCoordinatorBaselineReview,
  type ProspectusSubject,
  type SchoolGradingSystem,
  type UpdateProspectusSubjectInput,
  unfreezeBaseline,
  verifySchoolGrading,
} from "@/lib/api/baseline";

interface BaselineAuditDrawerProps {
  scholarProfileId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReviewDocument {
  document_id: number;
  document_type: string;
  label?: string | null;
  file_name?: string | null;
  file_url: string;
  file_type?: string | null;
  file_size?: string | null;
  uploaded_at: string;
}

interface BaselineReviewResponse {
  scholar_profile: {
    profile_id: number;
    student_name: string;
    student_number?: string | null;
    course_of_study?: string | null;
    school_name?: string | null;
    current_year_level?: number | null;
    email: string;
    academic_baseline_status: string;
  };
  school_grading_system?: SchoolGradingSystem | null;
  prospectus?: {
    prospectus_id: number;
    scholar_profile_id: number;
    curriculum_year: string;
    course_code?: string | null;
    course_name: string;
    total_units?: number | null;
    is_frozen: boolean;
    frozen_at?: string | null;
    status: string;
    subjects?: ProspectusSubject[];
  } | null;
  documents?: ReviewDocument[];
  metrics: {
    total_subjects: number;
    total_units: number;
    credited_units: number;
    remaining_units: number;
    is_frozen: boolean;
  };
}

export function BaselineAuditDrawer({ scholarProfileId, open, onOpenChange, onSuccess }: BaselineAuditDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [data, setData] = useState<BaselineReviewResponse | null>(null);
  const [subjectsList, setSubjectsList] = useState<UpdateProspectusSubjectInput[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  const fetchReview = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = (await getCoordinatorBaselineReview(id)) as BaselineReviewResponse;
      setData(res);
      if (res.prospectus?.subjects) {
        setSubjectsList(
          res.prospectus.subjects.map((s: ProspectusSubject) => ({
            subject_id: s.subject_id,
            subject_code: s.subject_code,
            descriptive_title: s.descriptive_title,
            units: Number(s.units) || 3.0,
            year_level: s.year_level || 1,
            semester: s.semester || "1st Semester",
            status: s.status || "UNTAKEN",
            grade: s.grade != null ? Number(s.grade) : undefined,
          })),
        );
      }
    } catch (err) {
      console.error("Failed to fetch baseline review:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && scholarProfileId) {
      fetchReview(scholarProfileId);
    }
  }, [open, scholarProfileId, fetchReview]);

  const handleFieldChange = (
    index: number,
    field: keyof UpdateProspectusSubjectInput,
    value: string | number | string[] | undefined,
  ) => {
    const updated = [...subjectsList];
    updated[index] = { ...updated[index], [field]: value };
    setSubjectsList(updated);
  };

  const handleAddSubject = () => {
    setSubjectsList([
      ...subjectsList,
      {
        subject_code: "SUBJ 101",
        descriptive_title: "Subject Title",
        units: 3.0,
        year_level: 1,
        semester: "1st Semester",
        status: "UNTAKEN",
      },
    ]);
  };

  const handleRemoveSubject = (idx: number) => {
    setSubjectsList(subjectsList.filter((_, i) => i !== idx));
  };

  const handleSaveSubjects = async () => {
    if (!data?.prospectus?.prospectus_id) return;
    try {
      setSaving(true);
      await coordinatorUpdateSubjects(data.prospectus.prospectus_id, {
        subjects: subjectsList,
      });
      if (scholarProfileId) fetchReview(scholarProfileId);
      onSuccess();
    } catch (err) {
      console.error("Failed to save subjects:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleFreeze = async () => {
    if (!data?.prospectus?.prospectus_id) return;
    try {
      setActionLoading(true);
      await freezeBaseline(data.prospectus.prospectus_id);
      if (scholarProfileId) fetchReview(scholarProfileId);
      onSuccess();
    } catch (err) {
      console.error("Failed to freeze baseline:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    if (!data?.prospectus?.prospectus_id) return;
    try {
      setActionLoading(true);
      await unfreezeBaseline(data.prospectus.prospectus_id);
      if (scholarProfileId) fetchReview(scholarProfileId);
      onSuccess();
    } catch (err) {
      console.error("Failed to unfreeze baseline:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifySchool = async (schoolId: number) => {
    try {
      await verifySchoolGrading(schoolId);
      if (scholarProfileId) fetchReview(scholarProfileId);
      onSuccess();
    } catch (err) {
      console.error("Failed to verify school grading:", err);
    }
  };

  const docs = data?.documents || [];
  const currentDoc = docs[selectedDocIndex] || null;
  const isFrozen = data?.prospectus?.is_frozen || false;
  const school = data?.school_grading_system as SchoolGradingSystem | null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-6xl max-h-[92vh] flex flex-col p-4 md:p-6">
        <DialogHeader className="pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-0.5">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Academic Baseline Audit & Verification
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Verify curriculum prospectus against original document and freeze baseline.
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            {isFrozen ? (
              <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 gap-1 text-xs py-1">
                <Lock className="w-3.5 h-3.5" /> Baseline Locked
              </Badge>
            ) : (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs py-1">
                Awaiting Coordinator Approval
              </Badge>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24 text-xs text-muted-foreground">
            Loading scholar curriculum documents and parsed subjects...
          </div>
        ) : !data ? (
          <div className="flex-1 flex items-center justify-center py-24 text-xs text-muted-foreground">
            No baseline submission found for this scholar.
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 py-2 min-h-0 overflow-hidden">
            {/* Left Pane: Original Uploaded Document Viewer */}
            <div className="lg:col-span-5 flex flex-col bg-muted/30 rounded-xl border border-border/60 overflow-hidden p-3 min-h-75">
              <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Uploaded Documents ({docs.length})
                </div>
                {currentDoc && (
                  <a
                    href={currentDoc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    Open Tab <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {docs.length > 1 && (
                <div className="flex gap-1.5 pt-2 pb-1 overflow-x-auto">
                  {docs.map((d, idx) => (
                    <Button
                      key={d.document_id || `doc-tab-${idx}`}
                      variant={selectedDocIndex === idx ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDocIndex(idx)}
                      className="text-[11px] h-7 px-2.5 whitespace-nowrap"
                    >
                      {d.label || d.document_type}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex-1 rounded-lg overflow-hidden bg-background border border-border/60 mt-2 flex items-center justify-center relative">
                {currentDoc ? (
                  currentDoc.file_type?.includes("pdf") || currentDoc.file_url.endsWith(".pdf") ? (
                    <iframe
                      src={currentDoc.file_url}
                      className="w-full h-full border-0"
                      title="Uploaded Document Preview"
                    />
                  ) : (
                    // biome-ignore lint/performance/noImgElement: Document preview from remote storage
                    <img
                      src={currentDoc.file_url}
                      alt="Document preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  )
                ) : (
                  <p className="text-xs text-muted-foreground p-4 text-center">No document file uploaded.</p>
                )}
              </div>
            </div>

            {/* Right Pane: Extracted Subjects & Verification Controls */}
            <div className="lg:col-span-7 flex flex-col min-h-0 overflow-hidden space-y-3">
              {/* Scholar & School Banner */}
              <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground text-sm">{data.scholar_profile.student_name}</div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span>{data.scholar_profile.course_of_study || "Degree"}</span>
                    <span>•</span>
                    <span>{data.scholar_profile.school_name || "Institution"}</span>
                  </div>
                </div>

                {school && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Scale:{" "}
                      <strong>
                        {Number(school.highest_grade)} max / {Number(school.passing_grade)} pass
                      </strong>
                    </span>
                    {!school.is_verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifySchool(school.school_id)}
                        className="text-[11px] h-6 px-2 text-emerald-600 hover:text-emerald-700"
                      >
                        Verify Scale
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Quick-Audit Metric Bar */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-md bg-card border border-border/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Subjects</span>
                  <span className="font-bold text-foreground text-sm">{subjectsList.length}</span>
                </div>
                <div className="p-2 rounded-md bg-card border border-border/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Units</span>
                  <span className="font-bold text-foreground text-sm">
                    {subjectsList.reduce((acc, s) => acc + (Number(s.units) || 0), 0).toFixed(1)}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                    Credited
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    {subjectsList
                      .filter((s) => s.status === "CREDITED" || s.status === "PASSED")
                      .reduce((acc, s) => acc + (Number(s.units) || 0), 0)
                      .toFixed(1)}{" "}
                    u
                  </span>
                </div>
                <div className="p-2 rounded-md bg-card border border-border/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Remaining</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {subjectsList
                      .filter((s) => s.status !== "CREDITED" && s.status !== "PASSED")
                      .reduce((acc, s) => acc + (Number(s.units) || 0), 0)
                      .toFixed(1)}{" "}
                    u
                  </span>
                </div>
              </div>

              {/* Editable Subjects Table */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {subjectsList.map((sub, idx) => (
                  <div
                    key={sub.subject_id ? `subj-id-${sub.subject_id}` : `subj-idx-${sub.subject_code}-${idx}`}
                    className="p-2.5 bg-card rounded-md border border-border/60 grid grid-cols-12 gap-2 items-center text-xs"
                  >
                    <div className="col-span-3">
                      <Input
                        value={sub.subject_code}
                        onChange={(e) => handleFieldChange(idx, "subject_code", e.target.value)}
                        className="h-7 text-xs font-mono"
                        disabled={isFrozen}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        value={sub.descriptive_title}
                        onChange={(e) => handleFieldChange(idx, "descriptive_title", e.target.value)}
                        className="h-7 text-xs"
                        disabled={isFrozen}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={sub.status || "UNTAKEN"}
                        onValueChange={(val) => handleFieldChange(idx, "status", val)}
                        disabled={isFrozen}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNTAKEN">Untaken</SelectItem>
                          <SelectItem value="CREDITED">Credited</SelectItem>
                          <SelectItem value="ENROLLED">Enrolled</SelectItem>
                          <SelectItem value="PASSED">Passed</SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Grade"
                        value={sub.grade ?? ""}
                        onChange={(e) =>
                          handleFieldChange(idx, "grade", e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        className="h-7 text-xs font-mono"
                        disabled={isFrozen}
                      />
                    </div>
                    {!isFrozen && (
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSubject(idx)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {!isFrozen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubject}
                    className="w-full gap-1 text-xs h-8 border-dashed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Subject
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            Total: <strong>{subjectsList.length}</strong> subjects
          </div>

          <div className="flex items-center gap-2">
            {!isFrozen ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveSubjects}
                  disabled={saving || !data?.prospectus}
                  className="gap-1.5 text-xs h-8"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Saving..." : "Save Edits"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleFreeze}
                  disabled={actionLoading || !data?.prospectus}
                  className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {actionLoading ? "Freezing..." : "Freeze & Approve Baseline"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnfreeze}
                disabled={actionLoading}
                className="gap-1.5 text-xs h-8 border-amber-500/50 text-amber-700 dark:text-amber-400"
              >
                <Unlock className="w-3.5 h-3.5" />
                {actionLoading ? "Unfreezing..." : "Unlock / Unfreeze Baseline"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
