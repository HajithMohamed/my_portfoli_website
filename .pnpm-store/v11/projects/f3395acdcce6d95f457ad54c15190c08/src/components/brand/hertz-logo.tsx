import { cn } from "@/lib/utils";

type HertzLogoProps = {
  variant?: "nav" | "hero";
  className?: string;
};

export function HertzLogo({ variant = "nav", className }: HertzLogoProps) {
  if (variant === "hero") {
    return (
      <span className={cn("block w-full max-w-[640px]", className)}>
        <img
          src="/brand/hertz-labs-logo.svg"
          alt="Hertz Labs"
          className="h-auto w-full select-none drop-shadow-[0_0_28px_rgba(92,208,255,0.24)]"
          draggable={false}
        />
      </span>
    );
  }

  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      <img
        src="/brand/hertz-labs-mark.svg"
        alt=""
        aria-hidden
        className="h-8 w-11 shrink-0 select-none drop-shadow-[0_0_12px_rgba(92,208,255,0.35)]"
        draggable={false}
      />
      <span className="min-w-0 truncate font-semibold tracking-widest text-foreground group-hover:text-glow">
        HERTZ LABS
      </span>
    </span>
  );
}
