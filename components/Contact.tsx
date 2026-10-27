"use client";
import { useState } from "react";
import site from "@/data/site.json";

type Status = { kind: "idle" | "sending" | "ok" | "err" | "handoff"; text?: string };
type Enquiry = { name: string; email: string; budget: string; message: string; company: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(d: Enquiry) {
  if (d.name.trim().length < 2) return "Please add your name.";
  if (!EMAIL.test(d.email.trim())) return "Please add a valid email address.";
  if (d.message.trim().length < 10) return "Tell me a little more about the project (10+ characters).";
  return "";
}

/** The enquiry as a ready-to-send WhatsApp message to my number, plus an email version as an alternative. */
function handoffLinks(d: Enquiry) {
  const text = [
    "Hi Abdul! 👋 New project enquiry from your portfolio:",
    "",
    `Name: ${d.name.trim()}`,
    `Email: ${d.email.trim()}`,
    d.budget ? `Project type: ${d.budget}` : "",
    "",
    d.message.trim(),
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  return {
    whatsapp: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`,
    email: `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry — ${d.name.trim()}`)}&body=${encodeURIComponent(text)}`,
  };
}

/**
 * Contact form. With a backend (MongoDB and/or Resend) it posts to /api/contact; without one — or if
 * delivery fails — it hands the enquiry to WhatsApp, pre-filled and addressed to my number.
 */
export function ContactForm({ direct }: { direct: boolean }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [links, setLinks] = useState<{ whatsapp: string; email: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as unknown as Enquiry;
    if (d.company) return; // bot filled the honeypot
    const problem = validate(d);
    if (problem) return setStatus({ kind: "err", text: problem });
    const l = handoffLinks(d);
    setLinks(l);

    if (!direct) {
      // Open WhatsApp straight from the click, so pop-up blockers allow it.
      const win = window.open(l.whatsapp, "_blank");
      if (win) win.opener = null;
      setStatus({ kind: "handoff", text: win ? "WhatsApp is open with your message — just press send." : "Tap “Open WhatsApp” below to send your message." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setLinks(null);
      setStatus({ kind: "ok", text: "Thanks — your message is in. I'll reply within a day." });
    } catch {
      setStatus({ kind: "handoff", text: "Couldn't send it from here — send the same message on WhatsApp instead:" });
    }
  }

  const msgClass = status.kind === "ok" || status.kind === "handoff" ? "ok" : status.kind === "err" ? "err" : "";

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="two">
        <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" name="name" className="input" required autoComplete="name" placeholder="Your name" /></div>
        <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" className="input" required autoComplete="email" placeholder="you@company.com" /></div>
      </div>
      <div className="field">
        <label htmlFor="c-budget">Project type</label>
        <select id="c-budget" name="budget" className="input" defaultValue="">
          <option value="">Choose one (optional)</option>
          <option>UI/UX design</option>
          <option>Website build (Webflow / WordPress / Shopify)</option>
          <option>Web app (React / MERN)</option>
          <option>Video editing</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field"><label htmlFor="c-msg">About the project</label><textarea id="c-msg" name="message" className="input" required placeholder="What are you building, and when do you need it?" /></div>
      {/* Honeypot for bots — hidden from people and screen readers */}
      <div className="hp" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-foot">
        <span className={`form-msg ${msgClass}`} role="status">{status.text}</span>
        <button className="btn pri" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : direct ? "Send message" : "Send on WhatsApp"}
        </button>
      </div>
      {status.kind === "handoff" && links && (
        <div className="handoff">
          <a className="btn wa" href={links.whatsapp} target="_blank" rel="noopener">Open WhatsApp</a>
          <a className="btn" href={links.email}>Send by email instead</a>
        </div>
      )}
      {!direct && status.kind === "idle" && (
        <p className="form-note">Your message opens in WhatsApp, ready to send to me — no account needed on this site.</p>
      )}
    </form>
  );
}

export function CopyEmail() {
  const [shown, setShown] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(site.email); } catch {}
    setShown(true);
    setTimeout(() => setShown(false), 1800);
  }
  return (
    <>
      <div className="inv">
        <div className="fieldbox"><a href={`mailto:${site.email}`}>{site.email}</a></div>
        <button type="button" onClick={copy}>Copy email</button>
      </div>
      <div className={`toast${shown ? " show" : ""}`} role="status">Email copied to clipboard</div>
    </>
  );
}
