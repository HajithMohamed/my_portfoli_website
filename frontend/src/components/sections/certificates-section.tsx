"use client";

import { Award, ExternalLink, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RevealAnimation } from "@/components/ui/reveal-animation";
import type { Certificate } from "@/lib/types";

function formatIssued(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function CredentialCard({ item }: { item: Certificate }) {
  const isAchievement = item.type === "achievement";
  const Icon = isAchievement ? Medal : Award;
  const issued = formatIssued(item.issueDate);
  const content = (
    <div className="flex h-full gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.04]">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={item.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" src={item.imageUrl} />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <div className="min-w-0">
        <h3 className="flex items-center gap-1.5 font-semibold text-white">
          <span className="truncate">{item.title}</span>
          {item.credentialUrl ? <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" /> : null}
        </h3>
        <p className="mt-0.5 text-sm text-slate-400">{item.issuer}</p>
        {issued ? <p className="mt-1 text-xs text-slate-500">{issued}</p> : null}
      </div>
    </div>
  );

  return item.credentialUrl ? (
    <a href={item.credentialUrl} rel="noreferrer" target="_blank" className="block h-full">
      {content}
    </a>
  ) : (
    content
  );
}

export function CertificatesSection({ items }: { items: Certificate[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  const certifications = items.filter((item) => item.type !== "achievement");
  const achievements = items.filter((item) => item.type === "achievement");

  return (
    <section id="credentials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <RevealAnimation>
        <Badge>Credentials</Badge>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
          Certifications &amp; achievements
        </h2>
      </RevealAnimation>

      {certifications.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, i) => (
            <RevealAnimation delay={i * 0.06} key={item.id} variant="slide-up">
              <CredentialCard item={item} />
            </RevealAnimation>
          ))}
        </div>
      ) : null}

      {achievements.length > 0 ? (
        <>
          <h3 className="mt-12 mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Achievements
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, i) => (
              <RevealAnimation delay={i * 0.06} key={item.id} variant="slide-up">
                <CredentialCard item={item} />
              </RevealAnimation>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
