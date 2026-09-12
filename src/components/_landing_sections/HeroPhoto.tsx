"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const PHOTO_MASK = "linear-gradient(to right, transparent 0%, transparent 34%, black 44%, black 100%)";

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
          className="object-cover"
          style={{ maskImage: PHOTO_MASK, WebkitMaskImage: PHOTO_MASK }}
        />
      </div>
    </div>
  );
}