import { notFound } from "next/navigation";
import { adminVideo } from "@/lib/content";
import { VideoForm } from "../../forms";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = id === "new" ? null : await adminVideo(id);
  if (id !== "new" && !v) notFound();
  return (
    <>
      <h1>{v ? `Edit — ${v.title}` : "New video"}</h1>
      <p className="lead">Videos play from Google Drive and appear in the Video work frame.</p>
      <section className="acard"><div className="acard-b"><VideoForm v={v} /></div></section>
    </>
  );
}
