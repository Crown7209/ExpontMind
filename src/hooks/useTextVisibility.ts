import { useEffect, RefObject } from "react";

export function useTextVisibility(
  textItemRef: RefObject<HTMLDivElement | null>
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
