"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function HeroPhoto() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = parallaxRef.current;
        if (!element) return;
        element.style.transform = `translate3d(0, ${window.scrollY * 0.15}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/landing.jpg"
          alt="ViaScholar dashboard preview"
          fill
          priority
          quality={100}
          unoptimized
          sizes="100vw"
          className="object-cover object-[80%_center]"
        />
      </div>

      {/* Full-bleed brand tint over the photo — deep forest-green washing
          into navy at the edges — instead of masking the photo off on one
          side. This is what makes the whole section read as one dark,
          editorial banner rather than a light page with a photo cutout. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-[#123524]/78 via-[#1E3A5F]/70 to-[#0F2A1C]/78"
      />
      {/* Extra darkening on the left where the headline sits, so text
          contrast holds regardless of what's in the photo underneath. */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-[#0F2A1C]/55 via-[#0F2A1C]/15 to-transparent" />
    </div>
  );
}
