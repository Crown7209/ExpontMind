"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface AureliaProps {
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export function Aurelia({ className = "", onLoad, onError }: AureliaProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webGPUSupported, setWebGPUSupported] = useState<boolean | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      setMouseOffset({
        x: x * 30, // Хажуу тийш 30px хүртэл
        y: y * 40, // Дээш доош 40px хүртэл
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Check WebGPU support
  useEffect(() => {
    const checkWebGPU = async () => {
      if (!navigator.gpu) {
        setWebGPUSupported(false);
        setError("Your device does not support WebGPU.");
        onError?.("WebGPU not supported");
        return;
      }
      try {
        const adapter = await navigator.gpu.requestAdapter();
        setWebGPUSupported(!!adapter);
        if (!adapter) {
          setError("Could not get WebGPU adapter.");
          onError?.("WebGPU adapter not available");
        }
      } catch {
        setWebGPUSupported(false);
        setError("WebGPU initialization failed.");
        onError?.("WebGPU initialization failed");
      }
    };
    checkWebGPU();
  }, [onError]);

  // Timeout for loading
  useEffect(() => {
    if (webGPUSupported === false) return;

    const timer = setTimeout(() => {
      if (isLoading) {
        setError("Loading timed out. Please try again.");
        setIsLoading(false);
        onError?.("Loading timeout");
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isLoading, webGPUSupported, onError]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-black ${className}`}>
        <div className="text-center max-w-md px-6">
          <p className="text-red-400 text-xl mb-4">WebGPU Error</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <p className="text-gray-500 text-xs">
            Please use Chrome 113+ or Edge 113+ with WebGPU enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden ${className}`}
    >
      {/* Loading overlay - covers iframe completely */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 pointer-events-none">
          <div className="w-[200px] h-[5px] bg-gray-800 rounded overflow-hidden">
            <div className="h-full bg-gray-500 animate-pulse w-1/2" />
          </div>
          <p className="text-gray-500 text-sm mt-4">Loading Aurelia...</p>
        </div>
      )}

      {/* Aurelia iframe with mouse parallax and scroll zoom */}
      {webGPUSupported !== false && (
        <div
          className="w-full h-full"
          style={{
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <iframe
            src="/aurelia/index.html"
            className="w-[calc(100%+60px)] h-[calc(100%+80px)] border-0 pointer-events-none -ml-[30px] -mt-[40px]"
            onLoad={handleIframeLoad}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
            allowFullScreen
            title="Aurelia - Jellyfish WebGPU Experiment"
          />
        </div>
      )}
    </div>
  );
}

export default Aurelia;
