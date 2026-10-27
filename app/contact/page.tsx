import type { Metadata } from "next";
import { getProjects, getVideos, site, siteUrl } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import { ContactFrame, FAQFrame, faqJsonLd } from "@/components/sections";

export const revalidate = 3600;

const title = "Hire a UI/UX Designer, Web Developer & Video Editor";
const description = `Start a project with ${site.short} — UI/UX design, Webflow/WordPress/Shopify/React development and video editing. Remote, worldwide; replies within a day.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const frames = [{ id: "f-contact", label: "Contact" }, { id: "f-faq", label: "FAQ" }];

export default async function ContactPage() {
  const [projects, videos] = await Promise.all([getProjects(), getVideos()]);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: title,
      url: `${siteUrl}/contact`,
      about: { "@type": "Person", name: site.name, email: `mailto:${site.email}`, url: siteUrl },
    },
    faqJsonLd,
  ];
  return (
    <SiteShell active="contact" frames={frames} counts={{ projects: projects.length, videos: videos.length }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactFrame number="01" headingLevel="h1" />
      <FAQFrame number="02" />
    </SiteShell>
  );
}
