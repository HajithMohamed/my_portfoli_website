import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { getPublicGithubMock } = vi.hoisted(() => ({
  getPublicGithubMock: vi.fn(),
}));

vi.mock("./github-public", () => ({
  getPublicGithub: getPublicGithubMock,
}));

import { getAboutData, getHomeData } from "./public-data";
import { getSiteUrl } from "./site-url";
import { absoluteApiUrl } from "./utils";

describe("public-data resilience and About data isolation", () => {
  const originalFetch = globalThis.fetch;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalVercelUrl = process.env.VERCEL_URL;
  const originalVercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.test";
    getPublicGithubMock.mockReset();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
    if (originalVercelUrl === undefined) {
      delete process.env.VERCEL_URL;
    } else {
      process.env.VERCEL_URL = originalVercelUrl;
    }
    if (originalVercelProdUrl === undefined) {
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    } else {
      process.env.VERCEL_PROJECT_PRODUCTION_URL = originalVercelProdUrl;
    }
  });

  it("getAboutData fetches only profile and resume with ISR revalidation and skips GitHub/projects/blogs", async () => {
    const requestedUrls: string[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      requestedUrls.push(url);
      expect((init as { cache?: string } | undefined)?.cache).toBeUndefined();
      expect(
        (init as { next?: { revalidate?: number } } | undefined)?.next
          ?.revalidate,
      ).toBe(60);

      if (url.endsWith("/profile")) {
        return new Response(
          JSON.stringify({
            socialLinks: [{ label: "Custom", url: "https://hzlabs.studio" }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          id: "cv-live",
          title: "Live CV",
          fileUrl: "https://cdn.example.com/cv.pdf",
          version: 2,
          isActive: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const data = await getAboutData();

    expect(requestedUrls).toEqual([
      "http://api.test/profile",
      "http://api.test/resume/latest",
    ]);
    expect(getPublicGithubMock).not.toHaveBeenCalled();
    expect(data.profile.name).toBe("Mohamed Hajith");
    expect(data.resume?.fileUrl).toBe("https://cdn.example.com/cv.pdf");
  });

  it("falls back safely when backend endpoints return HTTP 200 with null JSON", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response("null", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    ) as unknown as typeof fetch;
    getPublicGithubMock.mockResolvedValue(null);

    const about = await getAboutData();
    expect(about.profile.name).toBe("Mohamed Hajith");
    expect(about.resume?.fileUrl).toBeTruthy();

    const home = await getHomeData();
    expect(home.profile.name).toBe("Mohamed Hajith");
    expect(home.projects).toEqual([]);
    expect(home.blogs).toEqual([]);
    expect(home.skills.length).toBeGreaterThan(0);
    expect(home.github.username).toBe("HajithMohamed");
  });

  it("rethrows Next.js DYNAMIC_SERVER_USAGE errors instead of swallowing them", async () => {
    const dynamicError = Object.assign(
      new Error("Dynamic server usage: no-store fetch"),
      { digest: "DYNAMIC_SERVER_USAGE" },
    );

    globalThis.fetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.cache === "no-store") {
        throw dynamicError;
      }
      return new Response("null", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    await expect(getHomeData()).rejects.toMatchObject({
      digest: "DYNAMIC_SERVER_USAGE",
    });
    expect(getPublicGithubMock).not.toHaveBeenCalled();
  });

  it("normalizes empty or protocol-less environment URLs", () => {
    process.env.NEXT_PUBLIC_API_URL = "   ";
    expect(absoluteApiUrl("/profile")).toBe("http://localhost:4000/profile");

    process.env.NEXT_PUBLIC_SITE_URL = "";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "www.hzlabs.studio";
    expect(getSiteUrl()).toBe("https://www.hzlabs.studio");
    expect(() => new URL(getSiteUrl())).not.toThrow();
  });
});

