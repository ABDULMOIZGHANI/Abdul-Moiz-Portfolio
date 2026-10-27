import { notFound } from "next/navigation";
import { adminProject } from "@/lib/content";
import { ProjectForm } from "../../forms";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = id === "new" ? null : await adminProject(id);
  if (id !== "new" && !p) notFound();
  return (
    <>
      <h1>{p ? `Edit — ${p.title}` : "New project"}</h1>
      <p className="lead">{p ? "Changes go live as soon as you save." : "Add a project to the Selected work grid and give it its own case-study page."}</p>
      <section className="acard"><div className="acard-b"><ProjectForm p={p} /></div></section>
    </>
  );
}
