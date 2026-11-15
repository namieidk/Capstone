"use client";

import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CurriculumMetricsSummary } from "@/app/(Students)/(Scholar)/scholarProspectus/components/CurriculumMetricsSummary";
import { GradingSystemCard } from "@/app/(Students)/(Scholar)/scholarProspectus/components/GradingSystemCard";
import { ProspectusChecklistTable } from "@/app/(Students)/(Scholar)/scholarProspectus/components/ProspectusChecklistTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CoordinatorScholarDetails,
  getCoordinatorScholarDetails,
  type ScholarDetailDocument,
} from "@/lib/api/baseline";

interface ScholarFullDetailsViewProps {
  scholarProfileId: number;
  backHref: string;
  backLabel?: string;
}

const HEALTH_META: Record<"good" | "warn" | "bad", { label: string; badgeClass: string }> = {
  good: { label: "Good Standing", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  warn: { label: "Needs Attention", badgeClass: "bg-amber-50 text-amber-800 border-amber-200" },
  bad: { label: "At Risk / Hold", badgeClass: "bg-red-50 text-red-700 border-red-200" },
};

const DOCUMENT_STATUS_CLASS: Record<string, string> = {
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  STUDENT_CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PASSED_PRECHECK: "bg-sky-50 text-sky-700 border-sky-200",
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  NEEDS_REUPLOAD: "bg-orange-50 text-orange-800 border-orange-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const DISBURSEMENT_STATUS_CLASS: Record<string, string> = {
  SETTLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLAIMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RELEASED: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-sky-50 text-sky-700 border-sky-200",
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

function formatStatusLabel(value?: string | null): string {
  if (!value) return "Unknown";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function isImageUrl(url: string, fileType?: string | null): boolean {
  if (fileType && /^image\//i.test(fileType)) return true;
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

export function ScholarFullDetailsView({
  scholarProfileId,
  backHref,
  backLabel = "Back to Scholars List",
}: ScholarFullDetailsViewProps) {
  const [details, setDetails] = useState<CoordinatorScholarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; fileType?: string | null } | null>(null);

  const loadDetails = useCallback(async () => {
    if (!Number.isInteger(scholarProfileId) || scholarProfileId <= 0) {
      setError("Invalid scholar ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getCoordinatorScholarDetails(scholarProfileId);
      setDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scholar details.");
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [scholarProfileId]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  const filteredDocuments = useMemo(() => {
    const docs = details?.documents ?? [];
    const term = docSearch.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter((d) => {
      return (
        (d.document_type || "").toLowerCase().includes(term) ||
        (d.label || "").toLowerCase().includes(term) ||
        (d.file_name || "").toLowerCase().includes(term) ||
        (d.status || "").toLowerCase().includes(term)
      );
    });
  }, [details?.documents, docSearch]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <Card className="border-border shadow-sm">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Unable to Load Scholar Details</h2>
              <p className="text-sm text-muted-foreground">{error || "Scholar profile could not be found."}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button asChild className="bg-navy hover:bg-navy/90 text-white! font-medium">
                <Link href={backHref} className="text-white!">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  {backLabel}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => void loadDetails()}>
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    scholar_profile: profile,
    school_grading_system: grading,
    prospectus,
    documents,
    disbursements,
    grade_reports,
    term_enrollments,
    contracts,
    metrics,
  } = details;
  const fullName = [profile.first_name, profile.middle_name, profile.last_name, profile.suffix]
    .filter(Boolean)
    .join(" ");
  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "SC";
  const healthMeta = HEALTH_META[metrics.health] ?? HEALTH_META.warn;

  const openDocumentPreview = (
    doc: Pick<ScholarDetailDocument, "document_type" | "label" | "file_name" | "file_url" | "file_type">,
  ) => {
    setPreviewDoc({
      title: doc.label || doc.file_name || formatStatusLabel(doc.document_type),
      url: doc.file_url,
      fileType: doc.file_type,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center">
        <Button asChild variant="outline" size="default" className="h-10 px-4 text-sm font-medium gap-2 bg-white">
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </Button>
      </div>

      {/* Scholar Profile Header Card */}
      <Card className="overflow-hidden border-border shadow-sm bg-white py-0 gap-0">
        <div
          className="h-32 sm:h-36 w-full bg-cover bg-center"
          style={
            profile.banner_url
              ? { backgroundImage: `url(${profile.banner_url})` }
              : { background: "linear-gradient(135deg, #1E3254 0%, #2C4875 100%)" }
          }
        />
        <CardContent className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 -mt-12 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-navy text-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="pt-1 sm:pt-15">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{fullName}</h1>
                  {profile.archived_at && (
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                      Archived
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {profile.course_of_study || "Course not specified"}
                  {profile.current_year_level ? ` · Year ${profile.current_year_level}` : ""}
                  {profile.school_name ? ` · ${profile.school_name}` : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:pt-15">
              <Badge variant="outline" className={`font-medium ${healthMeta.badgeClass}`}>
                {healthMeta.label}
              </Badge>
              <Badge
                variant="outline"
                className={
                  profile.academic_baseline_status === "BASELINE_FROZEN"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                    : "bg-amber-50 text-amber-800 border-amber-200 font-medium"
                }
              >
                {formatStatusLabel(profile.academic_baseline_status)}
              </Badge>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-foreground/85 bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-3 mb-5">
              {profile.bio}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-muted-foreground">Student No. & Track</div>
                <div className="font-semibold text-foreground truncate">
                  {profile.student_number || "—"}
                  {profile.scholarship_track ? ` · ${profile.scholarship_track}` : ""}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-muted-foreground">Email Address</div>
                <div className="font-semibold text-foreground truncate">{profile.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-muted-foreground">Phone Number</div>
                <div className="font-semibold text-foreground truncate">
                  {profile.phone_number || "—"}
                  {profile.is_phone_verified ? " (Verified)" : ""}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
              <User className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-muted-foreground">Gender & Joined</div>
                <div className="font-semibold text-foreground truncate">
                  {profile.gender || "—"} · {formatDate(profile.created_at)}
                </div>
              </div>
            </div>

            {(profile.student_address || profile.school_address) && (
              <>
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-muted-foreground">Home Address</div>
                    <div className="font-medium text-foreground">{profile.student_address || "—"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 sm:col-span-2">
                  <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-muted-foreground">School Address</div>
                    <div className="font-medium text-foreground">{profile.school_address || "—"}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Cumulative GWA</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">
                {metrics.gwa !== null ? metrics.gwa.toFixed(2) : "—"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {grading ? formatStatusLabel(grading.grading_scale) : "Standard Scale"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Prospectus Units</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">
                {metrics.credited_units} / {metrics.total_units}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.total_subjects} subjects · {metrics.remaining_units} remaining
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Documents Uploaded</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">
                {metrics.verified_documents} / {metrics.total_documents}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.pending_documents} pending verification
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Disbursed</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">
                {formatCurrency(metrics.total_disbursed_amount)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.total_disbursements} record{metrics.total_disbursements === 1 ? "" : "s"} ·{" "}
                {formatCurrency(metrics.settled_disbursed_amount)} settled
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Detail Tabs: Prospectus | Documents Uploaded | Disbursements | Grade Reports & Terms */}
      <Tabs defaultValue="prospectus" className="mt-2 w-full space-y-4">
        <TabsList className="grid h-auto! w-full grid-cols-2 rounded-2xl bg-[#f1efe9] p-0.5 sm:inline-grid sm:h-8! sm:w-auto sm:grid-cols-4 sm:rounded-full">
          <TabsTrigger
            value="prospectus"
            className="gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <BookOpen className="size-3.5" />
            Prospectus
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <FileText className="size-3.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="disbursements"
            className="gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <Wallet className="size-3.5" />
            Disbursements
          </TabsTrigger>
          <TabsTrigger
            value="academics"
            className="gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground transition-all data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <GraduationCap className="size-3.5" />
            Reports & Terms
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROSPECTUS (Mirrors scholarProspectus layout in read-only mode) */}
        <TabsContent value="prospectus" className="space-y-6">
          {/* 1. Curriculum Verification Status Header */}
          <Card className="rounded-xl border border-line bg-white shadow-2xs">
            <CardContent className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tint text-navy">
                  <CheckCircle2 className="size-4 text-navy" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-navy">Curriculum Status:</span>
                    {prospectus?.is_frozen || profile.academic_baseline_status === "BASELINE_FROZEN" ? (
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 gap-1.5 px-3 py-1 text-xs font-semibold">
                        <Lock className="size-3.5 text-emerald-700" /> Baseline Locked & Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-900 border-amber-300 gap-1.5 px-3 py-1 text-xs font-semibold">
                        <Clock className="size-3.5 text-amber-700" />{" "}
                        {formatStatusLabel(profile.academic_baseline_status)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {prospectus?.frozen_by_employee
                      ? `Verified by ${prospectus.frozen_by_employee.first_name} ${prospectus.frozen_by_employee.last_name} on ${formatDate(prospectus.frozen_at)}`
                      : "Read-only curriculum prospectus checklist synchronized with scholar academic records."}
                  </p>
                </div>
              </div>

              {prospectus?.document && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => prospectus.document && openDocumentPreview(prospectus.document)}
                  className="h-8 gap-1.5 rounded-lg border-line text-navy hover:bg-tint text-xs font-semibold shrink-0"
                >
                  <Eye className="size-3.5" />
                  View Prospectus File
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 2. Institution Grading Scale Banner */}
          <GradingSystemCard schoolSystem={grading} isFrozen={prospectus?.is_frozen ?? false} readOnly />

          {/* 3. Progress & Unit Metrics Summary */}
          <CurriculumMetricsSummary
            courseName={prospectus?.course_name || profile.course_of_study}
            courseCode={prospectus?.course_code}
            curriculumYear={prospectus?.curriculum_year}
            metrics={{
              total_subjects: metrics.total_subjects,
              total_units: metrics.total_units,
              credited_subjects: (prospectus?.subjects ?? []).filter(
                (s) => s.status === "PASSED" || s.status === "CREDITED",
              ).length,
              credited_units: metrics.credited_units,
              untaken_subjects: (prospectus?.subjects ?? []).filter((s) => s.status === "UNTAKEN").length,
              remaining_units: metrics.remaining_units,
              is_baseline_frozen: prospectus?.is_frozen ?? false,
            }}
          />

          {/* 4. Curriculum Checklist Table */}
          <ProspectusChecklistTable subjects={prospectus?.subjects ?? []} />
        </TabsContent>

        {/* TAB 2: DOCUMENTS UPLOADED */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="border-border shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Uploaded Scholar Documents
                </CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Filter by type, file, or status..."
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  {documents.length === 0
                    ? "No documents uploaded by this scholar yet."
                    : "No documents match your filter."}
                </div>
              ) : (
                <Table className="w-full md:table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="md:w-36">Type</TableHead>
                      <TableHead className="md:w-28">Uploaded</TableHead>
                      <TableHead className="md:w-36">Status</TableHead>
                      <TableHead className="hidden md:table-cell md:w-44">Review Details</TableHead>
                      <TableHead className="md:w-32 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.document_id}>
                        <TableCell className="whitespace-normal wrap-break-word">
                          <div className="font-medium text-sm text-foreground wrap-break-word">
                            {doc.label || doc.file_name || `Document #${doc.document_id}`}
                          </div>
                          {doc.file_name && (
                            <div className="text-xs text-muted-foreground wrap-break-word">
                              {doc.file_name}
                              {doc.file_size ? ` · ${doc.file_size}` : ""}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground whitespace-normal wrap-break-word">
                          {formatStatusLabel(doc.document_type)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-normal">
                          {formatDate(doc.uploaded_at)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] ${DOCUMENT_STATUS_CLASS[doc.status] ?? "bg-slate-100 text-slate-700"}`}
                          >
                            {formatStatusLabel(doc.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground whitespace-normal wrap-break-word">
                          {doc.rejection_reason ? (
                            <span className="text-red-600">{doc.rejection_reason}</span>
                          ) : doc.reviewed_by_employee ? (
                            <span>
                              {doc.reviewed_by_employee.first_name} {doc.reviewed_by_employee.last_name}
                              {doc.verified_at ? ` · ${formatDate(doc.verified_at)}` : ""}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDocumentPreview(doc)}
                              className="h-8 px-2.5 text-xs gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" title="Open in new tab">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: DISBURSEMENTS */}
        <TabsContent value="disbursements" className="space-y-4">
          <Card className="border-border shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Disbursement History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {disbursements.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No disbursements recorded for this scholar yet.
                </div>
              ) : (
                <Table className="w-full md:table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="md:w-32">Term</TableHead>
                      <TableHead className="md:w-28 text-right">Amount</TableHead>
                      <TableHead>Payment & Reference</TableHead>
                      <TableHead className="md:w-40">Dates</TableHead>
                      <TableHead className="md:w-24">Status</TableHead>
                      <TableHead className="md:w-32 text-right">Receipts & Docs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disbursements.map((item) => (
                      <TableRow key={item.disbursement_id}>
                        <TableCell className="whitespace-normal wrap-break-word align-top">
                          <div className="font-medium text-sm text-foreground">AY {item.academic_year}</div>
                          <div className="text-xs text-muted-foreground">{item.semester}</div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm tabular-nums align-top">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-xs space-y-0.5 whitespace-normal wrap-break-word align-top">
                          <div className="font-medium text-foreground wrap-break-word">
                            {item.payment_method || "Direct Release"}
                            {item.bank_name ? ` · ${item.bank_name}` : ""}
                          </div>
                          {item.check_number && (
                            <div className="text-muted-foreground wrap-break-word">Check #{item.check_number}</div>
                          )}
                          {item.voucher_number && (
                            <div className="text-muted-foreground wrap-break-word">Voucher #{item.voucher_number}</div>
                          )}
                          {item.or_number && (
                            <div className="text-emerald-700 font-medium wrap-break-word">OR #{item.or_number}</div>
                          )}
                          {item.remarks && (
                            <div className="text-muted-foreground italic wrap-break-word">{item.remarks}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground space-y-0.5 whitespace-normal align-top">
                          <div>Issued: {formatDate(item.date_issued)}</div>
                          <div>Claimed: {formatDate(item.date_claimed)}</div>
                          {item.settled_at && <div>Settled: {formatDate(item.settled_at)}</div>}
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant="outline"
                            className={`text-[11px] ${DISBURSEMENT_STATUS_CLASS[item.status] ?? "bg-slate-100 text-slate-700"}`}
                          >
                            {formatStatusLabel(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <div className="inline-flex flex-wrap justify-end gap-1.5">
                            {item.or_document && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() =>
                                  item.or_document &&
                                  setPreviewDoc({
                                    title: `Official Receipt (${item.academic_year} ${item.semester})`,
                                    url: item.or_document.file_url,
                                    fileType: item.or_document.file_type,
                                  })
                                }
                              >
                                OR
                              </Button>
                            )}
                            {item.term_enrollment?.cor_document && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() =>
                                  item.term_enrollment?.cor_document &&
                                  setPreviewDoc({
                                    title: `COR (${item.academic_year} ${item.semester})`,
                                    url: item.term_enrollment.cor_document.file_url,
                                  })
                                }
                              >
                                COR
                              </Button>
                            )}
                            {item.term_enrollment?.soa_document && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() =>
                                  item.term_enrollment?.soa_document &&
                                  setPreviewDoc({
                                    title: `SOA (${item.academic_year} ${item.semester})`,
                                    url: item.term_enrollment.soa_document.file_url,
                                  })
                                }
                              >
                                SOA
                              </Button>
                            )}
                            {!item.or_document &&
                              !item.term_enrollment?.cor_document &&
                              !item.term_enrollment?.soa_document && (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: GRADE REPORTS, TERM ENROLLMENTS & CONTRACTS */}
        <TabsContent value="academics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Grade Reports */}
            <Card className="border-border shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Submitted Grade Reports ({grade_reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {grade_reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No grade reports submitted yet.</p>
                ) : (
                  grade_reports.map((report) => (
                    <div key={report.report_id} className="border border-border rounded-lg p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-sm">
                            AY {report.academic_year} · {report.semester}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            GPA: <span className="font-semibold text-foreground">{report.gpa.toFixed(2)}</span> ·
                            Submitted {formatDate(report.submitted_at)}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[11px]">
                          {formatStatusLabel(report.status)}
                        </Badge>
                      </div>
                      {report.remarks && <p className="text-xs text-muted-foreground">{report.remarks}</p>}
                      {report.document && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs gap-1"
                          onClick={() =>
                            report.document &&
                            setPreviewDoc({
                              title: `Grade Report (${report.academic_year} ${report.semester})`,
                              url: report.document.file_url,
                            })
                          }
                        >
                          <Eye className="w-3 h-3" />
                          View Report File
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Term Enrollments & Contracts */}
            <div className="space-y-4">
              <Card className="border-border shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Term Enrollments ({term_enrollments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {term_enrollments.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No term enrollments recorded yet.</p>
                  ) : (
                    term_enrollments.map((enr) => (
                      <div
                        key={enr.enrollment_id}
                        className="border border-border rounded-lg p-3.5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            AY {enr.academic_year} · {enr.semester} (Year {enr.year_level})
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {enr.total_units} units · Assessment: {formatCurrency(enr.total_assessment)}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[11px]">
                          {formatStatusLabel(enr.status)}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-primary" />
                    Scholarship Contracts ({contracts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {contracts.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No contracts recorded yet.</p>
                  ) : (
                    contracts.map((contract) => {
                      const docUrl = contract.signed_document_url || contract.document_url;
                      return (
                        <div
                          key={contract.contract_id}
                          className="border border-border rounded-lg p-3.5 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-semibold text-sm">Contract #{contract.contract_number}</div>
                            <div className="text-xs text-muted-foreground">
                              Signed: {formatDate(contract.signed_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[11px]">
                              {formatStatusLabel(contract.status)}
                            </Badge>
                            {docUrl && (
                              <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs">
                                <a href={docUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Preview Dialog */}
      <Dialog open={Boolean(previewDoc)} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pr-6">
              <DialogTitle className="truncate text-base">{previewDoc?.title}</DialogTitle>
              {previewDoc && (
                <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
                  <a href={previewDoc.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original
                  </a>
                </Button>
              )}
            </div>
          </DialogHeader>
          {previewDoc && (
            <div className="flex-1 min-h-[60vh] bg-slate-100 rounded-lg overflow-hidden border border-border flex items-center justify-center">
              {isImageUrl(previewDoc.url, previewDoc.fileType) ? (
                <img src={previewDoc.url} alt={previewDoc.title} className="max-h-[72vh] max-w-full object-contain" />
              ) : (
                <iframe src={previewDoc.url} title={previewDoc.title} className="w-full h-[72vh] border-0 bg-white" />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
