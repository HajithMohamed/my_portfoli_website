"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  X,
  Download,
  Github,
  Mail,
  Linkedin,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  Code2,
  Database,
  Layers,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile, Skill, Project, GithubSummary, CvAsset } from "@/lib/types";
import { PERSONAL_IDENTITY } from "@/lib/identity";

interface RecruiterModeProps {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  github: GithubSummary;
  resume: CvAsset | null;
}

interface RecruiterProjectHighlight {
  title: string;
  category: string;
  role: string;
  contribution: string;
  tech: string[];
  repoUrl: string;
  caseStudyUrl: string;
}

const FEATURED_RECRUITER_PROJECTS: RecruiterProjectHighlight[] = [
  {
    title: "Saga Elite — E-Commerce Platform",
    category: "Full-Stack · Teamwork",
    role: "Team Lead & Full-Stack Developer (4-person team)",
    contribution:
      "Led application architecture and authored core REST APIs. Implemented JWT auth, Socket.IO inventory updates, OCR payment receipt verification, and Playwright CI test pipelines.",
    tech: ["React", "Redux", "Node.js", "Express", "MongoDB", "Socket.IO", "Playwright"],
    repoUrl: "https://github.com/Hz-Labs-studio/Saga-Elite-Web-project",
    caseStudyUrl: "/projects/saga-elite",
  },
  {
    title: "BenchBook — Lab Reservation System",
    category: "PostgreSQL · Concurrency & Testing",
    role: "Independent Full-Stack Developer",
    contribution:
      "Engineered reservation workflows with database-level PostgreSQL exclusion constraints to guarantee zero double-bookings under concurrent requests. Automated with Vitest suites.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vitest", "Tailwind CSS"],
    repoUrl: "https://github.com/HajithMohamed/Medical-Lab-Resource-Reservation-System",
    caseStudyUrl: "/projects/benchbook",
  },
  {
    title: "BloodBridge — ADBMS Prototype",
    category: "Transactions · PL/pgSQL",
    role: "Database Engineering Contributor (Merged PR #7)",
    contribution:
      "Authored PL/pgSQL stored procedures and atomic transaction safeguards to guarantee multi-table blood unit transfer integrity. Academic demonstration prototype.",
    tech: ["PostgreSQL", "PL/pgSQL", "Node.js", "React", "Docker", "CI/CD"],
    repoUrl: "https://github.com/akalanka001/-BloodBridge--ADBMS",
    caseStudyUrl: "/projects/bloodbridge",
  },
];

const VERIFIED_TECH_GROUPS = [
  {
    label: "Languages & Core",
    items: ["TypeScript", "JavaScript", "SQL", "PHP", "Java"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Redux Toolkit"],
  },
  {
    label: "Backend & APIs",
    items: ["Node.js", "Express", "NestJS", "REST APIs", "Prisma"],
  },
  {
    label: "Databases & Storage",
    items: ["PostgreSQL", "MySQL", "MongoDB", "PL/pgSQL"],
  },
  {
    label: "Testing & DevOps",
    items: ["Vitest", "Playwright", "Docker", "Git", "GitHub Actions"],
  },
];

export function RecruiterMode({ profile, skills, projects, github, resume }: RecruiterModeProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recruiter-mode");
    if (stored === "true") setIsOpen(true);
  }, []);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem("recruiter-mode", String(next));
  };

  const cvDownloadUrl = resume?.fileUrl || "/api/cv";

  return (
    <>
      {/* Recruiter HUD Floating Trigger */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center touch-target gap-2 border border-cyan/50 bg-slate-950/90 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-cyan shadow-lg shadow-cyan/20 backdrop-blur-md transition-all duration-300 hover:bg-cyan/10 hover:shadow-cyan/40"
        title="Toggle Recruiter Quick View"
        aria-label="Toggle Recruiter Mode"
      >
        <Briefcase className="h-4 w-4 text-cyan" />
        <span className="hidden sm:inline font-semibold">Recruiter Quick-View</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Recruiter Mode Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl shadow-black/80"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-cyan" />
                  <span className="text-sm font-semibold text-white tracking-wide">Recruiter Quick-View</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified technical evidence &amp; internship candidacy summary
                </p>
              </div>
              <button
                onClick={toggle}
                className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close Recruiter Mode"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-7">
              {/* Recruiter Summary Card */}
              <div className="rounded-xl border border-cyan/30 bg-cyan/[0.04] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="border-cyan/40 bg-cyan/10 text-cyan">Candidate Summary</Badge>
                  <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Open to Internships
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h2>
                  <p className="text-cyan text-sm font-medium mt-0.5">
                    Full-Stack Software Developer | Backend &amp; Database Engineering
                  </p>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-slate-300 pt-1">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>{PERSONAL_IDENTITY.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Focus: Scalable REST APIs, Relational Schema Design, Concurrency, CI/CD</span>
                  </div>
                </div>

                {/* Quick Action Links inside Header Card */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <ButtonLink href={cvDownloadUrl} download size="sm" className="w-full justify-center">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CV</span>
                  </ButtonLink>
                  <ButtonLink
                    href={`mailto:${profile.email || PERSONAL_IDENTITY.email}`}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email Direct</span>
                  </ButtonLink>
                </div>
              </div>

              {/* Verified Technical Stack (Evidence-based, no arbitrary percentages) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-300">
                    Hands-On Technical Stack
                  </Badge>
                  <span className="font-mono text-xs text-slate-400">Project-Verified</span>
                </div>

                <div className="space-y-3">
                  {VERIFIED_TECH_GROUPS.map((group) => (
                    <div
                      key={group.label}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1.5"
                    >
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {group.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 3 Projects & Personal Contributions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Key Projects &amp; Contributions
                  </Badge>
                  <span className="font-mono text-xs text-slate-400">Architectural Evidence</span>
                </div>

                <div className="space-y-3.5">
                  {FEATURED_RECRUITER_PROJECTS.map((proj) => (
                    <div
                      key={proj.title}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2 hover:border-cyan/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                        <span className="font-mono text-[11px] text-cyan shrink-0">{proj.category}</span>
                      </div>

                      <p className="font-mono text-xs text-violet-300 font-medium">{proj.role}</p>

                      <p className="text-xs text-slate-300 leading-relaxed">{proj.contribution}</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-white/5 border border-white/5 px-1.5 py-0.5 font-mono text-[11px] text-slate-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-white/5">
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-cyan hover:underline"
                        >
                          <Github className="h-3 w-3" />
                          <span>View Code</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        <ButtonLink href={proj.caseStudyUrl} variant="ghost" size="sm">
                          <span>Case Study</span>
                        </ButtonLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineering Approach / Philosophy */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <Badge className="border-slate-700 bg-slate-800 text-slate-300">Engineering Approach</Badge>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  I prioritize relational database constraints over optimistic application logic, write comprehensive automated test suites (Vitest &amp; Playwright) to prevent regressions, and design clear domain boundaries for maintainable team workflows.
                </p>
              </div>

              {/* Direct Recruiter Actions */}
              <div className="space-y-2.5 pt-2 pb-8 border-t border-white/10">
                <ButtonLink href={cvDownloadUrl} download size="lg" className="w-full justify-center">
                  <Download className="h-4 w-4" />
                  <span>Download Curriculum Vitae (PDF)</span>
                </ButtonLink>

                <ButtonLink
                  href={`mailto:${profile.email || PERSONAL_IDENTITY.email}`}
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Direct Email</span>
                </ButtonLink>

                <div className="grid grid-cols-2 gap-2.5">
                  <ButtonLink
                    href={PERSONAL_IDENTITY.linkedInUrl}
                    variant="outline"
                    size="md"
                    className="w-full justify-center"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </ButtonLink>

                  <ButtonLink
                    href={PERSONAL_IDENTITY.githubUrl}
                    variant="outline"
                    size="md"
                    className="w-full justify-center"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub Profile</span>
                  </ButtonLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
