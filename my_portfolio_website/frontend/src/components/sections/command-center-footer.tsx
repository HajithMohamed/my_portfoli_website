"use client";

import { useEffect, useRef } from "react";
import { Github, MapPin, Mail, Clock, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

function LiveClock() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tick = () => {
      if (ref.current) {
        ref.current.textContent = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span ref={ref} className="font-mono text-green-400 text-sm" />;
}

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const techs = [
      "React", "Next.js", "NestJS", "PostgreSQL",
      "TypeScript", "Prisma", "Docker", "Git",
    ];

    type Star = { x: number; y: number; label: string; twinkle: number; twinkleSpeed: number };

    const stars: Star[] = techs.map((t) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      label: t,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.02,
    }));

    let frame = 0;
    let animId: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 180) continue;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${0.12 * (1 - dist / 180)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw stars + labels
      stars.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const alpha = 0.5 + 0.5 * Math.sin(s.twinkle);

        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${alpha})`;
        ctx.fill();

        ctx.fillStyle = `rgba(148,163,184,${alpha * 0.7})`;
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(s.label, s.x, s.y - 9);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />;
}

export function CommandCenterFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="relative border-t border-white/10 bg-[#050816] overflow-hidden">
      <ConstellationCanvas />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl font-semibold text-white mb-3">HZ Labs</div>
            <p className="text-sm text-slate-400 leading-6 max-w-xs mb-6">
              Building digital products, platforms, and scalable systems. Available for internships and software engineering roles.
            </p>
            <div className="flex gap-3">
              {profile.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-200"
                  title={link.label}
                >
                  {link.label === "GitHub" && <Github className="h-4 w-4" />}
                  {link.label === "Email" && <Mail className="h-4 w-4" />}
                  {link.label !== "GitHub" && link.label !== "Email" && (
                    <span className="text-xs font-bold">{link.label[0]}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Status Panel */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-slate-300">Available for opportunities</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-blue-300 flex-shrink-0" />
                {profile.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-blue-300 flex-shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                  {profile.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock className="h-4 w-4 text-blue-300 flex-shrink-0" />
                <LiveClock />
                <span className="text-xs text-slate-600">LK</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Navigation</p>
            <div className="space-y-2">
              {["Home", "Projects", "Technologies", "Blog", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-150 group"
                >
                  <span className="h-px w-4 bg-slate-700 group-hover:bg-blue-400 group-hover:w-6 transition-all duration-200" />
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <ButtonLink href="#contact" size="sm" className="w-full">
                <Zap className="h-3.5 w-3.5" />
                Get in Touch
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} HZ Labs · Mohamed Hajith</span>
          <span className="flex items-center gap-1.5">
            Built with Next.js, NestJS &amp; Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
