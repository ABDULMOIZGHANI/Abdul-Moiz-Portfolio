import { getProjects, getVideos, site, siteUrl } from "@/lib/content";
import { VIDEO_GROUPS } from "@/lib/types";
import SiteShell from "@/components/SiteShell";
import Frame from "@/components/Frame";
import WorkGrid from "@/components/WorkGrid";
import VideoGrid from "@/components/VideoSection";
import {
  AboutFrame, ClientsFrame, ContactFrame, ExperienceFrame, FAQFrame, HeroFrame, OutcomesFrame, ProcessFrame, ProductFrame, ServicesFrame, faqJsonLd,
} from "@/components/sections";

// Rebuilt at most once an hour (and immediately after admin edits).
export const revalidate = 3600;

const frames = [
  { id: "f-intro", label: "Intro" },
  { id: "f-why", label: "Why work with me" },
  { id: "f-services", label: "Services" },
  { id: "f-product", label: "FigmaTemplify" },
  { id: "f-work", label: "Selected work" },
  { id: "f-video", label: "Video highlights" },
  { id: "f-process", label: "Process" },
  { id: "f-experience", label: "Experience" },
  { id: "f-about", label: "About" },
  { id: "f-faq", label: "FAQ" },
  { id: "f-contact", label: "Contact" },
];

export default async function Home() {
  const [projects, videos] = await Promise.all([getProjects(), getVideos()]);
  // Funnel teasers: live client work first, and one video from each category.
  const featured = [...projects].sort((a, b) => Number(Boolean(b.url)) - Number(Boolean(a.url))).slice(0, 4);
  const videoPicks = VIDEO_GROUPS.map((g) => videos.find((v) => v.group === g)).filter((v): v is NonNullable<typeof v> => Boolean(v));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: site.name,
      jobTitle: site.role,
      url: siteUrl,
      image: site.photo,
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "University of Karachi" },
      knowsAbout: site.skills,
      sameAs: [site.linkedin, site.dribbble],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: `${site.short} — UI/UX Design, Web Development & Video Editing`,
      url: siteUrl,
      image: site.photo,
      founder: { "@id": `${siteUrl}/#person` },
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
      serviceType: ["UI/UX design", "Product design", "Web development", "Webflow development", "WordPress development", "Shopify development", "Video editing"],
    },
    faqJsonLd,
  ];

  return (
    <SiteShell active="home" frames={frames} counts={{ projects: projects.length, videos: videos.length }} intro>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroFrame projects={projects.length} videos={videos.length} />
      <ClientsFrame />
      <OutcomesFrame />
      <ServicesFrame number="02" />
      <ProductFrame />

      <Frame id="f-work" label="Selected work — Highlights">
        <div className="fin">
          <WorkGrid
            projects={featured}
            showFilters={false}
            kicker={<><b>03</b> Selected work</>}
            title="Built to be remembered."
            aside={<a className="btn" href="/work">All {projects.length} projects →</a>}
          />
          <div className="more rv"><a className="btn pri" href="/work">Explore UI/UX &amp; web development work →</a></div>
        </div>
      </Frame>

      <Frame id="f-video" label="Video work — Highlights">
        <div className="fin">
          <div className="fhead rv">
            <div><div className="kicker"><b>04</b> Video editing</div><h2>Edited with intent.</h2></div>
            <a className="btn" href="/video">All {videos.length} videos →</a>
          </div>
          <div className="rv"><VideoGrid videos={videoPicks} /></div>
          <div className="more rv"><a className="btn pri" href="/video">Watch the full video portfolio →</a></div>
        </div>
      </Frame>

      <ProcessFrame number="05" />
      <ExperienceFrame number="06" />
      <AboutFrame number="07" />
      <FAQFrame number="08" />
      <ContactFrame number="09" />
    </SiteShell>
  );
}
