"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  ["Dashboard", "/_internal/dashboard"],
  ["Analytics", "/_internal/analytics"],
  ["Profile", "/_internal/profile"],
  ["Projects", "/_internal/projects"],
  ["Blog", "/_internal/blog"],
  ["Skills", "/_internal/skills"],
  ["Photos", "/_internal/media"],
  ["Testimonials", "/_internal/testimonials"],
  ["Credentials", "/_internal/credentials"],
  ["Resume", "/_internal/resume"],
  ["Messages", "/_internal/messages"],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    try {
      await adminFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if the network call fails, drop the user back to the public site.
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-slate-950/85 p-5 lg:block">
        <Link className="font-display text-xl font-semibold" href="/">
          HZ Labs
        </Link>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-500">Control Center</p>
        <nav className="mt-10 grid gap-2">
          {nav.map(([label, href]) => (
            <Link
              className={cn(
                "rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white",
                pathname === href && "bg-white/10 text-white",
              )}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink className="h-4 w-4" />
          View public site
        </Link>
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
