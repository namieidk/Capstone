"use client";

import React, { useState } from "react";
import { CameraIcon, DrawerInfoRow, COORDINATOR, ACTIVE_SCHOLARS, s } from "@/components/Coordinatorshared";

function ProfilePageStyles() {
  return (
    <style>{`
      .coor-profile-banner { height: 160px; }
      .coor-profile-avatar { width: 88px; height: 88px; font-size: 1.8rem; }
      .coor-profile-header-row { margin-top: -36px; }

      @media (max-width: 640px) {
        .coor-profile-banner { height: 110px; }
        .coor-profile-avatar { width: 68px; height: 68px; font-size: 1.4rem; }
        .coor-profile-header-row {
          margin-top: -30px;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }
        .coor-profile-header-info { min-width: 0; flex-basis: 100%; order: 2; }
        .coor-profile-edit-btn { order: 3; }
        .coor-profile-bio-card, .coor-profile-contact-card {
          padding: 16px 16px !important;
        }
        .coor-profile-name { font-size: 1.2rem !important; }
      }
    `}</style>
  );
}

export default function ProfilePage() {
  const [bio, setBio] = useState(COORDINATOR.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <ProfilePageStyles />

      <div className="coor-profile-banner" style={{ ...s.profileBanner, background: COORDINATOR.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div className="coor-profile-header-row" style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span className="coor-profile-avatar" style={{ ...s.profileAvatar, background: COORDINATOR.avatarColor }}>
            {COORDINATOR.initials}
          </span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div className="coor-profile-header-info" style={s.profileHeaderInfo}>
          <h2 className="coor-profile-name" style={s.profileName}>{COORDINATOR.name}</h2>
          <p style={s.profileMeta}>{COORDINATOR.title}</p>
        </div>
        <button className="coor-profile-edit-btn" style={s.continueBtnSmall}>Edit profile</button>
      </div>

      <div className="coor-profile-bio-card" style={s.profileBioCard}>
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

      <div className="vc-stat-row" style={s.statRow}>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Applicants reviewed</p>
            <p style={s.pipelineValue}>148</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Interviews conducted</p>
            <p style={s.pipelineValue}>62</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Active scholars managed</p>
            <p style={s.pipelineValue}>{ACTIVE_SCHOLARS.length}</p>
          </div>
        </div>
      </div>

      <div className="coor-profile-contact-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <DrawerInfoRow label="Email" value={COORDINATOR.email} />
        </div>
      </div>
    </div>
  );
}