import type { MetadataRoute } from "next";
import { getHomeData } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const { projects } = await getHomeData();
  return [
    "",
    "/projects",
    "/about",
    "/certificates",
    ...projects.map((project) => `/projects/${project.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
