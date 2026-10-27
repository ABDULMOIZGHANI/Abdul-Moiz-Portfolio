import { ImageResponse } from "next/og";
import site from "@/data/site.json";

export const alt = `${site.short} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card (LinkedIn, WhatsApp, X…), generated at build time. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0c0a09", color: "#fafaf9", backgroundImage: "radial-gradient(#2f2d2b 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a8a29e" }}>
          <span>abdulmoiz-portfolio.fig</span>
          <span>{site.location}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 700, letterSpacing: -7 }}>
            abdulmoiz<span style={{ color: "#ff5b14" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#d6d3d1", marginTop: 8 }}>{site.role}</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24 }}>
          {["Product design", "Webflow", "React / MERN", "Video"].map((t) => (
            <span key={t} style={{ padding: "10px 20px", borderRadius: 999, border: "2px solid #3a3531", color: "#e7e5e4" }}>{t}</span>
          ))}
        </div>
      </div>
    ),
    size
  );
}
