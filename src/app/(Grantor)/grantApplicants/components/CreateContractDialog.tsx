"use client";

import { AlertCircle, CheckCircle2, FileSignature, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Applicant } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
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
import { ApiError } from "@/lib/api";
import { type Contract, createContract, listContracts } from "@/lib/api/contracts";

interface CreateContractDialogProps {
  applicant: Applicant | null;
  existingContract?: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractCreated?: (contract: Contract) => void;
}

function getDefaultDates() {
  const now = new Date();
  const effective = now.toISOString().slice(0, 10);
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const expiry = oneYearLater.toISOString().slice(0, 10);
  return { effective, expiry };
}

export function CreateContractDialog({
  applicant,
  existingContract,
  open,
  onOpenChange,
  onContractCreated,
}: CreateContractDialogProps) {
  const [contractNumber, setContractNumber] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdContract, setCreatedContract] = useState<Contract | null>(null);

  // Initialize or reset form when applicant or open changes
  useEffect(() => {
    if (applicant && open) {
      setError(null);
      setCreatedContract(null);
      const { effective, expiry } = getDefaultDates();
      setEffectiveDate(existingContract?.effective_date ?? effective);
      setExpiryDate(existingContract?.expiry_date ?? expiry);

      // Compute smart next contract number
      const year = new Date().getFullYear();
      listContracts()
        .then((all) => {
          const taken = new Set(all.map((c) => c.contract_number));
          let num = `VS-${year}-${String(applicant.id).padStart(4, "0")}`;
          let offset = 1;
          while (taken.has(num)) {
            num = `VS-${year}-${String(applicant.id + offset * 100).padStart(4, "0")}`;
            offset++;
          }
          setContractNumber(num);
        })
        .catch(() => {
          const fallback = `VS-${year}-${String(applicant.id).padStart(4, "0")}`;
          setContractNumber(fallback);
        });
    }
  }, [applicant, existingContract, open]);

  function handleRegenerateNumber() {
    if (!applicant) return;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    setContractNumber(`VS-${year}-${randomSuffix}`);
  }

  async function handleCreate() {
    if (!applicant) return;
    const profileId = applicant.profileId;
    if (profileId == null) {
      setError("Scholar profile ID is missing. The applicant may not have a completed profile yet.");
      return;
    }
    if (contractNumber.trim() === "") {
      setError("Contract number is required.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const contract = await createContract({
        scholar_profile_id: profileId,
        contract_number: contractNumber.trim(),
        effective_date: effectiveDate || undefined,
        expiry_date: expiryDate || undefined,
      });
      toast.success(
        existingContract
          ? `Scholarship contract ${contract.contract_number} re-issued successfully!`
          : `Scholarship contract ${contract.contract_number} issued and sent successfully!`,
      );
      if (onContractCreated) {
        onContractCreated(contract);
      }
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to generate scholarship contract.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setError(null);
    setCreatedContract(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="border-b border-border bg-white px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-navy/10 text-navy dark:bg-navy/30 dark:text-navy-foreground">
              <FileSignature className="size-5.5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-navy">
                {existingContract ? "Re-issue Scholarship Contract" : "Issue Scholarship Contract"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {existingContract
                  ? "Generate a new agreement version for digital signature."
                  : "Generate and dispatch an official scholarship agreement for digital signature."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-5">
          {createdContract ? (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-good-bg/40 border border-good/20 rounded-xl">
              <div className="flex size-12 items-center justify-center rounded-full bg-good/10 text-good mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-base font-bold text-navy">Contract Issued Successfully!</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                Contract <strong className="text-foreground">#{createdContract.contract_number}</strong> has been
                generated and dispatched to <strong className="text-foreground">{applicant?.name}</strong>.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white border border-border px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
                <span>Status:</span>
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-[0.65rem]!">
                  Awaiting Student Signature
                </Badge>
              </div>
            </div>
          ) : (
            <>
              {/* Applicant Overview Info Box */}
              {applicant && (
                <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-muted-foreground">Applicant:</span>
                      <p className="font-semibold text-foreground truncate">{applicant.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Track:</span>
                      <p className="font-semibold text-foreground truncate">{applicant.track || "General Track"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Course & Year:</span>
                      <p className="font-semibold text-foreground truncate">
                        {applicant.course} · {applicant.year}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">School:</span>
                      <p className="font-semibold text-foreground truncate">{applicant.schoolName || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {existingContract && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
                  <p className="font-semibold">Notice: Contract already exists</p>
                  <p className="mt-0.5 text-amber-800">
                    A contract (<strong>#{existingContract.contract_number}</strong>) was previously issued. Issuing a
                    new one will supersede the previous agreement.
                  </p>
                </div>
              )}

              {/* Form Fields */}
              <div className="flex flex-col gap-3.5">
                {/* Contract Number with Auto-generate helper */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="contract-number-input" className="text-xs font-semibold text-navy">
                      Contract Number <span className="text-amber-600">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={handleRegenerateNumber}
                      className="flex items-center gap-1 text-[0.7rem] font-medium text-navy hover:text-navy/70 transition-colors"
                      title="Generate new unique number"
                    >
                      <RefreshCw className="size-3" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="contract-number-input"
                      value={contractNumber}
                      onChange={(e) => setContractNumber(e.target.value)}
                      placeholder="e.g. VS-2026-0001"
                      className="h-10 bg-white pr-24 font-mono text-xs font-semibold text-navy"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground pointer-events-none flex items-center gap-1">
                      <Sparkles className="size-2.5 text-amber-500" />
                      Auto
                    </span>
                  </div>
                  <p className="mt-1 text-[0.7rem] text-muted-foreground">
                    Pre-generated based on current year and student ID. You can manually customize it if needed.
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="effective-date-input" className="text-xs font-semibold text-navy mb-1.5 block">
                      Effective Date
                    </Label>
                    <Input
                      id="effective-date-input"
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="h-10 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry-date-input" className="text-xs font-semibold text-navy mb-1.5 block">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiry-date-input"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="h-10 bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-border bg-white px-6 py-4.5 sm:px-8 flex flex-row justify-end gap-3">
          {createdContract ? (
            <Button type="button" className="h-10.5 px-6 text-xs font-semibold" onClick={handleClose}>
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-10.5 px-5 text-xs font-semibold"
                disabled={submitting}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-10.5 px-6 text-xs font-semibold gap-1.5"
                disabled={submitting || contractNumber.trim() === ""}
                onClick={handleCreate}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Issuing Contract...</span>
                  </>
                ) : (
                  <>
                    <FileSignature className="size-3.5" />
                    <span>{existingContract ? "Re-issue & Send" : "Issue & Send Contract"}</span>
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
