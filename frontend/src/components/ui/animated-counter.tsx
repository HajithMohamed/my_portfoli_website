"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const springValue = useSpring(0, {
    bounce: 0,
    duration: 2000,
  });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, springValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={ref} className={cn(className)} />;
}
