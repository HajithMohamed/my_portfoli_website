import type { BlogPost, GithubSummary, PortfolioRepository, Project } from "./types";
import { projectStories } from "./project-stories";

export function repositorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function publicWebsite(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (!host.includes('.') || host === 'localhost' || host.endsWith('.local') ||
      host === 'github.com' || host.endsWith('.github.com') || host === 'example.com' ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':')) return null;
    return url.href;
  } catch { return null; }
}

export function projectsFromGithub(github: GithubSummary, cmsProjects: Project[] = []): Project[] {
  const repos = github.contributionData?.repositories;
  const cmsByRepo = new Map(cmsProjects.filter(p => p.githubUrl).map(p => [p.githubUrl!.replace(/\/$/, '').toLowerCase(), p]));
  const current = (github.currentRepo ?? github.contributionData?.currentRepo)?.fullName?.toLowerCase();
  // If GitHub is unavailable, retain reviewed stories but don't invent live metrics/status.
  const available: PortfolioRepository[] = repos ?? projectStories.map(story => ({
    name: story.repository.split('/')[1], fullName: story.repository,
    url: `https://github.com/${story.repository}`, description: story.summary,
  }));
  return available.map(repo => {
    const story = projectStories.find(s => s.repository.toLowerCase() === repo.fullName.toLowerCase());
    const cms = cmsByRepo.get(repo.url.toLowerCase());
    return {
      ...cms,
      id: `github:${repo.fullName}`,
      slug: cms?.slug ?? repositorySlug(repo.name),
      title: story?.title ?? repo.name.replace(/[-_]+/g, ' '),
      description: story?.summary ?? repo.goal ?? repo.description ?? 'Public repository by Mohamed Hajith. View the source for project details.',
      techStack: story?.technologies ?? cms?.techStack ?? (repo.language ? [repo.language] : []),
      category: story ? 'Project case study' : 'GitHub repository',
      status: repo.isArchived ? 'ARCHIVED' : 'ACTIVE',
      featured: Boolean(story || repo.fullName.toLowerCase() === current),
      githubUrl: repo.url,
      liveUrl: publicWebsite(repo.liveUrl ?? repo.homepage),
      coverImage: story?.coverImage ?? cms?.coverImage ?? null,
      coverImageKind: story?.coverImage ? 'concept' : undefined,
      coverImageAlt: story?.coverImage ? `Concept illustration of ${story.title}: ${story.goal}` : undefined,
      caseStudy: story?.sections ?? (repo.goal ? [{ heading: 'Project goal', body: repo.goal }] : []),
      outcome: undefined,
      updatedAt: repo.pushedAt ?? repo.updatedAt,
      createdAt: repo.createdAt,
      repositoryFullName: repo.fullName,
      isCurrent: repo.fullName.toLowerCase() === current,
      isHosted: Boolean(publicWebsite(repo.liveUrl ?? repo.homepage)),
      isProductionReady: repo.isProductionReady ?? false,
      readinessChecked: repo.readinessChecked,
      readinessEvidence: repo.readinessEvidence ?? [],
      sourceUrl: story?.sourceUrl ?? repo.goalSourceUrl ?? repo.url,
    } satisfies Project;
  }).sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent) || Number(b.featured) - Number(a.featured) || (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
}

export function reviewedBlogPosts(): BlogPost[] {
  return projectStories.map(story => ({
    id: `story:${story.repository}`, ...story.blog, coverImage: story.coverImage,
    coverImageAlt: `Concept illustration for ${story.title}`,
    author: 'Mohamed Hajith', status: 'PUBLISHED', publishedAt: `${story.reviewedAt}T00:00:00.000Z`,
    sourceUrl: story.sourceUrl,
    tags: story.technologies.slice(0, 3).map(name => ({name, slug: repositorySlug(name)})),
  }));
}
