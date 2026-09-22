"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { updateMe, uploadAvatar, uploadBanner } from "@/lib/api/auth";
import { getMyDocuments, type ScholarDocument } from "@/lib/api/documents";
import { EditScholarProfileDrawer, type EditScholarProfileValues } from "./components/EditScholarProfileDrawer";
import { ScholarBanner } from "./components/ScholarBanner";
import { ScholarBioCard } from "./components/ScholarBioCard";
import { ScholarDetailsCards } from "./components/ScholarDetailsCards";
import { ScholarDocumentsList } from "./components/ScholarDocumentsList";
import { ScholarHeader } from "./components/ScholarHeader";
import { ScholarProfileSkeleton } from "./components/ScholarProfileSkeleton";

export default function SchoProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState<ScholarDocument[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const docs = await getMyDocuments().catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) return [];
        throw err;
      });
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to load scholar documents:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Real-time updates
  useSocketEvent("document:verified", fetchDocuments);
  useSocketEvent("document:ocr_completed", fetchDocuments);
  useSocketEvent("disbursement:updated", fetchDocuments);
  useSocketEvent("grade_report:verified", fetchDocuments);

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
    async (values: EditScholarProfileValues) => {
      setSavingProfile(true);
      setSaveError("");
      try {
        await updateMe(values);
        await refreshUser();
        setDrawerOpen(false);
        showToast("Profile details updated successfully.");
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
      <div className="min-h-full bg-[#FAF9F7] px-4 py-6 sm:px-8 sm:py-8">
        <ScholarProfileSkeleton />
      </div>
    );
  }

  const scholar = user.scholar_profile;

  return (
    <div className="min-h-full bg-[#FAF9F7] px-4 py-6 sm:px-8 sm:py-8 pb-24">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Banner */}
        <ScholarBanner
          bannerUrl={scholar?.banner_url || user.banner_url}
          uploading={uploadingBanner}
          onUpload={handleBannerUpload}
        />

        {/* Profile Header (Avatar, Name, Actions) */}
        <ScholarHeader
          user={user}
          uploadingAvatar={uploadingAvatar}
          onAvatarUpload={handleAvatarUpload}
          onEditClick={() => {
            setSaveError("");
            setDrawerOpen(true);
          }}
        />

        {/* Bio Card */}
        <ScholarBioCard bio={scholar?.bio ?? user.bio} />

        {/* Academic and Contact Detail Cards */}
        <ScholarDetailsCards user={user} />

        {/* Uploaded Documents List */}
        <ScholarDocumentsList documents={documents} />

        {/* Edit Profile Drawer */}
        <EditScholarProfileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          initialValues={{
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: scholar?.phone_number || "",
            student_address: scholar?.student_address || scholar?.home_address || "",
            bio: scholar?.bio || user.bio || "",
          }}
          saving={savingProfile}
          error={saveError}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
}
