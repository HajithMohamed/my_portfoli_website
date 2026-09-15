import Image from "next/image";
import { Award, BookOpen, Clock3, ExternalLink, GraduationCap } from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { Panel } from "@/components/hud/panel";
import { getHomeData } from "@/lib/public-data";

export const metadata = { title: "Certificates", description: "Professional certificates and verified learning milestones earned by Mohamed Hajith." };

export default async function CertificatesPage() {
  const { certificates, profile } = await getHomeData();
  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14"><div className="container-responsive section-gap">
        <header className="mb-8 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-violet"><Award size={14} /> /certificates</div>
          <h1 className="mt-4 font-display text-display font-bold text-foreground">Certificates</h1>
          <p className="mt-4 border-l-2 border-violet/30 py-1 pl-4 text-muted-foreground">Verified learning milestones and professional credentials.</p>
        </header>
        <Panel label="credential.archive" subtitle={`${certificates.length} verified item${certificates.length === 1 ? "" : "s"}`}>
          <div className="grid gap-6 lg:grid-cols-2">
            {certificates.map((certificate, index) => {
              const card = <article className="group overflow-hidden rounded-xl border border-violet/20 bg-surface-2/30 transition duration-500 hover:-translate-y-1 hover:border-violet/50 hover:shadow-[0_18px_55px_rgba(167,139,250,0.12)]">
                {certificate.imageUrl ? <div className="relative aspect-[4/3] overflow-hidden bg-white"><Image src={certificate.imageUrl} alt={`${certificate.title} certificate`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain transition-transform duration-700 group-hover:scale-[1.02]" priority={index === 0} /></div> : null}
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet">{certificate.issuer}</div>
                  <h2 className="mt-2 font-display text-xl font-semibold text-foreground">{certificate.title}</h2>
                  {certificate.description ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{certificate.description}</p> : null}
                  <dl className="mt-5 grid gap-3 border-t border-violet/15 pt-4 text-xs">
                    {certificate.instructor ? <div className="flex items-start gap-2"><GraduationCap size={15} className="mt-0.5 shrink-0 text-violet" /><div><dt className="text-muted-foreground">Instructor</dt><dd className="mt-0.5 text-foreground">{certificate.instructor}</dd></div></div> : null}
                    {certificate.durationHours ? <div className="flex items-center gap-2"><Clock3 size={15} className="text-violet" /><div><dt className="sr-only">Course length</dt><dd>{certificate.durationHours} total hours</dd></div></div> : null}
                    {certificate.courseUrl ? <div className="flex items-center gap-2"><BookOpen size={15} className="text-violet" /><span>Complete course curriculum</span></div> : null}
                  </dl>
                  <div className="mt-4 text-xs text-muted-foreground">Completed {certificate.issueDate ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(certificate.issueDate)) : "—"}</div>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
                    {certificate.credentialUrl ? <a className="rounded border border-cyan/25 px-3 py-2 text-cyan transition hover:bg-cyan/10" href={certificate.credentialUrl} target="_blank" rel="noreferrer">Verify certificate <ExternalLink size={11} className="ml-1 inline" /></a> : null}
                    {certificate.courseUrl ? <a className="rounded border border-violet/25 px-3 py-2 text-violet transition hover:bg-violet/10" href={certificate.courseUrl} target="_blank" rel="noreferrer">View course</a> : null}
                    {certificate.instructorUrl ? <a className="rounded border border-violet/25 px-3 py-2 text-violet transition hover:bg-violet/10" href={certificate.instructorUrl} target="_blank" rel="noreferrer">Instructor</a> : null}
                    {certificate.studentUrl ? <a className="rounded border border-violet/25 px-3 py-2 text-violet transition hover:bg-violet/10" href={certificate.studentUrl} target="_blank" rel="noreferrer">Student profile</a> : null}
                  </div>
                </div>
              </article>;
              return <div key={certificate.id}>{card}</div>;
            })}
          </div>
        </Panel>
      </div></main>
      <CommandFooter profile={profile} />
    </div>
  );
}
