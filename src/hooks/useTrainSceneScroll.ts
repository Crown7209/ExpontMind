import { useEffect, useRef, useState } from "react";

export function useTrainSceneScroll() {
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
