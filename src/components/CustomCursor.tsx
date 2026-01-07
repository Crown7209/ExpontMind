"use client";

import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

// Map number from one range to another
const map = (x: number, a: number, b: number, c: number, d: number): number =>
  ((x - a) * (d - c)) / (b - a) + c;

interface CursorProps {
  triggerSelector?: string;
}

export function CustomCursor({ triggerSelector = "a, button" }: CursorProps) {
  const cursor1Ref = useRef<SVGSVGElement>(null);
  const cursor2Ref = useRef<SVGSVGElement>(null);
  const inner1Ref = useRef<SVGCircleElement>(null);
  const inner2Ref = useRef<SVGCircleElement>(null);
  const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    if (!window.matchMedia("(any-pointer: fine)").matches) {
      return;
    }

    const cursor1 = cursor1Ref.current;
    const cursor2 = cursor2Ref.current;
    const inner1 = inner1Ref.current;
    const inner2 = inner2Ref.current;
    const feTurbulence = feTurbulenceRef.current;

    if (!cursor1 || !cursor2 || !inner1 || !inner2 || !feTurbulence) return;

    // Track cursor position
    let cursorPos = { x: 0, y: 0 };

    // Cursor element states
    const cursor1State = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
      radius: { previous: 20, current: 20, amt: 0.15 },
      opacity: { previous: 1, current: 1, amt: 0.15 },
    };

    const cursor2State = {
      tx: { previous: 0, current: 0, amt: 0.13 },
      ty: { previous: 0, current: 0, amt: 0.13 },
      radius: { previous: 24, current: 24, amt: 0.13 },
      opacity: { previous: 1, current: 1, amt: 0.13 },
    };

    const bounds1 = cursor1.getBoundingClientRect();
    const bounds2 = cursor2.getBoundingClientRect();

    // Filter animation state
    let filterAnimationId: number | null = null;
    let turbulenceValue = 0;
    let isHovering = false;

    // Hide cursors initially
    cursor1.style.opacity = "0";
    cursor2.style.opacity = "0";

    let initialized = false;

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos = { x: e.clientX, y: e.clientY };

      if (!initialized) {
        // Initialize positions
        cursor1State.tx.previous = cursor1State.tx.current =
          cursorPos.x - bounds1.width / 2;
        cursor1State.ty.previous = cursor1State.ty.current =
          cursorPos.y - bounds1.height / 2;
        cursor2State.tx.previous = cursor2State.tx.current =
          cursorPos.x - bounds2.width / 2;
        cursor2State.ty.previous = cursor2State.ty.current =
          cursorPos.y - bounds2.height / 2;

        cursor1.style.opacity = "1";
        cursor2.style.opacity = "1";
        initialized = true;
      }
    };

    // Filter animation for hover effect
    const animateFilter = () => {
      if (isHovering) {
        turbulenceValue = lerp(turbulenceValue, 0.04, 0.05);
      } else {
        turbulenceValue = lerp(turbulenceValue, 0, 0.1);
      }

      if (turbulenceValue > 0.001) {
        feTurbulence.setAttribute("baseFrequency", String(turbulenceValue));
        inner1.style.filter = "url(#cursor-filter)";

        // Map turbulence to opacity and radius
        const mappedOpacity = map(turbulenceValue, 0.01, 0.04, 1, 0.3);
        const mappedRadius = map(turbulenceValue, 0.01, 0.04, 20, 50);

        cursor1State.opacity.current = Math.max(0.3, mappedOpacity);
        cursor1State.radius.current = Math.min(50, mappedRadius);
      } else {
        inner1.style.filter = "none";
        cursor1State.opacity.current = 1;
        cursor1State.radius.current = 20;
      }

      filterAnimationId = requestAnimationFrame(animateFilter);
    };

    // Main render loop
    const render = () => {
      // Update current positions
      cursor1State.tx.current = cursorPos.x - bounds1.width / 2;
      cursor1State.ty.current = cursorPos.y - bounds1.height / 2;
      cursor2State.tx.current = cursorPos.x - bounds2.width / 2;
      cursor2State.ty.current = cursorPos.y - bounds2.height / 2;

      // Interpolate cursor 1
      cursor1State.tx.previous = lerp(
        cursor1State.tx.previous,
        cursor1State.tx.current,
        cursor1State.tx.amt
      );
      cursor1State.ty.previous = lerp(
        cursor1State.ty.previous,
        cursor1State.ty.current,
        cursor1State.ty.amt
      );
      cursor1State.radius.previous = lerp(
        cursor1State.radius.previous,
        cursor1State.radius.current,
        cursor1State.radius.amt
      );
      cursor1State.opacity.previous = lerp(
        cursor1State.opacity.previous,
        cursor1State.opacity.current,
        cursor1State.opacity.amt
      );

      // Interpolate cursor 2 (slower delay)
      cursor2State.tx.previous = lerp(
        cursor2State.tx.previous,
        cursor2State.tx.current,
        cursor2State.tx.amt
      );
      cursor2State.ty.previous = lerp(
        cursor2State.ty.previous,
        cursor2State.ty.current,
        cursor2State.ty.amt
      );
      cursor2State.radius.previous = lerp(
        cursor2State.radius.previous,
        cursor2State.radius.current,
        cursor2State.radius.amt
      );
      cursor2State.opacity.previous = lerp(
        cursor2State.opacity.previous,
        cursor2State.opacity.current,
        cursor2State.opacity.amt
      );

      // Apply transforms
      cursor1.style.transform = `translateX(${cursor1State.tx.previous}px) translateY(${cursor1State.ty.previous}px)`;
      cursor2.style.transform = `translateX(${cursor2State.tx.previous}px) translateY(${cursor2State.ty.previous}px)`;

      // Apply radius
      inner1.setAttribute("r", String(cursor1State.radius.previous));
      inner2.setAttribute("r", String(cursor2State.radius.previous));

      // Apply opacity
      cursor1.style.opacity = String(cursor1State.opacity.previous);
      cursor2.style.opacity = String(cursor2State.opacity.previous);

      requestAnimationFrame(render);
    };

    // Hover handlers
    const handleEnter = () => {
      isHovering = true;
      feTurbulence.setAttribute(
        "seed",
        String(Math.round(Math.random() * 20 + 1))
      );
    };

    const handleLeave = () => {
      isHovering = false;
    };

    // Add hover listeners to trigger elements
    const triggers = document.querySelectorAll(triggerSelector);
    triggers.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    // Start listening
    window.addEventListener("mousemove", handleMouseMove);

    // Start render loop
    requestAnimationFrame(render);
    filterAnimationId = requestAnimationFrame(animateFilter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      triggers.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
      if (filterAnimationId) cancelAnimationFrame(filterAnimationId);
    };
  }, [triggerSelector]);

  return (
    <>
      {/* Cursor 1 - with filter effect */}
      <svg
        ref={cursor1Ref}
        className="fixed top-0 left-0 pointer-events-none z-10000"
        style={{ display: "block" }}
        width="140"
        height="140"
        viewBox="0 0 140 140"
      >
        <defs>
          <filter
            id="cursor-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              ref={feTurbulenceRef}
              type="fractalNoise"
              seed="3"
              baseFrequency="0"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="15"
              in="SourceGraphic"
            />
          </filter>
        </defs>
        <circle
          ref={inner1Ref}
          className="fill-none stroke-white"
          style={{ strokeWidth: "1.2px" }}
          cx="70"
          cy="70"
          r="20"
        />
      </svg>

      {/* Cursor 2 - delayed follower */}
      <svg
        ref={cursor2Ref}
        className="fixed top-0 left-0 pointer-events-none z-10000"
        style={{ display: "block" }}
        width="140"
        height="140"
        viewBox="0 0 140 140"
      >
        <circle
          ref={inner2Ref}
          className="fill-none stroke-white/50"
          style={{ strokeWidth: "1px" }}
          cx="70"
          cy="70"
          r="24"
        />
      </svg>
    </>
  );
}

export default CustomCursor;
