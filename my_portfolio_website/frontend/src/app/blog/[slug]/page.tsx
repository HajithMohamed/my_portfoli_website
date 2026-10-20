import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Layers, 
  CheckCircle2,
  Share2
} from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getBlogPost, getHomeData } from "@/lib/public-data";
import { formatDate } from "@/lib/utils";
import { calculateReadingTime } from "@/components/blog/blog-catalogue-view";
import { BlogShareActions } from "@/components/blog/blog-share-actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post ? `${post.title} — Engineering Dispatch | HZ Labs` : "Dispatch Not Found | HZ Labs",
    description: post?.excerpt ?? "Technical architecture article by Mohamed Hajith.",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, { profile, blogs, projects }] = await Promise.all([
    getBlogPost(slug),
    getHomeData(),
  ]);

  if (!post) {
    notFound();
  }

  // Calculate Next and Previous posts
  const currentIndex = blogs.findIndex((b) => b.slug === post.slug);
  const prevPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextPost = currentIndex < blogs.length - 1 && currentIndex >= 0 ? blogs[currentIndex + 1] : null;

  // Find related project if any matches the slug or topic
  const relatedProject = projects.find((p) => {
    const slugNorm = post.slug.toLowerCase();
    return (
      (slugNorm.includes("shoe-bank") && (p.slug === "shoe-bank" || p.dedupeKey === "shoe-bank")) ||
      (slugNorm.includes("saga-elite") && p.slug.toLowerCase().includes("saga")) ||
      (slugNorm.includes("library") && p.slug.toLowerCase().includes("library")) ||
      (slugNorm.includes("mobile") && p.slug.toLowerCase().includes("nextgen"))
    );
  });

  const lines = post.content.split("\n").filter((l) => l.trim().length > 0);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-cyan/20 selection:text-cyan">
      <TopBar location={profile.location} />

      <main className="relative z-10 pt-16 pb-28">
        <article className="container-responsive section-gap max-w-[900px] space-y-10">
          
          {/* Breadcrumb Navigation & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Engineering Dispatches</span>
            </Link>

            <BlogShareActions title={post.title} />
          </div>

          {/* Article Header Studio Card */}
          <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                <span>DISPATCH // {post.slug}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.publishedAt ? formatDate(post.publishedAt) : "Archived"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan">
                  <Clock size={12} />
                  {calculateReadingTime(post.content)}
                </span>
              </div>
            </div>

            <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              {post.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>

            {/* Author Attribution & README Source Link */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan to-indigo-500 flex items-center justify-center font-mono text-xs font-bold text-black">
                  MH
                </div>
                <div>
                  <div className="font-sans text-xs font-semibold text-foreground">
                    {post.author || "Mohamed Hajith"}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    Full-Stack Software Engineer
                  </div>
                </div>
              </div>

              {post.sourceUrl && (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/30 bg-cyan/10 px-3.5 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/20 transition-all"
                >
                  <span>Source README Specification</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Tags Strip */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t.slug}
                    className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Main Body Content */}
          <div className="rounded-3xl border border-white/[0.08] bg-surface/90 p-6 sm:p-12 backdrop-blur-xl space-y-6">
            <div className="prose prose-invert max-w-none space-y-6 font-sans text-foreground/90 leading-relaxed">
              {lines.map((line, index) => {
                if (line.startsWith("# ")) {
                  return (
                    <h2
                      key={index}
                      className="pt-6 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground border-b border-white/[0.08] pb-3 text-glow"
                    >
                      {line.replace(/^#\s+/, "")}
                    </h2>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h3
                      key={index}
                      className="pt-4 font-display text-xl sm:text-2xl font-bold text-foreground"
                    >
                      {line.replace(/^##\s+/, "")}
                    </h3>
                  );
                }
                if (line.startsWith("Source: ")) {
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-cyan/20 bg-cyan/[0.03] p-4 font-mono text-xs text-cyan space-y-1"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Verified Primary Source
                      </div>
                      <a
                        href={line.replace("Source: ", "")}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-cyan/80 break-all"
                      >
                        {line.replace("Source: ", "")}
                      </a>
                    </div>
                  );
                }
                return (
                  <p key={index} className="text-base sm:text-lg leading-8 text-foreground/85">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Related Case Study Card (Cross-linking to /projects/[slug]) */}
          {relatedProject && (
            <div className="rounded-2xl border border-white/[0.08] bg-surface/80 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                  <Layers size={13} />
                  <span>COMPANION TECHNICAL CASE STUDY</span>
                </div>
                <h4 className="font-display text-lg font-bold text-foreground">
                  {relatedProject.title}
                </h4>
                <p className="text-xs text-muted-foreground max-w-lg">
                  Explore the full interactive system architecture, SLA telemetry, and repository code.
                </p>
              </div>
              <Link
                href={`/projects/${relatedProject.slug}`}
                className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan hover:bg-cyan/20 transition-all"
              >
                <span>Open Dossier</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Previous & Next Post Navigation */}
          <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-white/[0.08]">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-cyan/40 hover:bg-white/[0.04] transition-all"
              >
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-cyan transition-colors">
                  <ArrowLeft size={11} /> Previous Dispatch
                </span>
                <span className="mt-1 font-display text-sm font-semibold text-foreground group-hover:text-cyan transition-colors line-clamp-1">
                  {prevPost.title}
                </span>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex flex-col items-end rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-cyan/40 hover:bg-white/[0.04] transition-all text-right"
              >
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-cyan transition-colors">
                  Next Dispatch <ArrowRight size={11} />
                </span>
                <span className="mt-1 font-display text-sm font-semibold text-foreground group-hover:text-cyan transition-colors line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            ) : <div />}
          </div>

          {/* Lead Generation CTA */}
          <div className="rounded-2xl border border-cyan/30 bg-gradient-to-r from-cyan/10 via-indigo-950/30 to-purple-950/20 p-6 sm:p-10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                <CheckCircle2 size={12} />
                <span>TECHNICAL COLLABORATION</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Architecting an enterprise system?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Let&apos;s formulate the software architecture, database design, and operational workflows for your application.
              </p>
            </div>
            <Link
              href={`/start-project?service=architecture-consultation&source=${post.slug}`}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-indigo-500 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95 transition-opacity"
            >
              <span>Initiate Project Scope</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </article>
      </main>

      <CommandFooter profile={profile} />
    </div>
  );
}
