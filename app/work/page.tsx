import type { Metadata } from "next";
import { getProjects, getVideos, site, siteUrl } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import Frame from "@/components/Frame";
import WorkGrid from "@/components/WorkGrid";
import { CtaFrame, ProcessFrame, ServicesFrame } from "@/components/sections";

export const revalidate = 3600;

const title = "UI/UX Design & Web Development Portfolio";
const description = `Selected UI/UX design and web development projects by ${site.short} — product design in Figma and builds in Webflow, WordPress, Shopify and React/MERN.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work" },
  openGraph: { title, description, url: "/work", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const frames = [
  { id: "f-work-intro", label: "Overview" },
  { id: "f-projects", label: "All projects" },
  { id: "f-services", label: "Services" },
  { id: "f-process", label: "Process" },
  { id: "f-cta", label: "Start a project" },
];

const platforms = [
  { k: "Design", v: "Figma · Framer · UX research · Prototyping" },
  { k: "No-code / CMS", v: "Webflow · WordPress · Shopify · Bubble.io" },
  { k: "Code", v: "React · MERN stack · JavaScript" },
  { k: "Growth", v: "Technical SEO · GoHighLevel" },
];

export default async function WorkPage() {
  const [projects, videos] = await Promise.all([getProjects(), getVideos()]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `${siteUrl}/work`,
      author: { "@type": "Person", name: site.name, url: siteUrl },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/work/${p.slug}`,
          name: p.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "UI/UX & Web development", item: `${siteUrl}/work` },
      ],
    },
  ];

  return (
    <SiteShell active="work" frames={frames} projects={projects} counts={{ projects: projects.length, videos: videos.length }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Frame id="f-work-intro" label="Overview — UI/UX & Web">
        <div className="fin">
          <nav className="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">UI/UX &amp; Web development</span></nav>
          <h1 className="page-h1">UI/UX design &amp; web development that ships.</h1>
          <p className="lede">
            {projects.length} projects across real estate, education, healthcare, agencies and SaaS dashboards — designed in Figma and
            built in Webflow, WordPress, Shopify or React. Open any project for the full case study.
          </p>
          <dl className="spec">
            {platforms.map((p) => (<div key={p.k}><dt>{p.k}</dt><dd>{p.v}</dd></div>))}
          </dl>
        </div>
      </Frame>

      <Frame id="f-projects" label={`All projects — ${projects.length}`}>
        <div className="fin">
          <WorkGrid projects={projects} kicker={<><b>{String(projects.length).padStart(2, "0")}</b> Projects</>} title="Selected work." />
        </div>
      </Frame>

      <ServicesFrame number="03" />
      <ProcessFrame number="04" />
      <CtaFrame title="Have a product or website in mind?" text="Tell me what you're building — I'll reply with ideas, a platform recommendation and a timeline." />
    </SiteShell>
  );
}
