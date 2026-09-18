"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { getMe } from "@/lib/api/auth";
import { type Contract, getMyContracts } from "@/lib/api/contracts";
import { ContractCard } from "./components/ContractCard";

export default function ApplicantsContractPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setContracts(await getMyContracts());
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load contracts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Real-time contract events
  useSocketEvent("contract:created", fetchContracts);
  useSocketEvent("contract:changes_requested", fetchContracts);
  useSocketEvent("contract:signed", fetchContracts);

  // Signing promotes APPLICANT → SCHOLAR: sync auth state, then route by
  // the fresh role instead of the stale pre-sign one.
  async function handleSigned() {
    const freshUser = await refreshUser();
    if (freshUser?.role === "SCHOLAR") {
      window.location.href = "/scholar-onboarding";
    } else {
      try {
        const me = await getMe();
        if (me.role === "SCHOLAR") {
          window.location.href = "/scholar-onboarding";
        } else {
          router.push("/ApplicantsDashboard");
        }
      } catch {
        fetchContracts();
      }
    }
  }

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <PageHeader title="Contract" subtitle="Review, correct, and sign your scholarship agreement." />

      <div className="flex flex-col gap-4 px-5 pt-5 pb-24 md:px-10">
        {loading ? (
          <Card className="rounded-[18px]! shadow-va-sm">
            <CardContent className="flex flex-col gap-3 px-6 py-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="w-full min-h-170 h-[75vh] max-h-262.5 rounded-xl" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        ) : loadError ? (
          <Card className="rounded-[18px]! shadow-va-sm">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <FileText className="size-10 text-muted-foreground" />
              <p className="text-base font-semibold">Could not load contracts</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
              <Button type="button" className="h-11 px-5 text-sm!" onClick={fetchContracts}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : contracts.length === 0 ? (
          <Card className="rounded-[18px]! shadow-va-sm">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <FileText className="size-10 text-muted-foreground" />
              <p className="text-base font-semibold">No contract yet</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Once the grantor approves your application and provides your scholarship agreement, it will appear here
                for review and signature.
              </p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((c) => (
            <ContractCard key={c.contract_id} contract={c} onChanged={fetchContracts} onSigned={handleSigned} />
          ))
        )}
      </div>
    </div>
  );
}
