"use client";

import React, { useState } from "react";
import { CameraIcon, DrawerInfoRow, GRANTOR, FUNDED_SCHOLARS, s } from "@/components/Grantorshared";

function ProfilePageStyles() {
  return (
    <style>{`
      .gr-profile-banner { height: 160px; }
      .gr-profile-avatar { width: 88px; height: 88px; font-size: 1.8rem; }
      .gr-profile-header-row { margin-top: -36px; }

      @media (max-width: 640px) {
        .gr-profile-banner { height: 110px; }
        .gr-profile-avatar { width: 68px; height: 68px; font-size: 1.4rem; }
        .gr-profile-header-row {
          margin-top: -30px;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }
        .gr-profile-header-info { min-width: 0; flex-basis: 100%; order: 2; }
        .gr-profile-edit-btn { order: 3; }
        .gr-profile-bio-card, .gr-profile-contact-card {
          padding: 16px 16px !important;
        }
        .gr-profile-name { font-size: 1.2rem !important; }
      }
    `}</style>
  );
}

export default function GrantorProfilePage() {
  const [bio, setBio] = useState(GRANTOR.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <ProfilePageStyles />

      <div className="gr-profile-banner" style={{ ...s.profileBanner, background: GRANTOR.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div className="gr-profile-header-row" style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span className="gr-profile-avatar" style={{ ...s.profileAvatar, background: GRANTOR.avatarColor }}>
            {GRANTOR.initials}
          </span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div className="gr-profile-header-info" style={s.profileHeaderInfo}>
          <h2 className="gr-profile-name" style={s.profileName}>{GRANTOR.name}</h2>
          <p style={s.profileMeta}>{GRANTOR.title}</p>
        </div>
        <button className="gr-profile-edit-btn" style={s.continueBtnSmall}>Edit profile</button>
      </div>

      <div className="gr-profile-bio-card" style={s.profileBioCard}>
        <div style={s.profileBioHeader}>
          <p style={s.profileBioLabel}>About</p>
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
            <p style={s.pipelineLabel}>Scholars funded</p>
            <p style={s.pipelineValue}>{FUNDED_SCHOLARS.length}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Total disbursed all-time</p>
            <p style={s.pipelineValue}>₱640,000</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Years partnered</p>
            <p style={s.pipelineValue}>5</p>
          </div>
        </div>
      </div>

      <div className="gr-profile-contact-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <DrawerInfoRow label="Email" value={GRANTOR.email} />
        </div>
      </div>
    </div>
  );
}