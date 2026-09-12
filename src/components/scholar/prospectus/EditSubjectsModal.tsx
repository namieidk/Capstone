"use client";

import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  type ProspectusSubject,
  type UpdateProspectusSubjectInput,
  updateProspectusSubjects,
} from "@/lib/api/baseline";

interface EditSubjectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: ProspectusSubject[];
  curriculumYear?: string | null;
  courseName?: string | null;
  courseCode?: string | null;
  onSuccess: () => void;
}

export function EditSubjectsModal({
  open,
  onOpenChange,
  subjects: initialSubjects,
  curriculumYear,
  courseName,
  courseCode,
  onSuccess,
}: EditSubjectsModalProps) {
  const [subjectsList, setSubjectsList] = useState<UpdateProspectusSubjectInput[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSubjectsList(
        initialSubjects.map((s) => ({
          subject_id: s.subject_id,
          subject_code: s.subject_code,
          descriptive_title: s.descriptive_title,
          units: Number(s.units) || 3.0,
          year_level: s.year_level || 1,
          semester: s.semester || "1st Semester",
          prerequisites: Array.isArray(s.prerequisites) ? s.prerequisites : [],
          status: s.status || "UNTAKEN",
          grade: s.grade != null ? Number(s.grade) : undefined,
          credited_term: s.credited_term || undefined,
        })),
      );
    }
  }, [open, initialSubjects]);

  const handleAddSubject = () => {
    setSubjectsList([
      ...subjectsList,
      {
        subject_code: "NEW 101",
        descriptive_title: "New Subject Title",
        units: 3.0,
        year_level: 1,
        semester: "1st Semester",
        prerequisites: [],
        status: "UNTAKEN",
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjectsList(subjectsList.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    field: keyof UpdateProspectusSubjectInput,
    value: string | number | string[] | undefined,
  ) => {
    const updated = [...subjectsList];
    updated[index] = { ...updated[index], [field]: value };
    setSubjectsList(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProspectusSubjects({
        curriculum_year: curriculumYear || undefined,
        course_name: courseName || undefined,
        course_code: courseCode || undefined,
        subjects: subjectsList,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update subjects:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Curriculum Checklist Subjects
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Adjust course codes, descriptive titles, credit units, or add missing curriculum courses.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
          {subjectsList.map((sub, idx) => (
            <div
              key={sub.subject_id ? `edit-sub-id-${sub.subject_id}` : `edit-sub-idx-${sub.subject_code}-${idx}`}
              className="p-3 bg-muted/40 rounded-lg border border-border/60 grid grid-cols-12 gap-2.5 items-center text-xs"
            >
              <div className="col-span-3 space-y-1">
                <Label className="text-[10px] text-muted-foreground">Subject Code</Label>
                <Input
                  value={sub.subject_code}
                  onChange={(e) => handleFieldChange(idx, "subject_code", e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="col-span-4 space-y-1">
                <Label className="text-[10px] text-muted-foreground">Descriptive Title</Label>
                <Input
                  value={sub.descriptive_title}
                  onChange={(e) => handleFieldChange(idx, "descriptive_title", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <Label className="text-[10px] text-muted-foreground">Units</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={sub.units}
                  onChange={(e) => handleFieldChange(idx, "units", parseFloat(e.target.value) || 0)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <Label className="text-[10px] text-muted-foreground">Year Level</Label>
                <Select
                  value={String(sub.year_level)}
                  onValueChange={(val) => handleFieldChange(idx, "year_level", Number(val))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-1 flex justify-end pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSubject(idx)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSubject}
            className="w-full gap-1.5 text-xs h-9 border-dashed"
          >
            <Plus className="w-4 h-4 text-primary" />
            Add Subject Row
          </Button>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex justify-between sm:justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Total: <strong>{subjectsList.length}</strong> subjects
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Checklist"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
