import Link from "next/link";
import {
  Globe,
  Smartphone,
  ShoppingBag,
  Server,
  LayoutDashboard,
  Cpu,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getHomeData } from "@/lib/public-data";
import { getAllServices, getRelatedProjectsForService } from "@/lib/services-catalog";

export const metadata = {
  title: "Services & Capabilities | HZ Labs",
  description:
    "Explore our full-stack engineering disciplines: Web & SaaS platforms, Flutter mobile apps, E-Commerce, Backend & APIs, Admin Dashboards, and AI Automation.",
};

const ICON_MAP = {
  Globe,
  Smartphone,
  ShoppingBag,
  Server,
  LayoutDashboard,
  Cpu,
};

export default async function ServicesPage() {
  const { profile, projects } = await getHomeData();
  const services = getAllServices();

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />

      <main className="relative z-10 pt-16 pb-24">
        <div className="container-responsive section-gap space-y-12">
          {/* Header Banner */}
          <header className="border-b border-white/[0.08] pb-8">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
              <span>CAPABILITIES // FULL-STACK DISCIPLINES</span>
            </div>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Services &amp; technical capabilities
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Clear, transparent scopes designed for founders, businesses, and engineering teams. Every discipline is supported by verified code repositories and production-ready architectural patterns.
            </p>
          </header>

          {/* Sticky Navigation Quick Jump Bar */}
          <div className="sticky top-20 z-30 -mx-4 px-4 py-3 bg-black/60 backdrop-blur-xl border-y border-white/[0.08]">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1 shrink-0">
                Jump to:
              </span>
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-xs text-muted-foreground hover:text-cyan hover:border-cyan/40 hover:bg-cyan/[0.06] transition-all shrink-0"
                >
                  {service.shortTitle}
                </a>
              ))}
            </div>
          </div>

          {/* Detailed Service Modules */}
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = ICON_MAP[service.iconName as keyof typeof ICON_MAP] ?? Layers;
              const relatedProjects = getRelatedProjectsForService(service, projects).slice(0, 3);

              return (
                <section
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-36 rounded-2xl border border-white/[0.08] bg-surface/90 p-6 sm:p-10 backdrop-blur-xl space-y-8"
                >
                  {/* Top Meta Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan">
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                          DISCIPLINE 0{index + 1}
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <Link
                      href={`/start-project?service=${service.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-cyan hover:bg-cyan/20 transition-all shrink-0 w-fit"
                    >
                      <span>Request This Service</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {/* Core Value Proposition & Plain-Language Explanation */}
                  <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7 space-y-6">
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Overview &amp; Business Value
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-foreground/90">
                          {service.description}
                        </p>
                        <div className="mt-3 rounded-lg border border-cyan/20 bg-cyan/[0.03] p-3.5 font-mono text-xs text-cyan/90">
                          💡 <strong>Key Deliverable Outcome:</strong> {service.keyBenefit}
                        </div>
                      </div>

                      {/* Scope & Key Deliverables Checklist */}
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                          What&apos;s Included In This Engagement
                        </h3>
                        <div className="space-y-2.5">
                          {service.deliverables.map((item, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Supported Stack & Related Case Studies */}
                    <div className="lg:col-span-5 space-y-6 bg-white/[0.02] p-6 rounded-xl border border-white/[0.06]">
                      {/* Tech Stack */}
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                          <Code2 size={13} className="text-cyan" />
                          <span>Supported Toolstack</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {service.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Related Real Projects */}
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                          <Sparkles size={13} className="text-amber-400" />
                          <span>Related Production Work</span>
                        </div>

                        {relatedProjects.length > 0 ? (
                          <div className="space-y-2.5">
                            {relatedProjects.map((p) => (
                              <Link
                                key={p.slug}
                                href={`/projects/${p.slug}`}
                                className="group flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3 transition-all hover:border-cyan/40 hover:bg-white/[0.03]"
                              >
                                <div className="space-y-0.5 min-w-0 pr-2">
                                  <div className="font-display text-sm font-semibold text-foreground group-hover:text-cyan truncate">
                                    {p.title}
                                  </div>
                                  <div className="font-mono text-[10px] text-muted-foreground truncate">
                                    {p.techStack.slice(0, 3).join(" • ")}
                                  </div>
                                </div>
                                <ArrowRight
                                  size={13}
                                  className="text-muted-foreground group-hover:text-cyan group-hover:translate-x-0.5 transition-all shrink-0"
                                />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="font-mono text-[11px] text-muted-foreground">
                            Custom architectures engineered to client specifications.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Bottom Intake CTA Card */}
          <div className="rounded-2xl border border-cyan/30 bg-gradient-to-r from-cyan/10 via-purple-500/10 to-transparent p-8 sm:p-10 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                CUSTOM ARCHITECTURE // READY TO SHIP
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Need a multi-discipline solution?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                If your project requires both a mobile app, administrative portal, and high-throughput backend APIs, we can architect the complete ecosystem under one unified roadmap.
              </p>
            </div>

            <Link
              href="/start-project"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-cyan/60 bg-cyan px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-soft hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] shrink-0 w-full sm:w-auto"
            >
              <span>Launch Intake Wizard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <CommandFooter profile={profile} />
    </div>
  );
}
