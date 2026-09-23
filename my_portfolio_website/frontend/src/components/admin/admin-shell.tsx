"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import {
  ExternalLink,
  FolderGit2,
  Inbox,
  LineChart,
  LogOut,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const primaryNav = [
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Certificates", href: "/admin/credentials", icon: ShieldCheck },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Project Requests", href: "/admin/requests", icon: Inbox },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
];

const mobileBottomNav = [
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Certs", href: "/admin/credentials", icon: ShieldCheck },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Requests", href: "/admin/requests", icon: Inbox },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    try {
      await adminFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if the network call fails, drop user to public
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface/90 p-5 lg:flex lg:flex-col justify-between backdrop-blur-xl z-40 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <Link
                className="font-display text-lg font-semibold text-foreground hover:text-cyan transition-colors"
                href="/"
              >
                {PERSONAL_IDENTITY.name}
              </Link>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan/70 font-mono">
                Platform Console
              </p>
            </div>
          </div>

          <div className="mt-3">
            <ThemeToggle className="w-full justify-between" />
          </div>

          <nav className="mt-5 space-y-1">
            <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 px-3 pb-1 font-mono">
              Portfolio Management
            </div>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-mono transition-all",
                    isActive
                      ? "bg-cyan/15 text-cyan font-semibold border border-cyan/30 shadow-[0_0_12px_var(--cyan-glow)]"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  )}
                >
                  <Icon size={14} className={isActive ? "text-cyan" : "text-muted-foreground/80"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        <div className="pt-4 border-t border-border/60 space-y-2">
          <Link
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-mono text-muted-foreground transition-colors hover:bg-surface-2 hover:text-cyan"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View public site</span>
          </Link>
          <Button
            className="w-full justify-start text-xs font-mono"
            onClick={logout}
            variant="secondary"
            aria-label="Log out of admin"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col pb-20 lg:pb-8">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-xl lg:hidden flex items-center justify-between">
          <div>
            <Link className="font-display font-semibold text-foreground text-sm" href="/admin/projects">
              {PERSONAL_IDENTITY.name}
            </Link>
            <span className="ml-2 font-mono text-[9px] text-cyan uppercase tracking-wider">
              Control
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              aria-label="View public site"
              className="p-2 rounded-md border border-cyan/20 bg-surface-2 text-cyan"
            >
              <ExternalLink size={14} />
            </Link>
            <button
              onClick={logout}
              aria-label="Logout"
              className="p-2 rounded-md border border-signal-red/30 bg-surface-2 text-signal-red hover:bg-signal-red/10 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex sticky top-0 z-30 h-14 border-b border-border/80 bg-surface/50 backdrop-blur-md px-8 items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-signal-green animate-pulse-dot" />
            <span>sys.admin // operational control center</span>
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

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (5 Items: Projects, Certs, Messages, Requests, Analytics) */}
      <nav
        aria-label="Mobile Admin Navigation"
        className="fixed bottom-0 inset-x-0 z-50 bg-surface/95 border-t border-border backdrop-blur-xl h-16 flex items-center justify-around px-2 lg:hidden"
      >
        {mobileBottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-mono transition-colors",
                isActive ? "text-cyan font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={18} className={isActive ? "text-cyan" : "text-muted-foreground"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
