import { absoluteApiUrl } from "./utils";
import {
  fallbackBlogs,
  fallbackCertificates,
  fallbackGallery,
  fallbackGithub,
  fallbackProfile,
  fallbackProjects,
  fallbackResume,
  fallbackSkills,
  fallbackTestimonials,
} from "./fallback-data";
import type {
  BlogPost,
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
  const [profile, skills, projects, blogs, resume, github, testimonials, certificates, gallery] =
    await Promise.all([
      fetchJson<Profile>("/profile", fallbackProfile),
      fetchJson<Skill[]>("/skills", fallbackSkills),
      fetchJson<Project[]>("/projects", fallbackProjects),
      fetchJson<BlogPost[]>("/blogs", fallbackBlogs),
      fetchJson<CvAsset | null>("/resume/latest", fallbackResume),
      fetchJson<GithubSummary>("/github/summary", fallbackGithub),
      fetchJson<Testimonial[]>("/testimonials", fallbackTestimonials),
      fetchJson<Certificate[]>("/certificates", fallbackCertificates),
      fetchJson<MediaAsset[]>("/media?category=gallery", fallbackGallery),
    ]);

  return { profile, skills, projects, blogs, resume, github, testimonials, certificates, gallery };
}

export async function getProject(slug: string) {
  return fetchJson<Project | null>(`/projects/${slug}`, fallbackProjects.find((project) => project.slug === slug) ?? null);
}

export async function getBlogPost(slug: string) {
  return fetchJson<BlogPost | null>(`/blogs/${slug}`, fallbackBlogs.find((post: BlogPost) => post.slug === slug) ?? null);
}

/** Same-origin base for admin calls; proxied to the API so the session cookie is first-party. */
export const BFF_BASE = "/bff";

export function bffUrl(path: string): string {
  return `${BFF_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatBffError(
  status: number,
  bodyText: string,
  responseUrl?: string,
): string {
  const trimmed = bodyText.trim();
  const isHtml = /^<!doctype html|^<html/i.test(trimmed);

  if (
    trimmed.includes("Protected by Vercel Authentication") ||
    responseUrl?.includes("vercel.com/sso-api")
  ) {
    return (
      "Backend deployment is blocked by Vercel Authentication. " +
      "Set NEXT_PUBLIC_API_URL to your backend's public Production domain (e.g. https://<backend-project>.vercel.app) rather than a -git- branch preview URL, then redeploy."
    );
  }

  if (status === 404 && isHtml) {
    return (
      "Backend proxy (/bff) returned 404. " +
      "Verify NEXT_PUBLIC_API_URL is set to your public HTTPS backend origin in Vercel Environment Variables and redeploy the frontend."
    );
  }

  if (trimmed) {
    try {
      const parsed = JSON.parse(trimmed) as {
        message?: string | string[];
        hint?: string;
      };
      const baseMessage = Array.isArray(parsed.message)
        ? parsed.message.join(". ")
        : parsed.message;
      if (baseMessage && parsed.hint) {
        return `${baseMessage} — ${parsed.hint}`;
      }
      if (baseMessage) {
        return baseMessage;
      }
    } catch {
      // Not JSON; handle HTML or plain text below.
    }
  }

  if (isHtml) {
    return `Backend service returned an unexpected HTML response (HTTP ${status}). Verify your backend deployment and DATABASE_URL configuration.`;
  }

  return trimmed || `Backend request failed (HTTP ${status}).`;
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
  const text = await response.text();
  if (!response.ok) {
    throw new Error(formatBffError(response.status, text, response.url));
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (
    contentType.includes("text/html") ||
    /^<!doctype html|^<html/i.test(text.trim())
  ) {
    throw new Error(formatBffError(response.status, text, response.url));
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
