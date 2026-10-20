"use client";

import { useState } from "react";
import Link from "next/link";
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
  ShieldCheck,
  Radio,
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
  const directEmail = profile.email || PERSONAL_IDENTITY.email;

  // Validation rules
  const nameError = touched.name && form.name.trim().length < 2 ? "Please provide your name or identifier (at least 2 characters)" : null;
  const emailError =
    touched.from && !validateEmail(form.from) ? "Please enter a valid email address" : null;
  const bodyError = touched.body && form.body.trim().length < 10 ? "Message must contain at least 10 characters" : null;

  const isFormValid =
    form.name.trim().length >= 2 && validateEmail(form.from) && form.body.trim().length >= 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, from: true, body: true });

    if (!isFormValid) return;

    setState("transmitting");
    setProgressStep(1);

    // Multi-stage transmission feedback
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
        setErrorMsg(errData?.message || "Transmission rejected by upstream server");
        setState("error");
      }
    } catch (err: unknown) {
      clearTimeout(t1);
      clearTimeout(t2);
      setErrorMsg("Network error: message failed to send. Please reach out via email directly.");
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
    <section
      aria-label="Secure Operator Channel"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8"
    >
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-cyan/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span>COMMS.TERMINAL // SECURE OPERATOR CHANNEL</span>
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Contact &amp; Operator Uplink
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Direct communication channel for full-stack engineering, system architecture, commissions, and team placement.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Channel Online · 24h SLA</span>
        </div>
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        {/* Contact Info Coordinates */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-foreground">
              Direct Coordinates
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based in {PERSONAL_IDENTITY.location}, available for global remote roles and high-impact engineering projects.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Direct Email */}
            <a
              href={`mailto:${directEmail}`}
              className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-surface/80 p-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan transition-colors group-hover:border-cyan/50 group-hover:bg-cyan/20">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Direct Email
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
                    {directEmail}
                  </div>
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-cyan transition-opacity" />
            </a>

            {/* Base Location */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-surface/80 p-4 backdrop-blur-xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-400">
                <MapPin size={16} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  Operational Base
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {PERSONAL_IDENTITY.location}
                </div>
              </div>
            </div>

            {/* GitHub */}
            <a
              href={githubLink ?? `https://github.com/${githubHandle}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-surface/80 p-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground transition-colors group-hover:border-cyan/50 group-hover:text-cyan">
                  <Github size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    GitHub Profile
                  </div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
                    @{githubHandle}
                  </div>
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-cyan transition-opacity" />
            </a>

            {/* Social Links */}
            {profile.socialLinks
              ?.filter((l) => !l.url.includes("github.com") && !l.url.startsWith("mailto:"))
              .map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-surface/80 p-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground transition-colors group-hover:border-cyan/50 group-hover:text-cyan">
                      <LinkIcon size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {l.label}
                      </div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
                        {l.url.replace(/^https?:\/\//, "")}
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-cyan transition-opacity" />
                </a>
              ))}
          </div>

          {/* Project Commission Callout */}
          <div className="rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-indigo-950/20 to-transparent p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan">
              <Briefcase size={14} />
              <span>Commissioning a Project or System?</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Need a full architectural breakdown with milestones, tech stack selection, and budget estimates?
            </p>
            <Link
              href="/start-project"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan hover:bg-cyan/25 transition-all"
            >
              <span>Launch Project Intake Wizard</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Message Form Card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-surface/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <div className="mb-6 flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan">
              <Radio size={14} className="animate-pulse" />
              <span>Direct Dispatch Uplink</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Encrypted &amp; Verified</span>
            </div>
          </div>

          {state === "sent" ? (
            /* Success ACK State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 space-y-6 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-xl font-bold text-foreground">
                  Transmission Dispatched Successfully
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your message was authenticated and forwarded directly to Hajith&apos;s primary inbox.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs font-mono text-slate-400 space-y-1 text-left max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span>Routing Priority:</span>
                  <span className="text-emerald-400 font-semibold">HIGH</span>
                </div>
                <div className="flex justify-between">
                  <span>Target SLA:</span>
                  <span className="text-slate-200">Reply within 24 Hours</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
              >
                <span>Dispatch Another Message</span>
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {/* Callsign / Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="comms-name"
                  className="block text-xs font-medium text-slate-300"
                >
                  Your Name / Call Sign <span className="text-cyan">*</span>
                </label>
                <input
                  id="comms-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Alex Mercer / Tech Lead"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-cyan/50 focus:bg-white/[0.06] focus:outline-none transition-all"
                />
                {nameError && (
                  <span className="block text-[11px] text-rose-400">
                    {nameError}
                  </span>
                )}
              </div>

              {/* From / Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="comms-email"
                  className="block text-xs font-medium text-slate-300"
                >
                  Email Address <span className="text-cyan">*</span>
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
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-cyan/50 focus:bg-white/[0.06] focus:outline-none transition-all"
                />
                {emailError && (
                  <span className="block text-[11px] text-rose-400">
                    {emailError}
                  </span>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label
                  htmlFor="comms-subject"
                  className="block text-xs font-medium text-slate-300"
                >
                  Subject / Objective <span className="text-muted-foreground text-[10px]">(Optional)</span>
                </label>
                <input
                  id="comms-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="System architecture / project scope / full-time role"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-cyan/50 focus:bg-white/[0.06] focus:outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="comms-message"
                  className="block text-xs font-medium text-slate-300"
                >
                  Message Payload <span className="text-cyan">*</span>
                </label>
                <textarea
                  id="comms-message"
                  name="message"
                  value={form.body}
                  onBlur={() => setTouched((t) => ({ ...t, body: true }))}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={4}
                  required
                  placeholder="State project requirements, system objectives, or technical inquiries..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-cyan/50 focus:bg-white/[0.06] focus:outline-none transition-all"
                />
                {bodyError && (
                  <span className="block text-[11px] text-rose-400">
                    {bodyError}
                  </span>
                )}
              </div>

              {/* Transmit Progress Sequence */}
              {state === "transmitting" && (
                <div className="rounded-xl border border-cyan/30 bg-cyan/10 p-3.5 space-y-2 text-xs font-mono text-cyan">
                  <div className="flex items-center justify-between">
                    <span>
                      {progressStep === 1 && "[01/03] ENCRYPTING PAYLOAD..."}
                      {progressStep === 2 && "[02/03] ROUTING TO INBOX..."}
                      {progressStep >= 3 && "[03/03] AWAITING SERVER ACK..."}
                    </span>
                    <span className="inline-block h-2 w-2 rounded-full bg-cyan animate-ping" />
                  </div>
                  <div className="h-1.5 w-full bg-cyan/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 transition-all duration-300"
                      style={{ width: `${progressStep * 33}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Output */}
              {state === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-400">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg || "Connection timed out. Please email directly."}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                data-testid="comms-submit-btn"
                disabled={state === "transmitting"}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:opacity-95 disabled:opacity-60 font-display cursor-pointer"
              >
                <Send
                  size={15}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
                />
                <span>
                  {state === "transmitting" ? "Transmitting Dispatch..." : "Send Message"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
