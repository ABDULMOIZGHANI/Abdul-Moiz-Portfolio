"use client";
import { useEffect, useState } from "react";
import site from "@/data/site.json";

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit" });

/** Live local time in Karachi. Renders "--:--" on the server, then the real time after hydration. */
export default function Clock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t}</span>;
}
