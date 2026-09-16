"use client";

import { GraduationCap, KeyRound, Mail, Power, School } from "lucide-react";
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

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {Icon && <Icon className="size-3" />}
        <span>{label}</span>
      </div>
      <p className="text-xs font-semibold text-foreground truncate">{value}</p>
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
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6 space-y-6">
          <SheetHeader className="space-y-4">
            <div className="flex items-center gap-3.5">
              <Avatar className="size-14 border border-border">
                {student.avatarUrl ? <AvatarImage src={student.avatarUrl} alt={student.name} /> : null}
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                  {student.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-0.5">
                <SheetTitle className="text-base font-semibold">{student.name}</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" />
                  <span>{student.type} Account</span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-lg border border-border bg-card p-3 space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">Status</p>
              <div className="pt-0.5">
                <Badge
                  variant={student.status === "Active" ? "default" : "secondary"}
                  className={`text-[10px] px-2 py-0.5 font-medium ${
                    student.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current mr-1.5" />
                  {student.status}
                </Badge>
              </div>
            </div>
            <InfoCard label="Joined" value={student.joined} />
          </div>

          {/* Academic Info */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <School className="size-3.5" />
              Academic Background
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">University</p>
                <p className="font-semibold text-foreground truncate">{student.university || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Degree</p>
                <p className="font-semibold text-foreground truncate">{student.degree || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Year Level</p>
                <p className="font-semibold text-foreground">{student.yearLevel || "—"}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Latest GPA</p>
                <p className="font-semibold text-foreground">{student.gpa || "—"}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5" />
              Contact Details
            </p>
            <div className="text-xs space-y-1.5">
              <p className="text-foreground">
                <span className="text-muted-foreground font-medium">Email: </span>
                <strong>{student.email}</strong>
              </p>
              {student.phone && (
                <p className="text-foreground">
                  <span className="text-muted-foreground font-medium">Phone: </span>
                  <strong>{student.phone}</strong>
                </p>
              )}
            </div>
          </div>

          {actionError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {actionError}
            </div>
          )}

          {/* Account Actions */}
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account Actions</p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-xs font-medium h-9"
                onClick={onOpenResetPassword}
              >
                <KeyRound className="size-3.5 mr-2 text-primary" />
                Reset Password
              </Button>

              <Button
                type="button"
                variant={student.user.is_active ? "destructive" : "default"}
                className="w-full justify-start text-xs font-medium h-9"
                onClick={() => setConfirmToggleStatus(true)}
                disabled={acting}
              >
                <Power className="size-3.5 mr-2" />
                {student.user.is_active ? "Deactivate Account" : "Activate Account"}
              </Button>
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
