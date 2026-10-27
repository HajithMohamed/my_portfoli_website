"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  GitBranch,
  Play,
  X,
} from "lucide-react";
import type { Project, ProjectMedia } from "@/lib/types";
import { projectGalleryMedia, safeMediaUrl } from "@/lib/project-media";
import styles from "./project-views.module.css";

function Preview({
  item,
  title,
  expanded = false,
  decorative = false,
}: {
  item: ProjectMedia;
  title: string;
  expanded?: boolean;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const image = safeMediaUrl(item.type === "VIDEO" ? item.posterUrl : item.url);
  if (!image || failed)
    return (
      <div className={styles.placeholder}>
        <GitBranch size={32} aria-hidden="true" />
        <span>
          {item.type === "VIDEO" ? "Project demo video" : "Preview unavailable"}
        </span>
      </div>
    );
  return (
    <Image
      src={image}
      alt={decorative ? "" : item.alt || `${title} preview`}
      fill
      sizes={expanded ? "95vw" : "(max-width: 767px) 100vw, 65vw"}
      className={expanded ? styles.expandedImage : styles.image}
      onError={() => setFailed(true)}
      unoptimized={
        !image.startsWith("/") &&
        !image.startsWith("https://res.cloudinary.com/")
      }
    />
  );
}

export function ProjectMediaGallery({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const media = projectGalleryMedia(project);
  const [selectedIndex, setIndex] = useState(() =>
    Math.max(
      0,
      media.findIndex((item) => item.url === project.coverImage),
    ),
  );
  const index = selectedIndex % Math.max(media.length, 1);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touch = useRef<number | null>(null);
  const selected = media[index % Math.max(media.length, 1)];

  useEffect(() => {
    if (!open || !dialog.current) return;
    const node = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      lastFocus.current?.focus();
    };
  }, [open]);

  function step(direction: number) {
    setIndex((current) => (current + direction + media.length) % media.length);
  }
  function openViewer() {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(true);
  }
  function keys(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
    if (event.target instanceof HTMLVideoElement) return;
    if (
      media.length > 1 &&
      (event.key === "ArrowRight" || event.key === "ArrowLeft")
    ) {
      event.preventDefault();
      event.stopPropagation();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  if (!selected)
    return (
      <div className={`${styles.gallery} ${compact ? styles.compact : ""}`}>
        <div className={styles.placeholder}>
          <GitBranch size={36} aria-hidden="true" />
          <span>Project preview</span>
          <p>Screenshots coming soon</p>
          <small>Explore the repository or case study below.</small>
        </div>
      </div>
    );

  const isVideo = selected.type === "VIDEO";
  return (
    <div
      className={`${styles.gallery} ${compact ? styles.compact : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${project.title} media gallery`}
      tabIndex={0}
      onKeyDown={keys}
      onTouchStart={(event) => {
        touch.current = event.changedTouches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touch.current !== null && media.length > 1) {
          const delta = touch.current - event.changedTouches[0].clientX;
          if (Math.abs(delta) > 50) step(delta > 0 ? 1 : -1);
        }
        touch.current = null;
      }}
    >
      <button
        type="button"
        className={styles.stage}
        onClick={openViewer}
        aria-label={`${isVideo ? "Play" : "Expand"} ${selected.alt || project.title}`}
      >
        <Preview key={selected.url} item={selected} title={project.title} />
        <span className={styles.mediaFlag}>
          {isVideo
            ? "Demo video"
            : project.coverImageKind === "concept" &&
                selected.url === project.coverImage
              ? "Concept illustration"
              : "Project screenshot"}
        </span>
        <span className={isVideo ? styles.play : styles.expand}>
          {isVideo ? (
            <Play size={22} aria-hidden="true" />
          ) : (
            <Expand size={16} aria-hidden="true" />
          )}
        </span>
      </button>
      {media.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.previous}`}
            onClick={() => step(-1)}
            aria-label="Previous media"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => step(1)}
            aria-label="Next media"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      <div className={styles.galleryFooter}>
        {!compact && media.length > 1 && (
          <div className={styles.thumbnails} aria-label="Choose project media">
            {media.map((item, i) => (
              <button
                type="button"
                key={`${item.url}-${i}`}
                className={styles.thumbnail}
                aria-label={`Show media ${i + 1}: ${item.alt || (item.type === "VIDEO" ? "Demo video" : "Screenshot")}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                {item.type === "VIDEO" ? (
                  <Play size={17} aria-hidden="true" />
                ) : (
                  <Preview item={item} title="" decorative />
                )}
              </button>
            ))}
          </div>
        )}
        <span className={styles.counter} aria-live="polite" aria-atomic="true">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(media.length).padStart(2, "0")}
        </span>
      </div>
      {open && (
        <dialog
          data-lenis-prevent
          ref={dialog}
          className={styles.lightbox}
          aria-label={`${project.title} media viewer`}
          onCancel={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
          onKeyDown={keys}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.lightboxHeader}>
            <p>{project.title}</p>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Close media viewer"
              autoFocus
            >
              <X size={22} />
            </button>
          </div>
          <div className={styles.lightboxMedia}>
            {isVideo ? (
              <video
                key={selected.url}
                src={selected.url}
                poster={safeMediaUrl(selected.posterUrl)}
                controls
                playsInline
                preload="metadata"
                aria-label={selected.alt || `${project.title} demo`}
              >
                <track kind="captions" label="Captions unavailable" />
                Your browser does not support this video.
              </video>
            ) : (
              <Preview
                key={selected.url}
                item={selected}
                title={project.title}
                expanded
              />
            )}
          </div>
          <div className={styles.lightboxFooter}>
            <button
              type="button"
              className={styles.close}
              disabled={media.length < 2}
              onClick={() => step(-1)}
              aria-label="Previous media in viewer"
            >
              <ChevronLeft size={22} />
            </button>
            <p>
              {selected.caption || selected.alt}
              <span>
                {index + 1} / {media.length}
              </span>
            </p>
            <button
              type="button"
              className={styles.close}
              disabled={media.length < 2}
              onClick={() => step(1)}
              aria-label="Next media in viewer"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
