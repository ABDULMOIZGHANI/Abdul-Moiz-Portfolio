import type { Metadata } from "next";
import { getProjects, getVideos, site, siteUrl } from "@/lib/content";
import { VIDEO_GROUPS } from "@/lib/types";
import SiteShell from "@/components/SiteShell";
import Frame from "@/components/Frame";
import VideoGrid from "@/components/VideoSection";
import { driveEmbed, thumbPath } from "@/lib/video";
import { CtaFrame } from "@/components/sections";

export const revalidate = 3600;

const title = "Video Editing Portfolio — AI Films, Ad Edits & Reels";
const description = `Video editing by ${site.short}: AI-generated brand films, product and property ads, and short-form reels for Instagram, TikTok and YouTube Shorts — cut, graded and sound-designed.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/video" },
  openGraph: { title, description, url: "/video", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const groupInfo: Record<string, { id: string; h: string; d: string }> = {
  "AI video": { id: "f-ai", h: "AI video, directed with intent.", d: "AI-generated visuals directed, cut, graded and sound-designed into one continuous mood — from prompt and storyboard to final cut." },
  "Ad films": { id: "f-ads", h: "Ad films, built to sell.", d: "Commercial edits for products and brands — paced for attention, graded for desire, finished for broadcast and social." },
  Reels: { id: "f-reels", h: "Reels, made to loop.", d: "Vertical short-form edits tuned for social — a hook in the first second, beat-matched cuts, and a finish that earns the replay." },
};

export default async function VideoPage() {
  const [projects, videos] = await Promise.all([getProjects(), getVideos()]);
  const groups = VIDEO_GROUPS.map((g) => ({ name: g, ...groupInfo[g], items: videos.filter((v) => v.group === g) })).filter((g) => g.items.length);

  const frames = [{ id: "f-video-intro", label: "Overview" }, ...groups.map((g) => ({ id: g.id, label: g.name })), { id: "f-cta", label: "Start a project" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `${siteUrl}/video`,
      author: { "@type": "Person", name: site.name, url: siteUrl },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: videos.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "VideoObject",
            name: v.title,
            description: v.description || `${v.group} — ${v.category}`,
            thumbnailUrl: `${siteUrl}${thumbPath(v.driveId)}`,
            embedUrl: driveEmbed(v.driveId),
            genre: v.group,
            creator: { "@type": "Person", name: site.name },
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Video editing", item: `${siteUrl}/video` },
      ],
    },
  ];

  return (
    <SiteShell active="video" frames={frames} counts={{ projects: projects.length, videos: videos.length }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Frame id="f-video-intro" label="Overview — Video editing">
        <div className="fin">
          <nav className="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Video editing</span></nav>
          <h1 className="page-h1">Video editing, cut with intent.</h1>
          <p className="lede">
            I direct, generate and edit video across AI films, ad spots and short-form reels — from storyboard and grade to sound and final cut.
          </p>
          <div className="jump">
            {groups.map((g) => (
              <a key={g.id} className="btn" href={`#${g.id}`}>{g.name}<span className="mono" style={{ color: "var(--ink-3)" }}>{String(g.items.length).padStart(2, "0")}</span></a>
            ))}
          </div>
        </div>
      </Frame>

      {groups.map((g, i) => (
        <Frame key={g.id} id={g.id} label={`${g.name} — Prototype`}>
          <div className="fin">
            <div className="fhead rv">
              <div><div className="kicker"><b>{String(i + 1).padStart(2, "0")}</b> {g.name}</div><h2>{g.h}</h2></div>
              <p>{g.d}</p>
            </div>
            <div className="rv"><VideoGrid videos={g.items} tall={g.name === "Reels"} /></div>
          </div>
        </Frame>
      ))}

      <CtaFrame title="Need a video like this?" text="Brand films, ads or a batch of reels — send a brief and I'll come back with ideas and a timeline." />
    </SiteShell>
  );
}
