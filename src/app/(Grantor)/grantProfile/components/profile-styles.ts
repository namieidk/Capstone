import type React from "react";

export const LINE = "border-[color-mix(in_srgb,var(--forest)_14%,white)]";
export const SECTION_HEADING = "text-base font-semibold text-navy";
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";
export const BODY_GRID =
  "grid flex-1 content-start gap-8 px-5 py-8 sm:px-10 sm:py-10 md:grid-cols-[minmax(0,1fr)_360px]";

function makeBanner(base: string, layers: string[]): React.CSSProperties {
  return {
    backgroundColor: base,
    backgroundImage: layers.join(", "),
    backgroundSize: "22px 22px, auto, auto, auto",
  };
}

export const BANNERS = {
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

export const BANNER_THEME: keyof typeof BANNERS = "gold";
