"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  DrawerInfoRow,
  ADMIN,
  EMPLOYEES,
  SCHOLARS_DIRECTORY,
  s,
} from "@/components/AdminShared";

export default function AdminProfilePage() {
  const [bio, setBio] = useState(ADMIN.bio);
  const [editingBio, setEditingBio] = useState(false);

  return (
    <div>
      <div style={{ ...s.profileBanner, background: ADMIN.bannerGradient }}>
        <button style={s.profileBannerEditBtn}>
          <CameraIcon /> Change banner
        </button>
      </div>

      <div style={s.profileHeaderRow}>
        <div style={s.profileAvatarWrap}>
          <span style={{ ...s.profileAvatar, background: ADMIN.avatarColor }}>{ADMIN.initials}</span>
          <button style={s.profileAvatarEditBtn}>
            <CameraIcon />
          </button>
        </div>
        <div style={s.profileHeaderInfo}>
          <h2 style={s.profileName}>{ADMIN.name}</h2>
          <p style={s.profileMeta}>{ADMIN.title}</p>
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

      <div style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 10 }}>
          <DrawerInfoRow label="Email" value={ADMIN.email} />
        </div>
      </div>
    </div>
  );
}