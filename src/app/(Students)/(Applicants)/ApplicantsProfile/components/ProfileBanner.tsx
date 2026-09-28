"use client";

import { Camera } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ProfileBannerProps {
  bannerUrl?: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileBanner({ bannerUrl, uploading, onUpload }: ProfileBannerProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const bannerStyle = bannerUrl
    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(120deg, #14283F 0%, #1E3A5F 100%)" };

  return (
    <div
      className="relative h-36 sm:h-52 w-full rounded-2xl shadow-xs border border-line flex items-end justify-end p-2.5 sm:p-3.5 overflow-hidden"
      style={bannerStyle}
    >
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onUpload}
      />
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => bannerInputRef.current?.click()}
        disabled={uploading}
        className="bg-white/95 hover:bg-white text-navy font-semibold text-xs h-8 sm:h-9 px-2.5 sm:px-3 shadow-md backdrop-blur-xs gap-1.5"
      >
        <Camera className="size-3.5 sm:size-4 text-navy" />
        <span>{uploading ? "Uploading..." : "Change banner"}</span>
      </Button>
    </div>
  );
}
