"use client";

import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GradeItem } from "@/lib/api/documents";

interface GradeAuditSubjectsTableProps {
  items: GradeItem[];
  onChange: (items: GradeItem[]) => void;
  disabled?: boolean;
  passingGrade?: number;
  highestGrade?: number;
  failingGrade?: number;
}

export function GradeAuditSubjectsTable({
  items,
  onChange,
  disabled = false,
  passingGrade,
  highestGrade,
  failingGrade,
}: GradeAuditSubjectsTableProps) {
  const isDecimalScale =
    (highestGrade != null && highestGrade <= 5.0 && highestGrade >= 1.0) ||
    items.some((it) => {
      const g = Number(it.grade);
      return !Number.isNaN(g) && g > 0 && g <= 5.0;
    });

  const handleFieldChange = (index: number, field: keyof GradeItem, value: unknown) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([
      ...items,
      {
        subject_code: "",
        subject_name: "",
        units: 3,
        grade: isDecimalScale ? 1.0 : 85,
      },
    ]);
  };

  const isPassing = (grade: number) => {
    if (Number.isNaN(grade) || grade <= 0) return true;

    if (highestGrade != null && passingGrade != null) {
      if (highestGrade < (failingGrade ?? 5.0)) {
        // Inverted 5-point scale (e.g. 1.0 highest, 3.0 passing)
        return grade <= passingGrade && grade >= highestGrade;
      }
      // Direct 4-point scale or percentage scale
      return grade >= passingGrade && grade <= highestGrade;
    }

    // Smart auto-detection fallback:
    if (grade <= 5.0 && grade >= 1.0) {
      // 1.00 is top, 3.00 is passing
      return grade <= 3.0;
    }
    // Percentage scale: 75.0 is passing
    return grade >= 75.0;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900">Extracted Subjects ({items.length})</span>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-7 text-[11px] gap-1 px-2 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
          >
            <Plus className="size-3" />
            Add Subject
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto border border-slate-200 rounded-xl text-xs bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase z-10">
            <tr>
              <th className="p-2 w-28">Subject Code</th>
              <th className="p-2">Subject Title</th>
              <th className="p-2 w-16 text-center">Units</th>
              <th className="p-2 w-20 text-center">Grade</th>
              <th className="p-2 w-20 text-center">Result</th>
              {!disabled && <th className="p-2 w-10 text-center" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-xs text-muted-foreground">
                  No subjects extracted yet. Click "Add Subject" to manually add records.
                </td>
              </tr>
            ) : (
              items.map((sub, idx) => {
                const passing = isPassing(Number(sub.grade));
                const itemKey = sub.item_id ? `audit-item-${sub.item_id}` : `audit-idx-${idx}`;

                return (
                  <tr key={itemKey} className="hover:bg-slate-50/50">
                    <td className="p-1.5">
                      <Input
                        disabled={disabled}
                        value={sub.subject_code || ""}
                        onChange={(e) => handleFieldChange(idx, "subject_code", e.target.value.toUpperCase())}
                        placeholder="CS 101"
                        className="h-7 text-xs font-bold uppercase"
                      />
                    </td>
                    <td className="p-1.5">
                      <Input
                        disabled={disabled}
                        value={sub.subject_name || ""}
                        onChange={(e) => handleFieldChange(idx, "subject_name", e.target.value)}
                        placeholder="Subject Name"
                        className="h-7 text-xs"
                      />
                    </td>
                    <td className="p-1.5 text-center">
                      <Input
                        disabled={disabled}
                        type="number"
                        step="0.5"
                        value={sub.units}
                        onChange={(e) => handleFieldChange(idx, "units", Number.parseFloat(e.target.value) || 0)}
                        className="h-7 w-14 text-center font-semibold mx-auto text-xs"
                      />
                    </td>
                    <td className="p-1.5 text-center">
                      <Input
                        disabled={disabled}
                        type="number"
                        step="0.01"
                        value={sub.grade || ""}
                        onChange={(e) => handleFieldChange(idx, "grade", Number.parseFloat(e.target.value) || 0)}
                        className={`h-7 w-16 text-center font-bold mx-auto text-xs ${
                          passing ? "text-emerald-800" : "text-rose-700"
                        }`}
                      />
                    </td>
                    <td className="p-1.5 text-center">
                      {passing ? (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-bold py-0.5 px-2">
                          Passed
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-50 text-rose-800 border-rose-300 text-[10px] font-bold py-0.5 px-2">
                          Failed
                        </Badge>
                      )}
                    </td>
                    {!disabled && (
                      <td className="p-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemove(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          aria-label="Remove subject"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
