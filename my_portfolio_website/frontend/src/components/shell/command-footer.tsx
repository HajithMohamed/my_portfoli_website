import type { Profile } from "@/lib/types";

const VERSION = "v4.0.0";

export function CommandFooter({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  const github = profile.socialLinks?.find((l) =>
    l.url.includes("github.com"),
  );
  const githubHandle = github
    ? github.url.replace(/\/$/, "").split("/").pop()
    : "HajithMohamed";

  return (
    <footer className="relative z-10 mt-24 border-t border-cyan/15 bg-background/60 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4 py-8 font-mono text-xs">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cyan">System</div>
            <div className="text-muted-foreground">HZ-LABS — {VERSION}</div>
            <div className="text-muted-foreground">next.js · nestjs · postgres</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cyan">Operator</div>
            <div className="text-foreground">{profile.name}</div>
            <div className="text-muted-foreground">{profile.location}</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cyan">Comms</div>
            <a href={`mailto:${profile.email}`} className="text-foreground hover:text-cyan">
              {profile.email}
            </a>
            <div className="text-muted-foreground">github.com/{githubHandle}</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cyan">Diagnostics</div>
            <div className="text-muted-foreground">region: ap-south-1</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-green" /> nominal
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-cyan/10 pt-4 text-muted-foreground">
          <div>
            © {year} {profile.name}. All systems logged.
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan/60">
            — end of transmission —
          </div>
        </div>
      </div>
    </footer>
  );
}
