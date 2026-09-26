"use client";

import { Camera, Pencil, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FOCUS, LINE } from "./profile-styles";

interface GrantorHeaderProps {
  displayName: string;
  displayInitials: string;
  displayTitle: string;
  avatarUrl?: string;
  uploadingAvatar: boolean;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditProfile: () => void;
}

export function GrantorHeader({
  displayName,
  displayInitials,
  displayTitle,
  avatarUrl,
  uploadingAvatar,
  onAvatarUpload,
  onEditProfile,
}: GrantorHeaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex shrink-0 flex-col gap-4 px-5 pb-8 sm:flex-row sm:items-start sm:gap-6 sm:px-10">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onAvatarUpload}
      />

      <div className="relative -mt-16 size-32 shrink-0 sm:-mt-[4.5rem] sm:size-36">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
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
          <Badge className="h-6 gap-1.5 px-2.5 text-xs!" style={{ background: "var(--good-bg)", color: "var(--good)" }}>
            <ShieldCheck className="size-3.5" />
            Grantor
          </Badge>
        </div>
      </div>

      <Button type="button" className="h-10 w-full gap-2 px-4 text-sm! sm:mt-6 sm:w-auto" onClick={onEditProfile}>
        <Pencil className="size-4" />
        Edit profile
      </Button>
    </div>
  );
}
