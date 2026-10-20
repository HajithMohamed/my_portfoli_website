import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getHomeData } from "@/lib/public-data";
import { PERSONAL_IDENTITY } from "@/lib/identity";

export const metadata = {
  title: "About Mohamed Hajith | Software Engineer & Systems Builder",
  description:
    "Software Engineer with a Bachelor of Information and Communication Technology (Honours) from the University of Ruhuna. Specializing in Web Development, Flutter Mobile Apps, Backend APIs, and AI Automations.",
};

const TIMELINE_MILESTONES = [
  {
    year: "2026",
    title: "Lead Full-Stack Engineer & Studio Founder",
    org: "HZ Labs Digital Product Studio",
    desc: "Architecting high-performance web platforms, microservices, and bespoke software solutions with Next.js 16, NestJS, and cloud infrastructure.",
    badge: "Current Lead",
    badgeColor: "border-cyan/40 bg-cyan/10 text-cyan",
  },
  {
    year: "2024 – 2025",
    title: "Lead Enterprise Architect — Footwear BMS (Shoe Bank)",
    org: "Wholesale Footwear Industry",
    desc: "Engineered an end-to-end wholesale enterprise resource system with automated invoice generation, supplier tracking, inventory reservations, and role-based staff portals.",
    badge: "Enterprise Production",
    badgeColor: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  },
  {
    year: "2023 – 2024",
    title: "Cross-Platform Mobile & Voice AI Engineering",
    org: "Goyo Elite & NextGen Mobile",
    desc: "Developed fluid native 60fps Flutter mobile applications and low-latency speech pipelines using Python, PyTorch, and WebAudio.",
    badge: "Mobile & AI",
    badgeColor: "border-purple-400/40 bg-purple-400/10 text-purple-400",
  },
  {
    year: "2021 – 2026",
    title: "Bachelor of Information and Communication Technology (Honours)",
    org: "Faculty of Technology, University of Ruhuna",
    desc: "Rigorous academic study covering Data Structures, Algorithms, Software Architecture, Distributed Systems, Database Design, and Machine Learning.",
    badge: "Academic Degree",
    badgeColor: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  },
];

const CORE_PILLARS = [
  {
    icon: Code2,
    title: "Full-Stack Web Engineering",
    desc: "Modern reactive web platforms, SaaS dashboards, and Progressive Web Apps built with clean component architectures, state management, and strict TypeScript verification.",
    tools: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Framer Motion"],
    color: "cyan",
  },
  {
    icon: Server,
    title: "Backend & API Architecture",
    desc: "High-throughput RESTful and GraphQL APIs, microservices, and database models designed for reliability, strict validation, rate limiting, and containerized deployment.",
    tools: ["NestJS", "Node.js", "Express", "Spring Boot", "PostgreSQL", "Prisma", "Docker", "Redis"],
    color: "amber",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile",
    desc: "Native 60fps mobile applications engineered with Flutter and Dart, supporting offline caching, local SQLite storage, biometrics, and unified iOS/Android delivery.",
    tools: ["Flutter", "Dart", "Riverpod", "SQLite", "Firebase", "REST APIs"],
    color: "purple",
  },
  {
    icon: Cpu,
    title: "AI & Workflow Automation",
    desc: "Machine learning integration, low-latency speech pipelines, LLM APIs, and intelligent data extraction scripts that eliminate repetitive operational workflows.",
    tools: ["Python", "PyTorch", "FastAPI", "OpenAI / Claude APIs", "WebAudio", "Pandas"],
    color: "rose",
  },
];

export default async function AboutPage() {
  const { profile, resume, skills } = await getHomeData();

  return (
    <div className="relative min-h-screen selection:bg-cyan selection:text-slate-950">
      <TopBar location={profile.location} />

      <main className="relative z-10 pt-20 pb-28">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* ─── Hero Overview Dossier ─── */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-cyan/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-cyan">
                  <Terminal size={13} className="text-cyan animate-pulse" />
                  <span>ABOUT // MOHAMED HAJITH</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                  Building scalable digital products with engineering precision
                </h1>

                <p className="font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Software Engineer with a Bachelor of Information and Communication Technology (Honours) from the University of Ruhuna. Passionate about building robust web applications, high-performance mobile apps with Flutter, resilient backend APIs, and practical AI integrations.
                </p>

                {/* Identity Telemetry Chips */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                  <div className="flex items-center gap-1.5 rounded-lg border border-cyan/30 bg-surface-2/80 px-3 py-1.5 text-cyan">
                    <GraduationCap size={14} />
                    <span>{PERSONAL_IDENTITY.degree}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-purple-400/30 bg-surface-2/80 px-3 py-1.5 text-purple-300">
                    <BookOpen size={14} />
                    <span>{PERSONAL_IDENTITY.university}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-surface-2/80 px-3 py-1.5 text-emerald-300">
                    <MapPin size={14} />
                    <span>{PERSONAL_IDENTITY.shortLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-signal-green/40 bg-signal-green/10 px-3 py-1.5 text-signal-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" />
                    <span>Available for Roles & Projects</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0 w-full lg:w-auto font-mono text-xs uppercase tracking-wider">
                {resume?.fileUrl ? (
                  <a
                    href="/api/cv"
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan/50 bg-cyan px-6 py-3 font-bold text-slate-950 transition-all hover:bg-cyan-soft hover:shadow-[0_0_20px_var(--cyan-glow)]"
                  >
                    <Download size={14} />
                    <span>Download CV / Resume</span>
                  </a>
                ) : null}

                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 px-6 py-3 text-amber-300 transition-all hover:bg-amber-400/20 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                >
                  <Rocket size={14} />
                  <span>Start a Project</span>
                </Link>

                <Link
                  href="/certificates"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface-2/80 px-6 py-3 text-foreground transition-all hover:bg-surface-3 hover:border-cyan/40 hover:text-cyan"
                >
                  <Award size={14} />
                  <span>View Verified Credentials</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ─── Engineering Philosophy ─── */}
          <section className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                // ENGINEERING DOCTRINE
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                Software Philosophy & Working Principles
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3 font-mono text-xs">
              <div className="rounded-2xl border border-cyan/20 bg-surface/80 p-6 space-y-3 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Architecture First, Code Second
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every project starts with strict data modeling, clear API contracts, and modular interfaces. Clean foundations avoid technical debt and enable effortless scaling as user demand grows.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-surface/80 p-6 space-y-3 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  User Experience is Engineering
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fast sub-second interactions, fluid responsive layouts, micro-animations, and accessible feedback aren&apos;t visual afterthoughts — they are core performance requirements.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-400/20 bg-surface/80 p-6 space-y-3 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-400/10 text-purple-400">
                  <Terminal size={20} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Radical Transparency & Delivery
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Live GitHub telemetry, transparent commit histories, automated CI/CD builds, and 24-hour SLA responses ensure clients and teams have total clarity at every milestone.
                </p>
              </div>
            </div>
          </section>

          {/* ─── Career Journey & Education Timeline ─── */}
          <section className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                // CHRONOLOGICAL MILESTONES
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                Career Journey & Academic Milestones
              </h2>
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
              {TIMELINE_MILESTONES.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing orbital node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan bg-slate-950 shadow-[0_0_10px_var(--cyan)] transition-transform group-hover:scale-125" />

                  <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-surface/60 p-5 sm:p-6 backdrop-blur-xl transition-all hover:border-cyan/30 hover:bg-surface-2/60">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan">{item.year}</span>
                        <span className="text-white/30">•</span>
                        <span className="font-mono text-xs text-muted-foreground">{item.org}</span>
                      </div>
                      <span className={`rounded px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>

                    <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Core Competency Pillars ─── */}
          <section className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                // SYSTEM COMPETENCIES
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                Technical Disciplines & Tooling Radar
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {CORE_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface/70 p-6 backdrop-blur-xl space-y-4 hover:border-cyan/40 transition-all hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
                          <Icon size={20} />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {pillar.title}
                        </h3>
                      </div>

                      <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {pillar.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-slate-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── Recruiter Briefing & Direct Inquiries ─── */}
          <section className="rounded-3xl border border-cyan/30 bg-gradient-to-r from-cyan/10 via-surface-2/80 to-purple-500/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan">
                  <Mail size={14} />
                  <span>DIRECT RECRUITER & CLIENT ACCESS</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Ready to collaborate on your next breakthrough?
                </h2>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Whether you are hiring for full-stack engineering roles, seeking a mobile app developer, or need an end-to-end web platform delivered under a 24-hour turnaround plan, let&apos;s formulate the ideal solution.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0 font-mono text-xs uppercase tracking-wider">
                <Link
                  href="/start-project"
                  className="rounded-xl border border-cyan bg-cyan px-7 py-3.5 font-bold text-slate-950 transition-all hover:bg-cyan-soft hover:shadow-[0_0_20px_var(--cyan-glow)]"
                >
                  Start Project Request
                </Link>

                <a
                  href={`mailto:${profile.email}?subject=Software%20Engineering%20Inquiry%20from%20Portfolio`}
                  className="rounded-xl border border-border bg-surface-2 px-7 py-3.5 text-foreground hover:bg-surface-3 hover:border-cyan/40 transition-colors"
                >
                  Send Direct Email
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      <CommandFooter profile={profile} />
    </div>
  );
}
