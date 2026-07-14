"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RevealAnimation } from "@/components/ui/reveal-animation";
import type { Testimonial } from "@/lib/types";

const GRADIENTS = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-cyan-500 to-cyan-700",
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function gradientFor(name: string): string {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}

function Avatar({ item, size }: { item: Testimonial; size: "sm" | "lg" }) {
  const dims = size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-xs";
  if (item.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={item.author} className={`${dims} shrink-0 rounded-full object-cover`} src={item.avatarUrl} />;
  }
  return (
    <div
      className={`${dims} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientFor(item.author)} font-bold text-white`}
    >
      {initialsOf(item.author)}
    </div>
  );
}

function meta(item: Testimonial): string {
  return [item.role, item.company].filter(Boolean).join(" · ");
}

function TestimonialCard({ item, onClick }: { item: Testimonial; onClick: () => void }) {
  return (
    <motion.div className="w-[320px] flex-shrink-0 cursor-pointer" onClick={onClick} whileHover={{ y: -4 }}>
      <div className="h-full rounded-xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20">
        <div className="mb-3 flex items-start gap-3">
          <Avatar item={item} size="sm" />
          <div>
            <p className="text-sm font-semibold text-white">{item.author}</p>
            {meta(item) ? <p className="text-xs text-slate-500">{meta(item)}</p> : null}
          </div>
        </div>
        <p className="text-sm italic leading-6 text-slate-300">&ldquo;{item.quote}&rdquo;</p>
        {item.project ? <div className="mt-3 text-xs text-blue-400">Project: {item.project}</div> : null}
      </div>
    </motion.div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [selected, setSelected] = useState<Testimonial | null>(null);

  // No genuine testimonials yet → hide the section entirely (never fabricate proof).
  if (!items || items.length === 0) {
    return null;
  }

  // Duplicate for a seamless marquee only when there are enough to scroll.
  const track = items.length >= 3 ? [...items, ...items] : items;

  return (
    <section className="overflow-hidden border-y border-white/10 bg-white/[0.015] py-24">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealAnimation>
          <Badge>Testimonials</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">What collaborators say</h2>
        </RevealAnimation>
      </div>

      <div
        className={`flex gap-5 px-4 ${items.length >= 3 ? "testimonial-track" : "mx-auto max-w-7xl flex-wrap justify-center"}`}
        style={items.length >= 3 ? { width: "max-content" } : undefined}
      >
        {track.map((item, i) => (
          <TestimonialCard item={item} key={`${item.id}-${i}`} onClick={() => setSelected(item)} />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-8 shadow-2xl"
              exit={{ scale: 0.9, opacity: 0 }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="mb-5 flex items-center gap-4">
                <Avatar item={selected} size="lg" />
                <div>
                  <p className="text-lg font-semibold text-white">{selected.author}</p>
                  {meta(selected) ? <p className="text-sm text-slate-400">{meta(selected)}</p> : null}
                </div>
              </div>
              <p className="text-base italic leading-7 text-slate-200">&ldquo;{selected.quote}&rdquo;</p>
              {selected.project ? <div className="mt-4 text-sm text-blue-400">Project: {selected.project}</div> : null}
              <button
                className="mt-6 text-xs text-slate-500 transition-colors hover:text-slate-300"
                onClick={() => setSelected(null)}
                type="button"
              >
                Close ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes testimonial-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonial-track { animation: testimonial-marquee 30s linear infinite; }
        .testimonial-track:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
