"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  DownloadIcon,
  SCHOLAR,
  PROFILE_DOCUMENTS,
  AMBER_BG,
  s,
} from "@/components/ScholarShared";

function ApplicationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function SchoProfilePage() {
  const [bio, setBio] = useState(SCHOLAR.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div>
      <div style={{ ...s.profileBanner, background: SCHOLAR.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span style={{ ...s.profileAvatar, background: SCHOLAR.avatarColor }}>{SCHOLAR.initials}</span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div style={s.profileHeaderInfo}>
          <h2 style={s.profileName}>{SCHOLAR.name}</h2>
          <p style={s.profileMeta}>
            {SCHOLAR.course} · {SCHOLAR.year}
          </p>
        </div>
        <button style={s.continueBtnSmall}>Edit profile</button>
      </div>

      <div style={s.profileBioCard}>
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

      <h3 style={{ ...s.cardHeading, marginBottom: 14 }}>Documents</h3>
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
            <button style={s.profileDocDownload}>
              <DownloadIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}