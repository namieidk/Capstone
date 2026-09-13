"use client";

import type React from "react";
import { useCallback, useState } from "react";
import EditProfileDrawer from "@/components/EditProfileDrawer";
import { useToast } from "@/components/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { updateMe, uploadAvatar, uploadBanner } from "@/lib/api/auth";
import { GrantorBanner } from "./components/GrantorBanner";
import { GrantorBioCard } from "./components/GrantorBioCard";
import { GrantorDetailsCards } from "./components/GrantorDetailsCards";
import { GrantorHeader } from "./components/GrantorHeader";
import { GrantorProfileSkeleton } from "./components/GrantorProfileSkeleton";

export default function GrantorProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() : "";
  const displayInitials = user
    ? ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")).toUpperCase() || "GR"
    : "GR";
  const displayTitle = user?.employee?.title ?? "Scholarship Grantor";

  const handleBannerUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingBanner(true);
      try {
        await uploadBanner(file);
        await refreshUser();
        showToast("Banner image updated successfully.");
      } catch (err) {
        console.error("Banner upload failed:", err);
        showToast(err instanceof ApiError ? err.message : "Banner upload failed. Please try again.", "error");
      } finally {
        setUploadingBanner(false);
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
        showToast("Profile picture updated successfully.");
      } catch (err) {
        console.error("Avatar upload failed:", err);
        showToast(err instanceof ApiError ? err.message : "Avatar upload failed. Please try again.", "error");
      } finally {
        setUploadingAvatar(false);
      }
    },
    [refreshUser, showToast],
  );

  const handleSaveProfile = useCallback(
    async (values: { first_name: string; last_name: string; title: string; department: string; bio: string }) => {
      setSavingProfile(true);
      setSaveError("");
      try {
        await updateMe(values);
        await refreshUser();
        setDrawerOpen(false);
        showToast("Profile information saved successfully.");
      } catch (err) {
        console.error("Profile update failed:", err);
        setSaveError(err instanceof ApiError ? err.message : "Failed to save profile. Please try again.");
      } finally {
        setSavingProfile(false);
      }
    },
    [refreshUser, showToast],
  );

  if (!user) {
    return (
      <div className="min-h-full bg-[#FAF9F7] px-4 py-6 sm:px-8 sm:py-8">
        <GrantorProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FAF9F7] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <GrantorBanner bannerUrl={user.banner_url} uploading={uploadingBanner} onUpload={handleBannerUpload} />

        <GrantorHeader
          displayName={displayName}
          displayInitials={displayInitials}
          displayTitle={displayTitle}
          avatarUrl={user.avatar_url}
          uploadingAvatar={uploadingAvatar}
          onAvatarUpload={handleAvatarUpload}
          onEditProfile={() => {
            setSaveError("");
            setDrawerOpen(true);
          }}
        />

        <GrantorBioCard bio={user.bio} />

        <GrantorDetailsCards user={user} />

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
    </div>
  );
}
