import "server-only";

import { unstable_cache } from "next/cache";
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
import { projectsFromGithub } from "./portfolio-mapping";
import { absoluteApiUrl } from "./utils";
import type {
  AboutData,
  Certificate,
  BlogPost,
  CvAsset,
  GithubSummary,
  HomeData,
  MediaAsset,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "./types";

const BACKEND_FETCH_TIMEOUT_MS = 8000;

function isDynamicServerError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    (error as { digest?: unknown }).digest === "DYNAMIC_SERVER_USAGE"
  );
}

function isMissingIncrementalCacheError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("incrementalCache missing in unstable_cache")
  );
}

function normalizeBackendData<T>(data: unknown, fallback: T): T {
  if (data === null || data === undefined) {
    return fallback;
  }
  if (Array.isArray(fallback)) {
    return (Array.isArray(data) ? data : fallback) as T;
  }
  if (typeof fallback === "object" && fallback !== null) {
    return (
      typeof data === "object" && !Array.isArray(data) ? data : fallback
    ) as T;
  }
  if (fallback === null) {
    return (
      typeof data === "object" && !Array.isArray(data) ? data : fallback
    ) as T;
  }
  return data as T;
}

const getCachedBackendJson = unstable_cache(
  async (url: string): Promise<{ data: unknown }> => {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }
    const data: unknown = await response.json();
    if (data === null || data === undefined) {
      throw new Error("Backend returned empty/null JSON");
    }
    return { data };
  },
  ["hz-labs-backend-json"],
  { revalidate: 60 },
);

async function fetchBackend<T>(path: string, fallback: T): Promise<T> {
  const url = absoluteApiUrl(path);
  const isNoStore = path.startsWith("/projects") || path.startsWith("/blogs");

  try {
    if (!isNoStore) {
      try {
        const cached = await getCachedBackendJson(url);
        return normalizeBackendData(cached.data, fallback);
      } catch (error) {
        if (isDynamicServerError(error)) {
          throw error;
        }
        if (!isMissingIncrementalCacheError(error)) {
          return fallback;
        }
      }
    }

    const response = await fetch(url, {
      ...(isNoStore
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      if (isNoStore && process.env.NODE_ENV !== "test") {
        console.warn(
          `[public-data] Backend ${path} responded with HTTP ${response.status}; failing closed to fallback.`,
        );
      }
      return fallback;
    }
    const data: unknown = await response.json();
    return normalizeBackendData(data, fallback);
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    if (isNoStore && process.env.NODE_ENV !== "test") {
      console.warn(
        `[public-data] Backend ${path} unreachable (${error instanceof Error ? error.message : "request failed"}); failing closed to fallback.`,
      );
    }
    return fallback;
  }
}

export type BackendConnectionStatus = {
  configured: boolean;
  reachable: boolean;
  database?: string;
  statusCode?: number;
  reason?: string;
  hint?: string;
};

export async function checkBackendStatus(): Promise<BackendConnectionStatus> {
  const configured = Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
  if (!configured && process.env.VERCEL === "1") {
    return {
      configured: false,
      reachable: false,
      reason: "missing_api_url",
      hint: "Set NEXT_PUBLIC_API_URL in Vercel Environment Variables to your public HTTPS backend origin and redeploy.",
    };
  }

  try {
    const response = await fetch(absoluteApiUrl("/health"), {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });

    const location = response.headers.get("location") ?? "";
    if (
      (response.status >= 300 && response.status < 400 && location.includes("vercel.com/sso-api")) ||
      location.includes("vercel.com/sso")
    ) {
      return {
        configured,
        reachable: false,
        statusCode: response.status,
        reason: "vercel_deployment_protection",
        hint: "NEXT_PUBLIC_API_URL points to a deployment protected by Vercel Authentication. Use your backend's public Production domain (e.g. https://<backend-project>.vercel.app).",
      };
    }

    const bodyText = await response.text();
    let parsed: {
      database?: string;
      reason?: string;
      hint?: string;
      message?: string;
    } | null = null;
    try {
      parsed = JSON.parse(bodyText) as {
        database?: string;
        reason?: string;
        hint?: string;
        message?: string;
      };
    } catch {
      parsed = null;
    }

    if (response.ok) {
      return {
        configured,
        reachable: true,
        database: parsed?.database ?? "connected",
        statusCode: response.status,
      };
    }

    if (bodyText.includes("Protected by Vercel Authentication")) {
      return {
        configured,
        reachable: false,
        statusCode: response.status,
        reason: "vercel_deployment_protection",
        hint: "NEXT_PUBLIC_API_URL points to a deployment protected by Vercel Authentication. Use your backend's public Production domain.",
      };
    }

    return {
      configured,
      reachable: false,
      database: parsed?.database,
      statusCode: response.status,
      reason: parsed?.reason ?? "backend_http_error",
      hint:
        parsed?.hint ??
        parsed?.message ??
        `Backend /health returned HTTP ${response.status}.`,
    };
  } catch (error) {
    return {
      configured,
      reachable: false,
      reason: "network_error",
      hint:
        error instanceof Error
          ? error.message
          : "Failed to connect to backend /health endpoint.",
    };
  }
}

function profileForPortfolio(candidate?: Partial<Profile> | null): Profile {
  const safeCandidate =
    candidate && typeof candidate === "object" && !Array.isArray(candidate)
      ? candidate
      : {};
  const githubLink = {
    label: "GitHub",
    url: PERSONAL_IDENTITY.githubUrl,
    icon: "github",
  };
  const linkedInLink = {
    label: "LinkedIn",
    url: PERSONAL_IDENTITY.linkedInUrl,
    icon: "linkedin",
  };
  const rawLinks = Array.isArray(safeCandidate.socialLinks)
    ? safeCandidate.socialLinks
    : [];
  const otherLinks = rawLinks.filter(
    (link) =>
      typeof link?.url === "string" &&
      link.url.trim().length > 0 &&
      link.url.replace(/\/$/, "").toLowerCase() !==
        PERSONAL_IDENTITY.githubUrl.toLowerCase() &&
      !link.url.toLowerCase().includes("linkedin.com"),
  );

  return {
    ...fallbackProfile,
    ...safeCandidate,
    currentlyExploring: Array.isArray(safeCandidate.currentlyExploring)
      ? safeCandidate.currentlyExploring
      : fallbackProfile.currentlyExploring,
    name: PERSONAL_IDENTITY.name,
    title: PERSONAL_IDENTITY.title,
    bio: PERSONAL_IDENTITY.bio,
    email: PERSONAL_IDENTITY.email,
    location: PERSONAL_IDENTITY.location,
    availabilityStatus: PERSONAL_IDENTITY.availability,
    timeline: [{ label: "Education", value: PERSONAL_IDENTITY.education }],
    socialLinks: [githubLink, linkedInLink, ...otherLinks],
  };
}

function usableGithub(summary?: GithubSummary | null): boolean {
  if (!summary || typeof summary !== "object") {
    return false;
  }
  return Boolean(
    (Array.isArray(summary.contributionData?.repositories) &&
      summary.contributionData.repositories.length > 0) ||
    summary.currentRepo ||
    (Array.isArray(summary.recentRepos) && summary.recentRepos.length > 0),
  );
}

function inferCategory(techName: string): string {
  const lower = techName.toLowerCase();
  if (
    [
      "flutter",
      "dart",
      "react native",
      "android",
      "ios",
      "swift",
      "kotlin",
    ].includes(lower)
  ) {
    return "Mobile";
  }
  if (
    [
      "machine learning",
      "deep learning",
      "ai",
      "ml",
      "pytorch",
      "tensorflow",
      "nlp",
      "llm",
      "langchain",
      "computer vision",
      "openai",
      "scikit-learn",
      "artificial intelligence",
    ].includes(lower)
  ) {
    return "AI/ML";
  }
  if (
    [
      "data science",
      "pandas",
      "numpy",
      "matplotlib",
      "seaborn",
      "data analysis",
      "statistics",
      "analytics",
      "big data",
    ].includes(lower)
  ) {
    return "Data Science";
  }
  if (
    [
      "javascript",
      "typescript",
      "java",
      "php",
      "python",
      "html",
      "css",
      "sql",
      "c",
      "c++",
      "c#",
      "go",
      "rust",
      "shell",
      "bash",
    ].includes(lower)
  ) {
    return "Languages";
  }
  if (
    [
      "react",
      "next.js",
      "nextjs",
      "redux",
      "redux toolkit",
      "vue",
      "angular",
      "tailwind css",
      "tailwindcss",
      "bootstrap",
      "alpine.js",
      "jquery",
      "html5",
      "css3",
    ].includes(lower)
  ) {
    return "Frontend";
  }
  if (
    [
      "node.js",
      "nodejs",
      "express",
      "nestjs",
      "spring boot",
      "spring",
      "django",
      "fastapi",
      "rest api",
      "graphql",
      "socket.io",
      "microservices",
    ].includes(lower)
  ) {
    return "Backend";
  }
  if (
    [
      "mongodb",
      "mysql",
      "postgresql",
      "postgres",
      "redis",
      "prisma",
      "supabase",
      "firebase",
    ].includes(lower)
  ) {
    return "Database";
  }
  return "Tools";
}

export function syncSkillsWithGithub(
  baseSkills: Skill[],
  github?: GithubSummary | null,
): Skill[] {
  const skillMap = new Map<string, Skill>();
  (Array.isArray(baseSkills) ? baseSkills : []).forEach((s) => {
    if (typeof s?.name === "string" && s.name.trim()) {
      skillMap.set(s.name.toLowerCase(), { ...s });
    }
  });

  // Extract all languages from github.languages or repositories
  const githubLanguages: Array<{ name: string; weight: number }> = [];
  if (
    github?.languages &&
    typeof github.languages === "object" &&
    !Array.isArray(github.languages)
  ) {
    Object.entries(github.languages).forEach(([name, bytes]) => {
      githubLanguages.push({ name, weight: Number(bytes) || 1000 });
    });
  }

  // Also collect languages from repositories
  const repos = Array.isArray(github?.contributionData?.repositories)
    ? github.contributionData.repositories
    : [];
  repos.forEach((repo) => {
    if (repo?.language) {
      const existing = githubLanguages.find(
        (l) => l.name.toLowerCase() === repo.language?.toLowerCase(),
      );
      if (existing) {
        existing.weight += 10000 + (repo.stars ?? 0) * 1000;
      } else {
        githubLanguages.push({
          name: repo.language,
          weight: 10000 + (repo.stars ?? 0) * 1000,
        });
      }
    }
  });

  const maxWeight = Math.max(1, ...githubLanguages.map((l) => l.weight));

  githubLanguages.forEach(({ name, weight }) => {
    const key = name.toLowerCase();
    const calculatedProficiency = Math.min(
      95,
      Math.max(70, Math.round(75 + (weight / maxWeight) * 20)),
    );
    const existing = skillMap.get(key);
    if (existing) {
      existing.proficiency = Math.max(
        existing.proficiency,
        calculatedProficiency,
      );
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
  const detectedTech = Array.isArray(github?.contributionData?.technologies)
    ? github.contributionData.technologies
    : [];
  detectedTech.forEach((tech) => {
    if (typeof tech !== "string" || !tech.trim()) return;
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

export async function getAboutData(): Promise<AboutData> {
  const [profile, resume] = await Promise.all([
    fetchBackend<Profile>("/profile", fallbackProfile),
    fetchBackend<CvAsset | null>("/resume/latest", fallbackResume),
  ]);

  const normalizedResume =
    resume && typeof resume === "object" && typeof resume.fileUrl === "string"
      ? resume
      : fallbackResume;

  return {
    profile: profileForPortfolio(profile),
    resume: normalizedResume,
  };
}

/**
 * CMS approval controls public projects and articles. GitHub telemetry remains
 * independent. If editorial data is unavailable, fail closed rather than
 * resurrecting held content from static stories or cached repository discovery.
 */
export async function getHomeData(): Promise<HomeData> {
  const [
    profile,
    skills,
    cmsProjects,
    blogs,
    resume,
    backendGithub,
    testimonials,
    certificates,
    gallery,
  ] = await Promise.all([
    fetchBackend<Profile>("/profile", fallbackProfile),
    fetchBackend<Skill[]>("/skills", fallbackSkills),
    fetchBackend<Project[]>("/projects", []),
    fetchBackend<BlogPost[]>("/blogs", []),
    fetchBackend<CvAsset | null>("/resume/latest", fallbackResume),
    fetchBackend<GithubSummary>("/github/summary", fallbackGithub),
    fetchBackend<Testimonial[]>("/testimonials", fallbackTestimonials),
    fetchBackend<Certificate[]>("/certificates", fallbackCertificates),
    fetchBackend<MediaAsset[]>("/media?category=gallery", fallbackGallery),
  ]);

  const publicGithub = await getPublicGithub();
  const github =
    publicGithub ??
    (usableGithub(backendGithub) ? backendGithub : fallbackGithub);
  const projects = projectsFromGithub(github, cmsProjects);

  const safeSkills = Array.isArray(skills) && skills.length ? skills : fallbackSkills;
  const dynamicSkills = syncSkillsWithGithub(safeSkills, github);
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const normalizedResume =
    resume && typeof resume === "object" && typeof resume.fileUrl === "string"
      ? resume
      : fallbackResume;

  return {
    profile: profileForPortfolio(profile),
    skills: dynamicSkills,
    projects,
    blogs: safeBlogs.filter((post) => post?.status === "PUBLISHED"),
    resume: normalizedResume,
    github,
    testimonials: Array.isArray(testimonials) ? testimonials : fallbackTestimonials,
    certificates: Array.isArray(certificates) ? certificates : fallbackCertificates,
    gallery: Array.isArray(gallery) ? gallery : fallbackGallery,
  };
}

export async function getProject(slug: string): Promise<Project | null> {
  const { projects } = await getHomeData();
  const normalizedSlug = slug.toLowerCase();
  return (
    projects.find(
      (project) =>
        project.slug.toLowerCase() === normalizedSlug ||
        project.dedupeKey?.toLowerCase() === normalizedSlug,
    ) ?? null
  );
}

export async function getBlogPost(slug: string) {
  const post = await fetchBackend<BlogPost | null>(
    `/blogs/${encodeURIComponent(slug)}`,
    null,
  );
  return post?.status === "PUBLISHED" ? post : null;
}
