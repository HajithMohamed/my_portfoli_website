"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PERSONAL_IDENTITY } from "@/lib/identity";

import { ThemeToggle } from "@/components/theme/theme-toggle";

const nav = [
  ["Dashboard", "/admin/dashboard"],
  ["Analytics", "/admin/analytics"],
  ["Profile", "/admin/profile"],
  ["Projects", "/admin/projects"],
  ["Blog", "/admin/blog"],
  ["Skills", "/admin/skills"],
  ["Photos", "/admin/media"],
  ["Testimonials", "/admin/testimonials"],
  ["Credentials", "/admin/credentials"],
  ["Resume", "/admin/resume"],
  ["Messages", "/admin/messages"],
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface/90 p-5 lg:block backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <Link className="font-display text-xl font-semibold text-foreground hover:text-cyan transition-colors" href="/">
              {PERSONAL_IDENTITY.name}
            </Link>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Control Center</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/60">
          <ThemeToggle className="w-full justify-between" />
        </div>

        <nav className="mt-6 grid gap-1.5">
          {nav.map(([label, href]) => (
            <Link
              className={cn(
                "rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground",
                pathname === href && "bg-cyan/15 text-cyan font-medium border border-cyan/25",
              )}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
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

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Link className="font-display font-semibold text-foreground" href="/">
              {PERSONAL_IDENTITY.name}
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={logout} size="sm" variant="secondary">
                Logout
              </Button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm">
            {nav.map(([label, href]) => (
              <Link
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-xs text-muted-foreground",
                  pathname === href ? "bg-cyan/15 text-cyan border border-cyan/30" : "bg-surface-2/60 hover:text-foreground"
                )}
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Desktop Top Header Bar with Theme Toggle */}
        <header className="hidden lg:flex sticky top-0 z-30 h-14 border-b border-border/80 bg-surface/50 backdrop-blur-md px-8 items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-signal-green animate-pulse-dot" />
            <span>sys.admin // authenticated</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-cyan transition-colors"
              href="/"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>public site</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
