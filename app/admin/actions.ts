"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { MessageModel, ProjectModel, VideoModel } from "@/models";
import { VIDEO_GROUPS, type VideoGroup } from "@/lib/types";

/* ---------- auth ---------- */
export async function login(_prev: { error?: string } | null, form: FormData) {
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "That password isn't right." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
  await db();
}

/** Rebuild the public pages that show this content. */
function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/work/${slug}`);
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

/* ---------- projects ---------- */
export async function saveProject(form: FormData) {
  await guard();
  const id = str(form, "id");
  const title = str(form, "title");
  if (!title) throw new Error("Title is required");
  const data = {
    title,
    slug: slugify(str(form, "slug") || title),
    category: str(form, "category"),
    tags: list(str(form, "tags")),
    filters: form.getAll("filters").map(String).filter((f) => ["web", "product", "dev"].includes(f)),
    image: str(form, "image"),
    url: str(form, "url"),
    description: str(form, "description"),
    content: str(form, "content"),
    order: Number(str(form, "order")) || 0,
    published: form.get("published") === "on",
  };
  let oldSlug: string | undefined;
  if (id) {
    const prev = await ProjectModel.findByIdAndUpdate(id, data, { runValidators: true });
    oldSlug = prev?.slug;
  } else {
    await ProjectModel.create(data);
  }
  refresh(data.slug);
  if (oldSlug && oldSlug !== data.slug) revalidatePath(`/work/${oldSlug}`);
  redirect("/admin?saved=project");
}

export async function deleteProject(form: FormData) {
  await guard();
  const doc = await ProjectModel.findByIdAndDelete(str(form, "id"));
  refresh(doc?.slug);
  redirect("/admin?deleted=project");
}

/* ---------- videos ---------- */
/** Accepts a bare Drive file id or any Drive share link. */
function driveId(input: string) {
  const m = input.match(/\/d\/([\w-]{10,})/) || input.match(/[?&]id=([\w-]{10,})/);
  return m ? m[1] : input;
}

export async function saveVideo(form: FormData) {
  await guard();
  const id = str(form, "id");
  const group = str(form, "group") as VideoGroup;
  const data = {
    group: VIDEO_GROUPS.includes(group) ? group : "AI video",
    title: str(form, "title"),
    category: str(form, "category"),
    driveId: str(form, "driveId") ? driveId(str(form, "driveId")) : "",
    src: str(form, "src"),
    poster: str(form, "poster"),
    featured: form.get("featured") === "on",
    duration: str(form, "duration"),
    uploadDate: str(form, "uploadDate"),
    description: str(form, "description"),
    order: Number(str(form, "order")) || 0,
  };
  if (!data.title || (!data.driveId && !data.src)) throw new Error("Title and a Drive link or video file URL are required");
  // Only one featured film at a time.
  if (data.featured) await VideoModel.updateMany(id ? { _id: { $ne: id } } : {}, { featured: false });
  if (id) await VideoModel.findByIdAndUpdate(id, data, { runValidators: true });
  else await VideoModel.create(data);
  refresh();
  redirect("/admin?saved=video");
}

export async function deleteVideo(form: FormData) {
  await guard();
  await VideoModel.findByIdAndDelete(str(form, "id"));
  refresh();
  redirect("/admin?deleted=video");
}

/* ---------- messages ---------- */
export async function toggleRead(form: FormData) {
  await guard();
  await MessageModel.findByIdAndUpdate(str(form, "id"), { read: str(form, "read") === "1" });
  revalidatePath("/admin");
}

export async function deleteMessage(form: FormData) {
  await guard();
  await MessageModel.findByIdAndDelete(str(form, "id"));
  revalidatePath("/admin");
}
