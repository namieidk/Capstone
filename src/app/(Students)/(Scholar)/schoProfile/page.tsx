"use client";

import { useState } from "react";
import {
  AMBER_BG,
  CameraIcon,
  DownloadIcon,
  GWA_THRESHOLD,
  PREDICTED_GWA,
  PROFILE_DOCUMENTS,
  SCHOLAR,
  SCHOLAR_DISBURSED_TO_DATE,
  s,
} from "@/components/ScholarShared";

function ApplicationIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "0.86rem", color: "#8a8a84" }}>{label}</span>
      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#14213A", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ProfilePageStyles() {
  return (
    <style>{`
      .scho-profile-banner { height: 160px; }
      .scho-profile-avatar { width: 88px; height: 88px; font-size: 1.8rem; }
      .scho-profile-header-row { margin-top: -36px; }
      .scho-profile-doc-row { flex-wrap: wrap; }
      .scho-profile-doc-info { min-width: 160px; }
      .scho-profile-doc-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; margin-left: auto; }

      @media (max-width: 640px) {
        .scho-profile-banner { height: 110px; }
        .scho-profile-avatar { width: 68px; height: 68px; font-size: 1.4rem; }
        .scho-profile-header-row {
          margin-top: -30px;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }
        .scho-profile-header-info { min-width: 0; flex-basis: 100%; order: 2; }
        .scho-profile-edit-btn { order: 3; }
        .scho-profile-bio-card, .scho-profile-doc-row, .scho-profile-contact-card {
          padding: 16px 16px !important;
        }
        .scho-profile-name { font-size: 1.2rem !important; }
      }

      @media (max-width: 480px) {
        .scho-profile-doc-row { align-items: center; }
        .scho-profile-doc-info { flex-basis: 100%; min-width: 0; order: 1; }
        .scho-profile-doc-actions { order: 2; margin-left: 0; }
      }
    `}</style>
  );
}

export default function SchoProfilePage() {
  const [bio, setBio] = useState(SCHOLAR.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <ProfilePageStyles />

      <div className="scho-profile-banner" style={{ ...s.profileBanner, background: SCHOLAR.bannerGradient }}>
        <button type="button" style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div className="scho-profile-header-row" style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span className="scho-profile-avatar" style={{ ...s.profileAvatar, background: SCHOLAR.avatarColor }}>
            {SCHOLAR.initials}
          </span>
          <button type="button" style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div className="scho-profile-header-info" style={s.profileHeaderInfo}>
          <h2 className="scho-profile-name" style={s.profileName}>
            {SCHOLAR.name}
          </h2>
          <p style={s.profileMeta}>
            {SCHOLAR.course} · {SCHOLAR.year}
          </p>
        </div>
        <button type="button" className="scho-profile-edit-btn" style={s.continueBtnSmall}>
          Edit profile
        </button>
      </div>

      <div className="scho-profile-bio-card" style={s.profileBioCard}>
        <div style={s.profileBioHeader}>
          <p style={s.profileBioLabel}>Bio</p>
          <button type="button" onClick={() => setEditingBio((v) => !v)} style={s.reviewEditLink}>
            {editingBio ? "Save" : "Edit"}
          </button>
        </div>
        {editingBio ? (
          <textarea
            style={{ ...s.input, height: 90, resize: "vertical" }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        ) : (
          <p style={s.profileBioText}>{bio}</p>
        )}
      </div>

      <div className="vd-stat-row" style={s.statRow}>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Current GWA standing</p>
          <p style={s.statCardValue}>{PREDICTED_GWA}</p>
          <p style={s.statCardCaption}>Threshold: {GWA_THRESHOLD}</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Disbursed to date</p>
          <p style={s.statCardValue}>₱{SCHOLAR_DISBURSED_TO_DATE.toLocaleString()}</p>
          <p style={s.statCardCaption}>This academic year</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Documents verified</p>
          <p style={s.statCardValue}>
            {PROFILE_DOCUMENTS.filter((d) => d.status === "verified").length}/{PROFILE_DOCUMENTS.length}
          </p>
          <p style={s.statCardCaption}>Profile requirements</p>
        </div>
      </div>

      <div className="scho-profile-contact-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <InfoRow label="Course" value={SCHOLAR.course} />
          <InfoRow label="Year level" value={SCHOLAR.year} />
        </div>
      </div>

      <h3 style={{ ...s.cardHeading, marginBottom: 14 }}>Documents</h3>
      <div style={s.profileDocList}>
        {PROFILE_DOCUMENTS.map((doc) => (
          <div key={doc.file} className="scho-profile-doc-row" style={s.profileDocRow}>
            <span style={s.feedIconBox}>
              <ApplicationIcon />
            </span>
            <div className="scho-profile-doc-info" style={s.profileDocInfo}>
              <p style={s.profileDocLabel}>{doc.label}</p>
              <p style={s.profileDocFile}>
                {doc.file} · {doc.size}
              </p>
            </div>
            <div className="scho-profile-doc-actions">
              <span
                style={{
                  ...s.statusTag,
                  background: doc.status === "verified" ? AMBER_BG : "#F3E6C8",
                  color: "#6b5220",
                }}
              >
                {doc.status}
              </span>
              <button type="button" style={s.profileDocDownload}>
                <DownloadIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
