"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  ApplicationIcon,
  DownloadIcon,
  SCHOLAR,
  PROFILE_DOCUMENTS,
  AMBER_BG,
  s,
} from "../../../../components/StudentShared";

export default function ProfilePage() {
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