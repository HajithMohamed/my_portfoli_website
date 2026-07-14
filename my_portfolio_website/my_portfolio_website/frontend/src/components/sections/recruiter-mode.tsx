"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X, Download, Github, Mail, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile, Skill, Project, GithubSummary, CvAsset } from "@/lib/types";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface RecruiterModeProps {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  github: GithubSummary;
  resume: CvAsset | null;
}

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

  const topSkills = skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 8);
  const techFilters = [...new Set(projects.flatMap((p) => p.techStack))].slice(0, 10);

  return (
    <>
      {/* Toggle button - floats in corner */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
        title="Toggle Recruiter Mode"
      >
        <Briefcase className="h-4 w-4" />
        <span className="hidden sm:inline">Recruiter Mode</span>
        {isOpen && <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
      </button>

      {/* Recruiter Mode overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-lg overflow-y-auto bg-slate-950/95 backdrop-blur-xl border-l border-white/10 shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Recruiter Mode</span>
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Tailored summary for hiring teams</p>
              </div>
              <button
                onClick={toggle}
                className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-7">
              {/* Profile summary */}
              <div>
                <Badge className="mb-3">Profile</Badge>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-blue-300 mt-1 text-sm">{profile.title}</p>
                <p className="text-slate-400 text-sm leading-6 mt-3">{profile.bio}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {profile.availabilityStatus}
                </div>
              </div>

              {/* Key stats */}
              <div>
                <Badge className="mb-3">At a Glance</Badge>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Repositories", value: github.repositoryCount },
                    { label: "Projects", value: projects.length },
                    { label: "Technologies", value: skills.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center">
                      <div className="text-xl font-bold text-white">
                        <AnimatedCounter value={value} />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top skills */}
              <div>
                <Badge className="mb-3">Technical Stack</Badge>
                <div className="space-y-2">
                  {topSkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{skill.name}</span>
                        <span className="text-slate-500">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <Badge className="mb-3">Key Projects</Badge>
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-white">{project.title}</span>
                        <span className="text-xs text-blue-400 flex-shrink-0">{project.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-5 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.slice(0, 4).map((t) => (
                          <span key={t} className="text-xs bg-white/5 rounded px-1.5 py-0.5 text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Philosophy */}
              <div>
                <Badge className="mb-3">Engineering Philosophy</Badge>
                <p className="text-sm text-slate-300 leading-7">{profile.philosophy}</p>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pb-6">
                {resume?.fileUrl && (
                  <ButtonLink href={resume.fileUrl} size="lg" className="w-full">
                    <Download className="h-4 w-4" />
                    Download Resume
                  </ButtonLink>
                )}
                <ButtonLink href={`mailto:${profile.email}`} variant="secondary" size="lg" className="w-full">
                  <Mail className="h-4 w-4" />
                  Send an Email
                </ButtonLink>
                <ButtonLink href="https://github.com/HajithMohamed" variant="ghost" size="lg" className="w-full">
                  <Github className="h-4 w-4" />
                  View GitHub
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
