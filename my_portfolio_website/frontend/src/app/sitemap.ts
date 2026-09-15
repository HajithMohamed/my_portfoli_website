import type { MetadataRoute } from "next";
import { getHomeData } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const { projects, blogs } = await getHomeData();
  return [
    "",
    "/projects",
    "/about",
    "/blog",
    ...projects.map((project) => `/projects/${project.slug}`),
    ...blogs.map((post) => `/blog/${post.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
