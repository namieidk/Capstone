"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  ApplicationIcon,
  DownloadIcon,
  SCHOLAR,
  PROFILE_DOCUMENTS,
  APPLICATION_STAGES,
  CURRENT_STAGE_INDEX,
  AMBER_BG,
  s,
} from "../../../../components/StudentShared";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.86rem", color: "#8a8a84" }}>{label}</span>
      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#14213A", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ProfilePageStyles() {
  return (
    <style>{`
      .vd-profile-banner { height: 160px; }
      .vd-profile-avatar { width: 88px; height: 88px; font-size: 1.8rem; }
      .vd-profile-header-row { margin-top: -36px; }
      .vd-profile-doc-row { flex-wrap: wrap; }
      .vd-profile-doc-info { min-width: 160px; }
      .vd-profile-doc-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; margin-left: auto; }

      @media (max-width: 640px) {
        .vd-profile-banner { height: 110px; }
        .vd-profile-avatar { width: 68px; height: 68px; font-size: 1.4rem; }
        .vd-profile-header-row {
          margin-top: -30px;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }
        .vd-profile-header-info { min-width: 0; flex-basis: 100%; order: 2; }
        .vd-profile-edit-btn { order: 3; }
        .vd-profile-bio-card, .vd-profile-doc-row, .vd-profile-contact-card {
          padding: 16px 16px !important;
        }
        .vd-profile-name { font-size: 1.2rem !important; }
      }

      @media (max-width: 480px) {
        .vd-profile-doc-row { align-items: center; }
        .vd-profile-doc-info { flex-basis: 100%; min-width: 0; order: 1; }
        .vd-profile-doc-actions { order: 2; margin-left: 0; }
      }
    `}</style>
  );
}

export default function ProfilePage() {
  const [bio, setBio] = useState(SCHOLAR.bio);
  const [editingBio, setEditingBio] = useState(false);

  const currentStage = APPLICATION_STAGES[CURRENT_STAGE_INDEX];
  const submittedStage = APPLICATION_STAGES[0];
  const verifiedCount = PROFILE_DOCUMENTS.filter((d) => d.status === "verified").length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <ProfilePageStyles />

      <div className="vd-profile-banner" style={{ ...s.profileBanner, background: SCHOLAR.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div className="vd-profile-header-row" style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span className="vd-profile-avatar" style={{ ...s.profileAvatar, background: SCHOLAR.avatarColor }}>
            {SCHOLAR.initials}
          </span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div className="vd-profile-header-info" style={s.profileHeaderInfo}>
          <h2 className="vd-profile-name" style={s.profileName}>{SCHOLAR.name}</h2>
          <p style={s.profileMeta}>
            {SCHOLAR.course} · {SCHOLAR.year}
          </p>
        </div>
        <button className="vd-profile-edit-btn" style={s.continueBtnSmall}>Edit profile</button>
      </div>

      <div className="vd-profile-bio-card" style={s.profileBioCard}>
        <div style={s.profileBioHeader}>
          <p style={s.profileBioLabel}>Bio</p>
          <button onClick={() => setEditingBio((v) => !v)} style={s.reviewEditLink}>
            {editingBio ? "Save" : "Edit"}
          </button>
        </div>
        {editingBio ? (
          <textarea style={{ ...s.input, height: 90, resize: "vertical" }} value={bio} onChange={(e) => setBio(e.target.value)} />
        ) : (
          <p style={s.profileBioText}>{bio}</p>
        )}
      </div>

      <div className="vd-stat-row" style={s.statRow}>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Application stage</p>
          <p style={s.statCardValue}>{currentStage.title}</p>
          <p style={s.statCardCaption}>{currentStage.date}</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Documents verified</p>
          <p style={s.statCardValue}>
            {verifiedCount}/{PROFILE_DOCUMENTS.length}
          </p>
          <p style={s.statCardCaption}>Profile requirements</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Application submitted</p>
          <p style={s.statCardValue}>{submittedStage.date}</p>
          <p style={s.statCardCaption}>{submittedStage.desc}</p>
        </div>
      </div>

      <div className="vd-profile-contact-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <InfoRow label="Course" value={SCHOLAR.course} />
          <InfoRow label="Year level" value={SCHOLAR.year} />
        </div>
      </div>

      <h3 style={{ ...s.cardHeading, marginBottom: 14 }}>Documents</h3>
      <div style={s.profileDocList}>
        {PROFILE_DOCUMENTS.map((doc) => (
          <div key={doc.file} className="vd-profile-doc-row" style={s.profileDocRow}>
            <span style={s.feedIconBox}>
              <ApplicationIcon />
            </span>
            <div className="vd-profile-doc-info" style={s.profileDocInfo}>
              <p style={s.profileDocLabel}>{doc.label}</p>
              <p style={s.profileDocFile}>
                {doc.file} · {doc.size}
              </p>
            </div>
            <div className="vd-profile-doc-actions">
              <span
                style={{
                  ...s.statusTag,
                  background: doc.status === "verified" ? AMBER_BG : "#F3E6C8",
                  color: "#6b5220",
                }}
              >
                {doc.status}
              </span>
              <button style={s.profileDocDownload}>
                <DownloadIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}