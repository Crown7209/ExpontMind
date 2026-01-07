"use client";

import dynamic from "next/dynamic";

const GeometricExperience = dynamic(
  () => import("@/components/GeometricExperience"),
  {
    ssr: false,
  }
);

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <GeometricExperience />
    </div>
  );
}
