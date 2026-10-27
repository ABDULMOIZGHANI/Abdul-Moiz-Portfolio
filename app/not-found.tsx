import Link from "next/link";
import Toolbar from "@/components/Toolbar";
import Frame from "@/components/Frame";

export default function NotFound() {
  return (
    <>
      <Toolbar active="home" crumb="404" />
      <main className="canvas wide">
        <div className="frames" style={{ maxWidth: 640 }}>
          <Frame id="f-404" label="404 — Missing frame">
            <div className="fin" style={{ textAlign: "center" }}>
              <div className="kicker" style={{ justifyContent: "center" }}><b>404</b> Not found</div>
              <h2>This frame was deleted.</h2>
              <p style={{ color: "var(--ink-2)", margin: "14px 0 24px" }}>The page you were looking for isn&apos;t in this file.</p>
              <Link className="btn pri" href="/">Back to the portfolio</Link>
            </div>
          </Frame>
        </div>
      </main>
    </>
  );
}
