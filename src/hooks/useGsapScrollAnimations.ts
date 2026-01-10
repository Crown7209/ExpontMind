import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function useGsapScrollAnimations() {
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
}
