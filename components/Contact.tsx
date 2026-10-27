"use client";
import { useState } from "react";
import site from "@/data/site.json";

type Status = { kind: "idle" | "sending" | "ok" | "err"; text?: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus({ kind: "ok", text: "Thanks — your message is in. I'll reply within a day." });
    } catch (err) {
      setStatus({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

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
        <span className={`form-msg ${status.kind === "ok" ? "ok" : status.kind === "err" ? "err" : ""}`} role="status">{status.text}</span>
        <button className="btn pri" type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Sending…" : "Send invite"}</button>
      </div>
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
