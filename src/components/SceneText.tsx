"use client";

import { useEffect, useState } from "react";

export function SceneText() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // 0-100vh: text харагдана
      // 100vh-150vh: text хажуу тийш алга болно
      if (scrollY <= vh) {
        setScrollProgress(0);
      } else if (scrollY > vh && scrollY <= vh * 1.5) {
        // 100vh-150vh хооронд 0-1 хүртэл
        setScrollProgress((scrollY - vh) / (vh * 0.5));
      } else {
        setScrollProgress(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = 1 - scrollProgress;

  // Зүүн талын текстүүд - дээрээс доош удаашрах (1.0 -> 0.4)
  const leftTexts = ["We", "build", "next-gen", "experiences"];
  const leftMultipliers = [1.0, 0.75, 0.55, 0.4]; // Дээр нь хурдан, доор нь удаан

  // Баруун талын текстүүд - дээрээс доош удаашрах
  const rightTexts = ["Make", "digital", "feel alive"];
  const rightMultipliers = [1.0, 0.7, 0.45];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-1 pointer-events-none flex justify-between items-end px-24 py-16">
      {/* Зүүн доод булан */}
      <div className="text-left flex flex-col gap-1">
        {leftTexts.map((text, index) => (
          <p
            key={text}
            className="text-7xl text-white font-normal tracking-wide uppercase transition-all duration-100 ease-out will-change-transform"
            style={{
              transform: `translateX(${
                -scrollProgress * 120 * leftMultipliers[index]
              }%)`,
              opacity: opacity,
            }}
          >
            {text}
          </p>
        ))}
      </div>

      {/* Баруун доод булан */}
      <div className="text-right flex flex-col gap-1">
        {rightTexts.map((text, index) => (
          <p
            key={text}
            className="text-7xl text-white font-normal tracking-wide uppercase transition-all duration-100 ease-out will-change-transform"
            style={{
              transform: `translateX(${
                scrollProgress * 120 * rightMultipliers[index]
              }%)`,
              opacity: opacity,
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default SceneText;
