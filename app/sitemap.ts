import type { MetadataRoute } from "next";
import { getProjects, siteUrl } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/video`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    ...projects.map((p) => ({ url: `${siteUrl}/work/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
