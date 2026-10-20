"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Tag, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface BlogCatalogueViewProps {
  initialPosts: BlogPost[];
}

export function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function BlogCatalogueView({ initialPosts }: BlogCatalogueViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialPosts.forEach((post) => {
      post.tags?.forEach((t) => tags.add(t.name));
    });
    return Array.from(tags);
  }, [initialPosts]);

  // Filter posts based on query and tag
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        selectedTag === "ALL" ||
        post.tags?.some((t) => t.name.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [initialPosts, searchQuery, selectedTag]);

  // Designate the first post as featured if no filter is applied
  const featuredPost = filteredPosts.length > 0 && searchQuery === "" && selectedTag === "ALL" ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="space-y-12">
      {/* Search & Tag Filter Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-surface/80 p-5 sm:p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search engineering articles, system notes, or technologies..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-cyan/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-cyan"
              >
                Clear
              </button>
            )}
          </div>

          {/* Post Counter Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs text-muted-foreground">
            <Filter size={13} className="text-cyan" />
            <span>Showing <span className="text-foreground font-semibold">{filteredPosts.length}</span> of {initialPosts.length} notes</span>
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1">
            Topics:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag("ALL")}
            className={`rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all ${
              selectedTag === "ALL"
                ? "border border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "border border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
            }`}
          >
            All Topics
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all ${
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? "border border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  : "border border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Hero Article */}
      {featuredPost && (
        <section aria-label="Featured Engineering Article">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-2xl transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                <Sparkles size={12} className="animate-pulse" />
                <span>FEATURED ENGINEERING DISPATCH</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {featuredPost.publishedAt ? formatDate(featuredPost.publishedAt) : "Archived"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan">
                  <Clock size={12} />
                  {calculateReadingTime(featuredPost.content)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground group-hover:text-cyan transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {featuredPost.tags?.map((t) => (
                    <span
                      key={t.slug}
                      className="rounded-md border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 font-mono text-xs text-cyan"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan">
                  <span>Read Full Technical Note</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
                </div>
              </div>

              {featuredPost.coverImage && (
                <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 450px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Grid of Articles */}
      {gridPosts.length > 0 ? (
        <section aria-label="Engineering Notes Grid" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-surface/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:bg-white/[0.04] hover:shadow-[0_0_24px_rgba(6,182,212,0.1)]"
            >
              <div className="space-y-4">
                {post.coverImage && (
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                  <span>{post.publishedAt ? formatDate(post.publishedAt) : "Dossier"}</span>
                  <span className="flex items-center gap-1 text-cyan">
                    <Clock size={11} />
                    {calculateReadingTime(post.content)}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-cyan transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags?.slice(0, 3).map((t) => (
                    <span
                      key={t.slug}
                      className="rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-cyan">
                <span>Read Dispatch</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-surface/50 p-12 text-center backdrop-blur-xl">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            No matching dispatches found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or select &quot;All Topics&quot; to view all technical notes.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag("ALL");
            }}
            className="mt-5 rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs text-cyan hover:bg-cyan/20 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
