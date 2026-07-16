"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  ["home", "/"],
  ["projects", "/projects"],
  ["about", "/about"],
  ["signal", "/blog"],
  ["comms", "/#comms"],
] as const;

const VERSION = "v4.0.0";

function useClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Colombo",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function TopBar({ location = "Colombo, LK" }: { location?: string }) {
  const pathname = usePathname();
  const clock = useClock();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan/15 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 font-mono">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
          <span className="font-semibold tracking-widest text-foreground">HZ LABS</span>
          <span className="text-muted-foreground">/ {VERSION}</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-[11px] uppercase tracking-[0.2em]">
          {NAV.map(([label, href]) => {
            const active =
              href === "/"
                ? pathname === "/"
                : href.startsWith("/#")
                  ? false
                  : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 text-muted-foreground transition-colors hover:text-cyan",
                  active && "bg-surface-2 text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span>{location}</span>
          <span className="font-semibold tabular-nums text-foreground">
            {clock ? `${clock} LK` : "--:--:-- LK"}
          </span>
        </div>
      </div>
    </header>
  );
}
