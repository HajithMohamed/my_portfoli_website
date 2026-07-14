import {
  ArrowRight,
  BookOpenText,
  Boxes,
  DatabaseZap,
  Layers3,
  Mail,
  MapPin,
  Github,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RevealAnimation } from "@/components/ui/reveal-animation";
import { FloatingNav } from "@/components/sections/floating-nav";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { ServicesSection } from "@/components/sections/services-section";
import { GithubDashboard } from "@/components/sections/github-dashboard";
import { Testimonials } from "@/components/sections/testimonials";
import { CommandCenterFooter } from "@/components/sections/command-center-footer";
import { ContactForm } from "@/components/sections/contact-form";
import { SkillsGalaxyClient } from "@/components/sections/skills-galaxy-client";
import { TechStackGrid } from "@/components/sections/tech-stack";
import { RecruiterModeClient } from "@/components/sections/recruiter-mode-client";
import { DeveloperDNAClient } from "@/components/3d/developer-dna-client";
import { LoadingScreen } from "@/components/effects/loading-screen";
import { getHomeData } from "@/lib/api";
import { formatDate } from "@/lib/utils";


export default async function Home() {
  const { profile, skills, projects, blogs, resume, github } = await getHomeData();

  const timeline = Array.isArray(profile.timeline)
    ? (profile.timeline as Array<{ label: string; value: string }>)
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050816] text-slate-50">
      <LoadingScreen />
      {/* Floating navigation */}
      <FloatingNav />

      <main className="pt-0">
        {/* ── Hero ── */}
        <section id="home">
          <HeroSection profile={profile} github={github} projects={projects} resume={resume} />
        </section>

        {/* ── What I Build / Services ── */}
        <ServicesSection />

        {/* ── Skills Galaxy ── */}
        <section id="technologies" className="border-y border-white/10 bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <RevealAnimation>
              <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Badge>Technologies</Badge>
                  <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                    Skills galaxy
                  </h2>
                  <p className="mt-3 max-w-xl text-slate-400 leading-7">
                    {profile.bio}
                  </p>
                </div>
                <p className="text-sm text-slate-500 max-w-xs leading-6">
                  Hover any node to inspect proficiency. Nodes orbit by category — Frontend, Backend, Database, Tools.
                </p>
              </div>
            </RevealAnimation>
            <SkillsGalaxyClient skills={skills} />
            <TechStackGrid github={github} skills={skills} />
          </div>
        </section>

        {/* ── Projects ── */}
        <ProjectShowcase projects={projects} />

        {/* ── GitHub Dashboard ── */}
        <GithubDashboard github={github} />

        {/* ── Engineering Philosophy / About ── */}
        <section
          id="about"
          className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
        >
          <RevealAnimation variant="slide-up">
            <Badge>Engineering Philosophy</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              Scalable systems with useful interfaces
            </h2>
            <p className="mt-5 leading-8 text-slate-300">{profile.philosophy}</p>

            <div className="mt-8">
              <DeveloperDNAClient />
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers3 className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-white">Currently Exploring</span>
              </div>
              <div className="grid gap-2">
                {profile.currentlyExploring.map((item) => (
                  <div className="flex items-center gap-3 text-sm text-slate-300" key={item}>
                    <DatabaseZap className="h-3.5 w-3.5 text-blue-300 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </RevealAnimation>

          <div className="grid gap-4">
            {timeline.map((item, i) => (
              <RevealAnimation key={item.label} delay={i * 0.1} variant="slide-up">
                <Card className="flex gap-4">
                  <Boxes className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                  <div>
                    <h3 className="font-semibold text-white">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{item.value}</p>
                  </div>
                </Card>
              </RevealAnimation>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <Testimonials />

        {/* ── Blog ── */}
        <section id="blog" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <RevealAnimation>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge>Blog</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                  Engineering notes and product thinking
                </h2>
              </div>
              <ButtonLink href="/blog" variant="secondary" className="self-start sm:self-auto">
                Read all
                <BookOpenText className="h-4 w-4" />
              </ButtonLink>
            </div>
          </RevealAnimation>

          <div className="grid gap-5 md:grid-cols-2">
            {blogs.slice(0, 2).map((post, i) => (
              <RevealAnimation key={post.id} delay={i * 0.1} variant="slide-up">
                <Card className="group hover:border-blue-500/20 transition-colors duration-300">
                  <div className="text-sm text-slate-500">{formatDate(post.publishedAt)}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white group-hover:text-blue-200 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{post.excerpt}</p>
                  <ButtonLink className="mt-6" href={`/blog/${post.slug}`} variant="ghost">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </Card>
              </RevealAnimation>
            ))}
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          className="border-t border-white/10 bg-white/[0.015] mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"
        >
          <RevealAnimation variant="slide-up">
            <Badge>Contact</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              Build the next platform conversation
            </h2>
            <div className="mt-8 grid gap-4 text-sm text-slate-300">
              <a className="flex items-center gap-3 hover:text-white transition-colors group" href={`mailto:${profile.email}`}>
                <Mail className="h-4 w-4 text-blue-300 group-hover:scale-110 transition-transform" />
                {profile.email}
              </a>
              <a className="flex items-center gap-3 hover:text-white transition-colors group" href="https://github.com/HajithMohamed">
                <Github className="h-4 w-4 text-blue-300 group-hover:scale-110 transition-transform" />
                github.com/HajithMohamed
              </a>
              <span className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-300" />
                {profile.location}
              </span>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.15} variant="slide-up">
            <Card>
              <ContactForm />
            </Card>
          </RevealAnimation>
        </section>
      </main>

      {/* ── Footer ── */}
      <CommandCenterFooter profile={profile} />

      {/* ── Recruiter Mode (floating) ── */}
      <RecruiterModeClient
        profile={profile}
        skills={skills}
        projects={projects}
        github={github}
        resume={resume}
      />
    </div>
  );
}
