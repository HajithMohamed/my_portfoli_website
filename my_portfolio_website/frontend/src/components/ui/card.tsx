import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 transition-all duration-300 hover:border-white/20 hover:shadow-blue-950/20",
        className
      )}
      {...props}
    />
  );
}
