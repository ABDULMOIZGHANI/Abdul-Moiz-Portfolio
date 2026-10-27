"use client";
import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/types";
import { driveEmbed, thumbPath } from "@/lib/video";
import { PlaySolid } from "./icons";

/**
 * Shows a poster first; the real player only loads when someone presses Present.
 * Self-hosted videos (v.src) use the native <video> player, Drive videos use Drive's embed.
 */
export function Player({ v, big }: { v: Video; big?: boolean }) {
  const [on, setOn] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (on && v.src) videoRef.current?.play().catch(() => {});
  }, [on, v.src]);

  if (on) {
    return (
      <div className={`player${big ? " big" : ""}${v.pillarbox ? " crop" : ""}`}>
        {v.src ? (
          <video ref={videoRef} controls playsInline preload="auto" poster={v.poster} title={v.title}>
            <source src={v.src} type="video/mp4" />
          </video>
        ) : (
          <iframe src={driveEmbed(v.driveId)} allow="autoplay; fullscreen" allowFullScreen title={v.title} />
        )}
      </div>
    );
  }
  const poster = v.poster || (v.driveId ? thumbPath(v.driveId) : "");
  return (
    <button className={`player${big ? " big" : ""}`} onClick={() => setOn(true)} aria-label={`Play ${v.title}`}>
      {poster && thumbOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="poster" src={poster} alt="" loading={big ? "eager" : "lazy"} onError={() => setThumbOk(false)} />
      )}
      <span className="ov"><span className="mono">{v.category}</span><span className="pb"><PlaySolid />Present</span><span className="mono">▶ {v.group}{v.duration ? ` · ${v.duration.replace(/^PT/, "").toLowerCase()}` : ""}</span></span>
    </button>
  );
}

function Grid({ videos, tall }: { videos: Video[]; tall?: boolean }) {
  return (
    <div className={`vgrid${tall ? " tall" : ""}`}>
      {videos.map((v) => (
        <article className="vid" key={v.id}>
          <Player v={v} />
          <h3>{v.title}</h3>
          <p>{v.description}</p>
          {/* The cropped player hides the edges of Drive's control bar, so offer the full player too. */}
          {v.pillarbox && v.driveId && (
            <a className="vlink" href={`https://drive.google.com/file/d/${v.driveId}/view`} target="_blank" rel="noopener">Open full player ↗</a>
          )}
        </article>
      ))}
    </div>
  );
}

/** Landscape videos in a wide grid, portrait ones in their own row of tall players (so neither gets cropped). */
export default function VideoGrid({ videos, tall }: { videos: Video[]; tall?: boolean }) {
  if (tall) return <Grid videos={videos} tall />;
  const wide = videos.filter((v) => !v.vertical);
  const portrait = videos.filter((v) => v.vertical);
  return (
    <div className="vstack">
      {wide.length > 0 && <Grid videos={wide} />}
      {portrait.length > 0 && <Grid videos={portrait} tall />}
    </div>
  );
}
