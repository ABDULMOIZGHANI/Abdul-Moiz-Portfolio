import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects, site, siteUrl } from "@/lib/content";
import Toolbar from "@/components/Toolbar";
import Frame from "@/components/Frame";
import CanvasEffects from "@/components/CanvasEffects";
import { ArrowUpRight } from "@/components/icons";

export const revalidate = 3600;
export const dynamicParams = true; // projects added later in the admin get pages on demand

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getProject((await params).slug);
  if (!found) return { title: "Project not found" };
  const { project: p } = found;
  const title = `${p.title} — ${p.category}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { type: "article", title, description: p.description, url: `/work/${p.slug}`, images: p.image ? [{ url: p.image, alt: p.title }] : undefined },
    twitter: { card: "summary_large_image", title, description: p.description, images: p.image ? [p.image] : undefined },
  };
}

export default async function CaseStudy({ params }: Props) {
  const found = await getProject((await params).slug);
  if (!found) notFound();
  const { project: p, next, index } = found;
  const paragraphs = (p.content || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    image: p.image || undefined,
    url: `${siteUrl}/work/${p.slug}`,
    author: { "@type": "Person", name: site.name, url: siteUrl },
    keywords: p.tags.join(", "),
    ...(p.url ? { sameAs: p.url } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Toolbar active="work" crumb={p.title} />
      <main className="canvas wide">
        <div className="frames">
          <Frame id="f-case" label={`AM/${String(index + 1).padStart(2, "0")} — ${p.title}`}>
            <div className="fin">
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link><span>/</span><Link href="/work">UI/UX &amp; Web</Link><span>/</span><span aria-current="page">{p.title}</span>
              </nav>
              <h1 className="cs-title">{p.title}</h1>
              <p className="cs-sub">{p.description}</p>

              <div className="cs-meta">
                <div><span>Category</span><b>{p.category || "—"}</b></div>
                <div><span>Scope</span><b>{p.filters.includes("dev") ? "Design + build" : "Design"}</b></div>
                <div><span>Status</span><b>{p.url ? "Live" : "Concept"}</b></div>
                <div><span>Tools</span><b>{p.tags.join(", ")}</b></div>
              </div>

              {p.image && (
                <div className="cs-shot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={`${p.title} — ${p.category} design`} fetchPriority="high" />
                </div>
              )}

              <div className="cs-body">
                <h2>Overview</h2>
                <div className="text">
                  {paragraphs.length ? paragraphs.map((t, i) => <p key={i}>{t}</p>) : <p>{p.description}</p>}
                  <div className="ctas">
                    {p.url && <a className="btn pri" href={p.url} target="_blank" rel="noopener">Visit live site <ArrowUpRight /></a>}
                    <a className="btn" href="/contact">Start a similar project</a>
                  </div>
                </div>
              </div>

              {next && next.slug !== p.slug && (
                <div className="cs-next">
                  <Link href="/work" className="btn">← All work</Link>
                  <Link href={`/work/${next.slug}`} className="nx">
                    <div><span>Next project</span><b>{next.title}</b></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {next.image && <img src={next.image} alt="" loading="lazy" />}
                  </Link>
                </div>
              )}
            </div>
          </Frame>
        </div>
        <footer className="foot">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <a href="/contact">Hire me →</a>
        </footer>
      </main>
      <CanvasEffects />
    </>
  );
}
