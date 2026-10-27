"use client";
import type { Project } from "@/lib/types";
import { useInspector } from "./Inspector";
import { PAGES, type PageKey } from "@/lib/pages";
import { FrameIcon, PageIcon } from "./icons";

export type LayerFrame = { id: string; label: string };

/**
 * Left panel: "Pages" is the site navigation, "Layers" lists the frames on the current page.
 * On the work page, project layers preview in the Inspect panel on hover.
 */
export default function LayersPanel({ active, frames, projects }: { active: PageKey; frames: LayerFrame[]; projects?: Project[] }) {
  const { inspect } = useInspector();
  return (
    <aside className="panel lp" aria-label="Pages and layers">
      <div className="ph">Pages</div>
      <ul className="layers">
        {PAGES.map(({ key, href, label, icon }) => (
          <li key={key}>
            <a href={href} className={key === active ? "on page-on" : ""} aria-current={key === active ? "page" : undefined}><PageIcon name={icon} />{label}</a>
          </li>
        ))}
      </ul>
      <div className="ph" style={{ marginTop: 14 }}>Layers <span>{frames.length} frames</span></div>
      <ul className="layers">
        {frames.map(({ id, label }, i) => (
          <li key={id}>
            <a href={`#${id}`} data-spy={`#${id}`}><FrameIcon />{label}<span className="k">{String(i + 1).padStart(2, "0")}</span></a>
            {projects && id === "f-projects" && (
              <ul className="layers sub" onMouseLeave={() => inspect(null)}>
                {projects.map((p) => (
                  <li key={p.slug}><a href={`/work/${p.slug}`} onMouseEnter={() => inspect(p)} onFocus={() => inspect(p)}>{p.title}</a></li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="lp-foot"><b>Open to new projects</b>Product design, web builds and video — remote, worldwide.<br /><a href="/contact">Start a conversation →</a></div>
    </aside>
  );
}
