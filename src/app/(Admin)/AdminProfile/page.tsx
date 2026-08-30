"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  DrawerInfoRow,
  ADMIN,
  EMPLOYEES,
  SCHOLARS_DIRECTORY,
  s,
} from "@/components/Adminshared";

function ProfilePageStyles() {
  return (
    <style>{`
      .admin-profile-banner { height: 160px; }
      .admin-profile-avatar { width: 88px; height: 88px; font-size: 1.8rem; }
      .admin-profile-header-row { margin-top: -36px; }

      @media (max-width: 640px) {
        .admin-profile-banner { height: 110px; }
        .admin-profile-avatar { width: 68px; height: 68px; font-size: 1.4rem; }
        .admin-profile-header-row {
          margin-top: -30px;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }
        .admin-profile-header-info { min-width: 0; flex-basis: 100%; order: 2; }
        .admin-profile-edit-btn { order: 3; }
        .admin-profile-bio-card, .admin-profile-contact-card {
          padding: 16px 16px !important;
        }
        .admin-profile-name { font-size: 1.2rem !important; }
      }
    `}</style>
  );
}

export default function AdminProfilePage() {
  const [bio, setBio] = useState(ADMIN.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <ProfilePageStyles />

      <div className="admin-profile-banner" style={{ ...s.profileBanner, background: ADMIN.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div className="admin-profile-header-row" style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span className="admin-profile-avatar" style={{ ...s.profileAvatar, background: ADMIN.avatarColor }}>
            {ADMIN.initials}
          </span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div className="admin-profile-header-info" style={s.profileHeaderInfo}>
          <h2 className="admin-profile-name" style={s.profileName}>{ADMIN.name}</h2>
          <p style={s.profileMeta}>{ADMIN.title}</p>
        </div>
        <button className="admin-profile-edit-btn" style={s.continueBtnSmall}>Edit profile</button>
      </div>

      <div className="admin-profile-bio-card" style={s.profileBioCard}>
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

      <div className="va-stat-row" style={s.statRow}>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Coordinators managed</p>
            <p style={s.pipelineValue}>{EMPLOYEES.filter((e) => e.type === "Coordinator").length}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Active scholars</p>
            <p style={s.pipelineValue}>{SCHOLARS_DIRECTORY.length}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Years as admin</p>
            <p style={s.pipelineValue}>7</p>
          </div>
        </div>
      </div>

      <div className="admin-profile-contact-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <DrawerInfoRow label="Email" value={ADMIN.email} />
        </div>
      </div>
    </div>
  );
}