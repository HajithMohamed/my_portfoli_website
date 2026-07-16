import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function SignalLog({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <Panel
      label="signal.log"
      subtitle="engineering notes"
      actions={
        <Link
          href="/blog"
          className="text-[10px] uppercase tracking-[0.25em] text-cyan hover:underline"
        >
          full log →
        </Link>
      }
    >
      <div className="divide-y divide-cyan/10 font-mono text-xs">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-1 py-3 transition-colors hover:bg-cyan/5 md:flex-row md:items-center md:gap-4"
          >
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-cyan/60">
                [{post.publishedAt ? formatDate(post.publishedAt) : "unreleased"}]
              </span>
              <span className="border border-cyan/30 bg-cyan/10 px-1.5 py-0 text-[9px] uppercase tracking-widest text-cyan">
                info
              </span>
            </div>
            <div className="flex-1">
              <div className="font-display text-base font-semibold text-foreground group-hover:text-cyan">
                {post.title}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{post.excerpt}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(post.tags ?? []).map((t) => (
                <span key={t.slug} className="text-[10px] text-cyan/70">
                  #{t.slug}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
