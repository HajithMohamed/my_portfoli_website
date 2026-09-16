"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import { bffUrl } from "@/lib/api";
import { track } from "@/lib/analytics";
import type { Profile } from "@/lib/types";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  Github,
  Link as LinkIcon,
  ExternalLink,
  ArrowRight,
  Briefcase,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAL_IDENTITY } from "@/lib/identity";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Comms({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ name: "", from: "", subject: "", body: "" });
  const [touched, setTouched] = useState({ name: false, from: false, body: false });
  const [state, setState] = useState<"idle" | "transmitting" | "sent" | "error">("idle");
  const [progressStep, setProgressStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const githubLink = profile.socialLinks?.find((l) => l.url.includes("github.com"))?.url;
  const githubHandle = githubLink?.replace(/\/$/, "").split("/").pop() ?? "HajithMohamed";

  // Validation rules
  const nameError = touched.name && form.name.trim().length < 2 ? "callsign too short" : null;
  const emailError =
    touched.from && !validateEmail(form.from) ? "invalid packet address" : null;
  const bodyError = touched.body && form.body.trim().length < 10 ? "payload under 10 chars" : null;

  const isFormValid =
    form.name.trim().length >= 2 && validateEmail(form.from) && form.body.trim().length >= 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, from: true, body: true });

    if (!isFormValid) return;

    setState("transmitting");
    setProgressStep(1);

    // Simulate multi-stage terminal transmit sequence
    const t1 = setTimeout(() => setProgressStep(2), 350);
    const t2 = setTimeout(() => setProgressStep(3), 700);

    try {
      const response = await fetch(bffUrl("/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.from.trim(),
          subject: form.subject.trim() || "Portfolio inquiry",
          message: form.body.trim(),
        }),
      });

      clearTimeout(t1);
      clearTimeout(t2);

      if (response.ok) {
        setState("sent");
        track("contact_submit");
      } else {
        const errData = await response.json().catch(() => null);
        setErrorMsg(errData?.message || "Transmission rejected by upstream node");
        setState("error");
      }
    } catch (err: unknown) {
      clearTimeout(t1);
      clearTimeout(t2);
      setErrorMsg("Network error: packet failed to route");
      setState("error");
    }
  }

  function resetForm() {
    setForm({ name: "", from: "", subject: "", body: "" });
    setTouched({ name: false, from: false, body: false });
    setState("idle");
    setProgressStep(0);
    setErrorMsg("");
  }

  return (
    <Panel label="comms.terminal" subtitle="secure operator channel" live>
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] lg:gap-12">
        {/* Contact Info Side */}
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-cyan/10 pb-4">
            <h3 className="font-display text-xl font-bold text-foreground">
              Contact {PERSONAL_IDENTITY.name}
            </h3>
            <p className="mt-2 text-[11px] text-cyan">{PERSONAL_IDENTITY.title}</p>
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Direct operator uplink for full-stack engineering, system architecture, internships, and collaborative builds.
            </p>
          </div>

          <div className="space-y-4">
            <div className="group flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan/10 text-cyan border border-cyan/20 transition-colors group-hover:bg-cyan/20 group-hover:text-cyan-glow">
                <Mail size={12} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">
                  direct email
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-foreground transition-colors hover:text-cyan mt-1 inline-block"
                >
                  {profile.email}
                </a>
              </div>
            </div>

            <div className="group flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan/10 text-cyan border border-cyan/20 transition-colors group-hover:bg-cyan/20 group-hover:text-cyan-glow">
                <MapPin size={12} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">
                  base sector
                </div>
                <div className="text-foreground mt-1 inline-block">
                  {PERSONAL_IDENTITY.location}
                </div>
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
                    <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">
                      {l.label}
                    </div>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-foreground transition-colors hover:text-cyan mt-1 flex items-center gap-1"
                    >
                      {l.url.replace(/^https?:\/\//, "")}{" "}
                      <ExternalLink size={10} className="opacity-50" />
                    </a>
                  </div>
                </div>
              ))}
          </div>

          {/* Secondary CTA pointing to /start-project */}
          <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-4 space-y-2 mt-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan font-bold">
              <Briefcase size={12} />
              <span>Commissioning a Project?</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Need a structured proposal with timeline estimation, scope definition, and architectural breakdown?
            </p>
            <Link
              href="/start-project"
              className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan hover:text-cyan-glow transition-all"
            >
              <span>launch project intake wizard</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Form Side */}
        <div className="relative overflow-hidden rounded-lg border border-cyan/20 bg-black/40 p-6 font-mono text-xs shadow-inner backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent pointer-events-none" />

          <div className="relative z-10 mb-6 flex items-center justify-between border-b border-cyan/20 pb-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-cyan/80">
              <Terminal size={12} />
              <span>Message Payload</span>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-cyan/50 animate-pulse" />
          </div>

          {state === "sent" ? (
            /* Terminal Success State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 space-y-4 font-mono"
            >
              <div className="flex items-center gap-3 text-signal-green">
                <CheckCircle2 size={24} />
                <span className="text-sm font-bold uppercase tracking-wider">
                  [ACK 200] INGEST_SUCCESSFUL
                </span>
              </div>
              <div className="rounded-md border border-signal-green/20 bg-signal-green/5 p-4 text-[11px] space-y-2 text-muted-foreground">
                <p className="text-foreground">
                  Payload SHA-256 verified and ingested into operator inbox.
                </p>
                <p>
                  &gt; Priority queue: <span className="text-signal-green font-semibold">HIGH</span>
                </p>
                <p>&gt; SLA: reply guaranteed within 24 hours.</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 inline-flex items-center gap-2 rounded-sm border border-cyan/40 bg-cyan/10 px-4 py-2 text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/20 transition-all"
              >
                <span>transmit new payload</span>
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="relative z-10 space-y-4">
              {/* Callsign / Name */}
              <div>
                <div className="group relative flex min-h-[44px] items-center gap-3 border-b border-cyan/15 pb-2 transition-colors focus-within:border-cyan">
                  <span className="text-cyan/40 transition-colors group-focus-within:text-cyan">
                    ▸
                  </span>
                  <label
                    htmlFor="comms-name"
                    className="w-16 shrink-0 text-[10px] uppercase tracking-[0.25em] text-cyan/80 transition-colors group-focus-within:text-cyan"
                  >
                    callsign
                  </label>
                  <input
                    id="comms-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your identifier"
                    required
                    className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
                {nameError && (
                  <span className="mt-1 block text-[10px] text-signal-red">
                    [ERR: {nameError}]
                  </span>
                )}
              </div>

              {/* From / Email */}
              <div>
                <div className="group relative flex min-h-[44px] items-center gap-3 border-b border-cyan/15 pb-2 transition-colors focus-within:border-cyan">
                  <span className="text-cyan/40 transition-colors group-focus-within:text-cyan">
                    ▸
                  </span>
                  <label
                    htmlFor="comms-email"
                    className="w-16 shrink-0 text-[10px] uppercase tracking-[0.25em] text-cyan/80 transition-colors group-focus-within:text-cyan"
                  >
                    from
                  </label>
                  <input
                    id="comms-email"
                    name="email"
                    type="email"
                    value={form.from}
                    onBlur={() => setTouched((t) => ({ ...t, from: true }))}
                    onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                    placeholder="operator@company.com"
                    required
                    className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
                {emailError && (
                  <span className="mt-1 block text-[10px] text-signal-red">
                    [ERR: {emailError}]
                  </span>
                )}
              </div>

              {/* Subject */}
              <div className="group relative flex min-h-[44px] items-center gap-3 border-b border-cyan/15 pb-2 transition-colors focus-within:border-cyan">
                <span className="text-cyan/40 transition-colors group-focus-within:text-cyan">
                  ▸
                </span>
                <label
                  htmlFor="comms-subject"
                  className="w-16 shrink-0 text-[10px] uppercase tracking-[0.25em] text-cyan/80 transition-colors group-focus-within:text-cyan"
                >
                  re
                </label>
                <input
                  id="comms-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="System architecture / project scope"
                  className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Message */}
              <div className="pt-2">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-cyan/40">▸</span>
                  <label
                    htmlFor="comms-message"
                    className="text-[10px] uppercase tracking-[0.25em] text-cyan/80"
                  >
                    message payload
                  </label>
                </div>
                <textarea
                  id="comms-message"
                  name="message"
                  value={form.body}
                  onBlur={() => setTouched((t) => ({ ...t, body: true }))}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={4}
                  required
                  className="w-full resize-none rounded-md border border-cyan/20 bg-black/40 p-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-cyan focus:bg-black/60 focus:ring-1 focus:ring-cyan/30"
                  placeholder="State project requirements, system objectives, or technical inquiries..."
                />
                {bodyError && (
                  <span className="mt-1 block text-[10px] text-signal-red">
                    [ERR: {bodyError}]
                  </span>
                )}
              </div>

              {/* Transmit Progress Sequence */}
              {state === "transmitting" && (
                <div className="rounded-md border border-cyan/30 bg-cyan/5 p-3 space-y-1 text-[10px] text-cyan">
                  <div className="flex items-center justify-between">
                    <span>
                      {progressStep === 1 && "[01/03] ENCRYPTING_PAYLOAD..."}
                      {progressStep === 2 && "[02/03] ROUTING_TO_PRIMARY_NODE..."}
                      {progressStep >= 3 && "[03/03] AWAITING_INGEST_ACK..."}
                    </span>
                    <span className="inline-block h-2 w-2 rounded-full bg-cyan animate-ping" />
                  </div>
                  <div className="h-1 w-full bg-cyan/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan transition-all duration-300"
                      style={{ width: `${progressStep * 33}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Output */}
              {state === "error" && (
                <div className="flex items-center gap-2 rounded-md border border-signal-red/30 bg-signal-red/10 p-3 text-[10px] text-signal-red">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>[TRANSMIT_FAILED] {errorMsg || "Connection timed out. Email directly."}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state === "transmitting"}
                className="group relative flex w-full touch-target-lg items-center justify-center gap-3 overflow-hidden rounded-md border border-cyan/50 bg-cyan/10 px-4 py-3.5 text-[11px] uppercase tracking-[0.25em] text-cyan transition-all hover:bg-cyan/20 hover:text-cyan-glow hover:shadow-[0_0_20px_rgba(92,208,255,0.15)] disabled:opacity-60"
              >
                <Send
                  size={14}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
                <span>
                  {state === "transmitting" ? "transmitting packet..." : "transmit payload"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </Panel>
  );
}
