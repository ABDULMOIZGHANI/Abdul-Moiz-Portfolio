import { driveThumb } from "@/lib/video";

export const runtime = "nodejs";

/**
 * Same-origin video thumbnails: fetches the Google Drive preview image once and lets browsers/CDNs
 * cache it for a day. Avoids third-party blocking and gives search engines a thumbnail on our domain.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\w-]{10,100}$/.test(id)) return new Response("Bad id", { status: 400 });
  try {
    const res = await fetch(driveThumb(id), { redirect: "follow", next: { revalidate: 86400 } });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) return new Response("Not found", { status: 404 });
    return new Response(await res.arrayBuffer(), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }
}
