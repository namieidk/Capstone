"use client";

import React from "react";
import Link from "next/link";
import { useSidebar } from "../../../../components/SidebarContext";
import {
  ArrowRightIcon,
  MailIcon,
  CalendarIcon,
  ForumIcon,
  MenuIcon,
  BellIcon,
  CheckCircleIcon,
  ApplicationIcon,
  ACTIVITY_FEED,
  UPCOMING_ITEMS,
  APPLICATION_STAGES,
  CURRENT_STAGE_INDEX,
  PROFILE_DOCUMENTS,
  SCHOLAR,
  AMBER,
  AMBER_BG,
  LINE,
  s,
} from "../../../../components/StudentShared";

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

interface QuickLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function QuickLink({ icon, label, href }: QuickLinkProps) {
  return (
    <Link href={href} style={s.quickLinkBtn}>
      <span style={s.quickLinkIcon}>{icon}</span>
      <span>{label}</span>
      <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
        <ArrowRightIcon />
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const { toggleMobile } = useSidebar();

  const firstName = SCHOLAR.name.split(" ")[0];

  const currentStage = APPLICATION_STAGES[CURRENT_STAGE_INDEX];
  const stageProgress = Math.round(((CURRENT_STAGE_INDEX + 1) / APPLICATION_STAGES.length) * 100);

  const verifiedCount = PROFILE_DOCUMENTS.filter((d) => d.status === "verified").length;
  const totalDocs = PROFILE_DOCUMENTS.length;
  const allDocsVerified = verifiedCount === totalDocs;

  const submittedStage = APPLICATION_STAGES[0];

  return (
    <div>
      <header style={s.topbar}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Good morning, {firstName}.</h1>
          <p style={s.topbarSub}>Heres a look at your application progress and requirements.</p>
        </div>
        <div style={s.topbarRight}>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={s.mainContent}>
        <div className="vd-stat-row" style={{ ...s.statRow, marginTop: 16 }}>
          <StatCard
            label="Application stage"
            value={currentStage.title}
            caption={`${currentStage.date} · ${currentStage.desc}`}
            progress={stageProgress}
          />
          <InfoCard
            label="Documents verified"
            value={`${verifiedCount} of ${totalDocs}`}
            caption={allDocsVerified ? "All requirements complete" : "Some documents still pending"}
            tone={allDocsVerified ? "good" : "neutral"}
          />
          <InfoCard
            label="Application submitted"
            value={submittedStage.date}
            caption={submittedStage.desc}
            tone="neutral"
          />
        </div>

        {/* Activity + Upcoming */}
        <div className="vd-content-grid" style={s.contentGrid}>
          <section style={s.feedCard}>
            <PanelHeader title="Recent activity" href="/ApplicantsDashboard" />
            <div style={s.feedList}>
              {ACTIVITY_FEED.map((item, i) => (
                <div
                  key={i}
                  style={{ ...s.feedRow, borderBottom: i === ACTIVITY_FEED.length - 1 ? "none" : `1px solid ${LINE}` }}
                >
                  <span style={s.feedIconBox}>{item.icon}</span>
                  <div style={s.feedTextCol}>
                    <p style={s.feedText}>{item.text}</p>
                    <p style={s.feedTime}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={s.upcomingCard}>
            <PanelHeader title="Upcoming" href="/ApplicantsDashboard" />
            <div style={s.upcomingList}>
              {UPCOMING_ITEMS.map((item, i) => (
                <div key={i} style={s.upcomingRow}>
                  <span style={{ ...s.upcomingDot, background: item.urgent ? AMBER : "#C9C2A8" }} />
                  <div>
                    <p style={s.upcomingLabel}>{item.label}</p>
                    <p style={s.upcomingDetail}>{item.detail}</p>
                  </div>
                </div>
              ))}
              {UPCOMING_ITEMS.length === 0 && <p style={s.feedTime}>Nothing upcoming right now.</p>}
            </div>

            <div style={s.quickLinksWrap}>
              <p style={s.quickLinksHeading}>Quick links</p>
              <QuickLink icon={<MailIcon small />} label="Message your coordinator" href="/ApplicantsDashboard" />
              <QuickLink icon={<CalendarIcon small />} label="Request a meeting" href="/ApplicantsDashboard" />
              <QuickLink icon={<ForumIcon small />} label="View your application" href="/ApplicantsApplication" />
            </div>
          </section>
        </div>

        {/* Application status + Documents */}
        <div className="vd-content-grid" style={s.contentGrid}>
          <section style={s.feedCard}>
            <PanelHeader title="Application status" href="/ApplicantsApplication" />
            <div style={s.appTimeline}>
              {APPLICATION_STAGES.map((stage, i) => {
                const isDone = i < CURRENT_STAGE_INDEX;
                const isCurrent = i === CURRENT_STAGE_INDEX;
                const isLast = i === APPLICATION_STAGES.length - 1;
                const dotColor = isDone ? "#6b8a3e" : isCurrent ? AMBER : "#C9C2A8";
                return (
                  <div key={stage.key} style={s.appTimelineRow}>
                    <div style={s.appTimelineMarkerCol}>
                      <span style={{ ...s.appTimelineDot, borderColor: dotColor, color: dotColor }}>
                        {isDone ? <CheckCircleIcon small /> : i + 1}
                      </span>
                      {!isLast && <span style={{ ...s.appTimelineLine, background: isDone ? "#6b8a3e" : LINE }} />}
                    </div>
                    <div style={{ paddingBottom: isLast ? 0 : 20 }}>
                      <p style={{ ...s.appTimelineTitle, color: isCurrent ? AMBER : "#14213A" }}>{stage.title}</p>
                      <p style={s.appTimelineDate}>{stage.date}</p>
                      <p style={s.appTimelineDesc}>{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={s.feedCard}>
            <PanelHeader title="Documents" href="/ApplicantsProfile" />
            <div style={s.profileDocList}>
              {PROFILE_DOCUMENTS.map((doc) => (
                <div key={doc.file} style={s.profileDocRow}>
                  <span style={s.feedIconBox}>
                    <ApplicationIcon />
                  </span>
                  <div style={s.profileDocInfo}>
                    <p style={s.profileDocLabel}>{doc.label}</p>
                    <p style={s.profileDocFile}>
                      {doc.file} · {doc.size}
                    </p>
                  </div>
                  <span
                    style={{
                      ...s.statusTag,
                      background: doc.status === "verified" ? AMBER_BG : "#F3E6C8",
                      color: "#6b5220",
                    }}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}