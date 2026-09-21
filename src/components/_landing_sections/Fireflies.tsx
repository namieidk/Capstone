"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const FIREFLIES = [
  { left: "4%", top: "14%", size: 3, duration: 7.4, delay: 0.2 },
  { left: "11%", top: "58%", size: 4, duration: 8.2, delay: 1.6 },
  { left: "19%", top: "82%", size: 3, duration: 6.8, delay: 2.9 },
  { left: "27%", top: "30%", size: 5, duration: 9.1, delay: 0.7 },
  { left: "35%", top: "70%", size: 3, duration: 7.9, delay: 3.3 },
  { left: "44%", top: "10%", size: 4, duration: 8.6, delay: 1.1 },
  { left: "52%", top: "48%", size: 3, duration: 6.5, delay: 2.4 },
  { left: "61%", top: "86%", size: 4, duration: 9.4, delay: 0.4 },
  { left: "69%", top: "22%", size: 3, duration: 7.1, delay: 2.1 },
  { left: "77%", top: "64%", size: 5, duration: 8.9, delay: 1.4 },
  { left: "85%", top: "36%", size: 3, duration: 6.9, delay: 3.6 },
  { left: "93%", top: "76%", size: 4, duration: 9.6, delay: 0.9 },
];

export function Fireflies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const fireflyStyle = useMemo(() => ({ transform: `translate3d(${tilt.x * 16}px, ${tilt.y * 16}px, 0)` }), [tilt]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const element = sectionRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setTilt({
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={sectionRef} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={fireflyStyle}>
        <style>{`
          @keyframes vs-firefly-drift {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
            25% { transform: translate(6px, -10px) scale(1.15); opacity: 0.9; }
            50% { transform: translate(-8px, 4px) scale(0.9); opacity: 0.4; }
            75% { transform: translate(4px, 10px) scale(1.1); opacity: 0.85; }
          }
        `}</style>
        {FIREFLIES.map((firefly) => (
          <span
            key={`firefly-${firefly.left}-${firefly.top}`}
            className="absolute rounded-full bg-amber animate-[vs-firefly-drift_ease-in-out_infinite]"
            style={{
              left: firefly.left,
              top: firefly.top,
              width: firefly.size,
              height: firefly.size,
              animationDuration: `${firefly.duration}s`,
              animationDelay: `${firefly.delay}s`,
              boxShadow: "0 0 6px 2px rgba(241, 183, 30, 0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
