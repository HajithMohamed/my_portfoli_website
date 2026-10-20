"use client";

import React from "react";
import Link from "next/link";
import { Quote, Award, Star, ExternalLink, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Certificate, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IntelDossier({
  testimonials = [],
  certificates = [],
}: {
  testimonials: Testimonial[];
  certificates: Certificate[];
}) {
  const hasTestimonials = testimonials.length > 0;
  const hasCertificates = certificates.length > 0;

  if (!hasTestimonials && !hasCertificates) return null;

  return (
    <section 
      aria-label="Verified Credentials and Third-Party Signals"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8"
    >
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-cyan/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span>INTEL.DOSSIER // THIRD-PARTY SIGNALS</span>
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Verified Credentials &amp; Recommendations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Independent proof of competency, rigorous bootcamp credentials, and client endorsements.
          </p>
        </div>

        <Link
          href="/certificates"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
        >
          <span>All Certificates Archive</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-2">
        {/* Field Reports / Testimonials Column */}
        {hasTestimonials ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan border-b border-white/[0.06] pb-2">
              <Quote size={13} />
              <span>Client Endorsements &amp; Field Reports</span>
            </div>

            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <blockquote
                  key={t.id || i}
                  className="group relative rounded-2xl border border-white/[0.08] bg-surface/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:bg-white/[0.04]"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <Star
                          key={rIdx}
                          size={13}
                          className={
                            rIdx < (t.rating || 0)
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </div>
                  )}

                  <p className="italic text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <footer className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-cyan/30 bg-cyan/10 flex items-center justify-center font-mono text-xs font-bold text-cyan">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
                        {t.author}
                      </div>
                      {(t.role || t.company) && (
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {[t.role, t.company].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        ) : null}

        {/* Verified Certificates Showcase Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-indigo-400 border-b border-white/[0.06] pb-2">
            <Award size={13} />
            <span>Verified Learning Milestones</span>
          </div>

          <div className="space-y-4">
            {certificates.slice(0, 2).map((cert) => (
              <div
                key={cert.id}
                className="group relative rounded-2xl border border-white/[0.08] bg-surface/80 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/[0.04] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-indigo-400/30 bg-indigo-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-indigo-300 font-semibold">
                    {cert.issuer}
                  </span>
                  {cert.durationHours && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {cert.durationHours} hrs intensive
                    </span>
                  )}
                </div>

                <h4 className="font-display text-lg font-bold text-foreground group-hover:text-indigo-300 transition-colors">
                  {cert.title}
                </h4>

                {cert.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {cert.description}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                  {cert.instructor && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Instructor: {cert.instructor}
                    </span>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-cyan hover:underline"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
