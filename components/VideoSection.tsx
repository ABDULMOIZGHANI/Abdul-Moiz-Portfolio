"use client";
import { useState } from "react";
import type { Video } from "@/lib/types";
import { driveEmbed, thumbPath } from "@/lib/video";
import { PlaySolid } from "./icons";

/** Shows the Drive thumbnail; the heavy Drive player only loads when someone presses Present. */
function Player({ v }: { v: Video }) {
  const [on, setOn] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);
  if (on) {
    return (
      <div className="player">
        <iframe src={driveEmbed(v.driveId)} allow="autoplay; fullscreen" allowFullScreen title={v.title} />
      </div>
    );
  }
  return (
    <button className="player" onClick={() => setOn(true)} aria-label={`Play ${v.title}`}>
      {thumbOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="poster" src={thumbPath(v.driveId)} alt="" loading="lazy" onError={() => setThumbOk(false)} />
      )}
      <span className="ov"><span className="mono">{v.category}</span><span className="pb"><PlaySolid />Present</span><span className="mono">▶ {v.group}</span></span>
    </button>
  );
}

export default function VideoGrid({ videos, tall }: { videos: Video[]; tall?: boolean }) {
  return (
    <div className={`vgrid${tall ? " tall" : ""}`}>
      {videos.map((v) => (
        <article className="vid" key={v.id}>
          <Player v={v} />
          <h3>{v.title}</h3>
          <p>{v.description}</p>
        </article>
      ))}
    </div>
  );
}
