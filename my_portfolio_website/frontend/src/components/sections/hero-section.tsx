import { Github, Download, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { Hero3DSceneClient } from "@/components/3d/hero-3d-scene-client";
import { TextReveal } from "@/components/ui/text-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TiltCard } from "@/components/ui/tilt-card";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function HeroSection({
  profile,
  github,
  projects,
  resume,
}: {
  profile: any;
  github: any;
  projects: any;
  resume?: { fileUrl?: string } | null;
}) {
  return (
    <AuroraBackground className="border-b border-white/10 h-auto min-h-[calc(100vh-73px)] py-16">
      <Hero3DSceneClient />
      
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 w-full">
        <div>
          <Badge>
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {profile.availabilityStatus}
          </Badge>
          <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
            <TextReveal text="Full Stack Developer Building Modern Web Platforms" />
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            I build scalable web applications, booking systems, authentication platforms, e-commerce solutions,
            and business automation software using modern technologies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <ButtonLink
                href={resume?.fileUrl ?? "#contact"}
                size="lg"
                data-track={resume?.fileUrl ? "resume_download" : undefined}
              >
                <Download className="h-4 w-4" />
                Download CV
              </ButtonLink>
            </MagneticButton>
            <MagneticButton>
              <ButtonLink href="#projects" size="lg" variant="secondary">
                View Projects
              </ButtonLink>
            </MagneticButton>
            <MagneticButton>
              <ButtonLink href="https://github.com/HajithMohamed" size="lg" variant="secondary">
                <Github className="h-4 w-4" />
                GitHub
              </ButtonLink>
            </MagneticButton>
          </div>
        </div>

        <TiltCard>
          <Card className="relative overflow-hidden p-0 h-full w-full bg-slate-950/40 backdrop-blur-md">
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
                  ["Contributions", github.contributionData?.totalContributions ?? github.commitCount],
                  ["Projects", projects.length],
                ].map(([label, value]) => (
                  <div className="rounded-md border border-white/10 bg-[#0F172A]/50 p-4" key={label as string}>
                    <div className="text-2xl font-semibold text-white">
                      <AnimatedCounter value={Number(value)} />
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-white/10 bg-[#0F172A]/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">System Architecture</span>
                  <ShieldCheck className="h-4 w-4 text-blue-300" />
                </div>
                {["Next.js App Router", "NestJS REST API", "Prisma + Supabase PostgreSQL", "Cloudinary Asset Pipeline"].map(
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
        </TiltCard>
      </div>
    </AuroraBackground>
  );
}
