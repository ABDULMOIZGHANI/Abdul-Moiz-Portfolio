"use client";
import { useEffect, useState } from "react";

const steps = [
  { x: 66, y: 10, t: "Hi, I'm Abdul 👋" },
  { x: 30, y: 22, t: "I design the interface…" },
  { x: 44, y: 52, t: "…and build it, too." },
  { x: 60, y: 78, t: "The work is just below ↓" },
  { x: 8, y: 66, t: "Or just say hello on WhatsApp" },
];

/** A Figma-style collaborator cursor that wanders the intro frame and says hello. */
export default function MultiCursor() {
  const [i, setI] = useState(0);
  const [text, setText] = useState(steps[0].t);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % steps.length), 3600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Hide the bubble while the cursor travels, then show the new line.
    setVisible(false);
    const t = setTimeout(() => { setText(steps[i].t); setVisible(true); }, 900);
    return () => clearTimeout(t);
  }, [i]);

  return (
    <div className="mcur" style={{ left: `${steps[i].x}%`, top: `${steps[i].y}%` }} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#ff5b14" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      <div className="tag"><span className="nm">Abdul</span><span className="chat" style={{ opacity: visible ? 1 : 0 }}>{text}</span></div>
    </div>
  );
}
