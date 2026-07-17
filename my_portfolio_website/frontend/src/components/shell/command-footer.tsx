"use client";

import type { Profile } from "@/lib/types";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const VERSION = "v4.0.0";

export function CommandFooter({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  const github = profile.socialLinks?.find((l) => l.url.includes("github.com"));
  const linkedin = profile.socialLinks?.find((l) => l.url.includes("linkedin.com"));
  
  const githubHandle = github
    ? github.url.replace(/\/$/, "").split("/").pop()
    : "HajithMohamed";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 mt-32 overflow-hidden bg-background">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-violet/50 to-transparent blur-[2px]" />
      
      {/* Subtle scanline background */}
      <div className="absolute inset-0 bg-scanlines opacity-50 pointer-events-none" />

      <div className="relative container-responsive section-gap font-mono text-xs">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="h-[1px] w-4 bg-cyan/50" />
              System
            </div>
            <div className="text-foreground font-semibold">HZ-LABS — {VERSION}</div>
            <div className="mt-2 text-muted-foreground leading-relaxed">next.js · nestjs · postgres</div>
          </div>
          
          <div>
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="h-[1px] w-4 bg-cyan/50" />
              Operator
            </div>
            <div className="text-foreground font-semibold">{profile.name}</div>
            <div className="mt-2 text-muted-foreground">{profile.location}</div>
          </div>
          
          <div>
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="h-[1px] w-4 bg-cyan/50" />
              Comms
            </div>
            <a href={`mailto:${profile.email}`} className="text-foreground transition-colors hover:text-cyan font-semibold block">
              {profile.email}
            </a>
            <div className="mt-2 text-muted-foreground">github.com/{githubHandle}</div>
          </div>
          
          <div>
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="h-[1px] w-4 bg-cyan/50" />
              Diagnostics
            </div>
            <div className="text-foreground font-semibold">region: ap-south-1</div>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-50"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green"></span>
              </span>
              systems nominal
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-cyan/15 pt-8 text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-foreground/50">
              © {year} {profile.name}.
            </span>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {github && (
              <a href={github.url} target="_blank" rel="noreferrer" className="flex items-center justify-center text-muted-foreground transition-colors hover:text-cyan hover:text-glow touch-target" aria-label="GitHub">
                <Github size={18} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin.url} target="_blank" rel="noreferrer" className="flex items-center justify-center text-muted-foreground transition-colors hover:text-cyan hover:text-glow touch-target" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            <a href={`mailto:${profile.email}`} className="flex items-center justify-center text-muted-foreground transition-colors hover:text-cyan hover:text-glow touch-target" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0">
            <div className="text-[9px] uppercase tracking-[0.4em] text-cyan/50">
              — end of transmission —
            </div>
            
            <button 
              onClick={scrollToTop}
              className="group flex touch-target items-center justify-center rounded-md border border-cyan/20 bg-surface-2/50 transition-all hover:border-cyan/50 hover:bg-surface-2 hover:text-cyan hover:shadow-[0_0_15px_rgba(92,208,255,0.15)]"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} className="opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
