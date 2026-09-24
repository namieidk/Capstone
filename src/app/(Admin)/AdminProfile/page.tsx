"use client";

import { Building2, CalendarDays, Camera, type LucideIcon, Mail, Pencil, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import EditProfileDrawer from "@/components/EditProfileDrawer";
import { useToast } from "@/components/ToastContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { updateMe, uploadAvatar, uploadBanner } from "@/lib/api/auth";

// Soft green-tinted border (built from --forest, no blue-grey)
const LINE = "border-[color-mix(in_srgb,var(--forest)_14%,white)]";
const SECTION_HEADING = "text-base font-semibold text-navy";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";
const BODY_GRID = "grid flex-1 content-start gap-8 px-5 py-8 sm:px-10 sm:py-10 md:grid-cols-[minmax(0,1fr)_360px]";

// Default banner themes: light tones only, built from the brand CSS variables in globals.css.
// Change BANNER_THEME to "gold", "clay" or "forest" to switch the default look.
function makeBanner(base: string, layers: string[]): React.CSSProperties {
  return {
    backgroundColor: base,
    backgroundImage: layers.join(", "),
    backgroundSize: "22px 22px, auto, auto, auto",
  };
}

const BANNERS = {
  gold: makeBanner("var(--amber-bg)", [
    "radial-gradient(rgba(138,100,16,0.10) 1px, transparent 1px)",
    "radial-gradient(55% 140% at 12% 0%, color-mix(in srgb, white 70%, transparent) 0%, transparent 62%)",
    "radial-gradient(45% 110% at 100% 100%, color-mix(in srgb, var(--amber) 35%, transparent) 0%, transparent 65%)",
    "linear-gradient(120deg, var(--amber-bg) 0%, color-mix(in srgb, var(--amber) 45%, white) 100%)",
  ]),
  clay: makeBanner("var(--bad-bg)", [
    "radial-gradient(rgba(138,58,46,0.10) 1px, transparent 1px)",
    "radial-gradient(55% 140% at 12% 0%, color-mix(in srgb, white 70%, transparent) 0%, transparent 62%)",
    "radial-gradient(45% 110% at 100% 100%, color-mix(in srgb, var(--amber) 28%, transparent) 0%, transparent 65%)",
    "linear-gradient(120deg, var(--bad-bg) 0%, color-mix(in srgb, var(--bad) 22%, white) 100%)",
  ]),
  forest: makeBanner("var(--good-bg)", [
    "radial-gradient(rgba(10,79,66,0.10) 1px, transparent 1px)",
    "radial-gradient(55% 140% at 12% 0%, color-mix(in srgb, white 70%, transparent) 0%, transparent 62%)",
    "radial-gradient(45% 110% at 100% 100%, color-mix(in srgb, var(--amber) 26%, transparent) 0%, transparent 65%)",
    "linear-gradient(120deg, var(--good-bg) 0%, var(--auth-mint-soft) 100%)",
  ]),
} satisfies Record<string, React.CSSProperties>;

const BANNER_THEME: keyof typeof BANNERS = "gold";

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-good-bg text-good">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium [overflow-wrap:anywhere]">
          {href ? (
            <a href={href} className="hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <Skeleton className="h-52 w-full rounded-none sm:h-72" />
      <div className="flex flex-col gap-4 px-5 pb-8 sm:flex-row sm:items-start sm:gap-6 sm:px-10">
        <Skeleton className="-mt-16 size-32 shrink-0 rounded-full border-4 border-white sm:-mt-[4.5rem] sm:size-36" />
        <div className="min-w-0 flex-1 sm:pt-6">
          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="mt-3 h-4 w-40 max-w-full" />
        </div>
      </div>
      <div className={`${BODY_GRID} border-t ${LINE}`}>
        <div className="space-y-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
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
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

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
        showToast("Profile picture updated successfully.");
      } catch (err) {
        console.error("Avatar upload failed:", err);
        showToast(err instanceof ApiError ? err.message : "Avatar upload failed. Please try again.", "error");
      } finally {
        setUploadingAvatar(false);
        if (avatarInputRef.current) avatarInputRef.current.value = "";
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

  const openDrawer = () => {
    setSaveError("");
    setDrawerOpen(true);
  };

  if (!user) return <ProfileSkeleton />;

  const bannerStyle: React.CSSProperties = user.banner_url
    ? { backgroundImage: `url(${user.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : BANNERS[BANNER_THEME];

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleBannerUpload}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Banner (full width) */}
      <div className="relative h-52 shrink-0 sm:h-72" style={bannerStyle}>
        <button
          type="button"
          className={`absolute bottom-4 right-4 z-10 inline-flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-sm font-medium text-navy shadow-sm transition-colors hover:bg-field disabled:opacity-60 sm:bottom-6 sm:right-8 ${LINE} ${FOCUS}`}
          onClick={() => bannerInputRef.current?.click()}
          disabled={uploadingBanner}
        >
          <Camera className="size-4" />
          {uploadingBanner ? "Uploading…" : "Change banner"}
        </button>
      </div>

      {/* Identity */}
      <div className="flex shrink-0 flex-col gap-4 px-5 pb-8 sm:flex-row sm:items-start sm:gap-6 sm:px-10">
        <div className="relative -mt-16 size-32 shrink-0 sm:-mt-[4.5rem] sm:size-36">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={displayName}
              width={144}
              height={144}
              unoptimized
              className="size-full rounded-full border-4 border-white bg-white object-cover shadow-md"
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-full border-4 border-white bg-amber-bg text-4xl font-semibold text-warn shadow-md">
              {displayInitials}
            </span>
          )}
          <button
            type="button"
            aria-label="Change profile picture"
            className={`absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full border bg-white text-navy shadow-sm transition-colors hover:bg-field disabled:opacity-60 ${LINE} ${FOCUS}`}
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            <Camera className="size-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1 sm:pt-6">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-navy sm:text-3xl">{displayName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-sm text-muted-foreground">{displayTitle}</p>
            <Badge
              className="h-6 gap-1.5 px-2.5 text-xs!"
              style={{ background: "var(--good-bg)", color: "var(--good)" }}
            >
              <ShieldCheck className="size-3.5" />
              {displayRole}
            </Badge>
          </div>
        </div>

        <Button type="button" className="h-10 w-full gap-2 px-4 text-sm! sm:mt-6 sm:w-auto" onClick={openDrawer}>
          <Pencil className="size-4" />
          Edit profile
        </Button>
      </div>

      {/* Body */}
      <div className={`${BODY_GRID} border-t ${LINE}`}>
        <section aria-labelledby="profile-about">
          <h2 id="profile-about" className={SECTION_HEADING}>
            About
          </h2>
          {user.bio ? (
            <p className="mt-3 max-w-[68ch] whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground">
              {user.bio}
            </p>
          ) : (
            <div className={`mt-3 rounded-xl border border-dashed bg-cream px-5 py-5 ${LINE}`}>
              <p className="text-sm text-muted-foreground">Add a short bio so people know who you are.</p>
              <button
                type="button"
                className={`mt-1 text-sm font-medium text-navy underline-offset-4 hover:underline ${FOCUS}`}
                onClick={openDrawer}
              >
                Add a bio
              </button>
            </div>
          )}
        </section>

        <section aria-labelledby="profile-details" className={`self-start rounded-2xl border bg-cream p-6 ${LINE}`}>
          <h2 id="profile-details" className={SECTION_HEADING}>
            Details
          </h2>
          <dl className="mt-4 space-y-4">
            <DetailRow icon={ShieldCheck} label="Role" value={displayRole} />
            <DetailRow icon={Building2} label="Department" value={user.employee?.department ?? "N/A"} />
            <DetailRow icon={CalendarDays} label="Member since" value={String(memberSince)} />
            <DetailRow icon={Mail} label="Email" value={user.email} href={`mailto:${user.email}`} />
          </dl>
        </section>
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
