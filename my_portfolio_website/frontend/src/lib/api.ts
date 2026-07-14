import { absoluteApiUrl } from "./utils";
import {
  fallbackBlogs,
  fallbackGithub,
  fallbackProfile,
  fallbackProjects,
  fallbackResume,
  fallbackSkills,
} from "./fallback-data";
import type { BlogPost, CvAsset, GithubSummary, HomeData, Profile, Project, Skill } from "./types";

async function fetchJson<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(absoluteApiUrl(path), {
      ...init,
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getHomeData(): Promise<HomeData> {
  const [profile, skills, projects, blogs, resume, github] = await Promise.all([
    fetchJson<Profile>("/profile", fallbackProfile),
    fetchJson<Skill[]>("/skills", fallbackSkills),
    fetchJson<Project[]>("/projects", fallbackProjects),
    fetchJson<BlogPost[]>("/blogs", fallbackBlogs),
    fetchJson<CvAsset | null>("/resume/latest", fallbackResume),
    fetchJson<GithubSummary>("/github/summary", fallbackGithub),
  ]);

  return { profile, skills, projects, blogs, resume, github };
}

export async function getProject(slug: string) {
  return fetchJson<Project | null>(`/projects/${slug}`, fallbackProjects.find((project) => project.slug === slug) ?? null);
}

export async function getBlogPost(slug: string) {
  return fetchJson<BlogPost | null>(`/blogs/${slug}`, fallbackBlogs.find((post) => post.slug === slug) ?? null);
}

/** Same-origin base for admin calls; proxied to the API so the session cookie is first-party. */
export const BFF_BASE = "/bff";

export function bffUrl(path: string): string {
  return `${BFF_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Authenticated admin request. Auth rides on the HTTP-only session cookie
 * (credentials: "include") — there is no access token to pass around anymore.
 */
export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(bffUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
