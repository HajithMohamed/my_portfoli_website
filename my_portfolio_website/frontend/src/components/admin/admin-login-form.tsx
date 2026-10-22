"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminFetch } from "@/lib/api";
import { excludeSelfFromAnalytics } from "@/lib/analytics";

function loginErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message.trim() : "";
  if (!raw) {
    return "Authentication failed. Check your email and password.";
  }
  try {
    const body = JSON.parse(raw) as { message?: string | string[] };
    const message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    return message || "Authentication failed. Check your email and password.";
  } catch {
    return raw;
  }
}

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();

    try {
      await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      excludeSelfFromAnalytics();
      // Full reload so server components in AdminLayout pick up the newly set HTTP-only cookie
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(loginErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono text-xs uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-violet-400" />
            <span>HZ LABS // STUDIO CONTROL</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight pt-2">
            Admin Authentication
          </h1>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            Sign in to access portfolio CMS, intake requests, GitHub sync, and studio settings.
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>Admin Email</span>
            </label>
            <Input
              name="email"
              type="email"
              placeholder="e.g. hanoufaatif@gmail.com"
              defaultValue="hanoufaatif@gmail.com"
              autoComplete="email"
              required
              autoFocus
              className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Password</span>
            </label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••••••"
              defaultValue="HAzi@1915"
              autoComplete="current-password"
              required
              className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-xs font-mono text-red-200">
              {error}
            </div>
          )}

          <Button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02]"
          >
            <span>{loading ? "Authenticating Session…" : "Enter Control Center"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Public Portfolio</span>
          </Link>
          <span className="text-[11px] text-slate-600">v0.1.0-studio</span>
        </div>

      </div>
    </div>
  );
}
