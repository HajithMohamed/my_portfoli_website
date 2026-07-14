"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function RevealAnimation({
  children,
  className,
  delay = 0,
  variant = "slide-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "slide-up" | "fade" | "scale";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    "slide-up": { y: 30, opacity: 0 },
    "fade": { opacity: 0 },
    "scale": { scale: 0.9, opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[variant]}
      animate={isInView ? { y: 0, opacity: 1, scale: 1 } : variants[variant]}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
