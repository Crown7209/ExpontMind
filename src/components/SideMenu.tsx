"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { title: "Projects", href: "/" },
  { title: "Agency", href: "/" },
  { title: "Expertise", href: "/" },
  { title: "Careers", href: "/" },
  { title: "Contact", href: "/" },
];

const footerLinks = [
  { title: "Facebook", href: "/" },
  { title: "LinkedIn", href: "/" },
  { title: "Instagram", href: "/" },
  { title: "Twitter", href: "/" },
];

const menuVariants = {
  open: {
    width: "480px",
    height: "650px",
    top: "-25px",
    right: "-25px",
    transition: {
      duration: 0.75,
      type: "tween" as const,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: "tween" as const,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

const perspective = {
  initial: {
    opacity: 0,
    rotateX: 90,
    translateY: 80,
    translateX: -20,
  },
  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    translateX: 0,
    transition: {
      duration: 0.65,
      delay: 0.5 + i * 0.1,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
      opacity: { duration: 0.35 },
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.75,
      type: "tween" as const,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

const slideIn = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.75 + i * 0.1,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      type: "tween" as const,
      ease: "easeInOut" as const,
    },
  },
};

function PerspectiveText({ label }: { label: string }) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full transform-3d transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:transform-[rotateX(90deg)]">
      <p className="m-0 uppercase pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-hover:opacity-0 text-black">
        {label}
      </p>
      <p className="m-0 uppercase pointer-events-none absolute origin-bottom transform-[rotateX(-90deg)_translateY(9px)] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:opacity-100 text-white">
        {label}
      </p>
    </div>
  );
}

function MenuButton({
  isActive,
  toggleMenu,
}: {
  isActive: boolean;
  toggleMenu: () => void;
}) {
  return (
    <div className="absolute top-0 right-0 w-[100px] h-[40px] cursor-pointer rounded-[25px] overflow-hidden">
      <motion.div
        className="relative w-full h-full"
        animate={{ top: isActive ? "-100%" : "0%" }}
        transition={{
          duration: 0.5,
          type: "tween" as const,
          ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
        }}
      >
        <div
          className="group w-full h-full bg-white flex items-center justify-center"
          onClick={toggleMenu}
        >
          <PerspectiveText label="Menu" />
        </div>
        <div
          className="group w-full h-full bg-black flex items-center justify-center text-white"
          onClick={toggleMenu}
        >
          <PerspectiveText label="Close" />
        </div>
      </motion.div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex flex-col justify-between px-10 pt-[100px] pb-[50px] h-full box-border">
      <div className="flex flex-col gap-[10px]">
        {links.map((link, i) => (
          <div
            key={`b_${i}`}
            className="perspective-[120px] perspective-origin-bottom"
          >
            <motion.div
              custom={i}
              variants={perspective}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <a
                href={link.href}
                className="text-black no-underline text-[46px]"
              >
                {link.title}
              </a>
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div className="flex flex-wrap">
        {footerLinks.map((link, i) => (
          <motion.a
            href={link.href}
            variants={slideIn}
            custom={i}
            initial="initial"
            animate="enter"
            exit="exit"
            key={`f_${i}`}
            className="w-1/2 mt-[5px] no-underline text-black"
          >
            {link.title}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

export default function SideMenu() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="fixed right-[50px] top-[50px] z-100">
      <motion.div
        className="bg-white rounded-[25px] relative"
        variants={menuVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
        <AnimatePresence>{isActive && <Nav />}</AnimatePresence>
      </motion.div>
      <MenuButton
        isActive={isActive}
        toggleMenu={() => setIsActive(!isActive)}
      />
    </div>
  );
}
