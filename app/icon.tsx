import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the "am." wordmark on ink. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0a09", borderRadius: 14, color: "#fafaf9", fontSize: 36, fontWeight: 700, letterSpacing: -2 }}>
        am<span style={{ color: "#ff5b14" }}>.</span>
      </div>
    ),
    size
  );
}
