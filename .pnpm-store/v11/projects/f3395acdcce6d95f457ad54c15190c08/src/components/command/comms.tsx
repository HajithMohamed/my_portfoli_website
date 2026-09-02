"use client";

import { useState } from "react";
import { Panel } from "@/components/hud/panel";
import { bffUrl } from "@/lib/api";
import { track } from "@/lib/analytics";
import type { Profile } from "@/lib/types";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Github, Link as LinkIcon, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function TerminalField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="group relative mt-4 flex min-h-[44px] items-center gap-3 border-b border-cyan/15 pb-2 transition-colors focus-within:border-cyan">
      <span className="text-cyan/40 transition-colors group-focus-within:text-cyan">▸</span>
      <label htmlFor={`comms-${name}`} className="w-16 shrink-0 text-[10px] uppercase tracking-[0.25em] text-cyan/80 transition-colors group-focus-within:text-cyan group-focus-within:text-glow">
        {label}
      </label>
      <input
        id={`comms-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/40"
      />
    </div>
  );
}

export function Comms({ profile }: { profile: Profile }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", from: "", subject: "", body: "" });

  const githubLink = profile.socialLinks?.find((l) => l.url.includes("github.com"))?.url;
  const githubHandle = githubLink?.replace(/\/$/, "").split("/").pop() ?? "HajithMohamed";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const response = await fetch(bffUrl("/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.from,
          subject: form.subject || "Portfolio inquiry",
          message: form.body,
        }),
      });
      if (response.ok) {
        setState("sent");
        track("contact_submit");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <Panel label="comms.terminal" subtitle="secure channel" live>
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] lg:gap-12">
        
        {/* Contact Info Side */}
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-cyan/10 pb-4">
            <h3 className="font-display text-xl font-bold text-foreground">Initiate Contact</h3>
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Open to new opportunities, technical discussions, and collaborative projects. Use the secure channel to transmit a message directly to my primary inbox.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="group flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan/10 text-cyan border border-cyan/20 transition-colors group-hover:bg-cyan/20 group-hover:text-cyan-glow">
                <Mail size={12} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">direct email</div>
                <a href={`mailto:${profile.email}`} className="text-foreground transition-colors hover:text-cyan mt-1 inline-block">
                  {profile.email}
                </a>
              </div>
            </div>
            
            <div className="group flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan/10 text-cyan border border-cyan/20 transition-colors group-hover:bg-cyan/20 group-hover:text-cyan-glow">
                <MapPin size={12} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">base sector</div>
                <div className="text-foreground mt-1 inline-block">{profile.location}</div>
              </div>
            </div>

            <div className="group flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan/10 text-cyan border border-cyan/20 transition-colors group-hover:bg-cyan/20 group-hover:text-cyan-glow">
                <Github size={12} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">github</div>
                <a
                  href={githubLink ?? `https://github.com/${githubHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground transition-colors hover:text-cyan mt-1 flex items-center gap-1"
                >
                  @{githubHandle} <ExternalLink size={10} className="opacity-50" />
                </a>
              </div>
            </div>

            {profile.socialLinks
              ?.filter((l) => !l.url.includes("github.com") && !l.url.startsWith("mailto:"))
              .map((l) => (
                <div key={l.label} className="group flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan/10 text-cyan border border-cyan/20 transition-colors group-hover:bg-cyan/20 group-hover:text-cyan-glow">
                    <LinkIcon size={12} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">{l.label}</div>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-foreground transition-colors hover:text-cyan mt-1 flex items-center gap-1"
                    >
                      {l.url.replace(/^https?:\/\//, "")} <ExternalLink size={10} className="opacity-50" />
                    </a>
                  </div>
                </div>
              ))}
          </div>

          <div className="rounded-md border border-cyan/10 bg-black/20 p-3 text-[11px] text-muted-foreground mt-8">
            <span className="text-cyan/70 font-medium">▸ operator tip:</span> Lead with the core problem you're trying to solve. Architecture follows function.
          </div>
        </div>

        {/* Form Side */}
        <form onSubmit={submit} className="relative overflow-hidden rounded-lg border border-cyan/15 bg-black/40 p-6 font-mono text-xs shadow-inner backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 mb-6 flex items-center justify-between border-b border-cyan/20 pb-3">
             <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80">Message Payload</div>
             <div className="h-1.5 w-1.5 rounded-full bg-cyan/50 animate-pulse" />
          </div>

          <div className="relative z-10 space-y-2">
            <TerminalField
              label="callsign"
              name="name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="Your name"
              required
            />
            <TerminalField
              label="from"
              name="email"
              type="email"
              value={form.from}
              onChange={(v) => setForm((f) => ({ ...f, from: v }))}
              placeholder="you@company.com"
              required
            />
            <TerminalField
              label="re"
              name="subject"
              value={form.subject}
              onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              placeholder="Short subject"
            />
            
            <div className="group relative mt-6 transition-colors focus-within:border-cyan">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-cyan/40 transition-colors group-focus-within:text-cyan">▸</span>
                <label
                  htmlFor="comms-message"
                  className="text-[10px] uppercase tracking-[0.25em] text-cyan/80 transition-colors group-focus-within:text-cyan group-focus-within:text-glow"
                >
                  message
                </label>
              </div>
              <textarea
                id="comms-message"
                name="message"
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={5}
                required
                className="w-full resize-none rounded-md border border-cyan/20 bg-black/40 p-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-cyan focus:bg-black/60 focus:ring-1 focus:ring-cyan/30 scroll-mb-24"
                placeholder="Enter briefing details..."
              />
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <button
              type="submit"
              disabled={state === "sending" || state === "sent"}
              className="group relative flex w-full touch-target-lg items-center justify-center gap-3 overflow-hidden rounded-md border border-cyan/50 bg-cyan/10 px-4 py-3 text-[11px] uppercase tracking-[0.25em] text-cyan transition-all hover:bg-cyan/20 hover:text-cyan-glow hover:shadow-[0_0_20px_rgba(92,208,255,0.15)] disabled:opacity-60 disabled:hover:bg-cyan/10 disabled:hover:shadow-none"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              
              {state === "idle" && (
                <>
                  <Send size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  <span>transmit payload</span>
                </>
              )}
              {state === "error" && (
                <>
                  <AlertCircle size={14} className="text-signal-red" />
                  <span className="text-signal-red">retry transmission</span>
                </>
              )}
              {state === "sending" && (
                <>
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
                  <span>encoding...</span>
                </>
              )}
              {state === "sent" && (
                <>
                  <CheckCircle2 size={14} className="text-signal-green" />
                  <span className="text-signal-green">signal received</span>
                </>
              )}
            </button>
            
            <div className="mt-4 h-6 text-center text-[10px] uppercase tracking-widest">
              {state === "sent" && (
                <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-signal-green">
                  transmission successful. expect a reply within 24h.
                </motion.span>
              )}
              {state === "error" && (
                <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-signal-red">
                  transmission failed — email directly.
                </motion.span>
              )}
            </div>
          </div>
        </form>
      </div>
    </Panel>
  );
}
