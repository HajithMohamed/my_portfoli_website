import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  Boxes,
  CalendarClock,
  DatabaseZap,
  Download,
  Github,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  ServerCog,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/sections/contact-form";
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

export default async function Home() {
  const { profile, skills, projects, blogs, resume, github } = await getHomeData();
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] ?? []), skill];
    return acc;
  }, {});
  const timeline = Array.isArray(profile.timeline)
    ? (profile.timeline as Array<{ label: string; value: string }>)
    : [];
  const languageList = Array.isArray(github.languages)
    ? github.languages
    : Object.entries(github.languages)
        .sort((a, b) => b[1] - a[1])
        .map(([language]) => language);

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
        <section id="home" className="engineering-grid relative border-b border-white/10">
          <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <Badge>
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                {profile.availabilityStatus}
              </Badge>
              <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Full Stack Developer Building Modern Web Platforms
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                I build scalable web applications, booking systems, authentication platforms, e-commerce solutions,
                and business automation software using modern technologies.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={resume?.fileUrl ?? "#contact"} size="lg">
                  <Download className="h-4 w-4" />
                  Download CV
                </ButtonLink>
                <ButtonLink href="#projects" size="lg" variant="secondary">
                  View Projects
                </ButtonLink>
                <ButtonLink href="https://github.com/HajithMohamed" size="lg" variant="secondary">
                  <Github className="h-4 w-4" />
                  GitHub
                </ButtonLink>
                <ButtonLink href="#contact" size="lg" variant="ghost">
                  Contact Me
                </ButtonLink>
              </div>
            </div>

            <Card className="relative overflow-hidden p-0">
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
                  {[
                    ["Repos", github.repositoryCount],
                    ["Commits", github.commitCount],
                    ["Projects", projects.length],
                  ].map(([label, value]) => (
                    <div className="rounded-md border border-white/10 bg-[#0F172A] p-4" key={label}>
                      <div className="text-2xl font-semibold text-white">{value}</div>
                      <div className="mt-1 text-xs text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-white/10 bg-[#0F172A] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">System Architecture</span>
                    <ShieldCheck className="h-4 w-4 text-blue-300" />
                  </div>
                  {["Next.js App Router", "NestJS REST API", "Prisma + Railway PostgreSQL", "Cloudinary Asset Pipeline"].map(
                    (item, index) => (
                      <div className="flex items-center gap-3 py-2 text-sm text-slate-300" key={item}>
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 text-xs text-blue-200">
                          {index + 1}
                        </span>
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>

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
            {buildCards.map(({ title, description, icon: Icon }) => (
              <Card className="transition hover:-translate-y-1 hover:border-blue-400/40" key={title}>
                <Icon className="h-6 w-6 text-blue-300" />
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="technologies" className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <Badge>Technologies</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">CMS-managed skills, grouped for scanning</h2>
              <p className="mt-4 leading-7 text-slate-400">{profile.bio}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card key={category}>
                  <h3 className="mb-4 text-lg font-semibold text-white">{category}</h3>
                  <div className="grid gap-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-200">{skill.name}</span>
                          <span className="text-slate-500">{skill.proficiency}%</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-blue-400" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
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
            {projects.slice(0, 3).map((project) => (
              <Card className="flex min-h-80 flex-col" key={project.id}>
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
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Card>
              <div className="flex items-center gap-3">
                <Github className="h-6 w-6 text-blue-300" />
                <h2 className="font-display text-2xl font-semibold text-white">GitHub Intelligence</h2>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md bg-white/5 p-4">
                  <div className="text-3xl font-semibold">{github.repositoryCount}</div>
                  <div className="text-sm text-slate-400">Repositories</div>
                </div>
                <div className="rounded-md bg-white/5 p-4">
                  <div className="text-3xl font-semibold">{github.commitCount}</div>
                  <div className="text-sm text-slate-400">Recent commits</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {languageList.slice(0, 7).map((language) => (
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-100" key={language}>
                    {language}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm text-slate-500">Last sync: {formatDate(github.syncedAt)}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <Layers3 className="h-6 w-6 text-blue-300" />
                <h2 className="font-display text-2xl font-semibold text-white">Currently Exploring</h2>
              </div>
              <div className="mt-6 grid gap-3">
                {profile.currentlyExploring.map((item) => (
                  <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3" key={item}>
                    <DatabaseZap className="h-4 w-4 text-blue-300" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge>Engineering Philosophy</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">Scalable systems with useful interfaces</h2>
            <p className="mt-5 leading-8 text-slate-300">{profile.philosophy}</p>
          </div>
          <div className="grid gap-4">
            {timeline.map((item) => (
              <Card className="flex gap-4" key={item.label}>
                <Boxes className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                <div>
                  <h3 className="font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.value}</p>
                </div>
              </Card>
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
              {blogs.slice(0, 2).map((post) => (
                <Card key={post.id}>
                  <div className="text-sm text-slate-500">{formatDate(post.publishedAt)}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{post.excerpt}</p>
                  <ButtonLink className="mt-6" href={`/blog/${post.slug}`} variant="ghost">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </Card>
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
