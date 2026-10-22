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

export function getProjectDedupeKey(repoFullName?: string | null, slug?: string | null): string {
  const normalized = (repoFullName ?? slug ?? "").toLowerCase();
  if (normalized.includes("saga-elite")) return "saga-elite";
  if (normalized.includes("medical-lab-resource-reservation-system") || normalized.includes("benchbook")) return "benchbook";
  if (normalized.includes("bloodbridge")) return "bloodbridge";
  if (normalized.includes("my_portfoli") || normalized.includes("my-portfolio") || normalized.includes("hzlabs")) return "hzlabs-studio";
  if (normalized.includes("footwear_business_management_system") || normalized.includes("footwear-business-management-system")) return "shoe-bank";
  if (normalized.includes("shoe_bank_mrnstack") || normalized.includes("shoe-bank-mern")) return "shoe-bank-mern";
  if (normalized.includes("tech_bridge") || normalized.includes("tech-bridge")) return "tech-bridge";
  if (normalized.includes("library-management-system")) return "library-management-system";
  if (normalized.includes("nextgen")) return "nextgen-mobile-shop";
  return repoFullName?.toLowerCase() || slug?.toLowerCase() || "";
}

const PRIORITY_ORDER = [
  "saga-elite",
  "benchbook",
  "bloodbridge",
  "hzlabs-studio",
  "shoe-bank",
  "tech-bridge",
  "library-management-system",
  "nextgen-mobile-shop",
];

function getProjectPriority(p: Project): number {
  const key = (p.dedupeKey || p.slug || "").toLowerCase();
  for (let i = 0; i < PRIORITY_ORDER.length; i++) {
    if (key.includes(PRIORITY_ORDER[i])) return i;
  }
  return 999;
}

export function projectsFromGithub(github: GithubSummary, cmsProjects: Project[] = []): Project[] {
  const repos = github.contributionData?.repositories;
  const cmsByRepo = new Map(cmsProjects.filter(p => p.githubUrl).map(p => [p.githubUrl!.replace(/\/$/, '').toLowerCase(), p]));
  const current = (github.currentRepo ?? github.contributionData?.currentRepo)?.fullName?.toLowerCase();

  // Ensure curated project stories (e.g. collaborative or org repos) are always present
  const storyRepos: PortfolioRepository[] = projectStories.map(story => ({
    name: story.repository.split('/')[1] || story.repository,
    fullName: story.repository,
    url: `https://github.com/${story.repository}`,
    description: story.summary,
  }));
  const existingNames = new Set((repos ?? []).map(r => r.fullName.toLowerCase()));
  const missingFromGithub = storyRepos.filter(s => !existingNames.has(s.fullName.toLowerCase()));
  const available: PortfolioRepository[] = [...(repos ?? []), ...missingFromGithub];
  
  const mappedProjects = available.map(repo => {
    const story = projectStories.find(s => s.repository.toLowerCase() === repo.fullName.toLowerCase() ||
      repo.fullName.toLowerCase().endsWith(s.repository.split('/')[1]?.toLowerCase() ?? ''));
    const cms = cmsByRepo.get(repo.url.toLowerCase());
    const slug = cms?.slug ?? (story ? repositorySlug(story.title.split('—')[0].trim()) : repositorySlug(repo.name));
    const dedupeKey = getProjectDedupeKey(repo.fullName, slug);
    return {
      ...cms,
      id: `github:${repo.fullName}`,
      slug,
      dedupeKey,
      title: cms?.title ?? story?.title ?? repo.name.replace(/[-_]+/g, ' '),
      description: cms?.description ?? story?.summary ?? repo.goal ?? repo.description ?? 'Public repository by Mohamed Hajith. View the source for project details.',
      techStack: cms?.techStack?.length ? cms.techStack : (story?.technologies ?? (repo.language ? [repo.language] : [])),
      category: cms?.category ?? (story ? 'Project case study' : 'GitHub repository'),
      status: cms?.status ?? (repo.isArchived ? 'ARCHIVED' : 'ACTIVE'),
      featured: cms ? cms.featured : Boolean(story || repo.fullName.toLowerCase() === current),
      githubUrl: repo.url,
      liveUrl: cms?.liveUrl ?? publicWebsite(repo.liveUrl ?? repo.homepage),
      coverImage:
        cms?.coverImage ??
        story?.coverImage ??
        (repo.fullName.toLowerCase() === "hajithmohamed/tech_bridge"
          ? "/projects/tech-bridge-cover.png"
          : repo.fullName.toLowerCase().includes("nano-_zillas") || repo.fullName.toLowerCase().includes("nano-zillas")
          ? "/projects/nano-zillas-cover.jpg"
          : repo.fullName.toLowerCase().includes("spring_boot") || repo.fullName.toLowerCase().includes("spring-boot")
          ? "/projects/spring-boot-cover.jpg"
          : repo.fullName.toLowerCase().includes("todo_app") || repo.fullName.toLowerCase().includes("todo-app")
          ? "/projects/todo-app-cover.jpg"
          : repo.fullName.toLowerCase().includes("my_portfoli") || repo.fullName.toLowerCase().includes("my-portfolio")
          ? "/brand/project-blueprint.jpg"
          : null),
      coverImageKind: cms?.coverImage ? undefined : (story?.coverImage ? 'concept' : undefined),
      coverImageAlt: cms?.coverImage ? `Cover image for ${cms.title || story?.title || repo.name}` : (story?.coverImage ? `Illustration of ${story.title}: ${story.goal}` : undefined),
      caseStudy: cms?.caseStudy?.length ? cms.caseStudy : (story?.sections ?? (repo.goal ? [{ heading: 'Project goal', body: repo.goal }] : [])),
      outcome: cms?.outcome,
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
  }).filter(project => {
    const override = project.githubUrl ? cmsByRepo.get(project.githubUrl.replace(/\/$/, '').toLowerCase()) : undefined;
    return !override || override.status === 'ACTIVE';
  });

  const repoUrls = new Set(available.map((repo) => repo.url.replace(/\/$/, '').toLowerCase()));
  const standaloneCmsProjects = cmsProjects
    .filter((project) => project.status === 'ACTIVE')
    .filter((project) => !project.githubUrl || !repoUrls.has(project.githubUrl.replace(/\/$/, '').toLowerCase()))
    .map((project) => ({ ...project, id: `cms:${project.id}`, dedupeKey: project.slug }));

  // Presentation grouping by dedupeKey without contaminating techStacks
  const grouped = new Map<string, Project[]>();
  for (const p of [...mappedProjects, ...standaloneCmsProjects]) {
    const key = p.dedupeKey || p.slug;
    const existing = grouped.get(key) ?? [];
    existing.push(p);
    grouped.set(key, existing);
  }

  const deduplicated: Project[] = [];
  for (const [, group] of grouped) {
    if (group.length === 1) {
      deduplicated.push(group[0]);
    } else {
      group.sort((a, b) => {
        const aScore = (a.caseStudy?.length ? 10 : 0) + (a.coverImage ? 5 : 0) + (a.isCurrent ? 20 : 0);
        const bScore = (b.caseStudy?.length ? 10 : 0) + (b.coverImage ? 5 : 0) + (b.isCurrent ? 20 : 0);
        return bScore - aScore;
      });
      const primary = { ...group[0] };
      const relatedRepos: string[] = [];
      for (const other of group.slice(1)) {
        if (other.githubUrl) relatedRepos.push(other.githubUrl);
        if (!primary.liveUrl && other.liveUrl) primary.liveUrl = other.liveUrl;
        if (other.featured) primary.featured = true;
      }
      primary.relatedRepositories = relatedRepos;
      deduplicated.push(primary);
    }
  }

  return deduplicated.sort((a, b) => {
    const priorityDiff = getProjectPriority(a) - getProjectPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return Number(b.isCurrent) - Number(a.isCurrent) || Number(b.featured) - Number(a.featured) || (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
  });
}

export function reviewedBlogPosts(): BlogPost[] {
  return projectStories.map(story => ({
    id: `story:${story.repository}`, ...story.blog, coverImage: story.coverImage,
    coverImageAlt: `Illustration for ${story.title}`,
    author: 'Mohamed Hajith', status: 'PUBLISHED', publishedAt: `${story.reviewedAt}T00:00:00.000Z`,
    sourceUrl: story.sourceUrl,
    tags: story.technologies.slice(0, 3).map(name => ({name, slug: repositorySlug(name)})),
  }));
}
