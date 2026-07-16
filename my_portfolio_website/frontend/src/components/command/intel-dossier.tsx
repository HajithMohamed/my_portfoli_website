import { Panel } from "@/components/hud/panel";
import type { Certificate, Testimonial } from "@/lib/types";

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
      <div className={twoCol ? "grid gap-6 md:grid-cols-2" : "grid gap-6"}>
        {testimonials.length > 0 ? (
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
              field reports
            </div>
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <blockquote
                  key={t.id}
                  className="hud-panel-solid corner-brackets relative p-4 font-body text-sm leading-relaxed text-foreground"
                >
                  <span className="absolute left-2 top-1 font-mono text-[10px] text-cyan/60">
                    ##{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-2 italic">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-3 border-t border-cyan/10 pt-2 font-mono text-[11px]">
                    <span className="text-cyan">— {t.author}</span>
                    {t.role || t.company ? (
                      <span className="text-muted-foreground">
                        {" "}
                        · {[t.role, t.company].filter(Boolean).join(", ")}
                      </span>
                    ) : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        ) : null}

        {certificates.length > 0 ? (
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
              certifications &amp; achievements
            </div>
            <ul className="space-y-2 font-mono text-xs">
              {certificates.map((c, i) => {
                const year = c.issueDate ? new Date(c.issueDate).getFullYear() : null;
                const row = (
                  <>
                    <span className="text-cyan/60">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <div className="text-foreground">{c.title}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                        {c.issuer}
                        {year ? ` · ${year}` : ""}
                      </div>
                    </div>
                    <span className="text-lg leading-none text-signal-green">✓</span>
                  </>
                );
                return (
                  <li key={c.id}>
                    {c.credentialUrl ? (
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-3 border border-cyan/15 bg-surface/40 p-3 transition-colors hover:border-cyan/40"
                      >
                        {row}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 border border-cyan/15 bg-surface/40 p-3">
                        {row}
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
