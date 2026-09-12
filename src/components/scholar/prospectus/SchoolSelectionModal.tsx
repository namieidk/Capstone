"use client";

import { Building2, Check, Plus } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSchoolGradings, type SchoolGradingSystem, selectOrProposeSchool } from "@/lib/api/baseline";

interface SchoolSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSchoolId?: number | null;
  onSuccess: () => void;
}

export function SchoolSelectionModal({ open, onOpenChange, currentSchoolId, onSuccess }: SchoolSelectionModalProps) {
  const [schools, setSchools] = useState<SchoolGradingSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentSchoolId ? String(currentSchoolId) : "");

  // New school form state
  const [newSchoolName, setNewSchoolName] = useState("");
  const [scaleType, setScaleType] = useState("NUMERIC_4_POINT");
  const [highestGrade, setHighestGrade] = useState("4.0");
  const [passingGrade, setPassingGrade] = useState("2.0");
  const [failingGrade, setFailingGrade] = useState("1.0");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      listSchoolGradings()
        .then((data) => {
          setSchools(data || []);
          if (currentSchoolId) setSelectedSchoolId(String(currentSchoolId));
        })
        .finally(() => setLoading(false));
    }
  }, [open, currentSchoolId]);

  const handleScalePresetChange = (type: string) => {
    setScaleType(type);
    if (type === "NUMERIC_4_POINT") {
      setHighestGrade("4.0");
      setPassingGrade("2.0");
      setFailingGrade("1.0");
    } else if (type === "NUMERIC_5_POINT") {
      setHighestGrade("1.0");
      setPassingGrade("3.0");
      setFailingGrade("5.0");
    } else if (type === "PERCENTAGE_100") {
      setHighestGrade("100.0");
      setPassingGrade("75.0");
      setFailingGrade("65.0");
    }
  };

  const handleConfirmExisting = async () => {
    if (!selectedSchoolId) return;
    try {
      setSaving(true);
      await selectOrProposeSchool({ school_id: Number(selectedSchoolId) });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to select school:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleProposeNewSchool = async () => {
    if (!newSchoolName.trim()) return;
    try {
      setSaving(true);
      await selectOrProposeSchool({
        new_school_name: newSchoolName.trim(),
        grading_scale: scaleType,
        highest_grade: parseFloat(highestGrade),
        passing_grade: parseFloat(passingGrade),
        failing_grade: parseFloat(failingGrade),
        notes: notes.trim() || undefined,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to propose school:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Building2 className="w-5 h-5 text-primary" />
            Institution Grading Scale Configuration
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select your enrolled university or enter its grading scale parameters.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full mt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="existing" className="text-xs">
              Registered Institutions
            </TabsTrigger>
            <TabsTrigger value="new" className="text-xs">
              Propose New School
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4 pt-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Select University / College</Label>
              {loading ? (
                <div className="h-10 rounded-md bg-muted animate-pulse" />
              ) : (
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger className="w-full text-xs h-10">
                    <SelectValue placeholder="Choose your school..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s.school_id} value={String(s.school_id)} className="text-xs">
                        {s.school_name} ({s.grading_scale})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedSchoolId && (
              <div className="p-3 bg-muted/60 rounded-lg border border-border/60 text-xs space-y-1.5">
                {(() => {
                  const sc = schools.find((s) => String(s.school_id) === selectedSchoolId);
                  if (!sc) return null;
                  const isInv = Number(sc.highest_grade) < Number(sc.failing_grade);
                  return (
                    <>
                      <div className="font-semibold text-foreground">{sc.school_name}</div>
                      <div className="text-muted-foreground">
                        Scale:{" "}
                        {isInv ? "1.0 to 5.0 (1.0 Highest)" : `${sc.highest_grade} Max, ${sc.passing_grade} Passing`}
                      </div>
                      <div className="flex gap-4 pt-1 text-[11px]">
                        <span>
                          Max: <strong>{Number(sc.highest_grade).toFixed(2)}</strong>
                        </span>
                        <span>
                          Passing: <strong className="text-emerald-600">{Number(sc.passing_grade).toFixed(2)}</strong>
                        </span>
                        <span>
                          Failing: <strong className="text-destructive">{Number(sc.failing_grade).toFixed(2)}</strong>
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmExisting}
                disabled={!selectedSchoolId || saving}
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="w-4 h-4" />
                {saving ? "Confirming..." : "Confirm Institution"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="new" className="space-y-3.5 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">School / University Name</Label>
              <Input
                placeholder="e.g., Holy Cross of Davao College"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Grading Scale Format</Label>
              <Select value={scaleType} onValueChange={handleScalePresetChange}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NUMERIC_4_POINT" className="text-xs">
                    4.0 Scale (e.g. UM — 4.0 Max, 2.0 Passing, 1.0 Failing)
                  </SelectItem>
                  <SelectItem value="NUMERIC_5_POINT" className="text-xs">
                    5.0 Scale (e.g. UP — 1.0 Highest, 3.0 Passing, 5.0 Failing)
                  </SelectItem>
                  <SelectItem value="PERCENTAGE_100" className="text-xs">
                    Percentage 100% (e.g. 100 Max, 75 Passing, 65 Failing)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Highest Mark</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={highestGrade}
                  onChange={(e) => setHighestGrade(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Passing Mark</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={passingGrade}
                  onChange={(e) => setPassingGrade(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Failing Mark</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={failingGrade}
                  onChange={(e) => setFailingGrade(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Notes / Scale Description (Optional)</Label>
              <Input
                placeholder="e.g. 4.0 = 95-100%, 2.0 = 75-79% passing"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleProposeNewSchool}
                disabled={!newSchoolName.trim() || saving}
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                {saving ? "Saving..." : "Submit Scale"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
