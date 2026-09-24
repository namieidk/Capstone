"use client";

import { GraduationCap, KeyRound, Mail, Phone, Power, School } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { StudentRow } from "./student-helpers";

interface StudentDrawerProps {
  student: StudentRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenResetPassword: () => void;
  onToggleStatus: () => void;
  acting: boolean;
  actionError: string;
}

const SECTION_LABEL =
  "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80 flex items-center gap-1.5";

function MetricCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-center justify-center">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  );
}

export function StudentDrawer({
  student,
  open,
  onOpenChange,
  onOpenResetPassword,
  onToggleStatus,
  acting,
  actionError,
}: StudentDrawerProps) {
  const [confirmToggleStatus, setConfirmToggleStatus] = useState(false);

  useEffect(() => {
    if (!student) setConfirmToggleStatus(false);
  }, [student]);

  if (!student) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
          <div className="space-y-7 px-6 py-7">
            <SheetHeader className="space-y-0">
              <div className="flex items-center gap-4">
                <Avatar className="size-14 border border-border">
                  {student.avatarUrl ? <AvatarImage src={student.avatarUrl} alt={student.name} /> : null}
                  <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                    {student.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <SheetTitle className="text-base font-semibold leading-tight">{student.name}</SheetTitle>
                  <SheetDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <GraduationCap className="size-3.5" />
                    <span>{student.type} Account</span>
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Status">
                <Badge
                  className={`gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    student.status === "Active"
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {student.status}
                </Badge>
              </MetricCard>
              <MetricCard label="Joined">
                <p className="text-sm font-medium text-foreground">{student.joined}</p>
              </MetricCard>
            </div>

            {/* Academic Info */}
            <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
              <p className={SECTION_LABEL}>
                <School className="size-3.5" />
                Academic Background
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <DetailItem label="University" value={student.university || "Not provided"} />
                <DetailItem label="Degree" value={student.degree || "Not provided"} />
                <DetailItem label="Year Level" value={student.yearLevel || "—"} />
                <DetailItem label="Latest GPA" value={student.gpa || "—"} />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
              <p className={SECTION_LABEL}>
                <Mail className="size-3.5" />
                Contact Details
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium text-foreground">{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-medium text-foreground">{student.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {actionError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
                {actionError}
              </div>
            )}

            {/* Account Actions */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                Account Actions
              </p>
              <div className="flex flex-col gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-start rounded-xl text-sm font-medium"
                  onClick={onOpenResetPassword}
                >
                  <KeyRound className="size-4 mr-2.5 text-primary" />
                  Reset Password
                </Button>

                <Button
                  type="button"
                  variant={student.user.is_active ? "destructive" : "default"}
                  className="h-11 w-full justify-start rounded-xl text-sm font-medium"
                  onClick={() => setConfirmToggleStatus(true)}
                  disabled={acting}
                >
                  <Power className="size-4 mr-2.5" />
                  {student.user.is_active ? "Deactivate Account" : "Activate Account"}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={confirmToggleStatus} onOpenChange={setConfirmToggleStatus}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {student.user.is_active ? "Deactivate student account?" : "Activate student account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {student.user.is_active
                ? `${student.name} will immediately lose access to their student portal until reactivated.`
                : `${student.name} will regain access to submit applications and view scholarship status.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmToggleStatus(false);
                onToggleStatus();
              }}
              disabled={acting}
              className={
                student.user.is_active ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
              }
            >
              {acting ? "Updating..." : student.user.is_active ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
