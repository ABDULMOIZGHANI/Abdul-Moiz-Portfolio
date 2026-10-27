import { siExpress, siFigma, siFramer, siJavascript, siMongodb, siNodedotjs, siReact, siShopify, siWebflow, siWordpress } from "simple-icons";

type Brand = { path: string; hex: string; title: string };
type Glyph = { title: string; color: string; d: string }; // stroke icon for skills without an official logo
type Skill = { blurb: string; brands?: Brand[]; glyph?: Glyph };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

// Official logos come from Simple Icons (CC0). Bubble.io and GoHighLevel aren't in that set,
// and Product Design / UX Research aren't brands, so those use neutral line icons instead.
const SKILLS: Record<string, Skill> = {
  "Figma": { blurb: "Interface design", brands: [siFigma] },
  "Webflow": { blurb: "No-code builds", brands: [siWebflow] },
  "MERN Stack": { blurb: "Full-stack apps", brands: [siMongodb, siExpress, siReact, siNodedotjs] },
  "Product Design": { blurb: "Flows & systems", glyph: { title: "Product design", color: "#ff5b14", d: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" } },
  "WordPress": { blurb: "CMS websites", brands: [siWordpress] },
  "React JS": { blurb: "Front-end UI", brands: [siReact] },
  "Shopify": { blurb: "E-commerce", brands: [siShopify] },
  "Bubble.io": { blurb: "No-code web apps", glyph: { title: "Bubble.io", color: "#0205d3", d: "M7 4v13M7 12a5 5 0 1 1 0 .01M18 6.5a1.5 1.5 0 1 0 0-.01" } },
  "Framer": { blurb: "Sites & prototypes", brands: [siFramer] },
  "UX Research": { blurb: "Interviews & testing", glyph: { title: "UX research", color: "#7c3aed", d: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM21 21l-5.6-5.6M8 10.5a2.5 2.5 0 0 1 2.5-2.5" } },
  "GoHighLevel": { blurb: "Funnels & CRM", glyph: { title: "GoHighLevel", color: "#188bf6", d: "M4 20V14M10 20V9M16 20V4M20 8l-4-4-4 4" } },
  "JavaScript": { blurb: "Interactions & logic", brands: [siJavascript] },
};

const notes = ["#fde68a", "#fbcfe8", "#bbf7d0", "#bfdbfe", "#ddd6fe", "#fed7aa"];
const tilt = [-2.2, 1.6, -1.1, 2.1, -1.6, 1, 1.8, -2, 1.3, -0.9, 2.3, -1.4];

function Logo({ b }: { b: Brand }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={b.title} fill={`#${b.hex}`}>
      <title>{b.title}</title>
      <path d={b.path} />
    </svg>
  );
}

/** "FigJam board" of skills: sticky notes, each with the tool's real logo. */
export default function SkillBoard({ skills }: { skills: string[] }) {
  return (
    <div className="board rv">
      <div className="board-bar" aria-hidden="true">
        <span className="board-l">Skills — FigJam board</span>
        <span className="board-tools"><i /><i /><i /></span>
      </div>
      <ul className="notes" aria-label="Skills and tools">
        {skills.map((name, i) => {
          const s = SKILLS[name];
          const multi = (s?.brands?.length ?? 0) > 1;
          return (
            <li key={name} className="note" style={{ background: notes[i % notes.length], ["--r" as string]: `${tilt[i % tilt.length]}deg` }}>
              <span className={`note-ic${multi ? " multi" : ""}`}>
                {s?.brands ? (
                  s.brands.map((b) => <Logo key={b.title} b={b} />)
                ) : s?.glyph ? (
                  <svg viewBox="0 0 24 24" role="img" aria-label={s.glyph.title} style={{ color: s.glyph.color }} {...stroke}>
                    <path d={s.glyph.d} />
                  </svg>
                ) : (
                  <span className="note-initial">{name[0]}</span>
                )}
              </span>
              <b>{name}</b>
              {s && <span className="note-sub">{s.blurb}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
