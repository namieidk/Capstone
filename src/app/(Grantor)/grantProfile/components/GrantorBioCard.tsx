"use client";

import { FOCUS, LINE, SECTION_HEADING } from "./profile-styles";

interface GrantorBioCardProps {
  bio?: string;
  onEditProfile?: () => void;
}

export function GrantorBioCard({ bio, onEditProfile }: GrantorBioCardProps) {
  return (
    <section aria-labelledby="profile-about">
      <h2 id="profile-about" className={SECTION_HEADING}>
        About
      </h2>
      {bio ? (
        <p className="mt-3 max-w-[68ch] whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground">{bio}</p>
      ) : (
        <div className={`mt-3 rounded-xl border border-dashed bg-cream px-5 py-5 ${LINE}`}>
          <p className="text-sm text-muted-foreground">Add a short summary of your organization or role.</p>
          {onEditProfile && (
            <button
              type="button"
              className={`mt-1 text-sm font-medium text-navy underline-offset-4 hover:underline ${FOCUS}`}
              onClick={onEditProfile}
            >
              Add a bio
            </button>
          )}
        </div>
      )}
    </section>
  );
}
