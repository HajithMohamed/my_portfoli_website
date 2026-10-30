"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { StudioProjectCard } from "@/components/projects/studio-project-card";
import styles from "@/components/projects/project-views.module.css";

export function StudioProjectsShowcase({
  projects = [],
}: {
  projects?: Project[];
}) {
  const visible = projects.filter(
    (project) =>
      project.status === "ACTIVE" &&
      (project.showOnHomepage ?? project.featured),
  );
  return (
    <section
      id="work"
      aria-labelledby="featured-projects-heading"
      className={styles.showcase}
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>Selected work</span>
          <h2 id="featured-projects-heading">Featured projects</h2>
          <p>
            Software, systems, and the details behind them. Explore project
            screenshots, demos, and engineering case studies.
          </p>
        </div>
        <Link href="/projects" className={styles.action}>
          All projects <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      {visible.length > 0 ? (
        <div className={styles.grid}>
          {visible.map((project) => (
            <StudioProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          No featured projects at the moment. Explore the project directory for
          more work.
        </p>
      )}
    </section>
  );
}
