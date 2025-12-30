"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Observer);
}

export { gsap, ScrollTrigger, Observer };

export const EASING = {
  cameraMove: "power2.out",
  sectionTransition: "expo.inOut",
  fadeScale: "power3.inOut",
  scrub: "none",
} as const;

export const SCROLL_CONFIG = {
  scrub: 1,
  anticipatePin: 1,
} as const;
