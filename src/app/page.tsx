"use client";

import { useRef } from "react";
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
import { useLoading } from "@/context/LoadingContext";
import { useTextVisibility } from "@/hooks/useTextVisibility";
import { useTrainSceneScroll } from "@/hooks/useTrainSceneScroll";
import { useDisableScrollOnLoading } from "@/hooks/useDisableScrollOnLoading";
import { useGsapScrollAnimations } from "@/hooks/useGsapScrollAnimations";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function Home() {
  const textItemRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useLoading();
  const { scrollProgress, containerRef } = useTrainSceneScroll();

  useTextVisibility(textItemRef);
  useDisableScrollOnLoading(isLoading);
  useGsapScrollAnimations();

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
        <div className="h-[32vh] flex items-center justify-center">
          <TextHoverEffect text="PROJECTS" />
        </div>
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
