"use client";
import { useEffect } from "react";

/**
 * Canvas behaviour shared by every page:
 * - the frame in view gets "selected" (handles + live W × H badge),
 * - nav links with a matching data-spy get highlighted,
 * - .rv elements fade in on scroll.
 */
export default function CanvasEffects() {
  useEffect(() => {
    const frames = [...document.querySelectorAll<HTMLElement>(".frame")];
    const spyLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-spy]")];
    const chips = document.querySelector<HTMLElement>(".chips");

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const dim = e.target.querySelector(":scope > .dim");
        const r = e.target.getBoundingClientRect();
        if (dim) dim.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
      }
    });
    frames.forEach((f) => ro.observe(f));

    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const id = "#" + e.target.id;
        frames.forEach((f) => f.classList.toggle("sel", f === e.target));
        spyLinks.forEach((a) => a.classList.toggle("on", a.dataset.spy === id));
        const chip = spyLinks.find((a) => a.dataset.spy === id && a.closest(".chips"));
        if (chip && chips && getComputedStyle(chips).display !== "none") {
          chips.scrollTo({ left: chip.offsetLeft - chips.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
        }
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    frames.forEach((f) => spy.observe(f));

    const reveal = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".rv").forEach((el) => reveal.observe(el));

    return () => { ro.disconnect(); spy.disconnect(); reveal.disconnect(); };
  }, []);
  return null;
}
