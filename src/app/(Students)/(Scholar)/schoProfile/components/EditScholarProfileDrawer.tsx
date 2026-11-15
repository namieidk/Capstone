"use client";

import { AlertCircle, Loader2, UserCog, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { SEX_OPTIONS, SUFFIX_OPTIONS } from "@/lib/validation";

export interface EditScholarProfileValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  sex: string;
  phone_number: string;
  student_address: string;
  bio: string;
}

export interface EditScholarProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<EditScholarProfileValues>;
  saving?: boolean;
  error?: string;
  onSave: (values: EditScholarProfileValues) => void;
}

const FIELD_INPUT = "mt-1.5 h-11! border-line bg-[#f7f9fb]! text-sm! md:text-sm!";

export function EditScholarProfileDrawer({
  open,
  onClose,
  initialValues,
  saving = false,
  error,
  onSave,
}: EditScholarProfileDrawerProps) {
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? "");
  const [middleName, setMiddleName] = useState(initialValues?.middle_name ?? "");
  const [lastName, setLastName] = useState(initialValues?.last_name ?? "");
  const [suffix, setSuffix] = useState(initialValues?.suffix ?? "");
  const [sex, setSex] = useState(initialValues?.sex ?? "");
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phone_number ?? "");
  const [studentAddress, setStudentAddress] = useState(initialValues?.student_address ?? "");
  const [bio, setBio] = useState(initialValues?.bio ?? "");

  useEffect(() => {
    if (open) {
      setFirstName(initialValues?.first_name ?? "");
      setMiddleName(initialValues?.middle_name ?? "");
      setLastName(initialValues?.last_name ?? "");
      setSuffix(initialValues?.suffix ?? "");
      setSex(initialValues?.sex ?? "");
      setPhoneNumber(initialValues?.phone_number ?? "");
      setStudentAddress(initialValues?.student_address ?? "");
      setBio(initialValues?.bio ?? "");
    }
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      first_name: firstName.trim(),
      middle_name: middleName.trim(),
      last_name: lastName.trim(),
      suffix: suffix.trim(),
      sex: sex.trim(),
      phone_number: phoneNumber.trim(),
      student_address: studentAddress.trim(),
      bio: bio.trim(),
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
            <SheetTitle className="text-xl! font-bold text-navy!">Edit Scholar Profile</SheetTitle>
            <SheetDescription className="text-sm!">Update your contact details and bio.</SheetDescription>
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
              <Label htmlFor="scholar-first-name" className="text-sm! font-semibold text-navy">
                First name <span className="text-amber">*</span>
              </Label>
              <Input
                id="scholar-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={FIELD_INPUT}
              />
            </div>
            <div>
              <Label htmlFor="scholar-last-name" className="text-sm! font-semibold text-navy">
                Last name <span className="text-amber">*</span>
              </Label>
              <Input
                id="scholar-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={FIELD_INPUT}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="scholar-middle-name" className="text-sm! font-semibold text-navy">
              Middle name
            </Label>
            <Input
              id="scholar-middle-name"
              placeholder="Optional"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value.replace(/[^a-zA-ZÀ-ÿñÑ\s.\-']/g, ""))}
              className={FIELD_INPUT}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scholar-suffix" className="text-sm! font-semibold text-navy">
                Suffix
              </Label>
              <Select value={suffix || "__NONE__"} onValueChange={(v) => setSuffix(v === "__NONE__" ? "" : v)}>
                <SelectTrigger id="scholar-suffix" className={FIELD_INPUT}>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__">None</SelectItem>
                  {SUFFIX_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scholar-sex" className="text-sm! font-semibold text-navy">
                Sex
              </Label>
              <Select value={sex || "__NONE__"} onValueChange={(v) => setSex(v === "__NONE__" ? "" : v)}>
                <SelectTrigger id="scholar-sex" className={FIELD_INPUT}>
                  <SelectValue placeholder="Not specified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__">Not specified</SelectItem>
                  {SEX_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="scholar-phone" className="text-sm! font-semibold text-navy">
              Mobile phone number
            </Label>
            <Input
              id="scholar-phone"
              type="tel"
              placeholder="09123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <Label htmlFor="scholar-address" className="text-sm! font-semibold text-navy">
              Permanent residence address
            </Label>
            <Input
              id="scholar-address"
              placeholder="Street, Barangay, City, Province"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              className={FIELD_INPUT}
            />
          </div>

          <div>
            <Label htmlFor="scholar-bio" className="text-sm! font-semibold text-navy">
              Bio & Personal Statement
            </Label>
            <Textarea
              id="scholar-bio"
              rows={4}
              placeholder="Tell us about yourself, your university track, and scholarship goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1.5 resize-none border-line bg-[#f7f9fb]! text-sm!"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end gap-3 pt-6 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="border-line font-medium text-navy hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !firstName.trim() || !lastName.trim()}
              className="gap-2 bg-navy hover:bg-navy/90 text-white font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
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
