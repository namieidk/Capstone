import React from "react";
import {
  ArrowRightIcon,
  MailIcon,
  CalendarIcon,
  ForumIcon,
  ACTIVITY_FEED,
  UPCOMING_ITEMS,
  AMBER,
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

interface QuickLinkProps {
  icon: React.ReactNode;
  label: string;
}

function QuickLink({ icon, label }: QuickLinkProps) {
  return (
    <button style={s.quickLinkBtn}>
      <span style={s.quickLinkIcon}>{icon}</span>
      <span>{label}</span>
      <span style={{ marginLeft: "auto", color: "#9a9a94" }}>
        <ArrowRightIcon />
      </span>
    </button>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <div className="vd-stat-row" style={s.statRow}>
        <StatCard label="Predicted GWA" value="92.6%" caption="On track — above the 90% threshold" progress={88} />
        <InfoCard label="Documents verified" value="3 of 3" caption="All requirements complete" tone="good" />
        <InfoCard label="Next disbursement" value="Jul 15" caption="Allowance for Q3" tone="neutral" />
      </div>

      <div className="vd-content-grid" style={s.contentGrid}>
        <section style={s.feedCard}>
          <div style={s.cardHeaderRow}>
            <h2 style={s.cardHeading}>Recent activity</h2>
            <button style={s.viewAllBtn}>
              View all <ArrowRightIcon />
            </button>
          </div>
          <div style={s.feedList}>
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} style={{ ...s.feedRow, borderBottom: i === ACTIVITY_FEED.length - 1 ? "none" : `1px solid ${LINE}` }}>
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
          <h2 style={s.cardHeading}>Upcoming</h2>
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
          </div>

          <div style={s.quickLinksWrap}>
            <p style={s.quickLinksHeading}>Quick links</p>
            <QuickLink icon={<MailIcon small />} label="Message your coordinator" />
            <QuickLink icon={<CalendarIcon small />} label="Request a meeting" />
            <QuickLink icon={<ForumIcon small />} label="Browse the forum" />
          </div>
        </section>
      </div>
    </div>
  );
}