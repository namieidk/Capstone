"use client";

import React, { useState } from "react";
import { CameraIcon, DrawerInfoRow, GRANTOR, FUNDED_SCHOLARS, s } from "@/components/Grantorshared";

export default function GrantorProfilePage() {
  const [bio, setBio] = useState(GRANTOR.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div>
      <div style={{ ...s.profileBanner, background: GRANTOR.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span style={{ ...s.profileAvatar, background: GRANTOR.avatarColor }}>{GRANTOR.initials}</span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div style={s.profileHeaderInfo}>
          <h2 style={s.profileName}>{GRANTOR.name}</h2>
          <p style={s.profileMeta}>{GRANTOR.title}</p>
        </div>
        <button style={s.continueBtnSmall}>Edit profile</button>
      </div>

      <div style={s.profileBioCard}>
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

      <div style={s.statRow}>
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

      <div style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <DrawerInfoRow label="Email" value={GRANTOR.email} />
        </div>
      </div>
    </div>
  );
}