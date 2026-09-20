"use client";

import { AlertTriangle, CheckCircle2, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AMBER_BG,
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CONVERSATIONS,
  GradeIcon,
  LINE,
  MailIcon,
  MEETINGS_HOSTING,
  MEETINGS_INVITED,
  MenuIcon,
  PAYMENT_HISTORY,
  PAYMENT_SUMMARY,
  PaymentIcon,
  s,
} from "@/components/ScholarShared";
import { useSidebar } from "@/components/SidebarContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { type GradeReport, getGradeReportsMe } from "@/lib/api/documents";

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  progress: number;
}

function StatCard({ label, value, caption, progress }: StatCardProps) {
  return (
    <div style={s.statCard}>
      <p style={s.statCardLabel}>{label}</p>
      <p style={s.statCardValue}>{value}</p>
      <div style={s.statProgressTrack}>
        <div style={{ ...s.statProgressFill, width: `${progress}%` }} />
      </div>
      <p style={s.statCardCaption}>{caption}</p>
    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: string;
  caption: string;
  tone?: "good" | "neutral";
}

function InfoCard({ label, value, caption, tone }: InfoCardProps) {
  return (
    <div style={s.statCard}>
      <p style={s.statCardLabel}>{label}</p>
      <p style={s.statCardValue}>{value}</p>
      <p style={{ ...s.statCardCaption, color: tone === "good" ? "#6b8a3e" : "#7a7a74", marginTop: "auto" }}>
        {caption}
      </p>
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  href: string;
}

function PanelHeader({ title, href }: PanelHeaderProps) {
  return (
    <div style={s.cardHeaderRow}>
      <h2 style={s.cardHeading}>{title}</h2>
      <Link href={href} style={s.viewAllBtn}>
        View all <ArrowRightIcon />
      </Link>
    </div>
  );
}

function formatDateParts(date: string) {
  const [month, dayWithComma] = date.split(" ");
  return { month: month?.toUpperCase() ?? "", day: (dayWithComma ?? "").replace(",", "") };
}

export default function ScholarDashboardPage() {
  const { toggleMobile } = useSidebar();
  const { user } = useAuth();
  const [reports, setReports] = useState<GradeReport[]>([]);
  const [_loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const gradeData = await getGradeReportsMe().catch(() => []);
      setReports(gradeData || []);
    } catch (err) {
      console.error("Failed to load scholar dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const firstName = user?.first_name?.trim() ? user.first_name : "Scholar";
  const scholarName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Scholar";
  const studentNum = user?.scholar_profile?.student_number || "N/A";

  const latestReport = reports.length > 0 ? reports[0] : null;
  const isFlagged = latestReport && (!latestReport.is_eligible || latestReport.status === "FLAGGED");
  const hasPendingAppeal = latestReport?.appeal_status === "PENDING_GRANTOR";
  const appealApproved = latestReport?.appeal_status === "APPROVED";
  const appealDenied =
    latestReport?.appeal_status === "DENIED" || user?.scholar_profile?.academic_baseline_status === "DISCONTINUED";

  const gwaValue = latestReport ? Number(latestReport.gpa).toFixed(2) : "—";
  const gwaNum = latestReport ? Number(latestReport.gpa) : 90;
  const gwaProgress = Math.min(100, Math.max(0, Math.round(((gwaNum - 75) / 25) * 100)));

  const mailtoSubject = encodeURIComponent(`[Inquiry] Scholarship Status Appeal - ${scholarName} (${studentNum})`);
  const mailtoBody = encodeURIComponent(
    `Dear Grantor and Coordinator,\n\nI am writing to respectfully follow up regarding my scholarship status and the appeal decision for ${latestReport?.academic_year || "Academic Year"} ${latestReport?.semester || "Semester"}.\n\nStudent Details:\n- Name: ${scholarName}\n- Student Number: ${studentNum}\n- School: ${user?.scholar_profile?.school_name || "N/A"}\n- Term GWA: ${gwaValue}\n\nThank you for your guidance.\n\nSincerely,\n${scholarName}`,
  );
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=grantor@viascholar.edu&cc=coordinator@viascholar.edu&su=${mailtoSubject}&body=${mailtoBody}`;

  const recentMessages = CONVERSATIONS.slice(0, 3);
  const recentPayments = PAYMENT_HISTORY.slice(0, 2);
  const upcomingMeetings = [
    ...MEETINGS_HOSTING.map((m) => ({
      id: `h-${m.id}`,
      title: m.title,
      date: m.date,
      time: m.time,
      person: m.invitee,
      status: m.status,
    })),
    ...MEETINGS_INVITED.map((m) => ({
      id: `i-${m.id}`,
      title: m.title,
      date: m.date,
      time: m.time,
      person: m.host,
      status: m.status,
    })),
  ]
    .filter((m) => m.status !== "completed")
    .slice(0, 2);

  return (
    <div>
      <header style={s.topbar}>
        <button type="button" className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Good day, {firstName}.</h1>
          <p style={s.topbarSub}>Here is a look at your grades, academic standing, and schedule.</p>
        </div>
        <div style={s.topbarRight}>
          <button type="button" style={s.bellBtn}>
            <BellIcon />
            <span
              style={{
                ...s.bellDot,
                background: appealDenied ? "#dc2626" : isFlagged ? "#d97706" : "#16a34a",
              }}
            />
          </button>
        </div>
      </header>

      <div style={s.mainContent}>
        {/* ACADEMIC STANDING STATUS BANNER */}
        {appealDenied ? (
          <div className="mt-4 rounded-2xl border-2 border-rose-300 bg-linear-to-br from-rose-50 via-white to-rose-50/40 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <ShieldAlert className="size-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs font-semibold">
                      Scholarship Discontinued
                    </Badge>
                    <span className="text-xs text-muted-foreground">Second Chance Appeal Denied</span>
                  </div>
                  <h3 className="text-base font-bold text-navy">Scholarship Agreement Terminated</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                    Your second chance appeal for {latestReport?.academic_year} {latestReport?.semester} was reviewed
                    and denied by the Grantor. Your account is currently in restricted read-only status.
                  </p>
                  {latestReport?.appeal_decision_notes && (
                    <p className="text-xs font-medium text-rose-900 bg-rose-100/60 rounded-lg p-2 mt-1">
                      Grantor Feedback: "{latestReport.appeal_decision_notes}"
                    </p>
                  )}
                </div>
              </div>

              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors shrink-0"
              >
                <Mail className="size-3.5" />
                <span>Contact Grantor & Coordinator</span>
              </a>
            </div>
          </div>
        ) : appealApproved ? (
          <div className="mt-4 rounded-2xl border-2 border-emerald-400/50 bg-emerald-50/50 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy">Probationary Clearance Granted</h3>
                <p className="text-xs text-muted-foreground">
                  Your second chance appeal was approved by the Grantor. Maintain passing marks this term to clear
                  probation.
                </p>
              </div>
            </div>
            <Link href="/ScholarGrade">
              <Button
                variant="outline"
                className="h-9 text-xs font-semibold gap-1.5 border-emerald-300 text-emerald-900"
              >
                View Standing
              </Button>
            </Link>
          </div>
        ) : isFlagged ? (
          <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy">Academic Deficiency Flagged</h3>
                <p className="text-xs text-amber-900">
                  {hasPendingAppeal
                    ? "Your Second Chance Request is currently under review by the Grantor."
                    : `Your term GWA (${gwaValue}) is below the retention threshold. Submit a Second Chance Request to retain your scholarship.`}
                </p>
              </div>
            </div>
            <Link href="/ScholarGrade">
              <Button className="h-9 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white shrink-0">
                {hasPendingAppeal ? "Track Appeal" : "Submit Second Chance Request"}
              </Button>
            </Link>
          </div>
        ) : null}

        <div className="vd-stat-row" style={{ ...s.statRow, marginTop: 16 }}>
          <StatCard
            label="Latest term GWA"
            value={gwaValue}
            caption={latestReport ? `${latestReport.academic_year} · ${latestReport.semester}` : "No grades yet"}
            progress={gwaProgress}
          />
          <InfoCard
            label="Academic Standing"
            value={
              appealDenied
                ? "Discontinued"
                : appealApproved
                  ? "On Probation"
                  : isFlagged
                    ? "Deficiency Flagged"
                    : "Good Standing"
            }
            caption={
              appealDenied
                ? "Agreement terminated"
                : appealApproved
                  ? "1 term recovery"
                  : isFlagged
                    ? "Action required"
                    : "Criteria met"
            }
            tone={appealDenied || isFlagged ? "neutral" : "good"}
          />
          <InfoCard
            label="Next tuition disbursement"
            value={appealDenied ? "Locked / Held" : PAYMENT_SUMMARY.nextAmount}
            caption={appealDenied ? "Scholarship discontinued" : `Due ${PAYMENT_SUMMARY.nextDate}`}
            tone="neutral"
          />
        </div>

        {/* Messages + Meetings */}
        <div className="vd-content-grid" style={s.contentGrid}>
          <section style={s.feedCard}>
            <PanelHeader title="Recent messages" href="/scholarMessage" />
            <div style={s.feedList}>
              {recentMessages.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    ...s.convoListItem,
                    padding: "14px 0",
                    borderBottom: i === recentMessages.length - 1 ? "none" : `1px solid ${LINE}`,
                  }}
                >
                  <span style={s.convoAvatar}>{c.initials}</span>
                  <div style={s.convoListTextCol}>
                    <div style={s.convoListTopRow}>
                      <span style={s.convoListName}>{c.name}</span>
                      <span style={s.convoListTime}>{c.time}</span>
                    </div>
                    <p style={s.convoListPreview}>{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span style={{ ...s.convoUnreadDot, top: 14 }}>{c.unread}</span>}
                </div>
              ))}
            </div>
          </section>

          <section style={s.upcomingCard}>
            <PanelHeader title="Upcoming meetings" href="/scholarMeeting" />
            <div style={s.upcomingList}>
              {upcomingMeetings.map((m) => {
                const { month, day } = formatDateParts(m.date);
                return (
                  <div key={m.id} style={s.upcomingRow}>
                    <div style={s.meetingDateBox}>
                      <span style={s.meetingDateMonth}>{month}</span>
                      <span style={s.meetingDateDay}>{day}</span>
                    </div>
                    <div>
                      <p style={s.upcomingLabel}>{m.title}</p>
                      <p style={s.upcomingDetail}>
                        {m.time} · with {m.person}
                      </p>
                    </div>
                  </div>
                );
              })}
              {upcomingMeetings.length === 0 && <p style={s.meetingMeta}>No upcoming meetings scheduled.</p>}
            </div>

            <div style={s.quickLinksWrap}>
              <p style={s.quickLinksHeading}>Quick actions</p>
              <Link href="/scholarMessage" style={s.quickLinkBtn}>
                <span style={s.quickLinkIcon}>
                  <MailIcon small />
                </span>
                <span>Message your coordinator</span>
                <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                  <ArrowRightIcon />
                </span>
              </Link>
              <Link href="/scholarMeeting" style={s.quickLinkBtn}>
                <span style={s.quickLinkIcon}>
                  <CalendarIcon small />
                </span>
                <span>Request a meeting</span>
                <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                  <ArrowRightIcon />
                </span>
              </Link>
              <Link href="/ScholarGrade" style={s.quickLinkBtn}>
                <span style={s.quickLinkIcon}>
                  <GradeIcon />
                </span>
                <span>View full grade history</span>
                <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>
          </section>
        </div>

        {/* Grades + Payments */}
        <div className="vd-content-grid" style={s.contentGrid}>
          <section style={s.feedCard}>
            <PanelHeader title="Grade history" href="/ScholarGrade" />
            <div style={s.gradeTable}>
              {reports.length > 0 ? (
                reports.slice(0, 3).map((r, i) => {
                  const isGood = r.is_eligible && r.status === "APPROVED";
                  const isAppApproved = r.appeal_status === "APPROVED";
                  const isAppDenied = r.appeal_status === "DENIED";
                  const isPending = r.appeal_status === "PENDING_GRANTOR";

                  const tagBg = isAppDenied
                    ? "#fee2e2"
                    : isAppApproved || isGood
                      ? "#E3EEDB"
                      : isPending
                        ? AMBER_BG
                        : "#fee2e2";
                  const tagColor = isAppDenied
                    ? "#b91c1c"
                    : isAppApproved || isGood
                      ? "#3f6b2c"
                      : isPending
                        ? "#6b5220"
                        : "#b91c1c";
                  const tagText = isAppDenied
                    ? "discontinued"
                    : isAppApproved
                      ? "probation"
                      : isGood
                        ? "passed"
                        : isPending
                          ? "appealing"
                          : "flagged";

                  return (
                    <div
                      key={r.report_id}
                      style={{
                        ...s.gradeRow,
                        borderBottom: i === Math.min(reports.length, 3) - 1 ? "none" : `1px solid ${LINE}`,
                      }}
                    >
                      <div style={s.gradeTermCol}>
                        <p style={s.gradeTerm}>
                          {r.academic_year} · {r.semester}
                        </p>
                        <p style={s.gradeNote}>{r.evaluation_flag || "Evaluated term"}</p>
                      </div>
                      <span style={{ ...s.statusTag, background: tagBg, color: tagColor, marginRight: 4 }}>
                        {tagText}
                      </span>
                      <span style={s.gradeValue}>{Number(r.gpa).toFixed(2)}</span>
                    </div>
                  );
                })
              ) : (
                <p style={{ ...s.feedTime, padding: "16px 0" }}>No grade reports submitted yet.</p>
              )}
            </div>
          </section>

          <section style={s.feedCard}>
            <PanelHeader title="Disbursements" href="/ScholarPayment" />
            <div style={{ display: "flex", gap: 24, marginBottom: 18, flexWrap: "wrap" }}>
              <div>
                <p style={s.statCardLabel}>Total disbursed</p>
                <p style={{ ...s.statCardValue, fontSize: "1.4rem", marginBottom: 0 }}>
                  {PAYMENT_SUMMARY.totalDisbursed}
                </p>
              </div>
              <div>
                <p style={s.statCardLabel}>Next semester</p>
                <p style={{ ...s.statCardValue, fontSize: "1.4rem", marginBottom: 0 }}>
                  {appealDenied ? "Held" : PAYMENT_SUMMARY.nextAmount}
                </p>
              </div>
            </div>
            <div style={s.paymentList}>
              {recentPayments.map((p) => {
                return (
                  <div key={p.term} style={s.paymentRow}>
                    <span style={s.paymentIconBox}>
                      <PaymentIcon />
                    </span>
                    <div style={s.paymentInfoCol}>
                      <p style={s.paymentTerm}>{p.term}</p>
                      <p style={s.paymentMeta}>{p.date}</p>
                    </div>
                    <span
                      style={{
                        ...s.statusTag,
                        background: appealDenied ? "#fee2e2" : "#E3EEDB",
                        color: appealDenied ? "#b91c1c" : "#3f6b2c",
                        marginRight: 10,
                      }}
                    >
                      {appealDenied ? "locked" : p.status}
                    </span>
                    <span style={s.paymentAmount}>{p.amount}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
