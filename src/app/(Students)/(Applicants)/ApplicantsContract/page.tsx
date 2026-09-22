"use client";

import { AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type Application, getMyApplication } from "@/lib/api/applications";
import { getMe } from "@/lib/api/auth";
import { type Contract, getMyContracts } from "@/lib/api/contracts";
import { ContractCard } from "./components/ContractCard";

export default function ApplicantsContractPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [fetchedContracts, fetchedApp] = await Promise.all([
        getMyContracts().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return [];
          throw err;
        }),
        getMyApplication().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return null;
          return null;
        }),
      ]);
      setContracts(fetchedContracts);
      setApplication(fetchedApp);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load contracts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time contract events
  useSocketEvent("contract:created", fetchData);
  useSocketEvent("contract:changes_requested", fetchData);
  useSocketEvent("contract:signed", fetchData);

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
        fetchData();
      }
    }
  }

  const isRejected = application?.status === "REJECTED";

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
              <Button type="button" className="h-11 px-5 text-sm!" onClick={fetchData}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : isRejected ? (
          <Card className="rounded-[18px]! border-destructive/30 shadow-va-sm">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" />
              </div>
              <p className="text-base font-bold text-navy">Agreement Not Available</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Your application for this cycle was not accepted. Scholarship contracts and agreements are only issued
                to accepted applicants.
              </p>
              <Link href="/ApplicantsApplication" className="mt-2">
                <Button variant="outline" className="h-10 text-sm font-semibold">
                  View Application Details
                </Button>
              </Link>
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
            <ContractCard key={c.contract_id} contract={c} onChanged={fetchData} onSigned={handleSigned} />
          ))
        )}
      </div>
    </div>
  );
}
