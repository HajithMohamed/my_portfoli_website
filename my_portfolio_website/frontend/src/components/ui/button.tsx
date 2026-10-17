import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:pointer-events-none disabled:opacity-50 overflow-hidden group active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:brightness-110 border border-violet-400/30",
        secondary:
          "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md",
        outline:
          "border border-cyan/40 bg-cyan/5 text-cyan hover:bg-cyan/15 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
        copper:
          "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
        dark: "bg-slate-950 text-white border border-white/10 hover:bg-slate-900 hover:border-white/20",
      },
      size: {
        sm: "min-h-9 px-3.5 text-xs py-1.5",
        md: "min-h-11 px-5 py-2.5 text-sm",
        lg: "min-h-12 px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
      <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0 rounded-md" />
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

export function ButtonLink({ className, variant, size, href, children, ...props }: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a className={classes} href={href} rel="noreferrer" target={href.startsWith("http") ? "_blank" : undefined} {...props}>
        {children}
        <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0 rounded-md" />
      </a>
    );
  }
  return (
    <Link className={classes} href={href} {...props}>
      {children}
      <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0 rounded-md" />
    </Link>
  );
}
