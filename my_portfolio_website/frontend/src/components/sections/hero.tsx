"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Github, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { useTypewriter } from "@/lib/hooks";

type HeroStat = { label: string; value: number };

type HeroProps = {
  name: string;
  availabilityStatus: string;
  summary: string;
  roles: string[];
  resumeUrl?: string | null;
  githubUrl: string;
  stats: HeroStat[];
  architecture: string[];
};

const TECH_CHIPS = ["React", "Next.js", "NestJS", "PostgreSQL", "Docker", "Prisma"];

const CODE_LINES = [
  "const engineer = {",
  "  stack: ['Next.js', 'NestJS', 'Postgres'],",
  "  focus: 'scalable web platforms',",
  "  status: 'shipping',",
  "};",
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  name,
  availabilityStatus,
  summary,
  roles,
  resumeUrl,
  githubUrl,
  stats,
  architecture,
}: HeroProps) {
  const typed = useTypewriter(roles);

  return (
    <section id="home" className="engineering-grid relative border-b border-white/10">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-0 right-1/5 h-80 w-80 rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Badge>
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {availabilityStatus}
          </Badge>

          <p className="mt-7 text-sm font-medium uppercase tracking-[0.3em] text-blue-300/80">{name}</p>

          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl">
            I build as a
            <br />
            <span className="text-blue-400">{typed}</span>
            <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-1 animate-pulse bg-blue-400 align-middle" />
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={resumeUrl ?? "#contact"} size="lg">
              <Download className="h-4 w-4" />
              Download CV
            </ButtonLink>
            <ButtonLink href="#projects" size="lg" variant="secondary">
              View Projects
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={githubUrl} size="lg" variant="ghost">
              <Github className="h-4 w-4" />
              GitHub
            </ButtonLink>
          </div>

          <div className="mt-9 flex flex-wrap gap-2">
            {TECH_CHIPS.map((chip, index) => (
              <motion.span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40"
        >
          <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-400">portfolio-cms.hzlabs.dev</span>
            </div>
          </div>

          <div className="grid gap-4 p-5">
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div className="rounded-md border border-white/10 bg-[#0F172A] p-4" key={stat.label}>
                  <div className="text-2xl font-semibold text-white tabular-nums">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-white/10 bg-[#0F172A] p-4 font-mono text-xs leading-6">
              {CODE_LINES.map((line, index) => (
                <motion.div
                  key={line}
                  className="whitespace-pre text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.3 }}
                >
                  <span className="mr-3 select-none text-slate-600">{index + 1}</span>
                  {line}
                </motion.div>
              ))}
            </div>

            <div className="rounded-md border border-white/10 bg-[#0F172A] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white">System Architecture</span>
                <ShieldCheck className="h-4 w-4 text-blue-300" />
              </div>
              {architecture.map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 py-2 text-sm text-slate-300"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 text-xs text-blue-200">
                    {index + 1}
                  </span>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
