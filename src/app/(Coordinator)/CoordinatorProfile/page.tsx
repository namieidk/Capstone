"use client";

import React, { useState } from "react";
import { CameraIcon, DrawerInfoRow, COORDINATOR, ACTIVE_SCHOLARS, s } from "@/components/Coordinatorshared";

export default function ProfilePage() {
  const [bio, setBio] = useState(COORDINATOR.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div>
      <div style={{ ...s.profileBanner, background: COORDINATOR.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span style={{ ...s.profileAvatar, background: COORDINATOR.avatarColor }}>{COORDINATOR.initials}</span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div style={s.profileHeaderInfo}>
          <h2 style={s.profileName}>{COORDINATOR.name}</h2>
          <p style={s.profileMeta}>{COORDINATOR.title}</p>
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

      <div style={s.statRow}>
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

      <div style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <DrawerInfoRow label="Email" value={COORDINATOR.email} />
        </div>
      </div>
    </div>
  );
}