import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-white/10 bg-white/5 text-slate-200 backdrop-blur-md",
        violet:
          "border border-violet-500/30 bg-violet-500/10 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
        cyan:
          "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
        copper:
          "border border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
        success:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

