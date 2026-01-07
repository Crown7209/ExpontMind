"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRepetitionProps {
  text: string;
  totalWords?: number;
  tyIncrement?: number;
  delayIncrement?: number;
  className?: string;
  fontSize?: string;
}

export default function TextRepetition({
  text,
  totalWords = 9,
  tyIncrement = 12,
  delayIncrement = 0.1,
  className = "",
  fontSize = "13.7vw",
}: TextRepetitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const halfWordsCount = Math.floor(totalWords / 2);

    // Get all span elements except the last one
    const words = Array.from(el.querySelectorAll("span")).slice(
      0,
      -1
    ) as HTMLSpanElement[];
    wordsRef.current = words;

    // Set boundaries (margin and padding)
    const setBoundaries = () => {
      const computedStyle = getComputedStyle(el);
      let elementHeight = el.clientHeight;
      elementHeight -=
        parseFloat(computedStyle.paddingTop) +
        parseFloat(computedStyle.paddingBottom);

      const paddingBottomMarginTop =
        (elementHeight * halfWordsCount * tyIncrement) / 100;
      gsap.set(el, {
        marginTop: paddingBottomMarginTop,
        paddingBottom: paddingBottomMarginTop,
      });
    };

    setBoundaries();

    // Create scroll timeline
    scrollTimelineRef.current = gsap
      .timeline({ paused: true })
      .to(words, {
        duration: 1,
        ease: "power1",
        yPercent: (_, target) => target.dataset.ty,
        delay: (_, target) => parseFloat(target.dataset.delay || "0"),
      });

    // Progress tween function
    const progressTween = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const elPosition = scrollPosition - el.offsetTop;
      const durationDistance = window.innerHeight + el.offsetHeight;
      const currentProgress = elPosition / durationDistance;
      scrollTimelineRef.current?.progress(currentProgress);
    };

    // Create observer
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entry) => {
      if (entry[0].intersectionRatio > 0) {
        if (!isLoadedRef.current) {
          isLoadedRef.current = true;
        }
        gsap.ticker.add(progressTween);
      } else {
        if (isLoadedRef.current) {
          gsap.ticker.remove(progressTween);
        } else {
          isLoadedRef.current = true;
          gsap.ticker.add(progressTween);
          gsap.ticker.remove(progressTween);
        }
      }
    }, observerOptions);

    observerRef.current.observe(el);

    const handleResize = () => setBoundaries();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observerRef.current?.disconnect();
      gsap.ticker.remove(progressTween);
      scrollTimelineRef.current?.kill();
    };
  }, [totalWords, tyIncrement, delayIncrement]);

  // Generate spans with data attributes
  const halfWordsCount = Math.floor(totalWords / 2);
  const spans = [];

  for (let i = 0; i < totalWords; i++) {
    let ty: number;
    let delay: number;

    if (i === totalWords - 1) {
      ty = 0;
      delay = 0;
    } else if (i < halfWordsCount) {
      ty = halfWordsCount * tyIncrement - tyIncrement * i;
      delay = delayIncrement * (halfWordsCount - i) - delayIncrement;
    } else {
      ty =
        -1 *
        (halfWordsCount * tyIncrement - (i - halfWordsCount) * tyIncrement);
      delay =
        delayIncrement * (halfWordsCount - (i - halfWordsCount)) -
        delayIncrement;
    }

    spans.push(
      <span
        key={i}
        data-delay={delay}
        data-ty={ty}
        style={{
          gridArea: "1 / 1 / 2 / 2",
          lineHeight: 0.745,
          willChange: "transform",
          color: i === totalWords - 1 ? "#fff" : "rgba(255,255,255,0.15)",
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`text-rep grid font-medium uppercase leading-[0.8] cursor-default select-none ${className}`}
      style={{
        fontSize,
      }}
    >
      {spans}
    </div>
  );
}
