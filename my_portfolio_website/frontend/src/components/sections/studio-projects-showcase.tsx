"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { StudioProjectCard } from "@/components/projects/studio-project-card";
import styles from "@/components/projects/project-views.module.css";

/**
 * Homepage "Featured projects": one horizontal row of the projects chosen in
 * the CMS, in CMS order. Up to four cards are visible (three on smaller
 * laptops); the arrow buttons move one card at a time. Nothing scrolls on its
 * own.
 */
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
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // A few pixels of tolerance for sub-pixel widths and snap rounding.
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateEdges);
    observer?.observe(track);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      observer?.disconnect();
    };
  }, [updateEdges, visible.length]);

  const scrollOneCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

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
        <div className={styles.showcaseControls}>
          {visible.length > 1 && (
            <div className={styles.carouselNav}>
              <button
                type="button"
                className={styles.carouselButton}
                onClick={() => scrollOneCard(-1)}
                disabled={atStart}
                aria-controls="featured-projects-track"
                aria-label="Previous project"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.carouselButton}
                onClick={() => scrollOneCard(1)}
                disabled={atEnd}
                aria-controls="featured-projects-track"
                aria-label="Next project"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
          <Link href="/projects" className={styles.action}>
            All projects <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
      {visible.length > 0 ? (
        <ul
          id="featured-projects-track"
          ref={trackRef}
          className={styles.carouselTrack}
          aria-label="Featured projects. Scroll sideways or use the arrow buttons to see more."
          tabIndex={0}
        >
          {visible.map((project, index) => (
            <li
              key={project.id}
              className={styles.carouselItem}
              aria-label={`${index + 1} of ${visible.length}: ${project.title}`}
            >
              <StudioProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          No featured projects at the moment. Explore the project directory for
          more work.
        </p>
      )}
    </section>
  );
}
