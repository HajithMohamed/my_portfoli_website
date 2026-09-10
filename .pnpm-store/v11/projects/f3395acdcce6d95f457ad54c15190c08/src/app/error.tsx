"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="hud-panel corner-brackets max-w-md p-8 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-signal-red">System fault</div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
          Runtime exception
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Non-critical subsystem crashed. Restart the module or return to base.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            type="button"
            className="border border-cyan/40 bg-cyan/10 px-4 py-2 text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan/20"
          >
            {"> retry"}
          </button>
          <a
            href="/"
            className="border border-border bg-transparent px-4 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-surface"
          >
            {"> return home"}
          </a>
        </div>
      </div>
    </div>
  );
}
