"use client";

import {
  BarChart3,
  CalendarClock,
  LockKeyhole,
  ServerCog,
  ShoppingBag,
  Workflow,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { RevealAnimation } from "@/components/ui/reveal-animation";

const services = [
  {
    icon: ShoppingBag,
    title: "Commerce Platforms",
    description: "End-to-end e-commerce architecture: catalog, storefront, checkout, and admin workflows.",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Cloudinary"],
    process: ["Requirements & wireframe", "Data model design", "API development", "Frontend build", "Testing & delivery"],
    color: "from-blue-500/20 to-blue-600/10",
    accentColor: "text-blue-300",
    borderColor: "border-blue-500/20",
  },
  {
    icon: CalendarClock,
    title: "Booking Systems",
    description: "Scheduling, availability management, user journey flows, and operational dashboards.",
    stack: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    process: ["Availability modeling", "Booking flow design", "Notification system", "Admin dashboard", "Integration"],
    color: "from-violet-500/20 to-violet-600/10",
    accentColor: "text-violet-300",
    borderColor: "border-violet-500/20",
  },
  {
    icon: LockKeyhole,
    title: "Auth Infrastructure",
    description: "JWT access tokens, refresh-token rotation, RBAC, validation, and secure session management.",
    stack: ["NestJS", "JWT", "Argon2", "Prisma"],
    process: ["Security review", "Auth flow design", "Implementation", "Role modeling", "Audit & hardening"],
    color: "from-emerald-500/20 to-emerald-600/10",
    accentColor: "text-emerald-300",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Admin Dashboards",
    description: "CMS controls, preview states, analytics views, and operator-friendly forms for your team.",
    stack: ["Next.js", "React Query", "Zod", "Tailwind"],
    process: ["UX mapping", "Component design", "API integration", "Permission layers", "Training docs"],
    color: "from-amber-500/20 to-amber-600/10",
    accentColor: "text-amber-300",
    borderColor: "border-amber-500/20",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description: "Workflow software that removes repeated manual effort from operational teams.",
    stack: ["NestJS", "Bull Queue", "PostgreSQL", "Cron"],
    process: ["Process audit", "Automation design", "Queue setup", "Monitoring", "Handoff"],
    color: "from-rose-500/20 to-rose-600/10",
    accentColor: "text-rose-300",
    borderColor: "border-rose-500/20",
  },
  {
    icon: ServerCog,
    title: "API Development",
    description: "NestJS and REST APIs with typed DTOs, Prisma data models, Swagger docs, and test coverage.",
    stack: ["NestJS", "Prisma", "Swagger", "Vitest"],
    process: ["Schema design", "Route planning", "Implementation", "Documentation", "Testing"],
    color: "from-sky-500/20 to-sky-600/10",
    accentColor: "text-sky-300",
    borderColor: "border-sky-500/20",
  },
];

export function ServicesSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <RevealAnimation>
        <div className="mb-14">
          <Badge>What I Build</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
            Product systems for real operations
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400 leading-7">
            Built multiple full-stack systems including e-commerce, authentication, booking, and business management platforms.
          </p>
        </div>
      </RevealAnimation>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map(({ title, description, icon: Icon, stack, process, color, accentColor, borderColor }, i) => {
          const isOpen = expanded === i;
          return (
            <RevealAnimation key={title} delay={i * 0.07} variant="slide-up">
              <motion.div
                layout
                className={`relative rounded-xl border ${isOpen ? borderColor : "border-white/10"} bg-slate-950/70 p-5 cursor-pointer transition-colors duration-300 overflow-hidden group`}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                {/* Animated background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 ${isOpen ? borderColor : ""}`}>
                      <Icon className={`h-5 w-5 ${accentColor}`} />
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </motion.div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Tech Stack</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {stack.map((t) => (
                              <span key={t} className={`text-xs px-2 py-0.5 rounded-md border ${borderColor} ${accentColor} bg-white/5`}>
                                {t}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Delivery Process</p>
                          <ol className="space-y-1.5">
                            {process.map((step, si) => (
                              <li key={step} className="flex items-center gap-2 text-xs text-slate-300">
                                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${accentColor} bg-white/5`}>
                                  {si + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </RevealAnimation>
          );
        })}
      </div>
    </section>
  );
}
