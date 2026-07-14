"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RevealAnimation } from "@/components/ui/reveal-animation";

const testimonials = [
  {
    name: "Alex M.",
    role: "Startup Founder",
    company: "TechCo",
    quote: "Delivered a production-ready booking system with clean architecture and excellent documentation. The attention to detail was impressive.",
    project: "Booking System",
    initials: "AM",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Sarah K.",
    role: "Product Manager",
    company: "DigitalWorks",
    quote: "The e-commerce backend was modular, well-documented, and shipped ahead of schedule. A developer who understands product context.",
    project: "Commerce Platform",
    initials: "SK",
    color: "from-violet-500 to-violet-700",
  },
  {
    name: "James R.",
    role: "CTO",
    company: "BuildFast",
    quote: "The authentication infrastructure was rock solid — JWT rotation, RBAC, everything secured properly. Exactly what we needed.",
    project: "Auth Infrastructure",
    initials: "JR",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Priya L.",
    role: "Engineering Lead",
    company: "FlowSys",
    quote: "Excellent communication throughout, clean code, and proper test coverage. A developer who understands engineering at scale.",
    project: "Admin Dashboard",
    initials: "PL",
    color: "from-amber-500 to-amber-700",
  },
];

function TestimonialCard({
  testimonial,
  onClick,
}: {
  testimonial: (typeof testimonials)[0];
  onClick: () => void;
}) {
  return (
    <motion.div
      className="flex-shrink-0 w-[320px] cursor-pointer"
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div className="h-full rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-sm p-5 hover:border-white/20 transition-all duration-300">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`h-9 w-9 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
          >
            {testimonial.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{testimonial.name}</p>
            <p className="text-xs text-slate-500">
              {testimonial.role} · {testimonial.company}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-6 italic">"{testimonial.quote}"</p>
        <div className="mt-3 text-xs text-blue-400">
          Project: {testimonial.project}
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const [selected, setSelected] = useState<(typeof testimonials)[0] | null>(null);

  return (
    <section className="py-24 overflow-hidden border-y border-white/10 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
        <RevealAnimation>
          <Badge>Testimonials</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
            What collaborators say
          </h2>
        </RevealAnimation>
      </div>

      {/* Infinite marquee */}
      <div
        className="testimonial-track flex gap-5 px-4"
        style={{ width: "max-content" }}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <TestimonialCard key={i} testimonial={t} onClick={() => setSelected(t)} />
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="rounded-2xl border border-white/15 bg-slate-900 p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className={`h-14 w-14 rounded-full bg-gradient-to-br ${selected.color} flex items-center justify-center text-white text-lg font-bold`}
                >
                  {selected.initials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{selected.name}</p>
                  <p className="text-sm text-slate-400">
                    {selected.role} · {selected.company}
                  </p>
                </div>
              </div>
              <p className="text-slate-200 leading-7 italic text-base">"{selected.quote}"</p>
              <div className="mt-4 text-sm text-blue-400">Project: {selected.project}</div>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
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
        .testimonial-track {
          animation: testimonial-marquee 30s linear infinite;
        }
        .testimonial-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
