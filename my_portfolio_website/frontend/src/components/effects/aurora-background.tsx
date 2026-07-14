"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function AuroraBackground({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-[#050816] overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Aurora blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Blob 1 - Blue */}
        <div
          className="absolute"
          style={{
            top: "-20%",
            left: "10%",
            width: "60vw",
            height: "60vw",
            maxWidth: 900,
            maxHeight: 900,
            background: "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "auroraMove1 18s ease-in-out infinite alternate",
          }}
        />
        {/* Blob 2 - Violet */}
        <div
          className="absolute"
          style={{
            top: "10%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            maxWidth: 750,
            maxHeight: 750,
            background: "radial-gradient(ellipse at center, rgba(139,92,246,0.14) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "auroraMove2 22s ease-in-out infinite alternate",
          }}
        />
        {/* Blob 3 - Cyan */}
        <div
          className="absolute"
          style={{
            bottom: "-10%",
            left: "30%",
            width: "40vw",
            height: "40vw",
            maxWidth: 600,
            maxHeight: 600,
            background: "radial-gradient(ellipse at center, rgba(6,182,212,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "auroraMove3 25s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Engineering grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none engineering-grid opacity-60"
        style={{
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      <style>{`
        @keyframes auroraMove1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(8%, 12%) scale(1.15); }
        }
        @keyframes auroraMove2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-10%, 8%) scale(1.2); }
        }
        @keyframes auroraMove3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-6%, -10%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
