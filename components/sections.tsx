import { experience, site } from "@/lib/content";
import { clients, faqs, outcomes, process, services } from "@/lib/copy";
import Frame from "./Frame";
import Clock from "./Clock";
import MultiCursor from "./MultiCursor";
import { ContactForm, CopyEmail } from "./Contact";
import SkillBoard from "./SkillBoard";
import { CapIcon, CodeIcon, PenIcon, VideoIcon } from "./icons";

const pad = (n: number) => String(n).padStart(2, "0");
const serviceIcons = { Design: PenIcon, Develop: CodeIcon, Video: VideoIcon } as const;

/* ---------- landing hero ---------- */
export function HeroFrame({ projects, videos }: { projects: number; videos: number }) {
  return (
    <Frame id="f-intro" label="Intro — Desktop">
      <div className="fin">
        <div className="hero-top">
          <span className="pill"><i className="live" />Available for new projects</span>
          <span className="mono">{site.location} · <Clock /> PKT</span>
        </div>
        <h1>
          I design{" "}
          <span className="tsel"><span className="tl">Text · Geist · Medium</span>clear products<i /><i /><i /><i /></span>
          {" "}— and build them end&#8209;to&#8209;end.
        </h1>
        <div className="hero-grid">
          <div>
            <p className="lede">{site.lede}</p>
            <div className="ctas">
              <a className="btn pri" href="/contact">Start a project <span className="kbd">→</span></a>
              <a className="btn" href="/work">See my work</a>
            </div>
            <div className="profile-inline">
              <div><span>Currently</span><b>{site.current}</b></div>
              <div><span>Focus</span><b>UI/UX · Webflow</b></div>
              <div><span>Studied</span><b>BSCS, UBIT</b></div>
            </div>
          </div>
          <figure className="portrait">
            <figcaption className="mono"><span>abdul.png</span><span>Fill · 4:5</span></figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="img"><img src={site.photo} alt={`Portrait of ${site.short}, UI/UX designer and developer`} fetchPriority="high" /></div>
          </figure>
        </div>
        <div className="stats">
          <div><b>4<sup>+</sup></b><span>Years designing &amp; building</span></div>
          <div><b>{pad(projects)}</b><span>Featured products</span></div>
          <div><b>{pad(videos)}</b><span>Video edits</span></div>
          <div><b>{pad(experience.length)}</b><span>Teams worked with</span></div>
        </div>
      </div>
      <MultiCursor />
    </Frame>
  );
}

/* ---------- social proof ---------- */
export function ClientsFrame() {
  return (
    <Frame id="f-clients" label="Brands — Auto layout">
      <div className="fin clients">
        <p className="kicker" style={{ justifyContent: "center" }}>Brands &amp; teams I&apos;ve worked with</p>
        <div className="marquee" aria-label={clients.join(", ")}>
          <div className="track" aria-hidden="true">{[...clients, ...clients].map((c, i) => <span key={i}>{c}</span>)}</div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- why / outcomes ---------- */
export function OutcomesFrame() {
  return (
    <Frame id="f-why" label="Why — Outcomes">
      <div className="fin">
        <div className="fhead rv">
          <div><div className="kicker"><b>01</b> Why work with me</div><h2>Most sites look good <em className="soft">or</em> work well. Yours should do both.</h2></div>
          <p>Designing the experience and understanding the code behind it — a rare combination built through agency, product and freelance work.</p>
        </div>
        <div className="outcomes rv">
          {outcomes.map((o, i) => (
            <div className="outcome" key={o.k}>
              <span className="mono">{pad(i + 1)} · {o.k}</span>
              <h3>{o.t}</h3>
              <p>{o.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- services (Figma component set) ---------- */
export function ServicesFrame({ number = "02", links = true }: { number?: string; links?: boolean }) {
  return (
    <Frame id="f-services" label="Services — Component set">
      <div className="fin">
        <div className="fhead rv">
          <div><div className="kicker"><b>{number}</b> Services</div><h2>One partner, end to end.</h2></div>
          <p>Three crafts, one point of contact — from the first wireframe to the final cut.</p>
        </div>
        <div className="cset rv">
          <span className="cset-l"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l4 4-4 4-4-4zM12 14l4 4-4 4-4-4zM6 8l4 4-4 4-4-4zM18 8l4 4-4 4-4-4z" /></svg>Service</span>
          {services.map(({ type, title, text, tags, href, cta }) => {
            const Icon = serviceIcons[type as keyof typeof serviceIcons];
            return (
              <div className="variant" key={type}>
                <span className="vl">Type={type}</span>
                <div className="ic"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="tags">{tags.map((t) => <span key={t}>{t}</span>)}</div>
                {links && <a className="vlink" href={href}>{cta} →</a>}
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- process (prototype flow) ---------- */
export function ProcessFrame({ number = "05" }: { number?: string }) {
  return (
    <Frame id="f-process" label="Process — Prototype flow">
      <div className="fin">
        <div className="fhead rv">
          <div><div className="kicker"><b>{number}</b> Process</div><h2>From first call to launch.</h2></div>
          <p>A simple, transparent process — you see real designs before anything is built, and you can update the site yourself after launch.</p>
        </div>
        <ol className="flow rv">
          {process.map((s) => (
            <li key={s.n} className="step">
              <span className="mono">Step {s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

/* ---------- experience (version history) ---------- */
export function ExperienceFrame({ number = "06" }: { number?: string }) {
  return (
    <Frame id="f-experience" label="Experience — Version history">
      <div className="fin">
        <div className="fhead rv">
          <div><div className="kicker"><b>{number}</b> Experience</div><h2>Version history.</h2></div>
          <p>Four years of shipped versions across agencies, product teams and freelance work.</p>
        </div>
        <ol className="vh rv">
          {experience.map((e) => (
            <li key={e.company} className={e.current ? "now" : ""}>
              <span className="dot" />
              <span className="when">{e.when}</span>
              <div className="info"><h3>{e.company}</h3><div className="role">{e.role}</div></div>
              {e.current ? <span className="badge">Current version</span> : <span />}
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

/* ---------- about + skills ---------- */
export function AboutFrame({ number = "07" }: { number?: string }) {
  return (
    <Frame id="f-about" label="About">
      <div className="fin">
        <div className="kicker rv"><b>{number}</b> About</div>
        <div className="about">
          <div className="rv">
            <p className="big"><b>Computer Science graduate. Product thinker.</b> Designer who can ship.</p>
            <p className="body">{site.about}</p>
            <div className="edu">
              <div className="ic"><CapIcon /></div>
              <div><b>{site.education.degree}</b><span>{site.education.school} · {site.education.years} · CGPA {site.education.cgpa}</span></div>
            </div>
          </div>
          <SkillBoard skills={site.skills} />
        </div>
      </div>
    </Frame>
  );
}

/* ---------- FAQ (also emitted as FAQPage structured data by the page) ---------- */
export function FAQFrame({ number = "08" }: { number?: string }) {
  return (
    <Frame id="f-faq" label="FAQ — Accordion">
      <div className="fin">
        <div className="fhead rv">
          <div><div className="kicker"><b>{number}</b> FAQ</div><h2>Questions, answered.</h2></div>
          <p>Still unsure? <a className="link" href="/contact">Ask me directly</a> — I usually reply within a day.</p>
        </div>
        <div className="faq rv">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}<span className="pm" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Frame>
  );
}

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

/* ---------- contact (share dialog + form) ---------- */
export function ContactFrame({ number = "09", headingLevel = "h2" }: { number?: string; headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <Frame id="f-contact" label="Contact — Share dialog">
      <div className="fin">
        <div className="cta-h rv">
          <div className="kicker" style={{ justifyContent: "center" }}><b>{number}</b> Let&apos;s build</div>
          <H className="h2">Have an idea? Let&apos;s make it real.</H>
          <p>Tell me about your project — I usually reply within a day.</p>
        </div>
        <div className="share-dlg rv">
          <div className="dh">Share “Your next project”<span>Invite a collaborator</span></div>
          <div className="db">
            <ContactForm />
            <div className="divider">or reach me directly</div>
            <CopyEmail />
            <div className="ways">
              <a className="way" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener"><span className="wi" style={{ background: "#25d366" }}>WA</span><div><b>WhatsApp</b><span>Quick chat · {site.phoneDisplay}</span></div><span className="arr">Chat ↗</span></a>
              <a className="way" href={site.linkedin} target="_blank" rel="noopener"><span className="wi" style={{ background: "#0a66c2" }}>in</span><div><b>LinkedIn</b><span>/in/abdulmoizghani</span></div><span className="arr">View ↗</span></a>
              <a className="way" href={site.dribbble} target="_blank" rel="noopener"><span className="wi" style={{ background: "#ea4c89" }}>Dr</span><div><b>Dribbble</b><span>More shots &amp; explorations</span></div><span className="arr">View ↗</span></a>
            </div>
          </div>
          <div className="df"><span>● Available for new projects</span><span>Karachi · <Clock /> PKT</span></div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- compact CTA band for inner pages ---------- */
export function CtaFrame({ title, text }: { title: string; text: string }) {
  return (
    <Frame id="f-cta" label="CTA — Banner">
      <div className="fin cta-band rv">
        <div><h2>{title}</h2><p>{text}</p></div>
        <div className="ctas">
          <a className="btn pri" href="/contact">Start a project <span className="kbd">→</span></a>
          <a className="btn" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </Frame>
  );
}
