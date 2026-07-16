import { Panel } from "@/components/hud/panel";
import type { Certificate, Testimonial } from "@/lib/types";
import { Quote, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function IntelDossier({
  testimonials,
  certificates,
}: {
  testimonials: Testimonial[];
  certificates: Certificate[];
}) {
  if (!testimonials.length && !certificates.length) return null;

  const twoCol = testimonials.length > 0 && certificates.length > 0;

  return (
    <Panel label="intel.dossier" subtitle="third-party signals">
      <div className={cn("grid gap-8", twoCol ? "md:grid-cols-[1.3fr_1fr]" : "")}>
        {testimonials.length > 0 ? (
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
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < (t.rating || 0) ? "text-signal-amber fill-signal-amber" : "text-muted-foreground/30"} 
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
                        <img src={t.avatarUrl} alt={t.author} className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0" />
                      ) : (
                        <span className="text-[14px] font-bold text-cyan/50">{t.author.charAt(0)}</span>
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
        ) : null}

        {certificates.length > 0 ? (
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70 border-b border-cyan/10 pb-2">
              <Award size={12} className="text-violet" />
              certifications &amp; achievements
            </div>
            <ul className="space-y-3 font-mono text-xs">
              {certificates.map((c, i) => {
                const year = c.issueDate ? new Date(c.issueDate).getFullYear() : null;
                const inner = (
                  <>
                    <span className="text-[10px] text-violet/60 font-medium w-4 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <div className="text-foreground transition-colors group-hover:text-violet group-hover:text-glow">{c.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground">
                        <span className="rounded-sm bg-violet/10 px-1.5 py-0.5 text-violet/80 border border-violet/20">{c.issuer}</span>
                        {year ? <span>{year}</span> : null}
                      </div>
                    </div>
                    <span className="text-lg leading-none text-signal-green opacity-70 transition-opacity group-hover:opacity-100">✓</span>
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
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
