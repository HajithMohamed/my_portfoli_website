"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";

const WorkspaceScene = dynamic(() => import("@/components/command/workspace-scene"), {
  ssr: false,
});
import { bffUrl } from "@/lib/api";
import { track } from "@/lib/analytics";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  CreditCard,
  DollarSign,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Flame,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Link2,
  Lock,
  Mail,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  Rocket,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  Trash2,
  Upload,
  User,
  UserCheck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Step 1: Project Type Cards ───
interface BuildTypeOption {
  id: string;
  title: string;
  desc: string;
  icon: typeof Globe;
  color: "cyan" | "amber" | "emerald" | "purple" | "rose";
  tag: string;
}

const BUILD_TYPES: BuildTypeOption[] = [
  {
    id: "new-website",
    title: "I need a new website",
    desc: "A fresh website for my business, brand or personal project.",
    icon: Globe,
    color: "cyan",
    tag: "Brand Web",
  },
  {
    id: "redesign",
    title: "I want to redesign my current website",
    desc: "Improve the look, feel or performance of an existing site.",
    icon: RefreshCw,
    color: "amber",
    tag: "Modernize",
  },
  {
    id: "online-store",
    title: "I need an online store",
    desc: "Sell products or services online with automated payments.",
    icon: Package,
    color: "emerald",
    tag: "E-Commerce",
  },
  {
    id: "web-app",
    title: "I need a web application",
    desc: "A custom tool, client dashboard, or business platform.",
    icon: Layers,
    color: "purple",
    tag: "SaaS / Portal",
  },
  {
    id: "not-sure",
    title: "I'm not sure yet — help me decide",
    desc: "Tell us your idea and we'll suggest the most effective option.",
    icon: Sparkles,
    color: "rose",
    tag: "Advisory",
  },
];

// ─── Step 2: Goal Cards ───
interface GoalOption {
  id: string;
  title: string;
  desc: string;
  icon: typeof Target;
  color: "amber" | "cyan" | "emerald" | "purple" | "sky" | "rose";
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "leads",
    title: "Get more customers or leads",
    desc: "Bring in more people, conversions, sales or inquiries.",
    icon: Target,
    color: "amber",
  },
  {
    id: "showcase",
    title: "Show my work",
    desc: "Showcase my portfolio, client proof, services or skills.",
    icon: Eye,
    color: "cyan",
  },
  {
    id: "sell",
    title: "Sell online",
    desc: "Let people buy products or book paid services directly.",
    icon: DollarSign,
    color: "emerald",
  },
  {
    id: "automate",
    title: "Automate a process",
    desc: "Save manual hours, streamline bookings, and cut busywork.",
    icon: Zap,
    color: "purple",
  },
  {
    id: "credibility",
    title: "Build credibility",
    desc: "Look world-class, establish authority and earn customer trust.",
    icon: ShieldCheck,
    color: "sky",
  },
  {
    id: "launch",
    title: "Launch an idea",
    desc: "Turn your vision into a real, production-ready product.",
    icon: Rocket,
    color: "rose",
  },
];

// ─── Step 3: Feature Options ───
interface FeatureOption {
  id: string;
  title: string;
  desc: string;
  icon: typeof Mail;
  color: "cyan" | "amber" | "emerald" | "purple" | "sky" | "rose" | "fuchsia" | "indigo" | "teal" | "orange";
}

const FEATURE_OPTIONS: FeatureOption[] = [
  {
    id: "contact",
    title: "Contact / Lead Form",
    desc: "Let visitors quickly inquire, send specs, or get in touch.",
    icon: Mail,
    color: "cyan",
  },
  {
    id: "booking",
    title: "Booking / Appointments",
    desc: "Let people schedule consultation slots or service dates.",
    icon: Calendar,
    color: "amber",
  },
  {
    id: "payments",
    title: "Payments",
    desc: "Accept secure card payments, invoices, or subscriptions.",
    icon: CreditCard,
    color: "emerald",
  },
  {
    id: "auth",
    title: "Login / Accounts",
    desc: "Allow customers or staff to register, login, and save data.",
    icon: UserCheck,
    color: "purple",
  },
  {
    id: "dashboard",
    title: "Dashboard / Admin",
    desc: "Manage products, track orders, view analytics, and control users.",
    icon: LayoutDashboard,
    color: "sky",
  },
  {
    id: "cms",
    title: "Blog / Content Management",
    desc: "Publish articles, news, updates, or SEO editorial pieces.",
    icon: BookOpen,
    color: "rose",
  },
  {
    id: "portfolio",
    title: "Portfolio / Gallery",
    desc: "Showcase client projects, case studies, or photography.",
    icon: ImageIcon,
    color: "fuchsia",
  },
  {
    id: "integrations",
    title: "Integrations",
    desc: "Connect with Google Sheets, Mailchimp, CRM, Slack, or Webhooks.",
    icon: Link2,
    color: "indigo",
  },
  {
    id: "animations",
    title: "Animations",
    desc: "Smooth modern transitions, micro-interactions, or 3D visuals.",
    icon: Sparkles,
    color: "teal",
  },
  {
    id: "multilingual",
    title: "Multilingual",
    desc: "Serve content in English, Sinhala, Tamil, or global languages.",
    icon: Globe,
    color: "orange",
  },
];

// ─── Step 4: Visual Style Options ───
interface StyleOption {
  id: string;
  name: string;
  desc: string;
  accent: string;
  borderColor: string;
  bgGradient: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean & simple, generous white space, distraction-free.",
    accent: "text-slate-200",
    borderColor: "border-slate-500/40",
    bgGradient: "from-slate-800/40 to-slate-900/40",
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Strong typography, vibrant high-energy contrasts.",
    accent: "text-amber-400",
    borderColor: "border-amber-500/40",
    bgGradient: "from-amber-950/40 to-slate-900/40",
  },
  {
    id: "corporate",
    name: "Corporate",
    desc: "Polished, clean, trustworthy, and enterprise-ready.",
    accent: "text-sky-400",
    borderColor: "border-sky-500/40",
    bgGradient: "from-sky-950/40 to-slate-900/40",
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Artistic, expressive, distinctive micro-animations.",
    accent: "text-purple-400",
    borderColor: "border-purple-500/40",
    bgGradient: "from-purple-950/40 to-slate-900/40",
  },
  {
    id: "luxury",
    name: "Luxury",
    desc: "Elegant, deep dark tones, gold accents, premium feel.",
    accent: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    bgGradient: "from-yellow-950/30 to-slate-900/40",
  },
  {
    id: "jarvis",
    name: "Technical / JARVIS",
    desc: "Futuristic HUD telemetry, glowing grids, sci-fi precision.",
    accent: "text-cyan",
    borderColor: "border-cyan/50",
    bgGradient: "from-cyan-950/40 to-slate-900/40",
  },
];

// Color palette mapping helper for dynamic styling
const COLOR_STYLES = {
  cyan: {
    borderActive: "border-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)] bg-cyan/10",
    borderHover: "hover:border-cyan/60 hover:bg-cyan/5",
    text: "text-cyan",
    iconBg: "bg-cyan/15 text-cyan border border-cyan/30",
    ring: "ring-cyan",
    badge: "border-cyan/40 bg-cyan/15 text-cyan",
  },
  amber: {
    borderActive: "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-amber-400/10",
    borderHover: "hover:border-amber-400/60 hover:bg-amber-400/5",
    text: "text-amber-400",
    iconBg: "bg-amber-400/15 text-amber-400 border border-amber-400/30",
    ring: "ring-amber-400",
    badge: "border-amber-400/40 bg-amber-400/15 text-amber-400",
  },
  emerald: {
    borderActive: "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] bg-emerald-400/10",
    borderHover: "hover:border-emerald-400/60 hover:bg-emerald-400/5",
    text: "text-emerald-400",
    iconBg: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
    ring: "ring-emerald-400",
    badge: "border-emerald-400/40 bg-emerald-400/15 text-emerald-400",
  },
  purple: {
    borderActive: "border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)] bg-purple-400/10",
    borderHover: "hover:border-purple-400/60 hover:bg-purple-400/5",
    text: "text-purple-400",
    iconBg: "bg-purple-400/15 text-purple-400 border border-purple-400/30",
    ring: "ring-purple-400",
    badge: "border-purple-400/40 bg-purple-400/15 text-purple-400",
  },
  sky: {
    borderActive: "border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] bg-sky-400/10",
    borderHover: "hover:border-sky-400/60 hover:bg-sky-400/5",
    text: "text-sky-400",
    iconBg: "bg-sky-400/15 text-sky-400 border border-sky-400/30",
    ring: "ring-sky-400",
    badge: "border-sky-400/40 bg-sky-400/15 text-sky-400",
  },
  rose: {
    borderActive: "border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.3)] bg-rose-400/10",
    borderHover: "hover:border-rose-400/60 hover:bg-rose-400/5",
    text: "text-rose-400",
    iconBg: "bg-rose-400/15 text-rose-400 border border-rose-400/30",
    ring: "ring-rose-400",
    badge: "border-rose-400/40 bg-rose-400/15 text-rose-400",
  },
  fuchsia: {
    borderActive: "border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.3)] bg-fuchsia-400/10",
    borderHover: "hover:border-fuchsia-400/60 hover:bg-fuchsia-400/5",
    text: "text-fuchsia-400",
    iconBg: "bg-fuchsia-400/15 text-fuchsia-400 border border-fuchsia-400/30",
    ring: "ring-fuchsia-400",
    badge: "border-fuchsia-400/40 bg-fuchsia-400/15 text-fuchsia-400",
  },
  indigo: {
    borderActive: "border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.3)] bg-indigo-400/10",
    borderHover: "hover:border-indigo-400/60 hover:bg-indigo-400/5",
    text: "text-indigo-400",
    iconBg: "bg-indigo-400/15 text-indigo-400 border border-indigo-400/30",
    ring: "ring-indigo-400",
    badge: "border-indigo-400/40 bg-indigo-400/15 text-indigo-400",
  },
  teal: {
    borderActive: "border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)] bg-teal-400/10",
    borderHover: "hover:border-teal-400/60 hover:bg-teal-400/5",
    text: "text-teal-400",
    iconBg: "bg-teal-400/15 text-teal-400 border border-teal-400/30",
    ring: "ring-teal-400",
    badge: "border-teal-400/40 bg-teal-400/15 text-teal-400",
  },
  orange: {
    borderActive: "border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3)] bg-orange-400/10",
    borderHover: "hover:border-orange-400/60 hover:bg-orange-400/5",
    text: "text-orange-400",
    iconBg: "bg-orange-400/15 text-orange-400 border border-orange-400/30",
    ring: "ring-orange-400",
    badge: "border-orange-400/40 bg-orange-400/15 text-orange-400",
  },
};

const STEPS = [
  { id: 1, label: "About You & Project", badgeColor: "text-cyan border-cyan/40 bg-cyan/10" },
  { id: 2, label: "Goals", badgeColor: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
  { id: 3, label: "Features", badgeColor: "text-purple-400 border-purple-400/40 bg-purple-400/10" },
  { id: 4, label: "Style & Content", badgeColor: "text-rose-400 border-rose-400/40 bg-rose-400/10" },
  { id: 5, label: "Timeline", badgeColor: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
];

export default function StartProjectPage() {
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const device = isDesktop ? "laptop" : isTablet ? "tablet" : "phone";
  const particleCount = isDesktop ? 60 : isTablet ? 30 : 15;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  // Form State
  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [buildType, setBuildType] = useState<string>("new-website");

  // Step 2
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["leads", "credibility"]);
  const [painPoints, setPainPoints] = useState("");
  const [showPainPointInput, setShowPainPointInput] = useState(false);

  // Step 3
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "contact",
    "dashboard",
    "animations",
  ]);
  const [recommendFits, setRecommendFits] = useState(false);

  // Step 4
  const [visualStyle, setVisualStyle] = useState<string>("jarvis");
  const [referenceUrls, setReferenceUrls] = useState<string[]>([""]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [currentWebsite, setCurrentWebsite] = useState("");
  const [contentReadiness, setContentReadiness] = useState<"ready" | "help" | "discuss">("ready");

  // Step 5
  const [budgetRange, setBudgetRange] = useState<string>("$3,000 – $5,000");
  const [targetTimeline, setTargetTimeline] = useState<string>("Within 1 month");
  const [urgency, setUrgency] = useState<"high" | "medium" | "low">("medium");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navigation handlers
  const goToStep = (step: number) => {
    if (step < 1 || step > 5) return;
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        alert("Please enter your name to proceed.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
      }
    }
    goToStep(currentStep + 1);
  };

  const handlePrev = () => {
    goToStep(currentStep - 1);
  };

  // Toggle helpers
  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Reference URLs
  const handleAddReference = () => {
    setReferenceUrls((prev) => [...prev, ""]);
  };

  const handleUpdateReference = (index: number, val: string) => {
    setReferenceUrls((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveReference = (index: number) => {
    setReferenceUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  // Final Submission
  const handleSubmit = async () => {
    setSubmitting(true);

    const chosenBuild = BUILD_TYPES.find((b) => b.id === buildType)?.title || buildType;
    const goalTitles = selectedGoals
      .map((g) => GOAL_OPTIONS.find((opt) => opt.id === g)?.title)
      .filter(Boolean);
    const featureTitles = selectedFeatures
      .map((f) => FEATURE_OPTIONS.find((opt) => opt.id === f)?.title)
      .filter(Boolean);

    const payload = {
      name,
      email,
      company: company || undefined,
      projectType: chosenBuild,
      goals: goalTitles,
      painPoints: painPoints || undefined,
      features: featureTitles,
      recommendFits,
      visualStyle,
      referenceUrls: referenceUrls.filter(Boolean),
      uploadedAsset: uploadedFileName || undefined,
      currentWebsite: currentWebsite || undefined,
      contentReadiness,
      budget: budgetRange,
      timeline: targetTimeline,
      urgency,
      source: "jarvis_project_request_wizard_v2",
    };

    try {
      track("start_project_submit", {
        buildType,
        goalsCount: selectedGoals.length,
        featuresCount: selectedFeatures.length,
        budget: budgetRange,
      });

      const res = await fetch(bffUrl("/api/lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn("Direct API lead ingestion failed, falling back to local ingestion");
      }

      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setSubmitted(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBuildInfo = BUILD_TYPES.find((b) => b.id === buildType) || BUILD_TYPES[0];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-cyan selection:text-slate-950 overflow-hidden">
      {/* 3D WebGL Constellation Canvas matching the Command Deck */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.25] md:opacity-[0.32] overflow-hidden"
        aria-hidden
      >
        <WorkspaceScene device={device} particleCount={particleCount} />
      </div>

      <TopBar />

      <main className="relative z-10 pt-20 pb-28">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          
          {/* ─── Top Telemetry Banner & Header ─── */}
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-cyan/20 pb-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                <span className="flex h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
                <Terminal size={14} className="text-cyan" />
                <span>PROJECT REQUEST // J.A.R.V.I.S. INTAKE</span>
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Let&apos;s build something great together
              </h1>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Answer a few simple questions. We&apos;ll formulate a crystal-clear proposal within 24 hours.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="text-cyan font-semibold">Simple questions</span>
              <span className="text-cyan/40">→</span>
              <span className="text-amber-400 font-semibold">Better understanding</span>
              <span className="text-cyan/40">→</span>
              <span className="text-emerald-400 font-semibold">A perfect solution</span>
            </div>
          </div>

          {/* ─── Stepper Progress Bar ─── */}
          <div className="mb-10 overflow-x-auto pb-2">
            <div className="flex min-w-[700px] items-center justify-between">
              {STEPS.map((step, idx) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex flex-1 items-center last:flex-none">
                    <button
                      type="button"
                      onClick={() => isCompleted && goToStep(step.id)}
                      disabled={!isCompleted && !isActive}
                      className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all text-left ${
                        isActive
                          ? "bg-surface-2 border border-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                          : isCompleted
                          ? "hover:bg-surface-2/60 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                          isCompleted
                            ? "bg-signal-green text-slate-950 shadow-[0_0_10px_var(--signal-green)]"
                            : isActive
                            ? "bg-cyan text-slate-950 shadow-[0_0_12px_var(--cyan)] scale-110"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                      </div>
                      <span
                        className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                          isActive
                            ? "text-foreground font-semibold"
                            : isCompleted
                            ? "text-muted-foreground group-hover:text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>

                    {idx < STEPS.length - 1 && (
                      <div className="mx-3 h-[2px] flex-1 bg-border/60 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-cyan to-amber-400 transition-all duration-500"
                          style={{
                            width: currentStep > step.id ? "100%" : "0%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Main Interactive Wizard Box ─── */}
          <div className="relative rounded-2xl border border-cyan/25 bg-surface/90 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Top holographic scanner line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan via-amber-400 to-transparent" />

            <div className="p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {/* ─── SUCCESS SCREEN ─── */}
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center max-w-2xl mx-auto space-y-6"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-signal-green bg-signal-green/10 text-signal-green shadow-[0_0_35px_rgba(52,211,153,0.3)]">
                      <CheckCircle2 size={44} />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-signal-green/40 bg-signal-green/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-signal-green">
                        <Sparkles size={13} /> Transmission Confirmed // 24H SLA
                      </div>
                      <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                        Thank you, {name}! Your Project Request is Ingested.
                      </h2>
                      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                        We have logged your specifications for a <strong className="text-cyan">{selectedBuildInfo.title}</strong> with estimated budget <strong className="text-amber-400">{budgetRange}</strong>. Mohamed Hajith will personally analyze the scope, formulate an architecture blueprint, and send your proposal to <span className="text-foreground underline">{email}</span> within 24 hours.
                      </p>
                    </div>

                    <div className="rounded-xl border border-cyan/20 bg-surface-2/60 p-5 text-left font-mono text-xs space-y-2">
                      <div className="text-cyan uppercase tracking-wider font-semibold">Transmission Summary:</div>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                        <div>Client: <span className="text-foreground">{name}</span></div>
                        <div>Target: <span className="text-foreground">{selectedBuildInfo.title}</span></div>
                        <div>Timeline: <span className="text-emerald-400">{targetTimeline}</span></div>
                        <div>Urgency: <span className="text-amber-400 uppercase">{urgency}</span></div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center gap-4">
                      <Link
                        href="/"
                        className="rounded-lg border border-cyan/40 bg-cyan px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-soft hover:shadow-[0_0_20px_var(--cyan-glow)]"
                      >
                        Return to Command Deck
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setCurrentStep(1);
                        }}
                        className="rounded-lg border border-border bg-surface-2 px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-surface-3 transition-colors"
                      >
                        Submit Another Brief
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    {/* ─── STEP 1: About You & Project ─── */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: direction * 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 30 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        {/* Step Title Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                          <div>
                            <span className="inline-block rounded-full border border-cyan/40 bg-cyan/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan">
                              STEP 1 OF 5
                            </span>
                            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                              About You & Project
                            </h2>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              Tell us a bit about yourself and what you&apos;re hoping to build. You don&apos;t need to know technical terms — just tell us what you want to achieve.
                            </p>
                          </div>

                          <div className="shrink-0 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3.5 py-2 font-mono text-xs text-amber-300">
                            We&apos;re here to help — no tech jargon! 😊
                          </div>
                        </div>

                        {/* Contact Inputs */}
                        <div className="grid gap-5 md:grid-cols-3">
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-foreground">
                              <User size={13} className="text-cyan" />
                              <span>Your Name *</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Alex Morgan"
                              className="w-full rounded-lg border border-cyan/30 bg-surface-2 px-3.5 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-foreground">
                              <Mail size={13} className="text-amber-400" />
                              <span>Email Address *</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. you@company.com"
                              className="w-full rounded-lg border border-amber-400/30 bg-surface-2 px-3.5 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-foreground">
                              <Building2 size={13} className="text-purple-400" />
                              <span>Company / Org (Optional)</span>
                            </label>
                            <input
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="e.g. Acme Studio"
                              className="w-full rounded-lg border border-purple-400/30 bg-surface-2 px-3.5 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                          </div>
                        </div>

                        {/* What are you hoping to build? */}
                        <div className="space-y-4 pt-2">
                          <div className="space-y-1">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              What are you hoping to build?
                            </h3>
                            <p className="font-mono text-xs text-muted-foreground">
                              Choose the option that best describes your idea.
                            </p>
                          </div>

                          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                            {BUILD_TYPES.map((type) => {
                              const Icon = type.icon;
                              const isSelected = buildType === type.id;
                              const colorStyle = COLOR_STYLES[type.color];

                              return (
                                <button
                                  type="button"
                                  key={type.id}
                                  onClick={() => setBuildType(type.id)}
                                  className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 ${
                                    isSelected
                                      ? colorStyle.borderActive
                                      : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${colorStyle.iconBg}`}>
                                      <Icon size={20} />
                                    </div>

                                    <div
                                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                                        isSelected
                                          ? `border-current ${colorStyle.text} bg-surface`
                                          : "border-border text-transparent"
                                      }`}
                                    >
                                      {isSelected && <div className={`h-2.5 w-2.5 rounded-full ${colorStyle.text === "text-cyan" ? "bg-cyan" : colorStyle.text === "text-amber-400" ? "bg-amber-400" : colorStyle.text === "text-emerald-400" ? "bg-emerald-400" : colorStyle.text === "text-purple-400" ? "bg-purple-400" : "bg-rose-400"}`} />}
                                    </div>
                                  </div>

                                  <div className="mt-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-display font-semibold text-foreground">
                                        {type.title}
                                      </span>
                                    </div>
                                    <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                                      {type.desc}
                                    </p>
                                  </div>

                                  <div className="mt-3 pt-2 border-t border-border/30">
                                    <span className={`inline-block rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${colorStyle.badge}`}>
                                      {type.tag}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP 2: What are you trying to achieve? ─── */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: direction * 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 30 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                          <div>
                            <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-400">
                              STEP 2 OF 5
                            </span>
                            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                              What are you trying to achieve?
                            </h2>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              What&apos;s the main reason for your project? Pick one or more goals (or tell us what&apos;s most important to you).
                            </p>
                          </div>

                          <div className="shrink-0 rounded-lg border border-cyan/30 bg-cyan/10 px-3.5 py-2 font-mono text-xs text-cyan">
                            Think about what success looks like for you. 💡
                          </div>
                        </div>

                        {/* Goals Grid with mixed vibrant colors */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {GOAL_OPTIONS.map((goal) => {
                            const Icon = goal.icon;
                            const isSelected = selectedGoals.includes(goal.id);
                            const colorStyle = COLOR_STYLES[goal.color];

                            return (
                              <button
                                type="button"
                                key={goal.id}
                                onClick={() => toggleGoal(goal.id)}
                                className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 ${
                                  isSelected
                                    ? colorStyle.borderActive
                                    : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${colorStyle.iconBg}`}>
                                    <Icon size={20} />
                                  </div>

                                  <div
                                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                                      isSelected
                                        ? `border-current ${colorStyle.text} bg-surface`
                                        : "border-border text-transparent"
                                      }`}
                                  >
                                    {isSelected && <Check size={13} strokeWidth={3} />}
                                  </div>
                                </div>

                                <div className="mt-4 space-y-1">
                                  <h4 className="font-display font-semibold text-foreground">
                                    {goal.title}
                                  </h4>
                                  <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                                    {goal.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Expandable Difficulties Callout */}
                        <div className="rounded-xl border border-border/80 bg-surface-2/40 p-4 transition-all">
                          <button
                            type="button"
                            onClick={() => setShowPainPointInput(!showPainPointInput)}
                            className="flex w-full items-center justify-between font-mono text-xs text-foreground hover:text-cyan"
                          >
                            <span className="flex items-center gap-2">
                              <MessageSquare size={14} className="text-amber-400" />
                              <strong className="text-amber-400">Not sure?</strong> Tell us what&apos;s difficult today.
                              <span className="text-muted-foreground hidden sm:inline">(e.g. getting more traffic, managing bookings, or keeping content updated)</span>
                            </span>
                            <span className="text-cyan font-bold">{showPainPointInput ? "− Close" : "+ Add details"}</span>
                          </button>

                          {showPainPointInput && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-3"
                            >
                              <textarea
                                value={painPoints}
                                onChange={(e) => setPainPoints(e.target.value)}
                                rows={3}
                                placeholder="Describe current bottlenecks, pain points, or questions you have..."
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP 3: What should the project include? ─── */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: direction * 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 30 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                          <div>
                            <span className="inline-block rounded-full border border-purple-400/40 bg-purple-400/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-purple-400">
                              STEP 3 OF 5
                            </span>
                            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                              What should the project include?
                            </h2>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              Select the features you need, or tell us what you&apos;re not sure about. We&apos;ll recommend the right architecture for you.
                            </p>
                          </div>

                          <div className="shrink-0 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 font-mono text-xs text-emerald-300">
                            Pick what you need — we can always adjust later. 🛠️
                          </div>
                        </div>

                        {/* Features Matrix with rich individual colors */}
                        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                          {FEATURE_OPTIONS.map((feat) => {
                            const Icon = feat.icon;
                            const isSelected = selectedFeatures.includes(feat.id);
                            const colorStyle = COLOR_STYLES[feat.color];

                            return (
                              <button
                                type="button"
                                key={feat.id}
                                onClick={() => toggleFeature(feat.id)}
                                className={`group relative flex items-start gap-3.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                                  isSelected
                                    ? colorStyle.borderActive
                                    : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                }`}
                              >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${colorStyle.iconBg}`}>
                                  <Icon size={18} />
                                </div>

                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-display text-sm font-semibold text-foreground">
                                      {feat.title}
                                    </span>
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                                        isSelected
                                          ? `border-current ${colorStyle.text} bg-surface`
                                          : "border-border text-transparent"
                                      }`}
                                    >
                                      {isSelected && <Check size={11} strokeWidth={3} />}
                                    </div>
                                  </div>
                                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                                    {feat.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Special AI Recommendation Option */}
                        <button
                          type="button"
                          onClick={() => setRecommendFits(!recommendFits)}
                          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                            recommendFits
                              ? "border-cyan bg-gradient-to-r from-cyan/20 via-purple-500/20 to-amber-400/20 shadow-[0_0_25px_rgba(0,240,255,0.25)]"
                              : "border-border/80 bg-surface-2/40 hover:border-cyan/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/15 text-cyan border border-cyan/30">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <div className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                                <span>I don&apos;t know — recommend what fits</span>
                                <span className="rounded bg-cyan/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">AI Guided</span>
                              </div>
                              <p className="font-mono text-xs text-muted-foreground">
                                We&apos;ll formulate the optimal feature stack tailored to your target goals and budget.
                              </p>
                            </div>
                          </div>

                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                              recommendFits ? "border-cyan bg-cyan text-slate-950" : "border-border"
                            }`}
                          >
                            {recommendFits && <Check size={12} strokeWidth={3} />}
                          </div>
                        </button>
                      </motion.div>
                    )}

                    {/* ─── STEP 4: Style, content & examples ─── */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: direction * 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 30 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                          <div>
                            <span className="inline-block rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-rose-400">
                              STEP 4 OF 5
                            </span>
                            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                              Style, content & examples
                            </h2>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              This helps us design a look and structure that matches your brand and audience. No worries — you can always update these later.
                            </p>
                          </div>

                          <div className="shrink-0 rounded-lg border border-purple-400/30 bg-purple-400/10 px-3.5 py-2 font-mono text-xs text-purple-300">
                            Show us what you like! 🎨
                          </div>
                        </div>

                        {/* 1. Visual Style */}
                        <div className="space-y-3">
                          <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                            1. Visual Style
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {STYLE_OPTIONS.map((style) => {
                              const isSelected = visualStyle === style.id;

                              return (
                                <button
                                  type="button"
                                  key={style.id}
                                  onClick={() => setVisualStyle(style.id)}
                                  className={`rounded-xl border p-4 text-left transition-all bg-gradient-to-br ${style.bgGradient} ${
                                    isSelected
                                      ? `${style.borderColor} ring-1 ring-cyan shadow-lg`
                                      : "border-border/60 hover:border-border"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`font-display text-sm font-bold ${style.accent}`}>
                                      {style.name}
                                    </span>
                                    {isSelected && (
                                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan text-slate-950">
                                        <Check size={11} strokeWidth={3} />
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 font-mono text-[11px] text-muted-foreground leading-relaxed">
                                    {style.desc}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Reference Websites */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                              2. Reference websites (Optional)
                            </label>
                            <span className="font-mono text-xs text-muted-foreground">
                              Share links to websites you like
                            </span>
                          </div>

                          <div className="space-y-2">
                            {referenceUrls.map((url, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <Link2 size={14} className="absolute left-3.5 top-3 text-cyan" />
                                  <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleUpdateReference(idx, e.target.value)}
                                    placeholder="e.g. https://example.com"
                                    className="w-full rounded-lg border border-border/80 bg-surface-2 pl-9 pr-3.5 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                  />
                                </div>
                                {referenceUrls.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveReference(idx)}
                                    className="p-2 text-muted-foreground hover:text-signal-red"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={handleAddReference}
                              className="inline-flex items-center gap-1.5 rounded border border-border/60 bg-surface-2/60 px-3 py-1.5 font-mono text-xs text-cyan hover:bg-surface-3 transition-colors"
                            >
                              <Plus size={13} />
                              <span>Add another link</span>
                            </button>
                          </div>
                        </div>

                        {/* 3. Brand Assets & Current Website */}
                        <div className="grid gap-6 md:grid-cols-2 pt-2">
                          {/* File Uploader */}
                          <div className="space-y-2">
                            <label className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                              3. Existing Logo / Brand Assets (Optional)
                            </label>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept=".png,.jpg,.jpeg,.svg,.pdf,.zip"
                              className="hidden"
                            />
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-surface-2/40 p-5 text-center cursor-pointer transition-colors hover:border-cyan/60 hover:bg-surface-2/80"
                            >
                              <Upload size={22} className="text-cyan mb-2" />
                              <div className="font-mono text-xs text-foreground font-semibold">
                                {uploadedFileName ? uploadedFileName : "Drag & drop files here or click to upload"}
                              </div>
                              <span className="font-mono text-[10px] text-muted-foreground mt-1">
                                PNG, JPG, PDF, SVG up to 15MB
                              </span>
                            </div>
                          </div>

                          {/* Current Website */}
                          <div className="space-y-2">
                            <label className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                              4. Current Website URL (Optional)
                            </label>
                            <div className="relative">
                              <Globe size={14} className="absolute left-3.5 top-3.5 text-amber-400" />
                              <input
                                type="url"
                                value={currentWebsite}
                                onChange={(e) => setCurrentWebsite(e.target.value)}
                                placeholder="e.g. https://yourwebsite.com"
                                className="w-full rounded-lg border border-border/80 bg-surface-2 pl-9 pr-3.5 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                              />
                            </div>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              If you already have a website, share the link so we can review your current setup.
                            </p>
                          </div>
                        </div>

                        {/* 5. Content Readiness */}
                        <div className="space-y-3 pt-2">
                          <label className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                            5. Content Readiness: Do you have text, images and content ready?
                          </label>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {[
                              { id: "ready", label: "I have content", desc: "Ready to go!", color: "emerald" as const },
                              { id: "help", label: "Need help", desc: "We'll create it for you", color: "amber" as const },
                              { id: "discuss", label: "Not sure", desc: "Let's discuss it", color: "purple" as const },
                            ].map((item) => {
                              const isSelected = contentReadiness === item.id;
                              const colorStyle = COLOR_STYLES[item.color];

                              return (
                                <button
                                  type="button"
                                  key={item.id}
                                  onClick={() => setContentReadiness(item.id as "ready" | "help" | "discuss")}
                                  className={`rounded-xl border p-3.5 text-left transition-all ${
                                    isSelected
                                      ? colorStyle.borderActive
                                      : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-display font-semibold text-foreground text-sm">
                                      {item.label}
                                    </span>
                                    {isSelected && <Check size={13} className={colorStyle.text} />}
                                  </div>
                                  <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                                    {item.desc}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP 5: Timeline, budget & review ─── */}
                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: direction * 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 30 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                          <div>
                            <span className="inline-block rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                              STEP 5 OF 5
                            </span>
                            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                              Timeline, budget & review
                            </h2>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              A few final details to help us plan the right approach for your project.
                            </p>
                          </div>

                          <div className="shrink-0 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3.5 py-2 font-mono text-xs text-amber-300">
                            Almost there! Just a few more details. ⭐
                          </div>
                        </div>

                        {/* 1. Budget Range & 2. Timeline & 3. Urgency */}
                        <div className="grid gap-6 lg:grid-cols-3">
                          {/* Budget Range */}
                          <div className="space-y-3">
                            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                              1. Budget Range
                            </h3>
                            <div className="space-y-2">
                              {[
                                { range: "$1,000 – $3,000", sub: "Starter / Basic MVP", color: "cyan" as const },
                                { range: "$3,000 – $5,000", sub: "Small website / standard features", color: "amber" as const },
                                { range: "$5,000 – $10,000", sub: "Business website / full features", color: "emerald" as const },
                                { range: "$10,000+", sub: "Advanced features / web app", color: "purple" as const },
                                { range: "Flexible / Let's discuss", sub: "Open to recommendation", color: "sky" as const },
                              ].map((b) => {
                                const isSelected = budgetRange === b.range;
                                const colorStyle = COLOR_STYLES[b.color];

                                return (
                                  <button
                                    type="button"
                                    key={b.range}
                                    onClick={() => setBudgetRange(b.range)}
                                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                                      isSelected
                                        ? colorStyle.borderActive
                                        : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                    }`}
                                  >
                                    <div>
                                      <div className="font-display text-xs font-bold text-foreground">
                                        {b.range}
                                      </div>
                                      <div className="font-mono text-[10px] text-muted-foreground">
                                        {b.sub}
                                      </div>
                                    </div>
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                        isSelected ? "border-current " + colorStyle.text : "border-border"
                                      }`}
                                    >
                                      {isSelected && <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Target Timeline */}
                          <div className="space-y-3">
                            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                              2. Target Launch Timeline
                            </h3>
                            <div className="space-y-2">
                              {[
                                { t: "Within 1 month", sub: "Quick turnaround", color: "rose" as const },
                                { t: "1–3 months", sub: "Standard timeline", color: "amber" as const },
                                { t: "3+ months", sub: "More flexibility", color: "emerald" as const },
                              ].map((item) => {
                                const isSelected = targetTimeline === item.t;
                                const colorStyle = COLOR_STYLES[item.color];

                                return (
                                  <button
                                    type="button"
                                    key={item.t}
                                    onClick={() => setTargetTimeline(item.t)}
                                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                                      isSelected
                                        ? colorStyle.borderActive
                                        : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                    }`}
                                  >
                                    <div>
                                      <div className="font-display text-xs font-bold text-foreground">
                                        {item.t}
                                      </div>
                                      <div className="font-mono text-[10px] text-muted-foreground">
                                        {item.sub}
                                      </div>
                                    </div>
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                        isSelected ? "border-current " + colorStyle.text : "border-border"
                                      }`}
                                    >
                                      {isSelected && <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Urgency */}
                          <div className="space-y-3">
                            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                              3. Urgency
                            </h3>
                            <div className="space-y-2">
                              {[
                                { u: "high" as const, label: "High", sub: "Need it soon", color: "rose" as const },
                                { u: "medium" as const, label: "Medium", sub: "Would like it soon", color: "amber" as const },
                                { u: "low" as const, label: "Low", sub: "No rush", color: "emerald" as const },
                              ].map((item) => {
                                const isSelected = urgency === item.u;
                                const colorStyle = COLOR_STYLES[item.color];

                                return (
                                  <button
                                    type="button"
                                    key={item.u}
                                    onClick={() => setUrgency(item.u)}
                                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                                      isSelected
                                        ? colorStyle.borderActive
                                        : `border-border/60 bg-surface-2/60 ${colorStyle.borderHover}`
                                    }`}
                                  >
                                    <div>
                                      <div className="font-display text-xs font-bold text-foreground">
                                        {item.label}
                                      </div>
                                      <div className="font-mono text-[10px] text-muted-foreground">
                                        {item.sub}
                                      </div>
                                    </div>
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                        isSelected ? "border-current " + colorStyle.text : "border-border"
                                      }`}
                                    >
                                      {isSelected && <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Live Holographic Project Summary Box */}
                        <div className="rounded-xl border border-cyan/40 bg-surface-2/70 p-5 shadow-lg space-y-4">
                          <div className="flex items-center justify-between border-b border-cyan/20 pb-3">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan">
                              <Sparkles size={14} />
                              <span>Project Summary & Proposal Guarantee</span>
                            </div>
                            <span className="font-mono text-[10px] text-signal-green flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" /> 24h Delivery
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-[10px] uppercase">Client:</span>
                              <p className="font-semibold text-foreground truncate">{name || "Pending..."}</p>
                              <p className="text-[10px] text-cyan truncate">{email || "Email pending"}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-[10px] uppercase">System Type:</span>
                              <p className="font-semibold text-foreground">{selectedBuildInfo.title}</p>
                              <p className="text-[10px] text-amber-400">{selectedGoals.length} goals selected</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-[10px] uppercase">Feature Scope:</span>
                              <p className="font-semibold text-foreground">{selectedFeatures.length} features chosen</p>
                              <p className="text-[10px] text-purple-400 capitalize">Style: {visualStyle}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-[10px] uppercase">Budget & Launch:</span>
                              <p className="font-semibold text-emerald-400">{budgetRange}</p>
                              <p className="text-[10px] text-muted-foreground">{targetTimeline} • {urgency.toUpperCase()}</p>
                            </div>
                          </div>

                          <p className="font-mono text-xs text-muted-foreground border-t border-border/40 pt-3">
                            Based on your answers, we&apos;ll prepare a detailed proposal with the best technical approach, features, architecture breakdown, timeline, and a transparent quote. You&apos;ll receive it within 24 hours.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Bottom Navigation Buttons ─── */}
                    <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className={`inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                          currentStep === 1
                            ? "opacity-30 cursor-not-allowed text-muted-foreground"
                            : "bg-surface-2 text-foreground hover:bg-surface-3 hover:border-cyan/40"
                        }`}
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>

                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 rounded-lg border border-cyan/60 bg-cyan px-7 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-soft hover:shadow-[0_0_20px_var(--cyan-glow)] active:scale-95"
                        >
                          <span>Continue</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            No obligation. Just a clear plan.
                          </span>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-lg border border-amber-400 bg-gradient-to-r from-cyan via-amber-400 to-signal-green px-8 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] active:scale-95 disabled:opacity-50"
                          >
                            {submitting ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Transmitting Brief...</span>
                              </>
                            ) : (
                              <>
                                <Rocket size={15} />
                                <span>Review Request & Send to Hajith</span>
                                <ArrowRight size={14} />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Bottom Trust Bar (Always visible) ─── */}
            <div className="border-t border-cyan/15 bg-black/40 px-6 py-4 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-cyan shrink-0" />
                  <span>Plain language, no jargon</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-amber-400 shrink-0" />
                  <span>We&apos;re here to guide you</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-purple-400 shrink-0" />
                  <span>Your idea is safe (100% NDA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-emerald-400 shrink-0" />
                  <span>Fast response & clear next steps</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Real Systems & Blueprint Inspiration (Collapsible Case Studies) ─── */}
          <div className="mt-12 rounded-xl border border-cyan/20 bg-surface/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-cyan flex items-center gap-1.5">
                  <FileCode size={13} />
                  <span>Verified Architectures & Case Studies</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Need real-world inspiration? Explore systems built by Mohamed Hajith
                </h3>
              </div>
              <Link
                href="/projects"
                className="font-mono text-xs text-cyan hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View all public repositories</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 font-mono text-xs">
              <div className="rounded-lg border border-border/60 bg-surface-2/60 p-4 space-y-2">
                <span className="rounded bg-cyan/10 border border-cyan/30 px-2 py-0.5 text-[9px] uppercase tracking-widest text-cyan font-bold">
                  E-Commerce Storefront
                </span>
                <h4 className="font-display font-semibold text-foreground text-sm">Saga Elite Web Store</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Full-stack e-commerce catalog with 100+ commits, Cart & Checkout, Redux Toolkit, and automated order intake.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-surface-2/60 p-4 space-y-2">
                <span className="rounded bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[9px] uppercase tracking-widest text-amber-400 font-bold">
                  Wholesale ERP System
                </span>
                <h4 className="font-display font-semibold text-foreground text-sm">Footwear Business Management</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Custom operational ERP with supplier tracking, landed cost calculation, invoices, and role-based staff access.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-surface-2/60 p-4 space-y-2">
                <span className="rounded bg-purple-400/10 border border-purple-400/30 px-2 py-0.5 text-[9px] uppercase tracking-widest text-purple-400 font-bold">
                  Educational Web Platform
                </span>
                <h4 className="font-display font-semibold text-foreground text-sm">Tech Bridge Knowledge Hub</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Interactive multi-discipline educational system with resource directories, fast search, and responsive layout.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <CommandFooter />
    </div>
  );
}
