"use client";

import CardStack from "@/components/CardStack";
import dynamic from "next/dynamic";
import { useEffect, useRef, useCallback } from "react";

const HolographicCard = dynamic(() => import("@/components/HolographicCard"), {
  ssr: false,
});

const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Current and target values for smooth animation
  const scrollProgressRef = useRef(0);
  const targetScrollProgressRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Store card rotations in refs (no re-render)
  // Start at 180° (showing back of card)
  const cardRotationsRef = useRef<number[]>([180, 180, 180, 180]);
  const targetCardRotationsRef = useRef<number[]>([180, 180, 180, 180]);

  // Store HolographicCard update functions
  const cardUpdateFnsRef = useRef<((rotation: number) => void)[]>([]);

  // Drag rotation state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragCardIndexRef = useRef<number | null>(null);
  const dragRotationsRef = useRef<number[]>([0, 0, 0, 0]);
  const targetDragRotationsRef = useRef<number[]>([0, 0, 0, 0]);

  // Hover rotation state (X, Y, Z for each card)
  const hoverRotationsRef = useRef<{ x: number; y: number; z: number }[]>([
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ]);
  const targetHoverRotationsRef = useRef<{ x: number; y: number; z: number }[]>(
    [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]
  );

  const cards = [
    {
      text: "CODE",
      label: "EXPERIENCE",
      descTop: "Precision engineering fused with",
      descBottom: "creativity for flawless performance",
    },
    {
      text: "3D",
      label: "INTERACTIVE",
      descTop: "Immersive visuals and realtime",
      descBottom: "interaction that truly stand out",
    },
    {
      text: "AI",
      label: "AUTOMATION",
      descTop: "Automation and intelligence that",
      descBottom: "elevate every digital experience",
    },
    {
      text: "UXUI",
      label: "CREATIVE",
      descTop: "Premium, intuitive interfaces",
      descBottom: "crafted for effortless user journeys",
    },
  ];

  // Calculate card transform based on progress
  const updateCardTransforms = useCallback(
    (progress: number) => {
      const totalCards = cards.length;
      const cardWidth = 320;
      const gap = 24;

      // Phase 1: 0 to 0.25 - spread out to row
      // Phase 2: 0.25 to 0.75 - flip cards with delay (bounce effect) - 50% of scroll
      // Phase 3: 0.75 to 1.0 - hold position (100vh scroll)
      const spreadProgress = Math.min(progress / 0.25, 1);
      const flipProgress = Math.max(Math.min((progress - 0.25) / 0.5, 1), 0);

      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl) return;

        // Final positions (spread out in a row)
        const totalWidth = (totalCards - 1) * (cardWidth + gap);
        const startX = -totalWidth / 2;
        const finalX = startX + index * (cardWidth + gap);

        // Initial stacked position - fan out like playing cards (centered)
        const centerOffset = ((totalCards - 1) / 2) * 15;
        const initialX = index * -8 - centerOffset; // Centered horizontal offset
        const initialY = index * 3; // Vertical offset (cards go down from top)
        const initialZ = -index * 3; // Slight depth

        // Smooth interpolation for spreading (Phase 1)
        const easedSpread = easeOutCubic(spreadProgress);
        const currentX = lerp(initialX, finalX, easedSpread);
        const currentY = lerp(initialY, 0, easedSpread);
        const currentZ = lerp(initialZ, 0, easedSpread);

        // Scale - all cards same size
        const currentScale = 1;

        // Opacity - all cards visible
        const currentOpacity = 1;

        // Rotation during spread (Phase 1) - fan out like playing cards (centered)
        const centerIndex = (totalCards - 1) / 2;
        const initialRotateZ = (index - centerIndex) * -4; // Symmetric tilt from center
        const currentRotateZ = lerp(initialRotateZ, 0, easedSpread);

        // Phase 2: Flip cards with staggered delay (left to right)
        // Cards flip: 180° → 200° (overshoot) → 0° (front) with bounce
        const flipDelay = index * 0.1; // Less delay between cards
        const cardFlipProgress = Math.max(
          Math.min((flipProgress - flipDelay) / 0.7, 1), // Slower individual flip
          0
        );

        // Bounce easing: goes past target then settles back
        // 180° → 200° (overshoot by 20°) → 0° (final)
        let targetRotation: number;
        if (cardFlipProgress < 0.4) {
          // First part: 180° → -20° (overshoot past 0°)
          const overShootProgress = cardFlipProgress / 0.4;
          const easedOvershoot = easeOutCubic(overShootProgress);
          targetRotation = 180 - easedOvershoot * 200; // goes to -20°
        } else {
          // Second part: -20° → 0° (settle back)
          const settleProgress = (cardFlipProgress - 0.4) / 0.6;
          const easedSettle = easeOutCubic(settleProgress);
          targetRotation = -20 + easedSettle * 20; // goes back to 0°
        }

        targetCardRotationsRef.current[index] = targetRotation;

        // Get hover rotations for this card
        const hoverX = hoverRotationsRef.current[index].x;
        const hoverZ = hoverRotationsRef.current[index].z;

        // Apply transforms directly to DOM (rotateY handled by HolographicCard)
        cardEl.style.transform = `
          translateX(${currentX}px)
          translateY(${currentY}px)
          translateZ(${currentZ}px)
          rotateX(${hoverX}deg)
          rotateZ(${currentRotateZ + hoverZ}deg)
          scale(${currentScale})
        `;
        cardEl.style.opacity = `${currentOpacity}`;
        cardEl.style.zIndex = `${totalCards - index}`;
      });
    },
    [cards.length]
  );

  // Animation loop with smooth lerp
  const animate = useCallback(() => {
    // Smooth lerp for scroll progress
    scrollProgressRef.current = lerp(
      scrollProgressRef.current,
      targetScrollProgressRef.current,
      0.06
    );

    // Smooth lerp for each card's drag rotation (fast snap back when not dragging)
    const dragLerpFactor = isDraggingRef.current ? 0.3 : 0.15;
    for (let i = 0; i < dragRotationsRef.current.length; i++) {
      dragRotationsRef.current[i] = lerp(
        dragRotationsRef.current[i],
        targetDragRotationsRef.current[i],
        dragLerpFactor
      );
    }

    // Smooth lerp for each card's hover rotation (X, Y, Z)
    for (let i = 0; i < hoverRotationsRef.current.length; i++) {
      hoverRotationsRef.current[i].x = lerp(
        hoverRotationsRef.current[i].x,
        targetHoverRotationsRef.current[i].x,
        0.1
      );
      hoverRotationsRef.current[i].y = lerp(
        hoverRotationsRef.current[i].y,
        targetHoverRotationsRef.current[i].y,
        0.1
      );
      hoverRotationsRef.current[i].z = lerp(
        hoverRotationsRef.current[i].z,
        targetHoverRotationsRef.current[i].z,
        0.1
      );
    }

    // Smooth lerp for each card's rotation (Y axis for flip + hover Y)
    for (let i = 0; i < cardRotationsRef.current.length; i++) {
      cardRotationsRef.current[i] = lerp(
        cardRotationsRef.current[i],
        targetCardRotationsRef.current[i] +
          dragRotationsRef.current[i] +
          hoverRotationsRef.current[i].y,
        0.08
      );

      // Update HolographicCard's internal rotation via callback
      if (cardUpdateFnsRef.current[i]) {
        cardUpdateFnsRef.current[i](cardRotationsRef.current[i]);
      }
    }

    // Update card transforms
    updateCardTransforms(scrollProgressRef.current);

    // Continue animation loop
    rafRef.current = requestAnimationFrame(animate);
  }, [updateCardTransforms]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    // Scroll handler
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const containerTop = container.offsetTop;
      const scrollHeight = window.innerHeight * 4; // 400vh for animation phases

      const rawProgress = (scrollTop - containerTop) / scrollHeight;
      targetScrollProgressRef.current = Math.max(0, Math.min(1, rawProgress));
    };

    // Find which card was clicked
    const findCardIndex = (target: EventTarget | null): number | null => {
      if (!target) return null;
      for (let i = 0; i < cardRefs.current.length; i++) {
        const cardEl = cardRefs.current[i];
        if (cardEl && cardEl.contains(target as Node)) {
          return i;
        }
      }
      return null;
    };

    // Drag handlers for card rotation
    const handleMouseDown = (e: MouseEvent) => {
      const cardIndex = findCardIndex(e.target);
      if (cardIndex === null) return;
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragCardIndexRef.current = cardIndex;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || dragCardIndexRef.current === null) return;
      const deltaX = e.clientX - dragStartXRef.current;
      targetDragRotationsRef.current[dragCardIndexRef.current] = deltaX * 0.5;
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (dragCardIndexRef.current !== null) {
        targetDragRotationsRef.current[dragCardIndexRef.current] = 0;
      }
      dragCardIndexRef.current = null;
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      const cardIndex = findCardIndex(e.target);
      if (cardIndex === null) return;
      isDraggingRef.current = true;
      dragStartXRef.current = e.touches[0].clientX;
      dragCardIndexRef.current = cardIndex;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || dragCardIndexRef.current === null) return;
      const deltaX = e.touches[0].clientX - dragStartXRef.current;
      targetDragRotationsRef.current[dragCardIndexRef.current] = deltaX * 0.5;
    };

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (dragCardIndexRef.current !== null) {
        targetDragRotationsRef.current[dragCardIndexRef.current] = 0;
      }
      dragCardIndexRef.current = null;
    };

    // Hover rotation handler
    const handleHoverMove = (e: MouseEvent) => {
      if (isDraggingRef.current) return;

      for (let i = 0; i < cardRefs.current.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const rect = cardEl.getBoundingClientRect();
        const isHovering =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isHovering) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const offsetX = e.clientX - centerX;
          const offsetY = e.clientY - centerY;
          // Y rotation based on X position (left/right tilt)
          targetHoverRotationsRef.current[i].y = -(offsetX / rect.width) * 30;
          // X rotation based on Y position (up/down tilt) - inverted
          targetHoverRotationsRef.current[i].x = -(offsetY / rect.height) * 20;
          // Small Z rotation for extra effect
          targetHoverRotationsRef.current[i].z = (offsetX / rect.width) * 5;
        } else {
          targetHoverRotationsRef.current[i].x = 0;
          targetHoverRotationsRef.current[i].y = 0;
          targetHoverRotationsRef.current[i].z = 0;
        }
      }
    };

    const handleMouseLeave = () => {
      for (let i = 0; i < targetHoverRotationsRef.current.length; i++) {
        targetHoverRotationsRef.current[i].x = 0;
        targetHoverRotationsRef.current[i].y = 0;
        targetHoverRotationsRef.current[i].z = 0;
      }
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("mousemove", handleHoverMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mousemove", handleHoverMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return <CardStack />;
}
