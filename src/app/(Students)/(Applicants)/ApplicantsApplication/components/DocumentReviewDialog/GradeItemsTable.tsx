"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EditableGradeItem } from "./types";

interface GradeItemsTableProps {
  gradeItems: EditableGradeItem[];
  isReadOnly: boolean;
  onAddSubject: () => void;
  onRemoveSubject: (id: string) => void;
  onItemChange: (id: string, field: keyof EditableGradeItem, val: string | number) => void;
}

export function GradeItemsTable({
  gradeItems,
  isReadOnly,
  onAddSubject,
  onRemoveSubject,
  onItemChange,
}: GradeItemsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-navy">Extracted Subjects & Grades ({gradeItems.length})</h4>
          <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
            Check subject titles and grades against your document pages.
          </p>
        </div>
        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddSubject}
            className="h-8 gap-1 text-xs! text-navy"
          >
            <Plus className="size-3.5" />
            Add Subject
          </Button>
        )}
      </div>

      {gradeItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No individual subjects extracted. Click &quot;Add Subject&quot; to add them manually, or confirm with the
          General Average above.
        </div>
      ) : (
        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1 sm:max-h-80">
          {gradeItems.map((item, index) => (
            <div key={item.id}>
              {/* Mobile Card View (< sm) */}
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2.5 sm:hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-white text-[0.65rem] font-bold text-navy">
                      {index + 1}
                    </span>
                    <Input
                      value={item.subject_code}
                      disabled={isReadOnly}
                      onChange={(e) => onItemChange(item.id, "subject_code", e.target.value)}
                      placeholder="Code (e.g. MATH 101)"
                      className="h-8! w-32! shrink-0 bg-white! text-xs!"
                      title="Subject Code"
                    />
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => onRemoveSubject(item.id)}
                      className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Remove ${item.subject_name || "subject"}`}
                      title="Remove subject"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <Input
                  value={item.subject_name}
                  disabled={isReadOnly}
                  onChange={(e) => onItemChange(item.id, "subject_name", e.target.value)}
                  placeholder="Subject descriptive title"
                  className="h-8! w-full bg-white! text-xs!"
                  title="Subject Title"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between rounded-md border border-border bg-white px-2.5 py-1">
                    <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase">Units</span>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      value={item.units}
                      disabled={isReadOnly}
                      onChange={(e) => onItemChange(item.id, "units", Number(e.target.value))}
                      placeholder="Units"
                      className="h-6! w-16! border-0! bg-transparent! p-0! text-right font-medium text-navy text-xs! focus-visible:ring-0!"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-border bg-white px-2.5 py-1">
                    <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase">Grade</span>
                    <Input
                      type="number"
                      step="0.1"
                      min="50"
                      max="100"
                      value={item.grade}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        onItemChange(item.id, "grade", e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="0.0"
                      className="h-6! w-16! border-0! bg-transparent! p-0! text-right font-bold text-navy text-xs! focus-visible:ring-0!"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop Row View (sm and up) */}
              <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 p-2 text-xs sm:flex">
                <span className="w-5 text-center text-[0.7rem] font-semibold text-muted-foreground">{index + 1}</span>
                <Input
                  value={item.subject_code}
                  disabled={isReadOnly}
                  onChange={(e) => onItemChange(item.id, "subject_code", e.target.value)}
                  placeholder="Code"
                  className="h-8! w-24! shrink-0 bg-white! text-xs! sm:text-xs!"
                  title="Subject Code"
                />
                <Input
                  value={item.subject_name}
                  disabled={isReadOnly}
                  onChange={(e) => onItemChange(item.id, "subject_name", e.target.value)}
                  placeholder="Subject descriptive title"
                  className="h-8! min-w-0 flex-1 bg-white! text-xs! sm:text-xs!"
                  title="Subject Title"
                />
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={item.units}
                  disabled={isReadOnly}
                  onChange={(e) => onItemChange(item.id, "units", Number(e.target.value))}
                  placeholder="Units"
                  className="h-8! w-16! shrink-0 bg-white! text-center text-xs! sm:text-xs!"
                  title="Credits / Units"
                />
                <Input
                  type="number"
                  step="0.1"
                  min="50"
                  max="100"
                  value={item.grade}
                  disabled={isReadOnly}
                  onChange={(e) => onItemChange(item.id, "grade", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Grade"
                  className="h-8! w-20! shrink-0 bg-white! text-center font-semibold text-navy text-xs! sm:text-xs!"
                  title="Grade"
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => onRemoveSubject(item.id)}
                    className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Remove ${item.subject_name || "subject"}`}
                    title="Remove subject"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
