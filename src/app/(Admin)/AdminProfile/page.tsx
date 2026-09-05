"use client";

import React, { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateMe, uploadAvatar, uploadBanner } from "@/lib/api/auth";
import { ApiError } from "@/lib/api";
import EditProfileDrawer from "@/components/EditProfileDrawer";
import { useToast } from "@/components/ToastContext";
import {
  CameraIcon,
  DrawerInfoRow,
  s,
} from "@/components/Adminshared";

function ProfilePageStyles() {
  return (
    <style>{`
      .admin-profile-banner { height: 220px; }
      .admin-profile-avatar { width: 120px; height: 120px; font-size: 2.2rem; }
      .admin-profile-header-row { margin-top: -56px; }

      @media (max-width: 640px) {
        .admin-profile-banner { height: 150px !important; }
        .admin-profile-avatar { width: 88px !important; height: 88px !important; font-size: 1.6rem !important; }
        .admin-profile-header-row {
          margin-top: -38px !important;
          align-items: flex-end !important;
          flex-wrap: wrap;
          gap: 12px !important;
        }
        .admin-profile-header-info { min-width: 0; flex-grow: 1; flex-basis: 0; }
        .admin-profile-edit-btn { flex-basis: 100%; justify-content: center; margin-top: 6px; }
        .admin-profile-card {
          padding: 16px 16px !important;
        }
        .admin-profile-name { font-size: 1.35rem !important; }
        .admin-profile-details-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const displayName = user ? `${user.first_name} ${user.last_name}` : "";
  const displayInitials = user
    ? ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")).toUpperCase() || "?"
    : "?";
  const displayRole = user ? "Main Admin" : "";
  const displayTitle = user?.employee?.title ?? "Administrator";
  const memberSince = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  const handleBannerUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingBanner(true);
      try {
        await uploadBanner(file);
        await refreshUser();
        showToast("Banner updated.");
      } catch (err) {
        console.error("Banner upload failed:", err);
        showToast(
          err instanceof ApiError ? err.message : "Banner upload failed. Please try again.",
          "error",
        );
      } finally {
        setUploadingBanner(false);
        if (bannerInputRef.current) bannerInputRef.current.value = "";
      }
    },
    [refreshUser, showToast],
  );

  const handleAvatarUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingAvatar(true);
      try {
        await uploadAvatar(file);
        await refreshUser();
        showToast("Profile picture updated.");
      } catch (err) {
        console.error("Avatar upload failed:", err);
        showToast(
          err instanceof ApiError ? err.message : "Avatar upload failed. Please try again.",
          "error",
        );
      } finally {
        setUploadingAvatar(false);
        if (avatarInputRef.current) avatarInputRef.current.value = "";
      }
    },
    [refreshUser, showToast],
  );

  const handleSaveProfile = useCallback(
    async (values: {
      first_name: string;
      last_name: string;
      title: string;
      department: string;
      bio: string;
    }) => {
      setSavingProfile(true);
      setSaveError("");
      try {
        await updateMe(values);
        await refreshUser();
        setDrawerOpen(false);
        showToast("Profile updated.");
      } catch (err) {
        console.error("Profile update failed:", err);
        setSaveError(
          err instanceof ApiError ? err.message : "Failed to save profile. Please try again.",
        );
      } finally {
        setSavingProfile(false);
      }
    },
    [refreshUser, showToast],
  );

  if (!user) {
    return (
      <div style={{ maxWidth: 900, margin: "clamp(20px, 3vw, 36px) auto 0", width: "100%" }}>
        <ProfilePageStyles />

        <div className="va-skeleton admin-profile-banner" style={{ borderRadius: 18 }} />

        <div className="admin-profile-header-row" style={{ ...s.profileHeaderRow, marginTop: -56 }}>
          <div
            className="va-skeleton"
            style={{ width: 120, height: 120, borderRadius: "50%", border: "4px solid #FFFFFF", boxSizing: "border-box" }}
          />
          <div style={{ flexGrow: 1 }}>
            <div className="va-skeleton" style={{ width: "55%", height: 30, borderRadius: 9, marginBottom: 12 }} />
            <div className="va-skeleton" style={{ width: "34%", height: 15, borderRadius: 7 }} />
          </div>
        </div>

        <div className="va-skeleton" style={{ height: 170, borderRadius: 16, marginBottom: 24 }} />
        <div className="va-skeleton" style={{ height: 170, borderRadius: 16, marginBottom: 24 }} />
        <div className="va-skeleton" style={{ height: 120, borderRadius: 16 }} />
      </div>
    );
  }

  const bannerStyle = user.banner_url
    ? { backgroundImage: `url(${user.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(120deg, #14283F 0%, #1E3A5F 100%)" };

  return (
    <div style={{ maxWidth: 900, margin: "clamp(20px, 3vw, 36px) auto 0", width: "100%" }}>
      <ProfilePageStyles />

      <input
        ref={bannerInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleBannerUpload}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleAvatarUpload}
      />

      <div
        className="admin-profile-banner"
        style={{ ...s.profileBanner, height: 220, ...bannerStyle }}
      >
        <button
          style={s.profileBannerEditBtn}
          onClick={() => bannerInputRef.current?.click()}
          disabled={uploadingBanner}
        >
          <CameraIcon /> {uploadingBanner ? "Uploading..." : "Change banner"}
        </button>
      </div>

      <div className="admin-profile-header-row" style={{ ...s.profileHeaderRow, marginTop: -56 }}>
        <div style={s.profileAvatarWrap}>
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="admin-profile-avatar"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "4px solid #FFFFFF",
                objectFit: "cover",
              }}
            />
          ) : (
            <span
              className="admin-profile-avatar"
              style={{ ...s.profileAvatar, width: 120, height: 120, fontSize: "2.2rem", background: "#F3E6C8", color: "#7A5C0A" }}
            >
              {displayInitials}
            </span>
          )}
          <button
            style={{ ...s.profileAvatarEditBtn, width: 34, height: 34, bottom: 0, right: 0 }}
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            <CameraIcon />
          </button>
        </div>
        <div className="admin-profile-header-info" style={s.profileHeaderInfo}>
          <h2 className="admin-profile-name" style={s.profileName}>{displayName}</h2>
          <p style={s.profileMeta}>{displayTitle}</p>
        </div>
        <button
          className="admin-profile-edit-btn"
          style={s.continueBtnSmall}
          onClick={() => {
            setSaveError("");
            setDrawerOpen(true);
          }}
        >
          Edit profile
        </button>
      </div>

      <div className="admin-profile-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Bio</p>
        <p style={{ ...s.profileBioText, marginTop: 12 }}>
          {user.bio || "No bio yet. Click Edit profile to add one."}
        </p>
      </div>

      <div className="admin-profile-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Details</p>
        <div
          className="admin-profile-details-grid"
          style={{ ...s.drawerInfoGrid, marginTop: 18, rowGap: 22 }}
        >
          <DrawerInfoRow label="Role" value={displayRole} />
          <DrawerInfoRow label="Department" value={user.employee?.department ?? "N/A"} />
          <DrawerInfoRow label="Since" value={String(memberSince)} />
        </div>
      </div>

      <div className="admin-profile-card" style={s.profileBioCard}>
        <p style={s.profileBioLabel}>Contact</p>
        <div style={{ marginTop: 12 }}>
          <DrawerInfoRow label="Email" value={user.email} />
        </div>
      </div>

      <EditProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialValues={{
          first_name: user.first_name,
          last_name: user.last_name,
          title: user.employee?.title ?? "",
          department: user.employee?.department ?? "",
          bio: user.bio ?? "",
        }}
        saving={savingProfile}
        error={saveError}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
