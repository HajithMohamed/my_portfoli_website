import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-400 hover:shadow-blue-400/40 hover:shadow-xl",
        secondary:
          "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white hover:shadow-inner",
        dark: "bg-slate-950 text-white hover:bg-slate-800 hover:shadow-lg",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        md: "min-h-11 px-4",
        lg: "min-h-12 px-5 text-base",
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
