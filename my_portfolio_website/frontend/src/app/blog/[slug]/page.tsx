import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getBlogPost, getHomeData } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post?.title ?? "Signal Log",
    description: post?.excerpt ?? "Hz Labs engineering article.",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, { profile }] = await Promise.all([getBlogPost(slug), getHomeData()]);

  if (!post) {
    notFound();
  }

  const lines = post.content.split("\n").filter(Boolean);

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <article className="mx-auto max-w-[860px] px-4 py-12">
          <Link href="/blog" className="font-mono text-xs text-cyan hover:underline">
            ← back to signal.log
          </Link>

          <header className="mt-6 hud-panel corner-brackets p-8">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
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
            <h1 className="mt-4 font-display text-4xl font-bold text-foreground text-glow md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          </header>

          <div className="mt-6 hud-panel p-8">
            <div className="space-y-5">
              {lines.map((line, index) =>
                line.startsWith("#") ? (
                  <h2
                    className="font-display text-2xl font-semibold text-foreground"
                    key={index}
                  >
                    {line.replace(/^#+\s*/, "")}
                  </h2>
                ) : (
                  <p className="leading-8 text-foreground/85" key={index}>
                    {line}
                  </p>
                ),
              )}
            </div>
          </div>
        </article>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
