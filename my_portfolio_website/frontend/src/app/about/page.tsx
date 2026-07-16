import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { Panel } from "@/components/hud/panel";
import { getHomeData } from "@/lib/api";

export const metadata = {
  title: "Operator",
  description:
    "Mohamed Hajith — full-stack software engineer and founder of HZ Labs. Engineering philosophy, mission log, services, and resume.",
};

/** Services actually offered — the operator's real engagement catalog. */
const SERVICES = [
  "Website Development",
  "E-commerce Platforms",
  "Booking Systems",
  "Business Management Systems",
  "Admin Dashboards",
  "Authentication Systems",
  "REST APIs & Integration",
  "CMS Development",
  "Portfolio Websites",
  "Business Automation",
];

export default async function AboutPage() {
  const { profile, resume, skills } = await getHomeData();

  const timeline = Array.isArray(profile.timeline)
    ? (profile.timeline as Array<{ label: string; value: string }>)
    : [];

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-12">
          <header className="mb-4 flex flex-wrap items-end gap-6">
            {profile.profileImageUrl ? (
              <div className="hud-panel corner-brackets p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="h-28 w-28 object-cover"
                />
              </div>
            ) : null}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
                /operator
              </div>
              <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                Software Engineer · Full Stack Developer · Founder of HZ Labs
              </p>
            </div>
          </header>

          <Panel label="philosophy" subtitle="engineering doctrine">
            <p className="font-body text-lg leading-relaxed text-foreground/90">
              {profile.philosophy}
            </p>
          </Panel>

          <Panel label="bio" subtitle="short-form">
            <div className="space-y-3 text-base leading-relaxed text-foreground/90">
              <p>{profile.bio}</p>
              <p>
                BICT (Hons) undergraduate at the University of Ruhuna and founder of HZ Labs —
                building real-world business systems on the MERN stack, Next.js, and NestJS, with
                a growing focus on scalable software, AI, and machine learning.
              </p>
            </div>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel label="mission.log" subtitle="timeline">
              <ol className="relative border-l border-cyan/25 pl-6">
                {timeline.map((t, i) => (
                  <li key={i} className="relative mb-6 last:mb-0">
                    <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-cyan bg-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
                    </span>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/80">
                      {t.label}
                    </div>
                    <p className="mt-0.5 text-sm text-foreground/90">{t.value}</p>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel label="services.catalog" subtitle="engagement modes">
              <ul className="grid gap-1.5 font-mono text-xs sm:grid-cols-2">
                {SERVICES.map((s, i) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 border border-cyan/10 bg-surface/40 px-3 py-2 text-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
                  >
                    <span className="text-[9px] text-cyan/60">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel label="resume.protocol" subtitle="recruiter briefing" live>
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">
                    education
                  </div>
                  <div className="mt-1 text-foreground">
                    BICT (Hons) — University of Ruhuna
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">
                    availability
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-signal-green">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
                    {profile.availabilityStatus}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">
                    open to
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {["Internships", "Graduate roles", "Freelance", "Remote", "Hybrid"].map(
                      (m) => (
                        <span
                          key={m}
                          className="border border-cyan/20 bg-cyan/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan/90"
                        >
                          {m}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">
                    core skills
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {skills
                      .filter((s) => s.featured)
                      .map((s) => (
                        <span
                          key={s.id}
                          className="border border-cyan/15 bg-surface/40 px-2 py-0.5 text-[10px] text-foreground"
                        >
                          {s.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
                {resume?.fileUrl ? (
                  <a
                    href={resume.fileUrl}
                    data-track="resume_download"
                    className="border border-cyan/50 bg-cyan/10 px-5 py-3 text-center text-cyan transition-all hover:bg-cyan/20"
                  >
                    {"> download cv"}
                  </a>
                ) : null}
                <a
                  href={`mailto:${profile.email}?subject=Interview%20request`}
                  className="border border-cyan/30 bg-surface/60 px-5 py-3 text-center text-foreground transition-colors hover:border-cyan/60 hover:text-cyan"
                >
                  {"> schedule interview"}
                </a>
                <a
                  href="/#comms"
                  className="border border-cyan/30 bg-surface/60 px-5 py-3 text-center text-foreground transition-colors hover:border-cyan/60 hover:text-cyan"
                >
                  {"> open comms"}
                </a>
              </div>
            </div>
          </Panel>
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
