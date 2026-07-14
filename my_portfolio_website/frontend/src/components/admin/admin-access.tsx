"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminFetch } from "@/lib/api";
import { excludeSelfFromAnalytics } from "@/lib/analytics";

/**
 * Invisible on the public site. Pressing Ctrl+Shift+A anywhere opens a discreet
 * authentication modal; a successful login sets the HTTP-only session cookie and
 * routes to the hidden control center. There is no visible link to any of this.
 */
export function AdminAccess() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && (event.code === "KeyA" || event.key.toLowerCase() === "a")) {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) {
    return null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      excludeSelfFromAnalytics();
      setOpen(false);
      router.push("/_internal/dashboard");
      router.refresh();
    } catch {
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Restricted access"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-300" />
            <span className="text-sm font-semibold text-white">Restricted access</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 transition-colors hover:text-white"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="mt-5 grid gap-3" onSubmit={submit}>
          <Input name="email" type="email" placeholder="Email" autoComplete="off" required autoFocus />
          <Input name="password" type="password" placeholder="Password" autoComplete="off" required />
          <Button disabled={loading} type="submit">
            {loading ? "Verifying…" : "Authenticate"}
          </Button>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
