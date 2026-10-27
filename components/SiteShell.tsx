import type { Project } from "@/lib/types";
import { site } from "@/lib/content";
import { PAGES, type PageKey } from "@/lib/pages";
import Toolbar, { Chips } from "./Toolbar";
import LayersPanel, { type LayerFrame } from "./LayersPanel";
import { InspectorPanel, InspectorProvider } from "./Inspector";
import CanvasEffects from "./CanvasEffects";
import IntroLoader from "./IntroLoader";

type Props = {
  active: PageKey;
  frames: LayerFrame[];
  projects?: Project[];
  counts: { projects: number; videos: number };
  intro?: boolean;
  children: React.ReactNode;
};

/** The design-file workspace every public page sits in: toolbar, Layers, Inspect, canvas, footer. */
export default function SiteShell({ active, frames, projects, counts, intro, children }: Props) {
  return (
    <InspectorProvider>
      {intro && <IntroLoader />}
      <Toolbar active={active} />
      <Chips active={active} />
      <LayersPanel active={active} frames={frames} projects={projects} />
      <InspectorPanel projectCount={counts.projects} videoCount={counts.videos} />
      <main className="canvas">
        <div className="frames">{children}</div>
        <footer className="foot">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <nav className="foot-nav" aria-label="Footer">
            {PAGES.map((p) => <a key={p.key} href={p.href}>{p.label}</a>)}
          </nav>
          <span className="foot-soc">
            <a href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a href={site.dribbble} target="_blank" rel="noopener">Dribbble</a>
          </span>
        </footer>
      </main>
      <CanvasEffects />
    </InspectorProvider>
  );
}
