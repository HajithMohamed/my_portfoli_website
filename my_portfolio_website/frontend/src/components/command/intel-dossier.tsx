import { Panel } from "@/components/hud/panel";
import type { Certificate, Testimonial } from "@/lib/types";
import { Quote, Award, Star, ExternalLink, ShieldCheck } from "lucide-react";
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

  const twoCol = hasTestimonials && hasCertificates;

  return (
    <Panel label="intel.dossier" subtitle="verified credentials & third-party signals">
      <div className={cn("grid gap-8", twoCol ? "md:grid-cols-[1.2fr_1fr]" : "max-w-3xl mx-auto")}>
        {/* Field Reports / Testimonials */}
        {hasTestimonials && (
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70 border-b border-cyan/10 pb-2">
              <Quote size={12} className="text-cyan" />
              field reports
            </div>
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <blockquote
                  key={t.id}
                  className="group relative rounded-md border border-cyan/15 bg-surface-2/30 p-5 font-body text-sm leading-relaxed text-foreground transition-all hover:border-cyan/30 hover:bg-surface-2/50"
                >
                  <div className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-sm bg-cyan/10 border border-cyan/30 font-mono text-[8px] text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {t.rating && (
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <Star
                          key={rIdx}
                          size={12}
                          className={
                            rIdx < (t.rating || 0)
                              ? "text-signal-amber fill-signal-amber"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </div>
                  )}

                  <p className="relative z-10 italic text-muted-foreground transition-colors group-hover:text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <footer className="mt-4 flex items-center gap-3 border-t border-cyan/10 pt-3 font-mono text-[11px]">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-cyan/20 bg-cyan/5 flex items-center justify-center">
                      {t.avatarUrl ? (
                        <img
                          src={t.avatarUrl}
                          alt={t.author}
                          className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                        />
                      ) : (
                        <span className="text-[14px] font-bold text-cyan/50">
                          {t.author.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-cyan font-medium">{t.author}</div>
                      {t.role || t.company ? (
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                          {[t.role, t.company].filter(Boolean).join(" · ")}
                        </div>
                      ) : null}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        <div>
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70 border-b border-cyan/10 pb-2">
            <Award size={12} className="text-violet" />
            certifications &amp; credentials
          </div>

          {!hasCertificates ? (
            <div className="rounded-md border border-cyan/10 bg-surface-2/20 p-8 text-center font-mono text-xs text-muted-foreground">
              <span className="text-cyan/40 block mb-2 font-mono text-[10px] uppercase tracking-widest">
                [telemetry null]
              </span>
              no certifications recorded
            </div>
          ) : certificates.length === 1 ? (
            /* Single Certificate Centered / Featured Intentional Card Layout */
            <div className="relative overflow-hidden rounded-lg border border-violet/30 bg-surface-2/40 p-6 backdrop-blur-sm transition-all hover:border-violet/60 hover:shadow-[0_0_24px_rgba(167,139,250,0.15)]">
              <div className="absolute top-0 right-0 p-3 opacity-20 text-violet">
                <ShieldCheck size={48} />
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-violet">
                <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse-dot" />
                <span>verified credential · 01/01</span>
              </div>

              <h4 className="mt-3 font-display text-xl font-bold text-foreground">
                {certificates[0].title}
              </h4>

              <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                <span className="rounded-sm border border-violet/30 bg-violet/10 px-2 py-0.5 text-violet font-semibold">
                  {certificates[0].issuer}
                </span>
                {certificates[0].issueDate && (
                  <span>
                    Issued {new Date(certificates[0].issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                )}
                {certificates[0].durationHours && (
                  <span>· {certificates[0].durationHours} hrs intensive</span>
                )}
              </div>

              {certificates[0].description && (
                <p className="mt-4 font-body text-xs leading-relaxed text-muted-foreground border-l-2 border-violet/30 pl-3">
                  {certificates[0].description}
                </p>
              )}

              {certificates[0].credentialUrl && (
                <div className="mt-6 pt-4 border-t border-violet/15">
                  <a
                    href={certificates[0].credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-violet hover:text-white transition-colors"
                  >
                    <span>verify external credential</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* Multi-certificate List */
            <ul className="space-y-3 font-mono text-xs">
              {certificates.map((c, i) => {
                const year = c.issueDate ? new Date(c.issueDate).getFullYear() : null;
                const inner = (
                  <>
                    <span className="text-[10px] text-violet/60 font-medium w-4 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="text-foreground transition-colors group-hover:text-violet group-hover:text-glow">
                        {c.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground">
                        <span className="rounded-sm bg-violet/10 px-1.5 py-0.5 text-violet/80 border border-violet/20">
                          {c.issuer}
                        </span>
                        {year ? <span>{year}</span> : null}
                      </div>
                    </div>
                    <span className="text-lg leading-none text-signal-green opacity-70 transition-opacity group-hover:opacity-100">
                      ✓
                    </span>
                  </>
                );

                return (
                  <li key={c.id}>
                    {c.credentialUrl ? (
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-4 rounded-md border border-cyan/15 bg-surface-2/30 p-4 transition-all hover:border-violet/40 hover:bg-surface-2/60 hover:shadow-[0_0_15px_rgba(167,139,250,0.1)]"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-start gap-4 rounded-md border border-cyan/15 bg-surface-2/30 p-4">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Panel>
  );
}
