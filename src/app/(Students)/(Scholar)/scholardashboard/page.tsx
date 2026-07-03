import React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  MailIcon,
  CalendarIcon,
  GradeIcon,
  PaymentIcon,
  CONVERSATIONS,
  MEETINGS_HOSTING,
  MEETINGS_INVITED,
  GRADE_HISTORY,
  PAYMENT_SUMMARY,
  PAYMENT_HISTORY,
  AMBER,
  AMBER_BG,
  NAVY,
  LINE,
  s,
} from "@/components/ScholarShared";

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
      <p style={{ ...s.statCardCaption, color: tone === "good" ? "#6b8a3e" : "#7a7a74", marginTop: "auto" }}>{caption}</p>
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

const GRADE_STATUS_STYLE: Record<string, { background: string; color: string }> = {
  passed: { background: "#E3EEDB", color: "#3f6b2c" },
  pending: { background: AMBER_BG, color: "#6b5220" },
};

const PAYMENT_STATUS_STYLE: Record<string, { background: string; color: string }> = {
  paid: { background: "#E3EEDB", color: "#3f6b2c" },
  upcoming: { background: AMBER_BG, color: "#6b5220" },
  processing: { background: "#EAE3F6", color: "#5a3f8a" },
};

export default function ScholarDashboardPage() {
  const latestPassed = [...GRADE_HISTORY].reverse().find((g) => g.status === "passed") ?? GRADE_HISTORY[0];
  const gwaProgress = Math.min(100, Math.max(0, Math.round(((latestPassed.gwa - 75) / 25) * 100)));

  const recentMessages = CONVERSATIONS.slice(0, 3);

  const upcomingMeetings = [
    ...MEETINGS_HOSTING.map((m) => ({ id: `h-${m.id}`, title: m.title, date: m.date, time: m.time, person: m.invitee, status: m.status })),
    ...MEETINGS_INVITED.map((m) => ({ id: `i-${m.id}`, title: m.title, date: m.date, time: m.time, person: m.host, status: m.status })),
  ]
    .filter((m) => m.status !== "completed")
    .slice(0, 2);

  const recentGrades = [...GRADE_HISTORY].reverse().slice(0, 3);
  const recentPayments = PAYMENT_HISTORY.slice(0, 2);

  return (
    <div>
      <div className="vd-stat-row" style={s.statRow}>
        <StatCard
          label="Latest passed GWA"
          value={`${latestPassed.gwa}%`}
          caption={`${latestPassed.term} · Above threshold`}
          progress={gwaProgress}
        />
        <InfoCard label="Documents verified" value="3 of 3" caption="All requirements complete" tone="good" />
        <InfoCard label="Next disbursement" value={PAYMENT_SUMMARY.nextAmount} caption={`Due ${PAYMENT_SUMMARY.nextDate}`} tone="neutral" />
      </div>

      {/* Messages + Meetings */}
      <div className="vd-content-grid" style={s.dashboardTwoCol}>
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

        <section style={s.feedCard}>
          <PanelHeader title="Upcoming meetings" href="/scholarMeeting" />
          <div style={s.meetingList}>
            {upcomingMeetings.map((m) => {
              const { month, day } = formatDateParts(m.date);
              return (
                <div key={m.id} style={{ ...s.meetingCard, border: "none", padding: "0 0 4px" }}>
                  <div style={s.meetingDateBox}>
                    <span style={s.meetingDateMonth}>{month}</span>
                    <span style={s.meetingDateDay}>{day}</span>
                  </div>
                  <div style={s.meetingInfoCol}>
                    <p style={s.meetingTitle}>{m.title}</p>
                    <p style={s.meetingMeta}>
                      {m.time} · with {m.person}
                    </p>
                  </div>
                </div>
              );
            })}
            {upcomingMeetings.length === 0 && <p style={s.meetingMeta}>No upcoming meetings scheduled.</p>}
          </div>
        </section>
      </div>

      {/* Grades + Payments */}
      <div className="vd-content-grid" style={s.dashboardTwoCol}>
        <section style={s.feedCard}>
          <PanelHeader title="Grade history" href="/ScholarGrade" />
          <div style={s.gradeTable}>
            {recentGrades.map((g, i) => {
              const tone = GRADE_STATUS_STYLE[g.status];
              return (
                <div
                  key={g.term}
                  style={{ ...s.gradeRow, borderBottom: i === recentGrades.length - 1 ? "none" : `1px solid ${LINE}` }}
                >
                  <div style={s.gradeTermCol}>
                    <p style={s.gradeTerm}>{g.term}</p>
                    <p style={s.gradeNote}>{g.note}</p>
                  </div>
                  <span style={{ ...s.statusTag, background: tone.background, color: tone.color, marginRight: 4 }}>
                    {g.status}
                  </span>
                  <span style={s.gradeValue}>{g.gwa}%</span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={s.feedCard}>
          <PanelHeader title="Payments" href="/ScholarPayment" />
          <div style={{ display: "flex", gap: 24, marginBottom: 18 }}>
            <div>
              <p style={s.statCardLabel}>Total disbursed</p>
              <p style={{ ...s.statCardValue, fontSize: "1.4rem", marginBottom: 0 }}>{PAYMENT_SUMMARY.totalDisbursed}</p>
            </div>
            <div>
              <p style={s.statCardLabel}>Next amount</p>
              <p style={{ ...s.statCardValue, fontSize: "1.4rem", marginBottom: 0 }}>{PAYMENT_SUMMARY.nextAmount}</p>
            </div>
          </div>
          <div style={s.paymentList}>
            {recentPayments.map((p) => {
              const tone = PAYMENT_STATUS_STYLE[p.status];
              return (
                <div key={p.term} style={s.paymentRow}>
                  <span style={s.paymentIconBox}>
                    <PaymentIcon />
                  </span>
                  <div style={s.paymentInfoCol}>
                    <p style={s.paymentTerm}>{p.term}</p>
                    <p style={s.paymentMeta}>{p.date}</p>
                  </div>
                  <span style={{ ...s.statusTag, background: tone.background, color: tone.color, marginRight: 10 }}>
                    {p.status}
                  </span>
                  <span style={s.paymentAmount}>{p.amount}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div style={s.quickLinksWrap}>
        <p style={s.quickLinksHeading}>Quick links</p>
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
    </div>
  );
}