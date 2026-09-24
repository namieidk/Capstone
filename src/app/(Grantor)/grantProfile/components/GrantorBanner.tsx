"use client";

import { Camera } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { BANNER_THEME, BANNERS, FOCUS, LINE } from "./profile-styles";

interface GrantorBannerProps {
  bannerUrl?: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GrantorBanner({ bannerUrl, uploading, onUpload }: GrantorBannerProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const bannerStyle: React.CSSProperties = bannerUrl
    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : BANNERS[BANNER_THEME];

  return (
    <div className="relative h-52 shrink-0 sm:h-72" style={bannerStyle}>
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onUpload}
      />
      <button
        type="button"
        className={`absolute bottom-4 right-4 z-10 inline-flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-sm font-medium text-navy shadow-sm transition-colors hover:bg-field disabled:opacity-60 sm:bottom-6 sm:right-8 ${LINE} ${FOCUS}`}
        onClick={() => bannerInputRef.current?.click()}
        disabled={uploading}
      >
        <Camera className="size-4" />
        {uploading ? "Uploading…" : "Change banner"}
      </button>
    </div>
  );
}
