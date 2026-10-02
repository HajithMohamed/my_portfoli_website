import "server-only";

import { getPublicGithub } from "./github-public";
import { PERSONAL_IDENTITY } from "./identity";
import {
  fallbackCertificates,
  fallbackGallery,
  fallbackGithub,
  fallbackProfile,
  fallbackResume,
  fallbackSkills,
  fallbackTestimonials,
} from "./fallback-data";
import { projectsFromGithub, reviewedBlogPosts } from "./portfolio-mapping";
import { absoluteApiUrl } from "./utils";
import type {
  Certificate,
  CvAsset,
  GithubSummary,
  HomeData,
  MediaAsset,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "./types";

async function fetchBackend<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(absoluteApiUrl(path), {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    return response.ok ? ((await response.json()) as T) : fallback;
  } catch {
    return fallback;
  }
}

function profileForPortfolio(candidate: Profile): Profile {
  const githubLink = { label: "GitHub", url: PERSONAL_IDENTITY.githubUrl, icon: "github" };
  const otherLinks = (candidate.socialLinks ?? []).filter(
    (link) => link.url.replace(/\/$/, "").toLowerCase() !== PERSONAL_IDENTITY.githubUrl.toLowerCase(),
  );

  return {
    ...fallbackProfile,
    ...candidate,
    name: PERSONAL_IDENTITY.name,
    title: PERSONAL_IDENTITY.title,
    bio: PERSONAL_IDENTITY.bio,
    location: PERSONAL_IDENTITY.location,
    timeline: [{ label: "Education", value: PERSONAL_IDENTITY.education }],
    socialLinks: [githubLink, ...otherLinks],
  };
}

function usableGithub(summary: GithubSummary): boolean {
  return Boolean(summary.contributionData?.repositories?.length || summary.currentRepo || summary.recentRepos.length);
}

function inferCategory(techName: string): string {
  const lower = techName.toLowerCase();
  if (['javascript', 'typescript', 'java', 'php', 'python', 'html', 'css', 'sql', 'c', 'c++', 'go', 'rust', 'shell', 'bash'].includes(lower)) {
    return 'Languages';
  }
  if (['react', 'next.js', 'nextjs', 'redux', 'redux toolkit', 'vue', 'angular', 'tailwind css', 'tailwindcss', 'bootstrap', 'alpine.js', 'jquery', 'html5', 'css3'].includes(lower)) {
    return 'Frontend';
  }
  if (['node.js', 'nodejs', 'express', 'nestjs', 'spring boot', 'spring', 'django', 'fastapi', 'rest api', 'graphql', 'socket.io', 'microservices'].includes(lower)) {
    return 'Backend';
  }
  if (['mongodb', 'mysql', 'postgresql', 'postgres', 'redis', 'prisma', 'docker', 'kubernetes', 'aws', 'supabase', 'firebase'].includes(lower)) {
    return 'Database';
  }
  return 'Tools';
}

export function syncSkillsWithGithub(baseSkills: Skill[], github: GithubSummary): Skill[] {
  const skillMap = new Map<string, Skill>();
  baseSkills.forEach((s) => skillMap.set(s.name.toLowerCase(), { ...s }));

  // Extract all languages from github.languages or repositories
  const githubLanguages: Array<{ name: string; weight: number }> = [];
  if (github.languages && typeof github.languages === 'object' && !Array.isArray(github.languages)) {
    Object.entries(github.languages).forEach(([name, bytes]) => {
      githubLanguages.push({ name, weight: Number(bytes) || 1000 });
    });
  }

  // Also collect languages from repositories
  const repos = github.contributionData?.repositories ?? [];
  repos.forEach((repo) => {
    if (repo.language) {
      const existing = githubLanguages.find((l) => l.name.toLowerCase() === repo.language?.toLowerCase());
      if (existing) {
        existing.weight += 10000 + (repo.stars ?? 0) * 1000;
      } else {
        githubLanguages.push({ name: repo.language, weight: 10000 + (repo.stars ?? 0) * 1000 });
      }
    }
  });

  const maxWeight = Math.max(1, ...githubLanguages.map((l) => l.weight));

  githubLanguages.forEach(({ name, weight }) => {
    const key = name.toLowerCase();
    const calculatedProficiency = Math.min(95, Math.max(70, Math.round(75 + (weight / maxWeight) * 20)));
    const existing = skillMap.get(key);
    if (existing) {
      existing.proficiency = Math.max(existing.proficiency, calculatedProficiency);
      existing.featured = true;
    } else {
      skillMap.set(key, {
        id: `gh-lang-${key}`,
        name,
        category: inferCategory(name),
        proficiency: calculatedProficiency,
        featured: true,
      });
    }
  });

  // Add detected technologies/topics from GitHub
  const detectedTech = github.contributionData?.technologies ?? [];
  detectedTech.forEach((tech) => {
    const key = tech.toLowerCase();
    if (!skillMap.has(key)) {
      skillMap.set(key, {
        id: `gh-tech-${key}`,
        name: tech,
        category: inferCategory(tech),
        proficiency: 82,
        featured: false,
      });
    }
  });

  const merged = Array.from(skillMap.values());
  return merged.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.proficiency - a.proficiency;
  });
}

/**
 * Public portfolio data is deliberately built from GitHub's public API first.
 * The CMS remains useful for private/admin content, but it cannot replace a
 * person's actual repository history on the public site.
 */
export async function getHomeData(): Promise<HomeData> {
  const [profile, skills, cmsProjects, visibility, resume, backendGithub, testimonials, certificates, gallery] =
    await Promise.all([
      fetchBackend<Profile>("/profile", fallbackProfile),
      fetchBackend<Skill[]>("/skills", fallbackSkills),
      fetchBackend<Project[]>("/projects", []),
      fetchBackend<Array<Pick<Project, "id" | "githubUrl" | "status">>>("/projects/visibility", []),
      fetchBackend<CvAsset | null>("/resume/latest", fallbackResume),
      fetchBackend<GithubSummary>("/github/summary", fallbackGithub),
      fetchBackend<Testimonial[]>("/testimonials", fallbackTestimonials),
      fetchBackend<Certificate[]>("/certificates", fallbackCertificates),
      fetchBackend<MediaAsset[]>("/media?category=gallery", fallbackGallery),
    ]);

  const publicGithub = await getPublicGithub();
  const github = publicGithub ?? (usableGithub(backendGithub) ? backendGithub : fallbackGithub);
  const activeUrls = new Set(cmsProjects.map((project) => project.githubUrl).filter(Boolean));
  const visibilityOverrides = visibility
    .filter((item) => item.githubUrl && !activeUrls.has(item.githubUrl))
    .map((item) => ({ ...item, title: "", slug: "", description: "", techStack: [], category: "", featured: false } as Project));
  const projects = projectsFromGithub(github, [...cmsProjects, ...visibilityOverrides]);
  const blogs = reviewedBlogPosts();

  const dynamicSkills = syncSkillsWithGithub(skills.length ? skills : fallbackSkills, github);

  return {
    profile: profileForPortfolio(profile),
    skills: dynamicSkills,
    projects,
    blogs,
    resume,
    github,
    testimonials,
    certificates,
    gallery,
  };
}

export async function getProject(slug: string): Promise<Project | null> {
  const { projects } = await getHomeData();
  const normalizedSlug = slug.toLowerCase();
  return (
    projects.find(
      (project) =>
        project.slug.toLowerCase() === normalizedSlug ||
        project.dedupeKey?.toLowerCase() === normalizedSlug ||
        project.relatedRepositories?.some((r) => r.toLowerCase().includes(normalizedSlug))
    ) ?? null
  );
}

export async function getBlogPost(slug: string) {
  return reviewedBlogPosts().find((post) => post.slug === slug) ?? null;
}
