/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ArrowRight, FileSignature, FileText, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { type Application, getMyApplication } from "@/lib/api/applications";
import { getMyDocuments, type ScholarDocument } from "@/lib/api/documents";
import { useSidebar } from "../../../../components/SidebarContext";
import { AMBER, BellIcon, GOOD, MenuIcon, s } from "../../../../components/StudentShared";

export default function DashboardPage() {
  const { toggleMobile } = useSidebar();
  const { user } = useAuth();

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<ScholarDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "SCHOLAR") {
      window.location.href = "/scholardashboard";
    }
  }, [user?.role]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [app, docs] = await Promise.all([
        getMyApplication().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return null;
          return null;
        }),
        getMyDocuments().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return [];
          return [];
        }),
      ]);
      setApplication(app);
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to load applicant dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const firstName = user?.first_name?.trim() ? user.first_name : "Applicant";

  const isRejected = application?.status === "REJECTED";
  const isApproved = application?.status === "APPROVED";
  const verifiedCount = documents.filter((d) => d.status === "VERIFIED" || d.status === "STUDENT_CONFIRMED").length;
  const totalDocs = documents.length;

  return (
    <div>
      <header style={s.topbar}>
        <button type="button" className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Good day, {firstName}.</h1>
          <p style={s.topbarSub}>Here is a look at your application status and requirements.</p>
        </div>
        <div style={s.topbarRight}>
          <button type="button" style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: isRejected ? "#dc2626" : isApproved ? GOOD : AMBER }} />
          </button>
        </div>
      </header>

      <div style={s.mainContent}>
        {loading ? (
          <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
          </div>
        ) : isRejected ? (
          /* REJECTED APPLICANT DECISION CARD */
          <div className="flex flex-col gap-5 mt-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-destructive/30 bg-linear-to-br from-red-50/70 via-white to-red-50/20 p-6 shadow-sm dark:from-red-950/20 dark:via-background dark:to-red-950/10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xs ring-4 ring-destructive/10">
                    <ShieldAlert className="size-7" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="px-2.5 py-0.5 text-xs font-semibold">
                        Application Unsuccessful
                      </Badge>
                      {application?.decision_at && (
                        <span className="text-xs text-muted-foreground">
                          Decided on {new Date(application.decision_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-navy dark:text-foreground">
                      Application Evaluation Concluded
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Thank you for your interest and effort in applying for our scholarship program. After careful
                      evaluation of all submissions, your application was not selected for this scholarship cycle.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <Link href="/ApplicantsApplication">
                    <Button variant="outline" className="h-10 w-full text-sm! font-semibold gap-2 border-border/80">
                      <FileText className="size-4" />
                      <span>View Submission Details</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Reviewer Feedback / Remarks */}
              {application?.rejection_reason && (
                <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-1">
                    Evaluation Committee Feedback
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed italic">"{application.rejection_reason}"</p>
                </div>
              )}

              {/* Re-application & Contact info */}
              <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
                <p>Your uploaded documents and profile information remain securely stored in read-only mode.</p>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=support@viascholar.edu&su=${encodeURIComponent(
                    `Scholarship Application Inquiry - Ref #${String(application?.application_id || "").padStart(5, "0")}`,
                  )}&body=${encodeURIComponent(
                    `Dear Scholarship Committee,\n\nI am writing to respectfully inquire regarding my scholarship application (Ref #${String(application?.application_id || "").padStart(5, "0")}) for the current academic cycle.\n\nThank you for your guidance.\n\nSincerely,\nApplicant`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-navy hover:underline shrink-0"
                >
                  <Mail className="size-3.5" />
                  <span>Inquire via Gmail</span>
                </a>
              </div>
            </div>

            {/* Read-only Document Summary (only if documents were submitted) */}
            {documents.length > 0 && (
              <Card className="rounded-2xl border-border bg-white shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-navy font-semibold">
                    Submitted Documents ({documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.document_id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3 text-sm bg-muted/10"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="size-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-navy">{doc.document_type}</p>
                          <p className="text-xs text-muted-foreground">{doc.file_name || "Uploaded file"}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* ACTIVE / PENDING APPLICANT VIEW */
          <div className="flex flex-col gap-5 mt-4">
            {isApproved && (
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <FileSignature className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy">Application Approved!</h3>
                    <p className="text-xs text-muted-foreground">
                      Your scholarship agreement is ready for digital signature.
                    </p>
                  </div>
                </div>
                <Link href="/ApplicantsContract">
                  <Button className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5">
                    <span>Sign Agreement</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="rounded-xl border-border bg-white p-4 shadow-xs">
                <p className="text-xs text-muted-foreground">Application Stage</p>
                <p className="text-lg font-bold text-navy mt-1">{application?.stage || "Not Submitted"}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {application ? `Status: ${application.status}` : "Submit your application to begin"}
                </p>
              </Card>

              <Card className="rounded-xl border-border bg-white p-4 shadow-xs">
                <p className="text-xs text-muted-foreground">Documents Verified</p>
                <p className="text-lg font-bold text-navy mt-1">
                  {verifiedCount} of {totalDocs}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {verifiedCount === totalDocs && totalDocs > 0 ? "All requirements complete" : "Review pending"}
                </p>
              </Card>

              <Card className="rounded-xl border-border bg-white p-4 shadow-xs">
                <p className="text-xs text-muted-foreground">Submission Date</p>
                <p className="text-lg font-bold text-navy mt-1">
                  {application?.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">ViaScholar Portal</p>
              </Card>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/ApplicantsApplication">
                <Button className="h-10 text-xs font-semibold gap-2">
                  <span>Open Application Details</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
