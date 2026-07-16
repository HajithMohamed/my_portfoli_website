import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="hud-panel corner-brackets max-w-md p-8 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan">Signal lost</div>
        <h1 className="mt-4 font-display text-6xl font-bold text-foreground text-glow">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Coordinates not found in this sector.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-cyan/40 bg-cyan/10 px-4 py-2 text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan/20"
          >
            {"> return to base"}
          </Link>
        </div>
      </div>
    </div>
  );
}
