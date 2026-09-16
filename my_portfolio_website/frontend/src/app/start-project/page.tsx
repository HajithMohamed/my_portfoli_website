"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { bffUrl } from "@/lib/api";
import { track } from "@/lib/analytics";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  HelpCircle,
  Laptop,
  Layers,
  Mail,
  Phone,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PROJECT_TYPES = [
  "Web Application",
  "Website",
  "Mobile Application",
  "E-commerce",
  "Admin Dashboard",
  "API / Backend",
  "Custom Software",
  "Other",
];

const TIMELINE_OPTIONS = [
  "Urgent (< 2 weeks)",
  "1 month",
  "2-3 months",
  "3+ months",
  "Flexible",
];

const BUDGET_OPTIONS = [
  "< $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "Discuss with proposal",
];

export default function StartProjectPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submittedAtMs] = useState<number>(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "Web Application",
    details: "",
    requiredFeatures: "",
    referenceSites: "",
    timeline: "2-3 months",
    budgetRange: "$3,000 - $5,000",
    preferredContact: "email",
    honeypot: "", // security honeypot
  });

  function updateField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function nextStep() {
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.email.includes("@")) {
        setError("Please provide a valid name and email address.");
        return;
      }
    }
    if (step === 3) {
      if (formData.details.trim().length < 10) {
        setError("Please provide at least a brief description (min 10 characters).");
        return;
      }
    }
    setError(null);
    setDirection(1);
    setStep((s) => Math.min(5, s + 1));
  }

  function prevStep() {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const requiredFeaturesList = formData.requiredFeatures
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const response = await fetch(bffUrl("/requests"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim() || undefined,
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          projectType: formData.projectType,
          details: formData.details.trim(),
          requiredFeatures: requiredFeaturesList,
          referenceSites: formData.referenceSites.trim() || undefined,
          timeline: formData.timeline,
          budgetRange: formData.budgetRange,
          preferredContact: formData.preferredContact,
          honeypot: formData.honeypot,
          submittedAtMs,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setReferenceId(data.referenceId);
      track("project_request_submit");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      <TopBar />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-cyan hover:text-cyan-glow transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio Console</span>
          </Link>

          {/* Heading */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              <span className="inline-block w-4 h-[1px] bg-cyan" />
              <span>COMMISSION INTAKE</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Start a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-sky-400 to-blue-500">
                Project
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Define your architectural requirements, timeline, and deliverables. You will receive
              a structured proposal and roadmap within 24 hours.
            </p>
          </div>

          {referenceId ? (
            /* Confirmation Screen */
            <div className="rounded-2xl border border-cyan/40 bg-surface/90 p-8 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(92,208,255,0.15)] text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-signal-green/40 bg-signal-green/10 text-signal-green shadow-[0_0_24px_rgba(52,211,153,0.25)]">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-signal-green font-semibold">
                  Intake Packet Verified &amp; Queued
                </div>
                <h2 className="font-display text-3xl font-bold text-white">
                  Thank You, {formData.name}
                </h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Your project scope has been securely routed to Mohamed Hajith&apos;s priority queue.
                </p>
              </div>

              {/* Reference ID Pill */}
              <div className="inline-block rounded-xl border border-cyan/30 bg-black/60 px-6 py-3 font-mono text-sm">
                <span className="text-slate-400 mr-2">Tracking Reference:</span>
                <span className="text-cyan font-bold tracking-wider">{referenceId}</span>
              </div>

              <div className="rounded-xl border border-cyan/15 bg-surface-2/30 p-5 max-w-md mx-auto text-left font-mono text-xs space-y-2 text-slate-400">
                <div className="text-white font-semibold flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan" />
                  Next Steps:
                </div>
                <div>1. Technical requirements and feasibility review.</div>
                <div>2. Formal scope breakdown &amp; milestone schedule.</div>
                <div>3. Reply to <span className="text-cyan">{formData.email}</span> within 24h.</div>
              </div>

              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan px-6 py-3 font-mono text-xs font-semibold text-black hover:bg-cyan/90 transition-all"
                >
                  <span>Return to Main Console</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            /* 5-Step Intake Form */
            <div className="rounded-2xl border border-cyan/30 bg-surface/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Progress Steps Bar */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-cyan/15 font-mono text-xs">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        s === step
                          ? "bg-cyan text-black shadow-[0_0_12px_var(--cyan-glow)]"
                          : s < step
                          ? "bg-cyan/20 text-cyan border border-cyan/40"
                          : "bg-surface-2 text-slate-500 border border-border"
                      }`}
                    >
                      {s}
                    </div>
                    <span className="hidden sm:inline text-[11px] text-slate-400">
                      {s === 1 && "Contact"}
                      {s === 2 && "Type"}
                      {s === 3 && "Details"}
                      {s === 4 && "Timeline"}
                      {s === 5 && "Review"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Honeypot field (hidden from genuine users) */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => updateField("honeypot", e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {error && (
                <div className="mb-6 rounded-lg border border-signal-red/30 bg-signal-red/10 p-3 text-xs font-mono text-signal-red">
                  {error}
                </div>
              )}

              {/* Step Content with AnimatePresence */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {/* STEP 1: ABOUT YOU */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h2 className="font-display text-2xl font-bold text-white">About You</h2>
                        <p className="text-xs text-slate-400">
                          How can I get in touch to discuss this engagement?
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Morgan"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Company / Organization (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Acme Studio"
                            value={formData.company}
                            onChange={(e) => updateField("company", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="alex@company.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Phone / WhatsApp (Optional)
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 555-0199"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PROJECT TYPE */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h2 className="font-display text-2xl font-bold text-white">Project Type</h2>
                        <p className="text-xs text-slate-400">
                          Select the primary class of system you are commissioning.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {PROJECT_TYPES.map((type) => {
                          const isSelected = formData.projectType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateField("projectType", type)}
                              className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${
                                isSelected
                                  ? "border-cyan bg-cyan/15 text-white font-semibold shadow-[0_0_15px_var(--cyan-glow)]"
                                  : "border-cyan/20 bg-black/30 text-slate-300 hover:border-cyan/40 hover:text-white"
                              }`}
                            >
                              <span>{type}</span>
                              {isSelected && <CheckCircle2 size={16} className="text-cyan" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DETAILS */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h2 className="font-display text-2xl font-bold text-white">Project Details</h2>
                        <p className="text-xs text-slate-400">
                          What are the core capabilities and requirements of this build?
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Project Description &amp; Goals *
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="Describe what you want to build, the business problem it solves, and the primary audience..."
                            value={formData.details}
                            onChange={(e) => updateField("details", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Required Features (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Auth, Stripe payments, Dashboard, Real-time updates"
                            value={formData.requiredFeatures}
                            onChange={(e) => updateField("requiredFeatures", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                            Reference Sites or Inspirations (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. https://linear.app, https://vercel.com"
                            value={formData.referenceSites}
                            onChange={(e) => updateField("referenceSites", e.target.value)}
                            className="w-full rounded-xl border border-cyan/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: TIMELINE & BUDGET */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h2 className="font-display text-2xl font-bold text-white">
                          Timeline &amp; Budget
                        </h2>
                        <p className="text-xs text-slate-400">
                          Aligning expectations for realistic milestones and resource commitment.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                          Target Timeline
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {TIMELINE_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => updateField("timeline", opt)}
                              className={`p-3 rounded-xl border text-xs font-mono transition-all text-center ${
                                formData.timeline === opt
                                  ? "border-cyan bg-cyan/15 text-white font-semibold shadow-[0_0_12px_var(--cyan-glow)]"
                                  : "border-cyan/20 bg-black/30 text-slate-400 hover:text-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-cyan/15">
                        <label className="font-mono text-xs uppercase tracking-wider text-slate-300">
                          Budget Range
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {BUDGET_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => updateField("budgetRange", opt)}
                              className={`p-3 rounded-xl border text-xs font-mono transition-all text-center ${
                                formData.budgetRange === opt
                                  ? "border-cyan bg-cyan/15 text-white font-semibold shadow-[0_0_12px_var(--cyan-glow)]"
                                  : "border-cyan/20 bg-black/30 text-slate-400 hover:text-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: REVIEW & TRANSMIT */}
                  {step === 5 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <h2 className="font-display text-2xl font-bold text-white">Review &amp; Submit</h2>
                        <p className="text-xs text-slate-400">
                          Verify your briefing parameters before transmission.
                        </p>
                      </div>

                      <div className="rounded-xl border border-cyan/20 bg-black/40 p-5 font-mono text-xs space-y-3">
                        <div className="grid grid-cols-2 gap-2 border-b border-cyan/15 pb-2">
                          <span className="text-slate-400">Client:</span>
                          <span className="text-white font-semibold text-right">
                            {formData.name} {formData.company ? `(${formData.company})` : ""}
                          </span>
                          <span className="text-slate-400">Email:</span>
                          <span className="text-cyan text-right">{formData.email}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-b border-cyan/15 pb-2">
                          <span className="text-slate-400">Classification:</span>
                          <span className="text-white text-right">{formData.projectType}</span>
                          <span className="text-slate-400">Timeline:</span>
                          <span className="text-white text-right">{formData.timeline}</span>
                          <span className="text-slate-400">Budget:</span>
                          <span className="text-white text-right">{formData.budgetRange}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400">Briefing Summary:</span>
                          <p className="text-slate-200 leading-relaxed pt-1">
                            {formData.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Actions */}
              <div className="mt-8 pt-6 border-t border-cyan/15 flex items-center justify-between font-mono text-xs">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan/30 px-5 py-2.5 text-slate-300 hover:text-white hover:border-cyan"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan px-6 py-2.5 font-semibold text-black hover:bg-cyan/90 hover:shadow-[0_0_15px_var(--cyan-glow)] transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan px-8 py-3 font-semibold text-black hover:bg-cyan/90 hover:shadow-[0_0_20px_var(--cyan-glow)] transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        <span>Transmitting Brief...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Project Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <CommandFooter />
    </div>
  );
}
