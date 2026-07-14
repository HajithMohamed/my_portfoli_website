"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// A fallback smooth scroller since Lenis isn't installed.
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // We just ensure native smooth scrolling is set on html
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, [pathname]);

  return <>{children}</>;
}
