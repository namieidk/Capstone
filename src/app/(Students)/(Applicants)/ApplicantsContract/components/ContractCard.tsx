"use client";

import { ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Contract, ContractStatus } from "@/lib/api/contracts";
import { RequestChangesDialog } from "./RequestChangesDialog";
import { SignContractForm } from "./SignContractForm";

interface ContractCardProps {
  contract: Contract;
  onChanged: () => void;
  onSigned: () => void;
}

function statusVariant(status: ContractStatus): "default" | "secondary" | "outline" | "destructive" {
  if (status === "SIGNED") return "default";
  if (status === "TERMINATED") return "destructive";
  return "secondary";
}

function datePart(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US");
}

export function ContractCard({ contract, onChanged, onSigned }: ContractCardProps) {
  const [requesting, setRequesting] = useState<Contract | null>(null);
  const [signing, setSigning] = useState(false);
  const pending = contract.status === "PENDING";

  return (
    <>
      <Card className="rounded-[18px]! shadow-va-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-navy">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-base! text-navy">Contract #{contract.contract_number}</CardTitle>
                <CardDescription className="text-xs!">
                  Effective {datePart(contract.effective_date)} · Expires {datePart(contract.expiry_date)}
                </CardDescription>
              </div>
            </div>
            <Badge variant={statusVariant(contract.status)} className="h-6 px-2.5 text-xs!">
              {contract.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {pending && contract.document_url ? (
            <>
              <iframe
                src={contract.document_url}
                title={`Contract ${contract.contract_number} draft`}
                className="h-96 w-full rounded-xl border border-border bg-white"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-xs!"
                  onClick={() => window.open(contract.document_url ?? "", "_blank", "noopener")}
                >
                  <ExternalLink className="size-4" />
                  Open full document
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-xs! text-navy"
                  onClick={() => setRequesting(contract)}
                >
                  Request corrections
                </Button>
                <Button type="button" className="h-10 text-xs!" onClick={() => setSigning((v) => !v)}>
                  {signing ? "Hide signing" : "Review & sign"}
                </Button>
              </div>
              {signing && <SignContractForm contractId={contract.contract_id} onDone={onSigned} />}
            </>
          ) : (
            <>
              {contract.signed_document_url && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 self-start text-xs!"
                  onClick={() => window.open(contract.signed_document_url ?? "", "_blank", "noopener")}
                >
                  <ExternalLink className="size-4" />
                  View signed contract
                </Button>
              )}
              {contract.certificate_id && (
                <p className="text-xs text-muted-foreground">Certificate: {contract.certificate_id}</p>
              )}
            </>
          )}
          <Separator />
          <p className="text-xs text-muted-foreground">
            Signing activates your Scholar status. Request corrections first if anything is wrong — signed contracts
            cannot be changed here.
          </p>
        </CardContent>
      </Card>
      <RequestChangesDialog contract={requesting} onClose={() => setRequesting(null)} onSent={onChanged} />
    </>
  );
}
