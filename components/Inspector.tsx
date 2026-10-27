"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import site from "@/data/site.json";
import Clock from "./Clock";

/* ---------- shared hover state: Work grid + Layers panel → Inspect panel ---------- */
type Ctx = { hovered: Project | null; inspect: (p: Project | null) => void };
const InspectorCtx = createContext<Ctx>({ hovered: null, inspect: () => {} });
export const useInspector = () => useContext(InspectorCtx);

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Clearing is delayed slightly so moving between cards doesn't flicker back to the profile.
  const inspect = useCallback((p: Project | null) => {
    clearTimeout(timer.current);
    if (p) setHovered(p);
    else timer.current = setTimeout(() => setHovered(null), 450);
  }, []);
  return <InspectorCtx.Provider value={{ hovered, inspect }}>{children}</InspectorCtx.Provider>;
}

/* ---------- right-hand Inspect panel ---------- */
export function InspectorPanel({ projectCount, videoCount }: { projectCount: number; videoCount: number }) {
  const { hovered: p } = useInspector();
  return (
    <aside className="panel rp" aria-label="Inspect">
      <div className="ins-tabs" aria-hidden="true"><span className="on">Design</span><span>Prototype</span><span>Inspect</span></div>
      {p ? (
        <div className="ins" key={p.slug}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="ins-head"><div className="av wide"><img src={p.image} alt="" /></div><div><b>{p.title}</b><span>{p.category}</span></div></div>
          <div className="sec"><h6>Properties</h6>
            <div className="row"><span>Status</span><b className={p.url ? "ok" : ""}>{p.url ? "● Live" : "Concept"}</b></div>
            <div className="row"><span>Category</span><b>{p.filters.includes("product") ? "Product & apps" : "Website"}</b></div>
            <div className="row"><span>Scope</span><b>{p.filters.includes("dev") ? "Design + build" : "Design"}</b></div>
          </div>
          <div className="sec"><h6>Description</h6><p>{p.description}</p></div>
          <div className="sec"><h6>Tags</h6><div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div></div>
          <div className="sec"><h6>Open</h6>
            <a className="xbtn" href={`/work/${p.slug}`}>View case study</a>
            {p.url && <a className="xbtn ghost" href={p.url} target="_blank" rel="noopener">Visit live site ↗</a>}
          </div>
        </div>
      ) : (
        <div className="ins" key="profile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="ins-head"><div className="av"><img src={site.photo} alt="" /></div><div><b>{site.name}</b><span>{site.role}</span></div></div>
          <div className="sec"><h6>Status</h6>
            <div className="row"><span>Availability</span><b className="ok">● Open to work</b></div>
            <div className="row"><span>Location</span><b>{site.location}</b></div>
            <div className="row"><span>Local time</span><b><Clock /> PKT</b></div>
            <div className="row"><span>Currently</span><b>{site.current}</b></div>
          </div>
          <div className="sec"><h6>Experience <em>since 2022</em></h6>
            <div className="row"><span>Years</span><b>4+</b></div>
            <div className="row"><span>Featured products</span><b>{projectCount}</b></div>
            <div className="row"><span>Video edits</span><b>{videoCount}</b></div>
          </div>
          <div className="sec"><h6>Fill</h6>
            <div className="sw"><i style={{ background: "#0c0a09" }} />Ink<span>#0C0A09</span></div>
            <div className="sw"><i style={{ background: "#ff5b14" }} />Signal<span>#FF5B14</span></div>
            <div className="sw"><i style={{ background: "#fafaf9" }} />Paper<span>#FAFAF9</span></div>
          </div>
          <div className="sec"><h6>Stack</h6><div className="tags">{site.stack.map((s) => <span key={s}>{s}</span>)}</div></div>
          <div className="sec"><h6>Export</h6>
            <a className="xbtn" href="/contact">Hire {site.short.split(" ")[0]}</a>
            <a className="xbtn ghost" href={site.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
          </div>
        </div>
      )}
    </aside>
  );
}
