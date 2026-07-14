"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";

export function FloatingNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 100) {
      setIsAtTop(false);
    } else {
      setIsAtTop(true);
    }

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isAtTop ? "bg-transparent py-6" : "bg-[#050816]/70 backdrop-blur-xl border-b border-white/10 py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="font-display text-lg font-semibold tracking-normal text-white" href="#">
          HZ Labs
        </a>
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {["Home", "Projects", "Technologies", "Blog", "About", "Contact"].map((item) => (
            <a className="transition hover:text-white relative group" href={`#${item.toLowerCase()}`} key={item}>
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <ButtonLink href="#contact" size="sm" variant="secondary" className="backdrop-blur-md bg-white/5">
          Let&apos;s Talk
        </ButtonLink>
      </nav>
    </motion.header>
  );
}
