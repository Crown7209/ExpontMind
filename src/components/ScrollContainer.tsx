"use client";

import { useRef, useLayoutEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollContainerProps {
  children: ReactNode;
  scrollLength?: number;
}

export function ScrollContainer({
  children,
  scrollLength = 5,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Refresh ScrollTrigger after layout to ensure correct measurements
    // This is critical when content loads asynchronously (fonts, images)
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-container"
      style={{
        height: `${scrollLength * 100}vh`,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

interface ScrollSectionProps {
  children?: ReactNode;
  id: string;
  className?: string;
}

export function ScrollSection({ children, id, className }: ScrollSectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {children}
    </section>
  );
}
