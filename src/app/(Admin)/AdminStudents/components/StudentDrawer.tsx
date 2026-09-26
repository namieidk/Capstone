"use client";

import { Calendar, GraduationCap, KeyRound, Mail, Phone, Power, School } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground wrap-break-word">{value}</p>
    </div>
  );
}

function StudentDrawerContentBody({
  student,
  onOpenResetPassword,
  onConfirmToggleStatus,
  actionError,
  acting,
}: {
  student: StudentRow;
  onOpenResetPassword: () => void;
  onConfirmToggleStatus: () => void;
  actionError: string;
  acting: boolean;
}) {
  return (
    <div className="space-y-6 px-6 pt-3 pb-9 sm:py-7">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 border border-border">
          {student.avatarUrl ? <AvatarImage src={student.avatarUrl} alt={student.name} /> : null}
          <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">{student.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-base font-semibold leading-tight text-foreground">{student.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="size-3.5" />
            <span>{student.type} Account</span>
          </p>
        </div>
      </div>

      {/* Academic Info - Stacked */}
      <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
        <p className={SECTION_LABEL}>
          <School className="size-3.5" />
          Academic Background
        </p>
        <div className="space-y-3.5">
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

      {/* Joined Card - Below Contact Details */}
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-5 py-3.5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-3.5" />
          <span className="text-xs font-medium">Joined</span>
        </div>
        <p className="text-sm font-semibold text-foreground">{student.joined}</p>
      </div>

      {actionError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
          {actionError}
        </div>
      )}

      {/* Account Actions */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">Account Actions</p>
        <div className="flex flex-col gap-2.5">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center rounded-xl text-sm font-medium sm:justify-start"
            onClick={onOpenResetPassword}
          >
            <KeyRound className="mr-2.5 size-4 text-primary" />
            Reset Password
          </Button>

          <Button
            type="button"
            variant={student.user.is_active ? "destructive" : "default"}
            className="h-11 w-full justify-center rounded-xl text-sm font-medium sm:justify-start"
            onClick={onConfirmToggleStatus}
            disabled={acting}
          >
            <Power className="mr-2.5 size-4" />
            {student.user.is_active ? "Deactivate Account" : "Activate Account"}
          </Button>
        </div>
      </div>
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
  const isMobile = useIsMobile();
  const [cachedStudent, setCachedStudent] = useState<StudentRow | null>(student);
  const [confirmToggleStatus, setConfirmToggleStatus] = useState(false);

  useEffect(() => {
    if (student) {
      setCachedStudent(student);
    } else {
      setConfirmToggleStatus(false);
    }
  }, [student]);

  const activeStudent = student ?? cachedStudent;

  if (!activeStudent) return null;

  const confirmationDialog = (
    <AlertDialog open={confirmToggleStatus} onOpenChange={setConfirmToggleStatus}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {activeStudent.user.is_active ? "Deactivate student account?" : "Activate student account?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {activeStudent.user.is_active
              ? `${activeStudent.name} will immediately lose access to their student portal until reactivated.`
              : `${activeStudent.name} will regain access to submit applications and view scholarship status.`}
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
              activeStudent.user.is_active ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            }
          >
            {acting ? "Updating..." : activeStudent.user.is_active ? "Deactivate" : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="flex h-[85vh] max-h-[92vh] min-h-[80vh] flex-col p-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <StudentDrawerContentBody
                student={activeStudent}
                onOpenResetPassword={onOpenResetPassword}
                onConfirmToggleStatus={() => setConfirmToggleStatus(true)}
                actionError={actionError}
                acting={acting}
              />
            </div>
          </DrawerContent>
        </Drawer>
        {confirmationDialog}
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
          <StudentDrawerContentBody
            student={activeStudent}
            onOpenResetPassword={onOpenResetPassword}
            onConfirmToggleStatus={() => setConfirmToggleStatus(true)}
            actionError={actionError}
            acting={acting}
          />
        </SheetContent>
      </Sheet>
      {confirmationDialog}
    </>
  );
}
