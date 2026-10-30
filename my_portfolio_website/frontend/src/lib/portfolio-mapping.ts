import type { BlogPost, GithubSummary, Project } from "./types";
import { projectStories } from "./project-stories";

export function repositorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function publicWebsite(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const host = url.hostname.toLowerCase();
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      !host.includes(".") ||
      host.endsWith(".local") ||
      host === "github.com" ||
      host.endsWith(".github.com") ||
      host === "example.com" ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) ||
      host.includes(":")
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getProjectDedupeKey(
  repoFullName?: string | null,
  slug?: string | null,
): string {
  return (repoFullName ?? slug ?? "").replace(/\/$/, "").toLowerCase();
}

/** GitHub enriches approved CMS records; discovery never creates public cards. */
export function projectsFromGithub(
  github: GithubSummary,
  cmsProjects: Project[] = [],
): Project[] {
  const repos = Array.isArray(github?.contributionData?.repositories)
    ? github.contributionData.repositories
    : [];
  const current = (
    github?.currentRepo ?? github?.contributionData?.currentRepo
  )?.fullName?.toLowerCase();
  const safeProjects = Array.isArray(cmsProjects) ? cmsProjects : [];
  return safeProjects
    .filter((project) => project?.status === "ACTIVE")
    .map((project) => {
      const normalizedGithubUrl = project.githubUrl
        ?.replace(/\/$/, "")
        .toLowerCase();
      const repo = normalizedGithubUrl
        ? repos.find(
            (item) =>
              item?.url?.replace(/\/$/, "").toLowerCase() ===
              normalizedGithubUrl,
          )
        : undefined;
      const story = normalizedGithubUrl
        ? projectStories.find(
            (item) =>
              `https://github.com/${item.repository}`.toLowerCase() ===
              normalizedGithubUrl,
          )
        : undefined;
      const coverImage = project.coverImage;
      return {
        ...project,
        dedupeKey: project.id,
        repositoryFullName: repo?.fullName,
        isCurrent: Boolean(
          current && repo?.fullName && repo.fullName.toLowerCase() === current,
        ),
        isHosted: Boolean(publicWebsite(project.liveUrl)),
        liveUrl: publicWebsite(project.liveUrl),
        isProductionReady: repo?.isProductionReady ?? false,
        readinessChecked: repo?.readinessChecked,
        readinessEvidence: repo?.readinessEvidence ?? [],
        sourceUrl: story?.sourceUrl ?? project.githubUrl ?? undefined,
        coverImage,
        coverImageKind:
          story?.coverImage && coverImage === story.coverImage
            ? "concept"
            : project.coverImageKind,
        caseStudy: project.caseStudy ?? [],
      } satisfies Project;
    })
    .sort((a, b) => (a.homepageOrder ?? 0) - (b.homepageOrder ?? 0));
}

/** Legacy story data is available for editorial import, never public approval. */
export function reviewedBlogPosts(): BlogPost[] {
  return projectStories.map((story) => ({
    id: `story:${story.repository}`,
    ...story.blog,
    coverImage: story.coverImage,
    coverImageAlt: `Illustration for ${story.title}`,
    author: "Mohamed Hajith",
    status: "DRAFT",
    sourceUrl: story.sourceUrl,
    tags: story.technologies
      .slice(0, 3)
      .map((name) => ({ name, slug: repositorySlug(name) })),
  }));
}
