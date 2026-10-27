import site from "@/data/site.json";
import { PAGES, type PageKey } from "@/lib/pages";
import ThemeToggle from "./ThemeToggle";
import { PageIcon } from "./icons";

export { PAGES, type PageKey };

/** Figma-style top bar. The centre tools are the page navigation. */
export default function Toolbar({ active, crumb }: { active: PageKey; crumb?: string }) {
  const current = PAGES.find((p) => p.key === active)!;
  return (
    <header className="tb">
      <div className="tb-l">
        <a className="wm" href="/" aria-label={`${site.short} — home`}>abdulmoiz<span>.</span></a>
        <span className="sep" />
        <span className="crumb">Portfolio / <b>{crumb ?? current.label}</b></span>
      </div>
      <nav className="tb-c tools" aria-label="Pages">
        {PAGES.map(({ key, href, label, icon }) => (
          <a key={key} href={href} data-tip={label} aria-label={label} className={key === active ? "on" : ""} aria-current={key === active ? "page" : undefined}>
            <PageIcon name={icon} />
          </a>
        ))}
      </nav>
      <div className="tb-r">
        <div className="avs" title={`${site.short} and you are viewing this file`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.photo} alt="" />
          <span className="you">You</span>
        </div>
        <ThemeToggle />
        <span className="zoom mono">100%</span>
        <a className="share" href="/contact">Hire me</a>
      </div>
    </header>
  );
}

/** Mobile/tablet page bar (replaces the Layers panel on smaller screens). */
export function Chips({ active }: { active: PageKey }) {
  return (
    <nav className="chips" aria-label="Pages">
      {PAGES.map(({ key, href, label }) => (
        <a key={key} href={href} className={key === active ? "on" : ""} aria-current={key === active ? "page" : undefined}>{label}</a>
      ))}
    </nav>
  );
}
