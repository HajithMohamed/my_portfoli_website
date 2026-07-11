import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  Boxes,
  CalendarClock,
  Github,
  LockKeyhole,
  Mail,
  MapPin,
  ServerCog,
  ShoppingBag,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/sections/contact-form";
import { Hero } from "@/components/sections/hero";
import { SkillsVisual } from "@/components/sections/skills-visual";
import { GithubCharts } from "@/components/sections/github-charts";
import { Reveal } from "@/components/motion/reveal";
import { getHomeData } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const buildCards = [
  { title: "Commerce Platforms", description: "Catalogs, storefront operations, checkout-ready architecture, and admin workflows.", icon: ShoppingBag },
  { title: "Booking Systems", description: "Scheduling, availability models, user journeys, and dashboard operations.", icon: CalendarClock },
  { title: "Authentication Infrastructure", description: "JWT access, refresh-token rotation, RBAC, validation, and secure sessions.", icon: LockKeyhole },
  { title: "Admin Dashboards", description: "CMS controls, preview states, analytics views, and operator-friendly forms.", icon: BarChart3 },
  { title: "Business Automation", description: "Workflow software that removes repeated manual effort from operational teams.", icon: Workflow },
  { title: "API Development", description: "NestJS and REST APIs with typed DTOs, Prisma data models, and Swagger docs.", icon: ServerCog },
];

const heroRoles = ["AI Engineer", "Full Stack Developer", "Backend Engineer", "Available for Freelance"];
const heroArchitecture = ["Next.js App Router", "NestJS REST API", "Prisma + PostgreSQL", "Cloudinary Asset Pipeline"];

export default async function Home() {
  const { profile, skills, projects, blogs, resume, github } = await getHomeData();
  const timeline = Array.isArray(profile.timeline)
    ? (profile.timeline as Array<{ label: string; value: string }>)
    : [];

  const heroStats = [
    { label: "Repos", value: github.repositoryCount },
    { label: "Commits", value: github.commitCount },
    { label: "Projects", value: projects.length },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-slate-50">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a className="font-display text-lg font-semibold tracking-normal text-white" href="#">
            HZ Labs
          </a>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {["Home", "Projects", "Technologies", "Blog", "About", "Contact"].map((item) => (
              <a className="transition hover:text-white" href={`#${item.toLowerCase()}`} key={item}>
                {item}
              </a>
            ))}
          </div>
          <ButtonLink href="/admin/login" size="sm" variant="secondary">
            Admin
          </ButtonLink>
        </nav>
      </header>

      <main>
        <Hero
          name={profile.name}
          availabilityStatus={profile.availabilityStatus}
          summary={profile.bio}
          roles={heroRoles}
          resumeUrl={resume?.fileUrl}
          githubUrl="https://github.com/HajithMohamed"
          stats={heroStats}
          architecture={heroArchitecture}
        />

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <Badge>What I Build</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Product systems for real operations</h2>
            </div>
            <p className="hidden max-w-md text-sm leading-6 text-slate-400 md:block">
              Built multiple full-stack systems including e-commerce, authentication, booking, and business management platforms.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {buildCards.map(({ title, description, icon: Icon }, index) => (
              <Reveal className="h-full" delay={index * 0.06} key={title}>
                <Card className="h-full transition hover:-translate-y-1 hover:border-blue-400/40">
                  <Icon className="h-6 w-6 text-blue-300" />
                  <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="technologies" className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <Badge>Technologies</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Interactive skill matrix</h2>
              <p className="mt-4 leading-7 text-slate-400">{profile.bio}</p>
            </div>
            <SkillsVisual skills={skills} />
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge>Projects</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Case-study ready platform work</h2>
            </div>
            <ButtonLink href="/projects" variant="secondary">
              View all
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <Reveal className="h-full" delay={index * 0.08} key={project.id}>
                <Card className="flex h-full min-h-80 flex-col transition hover:-translate-y-1 hover:border-blue-400/40">
                  <Badge className="w-fit">{project.category}</Badge>
                  <h3 className="mt-5 text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ButtonLink className="mt-6" href={`/projects/${project.slug}`} variant="secondary">
                    Open case study
                  </ButtonLink>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <Badge>GitHub Intelligence</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Live engineering signals</h2>
              <p className="mt-4 leading-7 text-slate-400">
                Metrics and language distribution synced from GitHub, rendered with custom charts.
              </p>
            </div>
            <GithubCharts github={github} projectsCount={projects.length} exploring={profile.currentlyExploring} />
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge>Engineering Philosophy</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Scalable systems with useful interfaces</h2>
            <p className="mt-5 leading-8 text-slate-300">{profile.philosophy}</p>
          </div>
          <div className="grid gap-4">
            {timeline.map((item, index) => (
              <Reveal delay={index * 0.06} key={item.label}>
                <Card className="flex gap-4">
                  <Boxes className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                  <div>
                    <h3 className="font-semibold text-white">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{item.value}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="blog" className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge>Blog</Badge>
                <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Engineering notes and product thinking</h2>
              </div>
              <ButtonLink href="/blog" variant="secondary">
                Read all
                <BookOpenText className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {blogs.slice(0, 2).map((post, index) => (
                <Reveal className="h-full" delay={index * 0.08} key={post.id}>
                  <Card className="h-full">
                    <div className="text-sm text-slate-500">{formatDate(post.publishedAt)}</div>
                    <h3 className="mt-3 text-xl font-semibold text-white">{post.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{post.excerpt}</p>
                    <ButtonLink className="mt-6" href={`/blog/${post.slug}`} variant="ghost">
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <Badge>Contact</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Build the next platform conversation</h2>
            <div className="mt-8 grid gap-4 text-sm text-slate-300">
              <a className="flex items-center gap-3 hover:text-white" href={`mailto:${profile.email}`}>
                <Mail className="h-4 w-4 text-blue-300" />
                {profile.email}
              </a>
              <a className="flex items-center gap-3 hover:text-white" href="https://github.com/HajithMohamed">
                <Github className="h-4 w-4 text-blue-300" />
                github.com/HajithMohamed
              </a>
              <span className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-300" />
                {profile.location}
              </span>
            </div>
          </div>
          <Card>
            <ContactForm />
          </Card>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-display text-lg font-semibold text-white">HZ Labs</div>
            <div>Building Digital Products, Platforms and Scalable Systems</div>
          </div>
          <div className="flex gap-4">
            {profile.socialLinks.map((link) => (
              <a className="hover:text-white" href={link.url} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
