"use client";

import { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050816] px-4 text-center text-slate-50">
      <p className="font-display text-6xl font-bold text-white/10">500</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        An unexpected error occurred while rendering this page. You can try again or head back home.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          onClick={reset}
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <a
          className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5"
          href="/"
        >
          <Home className="h-4 w-4" />
          Home
        </a>
      </div>
    </div>
  );
}
