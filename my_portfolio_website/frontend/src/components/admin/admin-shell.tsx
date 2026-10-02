"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  Cpu,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  Inbox,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface NavGroup {
  label: string;
  items: Array<{
    label: string;
    href: string;
    icon: typeof FolderGit2;
    badge?: string;
  }>;
}

const navGroups: NavGroup[] = [
  {
    label: "Operations & Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Visitor Analytics", href: "/admin/analytics", icon: LineChart },
    ],
  },
  {
    label: "Portfolio & Content",
    items: [
      { label: "Projects Studio", href: "/admin/projects", icon: FolderGit2 },
      { label: "Skills & Tech", href: "/admin/skills", icon: Cpu },
      { label: "Certificates", href: "/admin/credentials", icon: ShieldCheck },
      { label: "Profile Identity", href: "/admin/profile", icon: UserCheck },
      { label: "Resume Assets", href: "/admin/resume", icon: FileText },
      { label: "Blog Markdown", href: "/admin/blog", icon: BookOpen },
      { label: "Client Testimonials", href: "/admin/testimonials", icon: Award },
    ],
  },
  {
    label: "Communications",
    items: [
      { label: "Messages & Inquiries", href: "/admin/messages", icon: MessageSquare },
      { label: "Project Requests", href: "/admin/requests", icon: Inbox },
    ],
  },
  {
    label: "System & Intelligence",
    items: [
      { label: "GitHub Telemetry", href: "/admin/github", icon: Github, badge: "Live" },
      { label: "Platform Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const mobileBottomNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "GitHub", href: "/admin/github", icon: Github },
  { label: "Skills", href: "/admin/skills", icon: Cpu },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  async function logout() {
    try {
      await adminFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if network call fails, proceed
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface/95 p-5 lg:flex lg:flex-col justify-between backdrop-blur-2xl z-40 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
            <div>
              <Link
                className="font-display text-base font-bold text-foreground hover:text-cyan transition-colors"
                href="/admin/dashboard"
              >
                {PERSONAL_IDENTITY.name}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
                <p className="text-[9px] uppercase tracking-[0.22em] text-cyan/80 font-mono">
                  Command Console
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <ThemeToggle className="w-full justify-between" />
          </div>

          {/* Grouped Navigation */}
          <nav className="mt-4 space-y-4 font-mono text-xs">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 px-3 pb-1">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all",
                        isActive
                          ? "bg-cyan/15 text-cyan font-semibold border border-cyan/30 shadow-[0_0_12px_var(--cyan-glow)]"
                          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className={isActive ? "text-cyan" : "text-muted-foreground/80"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan/20 text-cyan border border-cyan/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border/70 space-y-2 font-mono text-xs">
          <Link
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-cyan"
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
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-xl lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-1.5 rounded-lg border border-border bg-surface-2 text-foreground hover:border-cyan/50"
            >
              <Menu size={18} />
            </button>
            <div>
              <Link className="font-display font-semibold text-foreground text-sm" href="/admin/dashboard">
                {PERSONAL_IDENTITY.name}
              </Link>
              <span className="ml-2 font-mono text-[9px] text-cyan uppercase tracking-wider">
                Admin
              </span>
            </div>
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
        <header className="hidden lg:flex sticky top-0 z-30 h-14 border-b border-border/80 bg-surface/60 backdrop-blur-md px-8 items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-signal-green animate-pulse-dot" />
            <span>sys.admin // operational control center</span>
            <span className="text-border">|</span>
            <span className="text-cyan">{pathname}</span>
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

      {/* Mobile Slide-over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex">
          <div className="w-4/5 max-w-xs bg-surface border-r border-border h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div>
                  <div className="font-display font-bold text-foreground">{PERSONAL_IDENTITY.name}</div>
                  <div className="font-mono text-[9px] text-cyan uppercase tracking-wider">Navigation Menu</div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-4 font-mono text-xs">
                {navGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 px-2 pb-0.5">
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                            isActive
                              ? "bg-cyan/15 text-cyan font-bold border border-cyan/30"
                              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                          )}
                        >
                          <Icon size={14} className={isActive ? "text-cyan" : "text-muted-foreground/80"} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-border space-y-2 font-mono text-xs">
              <Button
                className="w-full justify-start text-xs font-mono"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                }}
                variant="secondary"
              >
                <LogOut className="h-3.5 w-3.5 mr-2 text-signal-red" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Admin Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 border-t border-border backdrop-blur-xl h-16 flex items-center justify-around px-2 lg:hidden"
      >
        {mobileBottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg text-[9px] font-mono transition-colors",
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
