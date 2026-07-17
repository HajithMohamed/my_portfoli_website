import Link from "next/link";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { Panel } from "@/components/hud/panel";
import { getHomeData } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Signal Log",
  description: "Engineering notes and product thinking from Hz Labs.",
};

export default async function BlogPage() {
  const { blogs, profile } = await getHomeData();

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <div className="container-responsive section-gap max-w-[1000px]">
          <header className="mb-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
              /signal.log
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
              Signal Log
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Engineering notes broadcast from the console. No hype, no hot takes — only what
              shipped and why.
            </p>
          </header>

          <Panel label="log.stream" subtitle={`${blogs.length} entries`} live>
            <div className="divide-y divide-cyan/10 font-mono">
              {blogs.map((post) => (
                <article key={post.id} className="py-4">
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-cyan/70">
                        [{post.publishedAt ? formatDate(post.publishedAt) : "unreleased"}]
                      </span>
                      <span className="border border-cyan/30 bg-cyan/10 px-1.5 py-0 text-[9px] uppercase tracking-widest text-cyan">
                        info
                      </span>
                      <div className="ml-auto flex flex-wrap gap-2">
                        {(post.tags ?? []).map((t) => (
                          <span key={t.slug} className="text-[10px] text-cyan/70">
                            #{t.slug}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-cyan">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
