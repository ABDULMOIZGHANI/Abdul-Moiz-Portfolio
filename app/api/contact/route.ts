import { NextResponse } from "next/server";
import { db, hasDb } from "@/lib/db";
import { MessageModel } from "@/models";
import { site } from "@/lib/content";

export const runtime = "nodejs";

// Simple per-IP limit: 4 messages per 10 minutes. In-memory is enough for a single cPanel process.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000, LIMIT = 4;
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "company" field.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const budget = clean(body.budget, 60);
  const message = clean(body.message, 5000);

  if (name.length < 2) return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Please add a valid email address." }, { status: 422 });
  if (message.length < 10) return NextResponse.json({ error: "Tell me a little more about the project (10+ characters)." }, { status: 422 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages — please try again in a few minutes." }, { status: 429 });

  const resendKey = process.env.RESEND_API_KEY;
  if (!hasDb && !resendKey) {
    return NextResponse.json({ error: `The form isn't connected yet — please email ${site.email} directly.` }, { status: 503 });
  }

  let saved = false, emailed = false;

  if (hasDb) {
    try {
      await db();
      await MessageModel.create({ name, email, budget, message, ip });
      saved = true;
    } catch (err) {
      console.error("[contact] could not save message", err);
    }
  }

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO || site.email],
          reply_to: email,
          subject: `New project enquiry — ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nBudget: ${budget || "—"}\n\n${message}`,
        }),
      });
      emailed = res.ok;
      if (!res.ok) console.error("[contact] Resend error", res.status, await res.text());
    } catch (err) {
      console.error("[contact] could not send email", err);
    }
  }

  if (!saved && !emailed) {
    return NextResponse.json({ error: `Something went wrong — please email ${site.email} directly.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
