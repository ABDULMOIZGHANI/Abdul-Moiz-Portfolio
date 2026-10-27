"use client";
import { MoonIcon } from "./icons";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  }
  return (
    <button className="icon" onClick={toggle} aria-label="Toggle dark mode">
      <MoonIcon />
    </button>
  );
}
