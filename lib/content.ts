import projectsSeed from "@/data/projects.json";
import videosSeed from "@/data/videos.json";
import experienceData from "@/data/experience.json";
import siteData from "@/data/site.json";
import { db, hasDb } from "@/lib/db";
import { MessageModel, ProjectModel, VideoModel } from "@/models";
import type { Experience, Filter, Message, Project, Video, VideoGroup } from "@/lib/types";

export const site = siteData;
export const experience = experienceData as Experience[];
// Public site address for canonical links, sitemap and social cards. On Vercel, fall back to the
// project's production domain so SEO links never point at localhost when the env var is missing.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || "http://localhost:3000").replace(/\/$/, "");

/* eslint-disable @typescript-eslint/no-explicit-any */
const toProject = (d: any, i = 0): Project => ({
  id: String(d._id ?? d.slug),
  slug: d.slug,
  title: d.title,
  category: d.category ?? "",
  tags: d.tags ?? [],
  filters: (d.filters ?? []) as Filter[],
  image: d.image ?? "",
  url: d.url ?? "",
  description: d.description ?? "",
  content: d.content ?? "",
  order: d.order ?? i,
  published: d.published ?? true,
});

const toVideo = (d: any, i = 0): Video => ({
  id: String(d._id ?? d.driveId),
  group: d.group as VideoGroup,
  title: d.title,
  category: d.category ?? "",
  driveId: d.driveId,
  description: d.description ?? "",
  order: d.order ?? i,
});

/**
 * Public projects. Reads MongoDB when configured; falls back to data/projects.json when
 * there is no database, the database is empty, or it can't be reached — the site never goes blank.
 */
export async function getProjects(): Promise<Project[]> {
  if (hasDb) {
    try {
      await db();
      const docs = await ProjectModel.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean();
      if (docs.length) return docs.map(toProject);
    } catch (err) {
      console.error("[content] projects: database unavailable, using data/projects.json", err);
    }
  }
  return projectsSeed.map(toProject).filter((p) => p.published);
}

export async function getProject(slug: string) {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return { project: all[i], next: all[(i + 1) % all.length], index: i };
}

export async function getVideos(): Promise<Video[]> {
  if (hasDb) {
    try {
      await db();
      const docs = await VideoModel.find().sort({ order: 1, createdAt: 1 }).lean();
      if (docs.length) return docs.map(toVideo);
    } catch (err) {
      console.error("[content] videos: database unavailable, using data/videos.json", err);
    }
  }
  return videosSeed.map(toVideo);
}

/* ---------- admin-only reads (database only, drafts included) ---------- */

export async function adminProjects(): Promise<Project[]> {
  await db();
  return (await ProjectModel.find().sort({ order: 1, createdAt: 1 }).lean()).map(toProject);
}
export async function adminProject(id: string): Promise<Project | null> {
  await db();
  const d = await ProjectModel.findById(id).lean().catch(() => null);
  return d ? toProject(d) : null;
}
export async function adminVideos(): Promise<Video[]> {
  await db();
  return (await VideoModel.find().sort({ order: 1, createdAt: 1 }).lean()).map(toVideo);
}
export async function adminVideo(id: string): Promise<Video | null> {
  await db();
  const d = await VideoModel.findById(id).lean().catch(() => null);
  return d ? toVideo(d) : null;
}
export async function adminMessages(): Promise<Message[]> {
  await db();
  const docs = await MessageModel.find().sort({ createdAt: -1 }).limit(100).lean();
  return docs.map((d: any) => ({
    id: String(d._id),
    name: d.name,
    email: d.email,
    budget: d.budget ?? "",
    message: d.message,
    read: Boolean(d.read),
    createdAt: new Date(d.createdAt).toISOString(),
  }));
}
