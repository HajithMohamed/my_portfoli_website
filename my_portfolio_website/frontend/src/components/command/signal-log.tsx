import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, FileText } from "lucide-react";

export function SignalLog({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <Panel
      label="signal.log"
      subtitle="engineering notes"
      actions={
        <Link
          href="/blog"
          className="group flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-cyan hover:text-cyan-glow transition-colors"
        >
          full log <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      }
    >
      <div className="grid gap-3 font-mono text-xs">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group relative flex flex-col gap-3 rounded-md border border-cyan/10 bg-surface-2/20 p-4 transition-all duration-300 hover:border-cyan/30 hover:bg-surface-2/60 md:flex-row md:items-center md:gap-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative z-10 flex shrink-0 items-center gap-3 w-40">
              <FileText size={14} className="text-cyan/50 transition-colors group-hover:text-cyan" />
              <span className="text-cyan/60 transition-colors group-hover:text-cyan/90">
                {post.publishedAt ? formatDate(post.publishedAt) : "unreleased"}
              </span>
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-glow group-hover:text-cyan">
                {post.title}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{post.excerpt}</div>
            </div>
            
            <div className="relative z-10 flex shrink-0 flex-wrap gap-1.5 md:w-48 md:justify-end">
              {(post.tags ?? []).slice(0, 3).map((t) => (
                <span key={t.slug} className="rounded-full border border-cyan/20 bg-black/40 px-2 py-0.5 text-[9px] uppercase tracking-widest text-cyan/70 transition-colors group-hover:border-cyan/40 group-hover:text-cyan">
                  {t.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
