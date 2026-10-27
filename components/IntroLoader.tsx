"use client";
import { useEffect, useRef, useState } from "react";

const steps = ["Opening…", "Loading frames…", "Loading components…", "Ready"];

/**
 * "Opening the design file" intro. Only visible while <html> has the `loading` class
 * (set by the boot script on the home page), so it never blocks no-JS visitors or deep links.
 */
export default function IntroLoader() {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("loading")) { setGone(true); return; }

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      clearInterval(timer);
      setP(100);
      setTimeout(() => {
        setDone(true);
        root.classList.remove("loading");
        setTimeout(() => setGone(true), 700);
      }, 250);
    };
    // Timer-driven (not animation frames) so it still finishes in background tabs.
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + 4 + Math.random() * 7);
      setP(progress);
      if (progress >= 100) finish();
    }, 55);
    const safety = setTimeout(finish, 3500);
    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => { clearInterval(timer); clearTimeout(safety); window.removeEventListener("pointerdown", skip); window.removeEventListener("keydown", skip); };
  }, []);

  if (gone) return null;
  return (
    <div id="intro" className={done ? "done" : ""} aria-hidden="true">
      <div className="ofile">
        <div className="othumb">abdulmoiz<span>.</span></div>
        <div className="ometa"><b>abdulmoiz-portfolio.fig</b><span>{steps[Math.min(3, Math.floor(p / 34))]}</span></div>
        <div className="obar"><i style={{ width: `${p}%` }} /></div>
      </div>
    </div>
  );
}
