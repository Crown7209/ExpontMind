"use client";

interface NoiseOverlayProps {
  opacity?: number;
  zIndex?: number;
}

export default function NoiseOverlay({
  opacity = 0.08,
  zIndex = 1000,
}: NoiseOverlayProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'url("https://assets.codepen.io/7558/noise-002.png")',
        backgroundRepeat: "repeat",
        opacity,
        zIndex,
      }}
    />
  );
}
