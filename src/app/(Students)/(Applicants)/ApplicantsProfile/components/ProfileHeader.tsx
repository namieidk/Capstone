"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  displayName: string;
  displayInitials: string;
  courseAndYear: string;
  avatarUrl?: string;
  uploadingAvatar: boolean;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditProfile: () => void;
}

export function ProfileHeader({
  displayName,
  displayInitials,
  courseAndYear,
  avatarUrl,
  uploadingAvatar,
  onAvatarUpload,
  onEditProfile,
}: ProfileHeaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-10 sm:-mt-16 px-1 sm:px-4">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onAvatarUpload}
      />

      <div className="flex items-end gap-3 sm:gap-4 min-w-0">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={112}
              height={112}
              unoptimized
              className="size-20 sm:size-28 rounded-full border-4 border-white object-cover shadow-md bg-white"
            />
          ) : (
            <div className="flex size-20 sm:size-28 items-center justify-center rounded-full border-4 border-white bg-[#F3E6C8] text-[#7A5C0A] text-xl sm:text-3xl font-bold shadow-md">
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
            className="absolute bottom-0 right-0 z-10 flex size-7 sm:size-9 items-center justify-center rounded-full bg-white text-navy cursor-pointer"
            aria-label="Change profile photo"
            title="Change profile picture"
          >
            <Camera className="size-3.5 sm:size-4 text-navy stroke-[2.2]" />
          </button>
        </div>

        <div className="min-w-0 pb-1 flex-1">
          <h1 className="truncate text-lg sm:text-2xl font-bold text-navy leading-tight">{displayName}</h1>
          <p className="truncate text-xs sm:text-sm text-muted-foreground mt-0.5">{courseAndYear}</p>
        </div>
      </div>

      <Button
        type="button"
        onClick={onEditProfile}
        className="w-full sm:w-auto self-stretch sm:self-end bg-navy hover:bg-navy/90 text-white font-medium px-5 h-9 sm:h-10 text-xs sm:text-sm shadow-xs"
      >
        Edit profile
      </Button>
    </div>
  );
}
