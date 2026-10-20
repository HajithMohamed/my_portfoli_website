"use client";

import React, { useState } from "react";
import { 
  Layers, 
  Database, 
  Smartphone, 
  ShieldCheck, 
  Cpu, 
  Zap,
  CheckCircle2
} from "lucide-react";

export type ArchitectureTier = {
  id: string;
  name: string;
  subtitle: string;
  icon: "client" | "gateway" | "services" | "data";
  protocol: string;
  latency: string;
  technologies: string[];
  description: string;
  responsibilities: string[];
};

interface ProjectArchitectureVisualizerProps {
  projectTitle: string;
  techStack: string[];
  category?: string;
}

export function ProjectArchitectureVisualizer({
  projectTitle,
  techStack,
  category = "Enterprise System",
}: ProjectArchitectureVisualizerProps) {
  // Map tech stack into tiers intelligently
  const clientTech = techStack.filter((t) =>
    /react|next|vue|tailwind|redux|html|css|typescript|javascript|vite/i.test(t)
  );
  const gatewayTech = techStack.filter((t) =>
    /nest|express|node|gateway|nginx|auth|jwt|rest|graphql/i.test(t)
  );
  const dataTech = techStack.filter((t) =>
    /mongo|postgres|sql|prisma|redis|firebase|s3|storage|database/i.test(t)
  );
  const servicesTech = techStack.filter(
    (t) =>
      !clientTech.includes(t) &&
      !gatewayTech.includes(t) &&
      !dataTech.includes(t)
  );

  const tiers: ArchitectureTier[] = [
    {
      id: "client-tier",
      name: "Presentation & Client Tier",
      subtitle: "Responsive UI & State Engine",
      icon: "client",
      protocol: "HTTPS / WSS (HTTP/2)",
      latency: "< 45ms First Input",
      technologies: clientTech.length > 0 ? clientTech : ["React", "TypeScript", "Tailwind CSS"],
      description: "Delivers an accessible, zero-latency user interface with optimistic state management and responsive client views.",
      responsibilities: [
        "Optimistic state caching and immediate UI feedback",
        "Responsive glassmorphic design system compliance",
        "Client-side schema validation and bot defense telemetry",
      ],
    },
    {
      id: "gateway-tier",
      name: "API Gateway & Security Proxy",
      subtitle: "Reverse Proxy & Authentication",
      icon: "gateway",
      protocol: "RESTful JSON / WebSockets",
      latency: "< 35ms Edge Proxy",
      technologies: gatewayTech.length > 0 ? gatewayTech : ["Node.js", "Express / NestJS", "JWT"],
      description: "Serves as the guarded perimeter handling CORS headers, rate limiting, token verification, and payload normalization.",
      responsibilities: [
        "Role-Based Access Control (RBAC) token inspection",
        "Request sanitization and DTO constraint validation",
        "Real-time event streaming and push notifications",
      ],
    },
    {
      id: "services-tier",
      name: "Domain Core & Business Engine",
      subtitle: "Microservices & Worker Dispatcher",
      icon: "services",
      protocol: "Async Event Bus / Worker Queue",
      latency: "< 80ms Transaction Cycle",
      technologies: servicesTech.length > 0 ? servicesTech : ["Business Logic", "Service Workers", "Docker"],
      description: "Orchestrates transactional boundaries, inventory synchronization, financial reconciliations, and reporting pipelines.",
      responsibilities: [
        "Idempotent transaction processing with rollbacks",
        "Concurrent event processing and inventory lock management",
        "Automated auditing and diagnostic telemetry logging",
      ],
    },
    {
      id: "data-tier",
      name: "Persistence & Data Store",
      subtitle: "Document / Relational & Cache",
      icon: "data",
      protocol: "TCP Wire Protocol / Redis",
      latency: "< 12ms Query Indexing",
      technologies: dataTech.length > 0 ? dataTech : ["MongoDB / PostgreSQL", "Redis", "Cloud Storage"],
      description: "High-throughput storage tier engineered for ACID transaction guarantees, structured indexing, and sub-second querying.",
      responsibilities: [
        "Schema-enforced collections and relational constraints",
        "Hot-path key-value caching for frequent operational queries",
        "Automated point-in-time recovery and snapshot replication",
      ],
    },
  ];

  const [activeTierId, setActiveTierId] = useState<string>(tiers[0].id);
  const activeTier = tiers.find((t) => t.id === activeTierId) || tiers[0];

  const getIcon = (type: ArchitectureTier["icon"]) => {
    switch (type) {
      case "client":
        return <Smartphone className="h-5 w-5 text-cyan" />;
      case "gateway":
        return <ShieldCheck className="h-5 w-5 text-indigo-400" />;
      case "services":
        return <Cpu className="h-5 w-5 text-emerald-400" />;
      case "data":
        return <Database className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface/90 p-6 sm:p-8 backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <Layers size={13} />
            <span>INTERACTIVE ARCHITECTURE TOPOLOGY</span>
          </div>
          <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-foreground">
            {projectTitle} System Architecture
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs text-cyan">
          <Zap size={12} className="animate-pulse" />
          <span>Click Nodes To Inspect Tiers</span>
        </div>
      </div>

      {/* Architecture Topology Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, index) => {
          const isActive = tier.id === activeTierId;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setActiveTierId(tier.id)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-cyan bg-cyan/[0.08] shadow-[0_0_24px_rgba(6,182,212,0.15)] ring-1 ring-cyan/40"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05]">
                    {getIcon(tier.icon)}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Tier 0{index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {tier.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {tier.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-cyan">
                <span>{tier.protocol.split(" ")[0]}</span>
                <span className="text-muted-foreground">{tier.latency}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tier Deep-Dive Details */}
      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5 sm:p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/10">
              {getIcon(activeTier.icon)}
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                ACTIVE TIER INSPECTION
              </div>
              <h4 className="font-display text-lg font-bold text-foreground">
                {activeTier.name}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-muted-foreground">
              Protocol: <span className="text-foreground">{activeTier.protocol}</span>
            </span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
              SLA: {activeTier.latency}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">
          {activeTier.description}
        </p>

        {/* Responsibilities */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            CORE RESPONSIBILITIES & ARCHITECTURAL PATTERNS
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {activeTier.responsibilities.map((resp, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-foreground/80"
              >
                <CheckCircle2 size={13} className="text-cyan mt-0.5 shrink-0" />
                <span>{resp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mapped Technologies */}
        <div className="pt-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            INTEGRATED STACK MODULES
          </div>
          <div className="flex flex-wrap gap-2">
            {activeTier.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cyan"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
