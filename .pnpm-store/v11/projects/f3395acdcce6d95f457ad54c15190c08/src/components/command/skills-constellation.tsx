"use client";

import { Panel } from "@/components/hud/panel";
import type { Skill } from "@/lib/types";
import { lookupTech, techIconUrl } from "@/lib/tech-registry";
import { motion } from "framer-motion";

export function SkillsConstellation({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const groups = [...new Set(skills.map((s) => s.category))].map((category) => ({
    group: category,
    items: skills
      .filter((s) => s.category === category)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Panel label="skill.matrix" subtitle="operational stack" className="h-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:grid-cols-2 h-full"
      >
        {groups.map((g, i) => (
          <motion.div key={g.group} variants={itemVariants} className="group relative overflow-hidden rounded-md border border-cyan/15 bg-surface-2/30 p-4 transition-colors hover:border-cyan/40 hover:bg-surface-2/50">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative z-10 mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-cyan font-medium group-hover:text-cyan-glow transition-colors">
                {String(i + 1).padStart(2, "0")} — {g.group}
              </span>
              <span className="text-muted-foreground border border-cyan/10 px-1.5 rounded-sm bg-black/20">{g.items.length}</span>
            </div>
            
            <ul className="relative z-10 space-y-3 font-mono text-[11px]">
              {g.items.map((it) => {
                const meta = lookupTech(it.name);
                return (
                  <li
                    key={it.id}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-foreground transition-colors hover:text-cyan">
                        {meta ? (
                           <img src={techIconUrl(meta)} alt="" className="h-3.5 w-3.5 opacity-80" aria-hidden />
                        ) : (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan/50" />
                        )}
                        {it.name}
                      </span>
                      {it.proficiency && (
                        <span className="text-[9px] text-muted-foreground">{it.proficiency}%</span>
                      )}
                    </div>
                    {it.proficiency && (
                      <div className="h-1 w-full overflow-hidden rounded-full bg-cyan/10">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan to-violet opacity-80"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${it.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Panel>
  );
}
