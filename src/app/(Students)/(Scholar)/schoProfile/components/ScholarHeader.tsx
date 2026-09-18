"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/api/auth";

interface ScholarHeaderProps {
  user: User;
  uploadingAvatar: boolean;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: () => void;
}

export function ScholarHeader({ user, uploadingAvatar, onAvatarUpload, onEditClick }: ScholarHeaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const scholar = user.scholar_profile;

  const displayName = `${user.first_name} ${user.last_name}`.trim() || "Scholar";
  const displayInitials = ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")).toUpperCase() || "SC";
  const avatarUrl = scholar?.avatar_url || user.avatar_url;
  const displayTitle =
    [scholar?.course_of_study, scholar?.school_name].filter(Boolean).join(" • ") || "Active Beneficiary (Scholar)";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 px-2 sm:px-4">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onAvatarUpload}
      />

      <div className="flex items-end gap-3.5 sm:gap-4">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={112}
              height={112}
              unoptimized
              className="size-24 sm:size-28 rounded-full border-4 border-white object-cover shadow-md bg-white"
            />
          ) : (
            <div className="flex size-24 sm:size-28 items-center justify-center rounded-full border-4 border-white bg-[#F3E6C8] text-[#7A5C0A] text-2xl sm:text-3xl font-bold shadow-md">
              {displayInitials}
            </div>
          )}
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            style={{
              backgroundColor: "#ffffff",
              border: "2px solid #ffffff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.22)",
            }}
            className="absolute bottom-0 right-0 z-10 flex size-8 sm:size-9 items-center justify-center rounded-full bg-white text-navy cursor-pointer"
            aria-label="Change profile photo"
            title="Change profile picture"
          >
            <Camera className="size-4 text-navy stroke-[2.2]" />
          </button>
        </div>

        <div className="min-w-0 pb-1">
          <h1 className="truncate text-xl sm:text-2xl font-bold text-navy">{displayName}</h1>
          <p className="truncate text-xs sm:text-sm text-muted-foreground">{displayTitle}</p>
        </div>
      </div>

      <Button
        type="button"
        onClick={onEditClick}
        className="self-start sm:self-end bg-navy hover:bg-navy/90 text-white font-medium px-5 h-10 shadow-xs"
      >
        Edit profile
      </Button>
    </div>
  );
}
