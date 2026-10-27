import type { Project, ProjectMedia } from "./types";

export function safeMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (/^\/(?!\/)/.test(value) && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !url.hostname.includes(".") ||
      url.hostname.endsWith(".local") ||
      /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)
    )
      return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function projectGalleryMedia(project: Project): ProjectMedia[] {
  const media = (project.media ?? [])
    .filter(
      (item) =>
        (item.type === "IMAGE" || item.type === "VIDEO" || !item.type) &&
        safeMediaUrl(item.url),
    )
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const cover = safeMediaUrl(project.coverImage);
  if (cover && !media.some((item) => item.url === cover)) {
    media.unshift({
      url: cover,
      alt: project.coverImageAlt ?? `${project.title} preview`,
      type: "IMAGE",
    });
  }
  return media;
}
