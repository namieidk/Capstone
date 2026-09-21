"use client";

import { Pencil, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    <Card className="mt-5 rounded-[18px]! shadow-va-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white shadow-xs">
              <SlidersHorizontal className="size-5" />
            </span>
            <div>
              <CardTitle className="text-lg!">Grade retention threshold</CardTitle>
              <CardDescription className="text-sm!">Minimum GWA a scholar must keep to stay eligible.</CardDescription>
            </div>
          </div>
          {canEdit && !editing && (
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
        {editing ? (
          <div className="max-w-sm">
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
              className="mt-2 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">Enter a value between 0 and 100.</p>
            {error && (
              <div className="mt-3 rounded-[10px] border border-[#f5c2c0] bg-[#fdebec] px-3.5 py-3 text-sm leading-relaxed text-[#b3261e]">
                {error}
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 text-sm! text-navy"
                onClick={() => {
                  setEditing(false);
                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="button" className="h-11 px-6 text-sm!" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save threshold"}
              </Button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
