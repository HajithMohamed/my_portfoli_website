"use client";

import { useEffect } from "react";

// A fallback smooth scroller since Lenis isn't installed.
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // We just ensure native smooth scrolling is set on html
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return <>{children}</>;
}
