"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface CircleTransition {
  initial: { cx: number; cy: number; r: number };
  final: { cx: number; cy: number; r: number };
  outlineCircle?: SVGCircleElement;
  filledCircle?: SVGCircleElement;
}

export default function GeometricExperience() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const circleRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<SVGGElement>(null);
  const circlesOutlineRef = useRef<SVGGElement>(null);
  const circlesFilledRef = useRef<SVGGElement>(null);
  const circleTransitionsRef = useRef<CircleTransition[]>([]);

  const debugLine1Ref = useRef<SVGTextElement>(null);
  const debugLine2Ref = useRef<SVGTextElement>(null);
  const debugLine3Ref = useRef<SVGTextElement>(null);
  const debugLine4Ref = useRef<SVGTextElement>(null);
  const gradientRevealRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);

  // Audio refs
  const startClickSoundRef = useRef<HTMLAudioElement>(null);
  const preloaderSoundRef = useRef<HTMLAudioElement>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);

  const setupGeometricBackground = useCallback(() => {
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
      vLine.style.stroke = "rgba(245, 245, 245, 0.15)";
      vLine.style.strokeWidth = "1";
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
        hLine.style.stroke = "rgba(245, 245, 245, 0.15)";
        hLine.style.strokeWidth = "1";
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
  }, []);

  const startAnimations = useCallback(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Gradient reveal animation
    if (gradientRevealRef.current) {
      gsap.to(gradientRevealRef.current, {
        y: "-500vh",
        duration: 2,
        ease: "power2.inOut",
        delay: 0.25,
      });
    }

    // Preloader fade out
    if (preloaderRef.current) {
      gsap.to(preloaderRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 1.0,
        onComplete: () => {
          setShowPreloader(false);
        },
      });
    }

    // Update animations on scroll
    const updateAnimations = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      // Circle scale and glow
      if (circleRef.current) {
        const scale = 1 + progress * 1.8;
        const shadowSize = progress * 150;
        const shadowSpread = progress * 35;
        const shadowOpacity = progress;
        circleRef.current.style.transform = `scale(${scale})`;
        circleRef.current.style.boxShadow = `0 0 ${shadowSize}px ${shadowSpread}px rgba(255, 255, 0, ${shadowOpacity})`;
      }

      // Grid opacity
      const gridOpacity = Math.max(0, 0.3 * (1 - progress * 1.5));
      document.querySelectorAll(".grid-line").forEach((line) => {
        (line as SVGLineElement).style.strokeOpacity = String(gridOpacity);
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
    };

    window.addEventListener("scroll", updateAnimations);
    updateAnimations();

    return () => {
      window.removeEventListener("scroll", updateAnimations);
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    setShowPreloader(true);
    setIsLoading(false);

    // Play sounds
    if (startClickSoundRef.current) {
      startClickSoundRef.current.play().catch(() => {});
    }
    if (preloaderSoundRef.current) {
      preloaderSoundRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.volume = 0.5;
        backgroundMusicRef.current.play().catch(() => {});
      }
    }, 500);

    // Counter animation
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setCounter(count);
      if (count >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          if (preloaderSoundRef.current) {
            preloaderSoundRef.current.pause();
            preloaderSoundRef.current.currentTime = 0;
          }
          setupGeometricBackground();
          startAnimations();
        }, 500);
      }
    }, 50);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <div
      className="relative w-full font-mono text-[11px] text-[rgba(245,245,245,0.9)] uppercase leading-[1.2]"
      style={{ height: "700vh" }}
    >
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000]"
        style={{
          backgroundImage:
            'url("https://assets.codepen.io/7558/noise-002.png")',
          backgroundRepeat: "repeat",
          opacity: 0.08,
        }}
      />

      {/* Audio Enable Screen */}
      {isLoading && !isStarted && (
        <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[2000] gap-8 text-center p-4">
          <p>
            ENTER EXPERIENCE
            <br />
            WITH AUDIO
          </p>
          <button
            onClick={handleStart}
            className="border border-[rgba(245,245,245,0.9)] bg-transparent text-[rgba(245,245,245,0.9)] px-8 py-4 font-mono text-[12px] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-[rgba(245,245,245,0.9)] hover:text-[#0a0a0a]"
          >
            START
          </button>
        </div>
      )}

      {/* Preloader */}
      {showPreloader && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[2000] font-mono text-[12px] tracking-[0.1em] uppercase"
        >
          [{counter.toString().padStart(3, "0")}]
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-20 z-[100] px-8">
        <div className="grid grid-cols-12 gap-4 items-center h-full">
          <div className="col-span-2 relative h-8">
            <div className="relative w-full h-full group">
              <div className="absolute w-[1.8rem] h-[1.8rem] rounded-full bg-[rgba(245,245,245,0.9)] top-1/2 left-0 -translate-y-1/2 transition-transform duration-500 group-hover:-translate-x-2" />
              <div className="absolute w-[1.8rem] h-[1.8rem] rounded-full bg-[rgba(245,245,245,0.9)] top-1/2 left-4 -translate-y-1/2 transition-transform duration-500 mix-blend-exclusion group-hover:translate-x-2" />
            </div>
          </div>

          <nav className="col-span-4 col-start-4">
            <ul className="flex gap-6 flex-wrap">
              {["CREATIVE JOURNEY", "ABOUT", "SOUND"].map((item, i) => (
                <li key={i} className="relative group">
                  <a
                    href="#"
                    className="text-[rgba(245,245,245,0.9)] no-underline text-[12px] font-mono uppercase tracking-[0.1em] block pl-2 transition-colors duration-200"
                  >
                    {item}
                  </a>
                  <div className="absolute top-1/2 left-0 w-1 h-1 bg-[rgba(245,245,245,0.9)] -translate-y-1/2 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 col-start-9 text-right">
            <a
              href="#"
              className="text-[rgba(245,245,245,0.9)] no-underline text-[12px] font-mono uppercase tracking-[0.1em] transition-opacity duration-300 hover:opacity-70"
            >
              +CONNECT
            </a>
          </div>
        </div>
      </header>

      {/* Gradient Reveal */}
      <div
        ref={gradientRevealRef}
        className="fixed inset-0 w-screen pointer-events-none z-[1500]"
        style={{
          height: "500vh",
          background:
            "linear-gradient(to bottom, #000000 0%, #000000 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)",
        }}
      />

      {/* Geometric Background */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <g ref={gridLinesRef} />
          <g ref={circlesOutlineRef} />
          <g ref={circlesFilledRef}>
            <clipPath id="right-half">
              <rect x="960" y="0" width="960" height="1080" />
            </clipPath>
          </g>

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
        </svg>
      </div>

      {/* Center Circle */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] flex flex-col items-center justify-center">
        <div
          ref={circleRef}
          className="w-20 h-20 bg-white rounded-full"
          style={{ transformOrigin: "center center" }}
        />
      </div>

      {/* Sections */}
      <section
        className="h-[200vh] relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            'url("https://assets.codepen.io/7558/blue-orange-003.jpg")',
        }}
      />
      <section
        className="h-[200vh] relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            'url("https://assets.codepen.io/7558/blue-orange-001.jpg")',
        }}
      />
      <section
        className="h-[200vh] relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            'url("https://assets.codepen.io/7558/blue-orange-002.jpg")',
        }}
      />

      {/* Footer */}
      <footer className="relative w-full h-[50vh] bg-[#0a0a0a] z-10 flex flex-col items-center justify-between p-8">
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex justify-between w-full mb-8">
            <div className="flex flex-col gap-[0.15rem] font-mono text-[12px] uppercase">
              <p>THE DARKNESS</p>
              <p>IS WHERE</p>
              <p>LIGHT IS BORN</p>
              <p>EMPTINESS</p>
              <p>CREATES SPACE</p>
              <p>FOR HEALING</p>
            </div>
            <div className="flex flex-col gap-[0.15rem] font-mono text-[12px] uppercase text-right max-w-[40%]">
              <p>CREATIVITY FLOWS THROUGH</p>
              <p>INFINITE PATHWAYS</p>
              <p>CONSCIOUSNESS EXPANDS</p>
              <p>INTO BOUNDLESS REALMS</p>
              <p>OF LIGHT AND POSSIBILITY</p>
              <p>WHERE HEALING BECOMES ART</p>
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.7em] text-[rgba(245,245,245,0.6)] mb-4">
            <p>
              Sound Design & Music by{" "}
              <a
                href="https://open.spotify.com/artist/6YXgRMajnjib8j6Cxzcryp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgba(245,245,245,0.9)] no-underline hover:opacity-70 transition-opacity"
              >
                @LXSTNGHT
              </a>
            </p>
          </div>
        </div>
        <div className="w-full">
          <img
            className="w-full h-auto"
            src="https://assets.codepen.io/7558/arrival-text.svg"
            alt=""
          />
        </div>
      </footer>

      {/* Audio elements */}
      <audio ref={startClickSoundRef} preload="auto">
        <source
          src="https://assets.codepen.io/7558/preloader-2s-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={preloaderSoundRef} preload="auto">
        <source
          src="https://assets.codepen.io/7558/preloader-5s-001.mp3"
          type="audio/mpeg"
        />
      </audio>
      <audio ref={backgroundMusicRef} loop preload="auto">
        <source
          src="https://assets.codepen.io/7558/lxstnght-night-angel.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}
