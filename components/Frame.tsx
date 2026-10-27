import { FrameIcon } from "./icons";

/** A design-file frame: label above, selection handles + live size badge (driven by CanvasEffects). */
export default function Frame({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section className="frame" id={id} aria-label={label}>
      <div className="flabel" aria-hidden="true"><FrameIcon />{label}</div>
      {children}
      <span className="h tl" aria-hidden="true" />
      <span className="h tr" aria-hidden="true" />
      <span className="h bl" aria-hidden="true" />
      <span className="h br" aria-hidden="true" />
      <span className="dim" aria-hidden="true" />
    </section>
  );
}
