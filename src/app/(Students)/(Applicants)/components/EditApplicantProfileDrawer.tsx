"use client";

import { AlertCircle, Loader2, UserCog, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export interface EditApplicantProfileValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  student_address: string;
  bio: string;
}

export interface EditApplicantProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<EditApplicantProfileValues>;
  saving?: boolean;
  error?: string;
  onSave: (values: EditApplicantProfileValues) => void;
}

const FIELD_INPUT = "mt-1.5 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!";

export function EditApplicantProfileDrawer({
  open,
  onClose,
  initialValues,
  saving = false,
  error,
  onSave,
}: EditApplicantProfileDrawerProps) {
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? "");
  const [lastName, setLastName] = useState(initialValues?.last_name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phone_number ?? "");
  const [studentAddress, setStudentAddress] = useState(initialValues?.student_address ?? "");
  const [bio, setBio] = useState(initialValues?.bio ?? "");

  useEffect(() => {
    if (open) {
      setFirstName(initialValues?.first_name ?? "");
      setLastName(initialValues?.last_name ?? "");
      setPhoneNumber(initialValues?.phone_number ?? "");
      setStudentAddress(initialValues?.student_address ?? "");
      setBio(initialValues?.bio ?? "");
    }
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      student_address: studentAddress,
      bio,
    });
  };

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-110! max-w-[92vw]! gap-0 overflow-y-auto border-line bg-white p-8 text-sm!"
      >
        <div className="flex items-start gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-xs">
            <UserCog className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-xl! font-bold text-navy!">Edit profile</SheetTitle>
            <SheetDescription className="text-sm!">Update your personal contact details and bio.</SheetDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-muted-foreground hover:text-navy"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicant-first-name" className="text-sm! font-semibold text-navy">
                First name <span className="text-amber">*</span>
              </Label>
              <Input
                id="applicant-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={FIELD_INPUT}
              />
            </div>
            <div>
              <Label htmlFor="applicant-last-name" className="text-sm! font-semibold text-navy">
                Last name <span className="text-amber">*</span>
              </Label>
              <Input
                id="applicant-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={FIELD_INPUT}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="applicant-phone" className="text-sm! font-semibold text-navy">
              Phone number
            </Label>
            <Input
              id="applicant-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 09123456789"
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <Label htmlFor="applicant-address" className="text-sm! font-semibold text-navy">
              Permanent address
            </Label>
            <Input
              id="applicant-address"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              placeholder="e.g. 123 Main St, City, Province"
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <Label htmlFor="applicant-bio" className="text-sm! font-semibold text-navy">
              Bio
            </Label>
            <Textarea
              id="applicant-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A brief bio about your academic goals and background..."
              rows={4}
              className="mt-1.5 min-h-24! resize-y border-line bg-[#f7f9fb]! text-sm! md:text-sm!"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-line pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="h-11 border-line px-5 text-sm font-medium text-navy hover:bg-tint"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-11 bg-navy px-6 text-sm font-medium text-white hover:bg-navy/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
