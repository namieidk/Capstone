"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import {
  type ApplicationWithProfile,
  listApplications,
  rescheduleInterview,
  scheduleInterview,
} from "@/lib/api/applications";
import { listMeetings } from "@/lib/api/meetings";
import { combineDateAndTime, formatDateTime, parseFlexibleDate } from "./date-utils";
import { DURATION_OPTIONS } from "./meeting-types";

interface ScheduleMeetingDialogProps {
  applicationId: number | null;
  applicantName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "schedule" | "reschedule";
  onSuccess: () => void;
}

function applicantLabel(a: ApplicationWithProfile): string {
  const p = a.scholar_profile;
  if (p && (p.first_name || p.last_name)) return `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
  return `Application #${a.application_id}`;
}

export function ScheduleMeetingDialog({
  applicationId,
  applicantName,
  open,
  onOpenChange,
  mode,
  onSuccess,
}: ScheduleMeetingDialogProps) {
  const [applicants, setApplicants] = useState<ApplicationWithProfile[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("45");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ applicant?: string; date?: string; time?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  const [loadingCurrent, setLoadingCurrent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPickedId(null);
    setDate("");
    setTime("");
    setDuration("45");
    setNotes("");
    setFieldErrors({});
    setApiError(null);
    setApplicantsError(null);
    let alive = true;
    setLoadingApplicants(true);
    listApplications()
      .then((all) => {
        if (!alive) return;
        setApplicants(all.filter((a) => a.stage === "Interview"));
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setApplicantsError(err instanceof ApiError ? err.message : "Could not load applicants.");
      })
      .finally(() => {
        if (alive) setLoadingApplicants(false);
      });
    return () => {
      alive = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || mode !== "reschedule" || applicationId == null) {
      setCurrentLabel(null);
      return;
    }
    let alive = true;
    setLoadingCurrent(true);
    listMeetings({ applicationId })
      .then((res) => {
        if (!alive) return;
        const first = res.data.find((m) => (m.status ?? "").toUpperCase() !== "CANCELLED") ?? res.data[0];
        const raw = first?.scheduled_at ?? first?.meeting_date ?? null;
        setCurrentLabel(raw ? formatDateTime(parseFlexibleDate(raw)) : null);
      })
      .catch(() => {
        if (alive) setCurrentLabel(null);
      })
      .finally(() => {
        if (alive) setLoadingCurrent(false);
      });
    return () => {
      alive = false;
    };
  }, [open, mode, applicationId]);

  const effectiveId = applicationId ?? pickedId;
  const lockedLabel = applicationId != null ? (applicantName ?? `Application #${applicationId}`) : null;

  function validate(): boolean {
    const errors: { applicant?: string; date?: string; time?: string } = {};
    if (effectiveId == null) errors.applicant = "Select an applicant.";
    if (!date) errors.date = "Date is required.";
    if (!time) errors.time = "Time is required.";
    if (date && time) {
      const iso = combineDateAndTime(date, time);
      if (!iso) {
        errors.date = "Invalid date or time.";
      } else if (new Date(iso).getTime() <= Date.now()) {
        errors.time = "Choose a future date and time.";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    const iso = combineDateAndTime(date, time);
    if (!iso || effectiveId == null) return;
    setSubmitting(true);
    try {
      if (mode === "schedule") {
        await scheduleInterview(effectiveId, {
          interview_at: iso,
          duration_minutes: Number(duration),
          provider_notes: notes.trim() || undefined,
        });
      } else {
        await rescheduleInterview(effectiveId, {
          new_interview_at: iso,
          duration_minutes: Number(duration),
          reschedule_notes: notes.trim() || undefined,
        });
      }
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Could not save the meeting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg!">
            {mode === "schedule" ? "Schedule a meeting" : "Reschedule meeting"}
          </DialogTitle>
          <DialogDescription className="text-sm!">
            {mode === "schedule"
              ? "Pick an interview-stage applicant and a future time."
              : "Pick a new future time for this interview."}
          </DialogDescription>
        </DialogHeader>

        {mode === "reschedule" && applicationId != null && (
          <p className="rounded-md bg-tint px-3 py-2.5 text-xs text-muted-foreground">
            {loadingCurrent
              ? "Loading current schedule…"
              : currentLabel
                ? `Currently scheduled: ${currentLabel}`
                : "Current schedule unavailable."}
          </p>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          {lockedLabel ? (
            <div className="flex flex-col gap-1.5">
              <Label>Applicant</Label>
              <p className="rounded-md bg-tint px-3 py-2.5 text-sm font-medium">{lockedLabel}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meeting-applicant">Applicant</Label>
              <Select
                value={pickedId != null ? String(pickedId) : ""}
                onValueChange={(v) => setPickedId(v ? Number(v) : null)}
                disabled={loadingApplicants || applicants.length === 0}
              >
                <SelectTrigger id="meeting-applicant" className="h-11 w-full text-sm!">
                  <SelectValue placeholder={loadingApplicants ? "Loading applicants…" : "Select an applicant"} />
                </SelectTrigger>
                <SelectContent>
                  {applicants.map((a) => (
                    <SelectItem key={a.application_id} value={String(a.application_id)} className="text-sm!">
                      {applicantLabel(a)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {applicantsError && <p className="text-xs text-destructive">{applicantsError}</p>}
              {!loadingApplicants && !applicantsError && applicants.length === 0 && (
                <p className="text-xs text-muted-foreground">No applicants are in the Interview stage right now.</p>
              )}
              {fieldErrors.applicant && <p className="text-xs text-destructive">{fieldErrors.applicant}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meeting-date">Date</Label>
              <Input
                id="meeting-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 text-sm!"
              />
              {fieldErrors.date && <p className="text-xs text-destructive">{fieldErrors.date}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meeting-time">Time</Label>
              <Input
                id="meeting-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11 text-sm!"
              />
              {fieldErrors.time && <p className="text-xs text-destructive">{fieldErrors.time}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meeting-duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="meeting-duration" className="h-11 w-full text-sm!">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((d) => (
                  <SelectItem key={d} value={String(d)} className="text-sm!">
                    {d} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meeting-notes">Notes (optional)</Label>
            <Textarea
              id="meeting-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agenda, reminders, or context for the applicant…"
              className="min-h-20 text-sm!"
            />
          </div>

          {apiError && <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{apiError}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-5 text-sm!"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-5 text-sm!" disabled={submitting}>
              {submitting ? "Saving…" : mode === "schedule" ? "Schedule meeting" : "Reschedule meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
