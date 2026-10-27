import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { site, siteUrl } from "@/lib/content";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", weight: ["400", "500", "600"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["400", "500"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });

const title = `${site.short} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${site.short}` },
  description: site.description,
  applicationName: site.short,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  keywords: ["Abdul Moiz", "Abdul Moiz Ghani", "UI/UX designer", "product designer", "Webflow developer", "WordPress developer", "MERN developer", "Karachi", "Pakistan", "portfolio", "video editor"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.short, title, description: site.description, url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
};

// Runs before paint: applies the saved theme, and on the home page hides the canvas for the intro.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t)d.dataset.theme=t}catch(e){}if(location.pathname==='/'&&!location.hash&&!matchMedia('(prefers-reduced-motion:reduce)').matches)d.classList.add('loading')})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
