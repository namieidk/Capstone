"use client";

import { Pencil, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import type { GlobalSettings } from "@/lib/api/settings";
import { thresholdSchema } from "@/lib/validation";

interface ThresholdCardProps {
  settings: GlobalSettings;
  canEdit: boolean;
  onSave: (threshold: number) => Promise<void>;
}

function formatThreshold(value: number): string {
  return `${Number(value).toFixed(2)}%`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ThresholdCard({ settings, canEdit, onSave }: ThresholdCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEditing() {
    setDraft(String(Number(settings.grade_threshold)));
    setError("");
    setEditing(true);
  }

  function closeDrawer() {
    if (saving) return;
    setEditing(false);
    setError("");
  }

  async function handleSave() {
    const parsed = thresholdSchema.safeParse(Number(draft));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid threshold.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(parsed.data);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update threshold.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card className="mt-5 rounded-[18px]! shadow-va-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white shadow-xs">
                <SlidersHorizontal className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg!">Grade retention threshold</CardTitle>
                <CardDescription className="text-sm!">
                  Minimum GWA a scholar must keep to stay eligible.
                </CardDescription>
              </div>
            </div>
            {canEdit && (
              <Button
                type="button"
                className="h-11 rounded-full bg-navy px-5 text-sm! text-white shadow-xs hover:bg-navy/90"
                onClick={startEditing}
              >
                <Pencil className="size-4" />
                Edit threshold
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold tracking-tight text-navy tabular-nums">
            {formatThreshold(settings.grade_threshold)}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Scholars below this GWA lose retention eligibility. Applies to evaluations after saving.
          </p>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Last updated {formatDateTime(settings.updated_at)}
            {settings.updated_by_user_id ? ` · by user ID ${settings.updated_by_user_id}` : ""}
          </p>
          {!canEdit && (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Only admins and grantors can change this setting.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit Drawer */}
      <Sheet open={editing} onOpenChange={(open) => !open && closeDrawer()}>
        <SheetContent side="right" className="w-full max-w-md! bg-slate-50 p-0 gap-0" showCloseButton={false}>
          {/* Drawer Header */}
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white shadow-xs">
                <SlidersHorizontal className="size-4.5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit grade threshold</h2>
                <p className="text-xs text-slate-500">Minimum GWA required to stay eligible</p>
              </div>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                disabled={saving}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </SheetClose>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <Label htmlFor="grade-threshold" className="text-sm! font-semibold text-navy">
              Threshold (%)
            </Label>
            <Input
              id="grade-threshold"
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="mt-2 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">Enter a value between 0 and 100.</p>

            {error && (
              <div className="mt-3 rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
                {error}
              </div>
            )}

            <Separator className="my-5" />

            <p className="text-xs text-muted-foreground">
              Current value: <strong className="text-navy">{formatThreshold(settings.grade_threshold)}</strong>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated {formatDateTime(settings.updated_at)}
              {settings.updated_by_user_id ? ` · by user ID ${settings.updated_by_user_id}` : ""}
            </p>
          </div>

          {/* Drawer Footer */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-3.5 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 text-sm! text-navy"
              onClick={closeDrawer}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="button" className="h-10 px-6 text-sm!" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save threshold"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
