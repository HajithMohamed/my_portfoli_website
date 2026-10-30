"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  Terminal,
  Filter,
  Sparkles,
  Hammer,
  GitFork,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { StudioProjectCard } from "@/components/projects/studio-project-card";
import styles from "@/components/projects/project-views.module.css";

type CategoryFilter = "ALL" | "FEATURED" | "BUILDING" | "CONTRIBUTED";

const POPULAR_TECHS = [
  "All",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PHP",
  "Docker",
  "Tailwind CSS",
  "MongoDB",
  "MySQL",
];

export function ProjectsCatalogueView({
  projects: sourceProjects,
}: {
  projects: Project[];
}) {
  const projects = useMemo(
    () =>
      sourceProjects.filter(
        (project) =>
          project.status === "ACTIVE" && project.showOnProjectsPage !== false,
      ),
    [sourceProjects],
  );
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("All");

  // Filter projects by category, search query, and technology
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Category Filter
      if (activeCategory === "FEATURED" && !project.featured) {
        return false;
      }
      if (activeCategory === "BUILDING") {
        if (!project.isCurrent) return false;
      }
      if (activeCategory === "CONTRIBUTED") {
        const isContributed = /group|academic|team|collaborat/i.test(
          project.category,
        );
        if (!isContributed) return false;
      }

      // 2. Technology Filter
      if (selectedTech !== "All") {
        const hasTech = project.techStack.some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase(),
        );
        if (!hasTech) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesTech = project.techStack.some((t) =>
          t.toLowerCase().includes(q),
        );
        const matchesCategory = (project.category ?? "")
          .toLowerCase()
          .includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTech && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [projects, activeCategory, selectedTech, searchQuery]);

  const resetFilters = () => {
    setActiveCategory("ALL");
    setSearchQuery("");
    setSelectedTech("All");
  };

  const isFiltered =
    activeCategory !== "ALL" || selectedTech !== "All" || searchQuery !== "";

  // Category counts
  const featuredCount = projects.filter((p) => p.featured).length;
  const buildingCount = projects.filter((p) => p.isCurrent).length;
  const contributedCount = projects.filter((p) =>
    /group|academic|team|collaborat/i.test(p.category),
  ).length;

  return (
    <div className="space-y-8">
      {/* 1. CONTROLS BAR: Category Tabs, Search Bar, Tech Filters */}
      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-surface/80 p-4 sm:p-6 backdrop-blur-xl">
        {/* Top Row: Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-4">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
              activeCategory === "ALL"
                ? "bg-white text-slate-950 font-bold shadow-md shadow-white/10"
                : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
            }`}
          >
            <Terminal size={12} />
            <span>All Projects</span>
            <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory("FEATURED")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
              activeCategory === "FEATURED"
                ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
            }`}
          >
            <Sparkles size={12} />
            <span>Featured</span>
            <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {featuredCount}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory("BUILDING")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
              activeCategory === "BUILDING"
                ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20"
                : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
            }`}
          >
            <Hammer size={12} />
            <span>Currently Building</span>
            <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {buildingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory("CONTRIBUTED")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
              activeCategory === "CONTRIBUTED"
                ? "bg-cyan text-slate-950 font-bold shadow-md shadow-cyan/20"
                : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
            }`}
          >
            <GitFork size={12} />
            <span>Contributed / Team</span>
            <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {contributedCount}
            </span>
          </button>
        </div>

        {/* Middle Row: Search Input & Tech Chips */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, stack, or keywords..."
              aria-label="Search projects"
              className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-9 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear project search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Technology Chips Slider */}
          <div className="flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 shrink-0 mr-1">
              <Filter size={11} /> Tech:
            </span>
            {POPULAR_TECHS.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider shrink-0 transition-colors ${
                  selectedTech === tech
                    ? "bg-cyan/15 text-cyan border border-cyan/40 font-semibold"
                    : "border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground hover:border-white/20"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RESULTS META BAR */}
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground px-1">
        <div>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredProjects.length}
          </span>{" "}
          of <span>{projects.length}</span> projects
        </div>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-cyan hover:underline"
          >
            <X size={12} />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* 3. PROJECT HORIZONTAL LIST OR EMPTY STATE */}
      {filteredProjects.length > 0 ? (
        <div className={styles.projectList}>
          {filteredProjects.map((project) => (
            <StudioProjectCard key={project.slug} project={project} lead />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-surface/50 p-12 text-center backdrop-blur-md">
          <Terminal size={32} className="mx-auto text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            No projects match your filter
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Try broadening your search query or switching technology and
            category filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 rounded-lg border border-cyan/40 bg-cyan/10 px-5 py-2 font-mono text-xs uppercase tracking-wider text-cyan hover:bg-cyan/20 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
