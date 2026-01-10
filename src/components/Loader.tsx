"use client";

import { useEffect, useState, useRef } from "react";
import { useLoading } from "@/context/LoadingContext";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Preload assets
const ASSETS = {
  glb: ["/mountain.glb", "/Logo.glb"],
  video: ["/footage.mp4"],
  images: ["/logo.png"],
};

export default function Loader() {
  const { isLoading, progress, setProgress, setLoaded } = useLoading();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);
  const loadedRef = useRef(false);

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) return progress;
        return prev + diff * 0.1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [progress]);

  // Load all assets
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const totalAssets =
      ASSETS.glb.length + ASSETS.video.length + ASSETS.images.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const newProgress = (loadedCount / totalAssets) * 100;
      setProgress(newProgress);

      if (loadedCount >= totalAssets) {
        setTimeout(() => {
          // First hide loader content
          setContentHidden(true);
          // Then start curtain animation
          setTimeout(() => {
            setIsExiting(true);
            // Finally mark as loaded after curtain opens
            setTimeout(() => {
              setLoaded();
            }, 1200);
          }, 300);
        }, 300);
      }
    };

    // Preload GLB files
    const gltfLoader = new GLTFLoader();
    ASSETS.glb.forEach((url) => {
      gltfLoader.load(
        url,
        () => updateProgress(),
        undefined,
        () => updateProgress()
      );
    });

    // Preload video
    ASSETS.video.forEach((url) => {
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      video.oncanplaythrough = () => updateProgress();
      video.onerror = () => updateProgress();
      video.load();
    });

    // Preload images
    ASSETS.images.forEach((url) => {
      const img = new Image();
      img.onload = () => updateProgress();
      img.onerror = () => updateProgress();
      img.src = url;
    });
  }, [setProgress, setLoaded]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none">
      {/* Top curtain */}
      <div
        className="absolute top-0 left-0 right-0 bg-[#0a0a0a]"
        style={{
          height: "50%",
          transform: isExiting ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 1s cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      />

      {/* Bottom curtain */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]"
        style={{
          height: "50%",
          transform: isExiting ? "translateY(100%)" : "translateY(0)",
          transition: "transform 1s cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      />

      {/* Loader content - centered */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: contentHidden ? 0 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      >
        {/* Animated logo/spinner */}
        <div className="relative w-20 h-20 mb-8">
          {/* Outer ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "3s" }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${displayProgress * 2.83} 283`}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.3s ease-out" }}
            />
          </svg>

          {/* Inner pulse */}
          <div className="absolute inset-4 rounded-full bg-white/5 animate-pulse" />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2 h-2 rounded-full bg-white"
              style={{
                boxShadow: "0 0 20px rgba(255,255,255,0.5)",
              }}
            />
          </div>
        </div>

        {/* Progress text */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-xs uppercase tracking-[0.3em] font-light">
            Loading
          </span>
          <span className="text-white text-2xl font-light tabular-nums">
            {Math.round(displayProgress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-[1px] bg-white/10 overflow-hidden mt-8">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <span className="text-white/30 text-[10px] uppercase tracking-[0.5em]">
            Expont Mind
          </span>
        </div>
      </div>
    </div>
  );
}
