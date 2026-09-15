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

/**
 * Public portfolio data is deliberately built from GitHub's public API first.
 * The CMS remains useful for private/admin content, but it cannot replace a
 * person's actual repository history on the public site.
 */
export async function getHomeData(): Promise<HomeData> {
  const [profile, skills, cmsProjects, resume, backendGithub, testimonials, certificates, gallery] =
    await Promise.all([
      fetchBackend<Profile>("/profile", fallbackProfile),
      fetchBackend<Skill[]>("/skills", fallbackSkills),
      fetchBackend<Project[]>("/projects", []),
      fetchBackend<CvAsset | null>("/resume/latest", fallbackResume),
      fetchBackend<GithubSummary>("/github/summary", fallbackGithub),
      fetchBackend<Testimonial[]>("/testimonials", fallbackTestimonials),
      fetchBackend<Certificate[]>("/certificates", fallbackCertificates),
      fetchBackend<MediaAsset[]>("/media?category=gallery", fallbackGallery),
    ]);

  const publicGithub = await getPublicGithub();
  const github = publicGithub ?? (usableGithub(backendGithub) ? backendGithub : fallbackGithub);
  const projects = projectsFromGithub(github, cmsProjects);
  const blogs = reviewedBlogPosts();

  return {
    profile: profileForPortfolio(profile),
    skills: skills.length ? skills : fallbackSkills,
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
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getBlogPost(slug: string) {
  return reviewedBlogPosts().find((post) => post.slug === slug) ?? null;
}
