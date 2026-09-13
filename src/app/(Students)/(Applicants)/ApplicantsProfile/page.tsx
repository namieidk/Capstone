"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type Application, getMyApplication } from "@/lib/api/applications";
import { updateMe, uploadAvatar, uploadBanner } from "@/lib/api/auth";
import { getMyDocuments, type ScholarDocument } from "@/lib/api/documents";
import { EditApplicantProfileDrawer, type EditApplicantProfileValues } from "../components/EditApplicantProfileDrawer";
import { ProfileBanner } from "./components/ProfileBanner";
import { ProfileBioCard } from "./components/ProfileBioCard";
import { ProfileDetailsCards } from "./components/ProfileDetailsCards";
import { ProfileDocumentsList } from "./components/ProfileDocumentsList";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";

export default function ApplicantsProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<ScholarDocument[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [app, docs] = await Promise.all([
        getMyApplication().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return null;
          throw err;
        }),
        getMyDocuments().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return [];
          throw err;
        }),
      ]);
      setApplication(app);
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to load applicant profile data:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time lifecycle events
  useSocketEvent("application:stage_updated", fetchData);
  useSocketEvent("document:verified", fetchData);
  useSocketEvent("document:ocr_completed", fetchData);

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
    async (values: EditApplicantProfileValues) => {
      setSavingProfile(true);
      setSaveError("");
      try {
        await updateMe(values);
        await refreshUser();
        setDrawerOpen(false);
        showToast("Profile information updated successfully.");
      } catch (err) {
        console.error("Profile update failed:", err);
        setSaveError(err instanceof ApiError ? err.message : "Failed to update profile. Please try again.");
      } finally {
        setSavingProfile(false);
      }
    },
    [refreshUser, showToast],
  );

  if (!user || loadingData) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 space-y-6">
        <Skeleton className="h-44 sm:h-52 w-full rounded-2xl" />
        <div className="flex items-end gap-4 -mt-12 px-4">
          <Skeleton className="size-24 sm:size-28 rounded-full border-4 border-white" />
          <div className="space-y-2 flex-1 pb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const displayName = `${user.first_name} ${user.last_name}`;
  const displayInitials = ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")).toUpperCase() || "?";
  const scholarProfile = user.scholar_profile;
  const courseAndYear = scholarProfile?.course_of_study
    ? `${scholarProfile.course_of_study}${scholarProfile.current_year_level ? ` · Year ${scholarProfile.current_year_level}` : ""}`
    : "Applicant";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 space-y-6">
      {/* Banner */}
      <ProfileBanner bannerUrl={user.banner_url} uploading={uploadingBanner} onUpload={handleBannerUpload} />

      {/* Avatar & Header */}
      <ProfileHeader
        displayName={displayName}
        displayInitials={displayInitials}
        courseAndYear={courseAndYear}
        avatarUrl={user.avatar_url}
        uploadingAvatar={uploadingAvatar}
        onAvatarUpload={handleAvatarUpload}
        onEditProfile={() => {
          setSaveError("");
          setDrawerOpen(true);
        }}
      />

      {/* Application & Document Stats */}
      <ProfileStats application={application} documents={documents} />

      {/* Bio */}
      <ProfileBioCard bio={user.bio} />

      {/* Academic & Contact Information */}
      <ProfileDetailsCards user={user} />

      {/* Uploaded Documents List with Preview Dialog */}
      <ProfileDocumentsList documents={documents} />

      {/* Edit Profile Drawer */}
      <EditApplicantProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialValues={{
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: scholarProfile?.phone_number ?? "",
          student_address: scholarProfile?.student_address ?? "",
          bio: user.bio ?? "",
        }}
        saving={savingProfile}
        error={saveError}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
