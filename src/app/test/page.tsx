"use client";

import dynamic from "next/dynamic";

const InteractiveParticles = dynamic(
  () =>
    import("@/components/InteractiveParticles").then(
      (mod) => mod.InteractiveParticles
    ),
  { ssr: false }
);

export default function TestPage() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Interactive Particles */}
      <InteractiveParticles
        className="absolute inset-0 w-full h-full"
        samples={[
          "/portrait.jpg",
          // "/images/sample-02.png",
          // "/images/sample-03.png",
          // "/images/sample-04.png",
        ]}
      />

      <div className="absolute bottom-4 left-4 text-white/50 text-sm pointer-events-none z-10">
        <p>Interactive Particles</p>
        <p className="text-xs mt-1">Move mouse to interact</p>
      </div>

      <a
        href="/"
        className="absolute top-4 left-4 text-white/70 hover:text-white text-sm px-4 py-2 bg-black/50 rounded-full transition-colors z-20"
      >
        ← Back
      </a>
    </div>
  );
}
