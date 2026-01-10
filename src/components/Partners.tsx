"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const partners = {
  row1: ["Google", "Apple", "Microsoft", "Amazon", "Meta"],
  row2: ["Netflix", "Spotify", "Adobe", "Salesforce", "Oracle"],
  row3: ["IBM", "Intel", "Nvidia", "Tesla", "SpaceX"],
};

const LogoItem = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center px-12 py-4 transition-opacity duration-300 cursor-pointer">
    <span className="text-white text-xl md:text-4xl font-light tracking-widest uppercase whitespace-nowrap">
      {name}
    </span>
  </div>
);

const MarqueeRow = ({
  items,
  direction = "left",
  speed = 20,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}) => {
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <LogoItem key={`${item}-${index}`} name={item} />
        ))}
      </motion.div>
    </div>
  );
};

export const Partners = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  return (
    <div className="relative w-full z-10">
      <div className="h-screen w-full bg-linear-to-b from-transparent via-black/50 to-black" />

      <div
        ref={containerRef}
        className="relative z-10 h-screen w-full bg-black py-32"
      >
        <motion.div
          style={{ opacity, y }}
          className="flex flex-col items-center min-h-screen gap-32"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between px-24">
            <p className="text-4xl md:text-6xl lg:text-7xl font-normal text-white tracking-wide uppercase">
              Partners that trust us
            </p>
            <p className="text-white text-sm font-light uppercase text-end ">
              We collaborate with <br /> visionary brands to create <br />
              extraordinary digital experiences.
            </p>
          </div>

          <MarqueeRow items={partners.row1} direction="left" speed={25} />
          <MarqueeRow items={partners.row2} direction="right" speed={30} />
          <MarqueeRow items={partners.row3} direction="left" speed={22} />

          {/* Gradient overlays for fade effect */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};
