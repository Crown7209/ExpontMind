"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import IceTrails from "@/components/IceTrails";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@/components/Scene";
import VideoProjection from "@/components/VideoProjection";
import { Logo } from "@/components/Logo";
import { Environment } from "@react-three/drei";
import Ascii from "@/components/Ascii";
import NoiseOverlay from "@/components/NoiseOverlay";
import { Header } from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import TrainScene from "@/components/TrainScene";
import { Partners } from "@/components/Partners";
import ScrollTrailText from "@/components/ScrollTrailText";
import { About } from "@/components/About";
import { CardStack } from "@/components/CardStack";

function useTextVisibility(
  textItemRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Text section fades out as Work section enters
      const fadeStart = windowHeight * 4.0;
      const fadeEnd = windowHeight * 4.5;

      let opacity = 1;
      if (scrollY < fadeStart) {
        opacity = 1;
      } else if (scrollY >= fadeEnd) {
        opacity = 0;
      } else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        opacity = 1 - progress;
      }

      // Direct DOM manipulation - no re-render
      if (textItemRef.current) {
        textItemRef.current.style.opacity = String(opacity);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [textItemRef]);
}

function useTrainSceneScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = containerRef.current.offsetHeight - windowHeight;

      // Container дээд хэсэг viewport-н дээд хэсэгт хүрэхэд scroll эхэлнэ
      if (rect.top >= 0) {
        setScrollProgress(0);
      } else if (rect.top <= -containerHeight) {
        setScrollProgress(1);
      } else {
        const progress = -rect.top / containerHeight;
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollProgress, containerRef };
}

export default function Home() {
  const textItemRef = useRef<HTMLDivElement>(null);
  useTextVisibility(textItemRef);
  const { scrollProgress, containerRef } = useTrainSceneScroll();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Select single elements - use querySelector instead of querySelectorAll
    const workItem = document.querySelector('[data-work="item"]');
    const ghostItem = document.querySelector(".ghost_work-item");
    const workImage = document.querySelector('[data-work="image"]');

    const textItem = document.querySelector(".text_item");
    const ghostTextItem = document.querySelector(".ghost_text-item");

    if (!workItem || !ghostItem || !workImage || !textItem || !ghostTextItem)
      return;

    // Initial setup
    gsap.set(workItem, {
      position: "fixed",
      top: "0",
      clipPath: "inset(100% 0 0% 0)",
      zIndex: 10,
    });

    // Set initial image scale
    gsap.set(workImage, {
      scale: 1.4,
      yPercent: 0,
    });

    // Text Section Setup
    gsap.set(textItem, {
      position: "fixed",
      top: "0",
      clipPath: "inset(100% 0 0% 0)",
      zIndex: 5, // Between hero and work
    });

    // Text Section Animation
    const stText = {
      trigger: ghostTextItem,
      scrub: true,
      start: "top bottom",
      end: "+75vh top",
    };

    gsap.to(textItem, {
      clipPath: "inset(0% 0 0 0)",
      scrollTrigger: stText,
    });

    // Main reveal animations
    const stStarting = {
      trigger: ghostItem,
      scrub: true,
      start: "top bottom",
      end: "+75vh top",
    };

    gsap.to(workItem, {
      clipPath: "inset(0% 0 0 0)",
      scrollTrigger: stStarting,
    });

    gsap.to(workImage, {
      yPercent: 0,
      scale: 1.2,
      scrollTrigger: stStarting,
    });

    // Final animations
    const stFinal = {
      trigger: ghostItem,
      scrub: true,
      start: "105% bottom",
      toggleActions: "play reverse play reverse" as const,
    };

    gsap.to(workItem, {
      scrollTrigger: stFinal,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#0f0a0a]">
      <NoiseOverlay opacity={0.05} zIndex={1000} />

      <div
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <IceTrails style={{ zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <VideoProjection />
        </div>
      </div>
      <Header />

      {/* Hero Section */}
      <section className="relative">
        <div className="ghost_hero-item h-[320vh]" />
        <div className="fixed inset-0 w-full h-full flex justify-between items-end pointer-events-none z-0">
          <div className="relative flex-1 flex flex-col px-[5vw] py-[1vh]">
            <div className="relative w-full text-center">
              {/* Spacer for layout dimensions */}
              <div className="opacity-0 text-[13.4vw] leading-[0.7] font-medium uppercase text-center select-none pointer-events-none">
                Expont Mind
              </div>

              {/* Actual Component Overlay - Absolute to match spacer position */}
              <div className="absolute inset-0 top-0 left-0 w-full h-full flex items-center justify-center">
                <ScrollTrailText />
              </div>
            </div>

            <p className="text-white uppercase font-normal text-[2vw] text-end mt-4">
              Solutions
            </p>
          </div>
        </div>
      </section>

      {/* Text Section (Ghost Spacer Style) */}
      <section className="relative">
        <div className="ghost_text-item h-screen" />
        <div
          ref={textItemRef}
          className="text_item fixed inset-0 z-5 bg-black flex flex-col justify-center items-center text-center pointer-events-none"
          style={{ transition: "opacity 0.1s linear" }}
        >
          <div className="absolute inset-0 w-full h-full z-0">
            <Canvas
              className="w-full h-full"
              camera={{ position: [0, 0, 5], fov: 45 }}
            >
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
              />
              <Environment preset="city" />
              <Logo />
            </Canvas>
          </div>
          <h2 className="relative z-10 text-4xl md:text-6xl font-medium tracking-tight uppercase text-white">
            Crafting Digital <br />
            <span className="text-stone-400">Experiences</span>
          </h2>
        </div>
      </section>
      {/* Work Section */}
      <section data-work="section" className="relative">
        <div className="work_container">
          <div
            className="work_item bg-black flex items-stretch w-full h-screen relative overflow-hidden"
            data-work="item"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-screen" data-work="image">
              <Scene startVP={4} endVP={8.5} />
            </div>

            <div className="relative w-full flex flex-col justify-around items-stretch p-[2vw_4vw]">
              <div className="relative w-full flex justify-between items-end pt-[4vw]">
                {/* <div className="flex flex-col uppercase text-[8vw] font-medium leading-none">
                  <div className="overflow-hidden">
                    <div className="line">NATURE</div>
                  </div>
                  <div className="overflow-hidden">
                    <div className="line">
                      <span className="text-[#ffd9b3]">SAVED </span>
                      YOU
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Ghost Items for Scroll Tracking */}
        <div className="ghost_work-container">
          <div className="ghost_work-item w-full" style={{ height: "400vh" }} />
        </div>
      </section>

      <Partners />

      {/* <CardStack /> */}

      <div
        ref={containerRef}
        className="relative w-full h-[400vh] z-10 bg-black"
      >
        <p className="text-4xl md:text-6xl lg:text-7xl font-normal text-white tracking-wide uppercase px-24">
          Featured projects
        </p>
        <TrainScene usePageScroll scrollProgress={scrollProgress} />
      </div>

      <section className="ascii_section relative h-[250vh]">
        <div className="sticky top-0 h-screen w-full" style={{ zIndex: 50 }}>
          <Ascii />
        </div>
      </section>

      <Footer />
    </div>
  );
}
