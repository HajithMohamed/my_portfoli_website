"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { projectGalleryMedia, safeMediaUrl } from "@/lib/project-media";
import { publicWebsite } from "@/lib/portfolio-mapping";
import { ProjectMediaGallery } from "./project-media-gallery";
import styles from "./project-views.module.css";

export function StudioProjectCard({
  project,
  lead = false,
}: {
  project: Project;
  lead?: boolean;
}) {
  const media = projectGalleryMedia(project);
  const liveUrl = publicWebsite(project.liveUrl);
  const githubUrl = safeMediaUrl(project.githubUrl);
  return (
    <article className={`${styles.card} ${lead ? styles.lead : ""}`}>
      <ProjectMediaGallery
        key={`${project.id}:${project.coverImage ?? ""}`}
        project={project}
        compact={!lead}
      />
      <div className={styles.copy}>
        <span className={styles.eyebrow}>{project.category}</span>
        <h3>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags} aria-label="Technologies">
          {project.techStack.slice(0, lead ? 8 : 4).map((tech) => (
            <span key={tech} className={styles.tag}>
              {tech}
            </span>
          ))}
        </div>
        <div className={styles.actions}>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`${styles.action} ${styles.primary}`}
            >
              Live demo <ExternalLink size={13} aria-hidden="true" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.action}
            >
              <Github size={14} aria-hidden="true" /> GitHub
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className={styles.action}
            aria-label={`Case study for ${project.title}`}
          >
            Case study <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {lead && media.length > 0 && (
          <span className={styles.meta}>
            {media.filter((item) => item.type !== "VIDEO").length} images ·{" "}
            {media.filter((item) => item.type === "VIDEO").length} videos
          </span>
        )}
      </div>
    </article>
  );
}
