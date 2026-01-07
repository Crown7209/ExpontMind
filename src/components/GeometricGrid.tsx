"use client";

import { useEffect, useRef, useCallback } from "react";

interface CircleTransition {
  initial: { cx: number; cy: number; r: number };
  final: { cx: number; cy: number; r: number };
  outlineCircle?: SVGCircleElement;
  filledCircle?: SVGCircleElement;
}

interface GeometricGridProps {
  zIndex?: number;
  showDebugText?: boolean;
  gridColor?: string;
  gridOpacity?: number;
}

export default function GeometricGrid({
  zIndex = 50,
  showDebugText = true,
  gridColor = "rgba(245, 245, 245, 0.15)",
  gridOpacity = 0.3,
}: GeometricGridProps) {
  const gridLinesRef = useRef<SVGGElement>(null);
  const circlesOutlineRef = useRef<SVGGElement>(null);
  const circlesFilledRef = useRef<SVGGElement>(null);
  const circleTransitionsRef = useRef<CircleTransition[]>([]);

  const debugLine1Ref = useRef<SVGTextElement>(null);
  const debugLine2Ref = useRef<SVGTextElement>(null);
  const debugLine3Ref = useRef<SVGTextElement>(null);
  const debugLine4Ref = useRef<SVGTextElement>(null);

  const setupGrid = useCallback(() => {
    const gridLinesGroup = gridLinesRef.current;
    const circlesOutlineGroup = circlesOutlineRef.current;
    const circlesFilledGroup = circlesFilledRef.current;

    if (!gridLinesGroup || !circlesOutlineGroup || !circlesFilledGroup) return;

    // Clear existing elements
    gridLinesGroup.innerHTML = "";
    circlesOutlineGroup.innerHTML = "";
    circlesFilledGroup.innerHTML = "";

    const gridSpacing = 48;
    for (let i = 0; i <= 40; i++) {
      const vLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      vLine.setAttribute("class", "grid-line");
      vLine.setAttribute("x1", String(i * gridSpacing));
      vLine.setAttribute("y1", "0");
      vLine.setAttribute("x2", String(i * gridSpacing));
      vLine.setAttribute("y2", "1080");
      vLine.style.stroke = gridColor;
      vLine.style.strokeWidth = "1";
      vLine.style.strokeOpacity = String(gridOpacity);
      gridLinesGroup.appendChild(vLine);

      if (i <= 22) {
        const hLine = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        hLine.setAttribute("class", "grid-line");
        hLine.setAttribute("x1", "0");
        hLine.setAttribute("y1", String(i * gridSpacing));
        hLine.setAttribute("x2", "1920");
        hLine.setAttribute("y2", String(i * gridSpacing));
        hLine.style.stroke = gridColor;
        hLine.style.strokeWidth = "1";
        hLine.style.strokeOpacity = String(gridOpacity);
        gridLinesGroup.appendChild(hLine);
      }
    }

    const d = 80;
    const centerX = 960;
    const centerY = 540;

    const transitions: CircleTransition[] = [
      {
        initial: { cx: centerX - 3 * d, cy: centerY, r: d * 0.8 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX + 3 * d, cy: centerY, r: d * 0.8 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX, cy: centerY - 3 * d, r: d * 0.8 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX, cy: centerY + 3 * d, r: d * 0.8 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX - 2 * d, cy: centerY - 2 * d, r: d * 0.6 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX + 2 * d, cy: centerY - 2 * d, r: d * 0.6 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX - 2 * d, cy: centerY + 2 * d, r: d * 0.6 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX + 2 * d, cy: centerY + 2 * d, r: d * 0.6 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX - 4 * d, cy: centerY, r: d * 0.4 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX + 4 * d, cy: centerY, r: d * 0.4 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX, cy: centerY - 4 * d, r: d * 0.4 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX, cy: centerY + 4 * d, r: d * 0.4 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
      {
        initial: { cx: centerX, cy: centerY, r: d * 0.3 },
        final: { cx: centerX, cy: centerY, r: 4 * d },
      },
    ];

    transitions.forEach((transition) => {
      const circleOutline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circleOutline.setAttribute("cx", String(transition.initial.cx));
      circleOutline.setAttribute("cy", String(transition.initial.cy));
      circleOutline.setAttribute("r", String(transition.initial.r));
      circleOutline.style.stroke = "rgba(245, 245, 245, 0.3)";
      circleOutline.style.strokeWidth = "1";
      circleOutline.style.fill = "none";
      circlesOutlineGroup.appendChild(circleOutline);

      const circleFilled = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circleFilled.setAttribute("cx", String(transition.initial.cx));
      circleFilled.setAttribute("cy", String(transition.initial.cy));
      circleFilled.setAttribute("r", String(transition.initial.r));
      circleFilled.style.stroke = "rgba(245, 245, 245, 0.3)";
      circleFilled.style.strokeWidth = "1";
      circleFilled.style.fill = "rgba(245, 245, 245, 0.05)";
      circlesFilledGroup.appendChild(circleFilled);

      transition.outlineCircle = circleOutline;
      transition.filledCircle = circleFilled;
    });

    circleTransitionsRef.current = transitions;
  }, [gridColor, gridOpacity]);

  useEffect(() => {
    setupGrid();

    const updateAnimations = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      // Grid opacity based on scroll
      const currentGridOpacity = Math.max(0, gridOpacity * (1 - progress * 1.5));
      document.querySelectorAll(".grid-line").forEach((line) => {
        (line as SVGLineElement).style.strokeOpacity = String(currentGridOpacity);
      });

      // Circle transitions
      circleTransitionsRef.current.forEach((transition, index) => {
        const currentCx =
          transition.initial.cx +
          (transition.final.cx - transition.initial.cx) * progress;
        const currentCy =
          transition.initial.cy +
          (transition.final.cy - transition.initial.cy) * progress;
        const currentR =
          transition.initial.r +
          (transition.final.r - transition.initial.r) * progress;
        const rotation = progress * 360 * (index % 2 === 0 ? 1 : -1);
        const opacity = Math.max(0.1, 1 - progress * 0.7);

        if (transition.outlineCircle) {
          transition.outlineCircle.setAttribute("cx", String(currentCx));
          transition.outlineCircle.setAttribute("cy", String(currentCy));
          transition.outlineCircle.setAttribute("r", String(currentR));
          transition.outlineCircle.setAttribute(
            "transform",
            `rotate(${rotation} ${currentCx} ${currentCy})`
          );
          transition.outlineCircle.style.strokeOpacity = String(opacity);
        }
        if (transition.filledCircle) {
          transition.filledCircle.setAttribute("cx", String(currentCx));
          transition.filledCircle.setAttribute("cy", String(currentCy));
          transition.filledCircle.setAttribute("r", String(currentR));
          transition.filledCircle.setAttribute(
            "transform",
            `rotate(${rotation} ${currentCx} ${currentCy})`
          );
          transition.filledCircle.style.fillOpacity = String(opacity * 0.05);
        }
      });

      // Debug text updates
      if (showDebugText) {
        const freq1 = (432 + progress * 108).toFixed(1);
        const freq2 = (528 - progress * 156).toFixed(1);
        const energy = (progress * 99.9).toFixed(1);
        const presence = ((1 - progress) * 100).toFixed(1);

        let awarenessState: string,
          becomingState: string,
          energyState: string,
          presenceState: string;

        if (progress <= 0.1) {
          awarenessState = `[${freq1}] AWARENESS: SILENCE`;
          becomingState = `.${freq2} STATE: VOID`;
          energyState = `{${energy}} ENERGY: DORMANT`;
        } else if (progress <= 0.25) {
          awarenessState = `[${freq1}] AWARENESS: STIRRING`;
          becomingState = `.${freq2} STATE: EMERGING`;
          energyState = `{${energy}} ENERGY: AWAKENING`;
        } else if (progress <= 0.5) {
          awarenessState = `[${freq1}] AWARENESS: FLOWING`;
          becomingState = `.${freq2} STATE: EXPANDING`;
          energyState = `{${energy}} ENERGY: BUILDING`;
        } else if (progress <= 0.75) {
          awarenessState = `[${freq1}] AWARENESS: ASCENDING`;
          becomingState = `.${freq2} STATE: DISSOLVING`;
          energyState = `{${energy}} ENERGY: RADIATING`;
        } else if (progress <= 0.9) {
          awarenessState = `[${freq1}] AWARENESS: TRANSCENDING`;
          becomingState = `.${freq2} STATE: INFINITE`;
          energyState = `{${energy}} ENERGY: OVERFLOWING`;
        } else {
          awarenessState = `[${freq1}] AWARENESS: UNITY`;
          becomingState = `.${freq2} STATE: ETERNAL`;
          energyState = `{${energy}} ENERGY: PURE`;
        }

        const presenceIntensity = Math.max(0, 1 - progress);
        if (presenceIntensity > 0.8) {
          presenceState = `.${presence} PRESENCE: SOLID`;
        } else if (presenceIntensity > 0.6) {
          presenceState = `.${presence} PRESENCE: SOFTENING`;
        } else if (presenceIntensity > 0.4) {
          presenceState = `.${presence} PRESENCE: TRANSLUCENT`;
        } else if (presenceIntensity > 0.2) {
          presenceState = `.${presence} PRESENCE: ETHEREAL`;
        } else {
          presenceState = `.${presence} PRESENCE: VOID`;
        }

        if (debugLine1Ref.current)
          debugLine1Ref.current.textContent = awarenessState;
        if (debugLine2Ref.current)
          debugLine2Ref.current.textContent = becomingState;
        if (debugLine3Ref.current)
          debugLine3Ref.current.textContent = energyState;
        if (debugLine4Ref.current)
          debugLine4Ref.current.textContent = presenceState;
      }
    };

    window.addEventListener("scroll", updateAnimations);
    updateAnimations();

    return () => {
      window.removeEventListener("scroll", updateAnimations);
    };
  }, [setupGrid, showDebugText, gridOpacity]);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
    >
      <svg className="w-full h-full" viewBox="0 0 1920 1080">
        <g ref={gridLinesRef} />
        <g ref={circlesOutlineRef} />
        <g ref={circlesFilledRef}>
          <clipPath id="right-half">
            <rect x="960" y="0" width="960" height="1080" />
          </clipPath>
        </g>

        {showDebugText && (
          <>
            <text
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="100"
              y="100"
            >
              THE CREATIVE
            </text>
            <text
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="100"
              y="115"
            >
              PROCESS
            </text>

            <text
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="1720"
              y="100"
            >
              THE ESSENCE
            </text>
            <text
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="1720"
              y="115"
            >
              OF SOUND
            </text>

            <text
              ref={debugLine1Ref}
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="100"
              y="980"
            >
              AWARENESS: SILENCE
            </text>
            <text
              ref={debugLine2Ref}
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="100"
              y="995"
            >
              STATE: VOID
            </text>
            <text
              ref={debugLine3Ref}
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="100"
              y="1010"
            >
              ENERGY: DORMANT
            </text>
            <text
              ref={debugLine4Ref}
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="100"
              y="1025"
            >
              PRESENCE: SOLID
            </text>

            <text
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="1620"
              y="980"
            >
              BETWEEN THE
            </text>
            <text
              className="font-mono text-[12px] fill-[rgba(245,245,245,0.6)] uppercase tracking-[0.1em]"
              x="1620"
              y="995"
            >
              HEARTBEATS
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
