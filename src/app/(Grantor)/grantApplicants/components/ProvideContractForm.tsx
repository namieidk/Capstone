"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { createContract } from "@/lib/api/contracts";

interface ProvideContractFormProps {
  profileId: number | null;
}

export function ProvideContractForm({ profileId }: ProvideContractFormProps) {
  const [contractNumber, setContractNumber] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdNumber, setCreatedNumber] = useState<string | null>(null);

  if (profileId == null) {
    return <p className="text-sm text-muted-foreground">Scholar profile unavailable — cannot create a contract.</p>;
  }

  if (createdNumber) {
    return (
      <p className="rounded-md bg-good-bg px-3 py-2.5 text-sm text-good">
        Contract #{createdNumber} provided. The applicant will be notified to review and sign.
      </p>
    );
  }

  async function handleCreate() {
    const sid = profileId;
    if (sid == null) {
      setError("Scholar profile unavailable — cannot create a contract.");
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
        scholar_profile_id: sid,
        contract_number: contractNumber.trim(),
        effective_date: effectiveDate || undefined,
        expiry_date: expiryDate || undefined,
      });
      setCreatedNumber(contract.contract_number);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create contract.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="contract-number" className="text-xs! font-semibold text-navy">
          Contract number <span className="text-amber">*</span>
        </Label>
        <Input
          id="contract-number"
          value={contractNumber}
          onChange={(e) => setContractNumber(e.target.value)}
          placeholder="e.g. VS-2026-0001"
          className="mt-1.5 h-10! bg-white! text-xs! sm:text-xs!"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="contract-effective" className="text-xs! font-semibold text-navy">
            Effective date
          </Label>
          <Input
            id="contract-effective"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="mt-1.5 h-10! bg-white! text-xs! sm:text-xs!"
          />
        </div>
        <div>
          <Label htmlFor="contract-expiry" className="text-xs! font-semibold text-navy">
            Expiry date
          </Label>
          <Input
            id="contract-expiry"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1.5 h-10! bg-white! text-xs! sm:text-xs!"
          />
        </div>
      </div>
      {error && <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>}
      <Button type="button" className="h-11 text-sm!" disabled={submitting} onClick={handleCreate}>
        {submitting ? "Providing..." : "Provide contract"}
      </Button>
    </div>
  );
}
