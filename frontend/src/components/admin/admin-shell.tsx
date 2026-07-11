"use client";

import Link from "next/link";
import { ReactNode, useSyncExternalStore } from "react";
import { LogOut, Shield } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

const nav = [
  ["Dashboard", "/admin/dashboard"],
  ["Profile", "/admin/profile"],
  ["Projects", "/admin/projects"],
  ["Blog", "/admin/blog"],
  ["Skills", "/admin/skills"],
  ["Resume", "/admin/resume"],
  ["Messages", "/admin/messages"],
];

export function useAdminToken() {
  return useSyncExternalStore(subscribeToAuth, getTokenSnapshot, () => null);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const token = useAdminToken();

  function logout() {
    localStorage.removeItem("hz_access_token");
    localStorage.removeItem("hz_refresh_token");
    notifyAuthChanged();
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-slate-50">
        <div className="max-w-md rounded-lg border border-white/10 bg-slate-950/80 p-8 text-center">
          <Shield className="mx-auto h-8 w-8 text-blue-300" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Admin session required</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Sign in with the env-seeded admin account to manage HZ Labs content.</p>
          <ButtonLink className="mt-6" href="/admin/login">
            Login
          </ButtonLink>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-slate-950/85 p-5 lg:block">
        <Link className="font-display text-xl font-semibold" href="/">
          HZ Labs
        </Link>
        <nav className="mt-10 grid gap-2">
          {nav.map(([label, href]) => (
            <Link className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Button className="absolute bottom-5 left-5 right-5" onClick={logout} variant="secondary">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/85 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Link className="font-display font-semibold" href="/">
              HZ Labs
            </Link>
            <Button onClick={logout} size="sm" variant="secondary">
              Logout
            </Button>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto text-sm">
            {nav.map(([label, href]) => (
              <Link className="rounded-md bg-white/5 px-3 py-2 text-slate-300" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event("hz-auth-change"));
}

function getTokenSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("hz_access_token");
}

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hz-auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hz-auth-change", callback);
  };
}
