import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#0c101c]/75 p-6 backdrop-blur-xl shadow-2xl shadow-black/40 transition-all duration-300 hover:border-white/[0.18] hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]",
        className
      )}
      {...props}
    />
  );
}

