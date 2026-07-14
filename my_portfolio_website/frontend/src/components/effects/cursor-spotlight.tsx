"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CursorSpotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn("relative", className)}
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 cursor-spotlight" />
      {children}
    </div>
  );
}
