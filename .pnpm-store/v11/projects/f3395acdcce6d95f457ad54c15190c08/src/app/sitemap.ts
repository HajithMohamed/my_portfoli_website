import type { MetadataRoute } from "next";
import { getHomeData } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hzlabs.dev";
  const { projects, blogs } = await getHomeData();
  return [
    "",
    "/projects",
    "/blog",
    ...projects.map((project) => `/projects/${project.slug}`),
    ...blogs.map((post) => `/blog/${post.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
