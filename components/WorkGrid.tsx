"use client";
import { useState } from "react";
import Link from "next/link";
import { FILTERS, type Filter, type Project } from "@/lib/types";
import { useInspector } from "./Inspector";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  projects: Project[];
  kicker: React.ReactNode;
  title: React.ReactNode;
  /** Shown instead of the filters (e.g. a "View all" link on the landing page). */
  aside?: React.ReactNode;
  showFilters?: boolean;
  headingLevel?: "h1" | "h2";
};

export default function WorkGrid({ projects, kicker, title, aside, showFilters = true, headingLevel = "h2" }: Props) {
  const [filter, setFilter] = useState<Filter | "all">("all");
  const { inspect } = useInspector();
  const count = (f: Filter) => projects.filter((p) => p.filters.includes(f)).length;
  const shown = filter === "all" ? projects : projects.filter((p) => p.filters.includes(filter));
  const H = headingLevel;

  return (
    <>
      <div className="fhead rv">
        <div><div className="kicker">{kicker}</div><H className="h2">{title}</H></div>
        {showFilters ? (
          <div className="seg" role="group" aria-label="Filter projects">
            <button className={filter === "all" ? "on" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All<sup>{pad(projects.length)}</sup></button>
            {FILTERS.map((f) => (
              <button key={f.key} className={filter === f.key ? "on" : ""} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}<sup>{pad(count(f.key))}</sup>
              </button>
            ))}
          </div>
        ) : aside}
      </div>
      <div className="work" onMouseLeave={() => inspect(null)}>
        {shown.map((p, i) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="proj rv in" onMouseEnter={() => inspect(p)} onFocus={() => inspect(p)}>
            <div className="pl"><b>AM/{pad(p.order || i + 1)} — {p.title}</b><span className="mono">{p.url ? "Live" : "Concept"}</span></div>
            <div className="shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={p.image} alt={`${p.title} — ${p.category} UI/UX design`} />
              <span className="go">Case study →</span>
            </div>
            <div className="pinfo">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
